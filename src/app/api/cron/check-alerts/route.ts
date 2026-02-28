import { NextRequest, NextResponse } from 'next/server';
import { isSupabaseConfigured, getSupabaseServer } from '@/lib/supabase';
import { getProvider } from '@/lib/streaming/provider-factory';
import { sendPushNotification, isPushConfigured } from '@/lib/streaming-finder/web-push';

// GET /api/cron/check-alerts — Daily cron job to check alert availability
export async function GET(request: NextRequest) {
    // Verify cron secret
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!isSupabaseConfigured()) {
        return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 });
    }

    try {
        const supabase = getSupabaseServer();
        const provider = getProvider();

        // Fetch all active alerts
        const { data: alerts, error } = await supabase
            .from('sf_alerts')
            .select('*')
            .eq('is_active', true);

        if (error) throw error;
        if (!alerts || alerts.length === 0) {
            return NextResponse.json({ checked: 0, triggered: 0 });
        }

        // Group alerts by (titleId, titleType, region) to minimize TMDB calls
        const groups = new Map<string, typeof alerts>();
        for (const alert of alerts) {
            const key = `${alert.title_id}:${alert.title_type}:${alert.region}`;
            const group = groups.get(key) ?? [];
            group.push(alert);
            groups.set(key, group);
        }

        let triggered = 0;
        const pushEnabled = isPushConfigured();

        // Process in batches of 30 to respect TMDB rate limits (~40 req/10s)
        const entries = Array.from(groups.entries());
        for (let i = 0; i < entries.length; i += 30) {
            const batch = entries.slice(i, i + 30);

            const results = await Promise.allSettled(
                batch.map(async ([, groupAlerts]) => {
                    const first = groupAlerts[0];
                    const availability = await provider.getAvailability(
                        first.title_id,
                        first.title_type as 'movie' | 'tv',
                        first.region
                    );

                    const flatrateIds = new Set(
                        availability.flatrate.map((p) => p.providerId)
                    );

                    for (const alert of groupAlerts) {
                        const subscribedIds: number[] = alert.subscribed_provider_ids ?? [];
                        const matchedId = subscribedIds.find((id) => flatrateIds.has(id));

                        if (matchedId !== undefined) {
                            // Match found — update alert
                            await supabase
                                .from('sf_alerts')
                                .update({
                                    is_active: false,
                                    matched_provider_id: matchedId,
                                    matched_at: new Date().toISOString(),
                                })
                                .eq('id', alert.id);

                            triggered++;

                            // Send push notification
                            if (pushEnabled && alert.push_subscription) {
                                const matchedProvider = availability.flatrate.find(
                                    (p) => p.providerId === matchedId
                                );
                                await sendPushNotification(alert.push_subscription, {
                                    title: 'Streaming Finder',
                                    body: `${alert.title_name} is now available on ${matchedProvider?.providerName ?? 'your service'}!`,
                                    icon: alert.poster_path || '/icons/sf-192.png',
                                    url: `/apps/streaming-finder/title/${alert.title_id}?type=${alert.title_type}`,
                                });
                            }
                        }
                    }
                })
            );

            // Log any failures
            for (const result of results) {
                if (result.status === 'rejected') {
                    console.error('Alert check failed:', result.reason);
                }
            }

            // Rate limit: wait 10 seconds between batches
            if (i + 30 < entries.length) {
                await new Promise((resolve) => setTimeout(resolve, 10000));
            }
        }

        return NextResponse.json({
            checked: alerts.length,
            triggered,
            groups: groups.size,
        });
    } catch (err) {
        console.error('Cron check-alerts error:', err);
        return NextResponse.json({ error: 'Cron job failed' }, { status: 500 });
    }
}

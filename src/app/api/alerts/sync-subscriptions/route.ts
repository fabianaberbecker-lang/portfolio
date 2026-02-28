import { NextRequest, NextResponse } from 'next/server';
import { isSupabaseConfigured, getSupabaseServer } from '@/lib/supabase';

// PUT /api/alerts/sync-subscriptions — Update subscribed provider IDs on all active alerts for a device
export async function PUT(request: NextRequest) {
    if (!isSupabaseConfigured()) {
        return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 });
    }

    try {
        const body = await request.json();
        const { deviceId, subscribedProviderIds } = body;

        if (!deviceId || !Array.isArray(subscribedProviderIds)) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const supabase = getSupabaseServer();
        const { error } = await supabase
            .from('sf_alerts')
            .update({ subscribed_provider_ids: subscribedProviderIds })
            .eq('device_id', deviceId)
            .eq('is_active', true);

        if (error) throw error;
        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('Sync subscriptions error:', err);
        return NextResponse.json({ error: 'Failed to sync' }, { status: 500 });
    }
}

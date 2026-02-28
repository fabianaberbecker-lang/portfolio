import { NextRequest, NextResponse } from 'next/server';
import { isSupabaseConfigured, getSupabaseServer } from '@/lib/supabase';

// GET /api/alerts?deviceId=xxx — List alerts for a device
export async function GET(request: NextRequest) {
    if (!isSupabaseConfigured()) {
        return NextResponse.json({ alerts: [] });
    }

    const { searchParams } = new URL(request.url);
    const deviceId = searchParams.get('deviceId');

    if (!deviceId) {
        return NextResponse.json({ error: 'Missing deviceId' }, { status: 400 });
    }

    try {
        const supabase = getSupabaseServer();
        const { data, error } = await supabase
            .from('sf_alerts')
            .select('*')
            .eq('device_id', deviceId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return NextResponse.json({ alerts: data ?? [] });
    } catch (err) {
        console.error('Fetch alerts error:', err);
        return NextResponse.json({ error: 'Failed to fetch alerts' }, { status: 500 });
    }
}

// POST /api/alerts — Create an alert
export async function POST(request: NextRequest) {
    if (!isSupabaseConfigured()) {
        return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 });
    }

    try {
        const body = await request.json();
        const {
            deviceId,
            titleId,
            titleType,
            titleName,
            posterPath,
            region,
            subscribedProviderIds,
            pushSubscription,
        } = body;

        if (!deviceId || !titleId || !titleType || !titleName) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const supabase = getSupabaseServer();
        const { data, error } = await supabase
            .from('sf_alerts')
            .upsert(
                {
                    device_id: deviceId,
                    title_id: titleId,
                    title_type: titleType,
                    title_name: titleName,
                    poster_path: posterPath,
                    region: region || 'DE',
                    subscribed_provider_ids: subscribedProviderIds || [],
                    push_subscription: pushSubscription,
                    is_active: true,
                    matched_provider_id: null,
                    matched_at: null,
                },
                { onConflict: 'device_id,title_id,title_type' }
            )
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json({ alert: data });
    } catch (err) {
        console.error('Create alert error:', err);
        return NextResponse.json({ error: 'Failed to create alert' }, { status: 500 });
    }
}

// DELETE /api/alerts?deviceId=xxx&titleId=123&titleType=movie — Remove alert
export async function DELETE(request: NextRequest) {
    if (!isSupabaseConfigured()) {
        return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 });
    }

    const { searchParams } = new URL(request.url);
    const deviceId = searchParams.get('deviceId');
    const titleId = searchParams.get('titleId');
    const titleType = searchParams.get('titleType');

    if (!deviceId || !titleId || !titleType) {
        return NextResponse.json({ error: 'Missing required params' }, { status: 400 });
    }

    try {
        const supabase = getSupabaseServer();
        const { error } = await supabase
            .from('sf_alerts')
            .delete()
            .eq('device_id', deviceId)
            .eq('title_id', Number(titleId))
            .eq('title_type', titleType);

        if (error) throw error;
        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('Delete alert error:', err);
        return NextResponse.json({ error: 'Failed to delete alert' }, { status: 500 });
    }
}

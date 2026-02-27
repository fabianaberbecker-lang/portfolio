import { NextRequest, NextResponse } from 'next/server';
import { isSupabaseConfigured, getSupabaseServer } from '@/lib/barmatch/supabase';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 });
  }

  try {
    const supabase = getSupabaseServer();

    const { data: session, error: sessionError } = await supabase
      .from('barmatch_sessions')
      .select('*')
      .eq('code', code)
      .single();

    if (sessionError || !session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    const { data: members } = await supabase
      .from('barmatch_members')
      .select('*')
      .eq('session_id', session.id)
      .order('joined_at', { ascending: true });

    return NextResponse.json({
      session: {
        id: session.id,
        code: session.code,
        hostName: session.host_name,
        lat: session.lat,
        lng: session.lng,
        radiusM: session.radius_m,
        filters: session.filters,
        barIds: session.bar_ids,
        status: session.status,
        createdAt: session.created_at,
        expiresAt: session.expires_at,
      },
      members: (members ?? []).map((m) => ({
        id: m.id,
        sessionId: m.session_id,
        name: m.name,
        isHost: m.is_host,
        joinedAt: m.joined_at,
      })),
    });
  } catch (err) {
    console.error('Session get error:', err);
    return NextResponse.json({ error: 'Failed to get session.' }, { status: 500 });
  }
}

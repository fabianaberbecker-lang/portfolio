import { NextRequest, NextResponse } from 'next/server';
import { isSupabaseConfigured, getSupabaseServer } from '@/lib/barmatch/supabase';
import { generateSessionCode } from '@/lib/barmatch/utils';

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: 'Supabase not configured. Multi-user sessions unavailable.' },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const { hostName, lat, lng, radiusM, filters } = body;

    if (!hostName || lat == null || lng == null) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = getSupabaseServer();
    const code = generateSessionCode();

    // Create session
    const { data: session, error: sessionError } = await supabase
      .from('barmatch_sessions')
      .insert({
        code,
        host_name: hostName,
        lat,
        lng,
        radius_m: radiusM ?? 1000,
        filters: filters ?? {},
        status: 'lobby',
      })
      .select()
      .single();

    if (sessionError) throw sessionError;

    // Add host as member
    const { data: member, error: memberError } = await supabase
      .from('barmatch_members')
      .insert({
        session_id: session.id,
        name: hostName,
        is_host: true,
      })
      .select()
      .single();

    if (memberError) throw memberError;

    return NextResponse.json({
      code: session.code,
      sessionId: session.id,
      memberId: member.id,
    });
  } catch (err) {
    console.error('Session create error:', err);
    return NextResponse.json(
      { error: 'Failed to create session.' },
      { status: 500 }
    );
  }
}

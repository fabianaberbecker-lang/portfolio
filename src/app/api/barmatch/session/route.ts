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
    const { hostName, lat, lng, radiusM, filters, avatar } = body;

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

    // Add host as member (retry without avatar if column doesn't exist yet)
    let member;
    const memberInsert = {
      session_id: session.id,
      name: hostName,
      is_host: true,
      ...(avatar ? { avatar } : {}),
    };
    const { data: m1, error: e1 } = await supabase
      .from('barmatch_members')
      .insert(memberInsert)
      .select()
      .single();

    if (e1 && e1.code === 'PGRST204') {
      // avatar column doesn't exist yet — retry without it
      const { data: m2, error: e2 } = await supabase
        .from('barmatch_members')
        .insert({ session_id: session.id, name: hostName, is_host: true })
        .select()
        .single();
      if (e2) throw e2;
      member = m2;
    } else if (e1) {
      throw e1;
    } else {
      member = m1;
    }

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

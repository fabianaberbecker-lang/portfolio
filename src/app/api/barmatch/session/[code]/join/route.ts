import { NextRequest, NextResponse } from 'next/server';
import { isSupabaseConfigured, getSupabaseServer } from '@/lib/barmatch/supabase';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 });
  }

  try {
    const body = await request.json();
    const { name, avatar } = body;

    if (!name?.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const supabase = getSupabaseServer();

    // Find session
    const { data: session, error: sessionError } = await supabase
      .from('barmatch_sessions')
      .select('id, status')
      .eq('code', code)
      .single();

    if (sessionError || !session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    if (session.status === 'completed') {
      return NextResponse.json({ error: 'Session has ended' }, { status: 410 });
    }

    // Add member (retry without avatar if column doesn't exist yet)
    const memberInsert = {
      session_id: session.id,
      name: name.trim(),
      is_host: false,
      ...(avatar ? { avatar } : {}),
    };
    let member;
    const { data: m1, error: e1 } = await supabase
      .from('barmatch_members')
      .insert(memberInsert)
      .select()
      .single();

    if (e1 && e1.code === 'PGRST204') {
      const { data: m2, error: e2 } = await supabase
        .from('barmatch_members')
        .insert({ session_id: session.id, name: name.trim(), is_host: false })
        .select()
        .single();
      if (e2) {
        if (e2.code === '23505') {
          return NextResponse.json({ error: 'Name already taken in this session' }, { status: 409 });
        }
        throw e2;
      }
      member = m2;
    } else if (e1) {
      if (e1.code === '23505') {
        return NextResponse.json({ error: 'Name already taken in this session' }, { status: 409 });
      }
      throw e1;
    } else {
      member = m1;
    }

    return NextResponse.json({ memberId: member!.id });
  } catch (err) {
    console.error('Session join error:', err);
    return NextResponse.json({ error: 'Failed to join session.' }, { status: 500 });
  }
}

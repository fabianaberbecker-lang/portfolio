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
    const { name } = body;

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

    // Add member
    const { data: member, error: memberError } = await supabase
      .from('barmatch_members')
      .insert({
        session_id: session.id,
        name: name.trim(),
        is_host: false,
      })
      .select()
      .single();

    if (memberError) {
      if (memberError.code === '23505') {
        return NextResponse.json({ error: 'Name already taken in this session' }, { status: 409 });
      }
      throw memberError;
    }

    return NextResponse.json({ memberId: member.id });
  } catch (err) {
    console.error('Session join error:', err);
    return NextResponse.json({ error: 'Failed to join session.' }, { status: 500 });
  }
}

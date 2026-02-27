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
    const { memberId, barId, vote } = body;

    if (!memberId || !barId || typeof vote !== 'boolean') {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = getSupabaseServer();

    // Verify session exists and is active
    const { data: session } = await supabase
      .from('barmatch_sessions')
      .select('id')
      .eq('code', code)
      .eq('status', 'swiping')
      .single();

    if (!session) {
      return NextResponse.json({ error: 'Session not found or not active' }, { status: 404 });
    }

    // Upsert vote
    const { error: voteError } = await supabase
      .from('barmatch_votes')
      .upsert(
        {
          session_id: session.id,
          member_id: memberId,
          bar_id: barId,
          vote,
        },
        { onConflict: 'session_id,member_id,bar_id' }
      );

    if (voteError) throw voteError;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Vote error:', err);
    return NextResponse.json({ error: 'Failed to submit vote.' }, { status: 500 });
  }
}

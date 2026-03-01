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
    const { memberId, barId } = body;

    if (!memberId || !barId) {
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

    // Delete the vote
    const { error: deleteError } = await supabase
      .from('barmatch_votes')
      .delete()
      .eq('session_id', session.id)
      .eq('member_id', memberId)
      .eq('bar_id', barId);

    if (deleteError) throw deleteError;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Vote undo error:', err);
    return NextResponse.json({ error: 'Failed to undo vote.' }, { status: 500 });
  }
}

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

    // Get session
    const { data: session } = await supabase
      .from('barmatch_sessions')
      .select('id')
      .eq('code', code)
      .single();

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    // Get total member count
    const { count: totalMembers } = await supabase
      .from('barmatch_members')
      .select('*', { count: 'exact', head: true })
      .eq('session_id', session.id);

    // Find bars where all members voted "like"
    const { data: matchRows } = await supabase
      .rpc('barmatch_find_matches', {
        p_session_id: session.id,
        p_member_count: totalMembers ?? 0,
      });

    // If RPC not available, do it client-side
    let matchedBarIds: string[] = [];

    if (matchRows && matchRows.length > 0) {
      matchedBarIds = matchRows.map((r: { bar_id: string }) => r.bar_id);
    } else {
      // Fallback: query votes and compute matches in JS
      const { data: votes } = await supabase
        .from('barmatch_votes')
        .select('bar_id, member_id, vote')
        .eq('session_id', session.id)
        .eq('vote', true);

      if (votes && totalMembers && totalMembers > 0) {
        const likeCounts: Record<string, Set<string>> = {};
        for (const v of votes) {
          if (!likeCounts[v.bar_id]) likeCounts[v.bar_id] = new Set();
          likeCounts[v.bar_id].add(v.member_id);
        }
        matchedBarIds = Object.entries(likeCounts)
          .filter(([, members]) => members.size >= totalMembers)
          .map(([barId]) => barId);
      }
    }

    return NextResponse.json({
      matches: matchedBarIds,
      totalMembers: totalMembers ?? 0,
    });
  } catch (err) {
    console.error('Match check error:', err);
    return NextResponse.json({ error: 'Failed to check matches.' }, { status: 500 });
  }
}

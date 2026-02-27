import { NextRequest, NextResponse } from 'next/server';
import { isSupabaseConfigured, getSupabaseServer } from '@/lib/barmatch/supabase';
import { getBarProvider } from '@/lib/barmatch/provider-factory';

export async function POST(
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
    const { data: session, error: sessionError } = await supabase
      .from('barmatch_sessions')
      .select('*')
      .eq('code', code)
      .single();

    if (sessionError || !session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    if (session.status !== 'lobby') {
      return NextResponse.json({ error: 'Session already started' }, { status: 400 });
    }

    // Fetch nearby bars
    const provider = getBarProvider();
    const bars = await provider.nearbyBars({
      lat: session.lat,
      lng: session.lng,
      radiusM: session.radius_m,
      types: session.filters?.types,
    });

    if (bars.length === 0) {
      return NextResponse.json({ error: 'No bars found nearby. Try a larger radius.' }, { status: 404 });
    }

    const barIds = bars.map((b) => b.id);

    // Update session
    const { error: updateError } = await supabase
      .from('barmatch_sessions')
      .update({ status: 'swiping', bar_ids: barIds })
      .eq('id', session.id);

    if (updateError) throw updateError;

    return NextResponse.json({ bars, barIds });
  } catch (err) {
    console.error('Session start error:', err);
    return NextResponse.json({ error: 'Failed to start session.' }, { status: 500 });
  }
}

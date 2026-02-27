import { NextRequest, NextResponse } from 'next/server';
import { getBarProvider, getMockProvider } from '@/lib/barmatch/provider-factory';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = parseFloat(searchParams.get('lat') ?? '');
  const lng = parseFloat(searchParams.get('lng') ?? '');
  const radiusM = parseInt(searchParams.get('radiusM') ?? '1000', 10);
  const typesParam = searchParams.get('types');

  if (isNaN(lat) || isNaN(lng)) {
    return NextResponse.json({ error: 'Missing lat/lng' }, { status: 400 });
  }

  const params = { lat, lng, radiusM, types: typesParam ? typesParam.split(',') : undefined };

  try {
    const provider = getBarProvider();
    const bars = await provider.nearbyBars(params);
    if (bars.length > 0) {
      return NextResponse.json({ bars });
    }
    // No results from primary provider — fall back to mock data
    const mockBars = await getMockProvider().nearbyBars(params);
    return NextResponse.json({ bars: mockBars });
  } catch (err) {
    console.error('Nearby bars error:', err);
    // Fall back to mock data on provider failure
    try {
      const mockBars = await getMockProvider().nearbyBars(params);
      return NextResponse.json({ bars: mockBars });
    } catch {
      return NextResponse.json(
        { error: 'Failed to fetch nearby bars.' },
        { status: 500 }
      );
    }
  }
}

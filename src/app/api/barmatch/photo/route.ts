import { NextRequest, NextResponse } from 'next/server';

const API_BASE = 'https://places.googleapis.com/v1';

/**
 * Proxies Google Places photo requests so the API key stays server-side.
 * Usage: /api/barmatch/photo?ref=places/xxx/photos/xxx
 */
export async function GET(request: NextRequest) {
  const ref = request.nextUrl.searchParams.get('ref');
  if (!ref) {
    return NextResponse.json({ error: 'Missing ref parameter' }, { status: 400 });
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Google Places not configured' }, { status: 503 });
  }

  try {
    const url = `${API_BASE}/${ref}/media?maxHeightPx=400&maxWidthPx=400&key=${apiKey}`;
    const res = await fetch(url, { next: { revalidate: 86400 } });

    if (!res.ok) {
      return NextResponse.json({ error: 'Photo not found' }, { status: 404 });
    }

    const contentType = res.headers.get('content-type') ?? 'image/jpeg';
    const buffer = await res.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch photo' }, { status: 500 });
  }
}

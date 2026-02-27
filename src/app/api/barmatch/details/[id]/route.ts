import { NextRequest, NextResponse } from 'next/server';
import { getBarProvider } from '@/lib/barmatch/provider-factory';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: 'Missing bar id' }, { status: 400 });
  }

  try {
    const provider = getBarProvider();
    const details = await provider.barDetails(decodeURIComponent(id));
    return NextResponse.json(details);
  } catch (err) {
    console.error('Bar details error:', err);
    return NextResponse.json(
      { error: 'Failed to fetch bar details.' },
      { status: 500 }
    );
  }
}

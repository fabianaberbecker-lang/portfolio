import { NextRequest, NextResponse } from 'next/server';
import { getProvider } from '@/lib/streaming/provider-factory';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const type = (searchParams.get('type') as 'movie' | 'tv') || 'movie';
    const numId = parseInt(id, 10);

    if (isNaN(numId)) {
        return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    try {
        const provider = getProvider();
        const details = await provider.getTitleDetails(numId, type);
        return NextResponse.json(details);
    } catch (err) {
        console.error('Title detail error:', err);
        return NextResponse.json(
            { error: 'Failed to load title details.' },
            { status: 500 }
        );
    }
}

import { NextRequest, NextResponse } from 'next/server';
import { getProvider } from '@/lib/streaming/provider-factory';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');
    const type = searchParams.get('type') as 'movie' | 'tv' | null;

    if (!q || !q.trim()) {
        return NextResponse.json(
            { error: 'Missing query parameter "q"' },
            { status: 400 }
        );
    }

    try {
        const provider = getProvider();
        const results = await provider.searchTitles(
            q,
            type || undefined
        );
        return NextResponse.json({ results });
    } catch (err) {
        console.error('Search error:', err);
        return NextResponse.json(
            { error: 'Failed to search. Please try again later.' },
            { status: 500 }
        );
    }
}

import { NextResponse } from 'next/server';
import { getProvider } from '@/lib/streaming/provider-factory';

export async function GET() {
    try {
        const provider = getProvider();
        const trending = await provider.getTrending('week');
        return NextResponse.json(trending);
    } catch (error) {
        console.error('Trending error:', error);
        return NextResponse.json(
            { error: 'Failed to load trending data' },
            { status: 500 }
        );
    }
}

import { NextRequest, NextResponse } from 'next/server';
import { getProvider } from '@/lib/streaming/provider-factory';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const region = searchParams.get('region') || 'DE';

    try {
        const provider = getProvider();
        const providers = await provider.getProviderList(region);
        return NextResponse.json({ providers });
    } catch (err) {
        console.error('Provider list error:', err);
        return NextResponse.json({ error: 'Failed to fetch providers' }, { status: 500 });
    }
}

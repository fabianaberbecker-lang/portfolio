import { NextResponse } from 'next/server';

// GET /api/push/vapid-key — Return the public VAPID key for push subscriptions
export async function GET() {
    const publicKey = process.env.VAPID_PUBLIC_KEY;

    if (!publicKey) {
        return NextResponse.json({ publicKey: null });
    }

    return NextResponse.json({ publicKey });
}

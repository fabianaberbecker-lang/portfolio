import webpush from 'web-push';

const vapidSubject = process.env.VAPID_SUBJECT || 'mailto:hello@example.com';
const vapidPublicKey = process.env.VAPID_PUBLIC_KEY || '';
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY || '';

let configured = false;

function ensureConfigured() {
    if (configured) return true;
    if (!vapidPublicKey || !vapidPrivateKey) return false;
    webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);
    configured = true;
    return true;
}

export function isPushConfigured(): boolean {
    return Boolean(vapidPublicKey && vapidPrivateKey);
}

export async function sendPushNotification(
    subscription: webpush.PushSubscription,
    payload: { title: string; body: string; icon?: string; url?: string }
): Promise<boolean> {
    if (!ensureConfigured()) return false;

    try {
        await webpush.sendNotification(subscription, JSON.stringify(payload));
        return true;
    } catch (err: unknown) {
        const statusCode = (err as { statusCode?: number }).statusCode;
        if (statusCode === 410 || statusCode === 404) {
            // Subscription expired or invalid
            return false;
        }
        console.error('Push notification error:', err);
        return false;
    }
}

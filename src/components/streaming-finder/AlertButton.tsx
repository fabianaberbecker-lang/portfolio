'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useSubscriptions } from '@/lib/streaming-finder/SubscriptionContext';
import { getDeviceId } from '@/lib/streaming-finder/device-id';

interface AlertButtonProps {
    titleId: number;
    titleType: 'movie' | 'tv';
    titleName: string;
    posterPath: string | null;
    region: string;
}

function BellIcon({ filled }: { filled: boolean }) {
    if (filled) {
        return (
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
            </svg>
        );
    }
    return (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
    );
}

export function AlertButton({ titleId, titleType, titleName, posterPath, region }: AlertButtonProps) {
    const { t } = useLanguage();
    const dt = t.streamingFinder.detail;
    const { providerIds } = useSubscriptions();

    const [alertState, setAlertState] = useState<'none' | 'active' | 'matched'>('none');
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState<string | null>(null);

    // Check if alert exists for this title
    useEffect(() => {
        const deviceId = getDeviceId();
        fetch(`/api/alerts?deviceId=${deviceId}`)
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => {
                if (!data?.alerts) return;
                const alert = data.alerts.find(
                    (a: { title_id: number; title_type: string }) =>
                        a.title_id === titleId && a.title_type === titleType
                );
                if (alert) {
                    setAlertState(alert.matched_at ? 'matched' : 'active');
                }
            })
            .catch(() => {});
    }, [titleId, titleType]);

    const showToast = useCallback((msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
    }, []);

    const handleToggle = async () => {
        if (providerIds.length === 0) {
            showToast(dt.needServices);
            return;
        }

        setLoading(true);
        const deviceId = getDeviceId();

        try {
            if (alertState === 'active') {
                // Remove alert
                await fetch(
                    `/api/alerts?deviceId=${deviceId}&titleId=${titleId}&titleType=${titleType}`,
                    { method: 'DELETE' }
                );
                setAlertState('none');
                showToast(dt.alertRemoved);
            } else {
                // Try to get push subscription
                let pushSubscription = null;
                if ('serviceWorker' in navigator && 'PushManager' in window) {
                    try {
                        const reg = await navigator.serviceWorker.ready;
                        const existing = await reg.pushManager.getSubscription();
                        if (existing) {
                            pushSubscription = existing.toJSON();
                        } else {
                            // Try to subscribe
                            const res = await fetch('/api/push/vapid-key');
                            if (res.ok) {
                                const { publicKey } = await res.json();
                                if (publicKey) {
                                    const perm = await Notification.requestPermission();
                                    if (perm === 'granted') {
                                        const sub = await reg.pushManager.subscribe({
                                            userVisibleOnly: true,
                                            applicationServerKey: publicKey,
                                        });
                                        pushSubscription = sub.toJSON();
                                    }
                                }
                            }
                        }
                    } catch {
                        // Push not available, continue without it
                    }
                }

                // Create alert
                await fetch('/api/alerts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        deviceId,
                        titleId,
                        titleType,
                        titleName,
                        posterPath,
                        region,
                        subscribedProviderIds: providerIds,
                        pushSubscription,
                    }),
                });
                setAlertState('active');
                showToast(dt.alertCreated);
            }
        } catch {
            showToast('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const stateConfig = {
        none: {
            label: dt.notifyMe,
            className: 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white',
        },
        active: {
            label: dt.alertActive,
            className: 'border-[#e63946]/30 bg-[#e63946]/10 text-[#e63946]',
        },
        matched: {
            label: dt.nowAvailable,
            className: 'border-green-500/30 bg-green-500/10 text-green-400',
        },
    };

    const config = stateConfig[alertState];

    return (
        <div className="relative">
            <button
                onClick={handleToggle}
                disabled={loading || alertState === 'matched'}
                className={`cursor-pointer inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all ${config.className} disabled:opacity-50`}
            >
                <BellIcon filled={alertState !== 'none'} />
                {config.label}
                {alertState === 'active' && (
                    <span className="h-2 w-2 rounded-full bg-[#e63946] animate-pulse" />
                )}
            </button>

            {/* Toast notification */}
            {toast && (
                <div className="absolute top-full left-0 mt-2 z-50 rounded-lg border border-white/10 bg-[#181818] px-4 py-2 text-xs text-white/80 shadow-xl whitespace-nowrap">
                    {toast}
                </div>
            )}
        </div>
    );
}

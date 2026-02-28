'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { getDeviceId } from '@/lib/streaming-finder/device-id';

interface Alert {
    id: string;
    title_id: number;
    title_type: string;
    title_name: string;
    poster_path: string | null;
    is_active: boolean;
    matched_at: string | null;
    matched_provider_id: number | null;
}

function BellIcon() {
    return (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
    );
}

export function NotificationBadge() {
    const { t } = useLanguage();
    const at = t.streamingFinder.alerts;
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const deviceId = getDeviceId();
        if (!deviceId) return;
        fetch(`/api/alerts?deviceId=${deviceId}`)
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => {
                if (data?.alerts) setAlerts(data.alerts);
            })
            .catch(() => {});
    }, []);

    // Close on click outside
    useEffect(() => {
        if (!open) return;
        function handleClick(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [open]);

    const matchedCount = alerts.filter((a) => a.matched_at).length;
    const activeCount = alerts.filter((a) => a.is_active).length;
    const totalCount = matchedCount + activeCount;

    if (totalCount === 0) return null;

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setOpen(!open)}
                className="relative flex items-center justify-center rounded-full border border-white/10 bg-white/5 p-2 text-white/50 transition-all hover:bg-white/10 hover:text-white/80 cursor-pointer"
                title={at.title}
            >
                <BellIcon />
                {matchedCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-green-500 px-1 text-[10px] font-bold text-white">
                        {matchedCount}
                    </span>
                )}
                {matchedCount === 0 && totalCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#e63946] px-1 text-[10px] font-bold text-white">
                        {totalCount}
                    </span>
                )}
            </button>

            {open && (
                <div className="absolute right-0 top-full mt-2 z-50 w-72 rounded-xl border border-white/10 bg-[#141414] shadow-2xl shadow-black/80">
                    <div className="border-b border-white/5 px-4 py-3">
                        <h3 className="text-sm font-bold text-white/90 lowercase tracking-tight">{at.title}</h3>
                        <p className="text-[11px] text-white/40">{at.subtitle}</p>
                    </div>

                    <div className="max-h-64 overflow-y-auto">
                        {alerts.length === 0 && (
                            <p className="px-4 py-6 text-center text-xs text-white/30">{at.noAlerts}</p>
                        )}
                        {alerts.map((alert) => (
                            <Link
                                key={alert.id}
                                href={`/apps/streaming-finder/title/${alert.title_id}?type=${alert.title_type}`}
                                onClick={() => setOpen(false)}
                                className="flex items-center gap-3 border-b border-white/5 px-4 py-3 transition-colors hover:bg-white/5 last:border-b-0"
                            >
                                {alert.poster_path && (
                                    <Image
                                        src={alert.poster_path}
                                        alt=""
                                        width={32}
                                        height={48}
                                        className="rounded-md object-cover"
                                        unoptimized
                                    />
                                )}
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs font-medium text-white/80 line-clamp-1">
                                        {alert.title_name}
                                    </p>
                                    <p className={`text-[10px] font-medium ${
                                        alert.matched_at
                                            ? 'text-green-400'
                                            : 'text-white/30'
                                    }`}>
                                        {alert.matched_at ? at.matched : at.active}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

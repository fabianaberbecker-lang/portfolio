'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useSubscriptions } from '@/lib/streaming-finder/SubscriptionContext';
import type { WatchProvider } from '@/lib/streaming/types';

const REGIONS = [
    { code: 'DE', label: '🇩🇪 Germany' },
    { code: 'US', label: '🇺🇸 USA' },
    { code: 'GB', label: '🇬🇧 UK' },
    { code: 'FR', label: '🇫🇷 France' },
    { code: 'AT', label: '🇦🇹 Austria' },
    { code: 'CH', label: '🇨🇭 Switzerland' },
];

function CheckIcon() {
    return (
        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
    );
}

function SearchIcon() {
    return (
        <svg className="h-4 w-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
    );
}

export default function ServicesPage() {
    const { t } = useLanguage();
    const st = t.streamingFinder.services;
    const { region, providerIds, setRegion, toggleProvider, clearAll } = useSubscriptions();

    const [providers, setProviders] = useState<WatchProvider[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        setLoading(true);
        fetch(`/api/providers?region=${region}`)
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => setProviders(data?.providers ?? []))
            .catch(() => setProviders([]))
            .finally(() => setLoading(false));
    }, [region]);

    const filtered = useMemo(() => {
        if (!search.trim()) return providers;
        const q = search.toLowerCase();
        return providers.filter((p) => p.providerName.toLowerCase().includes(q));
    }, [providers, search]);

    // Sort: subscribed first, then by display priority
    const sorted = useMemo(() => {
        return [...filtered].sort((a, b) => {
            const aSubscribed = providerIds.includes(a.providerId) ? 0 : 1;
            const bSubscribed = providerIds.includes(b.providerId) ? 0 : 1;
            if (aSubscribed !== bSubscribed) return aSubscribed - bSubscribed;
            return a.displayPriority - b.displayPriority;
        });
    }, [filtered, providerIds]);

    return (
        <div className="theme-cinema min-h-screen bg-[#0a0a0a] text-white">
            <section className="py-8 sm:py-10">
                <div className="mx-auto max-w-2xl px-5">
                    {/* Header */}
                    <div className="mb-6">
                        <Link
                            href="/apps/streaming-finder/search"
                            className="mb-3 inline-flex items-center gap-1 text-sm text-white/40 hover:text-white/70"
                        >
                            ← back
                        </Link>
                        <h1 className="text-2xl font-black lowercase tracking-tight sm:text-3xl">
                            {st.title}
                        </h1>
                        <p className="mt-1 text-sm text-white/40">{st.subtitle}</p>
                    </div>

                    {/* Region + Search + Clear row */}
                    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                        <select
                            value={region}
                            onChange={(e) => setRegion(e.target.value)}
                            className="cursor-pointer rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white outline-none focus:border-[#e63946] appearance-none"
                        >
                            {REGIONS.map((r) => (
                                <option key={r.code} value={r.code} className="bg-[#181818] text-white">
                                    {r.label}
                                </option>
                            ))}
                        </select>

                        <div className="flex flex-1 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2">
                            <SearchIcon />
                            <input
                                type="text"
                                placeholder={st.searchPlaceholder}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/30"
                            />
                        </div>

                        {providerIds.length > 0 && (
                            <button
                                onClick={clearAll}
                                className="cursor-pointer text-xs text-white/30 hover:text-white/60 whitespace-nowrap"
                            >
                                {st.clearAll}
                            </button>
                        )}
                    </div>

                    {/* Selected count */}
                    {providerIds.length > 0 && (
                        <p className="mb-4 text-xs text-[#e63946]">
                            {providerIds.length} {st.selected}
                        </p>
                    )}

                    {/* Loading skeleton */}
                    {loading && (
                        <div className="grid grid-cols-3 gap-3">
                            {Array.from({ length: 12 }).map((_, i) => (
                                <div key={i} className="flex flex-col items-center gap-2 rounded-xl border border-white/5 bg-white/[0.03] p-4">
                                    <div className="h-12 w-12 rounded-lg bg-white/[0.05] animate-pulse" />
                                    <div className="h-3 w-16 rounded bg-white/[0.05] animate-pulse" />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Provider grid */}
                    {!loading && sorted.length === 0 && (
                        <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-10 text-center">
                            <p className="text-sm text-white/40">{st.noProviders}</p>
                        </div>
                    )}

                    {!loading && sorted.length > 0 && (
                        <div className="grid grid-cols-3 gap-3">
                            {sorted.map((provider) => {
                                const selected = providerIds.includes(provider.providerId);
                                return (
                                    <button
                                        key={provider.providerId}
                                        onClick={() => toggleProvider(provider.providerId)}
                                        className={`cursor-pointer relative flex flex-col items-center gap-2 rounded-xl border p-4 transition-all ${
                                            selected
                                                ? 'border-[#e63946]/40 bg-[#e63946]/10'
                                                : 'border-white/5 bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/10'
                                        }`}
                                    >
                                        {selected && (
                                            <span className="absolute top-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#e63946] text-white">
                                                <CheckIcon />
                                            </span>
                                        )}
                                        <Image
                                            src={provider.logoPath}
                                            alt={provider.providerName}
                                            width={48}
                                            height={48}
                                            className="rounded-lg"
                                            unoptimized
                                        />
                                        <span className="text-[11px] font-medium text-white/70 line-clamp-2 text-center leading-tight">
                                            {provider.providerName}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {/* Done button */}
                    <div className="mt-8 text-center">
                        <Link
                            href="/apps/streaming-finder/search"
                            className="inline-flex items-center justify-center rounded-full bg-[#e63946] px-8 py-3 text-sm font-bold text-white transition-all hover:bg-[#d62f3c] active:scale-95"
                        >
                            {st.done}
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

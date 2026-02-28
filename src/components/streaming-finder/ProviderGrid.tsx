'use client';

import Image from 'next/image';
import type { WatchProvider } from '@/lib/streaming/types';

function CheckBadge() {
    return (
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#e63946] text-white shadow-lg shadow-[#e63946]/30" aria-label="Subscribed">
            <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
        </span>
    );
}

interface ProviderGridProps {
    providers: WatchProvider[];
    tmdbLink?: string;
    noProvidersText: string;
    subscribedIds?: number[];
}

export function ProviderGrid({ providers, tmdbLink, noProvidersText, subscribedIds = [] }: ProviderGridProps) {
    if (providers.length === 0) {
        return (
            <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-8 text-center">
                <p className="text-sm text-white/40">{noProvidersText}</p>
            </div>
        );
    }

    // Sort: subscribed first, then by display priority
    const sorted = [...providers].sort((a, b) => {
        const aSubscribed = subscribedIds.includes(a.providerId) ? 0 : 1;
        const bSubscribed = subscribedIds.includes(b.providerId) ? 0 : 1;
        if (aSubscribed !== bSubscribed) return aSubscribed - bSubscribed;
        return a.displayPriority - b.displayPriority;
    });

    return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {sorted.map((provider) => {
                const isSubscribed = subscribedIds.includes(provider.providerId);
                return (
                    <a
                        key={provider.providerId}
                        href={tmdbLink || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`group relative flex items-center gap-3 rounded-xl border p-4 transition-all hover:scale-[1.02] ${
                            isSubscribed
                                ? 'border-[#e63946]/30 bg-[#e63946]/5 hover:bg-[#e63946]/10 hover:border-[#e63946]/40 shadow-sm shadow-[#e63946]/5'
                                : 'border-white/5 bg-white/[0.03] hover:bg-white/[0.08] hover:border-white/10'
                        }`}
                    >
                        <div className="relative shrink-0">
                            <Image
                                src={provider.logoPath}
                                alt={provider.providerName}
                                width={44}
                                height={44}
                                className="rounded-lg"
                                unoptimized
                            />
                            {isSubscribed && <CheckBadge />}
                        </div>
                        <span className={`text-sm font-medium line-clamp-2 ${
                            isSubscribed ? 'text-white/90' : 'text-white/80'
                        }`}>
                            {provider.providerName}
                        </span>
                    </a>
                );
            })}
        </div>
    );
}

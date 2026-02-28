'use client';

import Image from 'next/image';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import type { Availability } from '@/lib/streaming/types';

interface BestOptionProps {
    availability: Availability;
    subscribedIds: number[];
    tmdbLink?: string;
}

export function BestOption({ availability, subscribedIds, tmdbLink }: BestOptionProps) {
    const { t } = useLanguage();
    const dt = t.streamingFinder.detail;

    // Don't show if user has subscribed flatrate providers for this title
    const hasSubscribedFlatrate = availability.flatrate.some((p) =>
        subscribedIds.includes(p.providerId)
    );
    if (hasSubscribedFlatrate) return null;

    // Find best rent option (lowest displayPriority = most popular)
    const sortedRent = [...availability.rent].sort((a, b) => a.displayPriority - b.displayPriority);
    const sortedBuy = [...availability.buy].sort((a, b) => a.displayPriority - b.displayPriority);

    const bestRent = sortedRent[0] ?? null;
    const bestBuy = sortedBuy[0] ?? null;

    // Nothing to show
    if (!bestRent && !bestBuy) return null;

    const best = bestRent || bestBuy;
    const label = bestRent ? dt.bestRental : dt.bestPurchase;

    return (
        <div className="mt-8 rounded-2xl border border-[#e63946]/20 bg-gradient-to-r from-[#e63946]/5 to-transparent p-5">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#e63946]/70">
                {dt.notOnYourServices}
            </p>
            <h3 className="mb-4 text-sm font-bold text-white/90 lowercase tracking-tight">
                {dt.bestOptionTitle}
            </h3>

            <div className="flex items-center gap-4">
                {best && (
                    <a
                        href={tmdbLink || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.05] p-3 transition-all hover:bg-white/[0.08]"
                    >
                        <Image
                            src={best.logoPath}
                            alt={best.providerName}
                            width={40}
                            height={40}
                            className="rounded-lg"
                            unoptimized
                        />
                        <div>
                            <p className="text-sm font-medium text-white/90">{best.providerName}</p>
                            <p className="text-xs text-white/40">{label} · {dt.priceUnknown}</p>
                        </div>
                    </a>
                )}

                {/* Additional options count */}
                {(sortedRent.length > 1 || sortedBuy.length > 0) && tmdbLink && (
                    <a
                        href={tmdbLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#e63946] hover:underline"
                    >
                        {dt.comparePrices}
                    </a>
                )}
            </div>

            <p className="mt-3 text-xs text-white/30">
                {dt.orSetAlert}
            </p>
        </div>
    );
}

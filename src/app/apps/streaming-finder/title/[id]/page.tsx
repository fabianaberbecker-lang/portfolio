'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Badge } from '@/components/ui/Badge';
import { Tabs } from '@/components/ui/Tabs';
import { DetailSkeleton } from '@/components/ui/Skeleton';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { StickerPlay } from '@/components/decorative/StickerPlay';
import type { TitleDetails, Availability, WatchProvider } from '@/lib/streaming/types';
import { use } from 'react';

interface PageProps {
    params: Promise<{ id: string }>;
}

const REGIONS = [
    { code: 'DE', label: '🇩🇪 Germany' },
    { code: 'US', label: '🇺🇸 USA' },
    { code: 'GB', label: '🇬🇧 UK' },
    { code: 'FR', label: '🇫🇷 France' },
    { code: 'AT', label: '🇦🇹 Austria' },
    { code: 'CH', label: '🇨🇭 Switzerland' },
];

function StarIcon() {
    return (
        <svg className="inline h-3 w-3 -mt-0.5" viewBox="0 0 20 20" fill="#ffcb30" aria-hidden="true">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
    );
}

function ErrorIcon() {
    return (
        <svg className="mx-auto h-12 w-12" viewBox="0 0 48 48" fill="none" aria-hidden="true">
            <circle cx="24" cy="24" r="20" fill="#e63946" fillOpacity="0.15" stroke="#e63946" strokeWidth="3" />
            <path d="M17 17l14 14M31 17L17 31" stroke="#e63946" strokeWidth="3" strokeLinecap="round" />
        </svg>
    );
}

function ProviderGrid({ providers, tmdbLink, noProvidersText }: { providers: WatchProvider[]; tmdbLink?: string; noProvidersText: string }) {
    if (providers.length === 0) {
        return (
            <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-8 text-center">
                <p className="text-sm text-white/40">{noProvidersText}</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {providers
                .sort((a, b) => a.displayPriority - b.displayPriority)
                .map((provider) => (
                    <a
                        key={provider.providerId}
                        href={tmdbLink || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-4 transition-all hover:bg-white/[0.08] hover:border-white/10 hover:scale-[1.02]"
                    >
                        <Image
                            src={provider.logoPath}
                            alt={provider.providerName}
                            width={44}
                            height={44}
                            className="rounded-lg"
                            unoptimized
                        />
                        <span className="text-sm font-medium text-white/80 line-clamp-2">
                            {provider.providerName}
                        </span>
                    </a>
                ))}
        </div>
    );
}

export default function TitleDetailPage({ params }: PageProps) {
    const { id } = use(params);
    const searchParams = useSearchParams();
    const { t } = useLanguage();
    const dt = t.streamingFinder.detail;
    const type = (searchParams.get('type') as 'movie' | 'tv') || 'movie';

    const [details, setDetails] = useState<TitleDetails | null>(null);
    const [availability, setAvailability] = useState<Availability | null>(null);
    const [region, setRegion] = useState('DE');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            setError(null);
            try {
                const [detailRes, providerRes] = await Promise.all([
                    fetch(`/api/title/${id}?type=${type}`),
                    fetch(`/api/title/${id}/providers?type=${type}&region=${region}`),
                ]);
                if (!detailRes.ok || !providerRes.ok) throw new Error('Failed');
                setDetails(await detailRes.json());
                setAvailability(await providerRes.json());
            } catch {
                setError('Failed to load title details.');
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [id, type, region]);

    if (loading) {
        return (
            <div className="theme-cinema min-h-screen bg-[#0a0a0a] text-white py-10">
                <div className="mx-auto max-w-4xl px-6 lg:px-10">
                    <DetailSkeleton variant="cinema" />
                </div>
            </div>
        );
    }

    if (error || !details) {
        return (
            <div className="theme-cinema min-h-screen bg-[#0a0a0a] text-white py-20">
                <div className="mx-auto max-w-md px-6 text-center">
                    <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-10">
                        <ErrorIcon />
                        <p className="mt-4 font-bold text-white">{dt.couldNotLoad}</p>
                        <p className="mt-2 text-sm text-red-400">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 cursor-pointer text-sm font-medium text-[#e63946] hover:underline"
                        >
                            {t.streamingFinder.search.retry}
                        </button>
                    </div>
                    <Link
                        href="/apps/streaming-finder/search"
                        className="mt-6 inline-block text-sm text-white/40 hover:text-white/70"
                    >
                        {dt.backToSearch}
                    </Link>
                </div>
            </div>
        );
    }

    const tabs = [
        {
            id: 'flatrate',
            label: dt.streaming,
            count: availability?.flatrate.length ?? 0,
            content: <ProviderGrid providers={availability?.flatrate ?? []} tmdbLink={availability?.link} noProvidersText={dt.noProviders} />,
        },
        {
            id: 'rent',
            label: dt.rent,
            count: availability?.rent.length ?? 0,
            content: <ProviderGrid providers={availability?.rent ?? []} tmdbLink={availability?.link} noProvidersText={dt.noProviders} />,
        },
        {
            id: 'buy',
            label: dt.buy,
            count: availability?.buy.length ?? 0,
            content: <ProviderGrid providers={availability?.buy ?? []} tmdbLink={availability?.link} noProvidersText={dt.noProviders} />,
        },
    ];

    return (
        <div className="theme-cinema min-h-screen bg-[#0a0a0a] text-white">
            {details.backdropPath && (
                <div className="relative h-[40vh] w-full overflow-hidden sm:h-[50vh]">
                    <Image src={details.backdropPath} alt="" fill className="object-cover object-top" priority />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/80 to-transparent" />
                </div>
            )}

            <section className={`${details.backdropPath ? '-mt-32 relative z-10' : 'pt-10'} pb-16`}>
                <div className="mx-auto max-w-4xl px-6 lg:px-10">
                    <Link
                        href="/apps/streaming-finder/search"
                        className="mb-6 inline-flex items-center gap-1 text-sm text-white/40 hover:text-white/70"
                    >
                        {dt.backToSearch}
                    </Link>

                    <div className="flex flex-col gap-8 sm:flex-row">
                        <div className="relative h-80 w-56 shrink-0 overflow-hidden rounded-2xl shadow-2xl shadow-black/50">
                            {details.posterPath ? (
                                <Image src={details.posterPath} alt={details.title} fill className="object-cover" sizes="224px" priority />
                            ) : (
                                <div className="flex h-full items-center justify-center bg-white/5">
                                    <StickerPlay size={64} color="rgba(255,255,255,0.1)" />
                                </div>
                            )}
                        </div>

                        <div className="flex-1">
                            <div className="mb-4 flex flex-wrap items-center gap-2">
                                <Badge variant="cinema">
                                    {type === 'movie' ? dt.movie : dt.tvShow}
                                </Badge>
                                {details.year && <Badge variant="cinema">{details.year}</Badge>}
                                {details.voteAverage > 0 && (
                                    <Badge variant="cinema">
                                        <StarIcon /> {details.voteAverage.toFixed(1)}
                                    </Badge>
                                )}
                                {details.runtime && (
                                    <Badge variant="cinema">
                                        {type === 'movie' ? `${details.runtime} ${dt.min}` : `${details.runtime} ${dt.episodes}`}
                                    </Badge>
                                )}
                            </div>

                            <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                                {details.title}
                            </h1>

                            {details.tagline && (
                                <p className="mt-2 text-sm italic text-white/40">{details.tagline}</p>
                            )}

                            <p className="mt-5 text-sm leading-relaxed text-white/60 max-w-xl">
                                {details.overview}
                            </p>

                            {details.genres.length > 0 && (
                                <div className="mt-5 flex flex-wrap gap-2">
                                    {details.genres.map((g) => (
                                        <span key={g} className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/50">
                                            {g}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-12 mb-6 flex items-center justify-between">
                        <h2 className="text-xl font-black lowercase tracking-tight">
                            {dt.streamingAvailability}
                        </h2>
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
                    </div>

                    <Tabs tabs={tabs} defaultTab="flatrate" variant="cinema" />

                    {availability?.link && (
                        <div className="mt-8 text-center">
                            <a
                                href={availability.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-[#e63946] hover:underline"
                            >
                                {dt.viewOnTmdb}
                            </a>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}

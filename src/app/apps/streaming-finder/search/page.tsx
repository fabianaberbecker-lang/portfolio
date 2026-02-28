'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useSubscriptions } from '@/lib/streaming-finder/SubscriptionContext';
import { NotificationBadge } from '@/components/streaming-finder/NotificationBadge';
import { StickerSearch } from '@/components/decorative/StickerSearch';
import { StickerPlay } from '@/components/decorative/StickerPlay';
import type { SearchResult } from '@/lib/streaming/types';

function SearchIcon() {
    return (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
    );
}

function StarIcon() {
    return (
        <svg className="inline h-3 w-3" viewBox="0 0 20 20" fill="#ffcb30" aria-hidden="true">
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

/** Horizontal scroll row of poster cards */
function TrendingRow({ title, items }: { title: string; items: SearchResult[] }) {
    return (
        <div className="mb-10">
            <h2 className="mb-4 text-lg font-bold lowercase tracking-tight">{title}</h2>
            <div className="overflow-x-auto pb-4 -mx-2">
                <div className="flex gap-3 px-2" style={{ minWidth: 'max-content' }}>
                    {items.map((result) => (
                        <Link
                            key={`${result.type}-${result.id}`}
                            href={`/apps/streaming-finder/title/${result.id}?type=${result.type}`}
                            className="group w-36 shrink-0 overflow-hidden rounded-xl bg-white/[0.03] transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-black/50"
                        >
                            <div className="relative aspect-[2/3] w-full overflow-hidden">
                                {result.posterPath ? (
                                    <Image
                                        src={result.posterPath}
                                        alt={result.title}
                                        fill
                                        className="object-cover"
                                        sizes="144px"
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center bg-white/5">
                                        <StickerPlay size={32} color="rgba(255,255,255,0.1)" />
                                    </div>
                                )}
                            </div>
                            <div className="p-2">
                                <p className="text-xs font-semibold text-white/80 line-clamp-1">{result.title}</p>
                                {result.year && (
                                    <span className="text-[10px] text-white/30">{result.year}</span>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

/** Skeleton row for trending loading state */
function TrendingRowSkeleton() {
    return (
        <div className="mb-10">
            <div className="mb-4 h-5 w-40 rounded bg-white/10 animate-pulse" />
            <div className="flex gap-3">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="w-36 shrink-0">
                        <div className="aspect-[2/3] w-full rounded-xl bg-white/[0.05] animate-pulse" />
                        <div className="mt-2 h-3 w-24 rounded bg-white/[0.05] animate-pulse" />
                    </div>
                ))}
            </div>
        </div>
    );
}

function SettingsIcon() {
    return (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    );
}

export default function SearchPage() {
    const { t } = useLanguage();
    const st = t.streamingFinder.search;
    const { providerIds } = useSubscriptions();

    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searched, setSearched] = useState(false);

    // Trending data
    const [trending, setTrending] = useState<{ movies: SearchResult[]; tv: SearchResult[] } | null>(null);
    const [trendingLoading, setTrendingLoading] = useState(true);

    useEffect(() => {
        fetch('/api/trending')
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => setTrending(data))
            .catch(() => {})
            .finally(() => setTrendingLoading(false));
    }, []);

    const search = useCallback(async (q: string) => {
        if (!q.trim()) {
            setResults([]);
            setSearched(false);
            return;
        }
        setLoading(true);
        setError(null);
        setSearched(true);
        try {
            const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
            if (!res.ok) throw new Error('Search failed');
            const data = await res.json();
            setResults(data.results ?? []);
        } catch {
            setError(st.errorMessage);
            setResults([]);
        } finally {
            setLoading(false);
        }
    }, [st.errorMessage]);

    useEffect(() => {
        const timer = setTimeout(() => search(query), 300);
        return () => clearTimeout(timer);
    }, [query, search]);

    return (
        <div className="theme-cinema min-h-screen bg-[#0a0a0a] text-white">
            <section className="py-10 sm:py-14">
                <div className="mx-auto max-w-6xl px-6 lg:px-10">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="mb-4 flex items-center justify-between">
                            <Link
                                href="/apps/streaming-finder"
                                className="inline-flex items-center gap-1 text-sm text-white/40 hover:text-white/70"
                            >
                                {st.backLink}
                            </Link>
                            <div className="flex items-center gap-2">
                                <NotificationBadge />
                                <Link
                                    href="/apps/streaming-finder/services"
                                    className="relative flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/50 transition-all hover:bg-white/10 hover:text-white/80"
                                    title={t.streamingFinder.services.title}
                                >
                                    <SettingsIcon />
                                    {providerIds.length > 0 && (
                                        <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-[#e63946] px-1 text-[10px] font-bold text-white">
                                            {providerIds.length}
                                        </span>
                                    )}
                                </Link>
                            </div>
                        </div>
                        <h1 className="text-3xl font-black lowercase tracking-tight sm:text-4xl">
                            {st.title}
                        </h1>
                    </div>

                    {/* Search */}
                    <div className="mb-10">
                        <Input
                            icon={<SearchIcon />}
                            variant="cinema"
                            placeholder={st.placeholder}
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            autoFocus
                        />
                    </div>

                    {/* Loading */}
                    {loading && (
                        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                            {Array.from({ length: 10 }).map((_, i) => (
                                <CardSkeleton key={i} variant="cinema" />
                            ))}
                        </div>
                    )}

                    {/* Error */}
                    {error && !loading && (
                        <div className="mx-auto max-w-md rounded-2xl border border-red-500/20 bg-red-500/5 p-10 text-center">
                            <ErrorIcon />
                            <p className="mt-3 text-sm text-red-400">{error}</p>
                            <button
                                onClick={() => search(query)}
                                className="mt-4 cursor-pointer text-sm font-medium text-[#e63946] hover:underline"
                            >
                                {st.retry}
                            </button>
                        </div>
                    )}

                    {/* Empty */}
                    {!loading && !error && searched && results.length === 0 && (
                        <div className="mx-auto max-w-md rounded-2xl border border-white/5 bg-white/[0.03] p-10 text-center">
                            <StickerSearch size={48} color="#e63946" className="mx-auto" />
                            <p className="mt-4 font-bold text-white">{st.noResults}</p>
                            <p className="mt-1 text-sm text-white/40">{st.noResultsHint}</p>
                        </div>
                    )}

                    {/* Results — Netflix-inspired poster grid */}
                    {!loading && !error && results.length > 0 && (
                        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                            {results.map((result) => (
                                <Link
                                    key={`${result.type}-${result.id}`}
                                    href={`/apps/streaming-finder/title/${result.id}?type=${result.type}`}
                                    className="group relative overflow-hidden rounded-xl bg-white/[0.03] transition-all duration-300 hover:scale-105 hover:z-10 hover:shadow-2xl hover:shadow-black/50"
                                >
                                    <div className="relative aspect-[2/3] w-full overflow-hidden">
                                        {result.posterPath ? (
                                            <Image
                                                src={result.posterPath}
                                                alt={result.title}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center bg-white/5">
                                                <StickerPlay size={48} color="rgba(255,255,255,0.1)" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                            <div className="absolute bottom-0 left-0 right-0 p-4">
                                                <p className="text-xs font-bold text-white line-clamp-2">
                                                    {result.title}
                                                </p>
                                                <div className="mt-2 flex items-center gap-2">
                                                    <Badge variant="cinema">
                                                        {result.type === 'movie' ? t.streamingFinder.detail.movie : 'tv'}
                                                    </Badge>
                                                    {result.voteAverage > 0 && (
                                                        <span className="flex items-center gap-1 text-xs text-white/60">
                                                            <StarIcon /> {result.voteAverage.toFixed(1)}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-3">
                                        <p className="text-xs font-semibold text-white/80 line-clamp-1">
                                            {result.title}
                                        </p>
                                        <div className="mt-1 flex items-center gap-2">
                                            <span className="text-[10px] uppercase tracking-wider text-white/30">
                                                {result.type}
                                            </span>
                                            {result.year && (
                                                <span className="text-[10px] text-white/30">{result.year}</span>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Initial state: Trending */}
                    {!loading && !searched && (
                        <>
                            {trendingLoading && (
                                <>
                                    <TrendingRowSkeleton />
                                    <TrendingRowSkeleton />
                                </>
                            )}
                            {!trendingLoading && trending && (
                                <>
                                    {trending.movies.length > 0 && (
                                        <TrendingRow title={st.trendingMovies} items={trending.movies} />
                                    )}
                                    {trending.tv.length > 0 && (
                                        <TrendingRow title={st.trendingShows} items={trending.tv} />
                                    )}
                                </>
                            )}
                            {!trendingLoading && !trending && (
                                <div className="mx-auto max-w-md rounded-2xl border border-white/5 bg-white/[0.03] p-12 text-center">
                                    <StickerSearch size={48} color="#e63946" className="mx-auto" />
                                    <p className="mt-4 text-lg font-bold text-white">{st.initialTitle}</p>
                                    <p className="mt-1 text-sm text-white/40">{st.initialDescription}</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>
        </div>
    );
}

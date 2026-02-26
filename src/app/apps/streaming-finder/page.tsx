'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { stickerMap } from '@/components/decorative/sticker-map';
import { StickerPlay } from '@/components/decorative/StickerPlay';

export default function StreamingFinderLanding() {
    const { t } = useLanguage();
    const landing = t.streamingFinder.landing;

    return (
        <div className="theme-cinema min-h-screen bg-[#0a0a0a] text-white">
            {/* Hero */}
            <section className="relative overflow-hidden py-32 sm:py-40">
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#e63946]/10 via-transparent to-transparent" />
                <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[#e63946]/8 blur-[150px]" />

                <div className="relative mx-auto max-w-5xl px-6 lg:px-10">
                    <div className="mx-auto max-w-2xl text-center animate-fade-in-up">
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/60">
                            <StickerPlay size={16} color="#e63946" />
                            {landing.badge}
                        </span>
                        <h1 className="mt-8 text-5xl font-black leading-[1.05] tracking-tight sm:text-7xl">
                            {landing.title}
                            <span className="bg-gradient-to-r from-[#e63946] to-[#ff6b6b] bg-clip-text text-transparent">
                                {landing.titleHighlight}
                            </span>
                        </h1>
                        <p className="mt-6 text-lg leading-relaxed text-white/50">
                            {landing.description}
                        </p>
                        <div className="mt-10">
                            <Link href="/apps/streaming-finder/search">
                                <Button variant="cinema" size="lg">
                                    {landing.cta}
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="border-t border-white/5 py-24">
                <div className="mx-auto max-w-5xl px-6 lg:px-10">
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {landing.features.map((f) => {
                            const Icon = stickerMap[f.iconKey];
                            return (
                                <div
                                    key={f.title}
                                    className="group rounded-2xl border border-white/5 bg-white/[0.03] p-6 transition-all hover:bg-white/[0.06] hover:border-white/10"
                                >
                                    <div className="mb-4">
                                        {Icon ? <Icon size={32} color="#e63946" /> : null}
                                    </div>
                                    <h3 className="text-sm font-bold text-white">{f.title}</h3>
                                    <p className="mt-2 text-xs leading-relaxed text-white/40">{f.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Attribution */}
            <section className="border-t border-white/5 py-10">
                <div className="mx-auto max-w-5xl px-6 text-center lg:px-10">
                    <p className="text-xs text-white/20">
                        {landing.attribution.split('TMDB')[0]}
                        <a href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer" className="underline hover:text-white/40">
                            TMDB
                        </a>
                        {landing.attribution.split('TMDB')[1]}
                    </p>
                </div>
            </section>
        </div>
    );
}

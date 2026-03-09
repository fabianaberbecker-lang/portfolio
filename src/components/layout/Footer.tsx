'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useState, useEffect } from 'react';

export function Footer() {
    const pathname = usePathname();
    const { t } = useLanguage();
    const isStreamingFinder = pathname.startsWith('/apps/streaming-finder');
    const isFlowBoard = pathname.startsWith('/apps/flowboard');
    const isDarkAppFooter = isStreamingFinder || isFlowBoard;
    const [isEmbedded, setIsEmbedded] = useState(false);

    // Detect if running inside an iframe (phone mockup) or as installed PWA
    useEffect(() => {
        setIsEmbedded(
            window.self !== window.top ||
            window.matchMedia('(display-mode: standalone)').matches ||
            (window.navigator as any).standalone === true
        );
    }, []);

    if (isEmbedded) return null;

    return (
        <footer
            className={`border-t ${isDarkAppFooter
                    ? 'border-white/5 bg-[#0a0a0a] text-white/40'
                    : 'border-border bg-warm'
                }`}
        >
            <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 px-6 py-12 sm:flex-row sm:justify-between lg:px-10">
                {/* Brand */}
                <div>
                    <p
                        className={`text-lg font-black lowercase ${isDarkAppFooter ? 'text-white/80' : 'text-foreground'
                            }`}
                    >
                        fabian becker<span className={isDarkAppFooter ? 'text-[#e63946]' : 'text-pop-purple'}>_</span>
                    </p>
                    <p className={`mt-1 text-xs ${isDarkAppFooter ? 'text-white/30' : 'text-muted'}`}>
                        {t.footer.copyright}
                    </p>
                </div>

                {/* Social Links */}
                {!isDarkAppFooter && (
                    <div className="flex gap-2">
                        <Link
                            href="https://linkedin.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex h-10 w-12 items-center justify-center rounded-xl bg-pop-purple text-xs font-bold uppercase text-white transition-transform hover:scale-110 hover:-translate-y-1"
                        >
                            li
                        </Link>
                        <Link
                            href="https://github.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex h-10 w-12 items-center justify-center rounded-xl bg-pop-green text-xs font-bold uppercase text-white transition-transform hover:scale-110 hover:-translate-y-1"
                        >
                            gh
                        </Link>
                        <Link
                            href={`mailto:${t.hero.email}`}
                            className="flex h-10 w-12 items-center justify-center rounded-xl bg-pop-red text-xs font-bold uppercase text-white transition-transform hover:scale-110 hover:-translate-y-1"
                        >
                            @
                        </Link>
                    </div>
                )}

            </div>
        </footer>
    );
}

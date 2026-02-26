'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { LanguageToggle } from '@/components/ui/LanguageToggle';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useState, useEffect } from 'react';

export function Header() {
    const pathname = usePathname();
    const { t } = useLanguage();
    const [menuOpen, setMenuOpen] = useState(false);
    const [isEmbedded, setIsEmbedded] = useState(false);
    const isStreamingFinder = pathname.startsWith('/apps/streaming-finder');

    // Detect if running inside an iframe (phone mockup)
    useEffect(() => {
        setIsEmbedded(window.self !== window.top);
    }, []);

    if (isEmbedded) return null;

    const navLinks = [
        { href: '/', label: t.nav.home },
        { href: '/projects', label: t.nav.projects },
        { href: '/about', label: t.nav.about },
        { href: '/apps/streaming-finder', label: t.nav.streamingFinder },
        { href: '/contact', label: t.nav.contact },
    ];

    return (
        <header
            className={`sticky top-0 z-50 backdrop-blur-xl ${isStreamingFinder
                    ? 'bg-[#0a0a0a]/90 border-b border-white/5'
                    : 'bg-warm/80 border-b border-border'
                }`}
        >
            <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">
                {/* Logo */}
                <Link
                    href="/"
                    className={`text-xl font-black lowercase tracking-tight ${isStreamingFinder ? 'text-white' : 'text-foreground'
                        }`}
                >
                    fabian becker
                    <span className={isStreamingFinder ? 'text-[#e63946]' : 'text-pop-purple'}>
                        _
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden items-center gap-1 lg:flex">
                    {navLinks.map((link) => {
                        const isActive =
                            link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);

                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`rounded-full px-4 py-2 text-sm font-medium lowercase tracking-wide transition-all ${isActive
                                        ? isStreamingFinder
                                            ? 'bg-white/10 text-white'
                                            : 'bg-foreground text-background'
                                        : isStreamingFinder
                                            ? 'text-white/60 hover:text-white hover:bg-white/5'
                                            : 'text-muted hover:text-foreground hover:bg-foreground/5'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                    <div className="ml-2 flex items-center gap-2">
                        <LanguageToggle />
                        <ThemeToggle />
                    </div>
                </nav>

                {/* Mobile controls */}
                <div className="flex items-center gap-2 lg:hidden">
                    <LanguageToggle />
                    <ThemeToggle />
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className={`rounded-full p-2 ${isStreamingFinder
                                ? 'text-white/60 hover:bg-white/10'
                                : 'text-muted hover:bg-foreground/5'
                            }`}
                        aria-label="Toggle menu"
                    >
                        {menuOpen ? (
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Nav */}
            {menuOpen && (
                <nav
                    className={`border-t px-6 py-4 lg:hidden ${isStreamingFinder
                            ? 'border-white/5 bg-[#0a0a0a]'
                            : 'border-border bg-warm'
                        }`}
                >
                    {navLinks.map((link) => {
                        const isActive =
                            link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);

                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMenuOpen(false)}
                                className={`block rounded-2xl px-4 py-3 text-base font-medium lowercase ${isActive
                                        ? isStreamingFinder
                                            ? 'bg-white/10 text-white'
                                            : 'bg-foreground text-background'
                                        : isStreamingFinder
                                            ? 'text-white/60 hover:text-white'
                                            : 'text-muted hover:text-foreground'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>
            )}
        </header>
    );
}

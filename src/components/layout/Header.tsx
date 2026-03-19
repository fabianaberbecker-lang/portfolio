'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { LanguageToggle } from '@/components/ui/LanguageToggle';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useState, useEffect, useRef } from 'react';

export function Header() {
    const pathname = usePathname();
    const { t } = useLanguage();
    const [menuOpen, setMenuOpen] = useState(false);
    const [demosOpen, setDemosOpen] = useState(false);
    const [mobileDemosOpen, setMobileDemosOpen] = useState(false);
    const [isEmbedded, setIsEmbedded] = useState(false);
    const demosRef = useRef<HTMLDivElement>(null);
    const isStreamingFinder = pathname.startsWith('/apps/streaming-finder');
    const isBarMatch = pathname.startsWith('/apps/barmatch');
    const isFlowBoard = pathname.startsWith('/apps/flowboard');
    const isThinking = pathname.startsWith('/apps/thinking');
    const isDecisionLab = pathname.startsWith('/apps/decision-lab');
    const isHowIThinkNarrative = pathname.startsWith('/how-i-think');
    const isDarkApp = isStreamingFinder || isBarMatch || isFlowBoard || isThinking || isDecisionLab || isHowIThinkNarrative;
    const isDemoPage = isDarkApp;

    // Detect if running inside an iframe (phone mockup) or as installed PWA
    useEffect(() => {
        setIsEmbedded(
            window.self !== window.top ||
            window.matchMedia('(display-mode: standalone)').matches ||
            (window.navigator as any).standalone === true
        );
    }, []);

    // Close demos dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (demosRef.current && !demosRef.current.contains(e.target as Node)) {
                setDemosOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (isEmbedded) return null;

    const navLinks = [
        { href: '/', label: t.nav.home },
        { href: '/projects', label: t.nav.projects },
        { href: '/about', label: t.nav.about },
        { href: '/contact', label: t.nav.contact },
    ];

    const demoLinks = [
        { href: '/apps/streaming-finder', label: t.nav.streamingFinder },
        { href: '/apps/barmatch', label: t.nav.barMatch },
        { href: '/apps/flowboard', label: t.nav.flowBoard },
        { href: '/apps/thinking', label: t.nav.howIThink },
        { href: '/apps/decision-lab', label: t.nav.decisionLab },
    ];

    return (
        <header
            className={`sticky top-0 z-50 backdrop-blur-xl ${isDarkApp
                    ? 'bg-[#0a0a0a]/90 border-b border-white/5'
                    : 'bg-warm/80 border-b border-border'
                }`}
        >
            <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">
                {/* Logo */}
                <Link
                    href="/"
                    className={`text-xl font-black lowercase tracking-tight ${isDarkApp ? 'text-white' : 'text-foreground'
                        }`}
                >
                    fabian becker
                    <span className={isDarkApp ? (isDecisionLab ? 'text-[#8b7cf6]' : (isThinking || isHowIThinkNarrative) ? 'text-[#6b8afd]' : isFlowBoard ? 'text-indigo-400' : isBarMatch ? 'text-amber-500' : 'text-[#e63946]') : 'text-pop-purple'}>
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
                                className={`relative rounded-full px-4 py-2 text-sm font-medium lowercase tracking-wide transition-all after:absolute after:bottom-0.5 after:left-1/2 after:h-0.5 after:-translate-x-1/2 after:rounded-full after:transition-all after:duration-200 ${isActive
                                        ? isDarkApp
                                            ? 'text-white after:w-3/5 after:bg-[#a78bfa]'
                                            : 'text-foreground after:w-3/5 after:bg-[#a78bfa]'
                                        : isDarkApp
                                            ? 'text-white/60 hover:text-white after:w-0 after:bg-current hover:after:w-3/5'
                                            : 'text-muted hover:text-foreground after:w-0 after:bg-current hover:after:w-3/5'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        );
                    })}

                    {/* Demos Dropdown */}
                    <div className="relative" ref={demosRef}>
                        <button
                            onClick={() => setDemosOpen(!demosOpen)}
                            className={`relative flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium lowercase tracking-wide transition-all after:absolute after:bottom-0.5 after:left-1/2 after:h-0.5 after:-translate-x-1/2 after:rounded-full after:transition-all after:duration-200 ${isDemoPage
                                    ? isDarkApp
                                        ? 'text-white after:w-3/5 after:bg-[#a78bfa]'
                                        : 'text-foreground after:w-3/5 after:bg-[#a78bfa]'
                                    : isDarkApp
                                        ? 'text-white/60 hover:text-white after:w-0 after:bg-current hover:after:w-3/5'
                                        : 'text-muted hover:text-foreground after:w-0 after:bg-current hover:after:w-3/5'
                                }`}
                        >
                            {t.nav.demos}
                            <svg
                                className={`h-3.5 w-3.5 transition-transform ${demosOpen ? 'rotate-180' : ''}`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {demosOpen && (
                            <div
                                className={`absolute top-full left-0 mt-2 min-w-[180px] rounded-2xl border p-2 shadow-xl ${isDarkApp
                                        ? 'border-white/10 bg-[#141414]'
                                        : 'border-border bg-warm'
                                    }`}
                            >
                                {demoLinks.map((link) => {
                                    const isActive = pathname.startsWith(link.href);
                                    return (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            onClick={() => setDemosOpen(false)}
                                            className={`block rounded-xl px-4 py-2.5 text-sm font-medium lowercase tracking-wide transition-all ${isActive
                                                    ? isDarkApp
                                                        ? 'bg-white/10 text-white'
                                                        : 'bg-foreground text-background'
                                                    : isDarkApp
                                                        ? 'text-white/60 hover:text-white hover:bg-white/5'
                                                        : 'text-muted hover:text-foreground hover:bg-foreground/5'
                                                }`}
                                        >
                                            {link.label}
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </div>

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
                        className={`rounded-full p-2 ${isDarkApp
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
                    className={`border-t px-6 py-4 lg:hidden ${isDarkApp
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
                                        ? isDarkApp
                                            ? 'bg-white/10 text-white'
                                            : 'bg-foreground text-background'
                                        : isDarkApp
                                            ? 'text-white/60 hover:text-white'
                                            : 'text-muted hover:text-foreground'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        );
                    })}

                    {/* Mobile Demos Accordion */}
                    <button
                        onClick={() => setMobileDemosOpen(!mobileDemosOpen)}
                        className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-base font-medium lowercase ${isDemoPage
                                ? isDarkApp
                                    ? 'bg-white/10 text-white'
                                    : 'bg-foreground text-background'
                                : isDarkApp
                                    ? 'text-white/60 hover:text-white'
                                    : 'text-muted hover:text-foreground'
                            }`}
                    >
                        {t.nav.demos}
                        <svg
                            className={`h-4 w-4 transition-transform ${mobileDemosOpen ? 'rotate-180' : ''}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    {mobileDemosOpen && (
                        <div className="ml-4 mt-1 space-y-1">
                            {demoLinks.map((link) => {
                                const isActive = pathname.startsWith(link.href);
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => { setMenuOpen(false); setMobileDemosOpen(false); }}
                                        className={`block rounded-2xl px-4 py-2.5 text-sm font-medium lowercase ${isActive
                                                ? isDarkApp
                                                    ? 'bg-white/10 text-white'
                                                    : 'bg-foreground text-background'
                                                : isDarkApp
                                                    ? 'text-white/40 hover:text-white'
                                                    : 'text-muted/70 hover:text-foreground'
                                            }`}
                                    >
                                        {link.label}
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </nav>
            )}
        </header>
    );
}

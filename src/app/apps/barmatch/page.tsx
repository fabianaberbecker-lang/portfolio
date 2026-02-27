'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/lib/i18n/LanguageContext';

function MapPinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="#f59e0b" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

const features = [
  {
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="#f59e0b" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: 'Group sessions',
    description: 'Create a session and invite your friends with a simple link or QR code.',
  },
  {
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="#f59e0b" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    title: 'Swipe to decide',
    description: 'Swipe through nearby bars. Like the ones you want, skip the rest.',
  },
  {
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="#f59e0b" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Find your match',
    description: 'When everyone agrees on a bar, you get a match with directions.',
  },
  {
    icon: (
      <MapPinIcon className="h-8 w-8" />
    ),
    title: 'Real bar data',
    description: 'Powered by OpenStreetMap. Real locations, opening hours, and more.',
  },
];

export default function BarMatchLanding() {
  const { locale } = useLanguage();

  return (
    <div className="theme-nightlife min-h-screen bg-[#0c0a14] text-white">
      {/* Hero */}
      <section className="relative overflow-hidden py-32 sm:py-40">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-amber-500/10 via-transparent to-transparent" />
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-amber-500/8 blur-[150px]" />

        <div className="relative mx-auto max-w-5xl px-6 lg:px-10">
          <div className="mx-auto max-w-2xl text-center animate-fade-in-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/60">
              <MapPinIcon className="h-4 w-4 text-amber-500" />
              {locale === 'de' ? 'Standalone App' : 'Standalone App'}
            </span>
            <h1 className="mt-8 text-5xl font-black leading-[1.05] tracking-tight sm:text-7xl">
              {locale === 'de' ? 'Finde die ' : 'Find the '}
              <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                {locale === 'de' ? 'perfekte Bar' : 'perfect bar'}
              </span>
              {locale === 'de' ? ' zusammen.' : ' together.'}
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-white/50">
              {locale === 'de'
                ? 'Erstelle eine Gruppen-Session, swipe durch Bars in der Nähe und findet gemeinsam euren Treffpunkt.'
                : 'Create a group session, swipe through nearby bars, and find your meeting spot together.'}
            </p>
            <div className="mt-10">
              <Link href="/apps/barmatch/app">
                <Button variant="nightlife" size="lg">
                  {locale === 'de' ? 'Demo starten' : 'Try the demo'}
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
            {features.map((f) => (
              <div
                key={f.title}
                className="group rounded-2xl border border-white/5 bg-white/[0.03] p-6 transition-all hover:bg-white/[0.06] hover:border-white/10"
              >
                <div className="mb-4">{f.icon}</div>
                <h3 className="text-sm font-bold text-white">{f.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-white/40">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Attribution */}
      <section className="border-t border-white/5 py-10">
        <div className="mx-auto max-w-5xl px-6 text-center lg:px-10">
          <p className="text-xs text-white/20">
            Bar data provided by{' '}
            <a href="https://www.openstreetmap.org/" target="_blank" rel="noopener noreferrer" className="underline hover:text-white/40">
              OpenStreetMap
            </a>
            {' '}contributors.
          </p>
        </div>
      </section>
    </div>
  );
}

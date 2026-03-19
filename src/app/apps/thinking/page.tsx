'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/lib/i18n/LanguageContext';

const features = [
  {
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="#6b8afd" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
      </svg>
    ),
    title: 'Structured generation',
    description: 'Transform any problem into hypotheses, assumptions, and risks automatically.',
  },
  {
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="#6b8afd" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 3.75H6A2.25 2.25 0 003.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0120.25 6v1.5m0 9V18A2.25 2.25 0 0118 20.25h-1.5m-9 0H6A2.25 2.25 0 013.75 18v-1.5M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: 'Mind map view',
    description: 'Drag, connect, and explore nodes in a spatial reasoning canvas.',
  },
  {
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="#6b8afd" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25a2.25 2.25 0 01-2.25-2.25v-2.25z" />
      </svg>
    ),
    title: 'Priority matrix',
    description: 'Plot ideas on an impact/effort matrix with draggable quadrant placement.',
  },
  {
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="#6b8afd" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
      </svg>
    ),
    title: 'Save & export',
    description: 'Sessions persist locally. Export your reasoning as JSON anytime.',
  },
];

export default function ThinkingLanding() {
  const { locale } = useLanguage();

  return (
    <div className="theme-thinking min-h-screen bg-[#0f1117] text-white">
      {/* Hero */}
      <section className="relative overflow-hidden py-32 sm:py-40">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#6b8afd]/8 via-transparent to-transparent" />
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[#6b8afd]/6 blur-[150px]" />

        <div className="relative mx-auto max-w-5xl px-6 lg:px-10">
          <div className="mx-auto max-w-2xl text-center animate-fade-in-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/60">
              <svg className="h-4 w-4 text-[#6b8afd]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
              </svg>
              {locale === 'de' ? 'Denkwerkzeug' : 'Thinking Tool'}
            </span>
            <h1 className="mt-8 text-5xl font-black leading-[1.05] tracking-tight sm:text-7xl">
              {locale === 'de' ? 'Denke ' : 'Think '}
              <span className="bg-gradient-to-r from-[#6b8afd] to-[#e5a35c] bg-clip-text text-transparent">
                {locale === 'de' ? 'strukturiert' : 'structured'}
              </span>
              {locale === 'de' ? ', handle ' : ', act '}
              <span className="bg-gradient-to-r from-[#e5a35c] to-[#e07070] bg-clip-text text-transparent">
                {locale === 'de' ? 'klar.' : 'clearly.'}
              </span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-white/50">
              {locale === 'de'
                ? 'Verwandle jedes Problem in einen navigierbaren Denkraum. Hypothesen, Annahmen, Risiken — visuell verknüpft und priorisiert.'
                : 'Transform any problem into a navigable thinking space. Hypotheses, assumptions, risks — visually connected and prioritized.'}
            </p>
            <div className="mt-10">
              <Link href="/apps/thinking/app">
                <Button variant="thinking" size="lg">
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

      {/* Footer */}
      <section className="border-t border-white/5 py-10">
        <div className="mx-auto max-w-5xl px-6 text-center lg:px-10">
          <p className="text-xs text-white/20">
            Built with Next.js, Zustand, and React Flow. Data stored locally in the browser.
          </p>
        </div>
      </section>
    </div>
  );
}

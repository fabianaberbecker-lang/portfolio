'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/lib/i18n/LanguageContext';

const features = [
  {
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="#6366f1" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125C3.504 4.5 3 5.004 3 5.625v12.75c0 .621.504 1.125 1.125 1.125z" />
      </svg>
    ),
    title: 'Kanban boards',
    description: 'Organize tasks in columns with smooth drag-and-drop between stages.',
  },
  {
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="#6366f1" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6z" />
      </svg>
    ),
    title: 'Freeform canvas',
    description: 'Think spatially — drag cards anywhere and connect them with arrows.',
  },
  {
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="#6366f1" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
      </svg>
    ),
    title: 'Undo & redo',
    description: 'Full 50-step history. Never lose your work — Ctrl+Z everything.',
  },
  {
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="#6366f1" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
      </svg>
    ),
    title: 'Works offline',
    description: 'Data saved locally via IndexedDB. Install as a PWA for mobile use.',
  },
];

export default function FlowBoardLanding() {
  const { locale } = useLanguage();

  return (
    <div className="theme-flowboard min-h-screen bg-[#0b0d1a] text-white">
      {/* Hero */}
      <section className="relative overflow-hidden py-32 sm:py-40">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-indigo-500/10 via-transparent to-transparent" />
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-indigo-500/8 blur-[150px]" />

        <div className="relative mx-auto max-w-5xl px-6 lg:px-10">
          <div className="mx-auto max-w-2xl text-center animate-fade-in-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/60">
              <svg className="h-4 w-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125C3.504 4.5 3 5.004 3 5.625v12.75c0 .621.504 1.125 1.125 1.125z" />
              </svg>
              {locale === 'de' ? 'Standalone App' : 'Standalone App'}
            </span>
            <h1 className="mt-8 text-5xl font-black leading-[1.05] tracking-tight sm:text-7xl">
              {locale === 'de' ? 'Plan ' : 'Plan '}
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                {locale === 'de' ? 'visuell' : 'visually'}
              </span>
              {locale === 'de' ? ', denke ' : ', think '}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {locale === 'de' ? 'räumlich.' : 'spatially.'}
              </span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-white/50">
              {locale === 'de'
                ? 'Wechsle zwischen Kanban-Spalten und freiem Canvas. Karten, Verbindungen und Glasdesign — alles offline.'
                : 'Switch between Kanban columns and freeform canvas. Cards, connectors, and glass design — all offline.'}
            </p>
            <div className="mt-10">
              <Link href="/apps/flowboard/app">
                <Button variant="flowboard" size="lg">
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
            Built with Next.js, Zustand, and dnd-kit. Data stored locally via IndexedDB.
          </p>
        </div>
      </section>
    </div>
  );
}

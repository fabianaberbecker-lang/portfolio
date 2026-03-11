'use client';

import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/lib/i18n/LanguageContext';

/**
 * Renders the hero tagline with "users love" (EN) or "nutzer lieben" (DE)
 * highlighted in pop-purple.
 */
function HighlightedTagline({ tagline, locale }: { tagline: string; locale: string }) {
  const highlight = locale === 'de' ? 'nutzer lieben' : 'users love';
  const idx = tagline.toLowerCase().indexOf(highlight);

  if (idx === -1) {
    return <>{tagline}</>;
  }

  const before = tagline.slice(0, idx);
  const match = tagline.slice(idx, idx + highlight.length);
  const after = tagline.slice(idx + highlight.length);

  return (
    <>
      {before}
      <span className="text-pop-purple">{match}</span>
      {after}
    </>
  );
}

export function HeroSection() {
  const { locale, t } = useLanguage();

  return (
    <section className="relative overflow-hidden py-32 sm:py-40 lg:py-48">
      {/* Atmospheric background layers */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-pop-purple/[0.04] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-pop-yellow/[0.03] blur-3xl" />
      {/* Radial glow behind headline — soft purple atmosphere */}
      <div
        className="pointer-events-none absolute -top-[120px] -left-[150px] h-[600px] w-[600px] blur-[60px]"
        style={{ background: 'radial-gradient(circle, rgba(120, 80, 255, 0.12), transparent 65%)' }}
      />

      <Container className="relative z-1 max-w-5xl">
        <div className="animate-fade-in-up">
          {/* Accent bar — animated, same gradient as headline */}
          <div
            className="animate-hero-bar mb-[18px] h-1 max-w-[100px] rounded-full"
            style={{
              background: 'linear-gradient(110deg, #a78bfa, #6366f1)',
              boxShadow: '0 0 12px rgba(120, 80, 255, 0.18)',
            }}
          />

          {/* Headline */}
          <h1
            className="animate-gradient-shift bg-[length:200%_200%] bg-clip-text text-5xl font-black lowercase leading-[1.05] tracking-tight text-transparent sm:text-7xl lg:text-8xl"
            style={{ backgroundImage: 'linear-gradient(110deg, #a78bfa, #6366f1, #a78bfa)' }}
          >
            {t.hero.name}
          </h1>

          {/* Subheadline */}
          <p className="mt-8 text-2xl font-bold lowercase tracking-tight text-hero-subheadline sm:text-3xl">
            <HighlightedTagline tagline={t.hero.tagline} locale={locale} />
          </p>

          {/* Description */}
          <p className="mt-7 max-w-[520px] text-lg leading-[1.7] text-hero-paragraph">
            {t.hero.description}
          </p>

          {/* Email */}
          <a
            href={`mailto:${t.hero.email}`}
            className="mt-4 inline-flex items-center gap-1.5 text-sm text-hero-email transition-colors hover:text-foreground"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {t.hero.email}
          </a>

          {/* CTAs */}
          <div className="mt-12 flex flex-wrap items-center gap-4">
            <Link href="/projects">
              <Button variant="purple" size="lg">{t.hero.viewProjects}</Button>
            </Link>
            <Link href="/contact">
              <Button variant="secondary" size="lg">
                {t.hero.getInTouch}
              </Button>
            </Link>
            <a href={locale === 'de' ? '/fabian-becker-cv-de.pdf' : '/fabian-becker-cv-en.pdf'} download>
              <Button variant="ghost" size="lg">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
                </svg>
                {t.hero.downloadCv}
              </Button>
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}

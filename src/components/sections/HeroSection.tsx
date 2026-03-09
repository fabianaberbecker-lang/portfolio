'use client';

import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
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
      {/* Subtle decorative gradient blobs */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-pop-purple/[0.04] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-pop-yellow/[0.03] blur-3xl" />

      <Container className="relative max-w-5xl">
        <div className="animate-fade-in-up">
          <Badge variant="accent" className="mb-8">
            {t.hero.role}
          </Badge>
          <h1 className="text-5xl font-black lowercase leading-[1.05] tracking-tight sm:text-7xl lg:text-8xl">
            {t.hero.name}
          </h1>
          <p className="mt-6 text-2xl font-bold lowercase tracking-tight text-foreground sm:text-3xl">
            <HighlightedTagline tagline={t.hero.tagline} locale={locale} />
          </p>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted">
            {t.hero.description}
          </p>
          <a
            href={`mailto:${t.hero.email}`}
            className="mt-4 inline-block text-sm text-muted transition-colors hover:text-foreground"
          >
            {t.hero.email}
          </a>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/projects">
              <Button variant="purple" size="lg">{t.hero.viewProjects}</Button>
            </Link>
            <Link href="/contact">
              <Button variant="green" size="lg">
                {t.hero.getInTouch}
              </Button>
            </Link>
            <a href="/fabian-becker-cv.pdf" download>
              <Button variant="coral" size="lg">
                {t.hero.downloadCv}
              </Button>
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}

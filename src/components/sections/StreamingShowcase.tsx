'use client';

import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PhoneMockup } from '@/components/ui/PhoneMockup';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { stickerMap } from '@/components/decorative/sticker-map';
import { StickerPlay } from '@/components/decorative/StickerPlay';

export function StreamingShowcase() {
  const { t } = useLanguage();
  const sc = t.streamingFinder.showcase;

  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <Container className="max-w-6xl">
        {/* Section header */}
        <div className="mb-16 text-center">
          <Badge variant="accent" className="mb-4">
            <StickerPlay size={14} color="currentColor" className="mr-1 inline -mt-0.5" />
            {sc.title}
          </Badge>
          <h2 className="text-3xl font-black lowercase tracking-tight sm:text-4xl lg:text-5xl">
            {sc.title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted">
            {sc.description}
          </p>
        </div>

        {/* Desktop: Phone mockup + value props side by side */}
        <div className="hidden items-center gap-16 lg:flex">
          {/* Phone mockup */}
          <div className="shrink-0">
            <div className="relative">
              <PhoneMockup
                src="/apps/streaming-finder/search"
                title="Streaming Finder preview"
              />
              {/* Decorative glow behind phone */}
              <div className="absolute -inset-8 -z-10 rounded-[60px] bg-pop-purple/5 blur-3xl" />
            </div>
          </div>

          {/* Value props + CTA */}
          <div className="flex-1">
            <div className="space-y-8">
              {sc.valueProps.map((prop, i) => {
                const Icon = stickerMap[prop.iconKey];
                return (
                  <div key={i} className="flex gap-4">
                    <div className="mt-1 shrink-0">
                      {Icon && (
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface">
                          <Icon size={22} />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold lowercase tracking-tight">
                        {prop.title}
                      </h3>
                      <p className="mt-1 text-sm text-muted">
                        {prop.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-10">
              <Link href="/apps/streaming-finder">
                <Button size="lg">{sc.cta}</Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Tablet: Scaled phone mockup centered */}
        <div className="hidden md:flex md:flex-col md:items-center lg:hidden">
          <div className="origin-top scale-[0.85]">
            <PhoneMockup
              src="/apps/streaming-finder/search"
              title="Streaming Finder preview"
            />
          </div>
          <div className="mt-8">
            <Link href="/apps/streaming-finder">
              <Button size="lg">{sc.cta}</Button>
            </Link>
          </div>
        </div>

        {/* Mobile: CTA card (no phone frame) */}
        <div className="md:hidden">
          <div className="rounded-2xl border border-border bg-surface p-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-pop-purple/10">
              <StickerPlay size={28} />
            </div>

            <div className="mt-6 space-y-4">
              {sc.valueProps.map((prop, i) => {
                const Icon = stickerMap[prop.iconKey];
                return (
                  <div key={i} className="flex items-start gap-3 text-left">
                    {Icon && <Icon size={18} className="mt-0.5 shrink-0" />}
                    <div>
                      <span className="text-sm font-bold lowercase">{prop.title}</span>
                      <span className="text-sm text-muted"> — {prop.description}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8">
              <Link href="/apps/streaming-finder">
                <Button size="lg" className="w-full">
                  {sc.tryDemo}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

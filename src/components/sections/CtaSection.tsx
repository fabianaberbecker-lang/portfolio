'use client';

import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { StickerStar } from '@/components/decorative/StickerStar';

export function CtaSection() {
  const { t } = useLanguage();

  return (
    <section className="py-24 sm:py-32">
      <Container>
        <div className="relative overflow-hidden rounded-[3rem] bg-foreground p-12 text-center text-background sm:p-20">
          {/* Decorative circles */}
          <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-pop-purple/30" />
          <div className="pointer-events-none absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-pop-pink/20" />

          {/* Decorative sticker */}
          <div className="pointer-events-none absolute top-6 right-8 opacity-20">
            <StickerStar size={36} color="#ffffff" />
          </div>

          <div className="relative">
            <h2 className="text-3xl font-black lowercase tracking-tight sm:text-5xl">
              {t.cta.title}
            </h2>
            <p className="mx-auto mt-5 max-w-md text-background/60">
              {t.cta.description}
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link href="/contact">
                <Button variant="cinema" size="lg">
                  {t.cta.contactMe}
                </Button>
              </Link>
              <Link
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="ghost"
                  size="lg"
                  className="text-background/60 hover:bg-white/10 hover:text-background"
                >
                  {t.cta.linkedin}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

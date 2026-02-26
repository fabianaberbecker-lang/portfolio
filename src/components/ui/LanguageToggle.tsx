'use client';

import { useLanguage } from '@/lib/i18n/LanguageContext';

export function LanguageToggle() {
  const { locale, setLocale } = useLanguage();

  return (
    <div className="flex items-center gap-0.5 rounded-full border border-border bg-surface p-1 text-xs font-bold">
      <button
        onClick={() => setLocale('de')}
        className={`rounded-full px-2.5 py-1 transition-all ${
          locale === 'de'
            ? 'bg-foreground text-background'
            : 'text-muted hover:text-foreground'
        }`}
        aria-label="Deutsch"
      >
        DE
      </button>
      <button
        onClick={() => setLocale('en')}
        className={`rounded-full px-2.5 py-1 transition-all ${
          locale === 'en'
            ? 'bg-foreground text-background'
            : 'text-muted hover:text-foreground'
        }`}
        aria-label="English"
      >
        EN
      </button>
    </div>
  );
}

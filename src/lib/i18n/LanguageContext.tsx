'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { SiteContent, Locale } from './types';
import { content as en } from './en';
import { content as de } from './de';

const contentMap: Record<Locale, SiteContent> = { en, de };

interface LanguageContextValue {
  locale: Locale;
  t: SiteContent;
  setLocale: (locale: Locale) => void;
}

const LanguageContext = createContext<LanguageContextValue>({
  locale: 'en',
  t: en,
  setLocale: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');

  useEffect(() => {
    const stored = localStorage.getItem('locale') as Locale | null;
    if (stored && (stored === 'en' || stored === 'de')) {
      setLocaleState(stored);
    }
  }, []);

  function setLocale(l: Locale) {
    setLocaleState(l);
    localStorage.setItem('locale', l);
    document.documentElement.lang = l;
  }

  return (
    <LanguageContext.Provider value={{ locale, t: contentMap[locale], setLocale }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

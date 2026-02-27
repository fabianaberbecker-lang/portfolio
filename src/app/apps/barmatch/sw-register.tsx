'use client';

import { useEffect } from 'react';

export function BarMatchSWRegistration() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/bm-sw.js', { scope: '/apps/barmatch/' })
        .catch(() => {
          // SW registration failed — non-critical, app still works
        });
    }
  }, []);

  return null;
}

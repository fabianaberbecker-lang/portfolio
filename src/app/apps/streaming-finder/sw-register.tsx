'use client';

import { useEffect } from 'react';

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js', { scope: '/apps/streaming-finder/' })
        .catch(() => {
          // SW registration failed — non-critical, app still works
        });
    }
  }, []);

  return null;
}

'use client';

import { useEffect } from 'react';

export function FlowBoardSWRegistration() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/fb-sw.js', { scope: '/apps/flowboard/' })
        .catch(() => {});
    }
  }, []);

  return null;
}

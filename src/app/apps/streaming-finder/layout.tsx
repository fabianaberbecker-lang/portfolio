import type { Metadata, Viewport } from 'next';
import { ServiceWorkerRegistration } from './sw-register';

export const metadata: Metadata = {
  title: 'Streaming Finder',
  description:
    'Find where to watch any movie or TV show across 40+ countries. Stream, rent, or buy — all in one place.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'StreamFinder',
  },
};

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
};

export default function StreamingFinderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ServiceWorkerRegistration />
      {children}
    </>
  );
}

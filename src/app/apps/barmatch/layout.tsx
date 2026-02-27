import type { Metadata, Viewport } from 'next';
import { BarMatchSWRegistration } from './sw-register';

export const metadata: Metadata = {
  title: 'BarMatch',
  description:
    'Find the perfect bar with your friends. Swipe, match, and meet up — all decided together.',
  manifest: '/barmatch-manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'BarMatch',
  },
};

export const viewport: Viewport = {
  themeColor: '#0c0a14',
};

export default function BarMatchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BarMatchSWRegistration />
      {children}
    </>
  );
}

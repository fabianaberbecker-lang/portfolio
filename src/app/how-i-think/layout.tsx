import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'How I Think — Fabian Becker',
  description: 'A narrative walkthrough of my structured thinking process as a Product Manager — from problem framing to decision loops.',
};

export const viewport: Viewport = {
  themeColor: '#0f1117',
};

export default function HowIThinkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

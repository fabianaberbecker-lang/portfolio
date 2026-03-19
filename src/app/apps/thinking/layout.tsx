import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'How I Think',
  description:
    'A structured thinking tool that transforms problems into navigable reasoning spaces with hypotheses, assumptions, and risks.',
};

export const viewport: Viewport = {
  themeColor: '#0f1117',
};

export default function ThinkingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

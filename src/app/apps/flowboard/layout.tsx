import type { Metadata, Viewport } from 'next';
import { FlowBoardSWRegistration } from './sw-register';

export const metadata: Metadata = {
  title: 'FlowBoard',
  description:
    'A Kanban + Canvas organizational tool with drag-and-drop cards, freeform connectors, and a glass-inspired UI.',
  manifest: '/flowboard-manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'FlowBoard',
  },
};

export const viewport: Viewport = {
  themeColor: '#0b0d1a',
};

export default function FlowBoardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <FlowBoardSWRegistration />
      {children}
    </>
  );
}

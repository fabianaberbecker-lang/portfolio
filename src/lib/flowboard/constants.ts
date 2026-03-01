import type { CardColor, Priority, CanvasViewport } from './types';

export const DEFAULT_COLUMNS = ['Backlog', 'In Progress', 'Done'];

export const DEFAULT_VIEWPORT: CanvasViewport = {
  panX: 0,
  panY: 0,
  zoom: 1,
};

export const ZOOM_MIN = 0.25;
export const ZOOM_MAX = 2.0;
export const ZOOM_STEP = 0.1;

export const GRID_SNAP = 24;

export const CANVAS_CARD_WIDTH = 240;
export const CANVAS_CARD_MIN_HEIGHT = 80;

export const UNDO_LIMIT = 50;
export const PERSIST_DEBOUNCE_MS = 500;
export const UNDO_DEBOUNCE_MS = 300;

export const BOARD_THEMES: { key: string; from: string; to: string }[] = [
  { key: 'indigo', from: '#6366f1', to: '#818cf8' },
  { key: 'violet', from: '#8b5cf6', to: '#a78bfa' },
  { key: 'blue', from: '#3b82f6', to: '#60a5fa' },
  { key: 'cyan', from: '#06b6d4', to: '#22d3ee' },
  { key: 'teal', from: '#14b8a6', to: '#2dd4bf' },
  { key: 'emerald', from: '#10b981', to: '#34d399' },
  { key: 'amber', from: '#f59e0b', to: '#fbbf24' },
  { key: 'rose', from: '#f43f5e', to: '#fb7185' },
];

export const CARD_COLORS: { value: CardColor; label: string; cssVar: string }[] = [
  { value: 'default', label: 'Default', cssVar: 'rgba(255,255,255,0.04)' },
  { value: 'blue', label: 'Blue', cssVar: 'rgba(99,102,241,0.15)' },
  { value: 'purple', label: 'Purple', cssVar: 'rgba(168,85,247,0.15)' },
  { value: 'green', label: 'Green', cssVar: 'rgba(34,197,94,0.15)' },
  { value: 'amber', label: 'Amber', cssVar: 'rgba(245,158,11,0.15)' },
  { value: 'red', label: 'Red', cssVar: 'rgba(239,68,68,0.15)' },
  { value: 'pink', label: 'Pink', cssVar: 'rgba(236,72,153,0.15)' },
];

export function getBoardTheme(key: string) {
  return BOARD_THEMES.find((t) => t.key === key) ?? BOARD_THEMES[0];
}

export const PRIORITIES: { value: Priority; label: string; color: string }[] = [
  { value: 'none', label: 'None', color: 'transparent' },
  { value: 'low', label: 'Low', color: '#60a5fa' },
  { value: 'medium', label: 'Medium', color: '#fbbf24' },
  { value: 'high', label: 'High', color: '#f97316' },
  { value: 'urgent', label: 'Urgent', color: '#ef4444' },
];

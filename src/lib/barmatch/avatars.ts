import type { ReactNode } from 'react';
import { createElement as h } from 'react';

export interface AvatarDef {
  id: string;
  label: string;
  /** Render the avatar SVG at a given size */
  render: (size: number) => ReactNode;
}

// ── Helper: wrap an SVG icon in a consistent viewBox ──────────────────────
function svg(size: number, children: ReactNode) {
  return h(
    'svg',
    {
      width: size,
      height: size,
      viewBox: '0 0 40 40',
      fill: 'none',
      xmlns: 'http://www.w3.org/2000/svg',
    },
    children,
  );
}

// ── 6 custom avatars — fun, cute, modern ──────────────────────────────────

/** Cool Cat — rounded face with pointy ears, whiskers, little smile */
function CoolCat(size: number) {
  return svg(size, [
    // Face
    h('circle', { key: 'face', cx: 20, cy: 22, r: 14, fill: '#FFC078' }),
    // Left ear
    h('polygon', { key: 'earL', points: '8,12 4,2 14,8', fill: '#FFA94D' }),
    // Right ear
    h('polygon', { key: 'earR', points: '32,12 36,2 26,8', fill: '#FFA94D' }),
    // Inner ears
    h('polygon', { key: 'earLi', points: '9,11 6,4 13,9', fill: '#FFD8A8' }),
    h('polygon', { key: 'earRi', points: '31,11 34,4 27,9', fill: '#FFD8A8' }),
    // Eyes
    h('circle', { key: 'eyeL', cx: 14, cy: 20, r: 2.5, fill: '#1a1a2e' }),
    h('circle', { key: 'eyeR', cx: 26, cy: 20, r: 2.5, fill: '#1a1a2e' }),
    // Eye shine
    h('circle', { key: 'shineL', cx: 15, cy: 19, r: 0.8, fill: '#fff' }),
    h('circle', { key: 'shineR', cx: 27, cy: 19, r: 0.8, fill: '#fff' }),
    // Nose
    h('ellipse', { key: 'nose', cx: 20, cy: 24, rx: 1.5, ry: 1, fill: '#E8590C' }),
    // Mouth
    h('path', {
      key: 'mouth',
      d: 'M17 26 Q20 29 23 26',
      stroke: '#1a1a2e',
      strokeWidth: 1,
      fill: 'none',
      strokeLinecap: 'round',
    }),
    // Whiskers
    h('line', { key: 'w1', x1: 4, y1: 22, x2: 12, y2: 23, stroke: '#1a1a2e', strokeWidth: 0.7 }),
    h('line', { key: 'w2', x1: 5, y1: 26, x2: 12, y2: 25, stroke: '#1a1a2e', strokeWidth: 0.7 }),
    h('line', { key: 'w3', x1: 28, y1: 23, x2: 36, y2: 22, stroke: '#1a1a2e', strokeWidth: 0.7 }),
    h('line', { key: 'w4', x1: 28, y1: 25, x2: 35, y2: 26, stroke: '#1a1a2e', strokeWidth: 0.7 }),
  ]);
}

/** Party Ghost — rounded blob shape, wide eyes, open mouth, tiny blush */
function PartyGhost(size: number) {
  return svg(size, [
    // Body (wavy bottom ghost shape)
    h('path', {
      key: 'body',
      d: 'M10 18 C10 8, 30 8, 30 18 L30 32 Q28 28 25 32 Q22 36 20 32 Q18 28 15 32 Q12 36 10 32 Z',
      fill: '#E9ECEF',
    }),
    // Blush
    h('circle', { key: 'blushL', cx: 13, cy: 24, r: 2.5, fill: '#FFB4C2', opacity: 0.5 }),
    h('circle', { key: 'blushR', cx: 27, cy: 24, r: 2.5, fill: '#FFB4C2', opacity: 0.5 }),
    // Eyes — big and round
    h('circle', { key: 'eyeL', cx: 15, cy: 19, r: 3.5, fill: '#1a1a2e' }),
    h('circle', { key: 'eyeR', cx: 25, cy: 19, r: 3.5, fill: '#1a1a2e' }),
    // Eye shine
    h('circle', { key: 'shineL', cx: 16.5, cy: 17.5, r: 1.2, fill: '#fff' }),
    h('circle', { key: 'shineR', cx: 26.5, cy: 17.5, r: 1.2, fill: '#fff' }),
    // Cute open mouth
    h('ellipse', { key: 'mouth', cx: 20, cy: 26, rx: 2.5, ry: 2, fill: '#1a1a2e' }),
  ]);
}

/** Disco Fox — fox face with big ears, warm orange, cool expression */
function DiscoFox(size: number) {
  return svg(size, [
    // Face
    h('path', {
      key: 'face',
      d: 'M20 6 L6 16 Q6 36 20 36 Q34 36 34 16 Z',
      fill: '#FF922B',
    }),
    // White muzzle
    h('path', {
      key: 'muzzle',
      d: 'M13 22 Q13 36 20 36 Q27 36 27 22 Q20 20 13 22',
      fill: '#FFF5F5',
    }),
    // Ear tips
    h('polygon', { key: 'earTipL', points: '20,6 6,16 11,14', fill: '#E8590C' }),
    h('polygon', { key: 'earTipR', points: '20,6 34,16 29,14', fill: '#E8590C' }),
    // Eyes — sly
    h('ellipse', { key: 'eyeL', cx: 15, cy: 20, rx: 2, ry: 2.5, fill: '#1a1a2e' }),
    h('ellipse', { key: 'eyeR', cx: 25, cy: 20, rx: 2, ry: 2.5, fill: '#1a1a2e' }),
    // Eye shine
    h('circle', { key: 'shineL', cx: 16, cy: 19, r: 0.8, fill: '#fff' }),
    h('circle', { key: 'shineR', cx: 26, cy: 19, r: 0.8, fill: '#fff' }),
    // Nose
    h('ellipse', { key: 'nose', cx: 20, cy: 26, rx: 2, ry: 1.5, fill: '#1a1a2e' }),
    // Smile
    h('path', {
      key: 'smile',
      d: 'M17 29 Q20 32 23 29',
      stroke: '#1a1a2e',
      strokeWidth: 0.8,
      fill: 'none',
      strokeLinecap: 'round',
    }),
  ]);
}

/** Chill Panda — round face, classic black-and-white, cute expression */
function ChillPanda(size: number) {
  return svg(size, [
    // Face
    h('circle', { key: 'face', cx: 20, cy: 22, r: 14, fill: '#F8F9FA' }),
    // Ears (black circles behind head)
    h('circle', { key: 'earL', cx: 9, cy: 12, r: 5, fill: '#1a1a2e' }),
    h('circle', { key: 'earR', cx: 31, cy: 12, r: 5, fill: '#1a1a2e' }),
    // Eye patches
    h('ellipse', { key: 'patchL', cx: 14, cy: 20, rx: 5, ry: 4.5, fill: '#1a1a2e', transform: 'rotate(-10 14 20)' }),
    h('ellipse', { key: 'patchR', cx: 26, cy: 20, rx: 5, ry: 4.5, fill: '#1a1a2e', transform: 'rotate(10 26 20)' }),
    // Eyes
    h('circle', { key: 'eyeL', cx: 14, cy: 20, r: 2, fill: '#fff' }),
    h('circle', { key: 'eyeR', cx: 26, cy: 20, r: 2, fill: '#fff' }),
    // Pupils
    h('circle', { key: 'pupilL', cx: 14.5, cy: 20, r: 1, fill: '#1a1a2e' }),
    h('circle', { key: 'pupilR', cx: 26.5, cy: 20, r: 1, fill: '#1a1a2e' }),
    // Nose
    h('ellipse', { key: 'nose', cx: 20, cy: 26, rx: 2, ry: 1.2, fill: '#1a1a2e' }),
    // Mouth
    h('path', {
      key: 'mouth',
      d: 'M18 28 Q20 30 22 28',
      stroke: '#1a1a2e',
      strokeWidth: 0.8,
      fill: 'none',
      strokeLinecap: 'round',
    }),
    // Blush
    h('circle', { key: 'blushL', cx: 10, cy: 26, r: 2, fill: '#FFB4C2', opacity: 0.4 }),
    h('circle', { key: 'blushR', cx: 30, cy: 26, r: 2, fill: '#FFB4C2', opacity: 0.4 }),
  ]);
}

/** Neon Robot — boxy head with antenna, pixel-art feel, glowing eyes */
function NeonRobot(size: number) {
  return svg(size, [
    // Antenna
    h('line', { key: 'ant', x1: 20, y1: 2, x2: 20, y2: 8, stroke: '#868E96', strokeWidth: 1.5 }),
    h('circle', { key: 'antTip', cx: 20, cy: 2, r: 2, fill: '#51CF66' }),
    // Head (rounded rectangle)
    h('rect', { key: 'head', x: 7, y: 8, width: 26, height: 24, rx: 5, fill: '#495057' }),
    // Face plate
    h('rect', { key: 'plate', x: 10, y: 11, width: 20, height: 18, rx: 3, fill: '#343A40' }),
    // Eyes (glowing)
    h('rect', { key: 'eyeL', x: 13, y: 16, width: 5, height: 4, rx: 1, fill: '#00D9FF' }),
    h('rect', { key: 'eyeR', x: 22, y: 16, width: 5, height: 4, rx: 1, fill: '#00D9FF' }),
    // Eye glow
    h('rect', { key: 'glowL', x: 13, y: 16, width: 5, height: 4, rx: 1, fill: '#00D9FF', opacity: 0.3, filter: 'url(#none)' }),
    h('rect', { key: 'glowR', x: 22, y: 16, width: 5, height: 4, rx: 1, fill: '#00D9FF', opacity: 0.3 }),
    // Mouth (grid of dots)
    h('circle', { key: 'm1', cx: 16, cy: 25, r: 1, fill: '#00D9FF', opacity: 0.6 }),
    h('circle', { key: 'm2', cx: 20, cy: 25, r: 1, fill: '#00D9FF', opacity: 0.6 }),
    h('circle', { key: 'm3', cx: 24, cy: 25, r: 1, fill: '#00D9FF', opacity: 0.6 }),
    // Ear bolts
    h('circle', { key: 'boltL', cx: 7, cy: 20, r: 2, fill: '#868E96' }),
    h('circle', { key: 'boltR', cx: 33, cy: 20, r: 2, fill: '#868E96' }),
  ]);
}

/** Magic Owl — round body, big round eyes, tiny beak, tufts */
function MagicOwl(size: number) {
  return svg(size, [
    // Body
    h('ellipse', { key: 'body', cx: 20, cy: 24, rx: 14, ry: 14, fill: '#845EF7' }),
    // Belly
    h('ellipse', { key: 'belly', cx: 20, cy: 28, rx: 8, ry: 8, fill: '#B197FC' }),
    // Ear tufts
    h('polygon', { key: 'tuftL', points: '10,12 6,2 16,10', fill: '#7048C6' }),
    h('polygon', { key: 'tuftR', points: '30,12 34,2 24,10', fill: '#7048C6' }),
    // Eye whites (big!)
    h('circle', { key: 'eyeWhiteL', cx: 14, cy: 19, r: 5.5, fill: '#fff' }),
    h('circle', { key: 'eyeWhiteR', cx: 26, cy: 19, r: 5.5, fill: '#fff' }),
    // Pupils
    h('circle', { key: 'pupilL', cx: 15, cy: 19, r: 3, fill: '#1a1a2e' }),
    h('circle', { key: 'pupilR', cx: 27, cy: 19, r: 3, fill: '#1a1a2e' }),
    // Eye shine
    h('circle', { key: 'shineL', cx: 16, cy: 17.5, r: 1.2, fill: '#fff' }),
    h('circle', { key: 'shineR', cx: 28, cy: 17.5, r: 1.2, fill: '#fff' }),
    // Beak
    h('polygon', { key: 'beak', points: '20,24 18,27 22,27', fill: '#FFC078' }),
    // Feet
    h('ellipse', { key: 'footL', cx: 16, cy: 37, rx: 3, ry: 1.5, fill: '#FFC078' }),
    h('ellipse', { key: 'footR', cx: 24, cy: 37, rx: 3, ry: 1.5, fill: '#FFC078' }),
  ]);
}

// ── Exported avatar list ──────────────────────────────────────────────────

export const AVATARS: AvatarDef[] = [
  { id: 'cat', label: 'Cool Cat', render: CoolCat },
  { id: 'ghost', label: 'Party Ghost', render: PartyGhost },
  { id: 'fox', label: 'Disco Fox', render: DiscoFox },
  { id: 'panda', label: 'Chill Panda', render: ChillPanda },
  { id: 'robot', label: 'Neon Robot', render: NeonRobot },
  { id: 'owl', label: 'Magic Owl', render: MagicOwl },
];

export function getAvatarById(avatarId?: string): AvatarDef | null {
  if (!avatarId) return null;
  return AVATARS.find((a) => a.id === avatarId) ?? null;
}

/** @deprecated Use getAvatarById().render() instead */
export function getAvatarEmoji(avatarId?: string): string | null {
  return null;
}

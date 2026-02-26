import type { ComponentType } from 'react';
import { StickerStar } from './StickerStar';
import { StickerCamera } from './StickerCamera';
import { StickerSearch } from './StickerSearch';
import { StickerPlay } from './StickerPlay';
import { StickerGlobe } from './StickerGlobe';
import { StickerRocket } from './StickerRocket';
import { StickerCode } from './StickerCode';
import { StickerChart } from './StickerChart';
import { StickerMail } from './StickerMail';
import { StickerLightning } from './StickerLightning';
import { StickerHandshake } from './StickerHandshake';

interface StickerProps {
  className?: string;
  color?: string;
  size?: number;
}

export const stickerMap: Record<string, ComponentType<StickerProps>> = {
  star: StickerStar,
  camera: StickerCamera,
  search: StickerSearch,
  play: StickerPlay,
  globe: StickerGlobe,
  rocket: StickerRocket,
  code: StickerCode,
  chart: StickerChart,
  mail: StickerMail,
  lightning: StickerLightning,
  handshake: StickerHandshake,
};

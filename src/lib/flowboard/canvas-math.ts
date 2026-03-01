import type { Anchor, FlowCard } from './types';
import { CANVAS_CARD_WIDTH, CANVAS_CARD_MIN_HEIGHT } from './constants';

export interface Point {
  x: number;
  y: number;
}

export function getAnchorPoint(
  card: FlowCard,
  anchor: Anchor,
  cardHeight = CANVAS_CARD_MIN_HEIGHT,
): Point {
  const { canvasX: x, canvasY: y } = card;
  const w = CANVAS_CARD_WIDTH;
  const h = cardHeight;

  switch (anchor) {
    case 'top':
      return { x: x + w / 2, y };
    case 'right':
      return { x: x + w, y: y + h / 2 };
    case 'bottom':
      return { x: x + w / 2, y: y + h };
    case 'left':
      return { x, y: y + h / 2 };
  }
}

export function cubicBezierPath(from: Point, to: Point, fromAnchor: Anchor, toAnchor: Anchor): string {
  const offset = Math.max(60, Math.abs(to.x - from.x) * 0.4, Math.abs(to.y - from.y) * 0.4);

  const cp1 = controlPointOffset(from, fromAnchor, offset);
  const cp2 = controlPointOffset(to, toAnchor, offset);

  return `M ${from.x} ${from.y} C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${to.x} ${to.y}`;
}

function controlPointOffset(point: Point, anchor: Anchor, offset: number): Point {
  switch (anchor) {
    case 'top':
      return { x: point.x, y: point.y - offset };
    case 'right':
      return { x: point.x + offset, y: point.y };
    case 'bottom':
      return { x: point.x, y: point.y + offset };
    case 'left':
      return { x: point.x - offset, y: point.y };
  }
}

export function getBestAnchors(
  fromCard: FlowCard,
  toCard: FlowCard,
): { fromAnchor: Anchor; toAnchor: Anchor } {
  const fromCenter: Point = {
    x: fromCard.canvasX + CANVAS_CARD_WIDTH / 2,
    y: fromCard.canvasY + CANVAS_CARD_MIN_HEIGHT / 2,
  };
  const toCenter: Point = {
    x: toCard.canvasX + CANVAS_CARD_WIDTH / 2,
    y: toCard.canvasY + CANVAS_CARD_MIN_HEIGHT / 2,
  };

  const dx = toCenter.x - fromCenter.x;
  const dy = toCenter.y - fromCenter.y;

  let fromAnchor: Anchor;
  let toAnchor: Anchor;

  if (Math.abs(dx) > Math.abs(dy)) {
    fromAnchor = dx > 0 ? 'right' : 'left';
    toAnchor = dx > 0 ? 'left' : 'right';
  } else {
    fromAnchor = dy > 0 ? 'bottom' : 'top';
    toAnchor = dy > 0 ? 'top' : 'bottom';
  }

  return { fromAnchor, toAnchor };
}

export function screenToCanvas(
  screenX: number,
  screenY: number,
  panX: number,
  panY: number,
  zoom: number,
  containerRect: DOMRect,
): Point {
  return {
    x: (screenX - containerRect.left - panX) / zoom,
    y: (screenY - containerRect.top - panY) / zoom,
  };
}

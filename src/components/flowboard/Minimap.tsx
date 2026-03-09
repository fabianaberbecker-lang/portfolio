'use client';

import { useMemo, useCallback } from 'react';
import type { FlowCard, Connector } from '@/lib/flowboard/types';
import { CANVAS_CARD_WIDTH, CANVAS_CARD_MIN_HEIGHT } from '@/lib/flowboard/constants';

interface MinimapProps {
  cards: FlowCard[];
  connectors: Connector[];
  panX: number;
  panY: number;
  zoom: number;
  containerWidth: number;
  containerHeight: number;
  selectedCardIds: string[];
  onNavigate: (panX: number, panY: number) => void;
}

const MINIMAP_W = 160;
const MINIMAP_H = 100;
const PADDING = 40;

export function Minimap({
  cards,
  connectors,
  panX,
  panY,
  zoom,
  containerWidth,
  containerHeight,
  selectedCardIds,
  onNavigate,
}: MinimapProps) {
  // Calculate bounds of all cards
  const bounds = useMemo(() => {
    if (cards.length === 0) return { minX: 0, minY: 0, maxX: 500, maxY: 300 };
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const c of cards) {
      minX = Math.min(minX, c.canvasX);
      minY = Math.min(minY, c.canvasY);
      maxX = Math.max(maxX, c.canvasX + CANVAS_CARD_WIDTH);
      maxY = Math.max(maxY, c.canvasY + CANVAS_CARD_MIN_HEIGHT);
    }
    return {
      minX: minX - PADDING,
      minY: minY - PADDING,
      maxX: maxX + PADDING,
      maxY: maxY + PADDING,
    };
  }, [cards]);

  const worldW = bounds.maxX - bounds.minX;
  const worldH = bounds.maxY - bounds.minY;
  const scale = Math.min(MINIMAP_W / worldW, MINIMAP_H / worldH);

  // Viewport rectangle in minimap coords
  const vpLeft = (-panX / zoom - bounds.minX) * scale;
  const vpTop = (-panY / zoom - bounds.minY) * scale;
  const vpW = (containerWidth / zoom) * scale;
  const vpH = (containerHeight / zoom) * scale;

  const selectedSet = useMemo(() => new Set(selectedCardIds), [selectedCardIds]);

  const handleClick = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    // Convert minimap click to world coords, center viewport there
    const worldX = mx / scale + bounds.minX;
    const worldY = my / scale + bounds.minY;
    const newPanX = -(worldX - containerWidth / (2 * zoom)) * zoom;
    const newPanY = -(worldY - containerHeight / (2 * zoom)) * zoom;
    onNavigate(newPanX, newPanY);
  }, [scale, bounds, containerWidth, containerHeight, zoom, onNavigate]);

  if (cards.length === 0) return null;

  return (
    <div className="absolute bottom-14 right-3 z-10 glass-toolbar rounded-xl p-1.5 opacity-70 transition-opacity hover:opacity-100">
      <svg
        width={MINIMAP_W}
        height={MINIMAP_H}
        className="cursor-pointer"
        onClick={handleClick}
      >
        {/* Connector lines */}
        {connectors.map((conn) => {
          const from = cards.find((c) => c.id === conn.fromCardId);
          const to = cards.find((c) => c.id === conn.toCardId);
          if (!from || !to) return null;
          return (
            <line
              key={conn.id}
              x1={(from.canvasX + CANVAS_CARD_WIDTH / 2 - bounds.minX) * scale}
              y1={(from.canvasY + CANVAS_CARD_MIN_HEIGHT / 2 - bounds.minY) * scale}
              x2={(to.canvasX + CANVAS_CARD_WIDTH / 2 - bounds.minX) * scale}
              y2={(to.canvasY + CANVAS_CARD_MIN_HEIGHT / 2 - bounds.minY) * scale}
              stroke="rgba(99,102,241,0.3)"
              strokeWidth="1"
            />
          );
        })}

        {/* Card rectangles */}
        {cards.map((card) => (
          <rect
            key={card.id}
            x={(card.canvasX - bounds.minX) * scale}
            y={(card.canvasY - bounds.minY) * scale}
            width={CANVAS_CARD_WIDTH * scale}
            height={CANVAS_CARD_MIN_HEIGHT * scale}
            rx={2}
            fill={selectedSet.has(card.id) ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.15)'}
            stroke={selectedSet.has(card.id) ? 'rgba(99,102,241,0.8)' : 'rgba(255,255,255,0.1)'}
            strokeWidth="0.5"
          />
        ))}

        {/* Viewport rectangle */}
        <rect
          x={vpLeft}
          y={vpTop}
          width={vpW}
          height={vpH}
          fill="none"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="1"
          strokeDasharray="3 2"
          rx={2}
        />
      </svg>
    </div>
  );
}

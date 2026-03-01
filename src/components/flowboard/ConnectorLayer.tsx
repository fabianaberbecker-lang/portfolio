'use client';

import { useMemo } from 'react';
import type { Connector, FlowCard } from '@/lib/flowboard/types';
import { getAnchorPoint, cubicBezierPath } from '@/lib/flowboard/canvas-math';
import { CanvasConnector } from './CanvasConnector';

interface ConnectorLayerProps {
  connectors: Connector[];
  cards: FlowCard[];
  dragOverride: { cardId: string; x: number; y: number } | null;
  connectingFrom: { cardId: string; x: number; y: number } | null;
  connectingMouse: { x: number; y: number } | null;
}

export function ConnectorLayer({
  connectors,
  cards,
  dragOverride,
  connectingFrom,
  connectingMouse,
}: ConnectorLayerProps) {
  // Build a card lookup with drag override applied
  const cardMap = useMemo(() => {
    const map = new Map<string, FlowCard>();
    for (const card of cards) {
      if (dragOverride && card.id === dragOverride.cardId) {
        map.set(card.id, { ...card, canvasX: dragOverride.x, canvasY: dragOverride.y });
      } else {
        map.set(card.id, card);
      }
    }
    return map;
  }, [cards, dragOverride]);

  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
      style={{ zIndex: 1 }}
    >
      {connectors.map((conn) => {
        const fromCard = cardMap.get(conn.fromCardId);
        const toCard = cardMap.get(conn.toCardId);
        if (!fromCard || !toCard) return null;

        const from = getAnchorPoint(fromCard, conn.fromAnchor);
        const to = getAnchorPoint(toCard, conn.toAnchor);
        const d = cubicBezierPath(from, to, conn.fromAnchor, conn.toAnchor);

        return (
          <CanvasConnector
            key={conn.id}
            connector={conn}
            path={d}
          />
        );
      })}

      {/* In-progress connector */}
      {connectingFrom && connectingMouse && (
        <path
          d={`M ${connectingFrom.x} ${connectingFrom.y} L ${connectingMouse.x} ${connectingMouse.y}`}
          stroke="rgba(99,102,241,0.5)"
          strokeWidth="2"
          strokeDasharray="6 3"
          fill="none"
        />
      )}
    </svg>
  );
}

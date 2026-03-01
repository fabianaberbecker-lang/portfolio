'use client';

import { useRef, useState, useCallback } from 'react';
import type { FlowCard } from '@/lib/flowboard/types';
import { useFlowBoardStore } from '@/lib/flowboard/store';
import { CARD_COLORS, CANVAS_CARD_WIDTH, CANVAS_CARD_MIN_HEIGHT } from '@/lib/flowboard/constants';
import { PriorityBadge } from './PriorityBadge';

interface CanvasCardProps {
  card: FlowCard;
  zoom: number;
  onDragUpdate: (x: number, y: number) => void;
  onDragEnd: () => void;
  onConnectorStart: (cardId: string, anchorX: number, anchorY: number) => void;
  onConnectorEnd: (cardId: string) => void;
  isConnecting: boolean;
}

export function CanvasCard({
  card,
  zoom,
  onDragUpdate,
  onDragEnd,
  onConnectorStart,
  onConnectorEnd,
  isConnecting,
}: CanvasCardProps) {
  const moveCardOnCanvas = useFlowBoardStore((s) => s.moveCardOnCanvas);
  const selectCard = useFlowBoardStore((s) => s.selectCard);
  const setEditingCard = useFlowBoardStore((s) => s.setEditingCard);
  const isSelected = useFlowBoardStore((s) => s.selectedCardIds.includes(card.id));

  const [isDragging, setIsDragging] = useState(false);
  const [localX, setLocalX] = useState(card.canvasX);
  const [localY, setLocalY] = useState(card.canvasY);
  const [isHovered, setIsHovered] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, cardX: 0, cardY: 0 });

  const colorBg = card.color !== 'default'
    ? CARD_COLORS.find((c) => c.value === card.color)?.cssVar
    : 'rgba(255,255,255,0.04)';

  const displayX = isDragging ? localX : card.canvasX;
  const displayY = isDragging ? localY : card.canvasY;

  function handlePointerDown(e: React.PointerEvent) {
    if (e.button !== 0) return;
    e.stopPropagation();
    e.preventDefault();

    // If connecting, this is the target
    if (isConnecting) {
      onConnectorEnd(card.id);
      return;
    }

    selectCard(card.id, e.shiftKey);
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      cardX: card.canvasX,
      cardY: card.canvasY,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!isDragging) return;
    const dx = (e.clientX - dragStart.current.x) / zoom;
    const dy = (e.clientY - dragStart.current.y) / zoom;
    const newX = Math.round(dragStart.current.cardX + dx);
    const newY = Math.round(dragStart.current.cardY + dy);
    setLocalX(newX);
    setLocalY(newY);
    onDragUpdate(newX, newY);
  }

  function handlePointerUp() {
    if (!isDragging) return;
    setIsDragging(false);
    moveCardOnCanvas(card.id, localX, localY);
    onDragEnd();
  }

  // Anchor points for connectors
  const anchors = [
    { anchor: 'top' as const, x: CANVAS_CARD_WIDTH / 2, y: 0 },
    { anchor: 'right' as const, x: CANVAS_CARD_WIDTH, y: CANVAS_CARD_MIN_HEIGHT / 2 },
    { anchor: 'bottom' as const, x: CANVAS_CARD_WIDTH / 2, y: CANVAS_CARD_MIN_HEIGHT },
    { anchor: 'left' as const, x: 0, y: CANVAS_CARD_MIN_HEIGHT / 2 },
  ];

  return (
    <div
      className={`absolute select-none ${isDragging ? 'z-10' : 'z-0'}`}
      style={{
        left: displayX,
        top: displayY,
        width: CANVAS_CARD_WIDTH,
        willChange: isDragging ? 'transform' : 'auto',
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
      onDoubleClick={(e) => {
        e.stopPropagation();
        setEditingCard(card.id);
      }}
    >
      {/* Card body */}
      <div
        className={`rounded-xl border p-3 transition-colors backdrop-blur-sm ${
          isDragging ? 'cursor-grabbing shadow-xl shadow-black/30' : 'cursor-grab'
        } ${
          isSelected
            ? 'border-indigo-500/50 shadow-lg shadow-indigo-500/10'
            : 'border-white/[0.08] hover:border-white/15'
        }`}
        style={{
          background: colorBg,
          boxShadow: isDragging ? undefined : '0 2px 8px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.06)',
        }}
      >
        <div className="flex items-start gap-2">
          {card.priority !== 'none' && <PriorityBadge priority={card.priority} />}
          <span className="flex-1 text-xs font-medium text-white/90 leading-snug">
            {card.title}
          </span>
        </div>
        {card.description && (
          <p className="mt-1 text-[10px] text-white/30 line-clamp-2">
            {card.description}
          </p>
        )}
        {card.labels.length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-0.5">
            {card.labels.slice(0, 3).map((label) => (
              <span
                key={label}
                className="rounded-full bg-white/10 px-1.5 py-0.5 text-[9px] text-white/40"
              >
                {label}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Connector anchor points — shown on hover */}
      {(isHovered || isSelected) && !isDragging && (
        <>
          {anchors.map((a) => (
            <div
              key={a.anchor}
              className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 cursor-crosshair rounded-full border-2 border-indigo-400 bg-[#0b0d1a] transition-all hover:scale-150 hover:bg-indigo-500"
              style={{ left: a.x, top: a.y }}
              onPointerDown={(e) => {
                e.stopPropagation();
                onConnectorStart(card.id, displayX + a.x, displayY + a.y);
              }}
            />
          ))}
        </>
      )}
    </div>
  );
}

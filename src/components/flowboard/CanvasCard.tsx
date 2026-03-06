'use client';

import { useRef, useState, useCallback } from 'react';
import type { FlowCard } from '@/lib/flowboard/types';
import { useFlowBoardStore } from '@/lib/flowboard/store';
import { CARD_COLORS, CANVAS_CARD_WIDTH, CANVAS_CARD_MIN_HEIGHT } from '@/lib/flowboard/constants';
import { getDueDateStatus, formatDueDate } from '@/lib/flowboard/utils';
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
        className={`glass-card-sm p-3 ${
          isDragging ? 'cursor-grabbing !shadow-xl !shadow-black/30' : 'cursor-grab'
        } ${
          isSelected
            ? '!border-indigo-500/50 !shadow-lg !shadow-indigo-500/10'
            : ''
        }`}
        style={{
          ...(colorBg ? { background: colorBg } : {}),
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
        {/* Due date */}
        {card.dueDate && (() => {
          const cl = card.checklist ?? [];
          const allDone = cl.length > 0 && cl.every((i) => i.done);
          const status = getDueDateStatus(card.dueDate, allDone);
          const sc: Record<string, string> = {
            overdue: 'bg-red-500/15 text-red-400',
            soon: 'bg-amber-500/15 text-amber-400',
            complete: 'bg-emerald-500/15 text-emerald-400 line-through',
            normal: 'text-white/25',
          };
          return (
            <div className={`mt-1.5 inline-flex items-center gap-0.5 rounded px-1 py-0.5 text-[9px] ${sc[status ?? 'normal']}`}>
              <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {formatDueDate(card.dueDate)}
            </div>
          );
        })()}
        {/* Meta footer */}
        {((card.checklist?.length ?? 0) > 0 || (card.comments?.length ?? 0) > 0 || (card.assignees?.length ?? 0) > 0) && (
          <div className="mt-1.5 flex items-center gap-2 text-[9px] text-white/25">
            {(card.checklist?.length ?? 0) > 0 && (() => {
              const done = card.checklist!.filter((i) => i.done).length;
              const total = card.checklist!.length;
              const allDone = done === total;
              return (
                <span className={`flex items-center gap-0.5 ${allDone ? 'text-emerald-400/60' : ''}`}>
                  <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  {done}/{total}
                </span>
              );
            })()}
            {(card.comments?.length ?? 0) > 0 && (
              <span className="flex items-center gap-0.5">
                <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                {card.comments!.length}
              </span>
            )}
            {(card.assignees?.length ?? 0) > 0 && (
              <span className="ml-auto flex items-center">
                {card.assignees!.slice(0, 2).map((name, i) => {
                  const colors = ['bg-indigo-500','bg-pink-500','bg-amber-500','bg-emerald-500','bg-cyan-500','bg-violet-500','bg-rose-500','bg-teal-500'];
                  let hash = 0;
                  for (let j = 0; j < name.length; j++) hash = name.charCodeAt(j) + ((hash << 5) - hash);
                  const bg = colors[Math.abs(hash) % colors.length];
                  return (
                    <span
                      key={name}
                      className={`flex h-4 w-4 items-center justify-center rounded-full text-[7px] font-bold text-white ring-1 ring-[#0c0e1c] ${bg}`}
                      style={{ marginLeft: i > 0 ? -3 : 0 }}
                      title={name}
                    >
                      {name[0].toUpperCase()}
                    </span>
                  );
                })}
                {card.assignees!.length > 2 && (
                  <span className="ml-0.5 text-[8px] text-white/20">+{card.assignees!.length - 2}</span>
                )}
              </span>
            )}
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

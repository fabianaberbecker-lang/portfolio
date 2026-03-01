'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { FlowCard } from '@/lib/flowboard/types';
import { useFlowBoardStore } from '@/lib/flowboard/store';
import { CARD_COLORS, PRIORITIES } from '@/lib/flowboard/constants';
import { PriorityBadge } from './PriorityBadge';

interface KanbanCardProps {
  card: FlowCard;
  isOverlay?: boolean;
}

export function KanbanCard({ card, isOverlay = false }: KanbanCardProps) {
  const setEditingCard = useFlowBoardStore((s) => s.setEditingCard);
  const selectCard = useFlowBoardStore((s) => s.selectCard);
  const isSelected = useFlowBoardStore((s) => s.selectedCardIds.includes(card.id));

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id, disabled: isOverlay });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  const colorBg = card.color !== 'default'
    ? CARD_COLORS.find((c) => c.value === card.color)?.cssVar
    : undefined;

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onClick={(e) => {
        e.stopPropagation();
        selectCard(card.id, e.shiftKey);
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        setEditingCard(card.id);
      }}
      className={`group cursor-grab rounded-xl border p-3 transition-all active:cursor-grabbing backdrop-blur-sm ${
        isSelected
          ? 'border-indigo-500/50 bg-indigo-500/[0.08] shadow-lg shadow-indigo-500/5'
          : 'border-white/[0.06] bg-white/[0.03] hover:border-white/10 hover:bg-white/[0.06]'
      }`}
      style={{
        ...style,
        ...(colorBg ? { background: colorBg } : {}),
      }}
    >
      {/* Priority + title */}
      <div className="flex items-start gap-2">
        {card.priority !== 'none' && <PriorityBadge priority={card.priority} />}
        <span className="flex-1 text-sm font-medium text-white/90 leading-snug">
          {card.title}
        </span>
      </div>

      {/* Description preview */}
      {card.description && (
        <p className="mt-1.5 text-xs text-white/30 line-clamp-2">
          {card.description}
        </p>
      )}

      {/* Labels */}
      {card.labels.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {card.labels.map((label) => (
            <span
              key={label}
              className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium text-white/50"
            >
              {label}
            </span>
          ))}
        </div>
      )}

      {/* Due date */}
      {card.dueDate && (
        <div className="mt-2 flex items-center gap-1 text-[10px] text-white/25">
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {new Date(card.dueDate).toLocaleDateString()}
        </div>
      )}
    </div>
  );
}

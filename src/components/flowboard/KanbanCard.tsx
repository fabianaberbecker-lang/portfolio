'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { FlowCard } from '@/lib/flowboard/types';
import { useFlowBoardStore } from '@/lib/flowboard/store';
import { CARD_COLORS } from '@/lib/flowboard/constants';
import { getDueDateStatus, formatDueDate } from '@/lib/flowboard/utils';
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
      className={`glass-card-sm group cursor-grab p-3 active:cursor-grabbing ${
        isSelected
          ? '!border-indigo-500/50 !shadow-lg !shadow-indigo-500/5'
          : ''
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
      {card.dueDate && (() => {
        const checklist = card.checklist ?? [];
        const allDone = checklist.length > 0 && checklist.every((i) => i.done);
        const status = getDueDateStatus(card.dueDate, allDone);
        const statusClasses: Record<string, string> = {
          overdue: 'bg-red-500/15 text-red-400',
          soon: 'bg-amber-500/15 text-amber-400',
          complete: 'bg-emerald-500/15 text-emerald-400 line-through',
          normal: 'text-white/25',
        };
        return (
          <div className={`mt-2 inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] ${statusClasses[status ?? 'normal']}`}>
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formatDueDate(card.dueDate)}
          </div>
        );
      })()}

      {/* Card meta footer: checklist, comments, assignees */}
      {((card.checklist?.length ?? 0) > 0 || (card.comments?.length ?? 0) > 0 || (card.assignees?.length ?? 0) > 0) && (
        <div className="mt-2 flex items-center gap-2.5 text-[10px] text-white/25">
          {(card.checklist?.length ?? 0) > 0 && (() => {
            const done = card.checklist!.filter((i) => i.done).length;
            const total = card.checklist!.length;
            const allDone = done === total;
            return (
              <span className={`flex items-center gap-1 ${allDone ? 'text-emerald-400/60' : ''}`}>
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                {done}/{total}
              </span>
            );
          })()}
          {(card.comments?.length ?? 0) > 0 && (
            <span className="flex items-center gap-1">
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              {card.comments!.length}
            </span>
          )}
          {(card.assignees?.length ?? 0) > 0 && (
            <span className="ml-auto flex items-center">
              {card.assignees!.slice(0, 3).map((name, i) => {
                const colors = ['bg-indigo-500','bg-pink-500','bg-amber-500','bg-emerald-500','bg-cyan-500','bg-violet-500','bg-rose-500','bg-teal-500'];
                let hash = 0;
                for (let j = 0; j < name.length; j++) hash = name.charCodeAt(j) + ((hash << 5) - hash);
                const bg = colors[Math.abs(hash) % colors.length];
                return (
                  <span
                    key={name}
                    className={`flex h-5 w-5 items-center justify-center rounded-full text-[8px] font-bold text-white ring-1 ring-[#0c0e1c] ${bg}`}
                    style={{ marginLeft: i > 0 ? -4 : 0 }}
                    title={name}
                  >
                    {name[0].toUpperCase()}
                  </span>
                );
              })}
              {card.assignees!.length > 3 && (
                <span className="ml-0.5 text-[9px] text-white/20">+{card.assignees!.length - 3}</span>
              )}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

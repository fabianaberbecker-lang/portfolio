'use client';

import { useMemo, useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { FlowColumn, FlowCard } from '@/lib/flowboard/types';
import { useFlowBoardStore } from '@/lib/flowboard/store';
import { KanbanCard } from './KanbanCard';
import { ColumnHeader } from './ColumnHeader';

interface KanbanColumnProps {
  column: FlowColumn;
  cards: FlowCard[];
  boardId: string;
}

export function KanbanColumn({ column, cards, boardId }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });
  const addCard = useFlowBoardStore((s) => s.addCard);
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  const cardIds = useMemo(() => cards.map((c) => c.id), [cards]);

  function handleAdd() {
    const title = newTitle.trim();
    if (title) {
      addCard(boardId, column.id, title);
      setNewTitle('');
    }
    setIsAdding(false);
  }

  return (
    <div
      ref={setNodeRef}
      className={`glass-panel flex w-72 shrink-0 flex-col transition-colors ${
        isOver
          ? 'border-indigo-500/30 bg-indigo-500/[0.04]'
          : ''
      }`}
    >
      <ColumnHeader column={column} cardCount={cards.length} />

      {/* Card list */}
      <div className="flex flex-1 flex-col gap-2 overflow-y-auto px-2.5 pb-2.5">
        <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
          {cards.map((card) => (
            <KanbanCard key={card.id} card={card} />
          ))}
        </SortableContext>

        {/* Quick add */}
        {isAdding ? (
          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-2.5">
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAdd();
                if (e.key === 'Escape') setIsAdding(false);
              }}
              onBlur={handleAdd}
              autoFocus
              placeholder="Card title..."
              className="w-full bg-transparent text-sm text-white placeholder-white/30 outline-none"
            />
          </div>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="flex w-full cursor-pointer items-center gap-1.5 rounded-xl px-2.5 py-2 text-xs text-white/25 transition-all hover:bg-white/[0.04] hover:text-white/50"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add card
          </button>
        )}
      </div>
    </div>
  );
}

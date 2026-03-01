'use client';

import { useCallback, useMemo, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useShallow } from 'zustand/react/shallow';
import { useFlowBoardStore, selectBoardColumns, selectBoardCards } from '@/lib/flowboard/store';
import { KanbanColumn } from './KanbanColumn';
import { KanbanCard } from './KanbanCard';

interface KanbanViewProps {
  boardId: string;
}

export function KanbanView({ boardId }: KanbanViewProps) {
  const columns = useFlowBoardStore(useShallow(selectBoardColumns(boardId)));
  const cards = useFlowBoardStore(useShallow(selectBoardCards(boardId)));
  const addColumn = useFlowBoardStore((s) => s.addColumn);
  const moveCardToColumn = useFlowBoardStore((s) => s.moveCardToColumn);
  const reorderCardsInColumn = useFlowBoardStore((s) => s.reorderCardsInColumn);
  const reorderColumns = useFlowBoardStore((s) => s.reorderColumns);
  const filter = useFlowBoardStore((s) => s.filter);

  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  );

  // Filter cards
  const filteredCardIds = useMemo(() => {
    if (!filter.search && filter.labels.length === 0 && filter.priorities.length === 0 && filter.colors.length === 0) {
      return null; // No filter active
    }
    const q = filter.search.toLowerCase();
    return new Set(
      cards
        .filter((c) => {
          if (q && !c.title.toLowerCase().includes(q) && !c.description.toLowerCase().includes(q)) return false;
          if (filter.labels.length > 0 && !c.labels.some((l) => filter.labels.includes(l))) return false;
          if (filter.priorities.length > 0 && !filter.priorities.includes(c.priority)) return false;
          if (filter.colors.length > 0 && !filter.colors.includes(c.color)) return false;
          return true;
        })
        .map((c) => c.id)
    );
  }, [cards, filter]);

  const activeCard = activeId ? cards.find((c) => c.id === activeId) : null;

  const columnIds = useMemo(() => columns.map((c) => c.id), [columns]);

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragOver(event: DragOverEvent) {
    // Handle moving card to a different column during drag
    const { active, over } = event;
    if (!over) return;

    const activeCard = cards.find((c) => c.id === active.id);
    if (!activeCard) return;

    const overId = over.id as string;

    // Check if hovering over a column
    const overColumn = columns.find((c) => c.id === overId);
    if (overColumn && activeCard.columnId !== overColumn.id) {
      moveCardToColumn(activeCard.id, overColumn.id, 0);
      return;
    }

    // Check if hovering over a card in a different column
    const overCard = cards.find((c) => c.id === overId);
    if (overCard && overCard.columnId && activeCard.columnId !== overCard.columnId) {
      moveCardToColumn(activeCard.id, overCard.columnId, overCard.columnOrder);
    }
  }

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveId(null);

      if (!over || active.id === over.id) return;

      const activeCard = cards.find((c) => c.id === active.id);
      if (!activeCard || !activeCard.columnId) return;

      const overId = over.id as string;

      // Dropped on a column directly
      const overColumn = columns.find((c) => c.id === overId);
      if (overColumn) {
        moveCardToColumn(activeCard.id, overColumn.id, 0);
        return;
      }

      // Dropped on another card
      const overCard = cards.find((c) => c.id === overId);
      if (overCard && overCard.columnId) {
        if (activeCard.columnId === overCard.columnId) {
          // Same column — reorder
          const colCards = cards
            .filter((c) => c.columnId === activeCard.columnId)
            .sort((a, b) => a.columnOrder - b.columnOrder);
          const oldIndex = colCards.findIndex((c) => c.id === activeCard.id);
          const newIndex = colCards.findIndex((c) => c.id === overCard.id);
          if (oldIndex !== -1 && newIndex !== -1) {
            const reordered = [...colCards];
            const [moved] = reordered.splice(oldIndex, 1);
            reordered.splice(newIndex, 0, moved);
            reorderCardsInColumn(activeCard.columnId, reordered.map((c) => c.id));
          }
        } else {
          // Different column
          moveCardToColumn(activeCard.id, overCard.columnId, overCard.columnOrder);
        }
      }
    },
    [cards, columns, moveCardToColumn, reorderCardsInColumn]
  );

  return (
    <div className="flex h-full overflow-x-auto p-4">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={columnIds} strategy={horizontalListSortingStrategy}>
          <div className="flex gap-4">
            {columns.map((column) => (
              <KanbanColumn
                key={column.id}
                column={column}
                cards={cards
                  .filter((c) => c.columnId === column.id)
                  .filter((c) => !filteredCardIds || filteredCardIds.has(c.id))
                  .sort((a, b) => a.columnOrder - b.columnOrder)}
                boardId={boardId}
              />
            ))}

            {/* Add column */}
            <button
              onClick={() => addColumn(boardId, 'New Column')}
              className="flex h-fit w-72 shrink-0 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 py-10 text-white/20 transition-all hover:border-white/20 hover:bg-white/[0.02] hover:text-white/40"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span className="mt-1.5 text-xs font-medium">Add column</span>
            </button>
          </div>
        </SortableContext>

        {/* Drag overlay */}
        <DragOverlay>
          {activeCard ? (
            <div className="w-64 rotate-2 opacity-80">
              <KanbanCard card={activeCard} isOverlay />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

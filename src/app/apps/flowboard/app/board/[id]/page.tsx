'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useFlowBoardStore } from '@/lib/flowboard/store';
import { BoardHeader } from '@/components/flowboard/BoardHeader';
import { KanbanView } from '@/components/flowboard/KanbanView';
import { CanvasView } from '@/components/flowboard/CanvasView';
import { CardDetailSheet } from '@/components/flowboard/CardDetailSheet';
import { CommandPalette } from '@/components/flowboard/CommandPalette';

export default function BoardPage() {
  const params = useParams();
  const router = useRouter();
  const boardId = params.id as string;

  const loadBoards = useFlowBoardStore((s) => s.loadBoards);
  const setActiveBoard = useFlowBoardStore((s) => s.setActiveBoard);
  const isLoaded = useFlowBoardStore((s) => s.isLoaded);
  const board = useFlowBoardStore((s) => s.boards.find((b) => b.id === boardId));
  const activeMode = useFlowBoardStore((s) => s.activeMode);
  const editingCardId = useFlowBoardStore((s) => s.editingCardId);
  const isCommandPaletteOpen = useFlowBoardStore((s) => s.isCommandPaletteOpen);

  useEffect(() => {
    if (!isLoaded) {
      loadBoards();
    }
  }, [isLoaded, loadBoards]);

  useEffect(() => {
    if (isLoaded && boardId) {
      if (!board) {
        router.push('/apps/flowboard/app');
        return;
      }
      setActiveBoard(boardId);
    }
  }, [isLoaded, boardId, board, setActiveBoard, router]);

  if (!isLoaded || !board) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <BoardHeader board={board} />

      <div className="flex-1 overflow-hidden">
        {activeMode === 'kanban' ? (
          <KanbanView boardId={boardId} />
        ) : (
          <CanvasView boardId={boardId} />
        )}
      </div>

      {editingCardId && <CardDetailSheet cardId={editingCardId} />}
      {isCommandPaletteOpen && <CommandPalette boardId={boardId} />}
    </div>
  );
}

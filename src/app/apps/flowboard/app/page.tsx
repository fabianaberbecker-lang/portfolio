'use client';

import { useEffect } from 'react';
import { useFlowBoardStore } from '@/lib/flowboard/store';
import { BoardList } from '@/components/flowboard/BoardList';

export default function FlowBoardHome() {
  const loadBoards = useFlowBoardStore((s) => s.loadBoards);
  const isLoaded = useFlowBoardStore((s) => s.isLoaded);

  useEffect(() => {
    loadBoards();
  }, [loadBoards]);

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  return <BoardList />;
}

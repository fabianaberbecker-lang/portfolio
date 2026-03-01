'use client';

import { useFlowBoardStore } from '@/lib/flowboard/store';
import { useStore } from 'zustand';

export function UndoRedoButtons() {
  const temporalStore = useFlowBoardStore.temporal;
  const canUndo = useStore(temporalStore, (s) => s.pastStates.length > 0);
  const canRedo = useStore(temporalStore, (s) => s.futureStates.length > 0);

  return (
    <div className="flex items-center gap-0.5">
      <button
        onClick={() => temporalStore.getState().undo()}
        disabled={!canUndo}
        title="Undo (Ctrl+Z)"
        className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-white/40 transition-all hover:bg-white/10 hover:text-white/70 disabled:cursor-default disabled:opacity-20 disabled:hover:bg-transparent"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
        </svg>
      </button>
      <button
        onClick={() => temporalStore.getState().redo()}
        disabled={!canRedo}
        title="Redo (Ctrl+Shift+Z)"
        className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-white/40 transition-all hover:bg-white/10 hover:text-white/70 disabled:cursor-default disabled:opacity-20 disabled:hover:bg-transparent"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l6-6m0 0l-6-6m6 6H9a6 6 0 000 12h3" />
        </svg>
      </button>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { FlowBoard } from '@/lib/flowboard/types';
import { useFlowBoardStore } from '@/lib/flowboard/store';
import { getBoardTheme } from '@/lib/flowboard/constants';
import { ModeToggle } from './ModeToggle';
import { UndoRedoButtons } from './UndoRedoButtons';

interface BoardHeaderProps {
  board: FlowBoard;
}

export function BoardHeader({ board }: BoardHeaderProps) {
  const router = useRouter();
  const activeMode = useFlowBoardStore((s) => s.activeMode);
  const setMode = useFlowBoardStore((s) => s.setMode);
  const updateBoard = useFlowBoardStore((s) => s.updateBoard);
  const toggleCommandPalette = useFlowBoardStore((s) => s.toggleCommandPalette);
  const filter = useFlowBoardStore((s) => s.filter);
  const setFilter = useFlowBoardStore((s) => s.setFilter);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(board.title);
  const theme = getBoardTheme(board.emoji);

  function handleTitleSave() {
    const trimmed = editTitle.trim();
    if (trimmed && trimmed !== board.title) {
      updateBoard(board.id, { title: trimmed });
    }
    setIsEditing(false);
  }

  return (
    <header className="glass-toolbar flex items-center gap-3 rounded-none border-x-0 border-t-0 px-4 py-2.5">
      {/* Back */}
      <button
        onClick={() => router.push('/apps/flowboard/app')}
        className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-white/40 transition-all hover:bg-white/10 hover:text-white/70"
        title="All boards"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Board theme dot + title */}
      <div className="flex min-w-0 items-center gap-2.5">
        <div
          className="h-3 w-3 shrink-0 rounded-full"
          style={{
            background: `linear-gradient(135deg, ${theme.from}, ${theme.to})`,
            boxShadow: `0 0 8px ${theme.from}40`,
          }}
        />
        {isEditing ? (
          <input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleTitleSave}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleTitleSave();
              if (e.key === 'Escape') setIsEditing(false);
            }}
            autoFocus
            className="min-w-0 rounded bg-transparent px-1 text-sm font-bold text-white outline-none ring-1 ring-indigo-500"
          />
        ) : (
          <button
            onClick={() => {
              setEditTitle(board.title);
              setIsEditing(true);
            }}
            className="cursor-pointer truncate text-sm font-bold text-white hover:text-white/80"
          >
            {board.title}
          </button>
        )}
      </div>

      {/* Mode toggle */}
      <div className="ml-auto flex items-center gap-2">
        {/* Search */}
        <div className="hidden sm:block">
          <div className="relative">
            <svg className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search cards..."
              value={filter.search}
              onChange={(e) => setFilter({ search: e.target.value })}
              className="w-40 rounded-lg border border-white/[0.06] bg-white/[0.03] py-1.5 pl-8 pr-3 text-xs text-white placeholder-white/30 outline-none transition-all focus:w-56 focus:border-indigo-500/50"
            />
          </div>
        </div>

        <UndoRedoButtons />

        {/* Command palette */}
        <button
          onClick={toggleCommandPalette}
          title="Command palette (Ctrl+K)"
          className="hidden h-7 cursor-pointer items-center gap-1.5 rounded-md border border-white/[0.06] px-2 text-xs text-white/30 transition-all hover:bg-white/5 hover:text-white/50 sm:flex"
        >
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <kbd className="rounded bg-white/5 px-1 py-0.5 font-mono text-[10px]">⌘K</kbd>
        </button>

        <ModeToggle mode={activeMode} onChange={setMode} />
      </div>
    </header>
  );
}

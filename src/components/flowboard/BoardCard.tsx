'use client';

import { useState } from 'react';
import type { FlowBoard } from '@/lib/flowboard/types';
import { useFlowBoardStore } from '@/lib/flowboard/store';
import { formatRelativeDate } from '@/lib/flowboard/utils';
import { getBoardTheme } from '@/lib/flowboard/constants';

interface BoardCardProps {
  board: FlowBoard;
  onClick: () => void;
}

export function BoardCard({ board, onClick }: BoardCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const deleteBoard = useFlowBoardStore((s) => s.deleteBoard);
  const cardCount = useFlowBoardStore((s) => s.cards.filter((c) => c.boardId === board.id).length);
  const theme = getBoardTheme(board.emoji);

  return (
    <div
      className="glass-card group relative cursor-pointer p-5"
      onClick={onClick}
    >
      {/* Menu trigger */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowMenu(!showMenu);
        }}
        className="absolute right-3 top-3 flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg text-white/20 opacity-0 transition-all hover:bg-white/10 hover:text-white/60 group-hover:opacity-100"
      >
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="5" r="1.5" />
          <circle cx="12" cy="12" r="1.5" />
          <circle cx="12" cy="19" r="1.5" />
        </svg>
      </button>

      {/* Context menu */}
      {showMenu && (
        <div
          className="glass-sheet absolute right-3 top-10 z-20 w-36 rounded-xl p-1 shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => {
              if (confirm('Delete this board and all its cards?')) {
                deleteBoard(board.id);
              }
              setShowMenu(false);
            }}
            className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-400 hover:bg-white/5"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        </div>
      )}

      {/* Theme gradient circle with initial */}
      <div
        className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold text-white shadow-lg"
        style={{
          background: `linear-gradient(135deg, ${theme.from}, ${theme.to})`,
          boxShadow: `0 4px 12px ${theme.from}30`,
        }}
      >
        {board.title.charAt(0).toUpperCase()}
      </div>

      {/* Title */}
      <h3 className="font-bold text-white">{board.title}</h3>

      {/* Meta */}
      <div className="mt-2 flex items-center gap-3 text-xs text-white/30">
        <span>{cardCount} card{cardCount !== 1 ? 's' : ''}</span>
        <span>&middot;</span>
        <span>{formatRelativeDate(board.updatedAt)}</span>
      </div>
    </div>
  );
}

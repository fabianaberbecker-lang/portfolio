'use client';

import { useState } from 'react';
import type { FlowColumn } from '@/lib/flowboard/types';
import { useFlowBoardStore } from '@/lib/flowboard/store';

interface ColumnHeaderProps {
  column: FlowColumn;
  cardCount: number;
}

export function ColumnHeader({ column, cardCount }: ColumnHeaderProps) {
  const updateColumn = useFlowBoardStore((s) => s.updateColumn);
  const deleteColumn = useFlowBoardStore((s) => s.deleteColumn);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(column.title);
  const [showMenu, setShowMenu] = useState(false);

  function handleSave() {
    const trimmed = editTitle.trim();
    if (trimmed && trimmed !== column.title) {
      updateColumn(column.id, { title: trimmed });
    }
    setIsEditing(false);
  }

  return (
    <div className="flex items-center gap-2 px-3 py-3">
      {isEditing ? (
        <input
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSave();
            if (e.key === 'Escape') setIsEditing(false);
          }}
          autoFocus
          className="min-w-0 flex-1 rounded bg-transparent text-xs font-bold uppercase tracking-wider text-white outline-none ring-1 ring-indigo-500"
        />
      ) : (
        <button
          onClick={() => {
            setEditTitle(column.title);
            setIsEditing(true);
          }}
          className="min-w-0 cursor-pointer truncate text-xs font-bold uppercase tracking-wider text-white/50"
        >
          {column.title}
        </button>
      )}

      <span className="ml-auto shrink-0 text-[10px] tabular-nums text-white/20">
        {cardCount}
      </span>

      {/* Menu */}
      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="flex h-6 w-6 cursor-pointer items-center justify-center rounded text-white/20 transition-all hover:bg-white/10 hover:text-white/50"
        >
          <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="5" r="1.5" />
            <circle cx="12" cy="12" r="1.5" />
            <circle cx="12" cy="19" r="1.5" />
          </svg>
        </button>

        {showMenu && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
            <div className="absolute right-0 top-7 z-20 w-36 rounded-xl border border-white/10 bg-[#1a1d2e] p-1 shadow-xl">
              <button
                onClick={() => {
                  setEditTitle(column.title);
                  setIsEditing(true);
                  setShowMenu(false);
                }}
                className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-white/70 hover:bg-white/5"
              >
                Rename
              </button>
              <button
                onClick={() => {
                  if (confirm(`Delete column "${column.title}"?`)) {
                    deleteColumn(column.id);
                  }
                  setShowMenu(false);
                }}
                className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-red-400 hover:bg-white/5"
              >
                Delete column
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

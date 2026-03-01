'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useFlowBoardStore } from '@/lib/flowboard/store';
import { fuzzyMatch } from '@/lib/flowboard/utils';
import type { Command } from '@/lib/flowboard/types';

interface CommandPaletteProps {
  boardId: string;
}

export function CommandPalette({ boardId }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const setCommandPaletteOpen = useFlowBoardStore((s) => s.setCommandPaletteOpen);
  const addCard = useFlowBoardStore((s) => s.addCard);
  const addColumn = useFlowBoardStore((s) => s.addColumn);
  const setMode = useFlowBoardStore((s) => s.setMode);
  const clearFilter = useFlowBoardStore((s) => s.clearFilter);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const commands: Command[] = useMemo(
    () => [
      {
        id: 'new-card',
        label: 'New card',
        shortcut: 'Ctrl+N',
        category: 'card',
        action: () => {
          const col = useFlowBoardStore.getState().columns.find((c) => c.boardId === boardId);
          if (col) addCard(boardId, col.id, 'Untitled');
        },
      },
      {
        id: 'new-column',
        label: 'New column',
        category: 'board',
        action: () => addColumn(boardId, 'New Column'),
      },
      {
        id: 'switch-kanban',
        label: 'Switch to Kanban mode',
        shortcut: '1',
        category: 'view',
        action: () => setMode('kanban'),
      },
      {
        id: 'switch-canvas',
        label: 'Switch to Canvas mode',
        shortcut: '2',
        category: 'view',
        action: () => setMode('canvas'),
      },
      {
        id: 'clear-filters',
        label: 'Clear all filters',
        category: 'view',
        action: () => clearFilter(),
      },
    ],
    [boardId, addCard, addColumn, setMode, clearFilter]
  );

  const filtered = query
    ? commands.filter((c) => fuzzyMatch(c.label, query))
    : commands;

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  function handleSelect(cmd: Command) {
    cmd.action();
    setCommandPaletteOpen(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && filtered[selectedIndex]) {
      e.preventDefault();
      handleSelect(filtered[selectedIndex]);
    } else if (e.key === 'Escape') {
      setCommandPaletteOpen(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setCommandPaletteOpen(false)}
      />

      <div className="glass-sheet relative w-full max-w-md rounded-3xl shadow-2xl animate-scale-in">
        {/* Search input */}
        <div className="flex items-center gap-3 border-b border-white/[0.06] px-4 py-3">
          <svg className="h-4 w-4 shrink-0 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a command..."
            className="flex-1 bg-transparent text-sm text-white placeholder-white/30 outline-none"
          />
          <kbd className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] text-white/20">ESC</kbd>
        </div>

        {/* Command list */}
        <div className="max-h-64 overflow-y-auto p-1.5">
          {filtered.length === 0 ? (
            <p className="px-3 py-4 text-center text-xs text-white/20">No commands found</p>
          ) : (
            filtered.map((cmd, i) => (
              <button
                key={cmd.id}
                onClick={() => handleSelect(cmd)}
                className={`flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 text-left transition-all ${
                  i === selectedIndex
                    ? 'bg-indigo-500/10 text-white'
                    : 'text-white/60 hover:bg-white/5'
                }`}
              >
                <span className="text-sm">{cmd.label}</span>
                {cmd.shortcut && (
                  <kbd className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] text-white/25">
                    {cmd.shortcut}
                  </kbd>
                )}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

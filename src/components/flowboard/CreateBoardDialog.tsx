'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFlowBoardStore } from '@/lib/flowboard/store';
import { BOARD_THEMES } from '@/lib/flowboard/constants';

interface CreateBoardDialogProps {
  onClose: () => void;
}

export function CreateBoardDialog({ onClose }: CreateBoardDialogProps) {
  const [title, setTitle] = useState('');
  const [themeKey, setThemeKey] = useState('indigo');
  const inputRef = useRef<HTMLInputElement>(null);
  const createBoard = useFlowBoardStore((s) => s.createBoard);
  const router = useRouter();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function handleCreate() {
    const name = title.trim() || 'Untitled Board';
    const id = createBoard(name, themeKey);
    router.push(`/apps/flowboard/app/board/${id}`);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />

      <div className="glass-sheet relative w-full max-w-md rounded-3xl p-6 animate-scale-in">
        <h2 className="text-lg font-bold text-white">New board</h2>

        {/* Theme color picker */}
        <div className="mt-5">
          <label className="mb-2.5 block text-xs font-medium text-white/40">Theme</label>
          <div className="flex flex-wrap gap-3">
            {BOARD_THEMES.map((theme) => (
              <button
                key={theme.key}
                onClick={() => setThemeKey(theme.key)}
                className={`relative h-10 w-10 cursor-pointer rounded-2xl transition-all ${
                  themeKey === theme.key
                    ? 'scale-110 ring-2 ring-white/40 ring-offset-2 ring-offset-[#0c0e1c]'
                    : 'hover:scale-105'
                }`}
                style={{
                  background: `linear-gradient(135deg, ${theme.from}, ${theme.to})`,
                }}
                title={theme.key}
              />
            ))}
          </div>
        </div>

        {/* Title input */}
        <div className="mt-5">
          <label className="mb-2.5 block text-xs font-medium text-white/40">Board name</label>
          <input
            ref={inputRef}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            placeholder="My Project"
            className="w-full rounded-2xl border border-white/[0.06] bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition-all focus:border-indigo-500/50 focus:bg-white/[0.05]"
          />
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="cursor-pointer rounded-2xl px-4 py-2.5 text-sm font-medium text-white/50 transition-all hover:bg-white/5 hover:text-white/80"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="cursor-pointer rounded-2xl bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:bg-indigo-400 hover:shadow-indigo-500/35 active:scale-[0.97]"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFlowBoardStore } from '@/lib/flowboard/store';
import { BoardCard } from './BoardCard';
import { CreateBoardDialog } from './CreateBoardDialog';

export function BoardList() {
  const boards = useFlowBoardStore((s) => s.boards);
  const [showCreate, setShowCreate] = useState(false);
  const router = useRouter();

  return (
    <div className="min-h-screen px-6 py-12 sm:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white">
              FlowBoard
            </h1>
            <p className="mt-1 text-sm text-white/40">
              Your boards
            </p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="flex cursor-pointer items-center gap-2 rounded-xl bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-indigo-400 active:scale-[0.97]"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            New board
          </button>
        </div>

        {/* Board grid */}
        {boards.length === 0 ? (
          <div className="flex flex-col items-center py-24 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl"
              style={{
                background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(129,140,248,0.08))',
                border: '1px solid rgba(99,102,241,0.15)',
              }}
            >
              <svg className="h-7 w-7 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-white/80">No boards yet</h2>
            <p className="mt-1 text-sm text-white/40">
              Create your first board to get started.
            </p>
            <button
              onClick={() => setShowCreate(true)}
              className="mt-6 cursor-pointer rounded-xl bg-indigo-500 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-indigo-400 active:scale-[0.97]"
            >
              Create board
            </button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {boards
              .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
              .map((board) => (
                <BoardCard
                  key={board.id}
                  board={board}
                  onClick={() => router.push(`/apps/flowboard/app/board/${board.id}`)}
                />
              ))}
            {/* Add board card */}
            <button
              onClick={() => setShowCreate(true)}
              className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 py-12 text-white/30 transition-all hover:border-white/20 hover:bg-white/[0.02] hover:text-white/50"
            >
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span className="mt-2 text-sm font-medium">New board</span>
            </button>
          </div>
        )}
      </div>

      {showCreate && <CreateBoardDialog onClose={() => setShowCreate(false)} />}
    </div>
  );
}

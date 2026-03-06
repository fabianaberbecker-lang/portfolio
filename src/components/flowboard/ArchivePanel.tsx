'use client';

import { useFlowBoardStore, useShallowStore } from '@/lib/flowboard/store';
import { formatRelativeDate } from '@/lib/flowboard/utils';

interface ArchivePanelProps {
  boardId: string;
}

export function ArchivePanel({ boardId }: ArchivePanelProps) {
  const archivedCards = useShallowStore((s) => s.cards.filter((c) => c.boardId === boardId && c.archived), [boardId]);
  const restoreCard = useFlowBoardStore((s) => s.restoreCard);
  const deleteCard = useFlowBoardStore((s) => s.deleteCard);
  const setArchiveOpen = useFlowBoardStore((s) => s.setArchiveOpen);

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => setArchiveOpen(false)}
      />

      {/* Panel */}
      <div className="glass-sheet relative h-full w-full max-w-sm overflow-y-auto rounded-l-3xl p-5 shadow-2xl animate-scale-in">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white">Archive</h2>
            <p className="text-xs text-white/30">
              {archivedCards.length} card{archivedCards.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={() => setArchiveOpen(false)}
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg text-white/30 hover:bg-white/10 hover:text-white/60"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Card list */}
        {archivedCards.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <svg className="mb-3 h-10 w-10 text-white/10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <p className="text-sm text-white/20">No archived cards</p>
            <p className="mt-1 text-xs text-white/10">Cards you archive will appear here</p>
          </div>
        ) : (
          <div className="space-y-2">
            {archivedCards.map((card) => (
              <div
                key={card.id}
                className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-3"
              >
                <p className="text-sm font-medium text-white/80">{card.title}</p>
                {card.description && (
                  <p className="mt-1 text-xs text-white/30 line-clamp-1">{card.description}</p>
                )}
                <p className="mt-1.5 text-[10px] text-white/20">
                  Archived {formatRelativeDate(card.updatedAt)}
                </p>
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => restoreCard(card.id)}
                    className="cursor-pointer rounded-md px-2.5 py-1 text-[10px] font-medium text-indigo-400 transition-all hover:bg-indigo-500/10"
                  >
                    Restore
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Permanently delete this card?')) {
                        deleteCard(card.id);
                      }
                    }}
                    className="cursor-pointer rounded-md px-2.5 py-1 text-[10px] font-medium text-red-400 transition-all hover:bg-red-500/10"
                  >
                    Delete forever
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

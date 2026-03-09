'use client';

import { useFlowBoardStore } from '@/lib/flowboard/store';

interface CanvasContextMenuProps {
  x: number;
  y: number;
  boardId: string;
  canvasX: number;
  canvasY: number;
  cardId?: string;
  onClose: () => void;
  onFitToView: () => void;
}

export function CanvasContextMenu({
  x,
  y,
  boardId,
  canvasX,
  canvasY,
  cardId,
  onClose,
  onFitToView,
}: CanvasContextMenuProps) {
  const addCard = useFlowBoardStore((s) => s.addCard);
  const moveCardOnCanvas = useFlowBoardStore((s) => s.moveCardOnCanvas);
  const setEditingCard = useFlowBoardStore((s) => s.setEditingCard);
  const duplicateCard = useFlowBoardStore((s) => s.duplicateCard);
  const deleteCard = useFlowBoardStore((s) => s.deleteCard);
  const archiveCard = useFlowBoardStore((s) => s.archiveCard);
  const selectAll = useFlowBoardStore((s) => s.selectAll);
  const selectedCardIds = useFlowBoardStore((s) => s.selectedCardIds);
  const deleteSelectedCards = useFlowBoardStore((s) => s.deleteSelectedCards);
  const duplicateSelectedCards = useFlowBoardStore((s) => s.duplicateSelectedCards);

  const hasSelection = selectedCardIds.length > 1;

  function item(label: string, action: () => void, danger = false) {
    return (
      <button
        key={label}
        onClick={() => { action(); onClose(); }}
        className={`flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[13px] transition-all ${
          danger ? 'text-red-400 hover:bg-red-500/10' : 'text-white/70 hover:bg-white/[0.06]'
        }`}
      >
        {label}
      </button>
    );
  }

  function sep() {
    return <div className="my-1 h-px bg-white/[0.06]" />;
  }

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} onContextMenu={(e) => { e.preventDefault(); onClose(); }} />
      <div
        className="glass-sheet fixed z-50 min-w-[180px] rounded-xl p-1 shadow-2xl animate-scale-in"
        style={{ left: x, top: y }}
      >
        {cardId && !hasSelection && (
          <>
            {item('Edit card', () => setEditingCard(cardId))}
            {item('Duplicate', () => duplicateCard(cardId))}
            {item('Archive', () => archiveCard(cardId))}
            {sep()}
            {item('Delete', () => deleteCard(cardId), true)}
          </>
        )}

        {hasSelection && (
          <>
            {item(`Duplicate ${selectedCardIds.length} cards`, () => duplicateSelectedCards())}
            {sep()}
            {item(`Delete ${selectedCardIds.length} cards`, () => deleteSelectedCards(), true)}
          </>
        )}

        {!cardId && !hasSelection && (
          <>
            {item('Add card here', () => {
              const col = useFlowBoardStore.getState().columns.find((c) => c.boardId === boardId);
              const id = addCard(boardId, col?.id ?? null, 'Untitled');
              moveCardOnCanvas(id, Math.round(canvasX), Math.round(canvasY));
              setEditingCard(id);
            })}
            {sep()}
            {item('Select all', () => selectAll(boardId))}
            {item('Fit to view', () => onFitToView())}
          </>
        )}
      </div>
    </>
  );
}

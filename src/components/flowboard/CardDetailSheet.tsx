'use client';

import { useState, useEffect } from 'react';
import { useFlowBoardStore } from '@/lib/flowboard/store';
import { CARD_COLORS, PRIORITIES } from '@/lib/flowboard/constants';
import type { CardColor, Priority } from '@/lib/flowboard/types';

interface CardDetailSheetProps {
  cardId: string;
}

export function CardDetailSheet({ cardId }: CardDetailSheetProps) {
  const card = useFlowBoardStore((s) => s.cards.find((c) => c.id === cardId));
  const updateCard = useFlowBoardStore((s) => s.updateCard);
  const deleteCard = useFlowBoardStore((s) => s.deleteCard);
  const duplicateCard = useFlowBoardStore((s) => s.duplicateCard);
  const setEditingCard = useFlowBoardStore((s) => s.setEditingCard);

  const [title, setTitle] = useState(card?.title ?? '');
  const [description, setDescription] = useState(card?.description ?? '');
  const [labelInput, setLabelInput] = useState('');

  useEffect(() => {
    if (card) {
      setTitle(card.title);
      setDescription(card.description);
    }
  }, [card]);

  if (!card) return null;

  function save() {
    updateCard(cardId, { title: title.trim() || 'Untitled', description });
  }

  function handleClose() {
    save();
    setEditingCard(null);
  }

  function handleAddLabel() {
    const label = labelInput.trim();
    if (label && !card!.labels.includes(label)) {
      updateCard(cardId, { labels: [...card!.labels, label] });
    }
    setLabelInput('');
  }

  function handleRemoveLabel(label: string) {
    updateCard(cardId, { labels: card!.labels.filter((l) => l !== label) });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />

      {/* Sheet */}
      <div className="glass-sheet relative max-h-[85vh] w-full overflow-y-auto rounded-t-3xl p-5 shadow-2xl sm:max-w-lg sm:rounded-3xl animate-scale-in">
        {/* Close */}
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg text-white/30 hover:bg-white/10 hover:text-white/60"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Title */}
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={save}
          placeholder="Card title"
          className="w-full bg-transparent text-lg font-bold text-white placeholder-white/30 outline-none"
        />

        {/* Description */}
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onBlur={save}
          placeholder="Add a description..."
          rows={3}
          className="mt-3 w-full resize-none rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2.5 text-sm text-white/70 placeholder-white/20 outline-none transition-all focus:border-indigo-500/50"
        />

        {/* Color */}
        <div className="mt-4">
          <label className="mb-2 block text-xs font-medium text-white/40">Color</label>
          <div className="flex gap-2">
            {CARD_COLORS.map((c) => (
              <button
                key={c.value}
                onClick={() => updateCard(cardId, { color: c.value as CardColor })}
                className={`h-7 w-7 cursor-pointer rounded-full transition-all ${
                  card.color === c.value ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-[#0c0e1c]' : ''
                }`}
                style={{ backgroundColor: c.cssVar }}
                title={c.label}
              />
            ))}
          </div>
        </div>

        {/* Priority */}
        <div className="mt-4">
          <label className="mb-2 block text-xs font-medium text-white/40">Priority</label>
          <div className="flex gap-1.5">
            {PRIORITIES.map((p) => (
              <button
                key={p.value}
                onClick={() => updateCard(cardId, { priority: p.value as Priority })}
                className={`cursor-pointer rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  card.priority === p.value
                    ? 'bg-white/10 text-white'
                    : 'text-white/30 hover:bg-white/5 hover:text-white/60'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Labels */}
        <div className="mt-4">
          <label className="mb-2 block text-xs font-medium text-white/40">Labels</label>
          <div className="flex flex-wrap gap-1.5">
            {card.labels.map((label) => (
              <span
                key={label}
                className="flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-xs text-white/60"
              >
                {label}
                <button
                  onClick={() => handleRemoveLabel(label)}
                  className="cursor-pointer text-white/30 hover:text-white/60"
                >
                  &times;
                </button>
              </span>
            ))}
            <input
              value={labelInput}
              onChange={(e) => setLabelInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddLabel();
              }}
              placeholder="Add label..."
              className="w-20 bg-transparent text-xs text-white/50 placeholder-white/20 outline-none"
            />
          </div>
        </div>

        {/* Due date */}
        <div className="mt-4">
          <label className="mb-2 block text-xs font-medium text-white/40">Due date</label>
          <input
            type="date"
            value={card.dueDate ?? ''}
            onChange={(e) => updateCard(cardId, { dueDate: e.target.value || null })}
            className="rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2 text-xs text-white/70 outline-none transition-all focus:border-indigo-500/50"
          />
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-2 border-t border-white/[0.06] pt-4">
          <button
            onClick={() => {
              duplicateCard(cardId);
              setEditingCard(null);
            }}
            className="cursor-pointer rounded-lg px-3 py-2 text-xs text-white/40 transition-all hover:bg-white/5 hover:text-white/70"
          >
            Duplicate
          </button>
          <button
            onClick={() => {
              if (confirm('Delete this card?')) {
                deleteCard(cardId);
                setEditingCard(null);
              }
            }}
            className="cursor-pointer rounded-lg px-3 py-2 text-xs text-red-400 transition-all hover:bg-red-500/10"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

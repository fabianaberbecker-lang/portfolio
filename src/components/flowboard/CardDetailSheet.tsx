'use client';

import { useState, useEffect, useRef } from 'react';
import { useFlowBoardStore } from '@/lib/flowboard/store';
import { CARD_COLORS, PRIORITIES } from '@/lib/flowboard/constants';
import { generateId, now, formatRelativeDate, getDueDateStatus, formatDueDate } from '@/lib/flowboard/utils';
import type { CardColor, Priority, ChecklistItem, CardComment } from '@/lib/flowboard/types';

interface CardDetailSheetProps {
  cardId: string;
}

// Deterministic color from a name string
function nameColor(name: string): string {
  const colors = [
    'bg-indigo-500', 'bg-pink-500', 'bg-amber-500', 'bg-emerald-500',
    'bg-cyan-500', 'bg-violet-500', 'bg-rose-500', 'bg-teal-500',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

export function CardDetailSheet({ cardId }: CardDetailSheetProps) {
  const card = useFlowBoardStore((s) => s.cards.find((c) => c.id === cardId));
  const board = useFlowBoardStore((s) => s.boards.find((b) => b.id === card?.boardId));
  const updateCard = useFlowBoardStore((s) => s.updateCard);
  const updateBoard = useFlowBoardStore((s) => s.updateBoard);
  const deleteCard = useFlowBoardStore((s) => s.deleteCard);
  const duplicateCard = useFlowBoardStore((s) => s.duplicateCard);
  const archiveCard = useFlowBoardStore((s) => s.archiveCard);
  const setEditingCard = useFlowBoardStore((s) => s.setEditingCard);

  const [title, setTitle] = useState(card?.title ?? '');
  const [description, setDescription] = useState(card?.description ?? '');
  const [labelInput, setLabelInput] = useState('');
  const [checklistInput, setChecklistInput] = useState('');
  const [commentInput, setCommentInput] = useState('');
  const [assigneeInput, setAssigneeInput] = useState('');
  const [showAssigneePicker, setShowAssigneePicker] = useState(false);
  const commentEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (card) {
      setTitle(card.title);
      setDescription(card.description);
    }
  }, [card]);

  if (!card) return null;

  const checklist = card.checklist ?? [];
  const comments = card.comments ?? [];
  const assignees = card.assignees ?? [];
  const boardMembers = board?.members ?? [];
  const doneCount = checklist.filter((i) => i.done).length;

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

  // --- Checklist ---
  function handleAddChecklistItem() {
    const text = checklistInput.trim();
    if (!text) return;
    const item: ChecklistItem = { id: generateId(), text, done: false };
    updateCard(cardId, { checklist: [...checklist, item] });
    setChecklistInput('');
  }

  function handleToggleChecklistItem(itemId: string) {
    updateCard(cardId, {
      checklist: checklist.map((i) => i.id === itemId ? { ...i, done: !i.done } : i),
    });
  }

  function handleDeleteChecklistItem(itemId: string) {
    updateCard(cardId, { checklist: checklist.filter((i) => i.id !== itemId) });
  }

  // --- Comments ---
  function handleAddComment() {
    const text = commentInput.trim();
    if (!text) return;
    const comment: CardComment = { id: generateId(), author: 'You', text, createdAt: now() };
    updateCard(cardId, { comments: [...comments, comment] });
    setCommentInput('');
    setTimeout(() => commentEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  }

  // --- Assignees ---
  function handleToggleAssignee(name: string) {
    const updated = assignees.includes(name)
      ? assignees.filter((a) => a !== name)
      : [...assignees, name];
    updateCard(cardId, { assignees: updated });
  }

  function handleAddNewMember() {
    const name = assigneeInput.trim();
    if (!name) return;
    // Add to board members if new
    if (board && !(board.members ?? []).includes(name)) {
      updateBoard(board.id, { members: [...(board.members ?? []), name] });
    }
    // Assign to card
    if (!assignees.includes(name)) {
      updateCard(cardId, { assignees: [...assignees, name] });
    }
    setAssigneeInput('');
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
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={card.dueDate ?? ''}
              onChange={(e) => updateCard(cardId, { dueDate: e.target.value || null })}
              className="rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2 text-xs text-white/70 outline-none transition-all focus:border-indigo-500/50"
            />
            {card.dueDate && (() => {
              const cl = card.checklist ?? [];
              const allDone = cl.length > 0 && cl.every((i) => i.done);
              const status = getDueDateStatus(card.dueDate, allDone);
              const statusClasses: Record<string, string> = {
                overdue: 'bg-red-500/15 text-red-400',
                soon: 'bg-amber-500/15 text-amber-400',
                complete: 'bg-emerald-500/15 text-emerald-400',
                normal: 'bg-white/[0.06] text-white/40',
              };
              return (
                <span className={`rounded-md px-2 py-1 text-[10px] font-medium ${statusClasses[status ?? 'normal']}`}>
                  {formatDueDate(card.dueDate)}
                </span>
              );
            })()}
          </div>
        </div>

        {/* Assignees */}
        <div className="mt-5">
          <label className="mb-2 block text-xs font-medium text-white/40">Assignees</label>
          <div className="flex flex-wrap items-center gap-1.5">
            {assignees.map((name) => (
              <button
                key={name}
                onClick={() => handleToggleAssignee(name)}
                className="flex cursor-pointer items-center gap-1.5 rounded-full bg-white/[0.08] py-1 pl-1 pr-2.5 text-xs text-white/70 transition-all hover:bg-white/[0.12]"
                title={`Remove ${name}`}
              >
                <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white ${nameColor(name)}`}>
                  {name[0].toUpperCase()}
                </span>
                {name}
                <span className="ml-0.5 text-white/30">&times;</span>
              </button>
            ))}
            <button
              onClick={() => setShowAssigneePicker(!showAssigneePicker)}
              className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-dashed border-white/15 text-white/30 transition-all hover:border-white/30 hover:text-white/50"
              title="Add assignee"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
          {showAssigneePicker && (
            <div className="mt-2 rounded-lg border border-white/[0.08] bg-white/[0.04] p-2">
              {boardMembers.filter((m) => !assignees.includes(m)).map((name) => (
                <button
                  key={name}
                  onClick={() => handleToggleAssignee(name)}
                  className="flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs text-white/60 transition-all hover:bg-white/[0.06]"
                >
                  <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white ${nameColor(name)}`}>
                    {name[0].toUpperCase()}
                  </span>
                  {name}
                </button>
              ))}
              <div className="flex items-center gap-1.5 pt-1">
                <input
                  value={assigneeInput}
                  onChange={(e) => setAssigneeInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddNewMember();
                  }}
                  placeholder="New member name..."
                  className="flex-1 bg-transparent px-2 py-1.5 text-xs text-white/60 placeholder-white/20 outline-none"
                />
                {assigneeInput.trim() && (
                  <button
                    onClick={handleAddNewMember}
                    className="cursor-pointer rounded px-2 py-1 text-[10px] font-medium text-indigo-400 transition-all hover:bg-indigo-500/10"
                  >
                    Add
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Checklist */}
        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between">
            <label className="text-xs font-medium text-white/40">Checklist</label>
            {checklist.length > 0 && (
              <span className="text-[10px] text-white/30">
                {doneCount}/{checklist.length}
              </span>
            )}
          </div>
          {checklist.length > 0 && (
            <div className="mb-2.5 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
              <div
                className="h-full rounded-full bg-indigo-500 transition-all"
                style={{ width: `${(doneCount / checklist.length) * 100}%` }}
              />
            </div>
          )}
          <div className="space-y-1">
            {checklist.map((item) => (
              <div key={item.id} className="group flex items-center gap-2 rounded-md px-1 py-1 hover:bg-white/[0.03]">
                <button
                  onClick={() => handleToggleChecklistItem(item.id)}
                  className={`flex h-4.5 w-4.5 shrink-0 cursor-pointer items-center justify-center rounded border transition-all ${
                    item.done
                      ? 'border-indigo-500 bg-indigo-500'
                      : 'border-white/20 hover:border-white/40'
                  }`}
                >
                  {item.done && (
                    <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
                <span className={`flex-1 text-xs ${item.done ? 'text-white/30 line-through' : 'text-white/70'}`}>
                  {item.text}
                </span>
                <button
                  onClick={() => handleDeleteChecklistItem(item.id)}
                  className="cursor-pointer text-white/0 transition-all group-hover:text-white/30 hover:!text-white/60"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          <div className="mt-1.5 flex items-center gap-2">
            <input
              value={checklistInput}
              onChange={(e) => setChecklistInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddChecklistItem();
              }}
              placeholder="Add an item..."
              className="flex-1 rounded-md border border-white/[0.06] bg-white/[0.03] px-2.5 py-1.5 text-xs text-white/60 placeholder-white/20 outline-none transition-all focus:border-indigo-500/50"
            />
          </div>
        </div>

        {/* Comments */}
        <div className="mt-5">
          <label className="mb-2 block text-xs font-medium text-white/40">
            Comments{comments.length > 0 ? ` (${comments.length})` : ''}
          </label>
          {comments.length > 0 && (
            <div className="mb-2 max-h-40 space-y-2 overflow-y-auto">
              {comments.map((c) => (
                <div key={c.id} className="rounded-lg bg-white/[0.03] px-3 py-2">
                  <div className="flex items-center gap-2">
                    <span className={`flex h-4.5 w-4.5 items-center justify-center rounded-full text-[8px] font-bold text-white ${nameColor(c.author)}`}>
                      {c.author[0].toUpperCase()}
                    </span>
                    <span className="text-[10px] font-medium text-white/50">{c.author}</span>
                    <span className="text-[9px] text-white/20">{formatRelativeDate(c.createdAt)}</span>
                  </div>
                  <p className="mt-1 text-xs text-white/60 leading-relaxed">{c.text}</p>
                </div>
              ))}
              <div ref={commentEndRef} />
            </div>
          )}
          <div className="flex gap-2">
            <input
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleAddComment();
                }
              }}
              placeholder="Write a comment..."
              className="flex-1 rounded-md border border-white/[0.06] bg-white/[0.03] px-2.5 py-1.5 text-xs text-white/60 placeholder-white/20 outline-none transition-all focus:border-indigo-500/50"
            />
            {commentInput.trim() && (
              <button
                onClick={handleAddComment}
                className="cursor-pointer rounded-md bg-indigo-500/20 px-3 py-1.5 text-[10px] font-medium text-indigo-300 transition-all hover:bg-indigo-500/30"
              >
                Send
              </button>
            )}
          </div>
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
              archiveCard(cardId);
            }}
            className="cursor-pointer rounded-lg px-3 py-2 text-xs text-white/40 transition-all hover:bg-white/5 hover:text-white/70"
          >
            Archive
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

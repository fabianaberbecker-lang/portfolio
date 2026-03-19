'use client';

import { useState, useEffect } from 'react';
import { useThinkingStore } from '@/lib/thinking/store';
import type { NodeType } from '@/lib/thinking/types';

const typeLabel: Record<NodeType, string> = {
  hypothesis: 'Hypothesis',
  assumption: 'Assumption',
  risk: 'Risk',
};

const typeAccent: Record<NodeType, string> = {
  hypothesis: 'text-[var(--thinking-blue)]',
  assumption: 'text-[var(--thinking-amber)]',
  risk: 'text-[var(--thinking-rose)]',
};

const typeBorderAccent: Record<NodeType, string> = {
  hypothesis: 'border-[var(--thinking-blue)]/30',
  assumption: 'border-[var(--thinking-amber)]/30',
  risk: 'border-[var(--thinking-rose)]/30',
};

export function DetailPanel() {
  const selectedNodeId = useThinkingStore((s) => s.selectedNodeId);
  const nodes = useThinkingStore((s) => s.nodes);
  const edges = useThinkingStore((s) => s.edges);
  const updateNode = useThinkingStore((s) => s.updateNode);
  const deleteNode = useThinkingStore((s) => s.deleteNode);
  const selectNode = useThinkingStore((s) => s.selectNode);

  const node = nodes.find((n) => n.id === selectedNodeId);
  const [label, setLabel] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (node) {
      setLabel(node.label);
      setNotes(node.notes || '');
    }
  }, [node]);

  if (!node) return null;

  const linkedNodes = edges
    .filter((e) => e.source === node.id || e.target === node.id)
    .map((e) => {
      const otherId = e.source === node.id ? e.target : e.source;
      return nodes.find((n) => n.id === otherId);
    })
    .filter(Boolean);

  const commitLabel = () => {
    if (label.trim() && label !== node.label) {
      updateNode(node.id, { label: label.trim() });
    }
  };

  const commitNotes = () => {
    if (notes !== (node.notes || '')) {
      updateNode(node.id, { notes });
    }
  };

  return (
    <div className="flex h-full w-80 flex-col border-l border-[var(--border-color)] bg-[var(--surface)]/50 backdrop-blur-sm animate-slide-in">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--border-color)] px-5 py-4">
        <div className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-widest ${typeAccent[node.type]}`}>
          {typeLabel[node.type]}
        </div>
        <button
          onClick={() => selectNode(null)}
          className="rounded-md p-1 text-[var(--muted)] hover:bg-white/5 hover:text-[var(--foreground)]"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
        {/* Title */}
        <div>
          <label className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-[var(--muted)]">Title</label>
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onBlur={commitLabel}
            onKeyDown={(e) => e.key === 'Enter' && commitLabel()}
            className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-[var(--muted)]">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            onBlur={commitNotes}
            placeholder="Add notes..."
            rows={4}
            className="w-full resize-none rounded-lg border border-[var(--border-color)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)]/40 focus:border-[var(--accent)] focus:outline-none"
          />
        </div>

        {/* Impact / Effort sliders */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-2 flex items-center justify-between text-[10px] font-semibold uppercase tracking-widest text-[var(--muted)]">
              <span>Impact</span>
              <span className="text-[var(--foreground)]">{node.impact}</span>
            </label>
            <input
              type="range"
              min={0}
              max={100}
              value={node.impact}
              onChange={(e) => updateNode(node.id, { impact: Number(e.target.value) })}
              className="w-full accent-[var(--accent)]"
            />
          </div>
          <div>
            <label className="mb-2 flex items-center justify-between text-[10px] font-semibold uppercase tracking-widest text-[var(--muted)]">
              <span>Effort</span>
              <span className="text-[var(--foreground)]">{node.effort}</span>
            </label>
            <input
              type="range"
              min={0}
              max={100}
              value={node.effort}
              onChange={(e) => updateNode(node.id, { effort: Number(e.target.value) })}
              className="w-full accent-[var(--accent)]"
            />
          </div>
        </div>

        {/* Linked nodes */}
        {linkedNodes.length > 0 && (
          <div>
            <label className="mb-2 block text-[10px] font-semibold uppercase tracking-widest text-[var(--muted)]">Connected</label>
            <div className="space-y-1">
              {linkedNodes.map((ln) =>
                ln ? (
                  <button
                    key={ln.id}
                    onClick={() => selectNode(ln.id)}
                    className={`w-full rounded-lg border ${typeBorderAccent[ln.type]} bg-white/[0.02] px-3 py-2 text-left text-xs text-[var(--foreground)] hover:bg-white/[0.04]`}
                  >
                    <span className={`mr-2 text-[10px] uppercase ${typeAccent[ln.type]}`}>{ln.type[0].toUpperCase()}</span>
                    {ln.label}
                  </button>
                ) : null
              )}
            </div>
          </div>
        )}

        {/* Type change */}
        <div>
          <label className="mb-2 block text-[10px] font-semibold uppercase tracking-widest text-[var(--muted)]">Type</label>
          <select
            value={node.type}
            onChange={(e) => updateNode(node.id, { type: e.target.value as NodeType })}
            className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none"
          >
            <option value="hypothesis">Hypothesis</option>
            <option value="assumption">Assumption</option>
            <option value="risk">Risk</option>
          </select>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-[var(--border-color)] px-5 py-3">
        <button
          onClick={() => {
            deleteNode(node.id);
          }}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-[var(--thinking-rose)]/20 bg-[var(--thinking-rose)]/5 py-2 text-xs font-medium text-[var(--thinking-rose)] hover:bg-[var(--thinking-rose)]/10"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
          </svg>
          Delete node
        </button>
      </div>
    </div>
  );
}

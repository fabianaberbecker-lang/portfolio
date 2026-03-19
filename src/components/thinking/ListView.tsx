'use client';

import { useState, useMemo } from 'react';
import { useThinkingStore } from '@/lib/thinking/store';
import type { NodeType } from '@/lib/thinking/types';

const typeConfig: Record<NodeType, { label: string; accent: string; icon: React.ReactNode }> = {
  hypothesis: {
    label: 'Hypotheses',
    accent: 'text-[var(--thinking-blue)]',
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
      </svg>
    ),
  },
  assumption: {
    label: 'Assumptions',
    accent: 'text-[var(--thinking-amber)]',
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
      </svg>
    ),
  },
  risk: {
    label: 'Risks',
    accent: 'text-[var(--thinking-rose)]',
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
    ),
  },
};

const groupOrder: NodeType[] = ['hypothesis', 'assumption', 'risk'];

export function ListView() {
  const nodes = useThinkingStore((s) => s.nodes);
  const selectedNodeId = useThinkingStore((s) => s.selectedNodeId);
  const selectNode = useThinkingStore((s) => s.selectNode);
  const updateNode = useThinkingStore((s) => s.updateNode);
  const deleteNode = useThinkingStore((s) => s.deleteNode);
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState('');

  const filtered = useMemo(() => {
    if (!search) return nodes;
    const q = search.toLowerCase();
    return nodes.filter((n) => n.label.toLowerCase().includes(q) || n.type.includes(q));
  }, [nodes, search]);

  const grouped = useMemo(() => {
    const map = new Map<NodeType, typeof filtered>();
    for (const type of groupOrder) {
      const items = filtered.filter((n) => n.type === type);
      if (items.length > 0) map.set(type, items);
    }
    return map;
  }, [filtered]);

  const startEdit = (id: string, label: string) => {
    setEditingId(id);
    setEditLabel(label);
  };

  const commitEdit = () => {
    if (editingId && editLabel.trim()) {
      updateNode(editingId, { label: editLabel.trim() });
    }
    setEditingId(null);
  };

  return (
    <div className="flex h-full flex-col gap-4 p-6">
      {/* Search */}
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search nodes..."
          className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--surface)] py-2 pl-10 pr-4 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)]/50 focus:border-[var(--accent)] focus:outline-none"
        />
      </div>

      {/* Grouped list */}
      <div className="flex-1 overflow-y-auto space-y-6">
        {Array.from(grouped.entries()).map(([type, items]) => {
          const config = typeConfig[type];
          return (
            <div key={type}>
              <div className={`mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest ${config.accent}`}>
                {config.icon}
                {config.label}
                <span className="ml-auto rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-[var(--muted)]">
                  {items.length}
                </span>
              </div>
              <div className="space-y-1">
                {items.map((node) => (
                  <div
                    key={node.id}
                    onClick={() => selectNode(node.id)}
                    className={`
                      group flex items-center gap-3 rounded-lg border border-transparent px-3 py-2.5 text-sm cursor-pointer transition-colors
                      ${node.id === selectedNodeId ? 'border-[var(--border-color)] bg-[var(--surface)]' : 'hover:bg-[var(--surface)]/50'}
                    `}
                  >
                    {editingId === node.id ? (
                      <input
                        autoFocus
                        value={editLabel}
                        onChange={(e) => setEditLabel(e.target.value)}
                        onBlur={commitEdit}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') commitEdit();
                          if (e.key === 'Escape') setEditingId(null);
                        }}
                        className="flex-1 bg-transparent text-[var(--foreground)] outline-none"
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <span
                        className="flex-1 text-[var(--foreground)]"
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          startEdit(node.id, node.label);
                        }}
                      >
                        {node.label}
                      </span>
                    )}

                    {/* Impact/Effort badges */}
                    <span className="hidden text-[10px] text-[var(--muted)] group-hover:inline">
                      I:{node.impact} E:{node.effort}
                    </span>

                    {/* Delete */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNode(node.id);
                      }}
                      className="hidden text-[var(--muted)] hover:text-[var(--thinking-rose)] group-hover:block"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

'use client';

import { useCallback, useRef } from 'react';
import { useThinkingStore } from '@/lib/thinking/store';
import type { NodeType } from '@/lib/thinking/types';

const typeColor: Record<NodeType, string> = {
  hypothesis: 'var(--thinking-blue)',
  assumption: 'var(--thinking-amber)',
  risk: 'var(--thinking-rose)',
};

const typeBg: Record<NodeType, string> = {
  hypothesis: 'bg-[var(--thinking-blue-bg)] border-[var(--thinking-blue-border)]',
  assumption: 'bg-[var(--thinking-amber-bg)] border-[var(--thinking-amber-border)]',
  risk: 'bg-[var(--thinking-rose-bg)] border-[var(--thinking-rose-border)]',
};

const quadrantLabels = [
  { label: 'Quick Wins', x: 'left', y: 'top', desc: 'High impact, low effort' },
  { label: 'Big Bets', x: 'right', y: 'top', desc: 'High impact, high effort' },
  { label: 'Fill-ins', x: 'left', y: 'bottom', desc: 'Low impact, low effort' },
  { label: 'Avoid', x: 'right', y: 'bottom', desc: 'Low impact, high effort' },
];

export function MatrixView() {
  const nodes = useThinkingStore((s) => s.nodes);
  const selectedNodeId = useThinkingStore((s) => s.selectedNodeId);
  const selectNode = useThinkingStore((s) => s.selectNode);
  const updateNode = useThinkingStore((s) => s.updateNode);
  const gridRef = useRef<HTMLDivElement>(null);

  const handleDragStart = useCallback((e: React.DragEvent, nodeId: string) => {
    e.dataTransfer.setData('text/plain', nodeId);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const nodeId = e.dataTransfer.getData('text/plain');
      if (!nodeId || !gridRef.current) return;

      const rect = gridRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const effort = Math.round(Math.max(0, Math.min(100, (x / rect.width) * 100)));
      const impact = Math.round(Math.max(0, Math.min(100, 100 - (y / rect.height) * 100)));

      updateNode(nodeId, { effort, impact });
    },
    [updateNode]
  );

  return (
    <div className="flex h-full flex-col gap-4 p-6">
      {/* Axis labels */}
      <div className="relative flex-1">
        <div className="absolute -left-1 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] font-semibold uppercase tracking-widest text-[var(--muted)]">
          Impact
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-6 text-[10px] font-semibold uppercase tracking-widest text-[var(--muted)]">
          Effort
        </div>

        {/* Grid */}
        <div
          ref={gridRef}
          className="relative ml-6 h-full rounded-xl border border-[var(--border-color)] bg-[var(--surface)]/30"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {/* Quadrant lines */}
          <div className="absolute left-1/2 top-0 h-full w-px bg-[var(--border-color)]" />
          <div className="absolute left-0 top-1/2 h-px w-full bg-[var(--border-color)]" />

          {/* Quadrant labels */}
          <div className="absolute left-3 top-3 text-[11px] font-medium text-[var(--muted)]/60">Quick Wins</div>
          <div className="absolute right-3 top-3 text-[11px] font-medium text-[var(--muted)]/60">Big Bets</div>
          <div className="absolute bottom-3 left-3 text-[11px] font-medium text-[var(--muted)]/60">Fill-ins</div>
          <div className="absolute bottom-3 right-3 text-[11px] font-medium text-[var(--muted)]/60">Avoid</div>

          {/* Nodes */}
          {nodes.map((node) => {
            const left = `${node.effort}%`;
            const top = `${100 - node.impact}%`;

            return (
              <div
                key={node.id}
                draggable
                onDragStart={(e) => handleDragStart(e, node.id)}
                onClick={() => selectNode(node.id)}
                className={`
                  absolute -translate-x-1/2 -translate-y-1/2 cursor-grab rounded-lg border px-3 py-1.5
                  text-[11px] font-medium transition-shadow active:cursor-grabbing
                  ${typeBg[node.type]}
                  ${node.id === selectedNodeId ? 'ring-1 ring-white/20 shadow-lg' : 'hover:shadow-md'}
                `}
                style={{
                  left,
                  top,
                  color: typeColor[node.type],
                  maxWidth: 160,
                }}
                title={node.label}
              >
                <span className="line-clamp-2">{node.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

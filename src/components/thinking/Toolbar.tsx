'use client';

import { useState } from 'react';
import { useThinkingStore } from '@/lib/thinking/store';
import { ViewSwitcher } from './ViewSwitcher';
import type { NodeType } from '@/lib/thinking/types';

export function Toolbar() {
  const problem = useThinkingStore((s) => s.problem);
  const nodes = useThinkingStore((s) => s.nodes);
  const reset = useThinkingStore((s) => s.reset);
  const addNode = useThinkingStore((s) => s.addNode);
  const exportJSON = useThinkingStore((s) => s.exportJSON);
  const [showAdd, setShowAdd] = useState(false);

  const handleAddNode = (type: NodeType) => {
    const id = `n${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    addNode({
      id,
      type,
      label: `New ${type}`,
      position: { x: 300 + Math.random() * 200, y: 200 + Math.random() * 200 },
      impact: 50,
      effort: 50,
    });
    setShowAdd(false);
  };

  const handleExport = () => {
    const json = exportJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'thinking-session.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const counts = {
    hypothesis: nodes.filter((n) => n.type === 'hypothesis').length,
    assumption: nodes.filter((n) => n.type === 'assumption').length,
    risk: nodes.filter((n) => n.type === 'risk').length,
  };

  return (
    <div className="flex items-center justify-between border-b border-[var(--border-color)] bg-[var(--background)]/80 px-5 py-3 backdrop-blur-sm">
      {/* Left: problem + counts */}
      <div className="flex items-center gap-4 min-w-0">
        <h2 className="truncate text-sm font-semibold text-[var(--foreground)]" title={problem}>
          {problem}
        </h2>
        <div className="hidden items-center gap-2 sm:flex">
          <span className="rounded-full bg-[var(--thinking-blue-bg)] px-2 py-0.5 text-[10px] font-semibold text-[var(--thinking-blue)]">
            {counts.hypothesis} H
          </span>
          <span className="rounded-full bg-[var(--thinking-amber-bg)] px-2 py-0.5 text-[10px] font-semibold text-[var(--thinking-amber)]">
            {counts.assumption} A
          </span>
          <span className="rounded-full bg-[var(--thinking-rose-bg)] px-2 py-0.5 text-[10px] font-semibold text-[var(--thinking-rose)]">
            {counts.risk} R
          </span>
        </div>
      </div>

      {/* Center: view switcher */}
      <ViewSwitcher />

      {/* Right: actions */}
      <div className="flex items-center gap-2">
        {/* Add node */}
        <div className="relative">
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="rounded-lg border border-[var(--border-color)] bg-[var(--surface)] p-2 text-[var(--muted)] transition-colors hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>
          {showAdd && (
            <div className="absolute right-0 top-full z-50 mt-1 w-40 rounded-lg border border-[var(--border-color)] bg-[var(--surface)] py-1 shadow-xl shadow-black/20 animate-scale-in">
              <button onClick={() => handleAddNode('hypothesis')} className="flex w-full items-center gap-2 px-3 py-2 text-xs text-[var(--thinking-blue)] hover:bg-white/5">
                + Hypothesis
              </button>
              <button onClick={() => handleAddNode('assumption')} className="flex w-full items-center gap-2 px-3 py-2 text-xs text-[var(--thinking-amber)] hover:bg-white/5">
                + Assumption
              </button>
              <button onClick={() => handleAddNode('risk')} className="flex w-full items-center gap-2 px-3 py-2 text-xs text-[var(--thinking-rose)] hover:bg-white/5">
                + Risk
              </button>
            </div>
          )}
        </div>

        {/* Export */}
        <button
          onClick={handleExport}
          className="rounded-lg border border-[var(--border-color)] bg-[var(--surface)] p-2 text-[var(--muted)] transition-colors hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"
          title="Export JSON"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
        </button>

        {/* Reset */}
        <button
          onClick={reset}
          className="rounded-lg border border-[var(--border-color)] bg-[var(--surface)] p-2 text-[var(--muted)] transition-colors hover:bg-[var(--thinking-rose)]/10 hover:text-[var(--thinking-rose)]"
          title="New problem"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
          </svg>
        </button>
      </div>
    </div>
  );
}

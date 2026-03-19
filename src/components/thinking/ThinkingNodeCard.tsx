'use client';

import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { NodeType } from '@/lib/thinking/types';

const typeStyles: Record<NodeType, { bg: string; border: string; accent: string; label: string }> = {
  hypothesis: {
    bg: 'bg-[var(--thinking-blue-bg)]',
    border: 'border-[var(--thinking-blue-border)]',
    accent: 'text-[var(--thinking-blue)]',
    label: 'Hypothesis',
  },
  assumption: {
    bg: 'bg-[var(--thinking-amber-bg)]',
    border: 'border-[var(--thinking-amber-border)]',
    accent: 'text-[var(--thinking-amber)]',
    label: 'Assumption',
  },
  risk: {
    bg: 'bg-[var(--thinking-rose-bg)]',
    border: 'border-[var(--thinking-rose-border)]',
    accent: 'text-[var(--thinking-rose)]',
    label: 'Risk',
  },
};

const typeIcons: Record<NodeType, React.ReactNode> = {
  hypothesis: (
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
    </svg>
  ),
  assumption: (
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
    </svg>
  ),
  risk: (
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
  ),
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ThinkingNodeCardInner({ data }: any) {
  const nodeType = data.nodeType as NodeType;
  const label = data.label as string;
  const isSelected = data.selected as boolean | undefined;
  const style = typeStyles[nodeType];

  return (
    <>
      <Handle type="target" position={Position.Top} className="!w-2 !h-2 !bg-[var(--border-color)] !border-[var(--surface)]" />
      <div
        className={`
          group relative min-w-[180px] max-w-[220px] rounded-xl border px-4 py-3
          backdrop-blur-sm transition-all duration-200
          ${style.bg} ${style.border}
          ${isSelected ? 'ring-1 ring-white/20 shadow-lg shadow-black/20' : 'hover:shadow-md hover:shadow-black/10'}
        `}
      >
        <div className={`flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest ${style.accent}`}>
          {typeIcons[nodeType]}
          {style.label}
        </div>
        <p className="mt-1.5 text-[13px] font-medium leading-snug text-[var(--foreground)]">
          {label}
        </p>
      </div>
      <Handle type="source" position={Position.Bottom} className="!w-2 !h-2 !bg-[var(--border-color)] !border-[var(--surface)]" />
    </>
  );
}

export const ThinkingNodeCard = memo(ThinkingNodeCardInner);

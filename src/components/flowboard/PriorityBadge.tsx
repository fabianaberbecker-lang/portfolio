'use client';

import type { Priority } from '@/lib/flowboard/types';
import { PRIORITIES } from '@/lib/flowboard/constants';

interface PriorityBadgeProps {
  priority: Priority;
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  if (priority === 'none') return null;

  const p = PRIORITIES.find((pr) => pr.value === priority);
  if (!p) return null;

  return (
    <span
      className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded"
      style={{ backgroundColor: p.color + '25' }}
    >
      <svg
        className="h-2.5 w-2.5"
        fill={p.color}
        viewBox="0 0 24 24"
      >
        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
        <line x1="4" y1="22" x2="4" y2="15" stroke={p.color} strokeWidth="2" />
      </svg>
    </span>
  );
}

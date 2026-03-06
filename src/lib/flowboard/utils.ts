export function generateId(): string {
  return crypto.randomUUID().replace(/-/g, '').slice(0, 12);
}

export function now(): string {
  return new Date().toISOString();
}

export function formatRelativeDate(iso: string): string {
  const date = new Date(iso);
  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}

export type DueDateStatus = 'overdue' | 'soon' | 'normal' | 'complete' | null;

export function getDueDateStatus(dueDate: string | null, checklistDone?: boolean): DueDateStatus {
  if (!dueDate) return null;
  if (checklistDone) return 'complete';
  const due = new Date(dueDate + 'T23:59:59');
  const now = Date.now();
  if (due.getTime() < now) return 'overdue';
  if (due.getTime() - now < 24 * 60 * 60 * 1000) return 'soon';
  return 'normal';
}

export function formatDueDate(dueDate: string): string {
  const due = new Date(dueDate + 'T23:59:59');
  const now = Date.now();
  const diff = due.getTime() - now;
  const days = Math.ceil(diff / 86400000);

  if (days < -1) return `${Math.abs(days)}d overdue`;
  if (days === -1 || (days === 0 && diff < 0)) return 'Overdue';
  if (days === 0) return 'Due today';
  if (days === 1) return 'Due tomorrow';
  if (days <= 7) return `Due in ${days}d`;
  return new Date(dueDate).toLocaleDateString();
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function fuzzyMatch(text: string, query: string): boolean {
  const lower = text.toLowerCase();
  const q = query.toLowerCase();
  let qi = 0;
  for (let i = 0; i < lower.length && qi < q.length; i++) {
    if (lower[i] === q[qi]) qi++;
  }
  return qi === q.length;
}

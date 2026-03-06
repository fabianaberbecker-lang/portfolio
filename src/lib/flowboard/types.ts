// ==========================================
// FlowBoard — Core Data Types
// ==========================================

export type ViewMode = 'kanban' | 'canvas';

export type CardColor =
  | 'default'
  | 'blue'
  | 'purple'
  | 'green'
  | 'amber'
  | 'red'
  | 'pink';

export type Priority = 'none' | 'low' | 'medium' | 'high' | 'urgent';

export type Anchor = 'top' | 'right' | 'bottom' | 'left';

export interface CanvasViewport {
  panX: number;
  panY: number;
  zoom: number; // 0.25–2.0
}

export interface FlowBoard {
  id: string;
  title: string;
  emoji: string;
  createdAt: string;
  updatedAt: string;
  defaultMode: ViewMode;
  canvasViewport: CanvasViewport;
  members: string[];
}

export interface FlowColumn {
  id: string;
  boardId: string;
  title: string;
  order: number;
}

export interface FlowCard {
  id: string;
  boardId: string;
  title: string;
  description: string;
  color: CardColor;
  labels: string[];
  priority: Priority;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  // Kanban position
  columnId: string | null;
  columnOrder: number;
  // Canvas position
  canvasX: number;
  canvasY: number;
  // Rich features
  checklist: ChecklistItem[];
  comments: CardComment[];
  assignees: string[];
  archived: boolean;
}

export interface Connector {
  id: string;
  boardId: string;
  fromCardId: string;
  toCardId: string;
  fromAnchor: Anchor;
  toAnchor: Anchor;
  label?: string;
  style: 'solid' | 'dashed';
}

export interface ChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

export interface CardComment {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

export interface CardFilter {
  search: string;
  labels: string[];
  priorities: Priority[];
  colors: CardColor[];
}

export interface Command {
  id: string;
  label: string;
  shortcut?: string;
  action: () => void;
  category: 'board' | 'card' | 'view' | 'navigation';
}

export interface BoardData {
  board: FlowBoard;
  columns: FlowColumn[];
  cards: FlowCard[];
  connectors: Connector[];
}

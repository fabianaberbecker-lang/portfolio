export type NodeType = 'hypothesis' | 'assumption' | 'risk';

export interface ThinkingNode {
  id: string;
  type: NodeType;
  label: string;
  notes?: string;
  position: { x: number; y: number };
  impact: number;   // 0–100
  effort: number;   // 0–100
}

export interface ThinkingEdge {
  id: string;
  source: string;
  target: string;
}

export type ViewMode = 'map' | 'matrix' | 'list';

export interface ThinkingSession {
  id: string;
  problem: string;
  nodes: ThinkingNode[];
  edges: ThinkingEdge[];
  createdAt: number;
}

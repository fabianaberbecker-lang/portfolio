import { create } from 'zustand';
import { ThinkingNode, ThinkingEdge, ViewMode, ThinkingSession } from './types';
import { generateThinkingGraph } from './generator';

const STORAGE_KEY = 'thinking-session';

interface ThinkingState {
  // Session
  problem: string;
  nodes: ThinkingNode[];
  edges: ThinkingEdge[];
  sessionId: string | null;

  // UI
  view: ViewMode;
  selectedNodeId: string | null;

  // Actions
  setProblem: (problem: string) => void;
  generate: (problem: string) => void;
  setView: (view: ViewMode) => void;
  selectNode: (id: string | null) => void;

  // Node mutations
  updateNode: (id: string, patch: Partial<ThinkingNode>) => void;
  addNode: (node: ThinkingNode) => void;
  deleteNode: (id: string) => void;
  updateNodePosition: (id: string, position: { x: number; y: number }) => void;

  // Edge mutations
  addEdge: (edge: ThinkingEdge) => void;
  deleteEdge: (id: string) => void;

  // Persistence
  save: () => void;
  load: () => boolean;
  exportJSON: () => string;
  reset: () => void;
}

export const useThinkingStore = create<ThinkingState>((set, get) => ({
  problem: '',
  nodes: [],
  edges: [],
  sessionId: null,
  view: 'map',
  selectedNodeId: null,

  setProblem: (problem) => set({ problem }),

  generate: (problem) => {
    const { nodes, edges } = generateThinkingGraph(problem);
    const sessionId = `s-${Date.now()}`;
    set({ problem, nodes, edges, sessionId, selectedNodeId: null });
    // Auto-save
    setTimeout(() => get().save(), 0);
  },

  setView: (view) => set({ view }),
  selectNode: (id) => set({ selectedNodeId: id }),

  updateNode: (id, patch) => {
    set((s) => ({
      nodes: s.nodes.map((n) => (n.id === id ? { ...n, ...patch } : n)),
    }));
    setTimeout(() => get().save(), 0);
  },

  addNode: (node) => {
    set((s) => ({ nodes: [...s.nodes, node] }));
    setTimeout(() => get().save(), 0);
  },

  deleteNode: (id) => {
    set((s) => ({
      nodes: s.nodes.filter((n) => n.id !== id),
      edges: s.edges.filter((e) => e.source !== id && e.target !== id),
      selectedNodeId: s.selectedNodeId === id ? null : s.selectedNodeId,
    }));
    setTimeout(() => get().save(), 0);
  },

  updateNodePosition: (id, position) => {
    set((s) => ({
      nodes: s.nodes.map((n) => (n.id === id ? { ...n, position } : n)),
    }));
  },

  addEdge: (edge) => {
    set((s) => ({ edges: [...s.edges, edge] }));
    setTimeout(() => get().save(), 0);
  },

  deleteEdge: (id) => {
    set((s) => ({ edges: s.edges.filter((e) => e.id !== id) }));
    setTimeout(() => get().save(), 0);
  },

  save: () => {
    const { problem, nodes, edges, sessionId } = get();
    if (!sessionId) return;
    const session: ThinkingSession = {
      id: sessionId,
      problem,
      nodes,
      edges,
      createdAt: Date.now(),
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } catch {
      // storage full or unavailable
    }
  },

  load: () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return false;
      const session: ThinkingSession = JSON.parse(raw);
      set({
        problem: session.problem,
        nodes: session.nodes,
        edges: session.edges,
        sessionId: session.id,
        selectedNodeId: null,
      });
      return true;
    } catch {
      return false;
    }
  },

  exportJSON: () => {
    const { problem, nodes, edges } = get();
    return JSON.stringify({ problem, nodes, edges }, null, 2);
  },

  reset: () => {
    set({
      problem: '',
      nodes: [],
      edges: [],
      sessionId: null,
      selectedNodeId: null,
      view: 'map',
    });
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // noop
    }
  },
}));

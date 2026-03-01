import { create } from 'zustand';
import { temporal } from 'zundo';
import type {
  FlowBoard,
  FlowColumn,
  FlowCard,
  Connector,
  ViewMode,
  CanvasViewport,
  CardFilter,
  Priority,
  CardColor,
  Anchor,
  BoardData,
} from './types';
import { loadAllBoards, persistBoard, deleteBoard as dbDeleteBoard } from './db';
import { generateId, now } from './utils';
import {
  DEFAULT_COLUMNS,
  DEFAULT_VIEWPORT,
  PERSIST_DEBOUNCE_MS,
  UNDO_LIMIT,
  UNDO_DEBOUNCE_MS,
} from './constants';
import { autoLayoutFromKanban } from './auto-layout';

// ---- State shape ----

interface DataState {
  boards: FlowBoard[];
  columns: FlowColumn[];
  cards: FlowCard[];
  connectors: Connector[];
}

interface UIState {
  activeBoardId: string | null;
  activeMode: ViewMode;
  selectedCardIds: string[];
  editingCardId: string | null;
  filter: CardFilter;
  isCommandPaletteOpen: boolean;
  isLoaded: boolean;
}

interface FlowBoardActions {
  // Load
  loadBoards: () => Promise<void>;

  // Board CRUD
  createBoard: (title: string, emoji?: string) => string;
  updateBoard: (id: string, updates: Partial<Pick<FlowBoard, 'title' | 'emoji' | 'defaultMode'>>) => void;
  deleteBoard: (id: string) => void;
  setActiveBoard: (id: string | null) => void;

  // Column CRUD
  addColumn: (boardId: string, title: string) => string;
  updateColumn: (id: string, updates: Partial<Pick<FlowColumn, 'title'>>) => void;
  deleteColumn: (id: string) => void;
  reorderColumns: (boardId: string, orderedIds: string[]) => void;

  // Card CRUD
  addCard: (boardId: string, columnId: string | null, title: string) => string;
  updateCard: (id: string, updates: Partial<Pick<FlowCard, 'title' | 'description' | 'color' | 'labels' | 'priority' | 'dueDate'>>) => void;
  deleteCard: (id: string) => void;
  moveCardToColumn: (cardId: string, targetColumnId: string, targetIndex: number) => void;
  moveCardOnCanvas: (cardId: string, x: number, y: number) => void;
  reorderCardsInColumn: (columnId: string, orderedCardIds: string[]) => void;
  duplicateCard: (id: string) => string | null;

  // Selection
  selectCard: (id: string, multi?: boolean) => void;
  deselectAll: () => void;
  setEditingCard: (id: string | null) => void;

  // Connector CRUD
  addConnector: (boardId: string, fromCardId: string, toCardId: string, fromAnchor: Anchor, toAnchor: Anchor) => string;
  deleteConnector: (id: string) => void;
  updateConnector: (id: string, updates: Partial<Pick<Connector, 'label' | 'style'>>) => void;

  // View
  setMode: (mode: ViewMode) => void;
  setCanvasViewport: (boardId: string, viewport: Partial<CanvasViewport>) => void;
  setFilter: (filter: Partial<CardFilter>) => void;
  clearFilter: () => void;
  toggleCommandPalette: () => void;
  setCommandPaletteOpen: (open: boolean) => void;
}

export type FlowBoardState = DataState & UIState & FlowBoardActions;

const defaultFilter: CardFilter = {
  search: '',
  labels: [],
  priorities: [],
  colors: [],
};

export const useFlowBoardStore = create<FlowBoardState>()(
  temporal(
    (set, get) => ({
      // ---- Data ----
      boards: [],
      columns: [],
      cards: [],
      connectors: [],

      // ---- UI ----
      activeBoardId: null,
      activeMode: 'kanban',
      selectedCardIds: [],
      editingCardId: null,
      filter: { ...defaultFilter },
      isCommandPaletteOpen: false,
      isLoaded: false,

      // ---- Load ----
      loadBoards: async () => {
        try {
          const allData = await loadAllBoards();
          const boards: FlowBoard[] = [];
          const columns: FlowColumn[] = [];
          const cards: FlowCard[] = [];
          const connectors: Connector[] = [];

          for (const d of allData) {
            boards.push(d.board);
            columns.push(...d.columns);
            cards.push(...d.cards);
            connectors.push(...d.connectors);
          }

          set({ boards, columns, cards, connectors, isLoaded: true });
        } catch {
          set({ isLoaded: true });
        }
      },

      // ---- Board CRUD ----
      createBoard: (title, emoji = 'indigo') => {
        const id = generateId();
        const timestamp = now();
        const board: FlowBoard = {
          id,
          title,
          emoji,
          createdAt: timestamp,
          updatedAt: timestamp,
          defaultMode: 'kanban',
          canvasViewport: { ...DEFAULT_VIEWPORT },
        };

        // Create default columns
        const cols: FlowColumn[] = DEFAULT_COLUMNS.map((name, i) => ({
          id: generateId(),
          boardId: id,
          title: name,
          order: i,
        }));

        set((s) => ({
          boards: [...s.boards, board],
          columns: [...s.columns, ...cols],
        }));

        schedulePersist(get, id);
        return id;
      },

      updateBoard: (id, updates) => {
        set((s) => ({
          boards: s.boards.map((b) =>
            b.id === id ? { ...b, ...updates, updatedAt: now() } : b
          ),
        }));
        schedulePersist(get, id);
      },

      deleteBoard: (id) => {
        set((s) => ({
          boards: s.boards.filter((b) => b.id !== id),
          columns: s.columns.filter((c) => c.boardId !== id),
          cards: s.cards.filter((c) => c.boardId !== id),
          connectors: s.connectors.filter((c) => c.boardId !== id),
          activeBoardId: s.activeBoardId === id ? null : s.activeBoardId,
        }));
        dbDeleteBoard(id).catch(() => {});
      },

      setActiveBoard: (id) => {
        set({ activeBoardId: id, selectedCardIds: [], editingCardId: null });
        if (id) {
          const board = get().boards.find((b) => b.id === id);
          if (board) {
            set({ activeMode: board.defaultMode });
          }
        }
      },

      // ---- Column CRUD ----
      addColumn: (boardId, title) => {
        const id = generateId();
        const maxOrder = Math.max(0, ...get().columns.filter((c) => c.boardId === boardId).map((c) => c.order));
        const col: FlowColumn = { id, boardId, title, order: maxOrder + 1 };
        set((s) => ({ columns: [...s.columns, col] }));
        schedulePersist(get, boardId);
        return id;
      },

      updateColumn: (id, updates) => {
        const col = get().columns.find((c) => c.id === id);
        if (!col) return;
        set((s) => ({
          columns: s.columns.map((c) => (c.id === id ? { ...c, ...updates } : c)),
        }));
        schedulePersist(get, col.boardId);
      },

      deleteColumn: (id) => {
        const col = get().columns.find((c) => c.id === id);
        if (!col) return;
        // Move cards in this column to unassigned
        set((s) => ({
          columns: s.columns.filter((c) => c.id !== id),
          cards: s.cards.map((c) =>
            c.columnId === id ? { ...c, columnId: null, updatedAt: now() } : c
          ),
        }));
        schedulePersist(get, col.boardId);
      },

      reorderColumns: (boardId, orderedIds) => {
        set((s) => ({
          columns: s.columns.map((c) => {
            if (c.boardId !== boardId) return c;
            const newOrder = orderedIds.indexOf(c.id);
            return newOrder >= 0 ? { ...c, order: newOrder } : c;
          }),
        }));
        schedulePersist(get, boardId);
      },

      // ---- Card CRUD ----
      addCard: (boardId, columnId, title) => {
        const id = generateId();
        const timestamp = now();

        // Calculate column order
        let columnOrder = 0;
        if (columnId) {
          const existing = get().cards.filter((c) => c.columnId === columnId);
          columnOrder = existing.length;
        }

        // Auto canvas position: offset from existing cards
        const boardCards = get().cards.filter((c) => c.boardId === boardId);
        const canvasX = 100 + (boardCards.length % 5) * 280;
        const canvasY = 100 + Math.floor(boardCards.length / 5) * 120;

        const card: FlowCard = {
          id,
          boardId,
          title,
          description: '',
          color: 'default',
          labels: [],
          priority: 'none',
          dueDate: null,
          createdAt: timestamp,
          updatedAt: timestamp,
          columnId,
          columnOrder,
          canvasX,
          canvasY,
        };

        set((s) => ({ cards: [...s.cards, card] }));
        schedulePersist(get, boardId);
        return id;
      },

      updateCard: (id, updates) => {
        const card = get().cards.find((c) => c.id === id);
        if (!card) return;
        set((s) => ({
          cards: s.cards.map((c) =>
            c.id === id ? { ...c, ...updates, updatedAt: now() } : c
          ),
        }));
        schedulePersist(get, card.boardId);
      },

      deleteCard: (id) => {
        const card = get().cards.find((c) => c.id === id);
        if (!card) return;
        set((s) => ({
          cards: s.cards.filter((c) => c.id !== id),
          connectors: s.connectors.filter(
            (c) => c.fromCardId !== id && c.toCardId !== id
          ),
          selectedCardIds: s.selectedCardIds.filter((sid) => sid !== id),
          editingCardId: s.editingCardId === id ? null : s.editingCardId,
        }));
        schedulePersist(get, card.boardId);
      },

      moveCardToColumn: (cardId, targetColumnId, targetIndex) => {
        const card = get().cards.find((c) => c.id === cardId);
        if (!card) return;

        set((s) => {
          // Remove card from current position and shift others
          let updated = s.cards.map((c) => {
            if (c.id === cardId) {
              return { ...c, columnId: targetColumnId, columnOrder: targetIndex, updatedAt: now() };
            }
            return c;
          });

          // Reindex target column
          const targetCards = updated
            .filter((c) => c.columnId === targetColumnId && c.id !== cardId)
            .sort((a, b) => a.columnOrder - b.columnOrder);

          // Insert at targetIndex
          targetCards.splice(targetIndex, 0, updated.find((c) => c.id === cardId)!);

          // Apply new orders
          const orderMap = new Map<string, number>();
          targetCards.forEach((c, i) => orderMap.set(c.id, i));

          updated = updated.map((c) => {
            const newOrder = orderMap.get(c.id);
            return newOrder !== undefined ? { ...c, columnOrder: newOrder } : c;
          });

          return { cards: updated };
        });
        schedulePersist(get, card.boardId);
      },

      moveCardOnCanvas: (cardId, x, y) => {
        set((s) => ({
          cards: s.cards.map((c) =>
            c.id === cardId ? { ...c, canvasX: x, canvasY: y, updatedAt: now() } : c
          ),
        }));
        // Don't schedule persist during drag — let the caller do it on drag end
      },

      reorderCardsInColumn: (columnId, orderedCardIds) => {
        const first = get().cards.find((c) => c.columnId === columnId);
        if (!first) return;
        set((s) => ({
          cards: s.cards.map((c) => {
            if (c.columnId !== columnId) return c;
            const newOrder = orderedCardIds.indexOf(c.id);
            return newOrder >= 0 ? { ...c, columnOrder: newOrder } : c;
          }),
        }));
        schedulePersist(get, first.boardId);
      },

      duplicateCard: (id) => {
        const card = get().cards.find((c) => c.id === id);
        if (!card) return null;
        const newId = generateId();
        const timestamp = now();
        const duplicate: FlowCard = {
          ...card,
          id: newId,
          title: `${card.title} (copy)`,
          createdAt: timestamp,
          updatedAt: timestamp,
          columnOrder: card.columnOrder + 1,
          canvasX: card.canvasX + 20,
          canvasY: card.canvasY + 20,
        };
        set((s) => ({ cards: [...s.cards, duplicate] }));
        schedulePersist(get, card.boardId);
        return newId;
      },

      // ---- Selection ----
      selectCard: (id, multi = false) => {
        set((s) => {
          if (multi) {
            const already = s.selectedCardIds.includes(id);
            return {
              selectedCardIds: already
                ? s.selectedCardIds.filter((sid) => sid !== id)
                : [...s.selectedCardIds, id],
            };
          }
          return { selectedCardIds: [id] };
        });
      },

      deselectAll: () => set({ selectedCardIds: [] }),

      setEditingCard: (id) => set({ editingCardId: id }),

      // ---- Connector CRUD ----
      addConnector: (boardId, fromCardId, toCardId, fromAnchor, toAnchor) => {
        // Don't allow duplicate connectors
        const exists = get().connectors.find(
          (c) => c.fromCardId === fromCardId && c.toCardId === toCardId
        );
        if (exists) return exists.id;

        const id = generateId();
        const connector: Connector = {
          id,
          boardId,
          fromCardId,
          toCardId,
          fromAnchor,
          toAnchor,
          style: 'solid',
        };
        set((s) => ({ connectors: [...s.connectors, connector] }));
        schedulePersist(get, boardId);
        return id;
      },

      deleteConnector: (id) => {
        const conn = get().connectors.find((c) => c.id === id);
        if (!conn) return;
        set((s) => ({ connectors: s.connectors.filter((c) => c.id !== id) }));
        schedulePersist(get, conn.boardId);
      },

      updateConnector: (id, updates) => {
        const conn = get().connectors.find((c) => c.id === id);
        if (!conn) return;
        set((s) => ({
          connectors: s.connectors.map((c) => (c.id === id ? { ...c, ...updates } : c)),
        }));
        schedulePersist(get, conn.boardId);
      },

      // ---- View ----
      setMode: (mode) => {
        const state = get();
        const boardId = state.activeBoardId;
        if (!boardId) return;

        // When switching to canvas, auto-layout if cards have default positions
        if (mode === 'canvas') {
          const boardCards = state.cards.filter((c) => c.boardId === boardId);
          const allAtOrigin = boardCards.every((c) => c.canvasX === 0 && c.canvasY === 0);
          if (allAtOrigin && boardCards.length > 0) {
            const boardColumns = state.columns.filter((c) => c.boardId === boardId);
            const positions = autoLayoutFromKanban(boardCards, boardColumns);
            set((s) => ({
              activeMode: mode,
              cards: s.cards.map((c) => {
                const pos = positions.get(c.id);
                return pos ? { ...c, canvasX: pos.x, canvasY: pos.y } : c;
              }),
            }));
            schedulePersist(get, boardId);
            return;
          }
        }

        set({ activeMode: mode });
      },

      setCanvasViewport: (boardId, viewport) => {
        set((s) => ({
          boards: s.boards.map((b) =>
            b.id === boardId
              ? { ...b, canvasViewport: { ...b.canvasViewport, ...viewport } }
              : b
          ),
        }));
      },

      setFilter: (filter) => {
        set((s) => ({ filter: { ...s.filter, ...filter } }));
      },

      clearFilter: () => set({ filter: { ...defaultFilter } }),

      toggleCommandPalette: () => {
        set((s) => ({ isCommandPaletteOpen: !s.isCommandPaletteOpen }));
      },

      setCommandPaletteOpen: (open) => set({ isCommandPaletteOpen: open }),
    }),
    {
      // Only track data slices for undo/redo
      partialize: (state) => ({
        boards: state.boards,
        columns: state.columns,
        cards: state.cards,
        connectors: state.connectors,
      }),
      limit: UNDO_LIMIT,
      handleSet: (handleSet) => {
        let timeout: ReturnType<typeof setTimeout>;
        return (state) => {
          clearTimeout(timeout);
          timeout = setTimeout(() => handleSet(state), UNDO_DEBOUNCE_MS);
        };
      },
    }
  )
);

// ---- Persistence ----

const persistTimers = new Map<string, ReturnType<typeof setTimeout>>();

function schedulePersist(get: () => FlowBoardState, boardId: string) {
  const existing = persistTimers.get(boardId);
  if (existing) clearTimeout(existing);

  persistTimers.set(
    boardId,
    setTimeout(() => {
      const state = get();
      const board = state.boards.find((b) => b.id === boardId);
      if (!board) return;

      const data: BoardData = {
        board,
        columns: state.columns.filter((c) => c.boardId === boardId),
        cards: state.cards.filter((c) => c.boardId === boardId),
        connectors: state.connectors.filter((c) => c.boardId === boardId),
      };
      persistBoard(data).catch(() => {});
      persistTimers.delete(boardId);
    }, PERSIST_DEBOUNCE_MS)
  );
}

// ---- Selectors (for use with shallow comparison) ----

export const selectBoardColumns = (boardId: string) => (state: FlowBoardState) =>
  state.columns.filter((c) => c.boardId === boardId).sort((a, b) => a.order - b.order);

export const selectBoardCards = (boardId: string) => (state: FlowBoardState) =>
  state.cards.filter((c) => c.boardId === boardId);

export const selectColumnCards = (columnId: string) => (state: FlowBoardState) =>
  state.cards.filter((c) => c.columnId === columnId).sort((a, b) => a.columnOrder - b.columnOrder);

export const selectBoardConnectors = (boardId: string) => (state: FlowBoardState) =>
  state.connectors.filter((c) => c.boardId === boardId);

export const selectFilteredCards = (boardId: string) => (state: FlowBoardState) => {
  let filtered = state.cards.filter((c) => c.boardId === boardId);
  const { search, labels, priorities, colors } = state.filter;

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.labels.some((l) => l.toLowerCase().includes(q))
    );
  }
  if (labels.length > 0) {
    filtered = filtered.filter((c) => c.labels.some((l) => labels.includes(l)));
  }
  if (priorities.length > 0) {
    filtered = filtered.filter((c) => priorities.includes(c.priority));
  }
  if (colors.length > 0) {
    filtered = filtered.filter((c) => colors.includes(c.color));
  }

  return filtered;
};

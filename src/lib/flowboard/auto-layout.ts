import type { FlowCard, FlowColumn } from './types';
import { CANVAS_CARD_WIDTH, CANVAS_CARD_MIN_HEIGHT, GRID_SNAP } from './constants';

const COLUMN_GAP = 280;
const CARD_GAP = 20;
const START_X = 100;
const START_Y = 100;

/**
 * Auto-arrange cards in canvas space based on their Kanban column positions.
 * Cards in the same column are stacked vertically; columns are spaced horizontally.
 */
export function autoLayoutFromKanban(
  cards: FlowCard[],
  columns: FlowColumn[],
): Map<string, { x: number; y: number }> {
  const positions = new Map<string, { x: number; y: number }>();
  const sortedColumns = [...columns].sort((a, b) => a.order - b.order);

  sortedColumns.forEach((col, colIndex) => {
    const colCards = cards
      .filter((c) => c.columnId === col.id)
      .sort((a, b) => a.columnOrder - b.columnOrder);

    const x = snapToGrid(START_X + colIndex * COLUMN_GAP);

    colCards.forEach((card, cardIndex) => {
      const y = snapToGrid(START_Y + cardIndex * (CANVAS_CARD_MIN_HEIGHT + CARD_GAP));
      positions.set(card.id, { x, y });
    });
  });

  // Cards without a column go at the end
  const unassigned = cards.filter((c) => !c.columnId);
  const lastColX = snapToGrid(START_X + sortedColumns.length * COLUMN_GAP);
  unassigned.forEach((card, i) => {
    positions.set(card.id, {
      x: lastColX,
      y: snapToGrid(START_Y + i * (CANVAS_CARD_MIN_HEIGHT + CARD_GAP)),
    });
  });

  return positions;
}

function snapToGrid(value: number): number {
  return Math.round(value / GRID_SNAP) * GRID_SNAP;
}

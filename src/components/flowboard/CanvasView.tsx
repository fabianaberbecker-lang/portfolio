'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useFlowBoardStore, selectBoardCards, selectBoardConnectors } from '@/lib/flowboard/store';
import { clamp } from '@/lib/flowboard/utils';
import { screenToCanvas, getBestAnchors } from '@/lib/flowboard/canvas-math';
import { ZOOM_MIN, ZOOM_MAX, ZOOM_STEP } from '@/lib/flowboard/constants';
import { CanvasCard } from './CanvasCard';
import { ConnectorLayer } from './ConnectorLayer';
import { CanvasToolbar } from './CanvasToolbar';

interface CanvasViewProps {
  boardId: string;
}

export function CanvasView({ boardId }: CanvasViewProps) {
  const board = useFlowBoardStore((s) => s.boards.find((b) => b.id === boardId));
  const cards = useFlowBoardStore(useShallow(selectBoardCards(boardId)));
  const connectors = useFlowBoardStore(useShallow(selectBoardConnectors(boardId)));
  const setCanvasViewport = useFlowBoardStore((s) => s.setCanvasViewport);
  const deselectAll = useFlowBoardStore((s) => s.deselectAll);
  const addCard = useFlowBoardStore((s) => s.addCard);
  const addConnector = useFlowBoardStore((s) => s.addConnector);
  const filter = useFlowBoardStore((s) => s.filter);

  const containerRef = useRef<HTMLDivElement>(null);

  // Local pan/zoom state for fluid interaction
  const [panX, setPanX] = useState(board?.canvasViewport.panX ?? 0);
  const [panY, setPanY] = useState(board?.canvasViewport.panY ?? 0);
  const [zoom, setZoom] = useState(board?.canvasViewport.zoom ?? 1);
  const [isPanning, setIsPanning] = useState(false);
  const panStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 });
  const [spaceHeld, setSpaceHeld] = useState(false);

  // Dragged card position override (for connector re-rendering)
  const [dragOverride, setDragOverride] = useState<{ cardId: string; x: number; y: number } | null>(null);

  // Connector creation state
  const [connectingFrom, setConnectingFrom] = useState<{ cardId: string; x: number; y: number } | null>(null);
  const [connectingMouse, setConnectingMouse] = useState<{ x: number; y: number } | null>(null);

  // Filter cards
  const filteredCards = filter.search || filter.labels.length > 0 || filter.priorities.length > 0 || filter.colors.length > 0
    ? cards.filter((c) => {
        const q = filter.search.toLowerCase();
        if (q && !c.title.toLowerCase().includes(q) && !c.description.toLowerCase().includes(q)) return false;
        if (filter.labels.length > 0 && !c.labels.some((l) => filter.labels.includes(l))) return false;
        if (filter.priorities.length > 0 && !filter.priorities.includes(c.priority)) return false;
        if (filter.colors.length > 0 && !filter.colors.includes(c.color)) return false;
        return true;
      })
    : cards;

  // Sync local state when board viewport changes externally
  useEffect(() => {
    if (board) {
      setPanX(board.canvasViewport.panX);
      setPanY(board.canvasViewport.panY);
      setZoom(board.canvasViewport.zoom);
    }
  }, [board?.id]); // eslint-disable-line

  // Save viewport to store (debounced via store)
  const saveViewport = useCallback(() => {
    setCanvasViewport(boardId, { panX, panY, zoom });
  }, [boardId, panX, panY, zoom, setCanvasViewport]);

  // Space key for panning
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.code === 'Space' && !e.repeat && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        setSpaceHeld(true);
      }
    }
    function handleKeyUp(e: KeyboardEvent) {
      if (e.code === 'Space') {
        setSpaceHeld(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Pan handlers
  function handlePointerDown(e: React.PointerEvent) {
    // Only pan on middle-click or space+left-click or if clicking empty canvas
    if (e.button === 1 || (spaceHeld && e.button === 0)) {
      e.preventDefault();
      setIsPanning(true);
      panStart.current = { x: e.clientX, y: e.clientY, panX, panY };
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    } else if (e.button === 0 && e.target === containerRef.current) {
      deselectAll();
    }
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (isPanning) {
      const dx = e.clientX - panStart.current.x;
      const dy = e.clientY - panStart.current.y;
      setPanX(panStart.current.panX + dx);
      setPanY(panStart.current.panY + dy);
    }

    // Update connector drag preview
    if (connectingFrom && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const canvasPos = screenToCanvas(e.clientX, e.clientY, panX, panY, zoom, rect);
      setConnectingMouse(canvasPos);
    }
  }

  function handlePointerUp(e: React.PointerEvent) {
    if (isPanning) {
      setIsPanning(false);
      saveViewport();
    }

    // End connector creation
    if (connectingFrom) {
      setConnectingFrom(null);
      setConnectingMouse(null);
    }
  }

  // Zoom handler
  function handleWheel(e: React.WheelEvent) {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
      const newZoom = clamp(zoom + delta, ZOOM_MIN, ZOOM_MAX);

      // Zoom toward mouse position
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        const scale = newZoom / zoom;
        setPanX(mx - (mx - panX) * scale);
        setPanY(my - (my - panY) * scale);
      }

      setZoom(newZoom);
      saveViewport();
    } else {
      // Regular scroll = pan
      setPanX((p) => p - e.deltaX);
      setPanY((p) => p - e.deltaY);
    }
  }

  function handleAddCardAtCenter() {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const center = screenToCanvas(
      rect.left + rect.width / 2,
      rect.top + rect.height / 2,
      panX, panY, zoom, rect
    );
    const col = useFlowBoardStore.getState().columns.find((c) => c.boardId === boardId);
    const cardId = addCard(boardId, col?.id ?? null, 'Untitled');
    // Move to center
    const moveCardOnCanvas = useFlowBoardStore.getState().moveCardOnCanvas;
    moveCardOnCanvas(cardId, Math.round(center.x), Math.round(center.y));
  }

  // Connector creation
  function handleConnectorStart(cardId: string, anchorX: number, anchorY: number) {
    setConnectingFrom({ cardId, x: anchorX, y: anchorY });
  }

  function handleConnectorEnd(cardId: string) {
    if (connectingFrom && connectingFrom.cardId !== cardId) {
      const fromCard = cards.find((c) => c.id === connectingFrom.cardId);
      const toCard = cards.find((c) => c.id === cardId);
      if (fromCard && toCard) {
        const { fromAnchor, toAnchor } = getBestAnchors(fromCard, toCard);
        addConnector(boardId, connectingFrom.cardId, cardId, fromAnchor, toAnchor);
      }
    }
    setConnectingFrom(null);
    setConnectingMouse(null);
  }

  return (
    <div
      ref={containerRef}
      className={`relative h-full w-full overflow-hidden canvas-grid ${spaceHeld || isPanning ? 'cursor-grab' : 'cursor-default'} ${isPanning ? '!cursor-grabbing' : ''}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onWheel={handleWheel}
      style={{ touchAction: 'none' }}
    >
      {/* Transform container */}
      <div
        style={{
          transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
          transformOrigin: '0 0',
          willChange: isPanning ? 'transform' : 'auto',
        }}
      >
        {/* Connectors */}
        <ConnectorLayer
          connectors={connectors}
          cards={cards}
          dragOverride={dragOverride}
          connectingFrom={connectingFrom}
          connectingMouse={connectingMouse}
        />

        {/* Cards */}
        {filteredCards.map((card) => (
          <CanvasCard
            key={card.id}
            card={card}
            zoom={zoom}
            onDragUpdate={(x, y) => setDragOverride({ cardId: card.id, x, y })}
            onDragEnd={() => {
              setDragOverride(null);
              saveViewport();
            }}
            onConnectorStart={handleConnectorStart}
            onConnectorEnd={handleConnectorEnd}
            isConnecting={connectingFrom !== null}
          />
        ))}
      </div>

      {/* Toolbar */}
      <CanvasToolbar
        zoom={zoom}
        onZoomIn={() => setZoom((z) => clamp(z + ZOOM_STEP, ZOOM_MIN, ZOOM_MAX))}
        onZoomOut={() => setZoom((z) => clamp(z - ZOOM_STEP, ZOOM_MIN, ZOOM_MAX))}
        onZoomReset={() => { setZoom(1); setPanX(0); setPanY(0); }}
        onAddCard={handleAddCardAtCenter}
      />
    </div>
  );
}

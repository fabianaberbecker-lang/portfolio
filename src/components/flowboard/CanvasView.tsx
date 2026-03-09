'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { useFlowBoardStore, useShallowStore } from '@/lib/flowboard/store';
import { clamp } from '@/lib/flowboard/utils';
import { screenToCanvas, getBestAnchors } from '@/lib/flowboard/canvas-math';
import { ZOOM_MIN, ZOOM_MAX, ZOOM_STEP, GRID_SNAP, CANVAS_CARD_WIDTH, CANVAS_CARD_MIN_HEIGHT } from '@/lib/flowboard/constants';
import { CanvasCard } from './CanvasCard';
import { ConnectorLayer } from './ConnectorLayer';
import { CanvasToolbar } from './CanvasToolbar';
import { CanvasContextMenu } from './CanvasContextMenu';
import { Minimap } from './Minimap';

interface CanvasViewProps {
  boardId: string;
}

export function CanvasView({ boardId }: CanvasViewProps) {
  const board = useFlowBoardStore((s) => s.boards.find((b) => b.id === boardId));
  const cards = useShallowStore((s) => s.cards.filter((c) => c.boardId === boardId && !c.archived), [boardId]);
  const connectors = useShallowStore((s) => s.connectors.filter((c) => c.boardId === boardId), [boardId]);
  const selectedCardIds = useFlowBoardStore((s) => s.selectedCardIds);
  const setCanvasViewport = useFlowBoardStore((s) => s.setCanvasViewport);
  const deselectAll = useFlowBoardStore((s) => s.deselectAll);
  const selectAll = useFlowBoardStore((s) => s.selectAll);
  const selectCard = useFlowBoardStore((s) => s.selectCard);
  const addCard = useFlowBoardStore((s) => s.addCard);
  const addConnector = useFlowBoardStore((s) => s.addConnector);
  const deleteSelectedCards = useFlowBoardStore((s) => s.deleteSelectedCards);
  const duplicateSelectedCards = useFlowBoardStore((s) => s.duplicateSelectedCards);
  const moveSelectedOnCanvas = useFlowBoardStore((s) => s.moveSelectedOnCanvas);
  const filter = useFlowBoardStore((s) => s.filter);

  const containerRef = useRef<HTMLDivElement>(null);

  // Local pan/zoom state for fluid interaction
  const [panX, setPanX] = useState(board?.canvasViewport.panX ?? 0);
  const [panY, setPanY] = useState(board?.canvasViewport.panY ?? 0);
  const [zoom, setZoom] = useState(board?.canvasViewport.zoom ?? 1);
  const [isPanning, setIsPanning] = useState(false);
  const panStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 });
  const [spaceHeld, setSpaceHeld] = useState(false);

  // Snap to grid
  const [snapToGrid, setSnapToGrid] = useState(true);

  // Dragged card position override (for connector re-rendering)
  const [dragOverride, setDragOverride] = useState<{ cardId: string; x: number; y: number } | null>(null);

  // Connector creation state
  const [connectingFrom, setConnectingFrom] = useState<{ cardId: string; x: number; y: number } | null>(null);
  const [connectingMouse, setConnectingMouse] = useState<{ x: number; y: number } | null>(null);

  // Rubber-band selection
  const [rubberBand, setRubberBand] = useState<{ startX: number; startY: number; endX: number; endY: number } | null>(null);
  const isRubberBanding = useRef(false);

  // Context menu
  const [contextMenu, setContextMenu] = useState<{
    x: number; y: number; canvasX: number; canvasY: number; cardId?: string;
  } | null>(null);

  // Multi-drag state
  const [isMultiDragging, setIsMultiDragging] = useState(false);
  const multiDragStart = useRef({ x: 0, y: 0 });

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

  // Save viewport to store
  const saveViewport = useCallback(() => {
    setCanvasViewport(boardId, { panX, panY, zoom });
  }, [boardId, panX, panY, zoom, setCanvasViewport]);

  // Snap helper
  const snap = useCallback((v: number) => snapToGrid ? Math.round(v / GRID_SNAP) * GRID_SNAP : v, [snapToGrid]);

  // ---- Keyboard shortcuts ----
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) return;

      if (e.code === 'Space' && !e.repeat) {
        e.preventDefault();
        setSpaceHeld(true);
        return;
      }

      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedCardIds.length > 0) {
        e.preventDefault();
        deleteSelectedCards();
        return;
      }

      if (e.key === 'Escape') {
        e.preventDefault();
        deselectAll();
        setConnectingFrom(null);
        setConnectingMouse(null);
        setContextMenu(null);
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
        e.preventDefault();
        selectAll(boardId);
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        duplicateSelectedCards();
        return;
      }

      if (e.key === 'n' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        handleAddCardAtCenter();
        return;
      }

      if (e.key === 'g' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setSnapToGrid((s) => !s);
        return;
      }

      if (e.key === 'f' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        handleFitToView();
        return;
      }

      if (e.key === '0' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setZoom(1);
        setPanX(0);
        setPanY(0);
        return;
      }

      // Arrow keys — nudge selected cards
      const nudge = e.shiftKey ? GRID_SNAP : 1;
      if (e.key === 'ArrowLeft' && selectedCardIds.length > 0) { e.preventDefault(); moveSelectedOnCanvas(-nudge, 0); }
      if (e.key === 'ArrowRight' && selectedCardIds.length > 0) { e.preventDefault(); moveSelectedOnCanvas(nudge, 0); }
      if (e.key === 'ArrowUp' && selectedCardIds.length > 0) { e.preventDefault(); moveSelectedOnCanvas(0, -nudge); }
      if (e.key === 'ArrowDown' && selectedCardIds.length > 0) { e.preventDefault(); moveSelectedOnCanvas(0, nudge); }
    }
    function handleKeyUp(e: KeyboardEvent) {
      if (e.code === 'Space') setSpaceHeld(false);
    }
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }); // eslint-disable-line

  // ---- Pan handlers ----
  function handlePointerDown(e: React.PointerEvent) {
    if (contextMenu) { setContextMenu(null); return; }

    if (e.button === 1 || (spaceHeld && e.button === 0)) {
      e.preventDefault();
      setIsPanning(true);
      panStart.current = { x: e.clientX, y: e.clientY, panX, panY };
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      return;
    }

    if (e.button === 0 && e.target === containerRef.current) {
      if (!e.shiftKey) deselectAll();

      const rect = containerRef.current!.getBoundingClientRect();
      const canvasPos = screenToCanvas(e.clientX, e.clientY, panX, panY, zoom, rect);
      isRubberBanding.current = true;
      setRubberBand({
        startX: canvasPos.x, startY: canvasPos.y,
        endX: canvasPos.x, endY: canvasPos.y,
      });
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    }
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (isPanning) {
      const dx = e.clientX - panStart.current.x;
      const dy = e.clientY - panStart.current.y;
      setPanX(panStart.current.panX + dx);
      setPanY(panStart.current.panY + dy);
      return;
    }

    if (isRubberBanding.current && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const canvasPos = screenToCanvas(e.clientX, e.clientY, panX, panY, zoom, rect);
      setRubberBand((rb) => rb ? { ...rb, endX: canvasPos.x, endY: canvasPos.y } : null);
      return;
    }

    if (isMultiDragging) {
      const dx = (e.clientX - multiDragStart.current.x) / zoom;
      const dy = (e.clientY - multiDragStart.current.y) / zoom;
      multiDragStart.current = { x: e.clientX, y: e.clientY };
      moveSelectedOnCanvas(Math.round(dx), Math.round(dy));
      return;
    }

    if (connectingFrom && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const canvasPos = screenToCanvas(e.clientX, e.clientY, panX, panY, zoom, rect);
      setConnectingMouse(canvasPos);
    }
  }

  function handlePointerUp() {
    if (isPanning) {
      setIsPanning(false);
      saveViewport();
      return;
    }

    if (isRubberBanding.current && rubberBand) {
      isRubberBanding.current = false;
      const minX = Math.min(rubberBand.startX, rubberBand.endX);
      const maxX = Math.max(rubberBand.startX, rubberBand.endX);
      const minY = Math.min(rubberBand.startY, rubberBand.endY);
      const maxY = Math.max(rubberBand.startY, rubberBand.endY);

      if (maxX - minX > 5 || maxY - minY > 5) {
        const selected = filteredCards.filter((c) =>
          c.canvasX + CANVAS_CARD_WIDTH > minX &&
          c.canvasX < maxX &&
          c.canvasY + CANVAS_CARD_MIN_HEIGHT > minY &&
          c.canvasY < maxY
        );
        for (const c of selected) {
          selectCard(c.id, true);
        }
      }
      setRubberBand(null);
      return;
    }

    if (isMultiDragging) {
      setIsMultiDragging(false);
      saveViewport();
      return;
    }

    if (connectingFrom) {
      setConnectingFrom(null);
      setConnectingMouse(null);
    }
  }

  // ---- Context menu ----
  function handleContextMenu(e: React.MouseEvent) {
    e.preventDefault();
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const canvasPos = screenToCanvas(e.clientX, e.clientY, panX, panY, zoom, rect);
    setContextMenu({ x: e.clientX, y: e.clientY, canvasX: canvasPos.x, canvasY: canvasPos.y });
  }

  function handleCardContextMenu(e: React.MouseEvent, cardId: string) {
    e.preventDefault();
    e.stopPropagation();
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const canvasPos = screenToCanvas(e.clientX, e.clientY, panX, panY, zoom, rect);
    setContextMenu({ x: e.clientX, y: e.clientY, canvasX: canvasPos.x, canvasY: canvasPos.y, cardId });
  }

  // ---- Zoom handler ----
  function handleWheel(e: React.WheelEvent) {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
      const newZoom = clamp(zoom + delta, ZOOM_MIN, ZOOM_MAX);
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
      setPanX((p) => p - e.deltaX);
      setPanY((p) => p - e.deltaY);
    }
  }

  // ---- Fit to view ----
  function handleFitToView() {
    if (!containerRef.current || filteredCards.length === 0) return;
    const rect = containerRef.current.getBoundingClientRect();
    const padding = 60;

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const c of filteredCards) {
      minX = Math.min(minX, c.canvasX);
      minY = Math.min(minY, c.canvasY);
      maxX = Math.max(maxX, c.canvasX + CANVAS_CARD_WIDTH);
      maxY = Math.max(maxY, c.canvasY + CANVAS_CARD_MIN_HEIGHT);
    }

    const contentW = maxX - minX + padding * 2;
    const contentH = maxY - minY + padding * 2;
    const newZoom = clamp(Math.min(rect.width / contentW, rect.height / contentH), ZOOM_MIN, ZOOM_MAX);
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    const newPanX = rect.width / 2 - centerX * newZoom;
    const newPanY = rect.height / 2 - centerY * newZoom;

    setPanX(newPanX);
    setPanY(newPanY);
    setZoom(newZoom);
    setCanvasViewport(boardId, { panX: newPanX, panY: newPanY, zoom: newZoom });
  }

  function handleAddCardAtCenter() {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const center = screenToCanvas(rect.left + rect.width / 2, rect.top + rect.height / 2, panX, panY, zoom, rect);
    const col = useFlowBoardStore.getState().columns.find((c) => c.boardId === boardId);
    const cardId = addCard(boardId, col?.id ?? null, 'Untitled');
    useFlowBoardStore.getState().moveCardOnCanvas(cardId, snap(center.x), snap(center.y));
  }

  // ---- Connector creation ----
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

  // ---- Card drag with snap ----
  function handleCardDragUpdate(cardId: string, x: number, y: number) {
    setDragOverride({ cardId, x: snap(x), y: snap(y) });
  }

  function handleCardDragEnd(cardId: string, x: number, y: number) {
    useFlowBoardStore.getState().moveCardOnCanvas(cardId, snap(x), snap(y));
    setDragOverride(null);
    saveViewport();
  }

  function handleMultiDragStart(_cardId: string, startX: number, startY: number) {
    setIsMultiDragging(true);
    multiDragStart.current = { x: startX, y: startY };
  }

  function handleMinimapNavigate(newPanX: number, newPanY: number) {
    setPanX(newPanX);
    setPanY(newPanY);
    setCanvasViewport(boardId, { panX: newPanX, panY: newPanY, zoom });
  }

  const containerWidth = containerRef.current?.offsetWidth ?? 800;
  const containerHeight = containerRef.current?.offsetHeight ?? 600;

  return (
    <div
      ref={containerRef}
      className={`relative h-full w-full overflow-hidden canvas-grid ${
        spaceHeld || isPanning ? 'cursor-grab' : connectingFrom ? 'cursor-crosshair' : 'cursor-default'
      } ${isPanning ? '!cursor-grabbing' : ''}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onWheel={handleWheel}
      onContextMenu={handleContextMenu}
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
        <ConnectorLayer
          connectors={connectors}
          cards={cards}
          dragOverride={dragOverride}
          connectingFrom={connectingFrom}
          connectingMouse={connectingMouse}
        />

        {filteredCards.map((card) => (
          <CanvasCard
            key={card.id}
            card={card}
            zoom={zoom}
            snapToGrid={snapToGrid}
            onDragUpdate={(x, y) => handleCardDragUpdate(card.id, x, y)}
            onDragEnd={(x, y) => handleCardDragEnd(card.id, x, y)}
            onConnectorStart={handleConnectorStart}
            onConnectorEnd={handleConnectorEnd}
            isConnecting={connectingFrom !== null}
            onContextMenu={(e) => handleCardContextMenu(e, card.id)}
            isMultiSelected={selectedCardIds.length > 1 && selectedCardIds.includes(card.id)}
            onMultiDragStart={handleMultiDragStart}
          />
        ))}

        {/* Rubber-band selection rectangle */}
        {rubberBand && (
          <div
            className="pointer-events-none absolute rounded border border-indigo-400/50 bg-indigo-500/10"
            style={{
              left: Math.min(rubberBand.startX, rubberBand.endX),
              top: Math.min(rubberBand.startY, rubberBand.endY),
              width: Math.abs(rubberBand.endX - rubberBand.startX),
              height: Math.abs(rubberBand.endY - rubberBand.startY),
            }}
          />
        )}
      </div>

      <CanvasToolbar
        zoom={zoom}
        snapToGrid={snapToGrid}
        onZoomIn={() => setZoom((z) => clamp(z + ZOOM_STEP, ZOOM_MIN, ZOOM_MAX))}
        onZoomOut={() => setZoom((z) => clamp(z - ZOOM_STEP, ZOOM_MIN, ZOOM_MAX))}
        onZoomReset={() => { setZoom(1); setPanX(0); setPanY(0); }}
        onAddCard={handleAddCardAtCenter}
        onFitToView={handleFitToView}
        onToggleSnap={() => setSnapToGrid((s) => !s)}
      />

      <Minimap
        cards={filteredCards}
        connectors={connectors}
        panX={panX}
        panY={panY}
        zoom={zoom}
        containerWidth={containerWidth}
        containerHeight={containerHeight}
        selectedCardIds={selectedCardIds}
        onNavigate={handleMinimapNavigate}
      />

      {contextMenu && (
        <CanvasContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          boardId={boardId}
          canvasX={contextMenu.canvasX}
          canvasY={contextMenu.canvasY}
          cardId={contextMenu.cardId}
          onClose={() => setContextMenu(null)}
          onFitToView={handleFitToView}
        />
      )}

      {selectedCardIds.length > 1 && (
        <div className="absolute left-3 bottom-14 z-10 glass-toolbar rounded-lg px-3 py-1.5 text-xs text-white/60">
          {selectedCardIds.length} cards selected
        </div>
      )}
    </div>
  );
}

'use client';

interface CanvasToolbarProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
  onAddCard: () => void;
}

export function CanvasToolbar({
  zoom,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  onAddCard,
}: CanvasToolbarProps) {
  return (
    <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 glass-toolbar px-2 py-1.5">
      {/* Add card */}
      <button
        onClick={onAddCard}
        title="Add card"
        className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-white/40 transition-all hover:bg-white/10 hover:text-white/70"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </button>

      <div className="mx-1 h-4 w-px bg-white/10" />

      {/* Zoom out */}
      <button
        onClick={onZoomOut}
        title="Zoom out"
        className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-white/40 transition-all hover:bg-white/10 hover:text-white/70"
      >
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
        </svg>
      </button>

      {/* Zoom level */}
      <button
        onClick={onZoomReset}
        title="Reset zoom"
        className="min-w-[3rem] cursor-pointer px-1 text-center text-xs tabular-nums text-white/40 transition-all hover:text-white/70"
      >
        {Math.round(zoom * 100)}%
      </button>

      {/* Zoom in */}
      <button
        onClick={onZoomIn}
        title="Zoom in"
        className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-white/40 transition-all hover:bg-white/10 hover:text-white/70"
      >
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
}

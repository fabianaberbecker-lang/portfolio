'use client';

interface CanvasToolbarProps {
  zoom: number;
  snapToGrid: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
  onAddCard: () => void;
  onFitToView: () => void;
  onToggleSnap: () => void;
}

export function CanvasToolbar({
  zoom,
  snapToGrid,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  onAddCard,
  onFitToView,
  onToggleSnap,
}: CanvasToolbarProps) {
  function btn(
    title: string,
    onClick: () => void,
    icon: React.ReactNode,
    active = false,
  ) {
    return (
      <button
        onClick={onClick}
        title={title}
        className={`flex h-7 w-7 cursor-pointer items-center justify-center rounded-md transition-all ${
          active
            ? 'bg-indigo-500/20 text-indigo-300'
            : 'text-white/40 hover:bg-white/10 hover:text-white/70'
        }`}
      >
        {icon}
      </button>
    );
  }

  const sep = <div className="mx-0.5 h-4 w-px bg-white/10" />;

  return (
    <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 glass-toolbar px-2 py-1.5">
      {/* Add card */}
      {btn('Add card (N)', onAddCard,
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      )}

      {sep}

      {/* Snap to grid */}
      {btn('Snap to grid (G)', onToggleSnap,
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
        </svg>,
        snapToGrid,
      )}

      {/* Fit to view */}
      {btn('Fit to view (F)', onFitToView,
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
        </svg>
      )}

      {sep}

      {/* Zoom out */}
      {btn('Zoom out', onZoomOut,
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
        </svg>
      )}

      {/* Zoom level */}
      <button
        onClick={onZoomReset}
        title="Reset zoom (0)"
        className="min-w-[3rem] cursor-pointer px-1 text-center text-xs tabular-nums text-white/40 transition-all hover:text-white/70"
      >
        {Math.round(zoom * 100)}%
      </button>

      {/* Zoom in */}
      {btn('Zoom in', onZoomIn,
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      )}
    </div>
  );
}

interface StickerBoardProps {
  className?: string;
  color?: string;
  size?: number;
}

export function StickerBoard({ className = '', color, size = 24 }: StickerBoardProps) {
  const c = color ?? '#6366f1';
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={`sticker ${className}`}
      aria-hidden="true"
    >
      {/* Board background */}
      <rect x="8" y="12" width="48" height="40" rx="6" fill={c} fillOpacity={0.15} stroke={c} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
      {/* Column dividers */}
      <line x1="24" y1="18" x2="24" y2="46" stroke={c} strokeWidth={2} strokeOpacity={0.3} />
      <line x1="40" y1="18" x2="40" y2="46" stroke={c} strokeWidth={2} strokeOpacity={0.3} />
      {/* Cards */}
      <rect x="12" y="18" width="8" height="6" rx="1.5" fill={c} fillOpacity={0.8} />
      <rect x="12" y="27" width="8" height="6" rx="1.5" fill={c} fillOpacity={0.4} />
      <rect x="28" y="18" width="8" height="6" rx="1.5" fill={c} fillOpacity={0.6} />
      <rect x="28" y="27" width="8" height="6" rx="1.5" fill={c} fillOpacity={0.3} />
      <rect x="44" y="18" width="8" height="6" rx="1.5" fill={c} fillOpacity={0.5} />
    </svg>
  );
}

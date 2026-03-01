interface StickerColumnsProps {
  className?: string;
  color?: string;
  size?: number;
}

export function StickerColumns({ className = '', color, size = 24 }: StickerColumnsProps) {
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
      {/* Three columns */}
      <rect x="6" y="10" width="14" height="44" rx="4" fill={c} fillOpacity={0.2} stroke={c} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      <rect x="25" y="10" width="14" height="44" rx="4" fill={c} fillOpacity={0.2} stroke={c} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      <rect x="44" y="10" width="14" height="44" rx="4" fill={c} fillOpacity={0.2} stroke={c} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      {/* Cards in columns */}
      <rect x="9" y="16" width="8" height="5" rx="1.5" fill={c} />
      <rect x="9" y="24" width="8" height="5" rx="1.5" fill={c} fillOpacity={0.5} />
      <rect x="28" y="16" width="8" height="5" rx="1.5" fill={c} fillOpacity={0.7} />
      <rect x="47" y="16" width="8" height="5" rx="1.5" fill={c} fillOpacity={0.4} />
    </svg>
  );
}

interface StickerLinkProps {
  className?: string;
  color?: string;
  size?: number;
}

export function StickerLink({ className = '', color, size = 24 }: StickerLinkProps) {
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
      {/* Two connected nodes with an arrow/line between them */}
      <circle cx="18" cy="22" r="8" fill={c} fillOpacity={0.2} stroke={c} strokeWidth={3} />
      <circle cx="46" cy="42" r="8" fill={c} fillOpacity={0.2} stroke={c} strokeWidth={3} />
      {/* Connector arrow */}
      <path d="M25 28 C32 30, 34 36, 39 38" stroke={c} strokeWidth={3} strokeLinecap="round" fill="none" />
      {/* Arrowhead */}
      <path d="M36 35 L40 39 L35 40" stroke={c} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

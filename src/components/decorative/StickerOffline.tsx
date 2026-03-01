interface StickerOfflineProps {
  className?: string;
  color?: string;
  size?: number;
}

export function StickerOffline({ className = '', color, size = 24 }: StickerOfflineProps) {
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
      {/* Device/storage icon */}
      <rect x="14" y="16" width="36" height="32" rx="6" fill={c} fillOpacity={0.15} stroke={c} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
      {/* Database lines */}
      <line x1="22" y1="28" x2="42" y2="28" stroke={c} strokeWidth={2} strokeLinecap="round" />
      <line x1="22" y1="34" x2="36" y2="34" stroke={c} strokeWidth={2} strokeLinecap="round" strokeOpacity={0.6} />
      <line x1="22" y1="40" x2="30" y2="40" stroke={c} strokeWidth={2} strokeLinecap="round" strokeOpacity={0.3} />
      {/* Checkmark */}
      <circle cx="46" cy="42" r="9" fill={c} />
      <path d="M42 42 L45 45 L51 39" stroke="white" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

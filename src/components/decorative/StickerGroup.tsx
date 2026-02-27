interface StickerGroupProps {
  className?: string;
  color?: string;
  size?: number;
}

export function StickerGroup({ className = '', color, size = 24 }: StickerGroupProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={`sticker ${className}`}
      aria-hidden="true"
    >
      <circle cx="24" cy="22" r="8" fill={color ?? '#f59e0b'} fillOpacity={0.2} stroke={color ?? '#f59e0b'} strokeWidth={3} />
      <circle cx="40" cy="22" r="8" fill={color ?? '#f59e0b'} fillOpacity={0.2} stroke={color ?? '#f59e0b'} strokeWidth={3} />
      <path
        d="M10 52c0-7.732 6.268-14 14-14h16c7.732 0 14 6.268 14 14"
        stroke={color ?? '#f59e0b'}
        strokeWidth={3}
        strokeLinecap="round"
        fill={color ?? '#f59e0b'}
        fillOpacity={0.1}
      />
    </svg>
  );
}

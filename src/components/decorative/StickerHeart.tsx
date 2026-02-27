interface StickerHeartProps {
  className?: string;
  color?: string;
  size?: number;
}

export function StickerHeart({ className = '', color, size = 24 }: StickerHeartProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={`sticker ${className}`}
      aria-hidden="true"
    >
      <path
        d="M32 56S8 40 8 22a12 12 0 0124 0 12 12 0 0124 0c0 18-24 34-24 34z"
        fill={color ?? '#f59e0b'}
        fillOpacity={0.25}
        stroke={color ?? '#f59e0b'}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

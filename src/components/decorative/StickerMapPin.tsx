interface StickerMapPinProps {
  className?: string;
  color?: string;
  size?: number;
}

export function StickerMapPin({ className = '', color, size = 24 }: StickerMapPinProps) {
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
        d="M32 6C22.059 6 14 14.059 14 24c0 14 18 34 18 34s18-20 18-34c0-9.941-8.059-18-18-18z"
        fill={color ?? '#f59e0b'}
        fillOpacity={0.2}
        stroke={color ?? '#f59e0b'}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="32"
        cy="24"
        r="7"
        fill={color ?? '#f59e0b'}
        fillOpacity={0.3}
        stroke={color ?? '#f59e0b'}
        strokeWidth={2.5}
      />
    </svg>
  );
}

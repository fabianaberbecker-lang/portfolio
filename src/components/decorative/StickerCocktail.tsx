interface StickerCocktailProps {
  className?: string;
  color?: string;
  size?: number;
}

export function StickerCocktail({ className = '', color, size = 24 }: StickerCocktailProps) {
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
        d="M16 8h32l-12 24v16h8v4H20v-4h8V32L16 8z"
        fill={color ?? '#f59e0b'}
        fillOpacity={0.2}
        stroke={color ?? '#f59e0b'}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="36" cy="14" r="2" fill={color ?? '#f59e0b'} />
      <circle cx="28" cy="18" r="1.5" fill={color ?? '#f59e0b'} fillOpacity={0.6} />
    </svg>
  );
}

interface StickerProps {
  className?: string;
  color?: string;
  size?: number;
}

export function StickerStar({
  className,
  color = '#6366f1',
  size = 48,
}: StickerProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* 6-pointed star burst / explosion shape */}
      <path
        d="M24 3L28.5 16.5L42 12L33 24L42 36L28.5 31.5L24 45L19.5 31.5L6 36L15 24L6 12L19.5 16.5L24 3Z"
        fill={color}
        stroke="#1a1a1a"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Inner sparkle detail */}
      <circle
        cx="24"
        cy="24"
        r="5"
        fill="#fff"
        fillOpacity="0.35"
      />
    </svg>
  );
}

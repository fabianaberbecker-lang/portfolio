interface StickerProps {
  className?: string;
  color?: string;
  size?: number;
}

export function StickerPlay({
  className,
  color = '#5101ff',
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
      {/* Rounded rectangle background */}
      <rect
        x="4"
        y="6"
        width="40"
        height="36"
        rx="8"
        fill={color}
        stroke="#1a1a1a"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Play triangle */}
      <path
        d="M19 14L35 24L19 34V14Z"
        fill="#fff"
        stroke="#1a1a1a"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

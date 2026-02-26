interface StickerProps {
  className?: string;
  color?: string;
  size?: number;
}

export function StickerRocket({
  className,
  color = '#be1e17',
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
      {/* Rocket body - angled for dynamic feel */}
      <path
        d="M24 4C24 4 18 14 18 26C18 32 20 36 24 38C28 36 30 32 30 26C30 14 24 4 24 4Z"
        fill={color}
        stroke="#1a1a1a"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Nose cone highlight */}
      <path
        d="M24 7C22 13 21 19 21 24"
        stroke="#fff"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeOpacity="0.35"
      />
      {/* Window */}
      <circle
        cx="24"
        cy="20"
        r="3.5"
        fill="#fff"
        stroke="#1a1a1a"
        strokeWidth="2"
      />
      <circle
        cx="24"
        cy="20"
        r="1.5"
        fill={color}
        fillOpacity="0.5"
      />
      {/* Left fin */}
      <path
        d="M18 28L10 34L16 36L18 32"
        fill={color}
        stroke="#1a1a1a"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Right fin */}
      <path
        d="M30 28L38 34L32 36L30 32"
        fill={color}
        stroke="#1a1a1a"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Flame */}
      <path
        d="M20 38C20 38 22 44 24 45C26 44 28 38 28 38C26 40 24 42 24 42C24 42 22 40 20 38Z"
        fill="#ffcb30"
        stroke="#1a1a1a"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

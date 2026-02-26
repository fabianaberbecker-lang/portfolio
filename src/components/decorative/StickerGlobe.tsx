interface StickerProps {
  className?: string;
  color?: string;
  size?: number;
}

export function StickerGlobe({
  className,
  color = '#0d9488',
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
      {/* Globe circle */}
      <circle
        cx="24"
        cy="24"
        r="19"
        fill={color}
        stroke="#1a1a1a"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Vertical center meridian */}
      <ellipse
        cx="24"
        cy="24"
        rx="8"
        ry="19"
        fill="none"
        stroke="#1a1a1a"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Horizontal equator */}
      <ellipse
        cx="24"
        cy="24"
        rx="19"
        ry="0"
        fill="none"
        stroke="#1a1a1a"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Upper latitude line */}
      <path
        d="M8 16C12 18 18 19 24 19C30 19 36 18 40 16"
        stroke="#1a1a1a"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
      {/* Lower latitude line */}
      <path
        d="M8 32C12 30 18 29 24 29C30 29 36 30 40 32"
        stroke="#1a1a1a"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
      {/* Highlight */}
      <path
        d="M14 12C16 10 19 9 22 9"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeOpacity="0.4"
      />
    </svg>
  );
}

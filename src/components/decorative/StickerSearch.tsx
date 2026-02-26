interface StickerProps {
  className?: string;
  color?: string;
  size?: number;
}

export function StickerSearch({
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
      {/* Magnifying glass lens */}
      <circle
        cx="21"
        cy="21"
        r="13"
        fill={color}
        stroke="#1a1a1a"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Glass inner highlight */}
      <circle
        cx="21"
        cy="21"
        r="8"
        fill="#fff"
        fillOpacity="0.25"
      />
      {/* Glare */}
      <ellipse
        cx="16"
        cy="16.5"
        rx="3"
        ry="2"
        fill="#fff"
        fillOpacity="0.45"
        transform="rotate(-30 16 16.5)"
      />
      {/* Handle */}
      <line
        x1="31"
        y1="31"
        x2="42"
        y2="42"
        stroke="#1a1a1a"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <line
        x1="31"
        y1="31"
        x2="42"
        y2="42"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeOpacity="0.6"
      />
    </svg>
  );
}

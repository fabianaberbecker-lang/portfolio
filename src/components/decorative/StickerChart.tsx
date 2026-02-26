interface StickerProps {
  className?: string;
  color?: string;
  size?: number;
}

export function StickerChart({
  className,
  color = '#11694b',
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
      {/* Bar 1 - short */}
      <rect
        x="8"
        y="26"
        width="8"
        height="14"
        rx="2"
        fill={color}
        stroke="#1a1a1a"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Bar 2 - tall */}
      <rect
        x="20"
        y="10"
        width="8"
        height="30"
        rx="2"
        fill={color}
        stroke="#1a1a1a"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Bar 3 - medium */}
      <rect
        x="32"
        y="18"
        width="8"
        height="22"
        rx="2"
        fill={color}
        stroke="#1a1a1a"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Baseline */}
      <line
        x1="5"
        y1="43"
        x2="43"
        y2="43"
        stroke="#1a1a1a"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Upward trend arrow */}
      <path
        d="M10 22L24 8L38 14"
        stroke="#1a1a1a"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M34 12L38 14L36 18"
        stroke="#1a1a1a"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

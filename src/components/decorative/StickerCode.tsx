interface StickerProps {
  className?: string;
  color?: string;
  size?: number;
}

export function StickerCode({
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
      {/* Background blob / rounded shape */}
      <rect
        x="3"
        y="8"
        width="42"
        height="32"
        rx="8"
        fill={color}
        stroke="#1a1a1a"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Left angle bracket < */}
      <path
        d="M14 17L7 24L14 31"
        stroke="#fff"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Right angle bracket > */}
      <path
        d="M34 17L41 24L34 31"
        stroke="#fff"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Forward slash / */}
      <line
        x1="27"
        y1="15"
        x2="21"
        y2="33"
        stroke="#fff"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

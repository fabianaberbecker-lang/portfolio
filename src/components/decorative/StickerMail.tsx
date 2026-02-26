interface StickerProps {
  className?: string;
  color?: string;
  size?: number;
}

export function StickerMail({
  className,
  color = '#fcacc5',
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
      {/* Envelope body */}
      <rect
        x="4"
        y="10"
        width="40"
        height="28"
        rx="4"
        fill={color}
        stroke="#1a1a1a"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Envelope flap (V shape) */}
      <path
        d="M4 14L24 28L44 14"
        stroke="#1a1a1a"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Inner shadow / fold lines for depth */}
      <path
        d="M4 38L18 26"
        stroke="#1a1a1a"
        strokeWidth="2"
        strokeLinecap="round"
        strokeOpacity="0.3"
      />
      <path
        d="M44 38L30 26"
        stroke="#1a1a1a"
        strokeWidth="2"
        strokeLinecap="round"
        strokeOpacity="0.3"
      />
    </svg>
  );
}

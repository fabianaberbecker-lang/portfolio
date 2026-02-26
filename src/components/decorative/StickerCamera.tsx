interface StickerProps {
  className?: string;
  color?: string;
  size?: number;
}

export function StickerCamera({
  className,
  color = '#ffcb30',
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
      {/* Camera body */}
      <rect
        x="6"
        y="14"
        width="28"
        height="22"
        rx="4"
        fill={color}
        stroke="#1a1a1a"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Lens */}
      <circle
        cx="20"
        cy="25"
        r="7"
        fill="#1a1a1a"
        stroke="#1a1a1a"
        strokeWidth="2"
      />
      <circle
        cx="20"
        cy="25"
        r="4.5"
        fill="#fff"
        fillOpacity="0.3"
        stroke="#fff"
        strokeWidth="1"
        strokeOpacity="0.5"
      />
      {/* Film reel on top */}
      <circle
        cx="38"
        cy="12"
        r="7"
        fill={color}
        stroke="#1a1a1a"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="38"
        cy="12"
        r="2.5"
        fill="#1a1a1a"
      />
      {/* Film reel connector to body */}
      <rect
        x="35"
        y="17"
        width="6"
        height="6"
        fill={color}
        stroke="#1a1a1a"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Viewfinder bump */}
      <rect
        x="12"
        y="10"
        width="10"
        height="6"
        rx="2"
        fill={color}
        stroke="#1a1a1a"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

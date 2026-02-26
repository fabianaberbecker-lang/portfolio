interface StickerProps {
  className?: string;
  color?: string;
  size?: number;
}

export function StickerLightning({
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
      {/* Lightning bolt - chunky and bold */}
      <path
        d="M28 3L10 26H22L18 45L38 20H26L28 3Z"
        fill={color}
        stroke="#1a1a1a"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Inner highlight for depth */}
      <path
        d="M26 8L14 25H21"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeOpacity="0.35"
      />
    </svg>
  );
}

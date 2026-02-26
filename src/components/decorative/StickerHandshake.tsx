interface StickerProps {
  className?: string;
  color?: string;
  size?: number;
}

export function StickerHandshake({
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
      {/* Left sleeve / cuff */}
      <path
        d="M4 22L12 16L16 20"
        fill={color}
        stroke="#1a1a1a"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Right sleeve / cuff */}
      <path
        d="M44 22L36 16L32 20"
        fill={color}
        stroke="#1a1a1a"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Left hand */}
      <path
        d="M12 22C12 22 14 20 18 20C20 20 22 21 24 23"
        stroke="#1a1a1a"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Right hand meeting left */}
      <path
        d="M36 22C36 22 34 20 30 20C28 20 26 21 24 23"
        stroke="#1a1a1a"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Combined handshake shape - chunky solid area */}
      <path
        d="M14 20C14 20 17 18 21 18C24 18 24 20 27 20C30 18 34 18 34 20L34 26C34 28 31 30 28 30C26 30 25 29 24 28C23 29 22 30 20 30C17 30 14 28 14 26Z"
        fill={color}
        stroke="#1a1a1a"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Finger details */}
      <path
        d="M18 26L22 24"
        stroke="#1a1a1a"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M26 24L30 26"
        stroke="#1a1a1a"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Motion lines for emphasis */}
      <line x1="10" y1="30" x2="8" y2="34" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" />
      <line x1="14" y1="32" x2="13" y2="36" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" />
      <line x1="38" y1="30" x2="40" y2="34" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" />
      <line x1="34" y1="32" x2="35" y2="36" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

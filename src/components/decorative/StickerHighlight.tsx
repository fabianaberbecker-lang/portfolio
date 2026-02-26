interface StickerHighlightProps {
  className?: string;
  color?: string;
  height?: number;
}

export function StickerHighlight({
  className,
  color = '#ffcb30',
  height = 12,
}: StickerHighlightProps) {
  return (
    <svg
      width="100%"
      height={height}
      viewBox="0 0 200 12"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Hand-drawn-looking marker stroke behind text */}
      <path
        d="M2 8C10 5 30 3 60 4C90 5 120 3 150 5C170 6 190 4 198 6C198 7 195 9 180 8C150 7 120 9 90 8C60 7 30 9 10 8C5 8 2 9 2 8Z"
        fill={color}
        fillOpacity="0.45"
      />
    </svg>
  );
}

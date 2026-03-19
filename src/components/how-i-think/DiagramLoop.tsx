'use client';

import { useEffect, useRef, useState } from 'react';

const loopSteps = ['Decide', 'Build', 'Measure', 'Learn'];
const colors = ['#6b8afd', '#8b7cf6', '#e5a35c', '#e07070'];

export function DiagramLoop() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Animate the highlight cycling once visible
  useEffect(() => {
    if (!visible) return;
    let step = 0;
    const interval = setInterval(() => {
      setActiveIndex(step % loopSteps.length);
      step++;
    }, 1200);
    // Start immediately
    setActiveIndex(0);
    return () => clearInterval(interval);
  }, [visible]);

  const size = 260;
  const cx = size / 2;
  const cy = size / 2;
  const r = 90;

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        visible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
      }`}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Circular path (subtle) */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="1.5"
        />

        {/* Arrow indicators along the circle */}
        {loopSteps.map((_, i) => {
          const angle = (i / loopSteps.length) * Math.PI * 2 - Math.PI / 2;
          const nextAngle = ((i + 0.5) / loopSteps.length) * Math.PI * 2 - Math.PI / 2;
          const ax = cx + r * Math.cos(nextAngle);
          const ay = cy + r * Math.sin(nextAngle);
          const isActive = i === activeIndex;
          return (
            <circle
              key={`arrow-${i}`}
              cx={ax}
              cy={ay}
              r={2}
              fill={isActive ? colors[i] : 'rgba(255,255,255,0.12)'}
              className="transition-all duration-500"
            />
          );
        })}

        {/* Nodes */}
        {loopSteps.map((label, i) => {
          const angle = (i / loopSteps.length) * Math.PI * 2 - Math.PI / 2;
          const nx = cx + r * Math.cos(angle);
          const ny = cy + r * Math.sin(angle);
          const isActive = i === activeIndex;
          const color = colors[i];

          return (
            <g key={label}>
              {/* Glow */}
              {isActive && (
                <circle
                  cx={nx}
                  cy={ny}
                  r={28}
                  fill={`${color}15`}
                  className="transition-all duration-500"
                />
              )}
              {/* Circle */}
              <circle
                cx={nx}
                cy={ny}
                r={22}
                fill={isActive ? `${color}20` : 'rgba(255,255,255,0.03)'}
                stroke={isActive ? `${color}60` : 'rgba(255,255,255,0.10)'}
                strokeWidth="1.5"
                className="transition-all duration-500"
              />
              {/* Text */}
              <text
                x={nx}
                y={ny}
                textAnchor="middle"
                dominantBaseline="central"
                fill={isActive ? color : 'rgba(255,255,255,0.4)'}
                fontSize="11"
                fontWeight="600"
                fontFamily="var(--font-geist-sans), system-ui, sans-serif"
                className="transition-all duration-500"
              >
                {label}
              </text>
            </g>
          );
        })}

        {/* Center "Repeat" text */}
        <text
          x={cx}
          y={cx}
          textAnchor="middle"
          dominantBaseline="central"
          fill="rgba(255,255,255,0.15)"
          fontSize="10"
          fontWeight="500"
          fontFamily="var(--font-geist-sans), system-ui, sans-serif"
          letterSpacing="0.1em"
        >
          REPEAT
        </text>
      </svg>
    </div>
  );
}

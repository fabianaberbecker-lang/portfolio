'use client';

import { useEffect, useRef, useState } from 'react';

const items = [
  { label: 'Onboarding redesign', x: 75, y: 80, color: '#6b8afd' },
  { label: 'Fix checkout bug', x: 25, y: 70, color: '#8b7cf6' },
  { label: 'Dark mode', x: 65, y: 30, color: '#e5a35c' },
];

const quadrants = [
  { label: 'Quick Wins', x: 25, y: 75 },
  { label: 'Big Bets', x: 75, y: 75 },
  { label: 'Fill-ins', x: 25, y: 25 },
  { label: 'Avoid', x: 75, y: 25 },
];

export function DiagramMatrix() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

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

  return (
    <div
      ref={ref}
      className="relative w-full max-w-[340px] aspect-square rounded-2xl border border-white/8 bg-white/[0.02]"
    >
      {/* Axis labels */}
      <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[11px] text-white/25 tracking-wider uppercase">
        Effort →
      </span>
      <span className="absolute -left-7 top-1/2 -translate-y-1/2 -rotate-90 text-[11px] text-white/25 tracking-wider uppercase">
        Impact →
      </span>

      {/* Grid lines */}
      <div className="absolute inset-0">
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/6" />
        <div className="absolute top-1/2 left-0 right-0 h-px bg-white/6" />
      </div>

      {/* Quadrant labels */}
      {quadrants.map((q) => (
        <span
          key={q.label}
          className="absolute text-[10px] text-white/15 font-medium tracking-wide"
          style={{
            left: `${q.x}%`,
            top: `${100 - q.y}%`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          {q.label}
        </span>
      ))}

      {/* Items */}
      {items.map((item, i) => (
        <div
          key={item.label}
          className={`absolute transition-all ease-out ${
            visible
              ? 'opacity-100 scale-100'
              : 'opacity-0 scale-50'
          }`}
          style={{
            left: `${item.x}%`,
            top: `${100 - item.y}%`,
            transform: 'translate(-50%, -50%)',
            transitionDuration: `${600 + i * 200}ms`,
            transitionDelay: `${200 + i * 150}ms`,
          }}
        >
          {/* Dot */}
          <div
            className="w-3 h-3 rounded-full shadow-lg"
            style={{ background: item.color, boxShadow: `0 0 12px ${item.color}40` }}
          />
          {/* Label */}
          <span
            className="absolute top-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] font-medium"
            style={{ color: item.color }}
          >
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}

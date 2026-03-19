'use client';

import { useEffect, useRef, useState } from 'react';

const steps = [
  { label: 'Problem', color: 'rgba(107, 138, 253, 0.12)', border: 'rgba(107, 138, 253, 0.35)', text: '#6b8afd' },
  { label: 'Questions', color: 'rgba(229, 163, 92, 0.12)', border: 'rgba(229, 163, 92, 0.35)', text: '#e5a35c' },
  { label: 'Hypotheses', color: 'rgba(139, 124, 246, 0.12)', border: 'rgba(139, 124, 246, 0.35)', text: '#8b7cf6' },
];

export function DiagramProblem() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(-1);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          steps.forEach((_, i) => {
            setTimeout(() => setActive(i), 300 + i * 400);
          });
          observer.unobserve(el);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="flex items-center gap-3 sm:gap-5">
      {steps.map((step, i) => (
        <div key={step.label} className="flex items-center gap-3 sm:gap-5">
          {/* Node */}
          <div
            className={`rounded-2xl border px-5 py-3.5 sm:px-6 sm:py-4 transition-all duration-500 ease-out ${
              i <= active
                ? 'scale-100 opacity-100'
                : 'scale-90 opacity-0'
            }`}
            style={{
              background: step.color,
              borderColor: step.border,
            }}
          >
            <span
              className="text-sm sm:text-base font-semibold tracking-wide"
              style={{ color: step.text }}
            >
              {step.label}
            </span>
          </div>

          {/* Arrow */}
          {i < steps.length - 1 && (
            <svg
              width="24"
              height="12"
              viewBox="0 0 24 12"
              className={`text-white/20 transition-all duration-500 flex-shrink-0 ${
                i < active ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <path
                d="M0 6h20m0 0l-4-4m4 4l-4 4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
      ))}
    </div>
  );
}

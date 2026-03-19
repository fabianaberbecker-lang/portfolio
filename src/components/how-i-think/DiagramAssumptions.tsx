'use client';

import { useEffect, useRef, useState } from 'react';

const steps = [
  {
    label: 'Assumption',
    detail: '"Users understand onboarding"',
    color: 'rgba(229, 163, 92, 0.12)',
    border: 'rgba(229, 163, 92, 0.30)',
    text: '#e5a35c',
  },
  {
    label: 'Test',
    detail: 'Run usability test',
    color: 'rgba(107, 138, 253, 0.12)',
    border: 'rgba(107, 138, 253, 0.30)',
    text: '#6b8afd',
  },
  {
    label: 'Result',
    detail: 'They don\'t.',
    color: 'rgba(224, 112, 112, 0.12)',
    border: 'rgba(224, 112, 112, 0.30)',
    text: '#e07070',
  },
];

export function DiagramAssumptions() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(-1);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          steps.forEach((_, i) => {
            setTimeout(() => setActive(i), 400 + i * 600);
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
    <div ref={ref} className="w-full max-w-[340px] space-y-4">
      {steps.map((step, i) => (
        <div key={step.label} className="flex items-start gap-4">
          {/* Step indicator */}
          <div className="flex flex-col items-center mt-1">
            <div
              className={`w-3 h-3 rounded-full border-2 transition-all duration-500 ${
                i <= active ? 'scale-100' : 'scale-0'
              }`}
              style={{
                borderColor: step.text,
                background: i <= active ? step.text : 'transparent',
              }}
            />
            {i < steps.length - 1 && (
              <div
                className={`w-px h-10 mt-1 transition-all duration-500 ${
                  i < active ? 'opacity-100' : 'opacity-0'
                }`}
                style={{ background: `${step.text}40` }}
              />
            )}
          </div>

          {/* Card */}
          <div
            className={`flex-1 rounded-xl border px-4 py-3 transition-all duration-500 ease-out ${
              i <= active
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 translate-x-4'
            }`}
            style={{
              background: step.color,
              borderColor: step.border,
            }}
          >
            <span
              className="text-[11px] font-semibold uppercase tracking-wider block mb-0.5"
              style={{ color: `${step.text}90` }}
            >
              {step.label}
            </span>
            <span
              className="text-sm font-medium"
              style={{ color: step.text }}
            >
              {step.detail}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

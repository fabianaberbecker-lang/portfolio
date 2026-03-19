'use client';

import { useState, useCallback } from 'react';

interface Dimension {
  label: string;
  value: number;
  color: string;
  bg: string;
}

const initial: Dimension[] = [
  { label: 'Growth', value: 60, color: '#6b8afd', bg: 'rgba(107, 138, 253, 0.15)' },
  { label: 'Quality', value: 60, color: '#8b7cf6', bg: 'rgba(139, 124, 246, 0.15)' },
  { label: 'Speed', value: 60, color: '#e5a35c', bg: 'rgba(229, 163, 92, 0.15)' },
];

export function DiagramTradeoffs() {
  const [dims, setDims] = useState<Dimension[]>(initial);

  const handleChange = useCallback((index: number, newValue: number) => {
    setDims((prev) => {
      const updated = [...prev];
      const delta = newValue - updated[index].value;
      updated[index] = { ...updated[index], value: newValue };

      // Redistribute the inverse among other dimensions
      const others = [0, 1, 2].filter((i) => i !== index);
      const reduction = delta / others.length;
      others.forEach((i) => {
        updated[i] = {
          ...updated[i],
          value: Math.max(10, Math.min(100, updated[i].value - reduction)),
        };
      });

      return updated;
    });
  }, []);

  return (
    <div className="w-full max-w-[340px] space-y-5">
      {dims.map((dim, i) => (
        <div key={dim.label} className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-white/70">{dim.label}</span>
            <span
              className="text-xs font-mono tabular-nums"
              style={{ color: dim.color }}
            >
              {Math.round(dim.value)}%
            </span>
          </div>

          {/* Track */}
          <div className="relative h-2.5 rounded-full overflow-hidden" style={{ background: dim.bg }}>
            <div
              className="absolute inset-y-0 left-0 rounded-full transition-all duration-300 ease-out"
              style={{
                width: `${dim.value}%`,
                background: dim.color,
              }}
            />
          </div>

          {/* Slider (invisible range input over the track) */}
          <input
            type="range"
            min={10}
            max={100}
            value={Math.round(dim.value)}
            onChange={(e) => handleChange(i, Number(e.target.value))}
            className="w-full h-2.5 -mt-4 relative z-10 opacity-0 cursor-pointer"
            aria-label={`${dim.label} slider`}
          />
        </div>
      ))}

      <p className="text-xs text-white/30 text-center pt-2">
        drag a slider — watch the others adjust
      </p>
    </div>
  );
}

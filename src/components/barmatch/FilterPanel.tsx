'use client';

import type { SessionFilters } from '@/lib/barmatch/types';

interface FilterPanelProps {
  filters: SessionFilters;
  radius: number;
  onFiltersChange: (filters: SessionFilters) => void;
  onRadiusChange: (radius: number) => void;
  showRadius?: boolean;
}

const BAR_TYPES = [
  { value: 'bar', label: 'Bar' },
  { value: 'pub', label: 'Pub' },
  { value: 'cocktail', label: 'Cocktails' },
  { value: 'nightclub', label: 'Nightclub' },
  { value: 'biergarten', label: 'Biergarten' },
];

const RADIUS_OPTIONS = [
  { value: 500, label: '500 m' },
  { value: 1000, label: '1 km' },
  { value: 2000, label: '2 km' },
  { value: 5000, label: '5 km' },
];

const PRICE_LEVELS = [
  { value: 1, label: '$' },
  { value: 2, label: '$$' },
  { value: 3, label: '$$$' },
  { value: 4, label: '$$$$' },
];

export function FilterPanel({ filters, radius, onFiltersChange, onRadiusChange, showRadius = true }: FilterPanelProps) {
  const toggleType = (type: string) => {
    const current = filters.types ?? [];
    const next = current.includes(type)
      ? current.filter((t) => t !== type)
      : [...current, type];
    onFiltersChange({ ...filters, types: next.length > 0 ? next : undefined });
  };

  const togglePrice = (level: number) => {
    const current = filters.priceRange;
    if (!current) {
      onFiltersChange({ ...filters, priceRange: [level, level] });
    } else {
      const [min, max] = current;
      if (level >= min && level <= max) {
        if (min === max) {
          onFiltersChange({ ...filters, priceRange: undefined });
        } else if (level === min) {
          onFiltersChange({ ...filters, priceRange: [min + 1, max] });
        } else if (level === max) {
          onFiltersChange({ ...filters, priceRange: [min, max - 1] });
        } else {
          onFiltersChange({ ...filters, priceRange: [level, level] });
        }
      } else {
        onFiltersChange({ ...filters, priceRange: [Math.min(min, level), Math.max(max, level)] });
      }
    }
  };

  const isPriceActive = (level: number) => {
    if (!filters.priceRange) return false;
    return level >= filters.priceRange[0] && level <= filters.priceRange[1];
  };

  return (
    <div className="space-y-5">
      {/* Radius — only shown for geolocation */}
      {showRadius && (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-white/40">Radius</p>
          <div className="flex gap-2">
            {RADIUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => onRadiusChange(opt.value)}
                className={`cursor-pointer rounded-xl border px-3 py-2 text-sm font-medium transition-all ${
                  radius === opt.value
                    ? 'border-amber-500/50 bg-amber-500/10 text-amber-300'
                    : 'border-white/10 bg-white/[0.03] text-white/60 hover:bg-white/[0.06]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Bar types */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-white/40">Vibe</p>
        <div className="flex flex-wrap gap-2">
          {BAR_TYPES.map((type) => {
            const active = filters.types?.includes(type.value);
            return (
              <button
                key={type.value}
                onClick={() => toggleType(type.value)}
                className={`cursor-pointer rounded-xl border px-3 py-2 text-sm font-medium transition-all ${
                  active
                    ? 'border-amber-500/50 bg-amber-500/10 text-amber-300'
                    : 'border-white/10 bg-white/[0.03] text-white/60 hover:bg-white/[0.06]'
                }`}
              >
                {type.label}
              </button>
            );
          })}
        </div>
        <p className="mt-1.5 text-[11px] text-white/25">
          No selection = all types
        </p>
      </div>

      {/* Price range */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-white/40">Price range</p>
        <div className="flex gap-2">
          {PRICE_LEVELS.map((p) => (
            <button
              key={p.value}
              onClick={() => togglePrice(p.value)}
              className={`cursor-pointer rounded-xl border px-4 py-2 text-sm font-medium transition-all ${
                isPriceActive(p.value)
                  ? 'border-amber-500/50 bg-amber-500/10 text-amber-300'
                  : 'border-white/10 bg-white/[0.03] text-white/60 hover:bg-white/[0.06]'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
        <p className="mt-1.5 text-[11px] text-white/25">
          No selection = any price
        </p>
      </div>

      {/* Toggles */}
      <div className="flex gap-3">
        <button
          onClick={() => onFiltersChange({ ...filters, openNow: !filters.openNow ? true : undefined })}
          className={`cursor-pointer rounded-xl border px-4 py-2 text-sm font-medium transition-all ${
            filters.openNow
              ? 'border-amber-500/50 bg-amber-500/10 text-amber-300'
              : 'border-white/10 bg-white/[0.03] text-white/60 hover:bg-white/[0.06]'
          }`}
        >
          Open now
        </button>
        <button
          onClick={() => onFiltersChange({ ...filters, outdoorOnly: !filters.outdoorOnly ? true : undefined })}
          className={`cursor-pointer rounded-xl border px-4 py-2 text-sm font-medium transition-all ${
            filters.outdoorOnly
              ? 'border-amber-500/50 bg-amber-500/10 text-amber-300'
              : 'border-white/10 bg-white/[0.03] text-white/60 hover:bg-white/[0.06]'
          }`}
        >
          Outdoor
        </button>
      </div>
    </div>
  );
}

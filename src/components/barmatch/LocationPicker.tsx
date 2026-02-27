'use client';

import { useState, useCallback } from 'react';
import { neighborhoods, getNeighborhoodsByCity } from '@/lib/barmatch/neighborhoods';
import type { Neighborhood } from '@/lib/barmatch/types';

interface LocationPickerProps {
  onSelect: (lat: number, lng: number, label: string) => void;
  selected?: { lat: number; lng: number; label: string } | null;
}

export function LocationPicker({ onSelect, selected }: LocationPickerProps) {
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const grouped = getNeighborhoodsByCity();

  const handleGeolocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      return;
    }
    setLocating(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onSelect(pos.coords.latitude, pos.coords.longitude, 'My location');
        setLocating(false);
      },
      (err) => {
        setError(err.code === 1 ? 'Location access denied' : 'Could not get location');
        setLocating(false);
      },
      { enableHighAccuracy: false, timeout: 10000 }
    );
  }, [onSelect]);

  const handleNeighborhood = (n: Neighborhood) => {
    onSelect(n.lat, n.lng, `${n.name}, ${n.city}`);
  };

  return (
    <div className="space-y-4">
      {/* Geolocation button */}
      <button
        onClick={handleGeolocation}
        disabled={locating}
        className={`flex w-full cursor-pointer items-center gap-3 rounded-2xl border p-4 transition-all ${
          selected?.label === 'My location'
            ? 'border-amber-500/50 bg-amber-500/10'
            : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.06]'
        }`}
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/20">
          {locating ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
          ) : (
            <svg className="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          )}
        </div>
        <div className="text-left">
          <p className="text-sm font-semibold text-white">Use my location</p>
          <p className="text-xs text-white/40">Find bars near you right now</p>
        </div>
      </button>

      {error && <p className="text-xs text-red-400">{error}</p>}

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-white/10" />
        <span className="text-xs text-white/30">or pick a neighborhood</span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      {/* Neighborhood grid */}
      {Object.entries(grouped).map(([city, hoods]) => (
        <div key={city}>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-white/30">{city}</p>
          <div className="grid grid-cols-2 gap-2">
            {hoods.map((n) => {
              const isSelected = selected?.lat === n.lat && selected?.lng === n.lng;
              return (
                <button
                  key={n.id}
                  onClick={() => handleNeighborhood(n)}
                  className={`cursor-pointer rounded-xl border px-3 py-2.5 text-left text-sm font-medium transition-all ${
                    isSelected
                      ? 'border-amber-500/50 bg-amber-500/10 text-amber-300'
                      : 'border-white/10 bg-white/[0.03] text-white/70 hover:bg-white/[0.06] hover:text-white'
                  }`}
                >
                  {n.name}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

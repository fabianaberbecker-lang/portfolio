'use client';

import type { Bar, BarCategory } from '@/lib/barmatch/types';
import { getBarCategory, barCategoryGradients, barCategoryLabels } from '@/lib/barmatch/types';
import { formatDistance } from '@/lib/barmatch/utils';
import { Badge } from '@/components/ui/Badge';

interface SwipeCardProps {
  bar: Bar;
  onInfo?: () => void;
}

const categoryIcons: Record<BarCategory, string> = {
  pub: 'M4 8h16M6 4h12c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z',
  cocktail: 'M8 2l4 6h4l-2 3 1 7H9l1-7-2-3h4L8 2z',
  nightclub: 'M9 18V5l12-2v13M9 9l12-2',
  biergarten: 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707',
  bar: 'M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zm4-4h8',
};

export function SwipeCard({ bar, onInfo }: SwipeCardProps) {
  const category = getBarCategory(bar.types);
  const gradient = barCategoryGradients[category];
  const label = barCategoryLabels[category];

  const hasPhoto = Boolean(bar.photoUrl);

  return (
    <div
      className={`relative h-full w-full overflow-hidden rounded-3xl ${hasPhoto ? '' : `bg-gradient-to-br ${gradient}`} p-6 flex flex-col justify-between shadow-2xl`}
    >
      {/* Photo background (when available) */}
      {hasPhoto && (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${bar.photoUrl})` }}
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />
        </>
      )}

      {/* Decorative background icon (only when no photo) */}
      {!hasPhoto && (
        <div className="absolute right-4 top-4 opacity-10">
          <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <path d={categoryIcons[category]} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}

      {/* Top: category badge */}
      <div className="relative z-10">
        <Badge variant="nightlife">{label}</Badge>
        {bar.openNow !== undefined && (
          <Badge variant={bar.openNow ? 'success' : 'default'} className="ml-2">
            {bar.openNow ? 'Open' : 'Closed'}
          </Badge>
        )}
      </div>

      {/* Center: name + info */}
      <div className="relative z-10 flex-1 flex flex-col justify-center py-6">
        <h2 className="text-3xl font-black leading-tight text-white drop-shadow-lg">
          {bar.name}
        </h2>

        <div className="mt-4 space-y-2">
          {bar.distance != null && (
            <div className="flex items-center gap-2 text-white/70">
              <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-sm font-medium">{formatDistance(bar.distance)}</span>
            </div>
          )}
          {bar.openingHours && (
            <div className="flex items-center gap-2 text-white/70">
              <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="12" r="10" />
                <path strokeLinecap="round" d="M12 6v6l4 2" />
              </svg>
              <span className="text-sm font-medium truncate">{bar.openingHours}</span>
            </div>
          )}
          {bar.address && (
            <div className="flex items-center gap-2 text-white/60">
              <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="text-sm truncate">{bar.address}</span>
            </div>
          )}
          {bar.rating != null && (
            <div className="flex items-center gap-2 text-white/70">
              <svg className="h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="#fbbf24">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-sm font-medium">{bar.rating.toFixed(1)}</span>
              {bar.userRatingsTotal && (
                <span className="text-xs text-white/40">({bar.userRatingsTotal})</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom: tags + info button */}
      <div className="relative z-10 flex items-end justify-between">
        <div className="flex flex-wrap gap-1.5">
          {bar.outdoorSeating && (
            <span className="rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-medium text-white/80">
              Outdoor
            </span>
          )}
          {bar.smoking && bar.smoking !== 'no' && (
            <span className="rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-medium text-white/80">
              Smoking
            </span>
          )}
          {bar.types
            .filter((t) => !['bar', 'pub', 'nightclub', 'biergarten'].includes(t))
            .slice(0, 2)
            .map((t) => (
              <span
                key={t}
                className="rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-medium capitalize text-white/80"
              >
                {t}
              </span>
            ))}
        </div>

        {onInfo && (
          <button
            onClick={(e) => { e.stopPropagation(); onInfo(); }}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

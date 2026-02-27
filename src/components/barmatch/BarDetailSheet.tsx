'use client';

import { motion, AnimatePresence } from 'motion/react';
import type { Bar } from '@/lib/barmatch/types';
import { getBarCategory, barCategoryLabels } from '@/lib/barmatch/types';
import { formatDistance, mapsUrl } from '@/lib/barmatch/utils';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface BarDetailSheetProps {
  bar: Bar | null;
  open: boolean;
  onClose: () => void;
}

export function BarDetailSheet({ bar, open, onClose }: BarDetailSheetProps) {
  if (!bar) return null;

  const category = getBarCategory(bar.types);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            className="fixed inset-x-0 bottom-0 z-50 max-h-[80vh] overflow-y-auto rounded-t-3xl bg-[#1a1626] p-6 pb-10"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            {/* Handle */}
            <div className="mx-auto mb-6 h-1.5 w-12 rounded-full bg-white/20" />

            {/* Header */}
            <div className="mb-4 flex items-start justify-between">
              <div>
                <Badge variant="nightlife">{barCategoryLabels[category]}</Badge>
                <h2 className="mt-2 text-2xl font-black text-white">{bar.name}</h2>
              </div>
              <button
                onClick={onClose}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white/60 hover:bg-white/20"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Info grid */}
            <div className="mb-6 space-y-3">
              {bar.address && (
                <InfoRow
                  icon="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  label={bar.address}
                />
              )}
              {bar.distance != null && (
                <InfoRow
                  icon="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  label={`${formatDistance(bar.distance)} away`}
                />
              )}
              {bar.openingHours && (
                <InfoRow icon="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" label={bar.openingHours} />
              )}
              {bar.phone && (
                <InfoRow icon="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" label={bar.phone} />
              )}
              {bar.website && (
                <InfoRow
                  icon="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9"
                  label={bar.website}
                  href={bar.website}
                />
              )}
              {bar.rating != null && (
                <div className="flex items-center gap-2 text-white/70">
                  <svg className="h-4 w-4" viewBox="0 0 20 20" fill="#fbbf24">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-sm font-medium">
                    {bar.rating.toFixed(1)}
                    {bar.userRatingsTotal && ` (${bar.userRatingsTotal} reviews)`}
                  </span>
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="mb-6 flex flex-wrap gap-2">
              {bar.outdoorSeating && <TagPill>Outdoor seating</TagPill>}
              {bar.smoking && bar.smoking !== 'no' && (
                <TagPill>Smoking: {bar.smoking}</TagPill>
              )}
              {bar.types.map((t) => (
                <TagPill key={t}>{t.replace(/_/g, ' ')}</TagPill>
              ))}
            </div>

            {/* CTA */}
            <a
              href={mapsUrl(bar.lat, bar.lng, bar.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Button variant="nightlife" size="lg" className="w-full">
                Open in Maps
              </Button>
            </a>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function InfoRow({ icon, label, href }: { icon: string; label: string; href?: string }) {
  const content = (
    <div className="flex items-start gap-3 text-white/70">
      <svg className="mt-0.5 h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
      </svg>
      <span className="text-sm break-all">{label}</span>
    </div>
  );
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="block hover:text-white">
        {content}
      </a>
    );
  }
  return content;
}

function TagPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium capitalize text-white/60">
      {children}
    </span>
  );
}

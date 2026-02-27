'use client';

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import type { Bar } from '@/lib/barmatch/types';
import { getBarCategory, barCategoryLabels } from '@/lib/barmatch/types';
import { formatDistance, mapsUrl } from '@/lib/barmatch/utils';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface MatchScreenProps {
  bar: Bar;
  memberNames: string[];
  onContinue?: () => void;
}

function Confetti() {
  const [particles] = useState(() =>
    Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 0.5,
      duration: 1.5 + Math.random() * 2,
      size: 6 + Math.random() * 8,
      color: ['#f59e0b', '#ef4444', '#8b5cf6', '#10b981', '#f97316', '#ec4899'][
        Math.floor(Math.random() * 6)
      ],
      rotation: Math.random() * 360,
    }))
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-sm"
          style={{
            left: `${p.x}%`,
            top: -20,
            width: p.size,
            height: p.size * 0.6,
            backgroundColor: p.color,
          }}
          initial={{ y: -20, rotate: 0, opacity: 1 }}
          animate={{
            y: '110vh',
            rotate: p.rotation + 720,
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: 'easeIn',
          }}
        />
      ))}
    </div>
  );
}

export function MatchScreen({ bar, memberNames, onContinue }: MatchScreenProps) {
  const [showConfetti, setShowConfetti] = useState(true);
  const category = getBarCategory(bar.types);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center px-4 py-8 text-center">
      {showConfetti && <Confetti />}

      <motion.div
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', damping: 12, delay: 0.2 }}
        className="mb-6"
      >
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-500/20">
          <svg className="h-10 w-10 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
      </motion.div>

      <motion.h1
        className="text-4xl font-black text-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        It&apos;s a Match!
      </motion.h1>

      <motion.p
        className="mt-2 text-sm text-white/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        Everyone agreed on this spot
      </motion.p>

      {/* Bar card */}
      <motion.div
        className="mt-8 w-full max-w-sm rounded-2xl border border-white/10 bg-white/[0.05] p-6 text-left"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Badge variant="nightlife">{barCategoryLabels[category]}</Badge>
        <h2 className="mt-2 text-2xl font-black text-white">{bar.name}</h2>

        {bar.address && (
          <p className="mt-2 text-sm text-white/50">{bar.address}</p>
        )}
        {bar.distance != null && (
          <p className="mt-1 text-sm text-white/40">{formatDistance(bar.distance)} away</p>
        )}
        {bar.openingHours && (
          <p className="mt-1 text-sm text-white/40">{bar.openingHours}</p>
        )}

        <div className="mt-4 flex flex-wrap gap-1.5">
          {bar.types.slice(0, 3).map((t) => (
            <span key={t} className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] capitalize text-white/50">
              {t.replace(/_/g, ' ')}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Members who matched */}
      <motion.div
        className="mt-4 flex items-center justify-center gap-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        {memberNames.map((name, i) => (
          <div
            key={name}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/20 text-xs font-bold text-amber-300 ring-2 ring-[#0c0a14]"
            style={{ marginLeft: i > 0 ? -8 : 0 }}
            title={name}
          >
            {name[0].toUpperCase()}
          </div>
        ))}
        <span className="ml-2 text-xs text-white/40">
          {memberNames.join(', ')}
        </span>
      </motion.div>

      {/* Actions */}
      <motion.div
        className="mt-8 flex w-full max-w-sm flex-col gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
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
        {onContinue && (
          <Button variant="ghost" size="md" className="text-white/40" onClick={onContinue}>
            Keep swiping
          </Button>
        )}
      </motion.div>
    </div>
  );
}

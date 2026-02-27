'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence, type PanInfo } from 'motion/react';
import type { Bar } from '@/lib/barmatch/types';
import { SwipeCard } from './SwipeCard';

interface SwipeStackProps {
  bars: Bar[];
  onVote: (barId: string, like: boolean) => void;
  onInfo?: (bar: Bar) => void;
  onEmpty?: () => void;
}

const SWIPE_THRESHOLD = 120;
const SWIPE_VELOCITY = 500;

export function SwipeStack({ bars, onVote, onInfo, onEmpty }: SwipeStackProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);

  const currentBar = bars[currentIndex];
  const nextBar = bars[currentIndex + 1];
  const thirdBar = bars[currentIndex + 2];

  const handleSwipe = useCallback(
    (dir: 'left' | 'right') => {
      if (!currentBar) return;
      setDirection(dir);
      onVote(currentBar.id, dir === 'right');

      setTimeout(() => {
        setCurrentIndex((i) => i + 1);
        setDirection(null);
        if (currentIndex + 1 >= bars.length) {
          onEmpty?.();
        }
      }, 300);
    },
    [currentBar, currentIndex, bars.length, onVote, onEmpty]
  );

  const handleDragEnd = useCallback(
    (_: unknown, info: PanInfo) => {
      const { offset, velocity } = info;
      if (
        Math.abs(offset.x) > SWIPE_THRESHOLD ||
        Math.abs(velocity.x) > SWIPE_VELOCITY
      ) {
        handleSwipe(offset.x > 0 ? 'right' : 'left');
      }
    },
    [handleSwipe]
  );

  if (!currentBar) {
    return (
      <div className="flex h-[460px] items-center justify-center rounded-3xl border border-white/5 bg-white/[0.02]">
        <div className="text-center">
          <p className="text-lg font-bold text-white/60">No more bars</p>
          <p className="mt-1 text-sm text-white/30">You&apos;ve swiped through all options</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Card stack */}
      <div className="relative h-[460px] w-full max-w-[340px]">
        {/* Third card (background) */}
        {thirdBar && (
          <div className="absolute inset-0 scale-[0.9] translate-y-4 opacity-40">
            <SwipeCard bar={thirdBar} />
          </div>
        )}

        {/* Second card (behind) */}
        {nextBar && (
          <div className="absolute inset-0 scale-95 translate-y-2 opacity-70">
            <SwipeCard bar={nextBar} />
          </div>
        )}

        {/* Top card (interactive) */}
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentBar.id}
            className="absolute inset-0 cursor-grab active:cursor-grabbing"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.7}
            onDragEnd={handleDragEnd}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, x: 0, rotate: 0 }}
            exit={{
              x: direction === 'right' ? 500 : -500,
              rotate: direction === 'right' ? 30 : -30,
              opacity: 0,
              transition: { duration: 0.3 },
            }}
            whileDrag={{ scale: 1.02 }}
            style={{ zIndex: 10 }}
          >
            <SwipeCard
              bar={currentBar}
              onInfo={onInfo ? () => onInfo(currentBar) : undefined}
            />

            {/* Like/Nope overlays */}
            <motion.div
              className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-3xl border-4 border-green-400"
              style={{ opacity: 0 }}
              animate="rest"
              variants={{}}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-6">
        <button
          onClick={() => handleSwipe('left')}
          className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-full border-2 border-red-400/30 bg-red-500/10 text-red-400 transition-all hover:scale-110 hover:bg-red-500/20 active:scale-95"
          aria-label="Nope"
        >
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {onInfo && (
          <button
            onClick={() => onInfo(currentBar)}
            className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 transition-all hover:scale-110 hover:bg-white/10"
            aria-label="Details"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        )}

        <button
          onClick={() => handleSwipe('right')}
          className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-full border-2 border-green-400/30 bg-green-500/10 text-green-400 transition-all hover:scale-110 hover:bg-green-500/20 active:scale-95"
          aria-label="Like"
        >
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      {/* Progress */}
      <p className="text-xs text-white/30">
        {currentIndex + 1} / {bars.length}
      </p>
    </div>
  );
}

'use client';

import { Button } from '@/components/ui/Button';

interface NoMatchScreenProps {
  onExpandRadius: () => void;
  onMoreSuggestions: () => void;
}

export function NoMatchScreen({ onExpandRadius, onMoreSuggestions }: NoMatchScreenProps) {
  return (
    <div className="flex flex-col items-center px-4 py-12 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white/[0.05]">
        <svg className="h-10 w-10 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>

      <h2 className="text-2xl font-black text-white">No match yet</h2>
      <p className="mt-2 max-w-xs text-sm text-white/40">
        Your group couldn&apos;t agree on a spot. Try expanding your search!
      </p>

      <div className="mt-8 flex w-full max-w-sm flex-col gap-3">
        <Button variant="nightlife" size="lg" className="w-full" onClick={onExpandRadius}>
          Expand radius
        </Button>
        <Button
          variant="ghost"
          size="md"
          className="text-white/50"
          onClick={onMoreSuggestions}
        >
          Get more suggestions
        </Button>
      </div>
    </div>
  );
}

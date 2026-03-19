'use client';

import { useState } from 'react';
import { useThinkingStore } from '@/lib/thinking/store';

const examples = [
  'Why is user engagement dropping?',
  'Which feature should we prioritize next?',
  'Why are users not converting after onboarding?',
  'Should we build or buy this capability?',
];

export function ProblemInput() {
  const [value, setValue] = useState('');
  const generate = useThinkingStore((s) => s.generate);
  const isGenerating = useThinkingStore((s) => s.isGenerating);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed || isGenerating) return;
    generate(trimmed);
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-xl animate-fade-in-up">
        <h1 className="text-center text-4xl font-black leading-tight tracking-tight sm:text-5xl">
          What are you{' '}
          <span className="bg-gradient-to-r from-[var(--thinking-blue)] to-[var(--thinking-amber)] bg-clip-text text-transparent">
            thinking
          </span>{' '}
          about?
        </h1>
        <p className="mt-4 text-center text-sm leading-relaxed text-[var(--muted)]">
          Enter a problem statement and watch it transform into structured reasoning.
        </p>

        <div className="mt-10">
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder="Describe a problem or decision..."
            rows={3}
            disabled={isGenerating}
            className="w-full resize-none rounded-xl border border-[var(--border-color)] bg-[var(--surface)] px-5 py-4 text-base text-[var(--foreground)] placeholder:text-[var(--muted)]/40 focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]/30 disabled:opacity-50"
          />
          <button
            onClick={handleSubmit}
            disabled={!value.trim() || isGenerating}
            className="mt-3 w-full rounded-xl bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[var(--accent-hover)] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40 disabled:pointer-events-none"
          >
            {isGenerating ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-25" />
                  <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" />
                </svg>
                Analyzing your problem...
              </span>
            ) : (
              'Generate thinking space'
            )}
          </button>
        </div>

        {/* Example prompts */}
        {!isGenerating && (
          <div className="mt-8">
            <p className="mb-3 text-center text-[10px] font-semibold uppercase tracking-widest text-[var(--muted)]/60">
              Try an example
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {examples.map((ex) => (
                <button
                  key={ex}
                  onClick={() => setValue(ex)}
                  className="rounded-full border border-[var(--border-color)] bg-[var(--surface)]/50 px-3 py-1.5 text-xs text-[var(--muted)] transition-colors hover:border-[var(--accent)]/30 hover:text-[var(--foreground)]"
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

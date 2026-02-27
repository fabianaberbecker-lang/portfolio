'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { isSupabaseConfigured } from '@/lib/barmatch/supabase';

export default function BarMatchAppEntry() {
  const router = useRouter();
  const [joinCode, setJoinCode] = useState('');
  const [mode, setMode] = useState<'menu' | 'join'>('menu');
  const supabaseReady = isSupabaseConfigured();

  const handleJoin = () => {
    const code = joinCode.trim().toUpperCase();
    if (code.length >= 4) {
      router.push(`/apps/barmatch/app/session/${code}/join`);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      {/* Logo / Header */}
      <div className="mb-12 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/20">
          <svg className="h-8 w-8 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <h1 className="text-3xl font-black text-white">BarMatch</h1>
        <p className="mt-2 text-sm text-white/40">
          Find the perfect bar with your group
        </p>
      </div>

      {mode === 'menu' && (
        <div className="w-full max-w-sm space-y-4">
          {/* Create session */}
          <Link href="/apps/barmatch/app/create" className="block">
            <Button variant="nightlife" size="lg" className="w-full">
              Start a session
            </Button>
          </Link>

          {/* Join session */}
          {supabaseReady && (
            <Button
              variant="ghost"
              size="lg"
              className="w-full text-white/50 hover:text-white"
              onClick={() => setMode('join')}
            >
              Join a session
            </Button>
          )}

          {!supabaseReady && (
            <p className="text-center text-xs text-white/25">
              Multi-user sessions require Supabase configuration.
              <br />
              Demo mode: create a solo session to explore.
            </p>
          )}
        </div>
      )}

      {mode === 'join' && (
        <div className="w-full max-w-sm space-y-4">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-white/40">
              Session Code
            </label>
            <input
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              placeholder="ABCDEF"
              maxLength={6}
              className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-center font-mono text-2xl font-bold tracking-[0.2em] text-amber-300 placeholder:text-white/20 focus:border-amber-500/50 focus:outline-none"
              autoFocus
            />
          </div>
          <Button
            variant="nightlife"
            size="lg"
            className="w-full"
            onClick={handleJoin}
            disabled={joinCode.trim().length < 4}
          >
            Join
          </Button>
          <Button
            variant="ghost"
            size="md"
            className="w-full text-white/40"
            onClick={() => setMode('menu')}
          >
            Back
          </Button>
        </div>
      )}

      {/* Back to landing */}
      <div className="mt-12">
        <Link href="/apps/barmatch" className="text-xs text-white/20 hover:text-white/40">
          About BarMatch
        </Link>
      </div>
    </div>
  );
}

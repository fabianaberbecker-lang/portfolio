'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { isSupabaseConfigured } from '@/lib/barmatch/supabase';

export default function JoinSessionPage() {
  const router = useRouter();
  const params = useParams();
  const code = (params.code as string).toUpperCase();
  const [name, setName] = useState('');
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validating, setValidating] = useState(true);
  const [sessionValid, setSessionValid] = useState(false);
  const supabaseReady = isSupabaseConfigured();

  // Validate the session exists on mount
  useEffect(() => {
    (async () => {
      if (!supabaseReady) {
        // Demo mode — check sessionStorage
        const demoData = sessionStorage.getItem(`bm-demo-${code}`);
        if (demoData) {
          setSessionValid(true);
        } else {
          setError('Session not found. In demo mode, only the host can access the session.');
        }
        setValidating(false);
        return;
      }

      try {
        const res = await fetch(`/api/barmatch/session/${code}`);
        if (res.ok) {
          setSessionValid(true);
        } else {
          setError('Session not found. It may have expired or the code is incorrect.');
        }
      } catch {
        setError('Could not connect to server. Please try again.');
      }
      setValidating(false);
    })();
  }, [code, supabaseReady]);

  const handleJoin = async () => {
    if (!name.trim()) return;
    setJoining(true);
    setError(null);

    if (supabaseReady) {
      try {
        const res = await fetch(`/api/barmatch/session/${code}/join`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: name.trim() }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Failed to join');
        }

        const data = await res.json();
        sessionStorage.setItem(`bm-member-${code}`, data.memberId);
        router.push(`/apps/barmatch/app/session/${code}`);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
        setJoining(false);
      }
    } else {
      // Demo mode — store member ID and redirect
      sessionStorage.setItem(`bm-member-${code}`, `demo-${Date.now()}`);
      router.push(`/apps/barmatch/app/session/${code}`);
    }
  };

  if (validating) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
          <p className="text-sm text-white/40">Checking session...</p>
        </div>
      </div>
    );
  }

  if (!sessionValid) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/20">
            <svg className="h-7 w-7 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.072 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white">Session not found</h2>
          <p className="mt-2 max-w-xs text-sm text-white/40">{error}</p>
          <Link
            href="/apps/barmatch/app"
            className="mt-4 inline-block text-sm font-medium text-amber-400 hover:underline"
          >
            Go back
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/20">
            <svg className="h-7 w-7 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-black text-white">Join Session</h1>
          <p className="mt-1 text-sm text-white/40">
            Session code: <span className="font-mono font-bold text-amber-300">{code}</span>
          </p>
        </div>

        {/* Name input */}
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-white/40">
              Your name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              maxLength={20}
              className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-white placeholder:text-white/20 focus:border-amber-500/50 focus:outline-none"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <Button
            variant="nightlife"
            size="lg"
            className="w-full"
            onClick={handleJoin}
            disabled={!name.trim() || joining}
          >
            {joining ? 'Joining...' : 'Join'}
          </Button>
        </div>

        <div className="mt-8 text-center">
          <Link href="/apps/barmatch/app" className="text-xs text-white/20 hover:text-white/40">
            Start your own session instead
          </Link>
        </div>
      </div>
    </div>
  );
}

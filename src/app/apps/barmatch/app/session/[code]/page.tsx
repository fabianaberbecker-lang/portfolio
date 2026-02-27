'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'next/navigation';
import type { Bar, Session, Member } from '@/lib/barmatch/types';
import { isSupabaseConfigured, getSupabaseBrowser } from '@/lib/barmatch/supabase';
import { SessionLobby } from '@/components/barmatch/SessionLobby';
import { SwipeStack } from '@/components/barmatch/SwipeStack';
import { BarDetailSheet } from '@/components/barmatch/BarDetailSheet';
import { MatchScreen } from '@/components/barmatch/MatchScreen';
import { MemberAvatars } from '@/components/barmatch/MemberAvatars';

type Phase = 'loading' | 'lobby' | 'swiping' | 'match' | 'done' | 'error';

export default function SessionPage() {
  const params = useParams();
  const code = (params.code as string).toUpperCase();

  const [phase, setPhase] = useState<Phase>('loading');
  const [session, setSession] = useState<Session | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [bars, setBars] = useState<Bar[]>([]);
  const [matchedBar, setMatchedBar] = useState<Bar | null>(null);
  const [detailBar, setDetailBar] = useState<Bar | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [startError, setStartError] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);

  // Keep a ref to bars so async callbacks always see current value
  const barsRef = useRef<Bar[]>([]);
  barsRef.current = bars;

  const memberId = typeof window !== 'undefined' ? sessionStorage.getItem(`bm-member-${code}`) : null;
  const isHost = typeof window !== 'undefined' ? sessionStorage.getItem(`bm-host-${code}`) === 'true' : false;
  const supabaseReady = isSupabaseConfigured();
  const isDemoMode = !supabaseReady;

  // --- Fetch session metadata (not bars) ---
  const fetchSessionMeta = useCallback(async () => {
    if (isDemoMode) {
      const demoData = sessionStorage.getItem(`bm-demo-${code}`);
      if (demoData) {
        const parsed = JSON.parse(demoData);
        setSession({
          id: 'demo',
          code,
          hostName: parsed.hostName,
          lat: parsed.lat,
          lng: parsed.lng,
          radiusM: parsed.radiusM,
          filters: parsed.filters,
          barIds: [],
          status: 'lobby',
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 4 * 3600000).toISOString(),
        });
        setMembers([{
          id: 'demo-host',
          sessionId: 'demo',
          name: parsed.hostName,
          isHost: true,
          joinedAt: new Date().toISOString(),
        }]);
        setPhase('lobby');
      } else {
        setPhase('error');
      }
      return;
    }

    try {
      const res = await fetch(`/api/barmatch/session/${code}`);
      if (!res.ok) throw new Error('Session not found');
      const data = await res.json();
      setSession(data.session);
      setMembers(data.members);
      return data.session as Session;
    } catch {
      setPhase('error');
      return null;
    }
  }, [code, isDemoMode]);

  // --- Fetch bars ---
  const fetchBars = async (sess: Session) => {
    try {
      const res = await fetch(
        `/api/barmatch/nearby?lat=${sess.lat}&lng=${sess.lng}&radiusM=${sess.radiusM}` +
        (sess.filters.types?.length ? `&types=${sess.filters.types.join(',')}` : '')
      );
      if (!res.ok) throw new Error('Failed to fetch bars');
      const data = await res.json();
      setBars(data.bars ?? []);
    } catch {
      setBars([]);
    }
  };

  // --- Initial load ---
  useEffect(() => {
    (async () => {
      const sess = await fetchSessionMeta();
      if (!sess) return; // demo mode or error handled in fetchSessionMeta
      if (sess.status === 'lobby') {
        setPhase('lobby');
      } else if (sess.status === 'swiping') {
        await fetchBars(sess);
        setPhase('swiping');
      } else {
        setPhase('done');
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Start swiping ---
  const handleStart = async () => {
    setStarting(true);
    setStartError(null);

    if (isDemoMode && session) {
      await fetchBars(session);
      setSession((s) => s ? { ...s, status: 'swiping' } : s);
      setPhase('swiping');
      setStarting(false);
      return;
    }

    try {
      const res = await fetch(`/api/barmatch/session/${code}/start`, { method: 'POST' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to start');
      }
      const data = await res.json();
      setBars(data.bars);
      setSession((s) => s ? { ...s, status: 'swiping', barIds: data.barIds } : s);
      setPhase('swiping');
    } catch (err) {
      setStartError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setStarting(false);
    }
  };

  // --- Vote ---
  const handleVote = async (barId: string, like: boolean) => {
    if (isDemoMode) {
      if (like) {
        const likedCount = parseInt(sessionStorage.getItem(`bm-likes-${code}`) ?? '0', 10) + 1;
        sessionStorage.setItem(`bm-likes-${code}`, String(likedCount));
        if (likedCount >= 3) {
          const bar = barsRef.current.find((b) => b.id === barId);
          if (bar) {
            setMatchedBar(bar);
            setPhase('match');
            return;
          }
        }
      }
      return;
    }

    if (!memberId) return;

    try {
      await fetch(`/api/barmatch/session/${code}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberId, barId, vote: like }),
      });

      // Check for matches after each like
      if (like) {
        const matchRes = await fetch(`/api/barmatch/session/${code}/matches`);
        if (matchRes.ok) {
          const matchData = await matchRes.json();
          if (matchData.matches.length > 0) {
            const matchedId = matchData.matches[0];
            // Use ref to always get current bars
            const bar = barsRef.current.find((b) => b.id === matchedId);
            if (bar) {
              setMatchedBar(bar);
              setPhase('match');
            }
          }
        }
      }
    } catch (err) {
      console.error('Vote error:', err);
    }
  };

  // --- Realtime subscriptions (members + session status only, not bars) ---
  useEffect(() => {
    if (!supabaseReady || isDemoMode) return;

    const supabase = getSupabaseBrowser();

    // Subscribe to member changes — only refetch member list
    const memberChannel = supabase
      .channel(`members-${code}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'barmatch_members',
        },
        async () => {
          // Only update members, not bars
          const res = await fetch(`/api/barmatch/session/${code}`);
          if (res.ok) {
            const data = await res.json();
            setMembers(data.members);
          }
        }
      )
      .subscribe();

    // Subscribe to session status changes
    const sessionChannel = supabase
      .channel(`session-${code}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'barmatch_sessions',
        },
        async (payload) => {
          const updated = payload.new as Record<string, unknown>;
          if (updated.status === 'swiping') {
            // Non-host members: transition to swiping when host starts
            const res = await fetch(`/api/barmatch/session/${code}`);
            if (res.ok) {
              const data = await res.json();
              setSession(data.session);
              setMembers(data.members);
              if (barsRef.current.length === 0) {
                await fetchBars(data.session);
              }
              setPhase('swiping');
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(memberChannel);
      supabase.removeChannel(sessionChannel);
    };
  }, [code, supabaseReady, isDemoMode]);

  // --- Render by phase ---
  if (phase === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
          <p className="text-sm text-white/40">Loading session...</p>
        </div>
      </div>
    );
  }

  if (phase === 'error') {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/20">
            <svg className="h-7 w-7 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.072 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white">Session not found</h2>
          <p className="mt-2 text-sm text-white/40">This session may have expired or doesn&apos;t exist.</p>
          <button
            onClick={() => window.location.href = '/apps/barmatch/app'}
            className="mt-4 cursor-pointer text-sm font-medium text-amber-400 hover:underline"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'match' && matchedBar) {
    return (
      <MatchScreen
        bar={matchedBar}
        memberNames={members.map((m) => m.name)}
        onContinue={() => {
          setMatchedBar(null);
          setPhase('swiping');
        }}
      />
    );
  }

  if (phase === 'lobby' && session) {
    return (
      <SessionLobby
        session={session}
        members={members}
        isHost={isHost}
        onStart={handleStart}
        starting={starting}
        error={startError}
      />
    );
  }

  if (phase === 'swiping' || phase === 'done') {
    return (
      <div className="min-h-screen px-4 py-6">
        <div className="mx-auto max-w-md">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold text-white">Swiping</h1>
              <p className="text-xs text-white/30">Session {code}</p>
            </div>
            <MemberAvatars names={members.map((m) => m.name)} />
          </div>

          {/* Swipe stack */}
          <SwipeStack
            bars={bars}
            onVote={handleVote}
            onInfo={(bar) => {
              setDetailBar(bar);
              setDetailOpen(true);
            }}
            onEmpty={() => setPhase('done')}
          />
        </div>

        {/* Detail sheet */}
        <BarDetailSheet
          bar={detailBar}
          open={detailOpen}
          onClose={() => setDetailOpen(false)}
        />
      </div>
    );
  }

  return null;
}

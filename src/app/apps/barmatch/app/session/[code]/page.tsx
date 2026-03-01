'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'next/navigation';
import type { Bar, Session, Member, VoteMap } from '@/lib/barmatch/types';
import { isSupabaseConfigured, getSupabaseBrowser } from '@/lib/barmatch/supabase';
import { filterBars } from '@/lib/barmatch/filter-bars';
import { SessionLobby } from '@/components/barmatch/SessionLobby';
import { SwipeStack } from '@/components/barmatch/SwipeStack';
import { BarDetailSheet } from '@/components/barmatch/BarDetailSheet';
import { MatchScreen } from '@/components/barmatch/MatchScreen';
import { MemberAvatars } from '@/components/barmatch/MemberAvatars';
import { VotingStatus } from '@/components/barmatch/VotingStatus';
import { NoMatchScreen } from '@/components/barmatch/NoMatchScreen';

type Phase = 'loading' | 'lobby' | 'swiping' | 'match' | 'done' | 'no-match' | 'error';

export default function SessionPage() {
  const params = useParams();
  const code = (params.code as string).toUpperCase();

  const [phase, setPhase] = useState<Phase>('loading');
  const [session, setSession] = useState<Session | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [bars, setBars] = useState<Bar[]>([]);
  const [filteredBars, setFilteredBars] = useState<Bar[]>([]);
  const [matchedBar, setMatchedBar] = useState<Bar | null>(null);
  const [detailBar, setDetailBar] = useState<Bar | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [startError, setStartError] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);
  const [voteMap, setVoteMap] = useState<VoteMap>({});
  const [currentBarIndex, setCurrentBarIndex] = useState(0);

  // Keep refs so async callbacks always see current values
  const barsRef = useRef<Bar[]>([]);
  barsRef.current = bars;
  const membersRef = useRef<Member[]>([]);
  membersRef.current = members;
  const voteMapRef = useRef<VoteMap>({});
  voteMapRef.current = voteMap;
  const phaseRef = useRef<Phase>('loading');
  phaseRef.current = phase;

  const memberId = typeof window !== 'undefined' ? sessionStorage.getItem(`bm-member-${code}`) : null;
  const isHost = typeof window !== 'undefined' ? sessionStorage.getItem(`bm-host-${code}`) === 'true' : false;
  const localAvatar = typeof window !== 'undefined' ? sessionStorage.getItem(`bm-avatar-${code}`) ?? undefined : undefined;
  const supabaseReady = isSupabaseConfigured();
  const isDemoMode = !supabaseReady;

  // Ensure local user's avatar is always applied (DB column may not exist yet)
  const membersWithAvatar = members.map((m) =>
    m.id === memberId && localAvatar && !m.avatar ? { ...m, avatar: localAvatar } : m
  );

  // Current bar for voting status display
  const currentBarId = filteredBars[currentBarIndex]?.id ?? '';

  // --- Check for matches in voteMap ---
  const checkVoteMapForMatch = useCallback((vm: VoteMap, mems: Member[], allBars: Bar[]) => {
    if (mems.length < 1) return null;
    for (const barId of Object.keys(vm)) {
      const barVotes = vm[barId];
      const allLiked = mems.every((m) => barVotes[m.id] === true);
      if (allLiked) {
        return allBars.find((b) => b.id === barId) ?? null;
      }
    }
    return null;
  }, []);

  // --- Fetch session metadata (not bars) ---
  const fetchSessionMeta = useCallback(async () => {
    if (isDemoMode) {
      const demoData = sessionStorage.getItem(`bm-demo-${code}`);
      if (demoData) {
        const parsed = JSON.parse(demoData);
        const demoAvatar = sessionStorage.getItem(`bm-avatar-${code}`) ?? undefined;
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
          avatar: demoAvatar,
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
  const fetchBars = async (sess: Session, radiusOverride?: number) => {
    try {
      const r = radiusOverride ?? sess.radiusM;
      const res = await fetch(
        `/api/barmatch/nearby?lat=${sess.lat}&lng=${sess.lng}&radiusM=${r}` +
        (sess.filters.types?.length ? `&types=${sess.filters.types.join(',')}` : '')
      );
      if (!res.ok) throw new Error('Failed to fetch bars');
      const data = await res.json();
      const allBars: Bar[] = data.bars ?? [];
      setBars(allBars);
      // Apply client-side filters
      const filtered = filterBars(allBars, sess.filters);
      setFilteredBars(filtered);
      return filtered;
    } catch {
      setBars([]);
      setFilteredBars([]);
      return [];
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
      const filtered = await fetchBars(session);
      setSession((s) => s ? { ...s, status: 'swiping' } : s);
      setPhase(filtered.length > 0 ? 'swiping' : 'no-match');
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
      const allBars: Bar[] = data.bars;
      setBars(allBars);
      const filtered = filterBars(allBars, session?.filters ?? {});
      setFilteredBars(filtered);
      setSession((s) => s ? { ...s, status: 'swiping', barIds: data.barIds } : s);
      setPhase(filtered.length > 0 ? 'swiping' : 'no-match');
    } catch (err) {
      setStartError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setStarting(false);
    }
  };

  // --- Vote ---
  const handleVote = async (barId: string, like: boolean) => {
    // Update local voteMap immediately
    setVoteMap((prev) => ({
      ...prev,
      [barId]: { ...prev[barId], [memberId ?? 'demo-host']: like },
    }));

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

      // Check for matches after each vote (not just likes)
      const matchRes = await fetch(`/api/barmatch/session/${code}/matches`);
      if (matchRes.ok) {
        const matchData = await matchRes.json();
        if (matchData.matches.length > 0) {
          const matchedId = matchData.matches[0];
          const bar = barsRef.current.find((b) => b.id === matchedId);
          if (bar) {
            setMatchedBar(bar);
            setPhase('match');
          }
        }
      }
    } catch (err) {
      console.error('Vote error:', err);
    }
  };

  // --- Undo vote ---
  const handleUndo = async (barId: string) => {
    // Remove from local voteMap immediately
    setVoteMap((prev) => {
      const updated = { ...prev };
      if (updated[barId]) {
        const barVotes = { ...updated[barId] };
        delete barVotes[memberId ?? 'demo-host'];
        if (Object.keys(barVotes).length === 0) {
          delete updated[barId];
        } else {
          updated[barId] = barVotes;
        }
      }
      return updated;
    });

    if (isDemoMode) return;
    if (!memberId) return;

    try {
      await fetch(`/api/barmatch/session/${code}/vote/undo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberId, barId }),
      });
    } catch (err) {
      console.error('Undo error:', err);
    }
  };

  // --- Expand radius ---
  const handleExpandRadius = async () => {
    if (!session) return;
    const newRadius = session.radiusM * 2;
    setSession((s) => s ? { ...s, radiusM: newRadius } : s);
    const filtered = await fetchBars(session, newRadius);
    setCurrentBarIndex(0);
    setPhase(filtered.length > 0 ? 'swiping' : 'no-match');
  };

  // --- More suggestions (relax filters) ---
  const handleMoreSuggestions = async () => {
    if (!session) return;
    // Clear client-side filters and re-fetch with larger radius
    const relaxedSession = {
      ...session,
      radiusM: session.radiusM * 1.5,
      filters: { ...session.filters, priceRange: undefined, openNow: undefined, outdoorOnly: undefined },
    };
    setSession(relaxedSession);
    const res = await fetch(
      `/api/barmatch/nearby?lat=${relaxedSession.lat}&lng=${relaxedSession.lng}&radiusM=${relaxedSession.radiusM}` +
      (relaxedSession.filters.types?.length ? `&types=${relaxedSession.filters.types.join(',')}` : '')
    );
    if (res.ok) {
      const data = await res.json();
      const allBars: Bar[] = data.bars ?? [];
      setBars(allBars);
      setFilteredBars(allBars); // No client-side filters
      setCurrentBarIndex(0);
      setPhase(allBars.length > 0 ? 'swiping' : 'no-match');
    }
  };

  // --- Realtime subscriptions ---
  useEffect(() => {
    if (!supabaseReady || isDemoMode) return;

    const supabase = getSupabaseBrowser();

    // Subscribe to member changes
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

    // Subscribe to vote changes — update voteMap in real-time for all members
    const voteChannel = supabase
      .channel(`votes-${code}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'barmatch_votes',
        },
        (payload) => {
          if (payload.eventType === 'DELETE') {
            const old = payload.old as Record<string, unknown>;
            const barId = old.bar_id as string;
            const voteMemberId = old.member_id as string;
            if (barId && voteMemberId) {
              setVoteMap((prev) => {
                const updated = { ...prev };
                if (updated[barId]) {
                  const barVotes = { ...updated[barId] };
                  delete barVotes[voteMemberId];
                  if (Object.keys(barVotes).length === 0) {
                    delete updated[barId];
                  } else {
                    updated[barId] = barVotes;
                  }
                }
                return updated;
              });
            }
          } else {
            const row = payload.new as Record<string, unknown>;
            const barId = row.bar_id as string;
            const voteMemberId = row.member_id as string;
            const vote = row.vote as boolean;

            if (barId && voteMemberId) {
              setVoteMap((prev) => {
                const updated = {
                  ...prev,
                  [barId]: { ...prev[barId], [voteMemberId]: vote },
                };

                // Check for match when any vote comes in
                const matchBar = checkVoteMapForMatch(updated, membersRef.current, barsRef.current);
                if (matchBar && phaseRef.current === 'swiping') {
                  setMatchedBar(matchBar);
                  setPhase('match');
                }

                return updated;
              });
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(memberChannel);
      supabase.removeChannel(sessionChannel);
      supabase.removeChannel(voteChannel);
    };
  }, [code, supabaseReady, isDemoMode, checkVoteMapForMatch]);

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
        members={membersWithAvatar}
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
        members={membersWithAvatar}
        isHost={isHost}
        onStart={handleStart}
        starting={starting}
        error={startError}
      />
    );
  }

  if (phase === 'no-match') {
    return (
      <NoMatchScreen
        onExpandRadius={handleExpandRadius}
        onMoreSuggestions={handleMoreSuggestions}
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
            <MemberAvatars members={membersWithAvatar} />
          </div>

          {/* Swipe stack */}
          {filteredBars.length > 0 ? (
            <SwipeStack
              bars={filteredBars}
              onVote={handleVote}
              onUndo={handleUndo}
              onInfo={(bar) => {
                setDetailBar(bar);
                setDetailOpen(true);
              }}
              onEmpty={() => setPhase('no-match')}
              onIndexChange={setCurrentBarIndex}
            />
          ) : (
            <NoMatchScreen
              onExpandRadius={handleExpandRadius}
              onMoreSuggestions={handleMoreSuggestions}
            />
          )}

          {/* Voting status */}
          {filteredBars.length > 0 && members.length > 1 && (
            <div className="mt-4">
              <VotingStatus
                members={membersWithAvatar}
                voteMap={voteMap}
                currentBarId={currentBarId}
              />
            </div>
          )}
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

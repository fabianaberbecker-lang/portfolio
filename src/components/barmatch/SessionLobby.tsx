'use client';

import type { Session, Member } from '@/lib/barmatch/types';
import { Button } from '@/components/ui/Button';
import { ShareSession } from './ShareSession';
import { MemberAvatars } from './MemberAvatars';

interface SessionLobbyProps {
  session: Session;
  members: Member[];
  isHost: boolean;
  onStart: () => void;
  starting?: boolean;
  error?: string | null;
}

export function SessionLobby({ session, members, isHost, onStart, starting, error }: SessionLobbyProps) {
  return (
    <div className="flex flex-col items-center px-4 py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/20">
          <svg className="h-7 w-7 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h1 className="text-2xl font-black text-white">Session Lobby</h1>
        <p className="mt-1 text-sm text-white/40">
          Waiting for everyone to join...
        </p>
      </div>

      {/* Session code */}
      <div className="mb-6 rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-4 text-center">
        <p className="text-xs uppercase tracking-wider text-white/30">Session Code</p>
        <p className="mt-1 font-mono text-3xl font-black tracking-[0.2em] text-amber-400">
          {session.code}
        </p>
      </div>

      {/* Share */}
      <ShareSession code={session.code} />

      {/* Members */}
      <div className="mt-8 w-full max-w-sm">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/40">
          Members ({members.length})
        </p>
        <div className="space-y-2">
          {members.map((m) => (
            <div
              key={m.id}
              className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/20 text-sm font-bold text-amber-300">
                {m.name[0].toUpperCase()}
              </div>
              <span className="text-sm font-medium text-white/80">{m.name}</span>
              {m.isHost && (
                <span className="ml-auto rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-400">
                  Host
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Member avatars summary */}
      <div className="mt-4">
        <MemberAvatars names={members.map((m) => m.name)} />
      </div>

      {/* Start button (host only) */}
      {isHost && (
        <div className="mt-8 w-full max-w-sm">
          {error && (
            <p className="mb-3 text-center text-sm text-red-400">{error}</p>
          )}
          <Button
            variant="nightlife"
            size="lg"
            className="w-full"
            onClick={onStart}
            disabled={starting || members.length < 1}
          >
            {starting ? 'Finding bars...' : 'Start swiping'}
          </Button>
          {members.length < 2 && (
            <p className="mt-2 text-center text-xs text-white/30">
              You can start solo or wait for friends to join
            </p>
          )}
        </div>
      )}

      {!isHost && (
        <div className="mt-8 w-full max-w-sm">
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 text-center">
            <div className="mx-auto mb-2 h-5 w-5 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
            <p className="text-sm text-white/50">Waiting for host to start...</p>
          </div>
        </div>
      )}
    </div>
  );
}

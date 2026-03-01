'use client';

import type { Member, VoteMap } from '@/lib/barmatch/types';
import { getAvatarById } from '@/lib/barmatch/avatars';

interface VotingStatusProps {
  members: Member[];
  voteMap: VoteMap;
  currentBarId: string;
}

export function VotingStatus({ members, voteMap, currentBarId }: VotingStatusProps) {
  if (members.length <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2">
      {members.map((member) => {
        const vote = voteMap[currentBarId]?.[member.id];
        const avatar = getAvatarById(member.avatar);

        // Ring color based on vote status
        let ringClass = 'ring-white/20'; // pending
        if (vote === true) ringClass = 'ring-green-400';
        if (vote === false) ringClass = 'ring-red-400';

        return (
          <div key={member.id} className="flex flex-col items-center gap-1">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.08] ring-2 ${ringClass} transition-all`}
              title={`${member.name}${vote === true ? ' — liked' : vote === false ? ' — noped' : ' — pending'}`}
            >
              {avatar ? (
                avatar.render(28)
              ) : (
                <span className="text-xs font-bold text-amber-300">
                  {member.name[0].toUpperCase()}
                </span>
              )}
            </div>
            <span className="max-w-[3rem] truncate text-[10px] text-white/30">
              {member.name}
            </span>
          </div>
        );
      })}
    </div>
  );
}

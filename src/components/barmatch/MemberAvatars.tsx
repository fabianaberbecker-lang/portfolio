'use client';

import type { Member } from '@/lib/barmatch/types';
import { getAvatarById } from '@/lib/barmatch/avatars';

interface MemberAvatarsProps {
  members: Member[];
  max?: number;
}

export function MemberAvatars({ members, max = 5 }: MemberAvatarsProps) {
  const visible = members.slice(0, max);
  const overflow = members.length - max;

  return (
    <div className="flex items-center">
      {visible.map((member, i) => {
        const avatar = getAvatarById(member.avatar);
        return (
          <div
            key={member.id}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/20 text-xs font-bold text-amber-300 ring-2 ring-[#0c0a14]"
            style={{ marginLeft: i > 0 ? -6 : 0 }}
            title={member.name}
          >
            {avatar ? (
              avatar.render(24)
            ) : (
              member.name[0].toUpperCase()
            )}
          </div>
        );
      })}
      {overflow > 0 && (
        <div
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-xs font-bold text-white/50 ring-2 ring-[#0c0a14]"
          style={{ marginLeft: -6 }}
        >
          +{overflow}
        </div>
      )}
    </div>
  );
}

'use client';

import { AVATARS } from '@/lib/barmatch/avatars';

interface AvatarPickerProps {
  selected?: string;
  onSelect: (avatarId: string) => void;
}

export function AvatarPicker({ selected, onSelect }: AvatarPickerProps) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-white/40">
        Pick your avatar
      </p>
      <div className="grid grid-cols-3 gap-3">
        {AVATARS.map((avatar) => (
          <button
            key={avatar.id}
            onClick={() => onSelect(avatar.id)}
            className={`flex flex-col items-center justify-center gap-1 rounded-2xl border p-3 transition-all ${
              selected === avatar.id
                ? 'border-amber-500/60 bg-amber-500/10 scale-105 shadow-lg shadow-amber-500/10'
                : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/20'
            }`}
            title={avatar.label}
            type="button"
          >
            <div className="flex h-10 w-10 items-center justify-center">
              {avatar.render(40)}
            </div>
            <span className="text-[10px] text-white/40">{avatar.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

'use client';

interface MemberAvatarsProps {
  names: string[];
  max?: number;
}

export function MemberAvatars({ names, max = 5 }: MemberAvatarsProps) {
  const visible = names.slice(0, max);
  const overflow = names.length - max;

  return (
    <div className="flex items-center">
      {visible.map((name, i) => (
        <div
          key={name}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/20 text-xs font-bold text-amber-300 ring-2 ring-[#0c0a14]"
          style={{ marginLeft: i > 0 ? -6 : 0 }}
          title={name}
        >
          {name[0].toUpperCase()}
        </div>
      ))}
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

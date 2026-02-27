'use client';

import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface ShareSessionProps {
  code: string;
}

export function ShareSession({ code }: ShareSessionProps) {
  const [copied, setCopied] = useState(false);

  const joinUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/apps/barmatch/app/session/${code}/join`
    : '';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(joinUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="w-full max-w-sm space-y-4">
      {/* Copy link */}
      <button
        onClick={handleCopy}
        className="flex w-full cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left transition-all hover:bg-white/[0.06]"
      >
        <svg className="h-5 w-5 shrink-0 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
        </svg>
        <span className="flex-1 truncate text-sm text-white/60">{joinUrl || '...'}</span>
        <span className="shrink-0 text-xs font-semibold text-amber-400">
          {copied ? 'Copied!' : 'Copy'}
        </span>
      </button>

      {/* QR Code */}
      {joinUrl && (
        <div className="flex justify-center">
          <div className="rounded-2xl bg-white p-3">
            <QRCodeSVG value={joinUrl} size={140} />
          </div>
        </div>
      )}
    </div>
  );
}

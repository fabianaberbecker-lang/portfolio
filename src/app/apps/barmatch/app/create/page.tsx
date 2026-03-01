'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { LocationPicker } from '@/components/barmatch/LocationPicker';
import { FilterPanel } from '@/components/barmatch/FilterPanel';
import { AvatarPicker } from '@/components/barmatch/AvatarPicker';
import { isSupabaseConfigured } from '@/lib/barmatch/supabase';
import { generateSessionCode } from '@/lib/barmatch/utils';
import type { SessionFilters } from '@/lib/barmatch/types';

const NEIGHBORHOOD_RADIUS = 1500; // meters — covers a typical city neighborhood

export default function CreateSessionPage() {
  const router = useRouter();
  const [step, setStep] = useState<'name' | 'location' | 'filters'>('name');
  const [hostName, setHostName] = useState('');
  const [avatar, setAvatar] = useState<string | undefined>(undefined);
  const [location, setLocation] = useState<{ lat: number; lng: number; label: string } | null>(null);
  const [isGeolocation, setIsGeolocation] = useState(false);
  const [radius, setRadius] = useState(1000);
  const [filters, setFilters] = useState<SessionFilters>({});
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabaseReady = isSupabaseConfigured();

  // Use user-chosen radius for geolocation, fixed radius for neighborhoods
  const effectiveRadius = isGeolocation ? radius : NEIGHBORHOOD_RADIUS;

  const handleCreate = async () => {
    if (!location || !hostName.trim()) return;
    setCreating(true);
    setError(null);

    if (supabaseReady) {
      try {
        const res = await fetch('/api/barmatch/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            hostName: hostName.trim(),
            lat: location.lat,
            lng: location.lng,
            radiusM: effectiveRadius,
            filters,
            avatar,
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Failed to create session');
        }

        const data = await res.json();
        sessionStorage.setItem(`bm-member-${data.code}`, data.memberId);
        sessionStorage.setItem(`bm-host-${data.code}`, 'true');
        if (avatar) sessionStorage.setItem(`bm-avatar-${data.code}`, avatar);
        router.push(`/apps/barmatch/app/session/${data.code}`);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
        setCreating(false);
      }
    } else {
      // Demo mode
      const code = generateSessionCode();
      sessionStorage.setItem(`bm-demo-${code}`, JSON.stringify({
        hostName: hostName.trim(),
        lat: location.lat,
        lng: location.lng,
        radiusM: effectiveRadius,
        filters,
      }));
      sessionStorage.setItem(`bm-host-${code}`, 'true');
      sessionStorage.setItem(`bm-member-${code}`, 'demo-host');
      if (avatar) sessionStorage.setItem(`bm-avatar-${code}`, avatar);
      router.push(`/apps/barmatch/app/session/${code}`);
    }
  };

  return (
    <div className="min-h-screen px-6 py-8">
      <div className="mx-auto max-w-md">
        {/* Header */}
        <Link
          href="/apps/barmatch/app"
          className="mb-6 inline-flex items-center gap-1 text-sm text-white/40 hover:text-white/70"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Link>

        <h1 className="mb-1 text-2xl font-black text-white">New Session</h1>
        <p className="mb-8 text-sm text-white/40">Set up your bar hunting session</p>

        {/* Step indicator */}
        <div className="mb-8 flex gap-2">
          {['name', 'location', 'filters'].map((s, i) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full transition-colors ${
                i <= ['name', 'location', 'filters'].indexOf(step)
                  ? 'bg-amber-500'
                  : 'bg-white/10'
              }`}
            />
          ))}
        </div>

        {/* Step: Name */}
        {step === 'name' && (
          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-white/40">
                Your name
              </label>
              <input
                type="text"
                value={hostName}
                onChange={(e) => setHostName(e.target.value)}
                placeholder="Enter your name"
                maxLength={20}
                className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-white placeholder:text-white/20 focus:border-amber-500/50 focus:outline-none"
                autoFocus
              />
            </div>
            <AvatarPicker selected={avatar} onSelect={setAvatar} />
            <Button
              variant="nightlife"
              size="lg"
              className="w-full"
              onClick={() => setStep('location')}
              disabled={!hostName.trim()}
            >
              Next
            </Button>
          </div>
        )}

        {/* Step: Location */}
        {step === 'location' && (
          <div className="space-y-6">
            <LocationPicker
              onSelect={(lat, lng, label) => {
                setLocation({ lat, lng, label });
                setIsGeolocation(label === 'My location');
              }}
              selected={location}
            />
            <div className="flex gap-3">
              <Button variant="ghost" size="md" className="text-white/40" onClick={() => setStep('name')}>
                Back
              </Button>
              <Button
                variant="nightlife"
                size="lg"
                className="flex-1"
                onClick={() => setStep('filters')}
                disabled={!location}
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Step: Filters */}
        {step === 'filters' && (
          <div className="space-y-6">
            <FilterPanel
              filters={filters}
              radius={radius}
              onFiltersChange={setFilters}
              onRadiusChange={setRadius}
              showRadius={isGeolocation}
            />
            {error && (
              <p className="text-sm text-red-400">{error}</p>
            )}
            <div className="flex gap-3">
              <Button variant="ghost" size="md" className="text-white/40" onClick={() => setStep('location')}>
                Back
              </Button>
              <Button
                variant="nightlife"
                size="lg"
                className="flex-1"
                onClick={handleCreate}
                disabled={creating}
              >
                {creating ? 'Creating...' : 'Create session'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

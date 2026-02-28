'use client';

import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from 'react';
import { getDeviceId } from './device-id';

const STORAGE_KEY = 'sf-subscriptions';

interface SubscriptionState {
    region: string;
    providerIds: number[];
}

interface SubscriptionContextValue {
    region: string;
    providerIds: number[];
    setRegion: (region: string) => void;
    toggleProvider: (id: number) => void;
    isSubscribed: (id: number) => boolean;
    clearAll: () => void;
}

const SubscriptionContext = createContext<SubscriptionContextValue | null>(null);

function loadFromStorage(): SubscriptionState {
    if (typeof window === 'undefined') return { region: 'DE', providerIds: [] };
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            return {
                region: parsed.region || 'DE',
                providerIds: Array.isArray(parsed.providerIds) ? parsed.providerIds : [],
            };
        }
    } catch { /* ignore */ }
    return { region: 'DE', providerIds: [] };
}

function saveToStorage(state: SubscriptionState) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch { /* ignore */ }
}

export function SubscriptionProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<SubscriptionState>({ region: 'DE', providerIds: [] });
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        setState(loadFromStorage());
        setHydrated(true);
    }, []);

    // Track previous providerIds to detect changes for sync
    const prevProviderIdsRef = useRef<number[]>([]);

    useEffect(() => {
        if (hydrated) {
            saveToStorage(state);

            // Sync subscriptions to server alerts if providerIds changed
            const prev = prevProviderIdsRef.current;
            const changed =
                prev.length !== state.providerIds.length ||
                prev.some((id, i) => id !== state.providerIds[i]);

            if (changed && state.providerIds.length > 0) {
                const deviceId = getDeviceId();
                if (deviceId) {
                    fetch('/api/alerts/sync-subscriptions', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            deviceId,
                            subscribedProviderIds: state.providerIds,
                        }),
                    }).catch(() => {});
                }
            }
            prevProviderIdsRef.current = state.providerIds;
        }
    }, [state, hydrated]);

    const setRegion = useCallback((region: string) => {
        setState((prev) => ({ ...prev, region }));
    }, []);

    const toggleProvider = useCallback((id: number) => {
        setState((prev) => ({
            ...prev,
            providerIds: prev.providerIds.includes(id)
                ? prev.providerIds.filter((pid) => pid !== id)
                : [...prev.providerIds, id],
        }));
    }, []);

    const isSubscribed = useCallback(
        (id: number) => state.providerIds.includes(id),
        [state.providerIds]
    );

    const clearAll = useCallback(() => {
        setState((prev) => ({ ...prev, providerIds: [] }));
    }, []);

    return (
        <SubscriptionContext.Provider
            value={{
                region: state.region,
                providerIds: state.providerIds,
                setRegion,
                toggleProvider,
                isSubscribed,
                clearAll,
            }}
        >
            {children}
        </SubscriptionContext.Provider>
    );
}

export function useSubscriptions() {
    const ctx = useContext(SubscriptionContext);
    if (!ctx) throw new Error('useSubscriptions must be used within SubscriptionProvider');
    return ctx;
}

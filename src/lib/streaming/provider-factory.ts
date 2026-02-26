import type { AvailabilityProvider } from './types';
import { TMDBProvider } from './tmdb-provider';

let providerInstance: AvailabilityProvider | null = null;

/**
 * Returns the active AvailabilityProvider.
 * Currently always returns TMDBProvider.
 * To swap providers, add a new implementation and switch here.
 */
export function getProvider(): AvailabilityProvider {
    if (!providerInstance) {
        // Future: read ENV to decide which provider to use
        // e.g. if (process.env.JUSTWATCH_API_KEY) return new JustWatchProvider();
        providerInstance = new TMDBProvider();
    }
    return providerInstance;
}

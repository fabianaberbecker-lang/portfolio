import type { BarDataProvider } from './types';
import { OverpassProvider } from './overpass-provider';
import { MockProvider } from './mock-provider';

let providerInstance: BarDataProvider | null = null;

/**
 * Returns the active BarDataProvider.
 * Priority: Google Places (if key set) > Overpass (default) > Mock (fallback).
 */
export function getBarProvider(): BarDataProvider {
  if (!providerInstance) {
    if (process.env.GOOGLE_PLACES_API_KEY) {
      // Dynamic import avoids bundling Google code when not needed
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { GooglePlacesProvider } = require('./google-places-provider');
      providerInstance = new GooglePlacesProvider();
    } else {
      // Default: Overpass (free, no key needed)
      // Falls back to mock if Overpass fails
      providerInstance = new OverpassProvider();
    }
  }
  return providerInstance!;
}

/** Always returns the mock provider (for testing / fallback) */
export function getMockProvider(): BarDataProvider {
  return new MockProvider();
}

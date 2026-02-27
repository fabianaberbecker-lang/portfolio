import type { Bar, BarDetails, BarDataProvider, NearbyParams } from './types';
import { distanceMeters } from './utils';

const API_BASE = 'https://places.googleapis.com/v1';

/**
 * Google Places API (New) provider.
 * Requires GOOGLE_PLACES_API_KEY environment variable.
 */
export class GooglePlacesProvider implements BarDataProvider {
  private apiKey: string;

  constructor() {
    const key = process.env.GOOGLE_PLACES_API_KEY;
    if (!key) throw new Error('GOOGLE_PLACES_API_KEY not set');
    this.apiKey = key;
  }

  async nearbyBars(params: NearbyParams): Promise<Bar[]> {
    const { lat, lng, radiusM } = params;

    const body = {
      includedTypes: ['bar', 'night_club'],
      maxResultCount: 20,
      locationRestriction: {
        circle: {
          center: { latitude: lat, longitude: lng },
          radius: radiusM,
        },
      },
    };

    const fieldMask = [
      'places.id',
      'places.displayName',
      'places.location',
      'places.rating',
      'places.userRatingCount',
      'places.priceLevel',
      'places.types',
      'places.photos',
      'places.formattedAddress',
      'places.currentOpeningHours',
    ].join(',');

    const res = await fetch(`${API_BASE}/places:searchNearby`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': this.apiKey,
        'X-Goog-FieldMask': fieldMask,
      },
      body: JSON.stringify(body),
      next: { revalidate: 1800 },
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Google Places nearby error: ${res.status} ${err}`);
    }

    const data = await res.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const places: any[] = data.places ?? [];

    return places.map((p) => this.mapToBar(p, lat, lng));
  }

  async barDetails(id: string): Promise<BarDetails> {
    const fieldMask = [
      'id',
      'displayName',
      'location',
      'rating',
      'userRatingCount',
      'priceLevel',
      'types',
      'photos',
      'formattedAddress',
      'currentOpeningHours',
      'nationalPhoneNumber',
      'websiteUri',
      'googleMapsUri',
    ].join(',');

    const res = await fetch(`${API_BASE}/places/${id}`, {
      headers: {
        'X-Goog-Api-Key': this.apiKey,
        'X-Goog-FieldMask': fieldMask,
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) throw new Error(`Google Places detail error: ${res.status}`);
    const p = await res.json();
    const bar = this.mapToBar(p, 0, 0);

    return {
      ...bar,
      phone: p.nationalPhoneNumber ?? undefined,
      website: p.websiteUri ?? undefined,
      mapsUrl: p.googleMapsUri ?? undefined,
      fullOpeningHours: p.currentOpeningHours?.weekdayDescriptions ?? undefined,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private mapToBar(p: any, refLat: number, refLng: number): Bar {
    const barLat = p.location?.latitude ?? 0;
    const barLng = p.location?.longitude ?? 0;

    const photoRef = p.photos?.[0]?.name;
    const photoUrl = photoRef
      ? `/api/barmatch/photo?ref=${encodeURIComponent(photoRef)}`
      : undefined;

    const priceLevelMap: Record<string, number> = {
      PRICE_LEVEL_FREE: 0,
      PRICE_LEVEL_INEXPENSIVE: 1,
      PRICE_LEVEL_MODERATE: 2,
      PRICE_LEVEL_EXPENSIVE: 3,
      PRICE_LEVEL_VERY_EXPENSIVE: 4,
    };

    return {
      id: p.id,
      name: p.displayName?.text ?? 'Unknown',
      lat: barLat,
      lng: barLng,
      rating: p.rating ?? undefined,
      userRatingsTotal: p.userRatingCount ?? undefined,
      priceLevel: priceLevelMap[p.priceLevel] ?? undefined,
      types: p.types ?? [],
      photoUrl,
      address: p.formattedAddress ?? undefined,
      openingHours: p.currentOpeningHours?.weekdayDescriptions?.[0] ?? undefined,
      distance: refLat !== 0 ? distanceMeters(refLat, refLng, barLat, barLng) : undefined,
    };
  }
}

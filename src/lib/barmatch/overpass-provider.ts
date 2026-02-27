import type { Bar, BarDetails, BarDataProvider, NearbyParams } from './types';
import { distanceMeters } from './utils';

const OVERPASS_API = 'https://overpass-api.de/api/interpreter';

interface OverpassElement {
  type: 'node' | 'way' | 'relation';
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
}

export class OverpassProvider implements BarDataProvider {
  async nearbyBars(params: NearbyParams): Promise<Bar[]> {
    const { lat, lng, radiusM, types } = params;

    // Build amenity filter — default to all bar-like amenities
    const amenities = ['bar', 'pub', 'nightclub', 'biergarten'];
    const amenityFilter = amenities
      .map(
        (a) =>
          `nwr["amenity"="${a}"](around:${radiusM},${lat},${lng});`
      )
      .join('\n  ');

    const query = `
[out:json][timeout:25];
(
  ${amenityFilter}
);
out center body;
`;

    const res = await fetch(OVERPASS_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `data=${encodeURIComponent(query)}`,
      next: { revalidate: 1800 }, // cache 30 min
    });

    if (!res.ok) {
      throw new Error(`Overpass API error: ${res.status}`);
    }

    const data = await res.json();
    const elements: OverpassElement[] = data.elements ?? [];

    let bars = elements
      .filter((el) => el.tags?.name) // skip unnamed
      .map((el) => this.mapToBar(el, lat, lng));

    // Filter by type if specified
    if (types && types.length > 0) {
      bars = bars.filter((bar) =>
        types.some((t) => bar.types.includes(t))
      );
    }

    // Sort by distance
    bars.sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0));

    return bars;
  }

  async barDetails(id: string): Promise<BarDetails> {
    // id format: "osm-node-12345" or "osm-way-12345"
    const parts = id.replace('osm-', '').split('-');
    const type = parts[0]; // node, way, or relation
    const osmId = parts[1];

    const query = `
[out:json][timeout:10];
${type}(${osmId});
out center body;
`;

    const res = await fetch(OVERPASS_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `data=${encodeURIComponent(query)}`,
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      throw new Error(`Overpass detail error: ${res.status}`);
    }

    const data = await res.json();
    const el: OverpassElement | undefined = data.elements?.[0];

    if (!el) throw new Error(`Bar not found: ${id}`);

    const bar = this.mapToBar(el, 0, 0);
    const tags = el.tags ?? {};

    return {
      ...bar,
      mapsUrl: `https://www.google.com/maps/dir/?api=1&destination=${bar.lat},${bar.lng}`,
      vicinity: [tags['addr:street'], tags['addr:housenumber'], tags['addr:city']]
        .filter(Boolean)
        .join(' '),
      fullOpeningHours: tags.opening_hours ? [tags.opening_hours] : undefined,
    };
  }

  private mapToBar(el: OverpassElement, refLat: number, refLng: number): Bar {
    const tags = el.tags ?? {};
    const barLat = el.lat ?? el.center?.lat ?? 0;
    const barLng = el.lon ?? el.center?.lon ?? 0;

    const types: string[] = [];
    if (tags.amenity) types.push(tags.amenity);
    if (tags.cuisine) {
      tags.cuisine.split(';').forEach((c) => types.push(c.trim()));
    }
    if (tags.brewery === 'yes') types.push('brewery');
    if (tags.cocktails === 'yes' || tags.drink?.includes('cocktail')) types.push('cocktail');

    const address = [tags['addr:street'], tags['addr:housenumber']]
      .filter(Boolean)
      .join(' ');

    return {
      id: `osm-${el.type}-${el.id}`,
      name: tags.name ?? 'Unknown',
      lat: barLat,
      lng: barLng,
      types,
      address: address || undefined,
      openingHours: tags.opening_hours ?? undefined,
      smoking: tags.smoking ?? undefined,
      outdoorSeating: tags.outdoor_seating === 'yes',
      website: tags.website ?? tags['contact:website'] ?? undefined,
      phone: tags.phone ?? tags['contact:phone'] ?? undefined,
      distance: refLat !== 0 ? distanceMeters(refLat, refLng, barLat, barLng) : undefined,
    };
  }
}

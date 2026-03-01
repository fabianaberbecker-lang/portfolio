// --- Bar Data (from provider) ---

export interface Bar {
  id: string;
  name: string;
  lat: number;
  lng: number;
  rating?: number;
  userRatingsTotal?: number;
  priceLevel?: number;
  types: string[];
  photoUrl?: string;
  address?: string;
  openNow?: boolean;
  openingHours?: string;
  smoking?: string;
  outdoorSeating?: boolean;
  website?: string;
  phone?: string;
  distance?: number;
}

export interface BarDetails extends Bar {
  photos?: string[];
  mapsUrl?: string;
  vicinity?: string;
  fullOpeningHours?: string[];
}

// --- Provider Interface ---

export interface BarDataProvider {
  nearbyBars(params: NearbyParams): Promise<Bar[]>;
  barDetails(id: string): Promise<BarDetails>;
}

export interface NearbyParams {
  lat: number;
  lng: number;
  radiusM: number;
  types?: string[];
}

// --- Session ---

export interface Session {
  id: string;
  code: string;
  hostName: string;
  lat: number;
  lng: number;
  radiusM: number;
  filters: SessionFilters;
  barIds: string[];
  status: 'lobby' | 'swiping' | 'completed';
  createdAt: string;
  expiresAt: string;
}

export interface SessionFilters {
  types?: string[];
  priceRange?: [number, number]; // e.g. [1, 3] for $ to $$$
  openNow?: boolean;
  outdoorOnly?: boolean;
}

// barId → memberId → liked
export type VoteMap = Record<string, Record<string, boolean>>;

export interface Member {
  id: string;
  sessionId: string;
  name: string;
  avatar?: string;
  isHost: boolean;
  joinedAt: string;
}

export interface Vote {
  memberId: string;
  barId: string;
  vote: boolean;
}

// --- Neighborhoods ---

export interface Neighborhood {
  id: string;
  name: string;
  city: string;
  lat: number;
  lng: number;
}

// --- Bar type gradients ---

export type BarCategory = 'pub' | 'cocktail' | 'nightclub' | 'biergarten' | 'bar';

export function getBarCategory(types: string[]): BarCategory {
  const joined = types.join(' ').toLowerCase();
  if (joined.includes('nightclub') || joined.includes('club')) return 'nightclub';
  if (joined.includes('cocktail') || joined.includes('wine')) return 'cocktail';
  if (joined.includes('biergarten') || joined.includes('beer_garden')) return 'biergarten';
  if (joined.includes('pub') || joined.includes('brewery')) return 'pub';
  return 'bar';
}

export const barCategoryGradients: Record<BarCategory, string> = {
  pub: 'from-amber-700 to-orange-900',
  cocktail: 'from-purple-800 to-fuchsia-900',
  nightclub: 'from-blue-900 to-purple-900',
  biergarten: 'from-green-800 to-emerald-900',
  bar: 'from-zinc-700 to-zinc-900',
};

export const barCategoryLabels: Record<BarCategory, string> = {
  pub: 'Pub',
  cocktail: 'Cocktail Bar',
  nightclub: 'Nightclub',
  biergarten: 'Biergarten',
  bar: 'Bar',
};

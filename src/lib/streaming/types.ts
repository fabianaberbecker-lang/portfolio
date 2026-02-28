// --- Search ---

export interface SearchResult {
    id: number;
    title: string;
    type: 'movie' | 'tv';
    year: string;
    posterPath: string | null;
    overview: string;
    voteAverage: number;
}

// --- Title Details ---

export interface TitleDetails {
    id: number;
    title: string;
    type: 'movie' | 'tv';
    year: string;
    posterPath: string | null;
    backdropPath: string | null;
    overview: string;
    genres: string[];
    voteAverage: number;
    voteCount: number;
    runtime: number | null; // minutes for movies, episode count for TV
    status: string;
    tagline: string;
}

// --- Availability / Watch Providers ---

export interface WatchProvider {
    providerId: number;
    providerName: string;
    logoPath: string;
    displayPriority: number;
    link?: string;
}

export interface Availability {
    flatrate: WatchProvider[];
    rent: WatchProvider[];
    buy: WatchProvider[];
    link?: string; // TMDB "just watch" link for the title in this region
}

// --- Provider Interface ---

export interface AvailabilityProvider {
    searchTitles(
        query: string,
        type?: 'movie' | 'tv',
        region?: string
    ): Promise<SearchResult[]>;

    getTitleDetails(
        id: number,
        type: 'movie' | 'tv'
    ): Promise<TitleDetails>;

    getAvailability(
        id: number,
        type: 'movie' | 'tv',
        region: string
    ): Promise<Availability>;

    getTrending(
        timeWindow?: 'day' | 'week'
    ): Promise<{ movies: SearchResult[]; tv: SearchResult[] }>;

    getProviderList(
        region: string
    ): Promise<WatchProvider[]>;
}

import type {
    AvailabilityProvider,
    SearchResult,
    TitleDetails,
    Availability,
    WatchProvider,
} from './types';

const TMDB_BASE = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

function accessToken(): string {
    const token = process.env.TMDB_ACCESS_TOKEN;
    if (!token) throw new Error('TMDB_ACCESS_TOKEN is not configured');
    return token;
}

async function tmdbFetch<T>(path: string, params: Record<string, string> = {}): Promise<T> {
    const url = new URL(`${TMDB_BASE}${path}`);
    for (const [k, v] of Object.entries(params)) {
        url.searchParams.set(k, v);
    }

    const res = await fetch(url.toString(), {
        headers: {
            Authorization: `Bearer ${accessToken()}`,
            'Content-Type': 'application/json',
        },
        next: { revalidate: 3600 }, // cache 1 hour
    });

    if (!res.ok) {
        throw new Error(`TMDB API error: ${res.status} ${res.statusText}`);
    }

    return res.json() as Promise<T>;
}

/* eslint-disable @typescript-eslint/no-explicit-any */

function mapSearchResult(item: any): SearchResult {
    const isMovie = item.media_type === 'movie' || item.title !== undefined;
    return {
        id: item.id,
        title: isMovie ? item.title : item.name,
        type: isMovie ? 'movie' : 'tv',
        year: (isMovie ? item.release_date : item.first_air_date)?.substring(0, 4) ?? '',
        posterPath: item.poster_path ? `${TMDB_IMAGE_BASE}/w342${item.poster_path}` : null,
        overview: item.overview ?? '',
        voteAverage: item.vote_average ?? 0,
    };
}

function mapProvider(p: any): WatchProvider {
    return {
        providerId: p.provider_id,
        providerName: p.provider_name,
        logoPath: `${TMDB_IMAGE_BASE}/original${p.logo_path}`,
        displayPriority: p.display_priority ?? 999,
    };
}

/* eslint-enable @typescript-eslint/no-explicit-any */

export class TMDBProvider implements AvailabilityProvider {
    async searchTitles(
        query: string,
        type?: 'movie' | 'tv',
        region?: string
    ): Promise<SearchResult[]> {
        if (!query.trim()) return [];

        if (type) {
            const data = await tmdbFetch<{ results: unknown[] }>(`/search/${type}`, {
                query,
                language: 'en-US',
                page: '1',
                ...(region ? { region } : {}),
            });
            return data.results.slice(0, 20).map((item) => ({
                ...mapSearchResult(item),
                type,
            }));
        }

        // multi search
        const data = await tmdbFetch<{ results: unknown[] }>('/search/multi', {
            query,
            language: 'en-US',
            page: '1',
        });

        return data.results
            .filter((item: any) => ['movie', 'tv'].includes((item as any).media_type))
            .slice(0, 20)
            .map(mapSearchResult);
    }

    async getTitleDetails(id: number, type: 'movie' | 'tv'): Promise<TitleDetails> {
        const data = await tmdbFetch<any>(`/${type}/${id}`, {
            language: 'en-US',
        });

        const isMovie = type === 'movie';

        return {
            id: data.id,
            title: isMovie ? data.title : data.name,
            type,
            year: (isMovie ? data.release_date : data.first_air_date)?.substring(0, 4) ?? '',
            posterPath: data.poster_path ? `${TMDB_IMAGE_BASE}/w500${data.poster_path}` : null,
            backdropPath: data.backdrop_path
                ? `${TMDB_IMAGE_BASE}/w1280${data.backdrop_path}`
                : null,
            overview: data.overview ?? '',
            genres: (data.genres ?? []).map((g: any) => g.name),
            voteAverage: data.vote_average ?? 0,
            voteCount: data.vote_count ?? 0,
            runtime: isMovie ? data.runtime : data.number_of_episodes,
            status: data.status ?? '',
            tagline: data.tagline ?? '',
        };
    }

    async getTrending(
        timeWindow: 'day' | 'week' = 'week'
    ): Promise<{ movies: SearchResult[]; tv: SearchResult[] }> {
        const [moviesData, tvData] = await Promise.all([
            tmdbFetch<{ results: any[] }>(`/trending/movie/${timeWindow}`, {
                language: 'en-US',
            }),
            tmdbFetch<{ results: any[] }>(`/trending/tv/${timeWindow}`, {
                language: 'en-US',
            }),
        ]);
        return {
            movies: moviesData.results.slice(0, 10).map((item) => ({
                ...mapSearchResult(item),
                type: 'movie' as const,
            })),
            tv: tvData.results.slice(0, 10).map((item) => ({
                ...mapSearchResult(item),
                type: 'tv' as const,
            })),
        };
    }

    async getAvailability(
        id: number,
        type: 'movie' | 'tv',
        region: string
    ): Promise<Availability> {
        const data = await tmdbFetch<{ results: Record<string, any> }>(
            `/${type}/${id}/watch/providers`
        );

        const regionData = data.results?.[region.toUpperCase()];

        if (!regionData) {
            return { flatrate: [], rent: [], buy: [] };
        }

        return {
            flatrate: (regionData.flatrate ?? []).map(mapProvider),
            rent: (regionData.rent ?? []).map(mapProvider),
            buy: (regionData.buy ?? []).map(mapProvider),
            link: regionData.link,
        };
    }
}

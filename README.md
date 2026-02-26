# Fabian Becker — Portfolio + Streaming Finder

A **Next.js 16** (App Router) portfolio website with an integrated **Streaming Finder** app, built with **React 19**, **TypeScript**, and **Tailwind CSS v4**. Features full **DE/EN bilingual** support and a playful sticker-based design system.

## Quick Start

```bash
# Install dependencies
npm install

# Add your TMDB API key
cp .env.example .env.local
# Edit .env.local and set TMDB_API_KEY

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `TMDB_API_KEY` | Yes | Free API key from [themoviedb.org](https://www.themoviedb.org/settings/api) |
| `NEXT_PUBLIC_SITE_URL` | No | Site URL for sitemap (defaults to `http://localhost:3000`) |

## Architecture

```
src/
├── app/
│   ├── page.tsx                              # Home (Hero + Projects + Streaming Showcase + CTA)
│   ├── about/page.tsx                        # About (narrative, timeline, toolbox)
│   ├── contact/page.tsx                      # Contact
│   ├── projects/page.tsx                     # Projects overview
│   ├── projects/[slug]/page.tsx              # Project detail
│   ├── apps/streaming-finder/
│   │   ├── page.tsx                          # SF landing
│   │   ├── search/page.tsx                   # SF search + trending
│   │   └── title/[id]/page.tsx               # SF title detail
│   └── api/
│       ├── search/route.ts                   # GET /api/search?q=...
│       ├── trending/route.ts                 # GET /api/trending
│       └── title/[id]/
│           ├── route.ts                      # GET /api/title/:id
│           └── providers/route.ts            # GET /api/title/:id/providers
├── components/
│   ├── decorative/                           # Sticker SVG components
│   ├── layout/     (Header, Footer, Container)
│   ├── sections/   (HeroSection, FeaturedProjects, StreamingShowcase, CtaSection, Timeline, ProjectDetail)
│   └── ui/         (Button, Card, Badge, Input, Tabs, Skeleton, Toast, ThemeToggle, LanguageToggle, PhoneMockup)
├── data/
│   ├── projects.ts                           # Locale-aware project data loader
│   ├── projects-en.ts                        # English project case studies
│   └── projects-de.ts                        # German project case studies
└── lib/
    ├── i18n/                                 # Internationalization system
    │   ├── types.ts                          # SiteContent type definition
    │   ├── en.ts                             # English content
    │   ├── de.ts                             # German content
    │   └── LanguageContext.tsx                # React Context + useLanguage() hook
    └── streaming/
        ├── types.ts                          # AvailabilityProvider interface
        ├── tmdb-provider.ts                  # TMDB implementation (search, details, providers, trending)
        └── provider-factory.ts               # Provider factory
```

## i18n System

All translatable text lives in `src/lib/i18n/en.ts` and `de.ts`, typed by the `SiteContent` interface in `types.ts`.

**To edit text:** Update the value in both `en.ts` and `de.ts`. TypeScript will enforce that both files have matching keys.

**To add new text:**
1. Add the key + type to `SiteContent` in `types.ts`
2. Add English text in `en.ts`
3. Add German text in `de.ts`

**In components:** Use `const { t, locale } = useLanguage()` to access translations. The language toggle persists the user's choice to localStorage.

## Sticker Design System

The `src/components/decorative/` directory contains bold, chunky SVG sticker components used throughout the site. Each sticker accepts `className`, `color`, and `size` props.

Available stickers: Star, Camera, Search, Play, Globe, Rocket, Code, Chart, Mail, Lightning, Handshake, Highlight.

Use `stickerMap` from `sticker-map.ts` to dynamically render stickers by key string (e.g., from i18n content data).

## Streaming Finder

The Streaming Finder uses a **provider abstraction** (`AvailabilityProvider` interface) with methods for `search`, `getTitleDetails`, `getWatchProviders`, and `getTrending`.

**Trending:** The `/api/trending` endpoint fetches top 10 trending movies and TV shows from TMDB, displayed on the search page initial state.

**To swap providers:**
1. Create `src/lib/streaming/new-provider.ts` implementing `AvailabilityProvider`
2. Update `provider-factory.ts` to return your new provider
3. Add the new API key to `.env.local`

## Deploy to Vercel

1. Push to GitHub
2. Import in [vercel.com](https://vercel.com)
3. Set `TMDB_API_KEY` in Vercel Environment Variables
4. Deploy

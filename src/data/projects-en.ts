import type { Project } from './projects';

export const projectsEn: Project[] = [
  {
    slug: 'streaming-finder',
    title: 'Streaming Finder',
    summary:
      'Search any movie or TV show and instantly see where to stream, rent, or buy it across 40+ countries — with personal subscription tracking, availability alerts, and trending content.',
    status: 'shipped',
    role: 'Product Manager & Developer',
    scope: 'End-to-end: concept, design, API integration, push notifications, and launch.',
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'TMDB API'],
    problem:
      'Streaming content is scattered across dozens of platforms, and availability varies by region. Users waste time opening multiple apps or searching unreliable third-party sites just to figure out where they can watch a specific movie or show.',
    approach:
      "Designed a search-first interface powered by TMDB's watch-provider API with real-time debounced search. Users can save their subscriptions to get personalized results, with availability broken down into streaming, rental, and purchase options. Added push-notification alerts so users get notified when a title becomes available on their services. Built a provider-abstraction layer to support future API integrations without frontend changes.",
    outcome:
      'Instant availability lookups across 40+ countries with subscription-aware results. Trending content discovery for movies and TV shows. Push-based availability alerts keep users informed without manual checking. Clean, mobile-first cinema-themed UI.',
    links: {
      demo: '/apps/streaming-finder',
    },
    highlights: [
      'Personal subscription tracking with region-aware filtering',
      'Push notification alerts for streaming availability',
      'Trending movies and shows with real-time data',
    ],
  },
  {
    slug: 'barmatch',
    title: 'BarMatch',
    summary:
      'A realtime group decision app that helps friends agree on a bar. Create a session, invite via link or QR code, swipe through nearby spots, and match when everyone likes the same place.',
    status: 'shipped',
    role: 'Product Manager & Developer',
    scope: 'End-to-end: concept, UX design, geolocation, realtime collaboration, and launch.',
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'OpenStreetMap', 'Supabase', 'Framer Motion'],
    problem:
      'Deciding where to go out as a group is surprisingly hard. Friends text back and forth, scroll through Google Maps, and rarely reach a decision everyone is happy with — especially under time pressure.',
    approach:
      'Built a Tinder-style swipe interface backed by real bar data from OpenStreetMap. The host creates a session with location and filter preferences (bar type, price range, open now, outdoor seating), then shares a link or QR code. All participants swipe independently, with Supabase handling realtime vote synchronization and automatic match detection. Custom SVG avatars and live voting status indicators make the experience social. A full demo mode with simulated voting runs entirely from sessionStorage when no backend is configured.',
    outcome:
      'Fully functional group-swiping app with live sessions, geolocation-based bar discovery, filter controls, and automatic match detection. Undo support, progress tracking, and "Open in Maps" navigation round out the experience. Provider abstraction allows swapping data sources without touching the UI.',
    links: {
      demo: '/apps/barmatch',
    },
    highlights: [
      'Realtime group sessions with live voting status',
      'Geolocation + filters (type, price, open now, outdoor)',
      'Full demo mode with simulated voting fallback',
    ],
  },
  {
    slug: 'flowboard',
    title: 'FlowBoard',
    summary:
      'A hybrid planning tool that merges Kanban columns with a freeform canvas. Switch modes seamlessly, connect cards with visual arrows, manage checklists and due dates — all offline.',
    status: 'shipped',
    role: 'Product Manager & Developer',
    scope: 'End-to-end: concept, design system, state management, offline-first architecture, and PWA launch.',
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Zustand', 'IndexedDB', 'dnd-kit'],
    problem:
      'Project planning tools force a choice: structured boards like Trello or spatial canvases like Miro. Teams that need both end up splitting their work across tools, losing context every time they switch.',
    approach:
      'Built a dual-mode planner where every card lives in both Kanban and Canvas views simultaneously. The Kanban view supports drag-and-drop reordering with dnd-kit, while the Canvas offers pan, zoom, and smart connectors that auto-route between cards. Cards include checklists with progress tracking, due dates with status indicators, comments, assignees, color coding, and priority levels. Zustand manages state with a 50-step undo/redo history. All data persists locally via IndexedDB. Shipped as an installable PWA.',
    outcome:
      'Seamless mode switching with full data consistency. Rich card management with checklists, comments, assignees, and due dates. Canvas connectors with automatic anchor-point calculation. Board archiving, command palette, and keyboard shortcuts for power users. Works entirely offline with no account required.',
    links: {
      demo: '/apps/flowboard',
    },
    highlights: [
      'Dual Kanban + Canvas with smart connector routing',
      'Rich cards: checklists, due dates, comments, assignees',
      'Offline-first PWA with 50-step undo/redo',
    ],
  },
];

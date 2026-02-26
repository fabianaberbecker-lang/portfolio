import type { Project } from './projects';

export const projectsEn: Project[] = [
  {
    slug: 'streaming-finder',
    title: 'Streaming Finder',
    summary:
      'A web app that lets users search for movies and TV shows and instantly see where they can stream, rent, or buy them — all in one place.',
    status: 'shipped',
    role: 'Product Manager & Developer',
    scope: 'End-to-end: concept, design, development, and launch.',
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'TMDB API'],
    problem:
      'Finding where a specific movie or show is available for streaming has become increasingly frustrating as content is fragmented across dozens of platforms. Users waste time switching between apps or relying on outdated information.',
    approach:
      "Built a responsive search-first interface powered by TMDB's watch-provider API. Designed a provider-abstraction layer so the backend can later integrate price-comparison APIs (JustWatch, Watchmode) without changing the frontend. Implemented debounced search, server-side caching, and clean error states for a smooth UX.",
    outcome:
      'MVP delivers instant streaming-availability lookups for 40+ countries. Provider-abstraction architecture reduces future integration effort by ~70%. Clean, mobile-first UI achieves Lighthouse scores above 90.',
    links: {
      demo: '/apps/streaming-finder',
    },
    highlights: [
      'Debounced search with autocomplete',
      'Provider abstraction for easy API swaps',
      'Server-side caching to minimize API calls',
    ],
  },
  {
    slug: 'analytics-dashboard',
    title: 'Product Analytics Dashboard',
    summary:
      'A real-time dashboard for product teams to monitor key metrics, track feature adoption, and identify user-drop-off points across the funnel.',
    status: 'wip',
    role: 'Product Manager',
    scope: 'Metric definition, stakeholder alignment, prototype, and frontend build.',
    stack: ['React', 'D3.js', 'Python', 'BigQuery'],
    problem:
      'Product teams relied on ad-hoc SQL queries and spreadsheets to track feature adoption, leading to delayed insights and inconsistent reporting across squads.',
    approach:
      'Defined key product metrics (DAU, retention, feature adoption rates) with stakeholders. Designed a dashboard prototype in Figma, validated with PMs and engineers, then built the frontend with React and D3.js, backed by BigQuery pipelines.',
    outcome:
      'Reduced time-to-insight from days to seconds. Standardized metric definitions across 4 product squads. Increased data-driven decision-making adoption by 60%.',
    links: {},
    highlights: [
      'Real-time data pipeline',
      'Custom D3.js visualizations',
      'Cross-squad metric alignment',
    ],
  },
  {
    slug: 'checkout-optimization',
    title: 'Checkout Flow Optimization',
    summary:
      'Led the redesign of a multi-step checkout flow that reduced cart abandonment by 23% and increased mobile conversion rates.',
    status: 'wip',
    role: 'Product Manager',
    scope: 'User research, hypothesis generation, A/B test design, cross-market rollout.',
    stack: ['A/B Testing', 'Figma', 'Hotjar', 'Google Analytics'],
    problem:
      'The existing checkout flow had a 68% abandonment rate on mobile, with the biggest drop-offs occurring at address entry and payment selection steps.',
    approach:
      'Conducted user research (Hotjar recordings, exit surveys), identified 5 key friction points, and ran 3 sequential A/B tests over 8 weeks. Introduced auto-fill, progress indicators, and a one-page checkout variant.',
    outcome:
      '23% reduction in cart abandonment. 18% increase in mobile conversion rate. Changes adopted as the new baseline across all markets.',
    links: {},
    highlights: [
      'Data-driven hypothesis generation',
      'Sequential A/B testing strategy',
      '23% abandonment reduction',
    ],
  },
];

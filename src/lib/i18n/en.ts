import type { SiteContent } from './types';

export const content: SiteContent = {
  meta: {
    siteTitle: 'Fabian Becker — Product Manager',
    siteDescription:
      'Product Manager portfolio showcasing digital product work, technical projects, and case studies.',
  },
  nav: {
    home: 'home',
    projects: 'projects',
    about: 'about',
    streamingFinder: 'streaming finder',
    contact: 'contact',
  },
  hero: {
    name: 'Fabian Becker',
    role: 'Product Manager',
    email: 'becker.fabianpk@gmail.com',
    tagline: 'building products that users love',
    description:
      'I can combine product thinking with technical curiosity to build and improve digital products. From user research to shipping features — hands-on and data-driven.',
    viewProjects: 'view projects',
    getInTouch: 'get in touch',
    downloadCv: 'download cv',
  },
  about: {
    title: 'about me',
    intro: [
      "I'm a product-minded person with hands-on experience building and improving digital tools. At eduki, I've been part of developing AI-powered features for educators — from gathering user feedback through qualitative interviews to iterating on the product based on real insights.",
      'What drives me is the process of taking a product from idea to improvement: understanding users, organizing cross-functional work, and seeing the impact of well-structured collaboration. I bring a structured, independent work approach paired with a genuine curiosity for how technology can solve real problems.',
    ],
    whatIDo: {
      title: 'what I do',
      items: [
        {
          title: 'Digital Product Development',
          description:
            'Contributing to the development and iterative improvement of digital tools, including AI-powered features for educators.',
        },
        {
          title: 'User Research & Feedback',
          description:
            'Conducting qualitative interviews, surveys, and feedback analysis to turn user insights into actionable improvements.',
        },
        {
          title: 'Growth Marketing & SEO',
          description:
            'Website optimization, content writing, and SEO collaboration to drive organic growth and improve user acquisition.',
        },
      ],
    },
    howIWork: {
      title: 'how I work',
      principles: [
        {
          iconKey: 'chart',
          title: 'data-informed decisions',
          description:
            'I combine quantitative signals with qualitative insights. Data frames the question; user empathy drives the answer.',
        },
        {
          iconKey: 'rocket',
          title: 'ship & iterate',
          description:
            'I believe in learning fast. Small, frequent releases beat big-bang launches — every time.',
        },
        {
          iconKey: 'handshake',
          title: 'cross-functional teamwork',
          description:
            'Great products emerge when different perspectives come together. I invest in open communication and shared understanding.',
        },
        {
          iconKey: 'code',
          title: 'technical curiosity',
          description:
            'I understand HTML/CSS, work with CMS tools, and am familiar with sprint workflows. This helps me collaborate more effectively with engineers.',
        },
      ],
    },
    experience: {
      title: 'experience',
      timeline: [
        {
          period: '02/2022 — present',
          role: 'Working Student (Werkstudent)',
          company: 'eduki (Lehrerkolleg LK GmbH)',
          description:
            'AI-Tools: Contributing to development and iterative improvement based on user feedback (qualitative interviews & analysis). Growth Marketing & SEO: Website optimization (Builder.io), SEO collaboration, writing/optimizing website copy. Content & Copyright: Taxonomy assignment, copyright compliance checks.',
          type: 'work',
        },
        {
          period: '07/2020 — 04/2021',
          role: 'Retail Sales',
          company: 'Detlev Louis (Motorcycle Retail)',
          description: 'Customer-facing retail experience in a specialized retail environment.',
          type: 'work',
        },
        {
          period: '12/2019 — 06/2020',
          role: 'Voluntary Social Year (FSJ)',
          company: 'AWO — Sheltered Workshops Berlin',
          description:
            'Social engagement working with people with disabilities, developing empathy and organizational skills.',
          type: 'work',
        },
        {
          period: '10/2020 — 03/2026',
          role: 'B.A. German Studies & History',
          company: 'University of Potsdam',
          description:
            'Combined Bachelor in German Studies (major) & History (minor). Developed structured, independent work approach and the ability to quickly understand and present complex topics.',
          type: 'education',
        },
        {
          period: '10/2018 — 09/2019',
          role: 'B.A. Business Informatics',
          company: 'Technical University Berlin',
          description: 'First exposure to computer science and business fundamentals.',
          type: 'education',
        },
        {
          period: '2012 — 2018',
          role: 'Abitur & Baccalauréat',
          company: 'Romain-Rolland-Gymnasium Berlin',
          description:
            'German Abitur and French Baccalauréat (dual diploma). Foundation in French language and cross-cultural education.',
          type: 'education',
        },
      ],
    },
    toolbox: {
      title: 'toolbox',
      categories: [
        {
          category: 'product',
          items: [
            'User Research',
            'Qualitative Interviews',
            'Surveys & Feedback Analysis',
            'Sprint Workflows',
            'Ticket Management',
          ],
          colorClass: 'bg-pop-purple',
        },
        {
          category: 'technical',
          items: ['HTML & CSS', 'Builder.io / CMS', 'SEO Optimization', 'AI Tools', 'Web Analytics'],
          colorClass: 'bg-pop-red',
        },
        {
          category: 'analytics',
          items: ['Google Analytics', 'Looker Studio', 'Data Analysis', 'Reporting & Dashboards'],
          colorClass: 'bg-pop-yellow',
        },
        {
          category: 'tools & media',
          items: ['MS Office', 'Affinity Photo', 'DaVinci Resolve', 'Google Forms', 'Presentation Design'],
          colorClass: 'bg-pop-green',
        },
      ],
    },
  },
  projects: {
    title: 'projects',
    subtitle:
      'a collection of product work, technical projects, and case studies. each includes the problem, approach, and measurable outcome.',
    selectedWork: 'selected work',
    caseStudies: 'case studies & shipped products',
    viewAll: 'view all →',
    viewAllProjects: 'view all projects',
    backToProjects: '← back to projects',
    viewLiveDemo: 'view live demo',
    viewRepository: 'view repository',
    statusShipped: 'shipped',
    statusWip: 'in progress',
    sectionProblem: 'the problem',
    sectionRole: 'role & scope',
    sectionApproach: 'approach',
    sectionOutcome: 'outcome',
    sectionHighlights: 'key highlights',
  },
  contact: {
    title: 'get in touch',
    subtitle:
      "i'm always happy to connect. whether you have a question, a project idea, or just want to say hi.",
    preferForm: 'prefer a form?',
    formComingSoon:
      'a contact form is coming soon. in the meantime, reach out via email or linkedin.',
    sendEmail: 'send an email',
    emailLabel: 'email',
    linkedinLabel: 'linkedin',
    githubLabel: 'github',
  },
  streamingFinder: {
    landing: {
      badge: 'streaming finder',
      title: 'where to watch ',
      titleHighlight: 'anything',
      description:
        "Search for any movie or TV show and instantly see where it's available — subscriptions, rental & purchase, all in one place.",
      cta: 'start searching →',
      features: [
        {
          iconKey: 'search',
          title: 'instant search',
          description:
            'Type a title and get results as you type. Debounced for smooth performance.',
        },
        {
          iconKey: 'play',
          title: 'stream · rent · buy',
          description:
            'See availability broken down by subscription, rental, and purchase options.',
        },
        {
          iconKey: 'globe',
          title: 'multi-region',
          description:
            'Check availability in Germany, US, UK, France, and more — 40+ countries.',
        },
        {
          iconKey: 'camera',
          title: 'provider logos',
          description:
            'Instantly recognize Netflix, Disney+, Amazon, and 300+ other providers.',
        },
      ],
      attribution:
        'Streaming availability data powered by TMDB. All information is provided for informational purposes.',
    },
    search: {
      title: 'search movies & shows',
      placeholder: 'Search for a movie or TV show...',
      backLink: '← streaming finder',
      noResults: 'no results found',
      noResultsHint: 'try a different search term.',
      initialTitle: 'find where to watch',
      initialDescription:
        'search for any movie or TV show to see streaming availability.',
      trendingMovies: 'trending movies',
      trendingShows: 'trending shows',
      retry: 'retry',
      errorMessage: 'Something went wrong. Please try again.',
    },
    detail: {
      backToSearch: '← back to search',
      streamingAvailability: 'streaming availability',
      streaming: 'streaming',
      rent: 'rent',
      buy: 'buy',
      noProviders:
        'no providers available in this category for the selected region.',
      viewOnTmdb: 'view on justwatch/tmdb →',
      movie: 'movie',
      tvShow: 'tv show',
      couldNotLoad: 'could not load title',
      episodes: 'episodes',
      min: 'min',
    },
    showcase: {
      title: 'streaming finder',
      description:
        'A tool I built to solve my own frustration: finding where to watch movies and shows across streaming platforms. Search any title and instantly see availability across 40+ countries.',
      valueProps: [
        {
          iconKey: 'search',
          title: 'Real-time search',
          description: 'Instant results as you type with smart debouncing.',
        },
        {
          iconKey: 'globe',
          title: '40+ countries',
          description: 'Check streaming availability across regions worldwide.',
        },
        {
          iconKey: 'play',
          title: 'Stream, rent, or buy',
          description: 'All options in one view — no more switching between apps.',
        },
      ],
      cta: 'try it out →',
      tryDemo: 'open app',
    },
  },
  cta: {
    title: "let's work together",
    description:
      "I'm always open to discussing new opportunities, interesting projects, or just talking product & tech.",
    contactMe: 'contact me',
    linkedin: 'linkedin',
  },
  footer: {
    copyright: `© ${new Date().getFullYear()} Fabian Becker. All rights reserved.`,
    tmdbAttribution: 'Streaming data by',
  },
};

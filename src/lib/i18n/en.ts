import type { SiteContent } from './types';

export const content: SiteContent = {
  meta: {
    siteTitle: 'Fabian Becker',
    siteDescription:
  'Portfolio of digital product projects, prototypes, and small web apps.',
  },
  nav: {
  home: 'Home',
  projects: 'Projects',
  about: 'About',
  demos: 'Demos',
  streamingFinder: 'Streaming Finder',
  barMatch: 'BarMatch',
  flowBoard: 'FlowBoard',
  contact: 'Contact',
},
  hero: {
  name: 'Fabian Becker',
  
  email: 'becker.fabianpk@gmail.com',
  tagline: 'from user insight to shipped features',
  description:
    'I work at the intersection of product, users, and technology. From user research to shipping features, I focus on understanding problems and turning them into practical improvements.',
  viewProjects: 'explore projects',
  getInTouch: 'get in touch',
  downloadCv: 'download cv',
},

about: {
  title: 'about me',
  intro: [
    "I'm a product-focused builder with experience improving digital tools. At eduki, I work on AI features for educators: talking to users, understanding their workflows, and helping translate those insights into product decisions.",
    "What I enjoy most is the process of improving a product over time: understanding what users actually need, working closely with designers and engineers, and seeing ideas turn into features that make the product better.",
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
            'I combine quantitative signals with qualitative insights. Data helps highlight patterns, but user understanding guides the decisions.',
        },
        {
          iconKey: 'rocket',
          title: 'ship & iterate',
          description:
            'I like working on products over time: gathering feedback, making improvements, and gradually making things better for users.',
        },
        {
          iconKey: 'handshake',
          title: 'cross-functional teamwork',
          description:
            'Good products come from close collaboration between product, design, and engineering. I invest in open communication and shared understanding.',
        },
        {
          iconKey: 'code',
          title: 'technical curiosity',
          description:
            'I understand HTML/CSS, work with CMS tools, and am familiar with agile workflows. This helps me collaborate more effectively with engineers.',
        },
      ],
    },
    experience: {
      title: 'experience',
      timeline: [
        {
          period: '02/2022 - present',
          role: 'Working Student (Werkstudent)',
          company: 'eduki (Lehrerkolleg LK GmbH)',
          description:
            description:
  'AI tools: supporting development and iteration based on user feedback (interviews and qualitative analysis). Growth marketing & SEO: website optimization with Builder.io, SEO collaboration, and writing/optimizing website copy. Content & copyright: taxonomy work and copyright compliance checks.',
          type: 'work',
        },
        {
          period: '07/2020 - 04/2021',
          role: 'Retail Sales',
          company: 'Detlev Louis (Motorcycle Retail)',
          description: 'Customer-facing retail experience in a specialized retail environment.',
          type: 'work',
        },
        {
          period: '12/2019 - 06/2020',
          role: 'Voluntary Social Year (FSJ)',
          company: 'AWO Sheltered Workshops Berlin',
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
          period: '10/2018 - 09/2019',
          role: 'B.A. Business Informatics',
          company: 'Technical University Berlin',
          description: 'First exposure to computer science and business fundamentals.',
          type: 'education',
        },
        {
          period: '2012 - 2018',
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
          items: [
  'Figma',
  'Notion',
  'Jira',
  'MS Office',
  'Google Forms',
  'Affinity Photo',
  'DaVinci Resolve',
  'Presentation Design'
],
          colorClass: 'bg-pop-green',
        },
      ],
    },
  },
  projects: {
    title: 'projects',
    subtitle:
      'a collection of product work, technical projects, and case studies.',
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
      availableOnYours: 'available on your services',
      alsoAvailableOn: 'also available on',
      notOnYourServices: 'not on your subscriptions',
      setupServices: 'set up your services to see personalized results',
      notifyMe: 'notify me',
      alertActive: 'alert active',
      nowAvailable: 'now available!',
      removeAlert: 'remove alert',
      needServices: 'set up your services first',
      pushDenied: 'enable notifications in your browser to get alerts',
      alertCreated: 'alert created — we\'ll notify you',
      alertRemoved: 'alert removed',
      bestOptionTitle: 'best way to watch',
      bestRental: 'best option to rent',
      bestPurchase: 'best option to buy',
      comparePrices: 'compare all prices →',
      orSetAlert: 'or set an alert for streaming',
      priceUnknown: 'price unknown',
    },
    services: {
      title: 'my services',
      subtitle: 'select the streaming services you subscribe to',
      selectRegion: 'region',
      searchPlaceholder: 'search providers...',
      noProviders: 'no providers found for this region.',
      selected: 'selected',
      done: 'done',
      clearAll: 'clear all',
    },
    alerts: {
      title: 'my alerts',
      subtitle: 'get notified when titles become available',
      noAlerts: 'no alerts yet. create one from a title detail page.',
      active: 'active',
      matched: 'available!',
      deleteConfirm: 'remove this alert?',
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
  barMatch: {
    showcase: {
      title: 'barmatch',
      description:
        'A group decision app for finding the right bar. Create a session, invite friends, swipe through nearby spots, and match on the one everyone likes.',
      valueProps: [
        {
          iconKey: 'group',
          title: 'Group sessions',
          description: 'Invite friends via link or QR code to decide together.',
        },
        {
          iconKey: 'heart',
          title: 'Swipe to match',
          description: 'Like or skip bars — when everyone agrees, it\'s a match.',
        },
        {
          iconKey: 'mappin',
          title: 'Real bar data',
          description: 'Live data from OpenStreetMap with locations and hours.',
        },
      ],
      cta: 'try it out \u2192',
      tryDemo: 'open app',
    },
  },
  flowBoard: {
    showcase: {
      title: 'flowboard',
      description:
        'A hybrid planning tool that combines Kanban columns with a freeform canvas. Drag cards between modes, connect ideas visually, and work fully offline.',
      valueProps: [
        {
          iconKey: 'columns',
          title: 'Kanban + Canvas',
          description: 'Switch between structured columns and spatial whiteboard.',
        },
        {
          iconKey: 'link',
          title: 'Visual connectors',
          description: 'Draw arrows between cards to map flows and dependencies.',
        },
        {
          iconKey: 'offline',
          title: 'Offline-first',
          description: 'All data stored locally via IndexedDB. No account needed.',
        },
      ],
      cta: 'try it out \u2192',
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

export type Locale = 'en' | 'de';

export interface SiteContent {
  meta: {
    siteTitle: string;
    siteDescription: string;
  };
  nav: {
    home: string;
    projects: string;
    about: string;
    streamingFinder: string;
    barMatch: string;
    contact: string;
  };
  hero: {
    name: string;
    role: string;
    email: string;
    tagline: string;
    description: string;
    viewProjects: string;
    getInTouch: string;
    downloadCv: string;
  };
  about: {
    title: string;
    intro: string[];
    whatIDo: {
      title: string;
      items: Array<{ title: string; description: string }>;
    };
    howIWork: {
      title: string;
      principles: Array<{
        iconKey: string;
        title: string;
        description: string;
      }>;
    };
    experience: {
      title: string;
      timeline: Array<{
        period: string;
        role: string;
        company: string;
        description: string;
        type: 'work' | 'education';
      }>;
    };
    toolbox: {
      title: string;
      categories: Array<{
        category: string;
        items: string[];
        colorClass: string;
      }>;
    };
  };
  projects: {
    title: string;
    subtitle: string;
    selectedWork: string;
    caseStudies: string;
    viewAll: string;
    viewAllProjects: string;
    backToProjects: string;
    viewLiveDemo: string;
    viewRepository: string;
    statusShipped: string;
    statusWip: string;
    sectionProblem: string;
    sectionRole: string;
    sectionApproach: string;
    sectionOutcome: string;
    sectionHighlights: string;
  };
  contact: {
    title: string;
    subtitle: string;
    preferForm: string;
    formComingSoon: string;
    sendEmail: string;
    emailLabel: string;
    linkedinLabel: string;
    githubLabel: string;
  };
  streamingFinder: {
    landing: {
      badge: string;
      title: string;
      titleHighlight: string;
      description: string;
      cta: string;
      features: Array<{
        iconKey: string;
        title: string;
        description: string;
      }>;
      attribution: string;
    };
    search: {
      title: string;
      placeholder: string;
      backLink: string;
      noResults: string;
      noResultsHint: string;
      initialTitle: string;
      initialDescription: string;
      trendingMovies: string;
      trendingShows: string;
      retry: string;
      errorMessage: string;
    };
    detail: {
      backToSearch: string;
      streamingAvailability: string;
      streaming: string;
      rent: string;
      buy: string;
      noProviders: string;
      viewOnTmdb: string;
      movie: string;
      tvShow: string;
      couldNotLoad: string;
      episodes: string;
      min: string;
    };
    showcase: {
      title: string;
      description: string;
      valueProps: Array<{ iconKey: string; title: string; description: string }>;
      cta: string;
      tryDemo: string;
    };
  };
  barMatch: {
    showcase: {
      title: string;
      description: string;
      valueProps: Array<{ iconKey: string; title: string; description: string }>;
      cta: string;
      tryDemo: string;
    };
  };
  cta: {
    title: string;
    description: string;
    contactMe: string;
    linkedin: string;
  };
  footer: {
    copyright: string;
    tmdbAttribution: string;
  };
}

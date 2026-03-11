import type { SiteContent } from './types';

export const content: SiteContent = {
  meta: {
  siteTitle: 'Fabian Becker',
  siteDescription:
    'Portfolio mit digitalen Produktprojekten, Prototypen und kleinen Web-Apps.',
},

nav: {
  home: 'Start',
  projects: 'Projekte',
  about: 'Über mich',
  demos: 'Demos',
  streamingFinder: 'Streaming Finder',
  barMatch: 'BarMatch',
  flowBoard: 'FlowBoard',
  contact: 'Kontakt',
},

hero: {
  name: 'Fabian Becker',
  role: 'Produktorientierter Entwickler',
  email: 'becker.fabianpk@gmail.com',
  tagline: 'von user insight zu umgesetzten features',
  description:
    'Ich arbeite an der Schnittstelle von Produkt, Nutzern und Technologie. Von User Research bis zum Feature-Release konzentriere ich mich darauf, Probleme zu verstehen und in praktische Verbesserungen zu übersetzen.',
  viewProjects: 'Projekte entdecken',
  getInTouch: 'Kontakt aufnehmen',
  downloadCv: 'Lebenslauf herunterladen',
},

about: {
  title: 'über mich',
  intro: [
    'Ich arbeite produktnah und habe Erfahrung darin, digitale Tools zu verbessern. Bei eduki arbeite ich an KI-Features für Lehrkräfte — spreche mit Nutzern, verstehe ihre Arbeitsabläufe und helfe dabei, diese Erkenntnisse in Produktentscheidungen zu übersetzen.',
    'Am meisten gefällt mir der Prozess, ein Produkt über Zeit zu verbessern: zu verstehen, was Nutzer wirklich brauchen, eng mit Design und Engineering zusammenzuarbeiten und zu sehen, wie Ideen zu konkreten Features werden.',
  ],

  whatIDo: {
    title: 'was ich mache',
    items: [
      {
        title: 'Produktentwicklung',
        description:
          'Mitarbeit an der Entwicklung und Verbesserung digitaler Tools, einschließlich KI-gestützter Features für Lehrkräfte.',
      },
      {
        title: 'User Research',
        description:
          'Durchführung von Interviews, Umfragen und Feedbackanalysen, um Nutzerbedürfnisse zu verstehen und Produktverbesserungen abzuleiten.',
      },
      {
        title: 'Growth & SEO',
        description:
          'Optimierung von Website-Struktur und Inhalten sowie Zusammenarbeit bei SEO-Themen, um organisches Wachstum zu unterstützen.',
      },
    ],
  },

  howIWork: {
    title: 'wie ich arbeite',
    principles: [
      {
        iconKey: 'chart',
        title: 'dateninformierte entscheidungen',
        description:
          'Ich kombiniere quantitative Signale mit qualitativen Erkenntnissen. Daten helfen dabei, Muster zu erkennen, aber das Verständnis der Nutzer leitet die Entscheidungen.',
      },
      {
        iconKey: 'rocket',
        title: 'shippen & iterieren',
        description:
          'Ich arbeite gerne über längere Zeit an Produkten: Feedback sammeln, Verbesserungen umsetzen und Dinge Schritt für Schritt besser machen.',
      },
      {
        iconKey: 'handshake',
        title: 'cross-funktionale zusammenarbeit',
        description:
          'Gute Produkte entstehen durch enge Zusammenarbeit zwischen Produkt, Design und Engineering. Offene Kommunikation und gemeinsames Verständnis sind dabei entscheidend.',
      },
      {
        iconKey: 'code',
        title: 'technische neugier',
        description:
          'Ich verstehe HTML/CSS, arbeite mit CMS-Systemen und kenne agile Workflows. Das hilft mir, effektiver mit Entwicklerteams zusammenzuarbeiten.',
      },
    ],
  },

  experience: {
    title: 'erfahrung',
    timeline: [
      {
        period: '02/2022 - heute',
        role: 'Werkstudent',
        company: 'eduki (Lehrerkolleg LK GmbH)',
        description:
          'AI-Tools: Unterstützung bei Entwicklung und Iteration auf Basis von Nutzerfeedback (Interviews und qualitative Analyse). Growth Marketing & SEO: Website-Optimierung mit Builder.io, SEO-Zusammenarbeit sowie Schreiben und Optimieren von Website-Texten. Content & Copyright: Taxonomie-Arbeit und Prüfung von urheberrechtlichen Fragen.',
        type: 'work',
      },
      {
        period: '07/2020 . 04/2021',
        role: 'Verkäufer im Einzelhandel',
        company: 'Detlev Louis (Motorradfachgeschäft)',
        description:
          'Kundenberatung und Verkauf im spezialisierten Einzelhandel.',
        type: 'work',
      },
      {
        period: '12/2019 - 06/2020',
        role: 'Freiwilliges Soziales Jahr (FSJ)',
        company: 'AWO — Behindertenwerkstätten Berlin',
        description:
          'Soziale Arbeit mit Menschen mit Behinderungen, Entwicklung von Empathie und organisatorischen Fähigkeiten.',
        type: 'work',
      },
      {
        period: '10/2020 - 03/2026',
        role: 'B.A. Germanistik & Geschichte',
        company: 'Universität Potsdam',
        description:
          'Kombinationsbachelor Germanistik (Hauptfach) und Geschichte (Nebenfach). Entwicklung einer strukturierten Arbeitsweise sowie der Fähigkeit, komplexe Inhalte schnell zu verstehen und verständlich darzustellen.',
        type: 'education',
      },
      {
        period: '10/2018 - 09/2019',
        role: 'B.A. Wirtschaftsinformatik',
        company: 'Technische Universität Berlin',
        description:
          'Erste Einblicke in Informatik und betriebswirtschaftliche Grundlagen.',
        type: 'education',
      },
      {
        period: '2012 - 2018',
        role: 'Abitur & Baccalauréat',
        company: 'Romain-Rolland-Gymnasium Berlin',
        description:
          'Deutsches Abitur und französisches Baccalauréat (Doppeldiplom). Grundlage in französischer Sprache und interkultureller Bildung.',
        type: 'education',
      },
    ],
  },

  toolbox: {
    title: 'toolbox',
    categories: [
      {
        category: 'produkt',
        items: [
          'User Research',
          'Qualitative Interviews',
          'Umfragen & Feedbackanalyse',
          'Sprint-Workflows',
          'Ticket-Management',
        ],
        colorClass: 'bg-pop-purple',
      },
      {
        category: 'technisch',
        items: [
          'HTML & CSS',
          'Builder.io / CMS',
          'SEO-Optimierung',
          'AI Tools',
          'Web Analytics',
        ],
        colorClass: 'bg-pop-red',
      },
      {
        category: 'analytics',
        items: [
          'Google Analytics',
          'Looker Studio',
          'Datenanalyse',
          'Reporting & Dashboards',
        ],
        colorClass: 'bg-pop-yellow',
      },
      {
        category: 'tools & medien',
        items: [
          'Figma',
          'Notion',
          'Jira',
          'MS Office',
          'Google Forms',
          'Affinity Photo',
          'DaVinci Resolve',
          'Präsentationsdesign',
        ],
        colorClass: 'bg-pop-green',
      },
    ],
    },
  },
  projects: {
    title: 'projekte',
    subtitle:
      'eine Sammlung von Produktarbeit, technischen Projekten und Case Studies.',
    selectedWork: 'ausgewählte arbeiten',
    caseStudies: 'case studies & fertige produkte',
    viewAll: 'alle ansehen →',
    viewAllProjects: 'alle projekte ansehen',
    backToProjects: '← zurück zu projekten',
    viewLiveDemo: 'live-demo ansehen',
    viewRepository: 'repository ansehen',
    statusShipped: 'fertig',
    statusWip: 'in arbeit',
    sectionProblem: 'das problem',
    sectionRole: 'rolle & umfang',
    sectionApproach: 'ansatz',
    sectionOutcome: 'ergebnis',
    sectionHighlights: 'highlights',
  },
  contact: {
    title: 'kontakt aufnehmen',
    subtitle:
      'ich freue mich immer über neue Kontakte. Ob Frage, Projektidee oder einfach nur Hallo sagen.',
    preferForm: 'lieber ein Formular?',
    formComingSoon:
      'ein Kontaktformular kommt bald. In der Zwischenzeit gerne per E-Mail oder LinkedIn melden.',
    sendEmail: 'e-mail senden',
    emailLabel: 'e-mail',
    linkedinLabel: 'linkedin',
    githubLabel: 'github',
  },
  streamingFinder: {
    landing: {
      badge: 'streaming finder',
      title: 'wo du ',
      titleHighlight: 'alles',
      description:
        'Suche nach einem Film oder einer Serie und sieh sofort, wo du streamen, leihen oder kaufen kannst — alles an einem Ort.',
      cta: 'suche starten →',
      features: [
        {
          iconKey: 'search',
          title: 'sofortsuche',
          description:
            'Tippe einen Titel ein und erhalte Ergebnisse während du tippst. Optimiert für flüssige Performance.',
        },
        {
          iconKey: 'play',
          title: 'streamen · leihen · kaufen',
          description:
            'Verfügbarkeit aufgeschlüsselt nach Abo, Leihoptionen und Kaufmöglichkeiten.',
        },
        {
          iconKey: 'globe',
          title: 'multi-region',
          description:
            'Verfügbarkeit in Deutschland, USA, UK, Frankreich und mehr — über 40 Länder.',
        },
        {
          iconKey: 'camera',
          title: 'anbieter-logos',
          description:
            'Netflix, Disney+, Amazon und 300+ weitere Anbieter sofort erkennen.',
        },
      ],
      attribution:
        'Streaming-Daten bereitgestellt von TMDB. Alle Informationen dienen nur zu Informationszwecken.',
    },
    search: {
      title: 'filme & serien suchen',
      placeholder: 'Nach einem Film oder einer Serie suchen...',
      backLink: '← streaming finder',
      noResults: 'keine ergebnisse',
      noResultsHint: 'versuche einen anderen Suchbegriff.',
      initialTitle: 'finde wo du schauen kannst',
      initialDescription:
        'suche nach einem Film oder einer Serie, um die Streaming-Verfügbarkeit zu sehen.',
      trendingMovies: 'trend-filme',
      trendingShows: 'trend-serien',
      retry: 'erneut versuchen',
      errorMessage: 'Etwas ist schiefgelaufen. Bitte versuche es erneut.',
    },
    detail: {
      backToSearch: '← zurück zur suche',
      streamingAvailability: 'streaming-verfügbarkeit',
      streaming: 'streaming',
      rent: 'leihen',
      buy: 'kaufen',
      noProviders:
        'keine Anbieter in dieser Kategorie für die gewählte Region verfügbar.',
      viewOnTmdb: 'auf justwatch/tmdb ansehen →',
      movie: 'film',
      tvShow: 'serie',
      couldNotLoad: 'titel konnte nicht geladen werden',
      episodes: 'Folgen',
      min: 'Min.',
      availableOnYours: 'auf deinen Diensten verfügbar',
      alsoAvailableOn: 'auch verfügbar auf',
      notOnYourServices: 'nicht in deinen Abos',
      setupServices: 'richte deine Dienste ein für personalisierte Ergebnisse',
      notifyMe: 'benachrichtigen',
      alertActive: 'alarm aktiv',
      nowAvailable: 'jetzt verfügbar!',
      removeAlert: 'alarm entfernen',
      needServices: 'richte zuerst deine Dienste ein',
      pushDenied: 'aktiviere Benachrichtigungen im Browser für Alarme',
      alertCreated: 'alarm erstellt — wir benachrichtigen dich',
      alertRemoved: 'alarm entfernt',
      bestOptionTitle: 'beste Option zum Schauen',
      bestRental: 'beste Option zum Leihen',
      bestPurchase: 'beste Option zum Kaufen',
      comparePrices: 'alle Preise vergleichen →',
      orSetAlert: 'oder Alarm für Streaming setzen',
      priceUnknown: 'Preis unbekannt',
    },
    services: {
      title: 'meine dienste',
      subtitle: 'wähle die Streaming-Dienste, die du abonniert hast',
      selectRegion: 'Region',
      searchPlaceholder: 'Anbieter suchen...',
      noProviders: 'keine Anbieter für diese Region gefunden.',
      selected: 'ausgewählt',
      done: 'fertig',
      clearAll: 'alle entfernen',
    },
    alerts: {
      title: 'meine alarme',
      subtitle: 'werde benachrichtigt, wenn Titel verfügbar werden',
      noAlerts: 'noch keine Alarme. Erstelle einen auf einer Titel-Detailseite.',
      active: 'aktiv',
      matched: 'verfügbar!',
      deleteConfirm: 'diesen Alarm entfernen?',
    },
    showcase: {
      title: 'streaming finder',
      description:
        'Ein Tool, das ich gebaut habe, um mein eigenes Problem zu lösen: Herauszufinden, wo man Filme und Serien auf verschiedenen Plattformen schauen kann. Suche einen Titel und sieh sofort die Verfügbarkeit in über 40 Ländern.',
      valueProps: [
        {
          iconKey: 'search',
          title: 'Echtzeit-Suche',
          description: 'Sofortige Ergebnisse beim Tippen mit smartem Debouncing.',
        },
        {
          iconKey: 'globe',
          title: '40+ Länder',
          description: 'Streaming-Verfügbarkeit weltweit überprüfen.',
        },
        {
          iconKey: 'play',
          title: 'Streamen, leihen oder kaufen',
          description: 'Alle Optionen in einer Ansicht — kein App-Wechsel mehr.',
        },
      ],
      cta: 'ausprobieren →',
      tryDemo: 'app öffnen',
    },
  },
  barMatch: {
    showcase: {
      title: 'barmatch',
      description:
        'Eine Gruppen-Entscheidungs-App, um die richtige Bar zu finden. Session erstellen, Freunde einladen, durch Bars swipen und gemeinsam matchen.',
      valueProps: [
        {
          iconKey: 'group',
          title: 'Gruppen-Sessions',
          description: 'Freunde per Link oder QR-Code einladen und gemeinsam entscheiden.',
        },
        {
          iconKey: 'heart',
          title: 'Swipen & Matchen',
          description: 'Bars liken oder skippen \u2014 wenn alle einig sind, gibt\u2019s ein Match.',
        },
        {
          iconKey: 'mappin',
          title: 'Echte Bar-Daten',
          description: 'Live-Daten von OpenStreetMap mit Standorten und \u00d6ffnungszeiten.',
        },
      ],
      cta: 'ausprobieren \u2192',
      tryDemo: 'app \u00f6ffnen',
    },
  },
  flowBoard: {
    showcase: {
      title: 'flowboard',
      description:
        'Ein hybrides Planungstool, das Kanban-Spalten mit einem Freeform-Canvas kombiniert. Karten zwischen Modi verschieben, Ideen visuell verbinden und komplett offline arbeiten.',
      valueProps: [
        {
          iconKey: 'columns',
          title: 'Kanban + Canvas',
          description: 'Wechsle zwischen strukturierten Spalten und freiem Whiteboard.',
        },
        {
          iconKey: 'link',
          title: 'Visuelle Verbindungen',
          description: 'Pfeile zwischen Karten zeichnen um Abh\u00e4ngigkeiten darzustellen.',
        },
        {
          iconKey: 'offline',
          title: 'Offline-first',
          description: 'Alle Daten lokal via IndexedDB gespeichert. Kein Account n\u00f6tig.',
        },
      ],
      cta: 'ausprobieren \u2192',
      tryDemo: 'app \u00f6ffnen',
    },
  },
  cta: {
    title: 'lass uns zusammenarbeiten',
    description:
      'Ich bin immer offen für neue Möglichkeiten, interessante Projekte oder einfach einen Austausch über Produkt & Tech.',
    contactMe: 'kontakt',
    linkedin: 'linkedin',
  },
  footer: {
    copyright: `© ${new Date().getFullYear()} Fabian Becker. Alle Rechte vorbehalten.`,
    tmdbAttribution: 'Streaming-Daten von',
  },
};

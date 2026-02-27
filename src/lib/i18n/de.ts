import type { SiteContent } from './types';

export const content: SiteContent = {
  meta: {
    siteTitle: 'Fabian Becker — Product Manager',
    siteDescription:
      'Product Manager Portfolio mit digitalen Produktprojekten, technischen Projekten und Case Studies.',
  },
  nav: {
    home: 'start',
    projects: 'projekte',
    about: 'über mich',
    streamingFinder: 'streaming finder',
    barMatch: 'barmatch',
    contact: 'kontakt',
  },
  hero: {
    name: 'Fabian Becker',
    role: 'Product Manager',
    email: 'becker.fabianpk@gmail.com',
    tagline: 'digitale produkte, die nutzer lieben',
    description:
      'Ich verbinde Produktdenken mit technischer Neugier, um digitale Produkte zu bauen und zu verbessern. Von User Research bis zum Feature-Release — hands-on und datengetrieben.',
    viewProjects: 'projekte ansehen',
    getInTouch: 'kontakt aufnehmen',
    downloadCv: 'lebenslauf laden',
  },
  about: {
    title: 'über mich',
    intro: [
      'Ich bin ein produktgetriebener Mensch mit praktischer Erfahrung im Aufbau und der Verbesserung digitaler Tools. Bei eduki habe ich an der Entwicklung KI-gestützter Features für Lehrkräfte mitgearbeitet — von der Erhebung von Nutzerfeedback durch qualitative Interviews bis zur iterativen Verbesserung des Produkts basierend auf echten Erkenntnissen.',
      'Was mich antreibt, ist der Prozess, ein Produkt von der Idee zur Verbesserung zu begleiten: Nutzer verstehen, crossfunktionale Arbeit organisieren und den Impact guter Zusammenarbeit zu sehen. Ich bringe eine strukturierte, eigenständige Arbeitsweise mit und eine echte Neugier dafür, wie Technologie reale Probleme lösen kann.',
    ],
    whatIDo: {
      title: 'was ich mache',
      items: [
        {
          title: 'Digitale Produktentwicklung',
          description:
            'Mitwirkung an der Entwicklung und iterativen Verbesserung digitaler Tools, einschließlich KI-gestützter Features für Lehrkräfte.',
        },
        {
          title: 'User Research & Feedback',
          description:
            'Durchführung qualitativer Interviews, Umfragen und Feedbackanalysen, um Nutzererkenntnisse in umsetzbare Verbesserungen zu übersetzen.',
        },
        {
          title: 'Growth Marketing & SEO',
          description:
            'Website-Optimierung, Content-Erstellung und SEO-Zusammenarbeit zur Steigerung des organischen Wachstums.',
        },
      ],
    },
    howIWork: {
      title: 'wie ich arbeite',
      principles: [
        {
          iconKey: 'chart',
          title: 'datenbasierte entscheidungen',
          description:
            'Ich kombiniere quantitative Signale mit qualitativen Erkenntnissen. Daten stellen die Frage; Nutzerempathie liefert die Antwort.',
        },
        {
          iconKey: 'rocket',
          title: 'shippen & iterieren',
          description:
            'Ich glaube an schnelles Lernen. Kleine, häufige Releases schlagen große Launches — immer.',
        },
        {
          iconKey: 'handshake',
          title: 'crossfunktionale teamarbeit',
          description:
            'Gute Produkte entstehen, wenn verschiedene Perspektiven zusammenkommen. Ich investiere in offene Kommunikation und gemeinsames Verständnis.',
        },
        {
          iconKey: 'code',
          title: 'technische neugier',
          description:
            'Ich verstehe HTML/CSS, arbeite mit CMS-Tools und kenne Sprint-Workflows. Das hilft mir, effektiver mit Entwicklern zusammenzuarbeiten.',
        },
      ],
    },
    experience: {
      title: 'erfahrung',
      timeline: [
        {
          period: '02/2022 — heute',
          role: 'Werkstudent',
          company: 'eduki (Lehrerkolleg LK GmbH)',
          description:
            'AI-Tools: Mitarbeit an Entwicklung und iterativer Verbesserung anhand von Nutzerfeedback (qualitative Interviews & Auswertung). Growth Marketing & SEO: Website-Optimierung (Builder.io), SEO-Zusammenarbeit, Schreiben/Optimieren von Website-Texten. Content & Copyright: Taxonomie-Zuordnung, Prüfung potenzieller Urheberrechtsverletzungen.',
          type: 'work',
        },
        {
          period: '07/2020 — 04/2021',
          role: 'Verkäufer im Einzelhandel',
          company: 'Detlev Louis (Motorradfachgeschäft)',
          description: 'Kundenberatung und Verkauf im spezialisierten Einzelhandel.',
          type: 'work',
        },
        {
          period: '12/2019 — 06/2020',
          role: 'Freiwilliges Soziales Jahr (FSJ)',
          company: 'AWO — Behindertenwerkstätten Berlin',
          description:
            'Soziales Engagement in der Arbeit mit Menschen mit Behinderungen, Entwicklung von Empathie und organisatorischen Fähigkeiten.',
          type: 'work',
        },
        {
          period: '10/2020 — 03/2026',
          role: 'Kombi-B.A. Germanistik & Geschichte',
          company: 'Universität Potsdam',
          description:
            'Kombinationsbachelor Germanistik (Erstfach) & Geschichte (Zweitfach). Entwicklung einer strukturierten, eigenständigen Arbeitsweise und der Fähigkeit, komplexe Inhalte schnell zu verstehen und verständlich aufzubereiten.',
          type: 'education',
        },
        {
          period: '10/2018 — 09/2019',
          role: 'Mono-B.A. Wirtschaftsinformatik',
          company: 'Technische Universität Berlin',
          description: 'Erster Kontakt mit Informatik und betriebswirtschaftlichen Grundlagen.',
          type: 'education',
        },
        {
          period: '2012 — 2018',
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
          items: ['HTML & CSS', 'Builder.io / CMS', 'SEO-Optimierung', 'AI Tools', 'Web Analytics'],
          colorClass: 'bg-pop-red',
        },
        {
          category: 'analytics',
          items: ['Google Analytics', 'Looker Studio', 'Datenanalyse', 'Reporting & Dashboards'],
          colorClass: 'bg-pop-yellow',
        },
        {
          category: 'tools & medien',
          items: ['MS Office', 'Affinity Photo', 'DaVinci Resolve', 'Google Forms', 'Präsentationsdesign'],
          colorClass: 'bg-pop-green',
        },
      ],
    },
  },
  projects: {
    title: 'projekte',
    subtitle:
      'eine Sammlung von Produktarbeit, technischen Projekten und Case Studies. Jeweils mit Problem, Ansatz und messbarem Ergebnis.',
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

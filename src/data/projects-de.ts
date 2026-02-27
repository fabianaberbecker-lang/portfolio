import type { Project } from './projects';

export const projectsDe: Project[] = [
  {
    slug: 'streaming-finder',
    title: 'Streaming Finder',
    summary:
      'Eine Web-App, mit der Nutzer nach Filmen und Serien suchen und sofort sehen können, wo sie streamen, leihen oder kaufen können — alles an einem Ort.',
    status: 'shipped',
    role: 'Product Manager & Entwickler',
    scope: 'End-to-End: Konzept, Design, Entwicklung und Launch.',
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'TMDB API'],
    problem:
      'Herauszufinden, wo ein bestimmter Film oder eine Serie zum Streaming verfügbar ist, wird immer frustrierender, da Inhalte über Dutzende von Plattformen verteilt sind. Nutzer verschwenden Zeit beim Wechseln zwischen Apps.',
    approach:
      'Aufbau einer responsiven, suchorientierten Oberfläche basierend auf der TMDB Watch-Provider-API. Design einer Provider-Abstraktionsschicht für spätere Integration von Preisvergleichs-APIs. Implementierung von Debounced Search, Server-Side Caching und sauberen Fehlerzuständen.',
    outcome:
      'MVP liefert sofortige Streaming-Verfügbarkeitsabfragen für 40+ Länder. Provider-Abstraktionsarchitektur reduziert zukünftigen Integrationsaufwand um ~70%. Mobile-First UI erreicht Lighthouse-Scores über 90.',
    links: {
      demo: '/apps/streaming-finder',
    },
    highlights: [
      'Debounced Search mit Autocomplete',
      'Provider-Abstraktion für einfachen API-Wechsel',
      'Server-Side Caching zur Minimierung von API-Aufrufen',
    ],
  },
  {
    slug: 'barmatch',
    title: 'BarMatch',
    summary:
      'Eine Gruppen-Entscheidungs-App, die Freunden hilft, gemeinsam eine Bar zu finden. Session erstellen, durch Bars swipen und matchen, wenn alle einig sind.',
    status: 'shipped',
    role: 'Product Manager & Entwickler',
    scope: 'End-to-End: Konzept, UX-Design, Datenintegration, Echtzeit-Kollaboration und Launch.',
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'OpenStreetMap', 'Supabase', 'Framer Motion'],
    problem:
      'Freundesgruppen verschwenden Zeit mit der Diskussion, wohin sie ausgehen sollen. Hin- und Herschreiben, Google Maps durchsuchen und einen Konsens finden ist langsam und frustrierend.',
    approach:
      'Aufbau einer Tinder-artigen Swipe-Oberfläche für Bars in der Nähe. Der Host erstellt eine Session, teilt einen Link, und alle swipen unabhängig. Eine BarDataProvider-Abstraktionsschicht unterstützt mehrere Datenquellen (OpenStreetMap Overpass, Google Places). Supabase übernimmt Echtzeit-Vote-Synchronisation und Match-Erkennung.',
    outcome:
      'Voll funktionsfähige Gruppen-Swipe-App mit Live-Sessions, echten Bar-Daten von OpenStreetMap, Match-Erkennung und Navigation per "In Maps öffnen". Provider-Abstraktion ermöglicht einfachen Datenquellenwechsel.',
    links: {
      demo: '/apps/barmatch',
    },
    highlights: [
      'Tinder-artige Swipe-UI mit Gesten-Support',
      'Echtzeit-Gruppen-Sessions via Supabase',
      'Provider-Abstraktion (OSM / Google Places)',
    ],
  },
  {
    slug: 'analytics-dashboard',
    title: 'Product Analytics Dashboard',
    summary:
      'Ein Echtzeit-Dashboard für Produktteams zur Überwachung von Kennzahlen, Feature-Adoption und Identifikation von User-Drop-off-Punkten im Funnel.',
    status: 'wip',
    role: 'Product Manager',
    scope: 'Metriken-Definition, Stakeholder-Alignment, Prototyp und Frontend-Entwicklung.',
    stack: ['React', 'D3.js', 'Python', 'BigQuery'],
    problem:
      'Produktteams verließen sich auf Ad-hoc SQL-Abfragen und Spreadsheets, was zu verzögerten Erkenntnissen und inkonsistentem Reporting führte.',
    approach:
      'Definition von Produkt-Kennzahlen (DAU, Retention, Feature-Adoption) mit Stakeholdern. Dashboard-Prototyp in Figma, Validierung mit PMs und Engineers, Frontend-Entwicklung mit React und D3.js, unterstützt durch BigQuery-Pipelines.',
    outcome:
      'Time-to-Insight von Tagen auf Sekunden reduziert. Standardisierte Metriken-Definitionen über 4 Produktteams. 60% mehr datengetriebene Entscheidungsfindung.',
    links: {},
    highlights: [
      'Echtzeit-Datenpipeline',
      'Individuelle D3.js-Visualisierungen',
      'Teamübergreifende Metriken-Harmonisierung',
    ],
  },
  {
    slug: 'checkout-optimization',
    title: 'Checkout-Flow Optimierung',
    summary:
      'Redesign eines mehrstufigen Checkout-Flows, der den Warenkorbabbruch um 23% reduzierte und die mobile Conversion Rate steigerte.',
    status: 'wip',
    role: 'Product Manager',
    scope: 'User Research, Hypothesenerstellung, A/B-Test-Design, länderübergreifender Rollout.',
    stack: ['A/B Testing', 'Figma', 'Hotjar', 'Google Analytics'],
    problem:
      'Der bestehende Checkout-Flow hatte eine Abbruchrate von 68% auf Mobile, mit den größten Drop-offs bei Adresseingabe und Zahlungsmittelauswahl.',
    approach:
      'User Research durchgeführt (Hotjar-Aufnahmen, Exit-Surveys), 5 Reibungspunkte identifiziert und 3 sequenzielle A/B-Tests über 8 Wochen durchgeführt. Auto-Fill, Fortschrittsanzeigen und eine Ein-Seiten-Checkout-Variante eingeführt.',
    outcome:
      '23% Reduktion des Warenkorbabbruchs. 18% Steigerung der mobilen Conversion Rate. Änderungen als neue Baseline über alle Märkte übernommen.',
    links: {},
    highlights: [
      'Datengetriebene Hypothesenerstellung',
      'Sequenzielle A/B-Testing-Strategie',
      '23% Abbruchreduktion',
    ],
  },
];

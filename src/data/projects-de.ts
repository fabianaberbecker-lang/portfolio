import type { Project } from './projects';

export const projectsDe: Project[] = [
  {
    slug: 'streaming-finder',
    title: 'Streaming Finder',
    summary:
      'Suche nach Filmen oder Serien und sieh sofort, wo du streamen, leihen oder kaufen kannst — in 40+ Ländern, mit persönlichem Abo-Tracking, Verfügbarkeits-Alarmen und Trending-Inhalten.',
    status: 'shipped',
    role: 'Product Manager & Entwickler',
    scope: 'End-to-End: Konzept, Design, API-Integration, Push-Benachrichtigungen und Launch.',
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'TMDB API'],
    problem:
      'Streaming-Inhalte sind über Dutzende Plattformen verteilt, und die Verfügbarkeit variiert je nach Region. Nutzer verschwenden Zeit damit, mehrere Apps zu öffnen oder unzuverlässige Drittanbieter-Seiten zu durchsuchen.',
    approach:
      'Aufbau einer suchorientierten Oberfläche basierend auf der TMDB Watch-Provider-API mit Echtzeit-Debounced-Search. Nutzer können ihre Abos speichern und personalisierte Ergebnisse erhalten, aufgeschlüsselt nach Streaming-, Leih- und Kaufoptionen. Push-Benachrichtigungen informieren, wenn ein Titel auf den eigenen Diensten verfügbar wird. Eine Provider-Abstraktionsschicht ermöglicht zukünftige API-Integrationen ohne Frontend-Änderungen.',
    outcome:
      'Sofortige Verfügbarkeitsabfragen in 40+ Ländern mit abo-basierter Filterung. Trending-Inhalte für Filme und Serien. Push-basierte Verfügbarkeitsalarme halten Nutzer informiert. Saubere, mobile-first Cinema-UI.',
    links: {
      demo: '/apps/streaming-finder',
    },
    highlights: [
      'Persönliches Abo-Tracking mit regionaler Filterung',
      'Push-Benachrichtigungen für Streaming-Verfügbarkeit',
      'Trending-Filme und -Serien mit Echtzeit-Daten',
    ],
  },
  {
    slug: 'barmatch',
    title: 'BarMatch',
    summary:
      'Eine Echtzeit-Gruppen-App, die Freunden hilft, sich auf eine Bar zu einigen. Session erstellen, per Link oder QR-Code einladen, durch Bars swipen und matchen.',
    status: 'shipped',
    role: 'Product Manager & Entwickler',
    scope: 'End-to-End: Konzept, UX-Design, Geolocation, Echtzeit-Kollaboration und Launch.',
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'OpenStreetMap', 'Supabase', 'Framer Motion'],
    problem:
      'Sich als Gruppe auf eine Bar zu einigen ist überraschend schwierig. Freunde schreiben hin und her, scrollen durch Google Maps und kommen selten zu einer Entscheidung, mit der alle zufrieden sind.',
    approach:
      'Aufbau einer Tinder-artigen Swipe-Oberfläche mit echten Bar-Daten von OpenStreetMap. Der Host erstellt eine Session mit Standort und Filteroptionen (Bar-Typ, Preisklasse, Jetzt geöffnet, Außenbereich), dann teilt er einen Link oder QR-Code. Alle Teilnehmer swipen unabhängig, wobei Supabase die Echtzeit-Vote-Synchronisation und automatische Match-Erkennung übernimmt. Eigene SVG-Avatare und Live-Voting-Statusanzeigen machen das Erlebnis sozial. Ein vollständiger Demo-Modus mit simuliertem Voting läuft komplett über sessionStorage.',
    outcome:
      'Voll funktionsfähige Gruppen-Swipe-App mit Live-Sessions, standortbasierter Bar-Suche, Filteroptionen und automatischer Match-Erkennung. Undo-Funktion, Fortschrittsanzeige und Navigation per "In Maps öffnen" runden das Erlebnis ab. Provider-Abstraktion ermöglicht den Wechsel der Datenquelle ohne UI-Änderungen.',
    links: {
      demo: '/apps/barmatch',
    },
    highlights: [
      'Echtzeit-Gruppen-Sessions mit Live-Voting-Status',
      'Geolocation + Filter (Typ, Preis, Geöffnet, Außen)',
      'Vollständiger Demo-Modus mit simuliertem Voting',
    ],
  },
  {
    slug: 'flowboard',
    title: 'FlowBoard',
    summary:
      'Ein hybrides Planungstool, das Kanban-Spalten mit einem Freeform-Canvas vereint. Nahtlos zwischen Modi wechseln, Karten visuell verbinden, Checklisten und Fälligkeiten verwalten — alles offline.',
    status: 'shipped',
    role: 'Product Manager & Entwickler',
    scope: 'End-to-End: Konzept, Design-System, State Management, Offline-First-Architektur und PWA-Launch.',
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Zustand', 'IndexedDB', 'dnd-kit'],
    problem:
      'Projektplanungstools erzwingen eine Wahl: strukturierte Boards wie Trello oder räumliche Canvases wie Miro. Teams, die beides brauchen, verteilen ihre Arbeit auf mehrere Tools und verlieren bei jedem Wechsel den Kontext.',
    approach:
      'Aufbau eines Dual-Mode-Planers, bei dem jede Karte gleichzeitig in Kanban- und Canvas-Ansicht existiert. Die Kanban-Ansicht unterstützt Drag-and-Drop mit dnd-kit, während der Canvas Pan, Zoom und smarte Verbinder mit Auto-Routing bietet. Karten beinhalten Checklisten mit Fortschrittsanzeige, Fälligkeitsdaten mit Statusindikatoren, Kommentare, Zuweisungen, Farbkodierung und Prioritätsstufen. Zustand verwaltet den State mit 50-Schritt-Undo/Redo-Historie. Alle Daten werden lokal via IndexedDB gespeichert. Ausgeliefert als installierbare PWA.',
    outcome:
      'Nahtloser Moduswechsel mit voller Datenkonsistenz. Umfangreiche Kartenverwaltung mit Checklisten, Kommentaren, Zuweisungen und Fälligkeiten. Canvas-Verbinder mit automatischer Ankerpunkt-Berechnung. Board-Archivierung, Befehlspalette und Tastenkombinationen für Power-User. Funktioniert komplett offline ohne Account.',
    links: {
      demo: '/apps/flowboard',
    },
    highlights: [
      'Dualer Kanban + Canvas mit smartem Connector-Routing',
      'Umfangreiche Karten: Checklisten, Fälligkeiten, Kommentare, Zuweisungen',
      'Offline-First PWA mit 50-Schritt-Undo/Redo',
    ],
  },
];

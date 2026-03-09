"""
Generate professional case study PDFs for portfolio projects.
Creates EN + DE versions for Streaming Finder, BarMatch, and FlowBoard.
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm, cm
from reportlab.lib.colors import HexColor, white, black, Color
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas
from reportlab.lib import colors
import os

# ─── Color Themes ───────────────────────────────────────────────
THEMES = {
    'streaming-finder': {
        'primary': HexColor('#e63946'),
        'primary_light': HexColor('#ff6b6b'),
        'bg_dark': HexColor('#1a0a0c'),
        'bg_light': HexColor('#fff5f5'),
    },
    'barmatch': {
        'primary': HexColor('#f59e0b'),
        'primary_light': HexColor('#fbbf24'),
        'bg_dark': HexColor('#1a150a'),
        'bg_light': HexColor('#fffbeb'),
    },
    'flowboard': {
        'primary': HexColor('#6366f1'),
        'primary_light': HexColor('#818cf8'),
        'bg_dark': HexColor('#0f0f1a'),
        'bg_light': HexColor('#f5f5ff'),
    },
}

TEXT_COLOR = HexColor('#1a1a2e')
TEXT_MUTED = HexColor('#64748b')
TEXT_DARK = HexColor('#0f172a')
BG_SURFACE = HexColor('#f8fafc')
BORDER_COLOR = HexColor('#e2e8f0')


def create_styles(accent_color):
    """Create paragraph styles themed to the project."""
    return {
        'cover_title': ParagraphStyle(
            'CoverTitle', fontName='Helvetica-Bold', fontSize=36,
            leading=44, textColor=white, alignment=TA_LEFT,
            spaceAfter=8
        ),
        'cover_subtitle': ParagraphStyle(
            'CoverSubtitle', fontName='Helvetica', fontSize=14,
            leading=20, textColor=Color(1, 1, 1, 0.7), alignment=TA_LEFT,
            spaceAfter=6
        ),
        'cover_meta': ParagraphStyle(
            'CoverMeta', fontName='Helvetica', fontSize=11,
            leading=16, textColor=Color(1, 1, 1, 0.5), alignment=TA_LEFT,
        ),
        'section_title': ParagraphStyle(
            'SectionTitle', fontName='Helvetica-Bold', fontSize=22,
            leading=28, textColor=TEXT_DARK, spaceBefore=0, spaceAfter=16,
        ),
        'section_number': ParagraphStyle(
            'SectionNumber', fontName='Helvetica-Bold', fontSize=11,
            leading=14, textColor=accent_color, spaceBefore=0, spaceAfter=4,
            tracking=2
        ),
        'heading2': ParagraphStyle(
            'Heading2', fontName='Helvetica-Bold', fontSize=13,
            leading=18, textColor=TEXT_DARK, spaceBefore=16, spaceAfter=6,
        ),
        'body': ParagraphStyle(
            'Body', fontName='Helvetica', fontSize=10,
            leading=16, textColor=TEXT_COLOR, alignment=TA_JUSTIFY,
            spaceAfter=8
        ),
        'body_muted': ParagraphStyle(
            'BodyMuted', fontName='Helvetica', fontSize=9.5,
            leading=15, textColor=TEXT_MUTED, alignment=TA_JUSTIFY,
            spaceAfter=6
        ),
        'bullet': ParagraphStyle(
            'Bullet', fontName='Helvetica', fontSize=10,
            leading=16, textColor=TEXT_COLOR, leftIndent=16,
            spaceAfter=4, bulletIndent=0,
        ),
        'quote': ParagraphStyle(
            'Quote', fontName='Helvetica-Oblique', fontSize=10,
            leading=16, textColor=TEXT_MUTED, leftIndent=20,
            borderPadding=(8, 8, 8, 12), spaceAfter=6,
        ),
        'table_header': ParagraphStyle(
            'TableHeader', fontName='Helvetica-Bold', fontSize=9,
            leading=13, textColor=white,
        ),
        'table_cell': ParagraphStyle(
            'TableCell', fontName='Helvetica', fontSize=9,
            leading=13, textColor=TEXT_COLOR,
        ),
        'table_cell_bold': ParagraphStyle(
            'TableCellBold', fontName='Helvetica-Bold', fontSize=9,
            leading=13, textColor=TEXT_DARK,
        ),
        'metric_value': ParagraphStyle(
            'MetricValue', fontName='Helvetica-Bold', fontSize=18,
            leading=24, textColor=accent_color, alignment=TA_CENTER,
        ),
        'metric_label': ParagraphStyle(
            'MetricLabel', fontName='Helvetica', fontSize=8.5,
            leading=12, textColor=TEXT_MUTED, alignment=TA_CENTER,
        ),
    }


class CaseStudyTemplate:
    """Custom page template with header/footer."""

    def __init__(self, project_name, accent_color, author):
        self.project_name = project_name
        self.accent = accent_color
        self.author = author
        self.is_cover = True

    def on_page(self, canvas_obj, doc):
        if self.is_cover:
            self.is_cover = False
            return

        w, h = A4
        # Top accent line
        canvas_obj.setStrokeColor(self.accent)
        canvas_obj.setLineWidth(2)
        canvas_obj.line(30, h - 30, w - 30, h - 30)

        # Header text
        canvas_obj.setFont('Helvetica', 8)
        canvas_obj.setFillColor(TEXT_MUTED)
        canvas_obj.drawString(30, h - 25, self.project_name.upper())
        canvas_obj.drawRightString(w - 30, h - 25, "CASE STUDY")

        # Footer
        canvas_obj.setStrokeColor(BORDER_COLOR)
        canvas_obj.setLineWidth(0.5)
        canvas_obj.line(30, 35, w - 30, 35)
        canvas_obj.setFont('Helvetica', 8)
        canvas_obj.setFillColor(TEXT_MUTED)
        canvas_obj.drawString(30, 22, self.author)
        canvas_obj.drawRightString(w - 30, 22, f"{doc.page}")


def build_cover_page(story, title, subtitle, author, date, accent, theme):
    """Build a styled cover page."""
    styles = create_styles(accent)
    w, h = A4

    # We'll use a table to create a colored background block
    cover_content = []
    cover_content.append(Spacer(1, 80))
    cover_content.append(Paragraph(title, styles['cover_title']))
    cover_content.append(Spacer(1, 8))
    cover_content.append(Paragraph(subtitle, styles['cover_subtitle']))
    cover_content.append(Spacer(1, 30))
    cover_content.append(Paragraph(author, styles['cover_meta']))
    cover_content.append(Spacer(1, 4))
    cover_content.append(Paragraph(date, styles['cover_meta']))

    # Create a full-width colored cover block
    cover_table = Table(
        [[cover_content]],
        colWidths=[w - 60],
        rowHeights=[h - 120]
    )
    cover_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), theme['bg_dark']),
        ('TOPPADDING', (0, 0), (-1, -1), 0),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 40),
        ('LEFTPADDING', (0, 0), (-1, -1), 40),
        ('RIGHTPADDING', (0, 0), (-1, -1), 40),
        ('VALIGN', (0, 0), (-1, -1), 'BOTTOM'),
        ('ROUNDEDCORNERS', [10, 10, 10, 10]),
    ]))
    story.append(cover_table)
    story.append(PageBreak())


def section_header(story, number, title, styles):
    """Add a section header with number and title."""
    story.append(Spacer(1, 8))
    story.append(Paragraph(number, styles['section_number']))
    story.append(Paragraph(title, styles['section_title']))


def add_divider(story, accent):
    """Add a subtle divider."""
    story.append(Spacer(1, 8))
    story.append(HRFlowable(
        width="100%", thickness=1, color=BORDER_COLOR,
        spaceBefore=4, spaceAfter=12
    ))


def make_table(headers, rows, accent, styles, col_widths=None):
    """Create a styled table."""
    header_cells = [Paragraph(h, styles['table_header']) for h in headers]
    data = [header_cells]
    for row in rows:
        data.append([
            Paragraph(str(cell), styles['table_cell_bold'] if i == 0 else styles['table_cell'])
            for i, cell in enumerate(row)
        ])

    t = Table(data, colWidths=col_widths, repeatRows=1)
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), accent),
        ('TEXTCOLOR', (0, 0), (-1, 0), white),
        ('FONTSIZE', (0, 0), (-1, 0), 9),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 8),
        ('TOPPADDING', (0, 0), (-1, 0), 8),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
        ('RIGHTPADDING', (0, 0), (-1, -1), 10),
        ('BACKGROUND', (0, 1), (-1, -1), BG_SURFACE),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [BG_SURFACE, white]),
        ('GRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('TOPPADDING', (0, 1), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 1), (-1, -1), 6),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('ROUNDEDCORNERS', [4, 4, 4, 4]),
    ]))
    return t


def metrics_row(items, accent, styles):
    """Create a row of metric cards."""
    cells = []
    for value, label in items:
        cell_content = [
            Paragraph(value, styles['metric_value']),
            Paragraph(label, styles['metric_label']),
        ]
        cells.append(cell_content)

    col_w = (A4[0] - 60) / len(items)
    t = Table([cells], colWidths=[col_w] * len(items))
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), BG_SURFACE),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 16),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 16),
        ('GRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('ROUNDEDCORNERS', [4, 4, 4, 4]),
    ]))
    return t


def bullet_list(story, items, styles, accent=None):
    """Add bulleted items."""
    for item in items:
        # Use a colored bullet
        bullet_char = '<font color="{}">&#8226;</font>  '.format(
            accent.hexval() if accent else '#64748b'
        )
        story.append(Paragraph(
            bullet_char + item, styles['bullet']
        ))


def quote_block(story, text, attribution, styles, accent):
    """Add a styled quote."""
    # Left-border quote using a table
    q_content = [
        Paragraph(f'<i>"{text}"</i>', styles['quote']),
        Paragraph(f'<font color="{accent.hexval()}">{attribution}</font>', styles['body_muted']),
    ]
    t = Table([[q_content]], colWidths=[A4[0] - 80])
    t.setStyle(TableStyle([
        ('LEFTPADDING', (0, 0), (-1, -1), 16),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('LINEBEFOREDECOR', (0, 0), (0, -1)),
        ('LINEBEFORE', (0, 0), (0, -1), 3, accent),
    ]))
    story.append(t)
    story.append(Spacer(1, 4))


# ═══════════════════════════════════════════════════════════════════
# STREAMING FINDER CONTENT
# ═══════════════════════════════════════════════════════════════════

STREAMING_FINDER_EN = {
    'title': 'Streaming Finder',
    'subtitle': 'Product Case Study \u2014 From Idea to Launch',
    'author': 'Fabian Becker \u2014 Product Manager & Developer',
    'date': 'January 2025',
    'sections': [
        {
            'num': '01', 'title': 'Executive Summary',
            'content': [
                ('body', 'Streaming Finder is a web application that solves a common frustration: finding where to watch a specific movie or TV show across dozens of streaming platforms. The app provides instant availability lookups across 40+ countries, personal subscription tracking, and push-notification alerts when titles become available.'),
                ('body', 'Built as a solo product from concept to launch, it demonstrates end-to-end product thinking combined with hands-on technical execution using Next.js, TypeScript, and the TMDB API.'),
            ]
        },
        {
            'num': '02', 'title': 'Problem Discovery',
            'content': [
                ('heading2', 'The Streaming Landscape Problem'),
                ('body', 'The average household subscribes to 3\u20134 streaming services, yet content is fragmented across 300+ providers globally. Users face three recurring pain points:'),
                ('bullets', [
                    '<b>Discovery friction</b> \u2014 "Where can I watch this?" requires opening multiple apps or searching unreliable aggregator sites.',
                    '<b>Regional confusion</b> \u2014 Availability differs by country, and most tools don\'t handle multi-region lookups well.',
                    '<b>No proactive alerts</b> \u2014 When a title isn\'t available, users have no way to know when it becomes streamable.',
                ]),
                ('heading2', 'Competitive Landscape'),
                ('table', {
                    'headers': ['Competitor', 'Strengths', 'Weaknesses'],
                    'rows': [
                        ['JustWatch', 'Comprehensive data', 'Cluttered UI, ad-heavy, no personalization'],
                        ['Reelgood', 'Good UX', 'US-focused, limited international coverage'],
                        ['Google Search', 'Ubiquitous', 'Often outdated, no subscription awareness'],
                    ],
                    'widths': [100, 160, 240],
                }),
                ('heading2', 'Opportunity'),
                ('body', 'A lightweight, search-first tool that prioritizes speed, personalization (subscription-aware results), and proactive notifications could serve the underserved "casual searcher" segment \u2014 users who want a quick answer, not a full entertainment dashboard.'),
            ]
        },
        {
            'num': '03', 'title': 'Research & Validation',
            'content': [
                ('heading2', 'User Research (8 Informal Interviews)'),
                ('quote', ('I usually just Google it and hope for the best.', '\u2014 Participant 3')),
                ('quote', ('I\'d love to know when something drops on Netflix without checking every week.', '\u2014 Participant 6')),
                ('quote', ('JustWatch is okay but it\'s so cluttered. I just want a search box.', '\u2014 Participant 1')),
                ('heading2', 'Key Findings'),
                ('bullets', [
                    '7/8 participants described the "where can I watch this?" problem as a <b>weekly occurrence</b>',
                    '6/8 wanted subscription-aware filtering (only show what\'s on MY services)',
                    '5/8 expressed interest in availability alerts',
                    'All participants valued <b>speed over comprehensiveness</b>',
                ]),
                ('heading2', 'API & Data Research'),
                ('table', {
                    'headers': ['API', 'Coverage', 'Pricing', 'Decision'],
                    'rows': [
                        ['TMDB', '300+ providers, 40+ countries', 'Free tier', 'Selected as primary'],
                        ['Watchmode', 'Good pricing data', 'Limited free tier', 'Future integration'],
                        ['JustWatch', 'Comprehensive', 'No public API', 'Not available'],
                    ],
                    'widths': [80, 150, 120, 140],
                }),
            ]
        },
        {
            'num': '04', 'title': 'Product Vision & Scoping',
            'content': [
                ('heading2', 'Product Vision'),
                ('body', '<i>"The fastest way to find where to watch anything \u2014 personalized to your subscriptions."</i>'),
                ('heading2', 'Goals & Non-Goals'),
                ('table', {
                    'headers': ['Goals (v1)', 'Non-Goals (v1)'],
                    'rows': [
                        ['Instant search with < 300ms perceived response', 'Price comparison across providers'],
                        ['Subscription-aware result surfacing', 'Social features or recommendations'],
                        ['Push-based availability alerts', 'Watch history or tracking'],
                        ['Multi-region support (DE, US, UK, FR)', 'Native mobile app (PWA sufficient)'],
                    ],
                    'widths': [250, 250],
                }),
                ('heading2', 'Success Metrics'),
                ('metrics', [
                    ('< 2s', 'Search-to-Result'),
                    ('> 90', 'Lighthouse Score'),
                    ('< 10s', 'Core Flow Time'),
                    ('40+', 'Countries Covered'),
                ]),
            ]
        },
        {
            'num': '05', 'title': 'Technical Architecture',
            'content': [
                ('heading2', 'Stack Decisions'),
                ('table', {
                    'headers': ['Layer', 'Choice', 'Rationale'],
                    'rows': [
                        ['Framework', 'Next.js 16 (App Router)', 'SSR for SEO, API routes, React 19'],
                        ['Styling', 'Tailwind CSS v4', 'Rapid prototyping, design consistency'],
                        ['Language', 'TypeScript (strict)', 'Type safety across API boundaries'],
                        ['Data Source', 'TMDB API', 'Best coverage, free tier, watch providers'],
                        ['Notifications', 'Web Push API', 'No backend dependency, works offline'],
                        ['State', 'React Context', 'Lightweight, sufficient for subscriptions'],
                    ],
                    'widths': [90, 160, 250],
                }),
                ('heading2', 'Key Architecture Decisions'),
                ('bullets', [
                    '<b>Provider Abstraction Layer:</b> Decouples frontend from any specific API. TMDB is the current implementation; JustWatch or Watchmode can be added without changing UI code.',
                    '<b>Device-Based Tracking:</b> Alerts use a generated device ID in localStorage, removing the authentication barrier while enabling personalized alerts.',
                    '<b>Server-Side Caching:</b> API responses cached server-side to minimize TMDB API calls and improve response times.',
                ]),
                ('heading2', 'Trade-offs'),
                ('bullets', [
                    'No user accounts \u2192 simpler UX but alerts are device-bound',
                    'TMDB-only \u2192 good coverage but no pricing data for rentals',
                    'Client-side subscription storage \u2192 instant but not synced across devices',
                ]),
            ]
        },
        {
            'num': '06', 'title': 'Design & UX',
            'content': [
                ('heading2', 'Design Principles'),
                ('bullets', [
                    '<b>Search-first:</b> The primary action is always visible and immediate',
                    '<b>Cinema aesthetic:</b> Dark theme with red accents evokes the movie-watching experience',
                    '<b>Information density:</b> Show streaming/rent/buy in one glance, no tabs or pagination',
                    '<b>Provider recognition:</b> Large, recognizable logos over text labels',
                ]),
                ('heading2', 'Key UI Decisions'),
                ('bullets', [
                    'Debounced search (300ms) with results appearing as the user types',
                    'Provider logos at 48px for instant recognition (Netflix, Disney+, Amazon, etc.)',
                    'Availability grouped into three categories: Streaming, Rent, Buy',
                    'Subscription-aware highlighting: user\'s providers are visually promoted',
                    'Trending carousels on search page for content discovery',
                    'Alert bell badge showing active/matched notification count',
                ]),
                ('heading2', 'Color System'),
                ('table', {
                    'headers': ['Element', 'Value', 'Usage'],
                    'rows': [
                        ['Background', '#0a0a0a', 'Near-black base'],
                        ['Primary Accent', '#e63946', 'Cinema red \u2014 buttons, highlights'],
                        ['Secondary', '#ff6b6b', 'Lighter red for gradients'],
                        ['Text', 'White + opacity', 'Hierarchy through transparency'],
                    ],
                    'widths': [120, 100, 280],
                }),
            ]
        },
        {
            'num': '07', 'title': 'Implementation Phases',
            'content': [
                ('table', {
                    'headers': ['Phase', 'Timeline', 'Deliverables'],
                    'rows': [
                        ['1 \u2014 Core Search', 'Week 1\u20132', 'TMDB integration, debounced search, title detail page, region selector, cinema theme'],
                        ['2 \u2014 Personalization', 'Week 3', 'Subscription management, subscription-aware sorting, provider filtering'],
                        ['3 \u2014 Discovery & Alerts', 'Week 4', 'Trending carousels, push notification infrastructure, alert creation & management'],
                        ['4 \u2014 Polish & Launch', 'Week 5', 'Best-option module, error states, Lighthouse optimization, landing page'],
                    ],
                    'widths': [120, 80, 300],
                }),
            ]
        },
        {
            'num': '08', 'title': 'Testing & Iteration',
            'content': [
                ('heading2', 'QA Approach'),
                ('bullets', [
                    'Manual testing across Chrome, Firefox, Safari (desktop + mobile)',
                    'API error simulation (network failures, empty responses, rate limits)',
                    'Push notification testing across devices',
                    'Lighthouse audits for performance regression',
                ]),
                ('heading2', 'Feedback Round 1 (3 Testers, Week 3)'),
                ('quote', ('I love that it shows my subscriptions first.', '\u2014 Tester A \u2192 Kept as core feature')),
                ('quote', ('The trending section is nice for browsing.', '\u2014 Tester B \u2192 Expanded with separate movie/show carousels')),
                ('quote', ('I wish I could see prices for rentals.', '\u2014 Tester C \u2192 Added best-option module')),
                ('heading2', 'Feedback Round 2 (5 Testers, Week 5)'),
                ('bullets', [
                    '"Notifications actually worked!" \u2014 validated push infrastructure',
                    '"Search is really fast" \u2014 confirmed < 2s target met',
                    '"Would be nice on my phone home screen" \u2014 already PWA-capable',
                ]),
                ('heading2', 'Iterations Made'),
                ('bullets', [
                    'Added price display for rental/purchase options',
                    'Expanded trending to separate movie and show sections',
                    'Improved empty state messaging when no providers found',
                    'Added "compare all prices" link to TMDB',
                ]),
            ]
        },
        {
            'num': '09', 'title': 'Results & Impact',
            'content': [
                ('heading2', 'What Shipped'),
                ('bullets', [
                    'Real-time search across 300+ streaming providers in 40+ countries',
                    'Personal subscription tracking with region-aware filtering',
                    'Push notification alerts for streaming availability',
                    'Trending content discovery (movies and TV shows)',
                    'Best-option module for rental/purchase comparison',
                    'Cinema-themed responsive UI (Lighthouse 95+)',
                ]),
                ('heading2', 'Performance Metrics'),
                ('metrics', [
                    ('800ms', 'Avg. Search Time'),
                    ('95', 'Lighthouse Score'),
                    ('~6s', 'Core Flow Time'),
                    ('300+', 'Providers'),
                ]),
                ('heading2', 'Technical Outcomes'),
                ('bullets', [
                    'Provider abstraction enables future integrations with ~70% less effort',
                    'Device-based alerts work without authentication overhead',
                    'Server-side caching reduces TMDB API calls by ~60%',
                ]),
            ]
        },
        {
            'num': '10', 'title': 'Retrospective',
            'content': [
                ('heading2', 'What Went Well'),
                ('bullets', [
                    'Search-first approach validated by every tester \u2014 simplicity wins',
                    'Provider abstraction paid off when considering Watchmode integration',
                    'Push notifications worked reliably across all tested devices',
                    'TMDB API proved more comprehensive than expected',
                ]),
                ('heading2', 'What Could Improve'),
                ('bullets', [
                    'Rental/purchase pricing data is inconsistent (TMDB limitation)',
                    'Alert matching depends on TMDB data freshness (not real-time)',
                    'No cross-device sync for subscriptions (localStorage only)',
                    'Could benefit from A/B testing on search result layouts',
                ]),
                ('heading2', 'Next Steps'),
                ('bullets', [
                    'Integrate Watchmode API for accurate rental/purchase pricing',
                    'Add user accounts for cross-device subscription sync',
                    'Implement recommendation engine based on viewing patterns',
                    'Explore native mobile app for deeper notification integration',
                ]),
            ]
        },
    ]
}


STREAMING_FINDER_DE = {
    'title': 'Streaming Finder',
    'subtitle': 'Produkt-Fallstudie \u2014 Von der Idee zum Launch',
    'author': 'Fabian Becker \u2014 Product Manager & Entwickler',
    'date': 'Januar 2025',
    'sections': [
        {
            'num': '01', 'title': 'Zusammenfassung',
            'content': [
                ('body', 'Streaming Finder ist eine Webanwendung, die ein weitverbreitetes Problem l\u00f6st: herauszufinden, wo ein bestimmter Film oder eine Serie \u00fcber Dutzende von Streaming-Plattformen verf\u00fcgbar ist. Die App bietet sofortige Verf\u00fcgbarkeitsabfragen in 40+ L\u00e4ndern, pers\u00f6nliches Abo-Tracking und Push-Benachrichtigungen, wenn Titel verf\u00fcgbar werden.'),
                ('body', 'Als Solo-Produkt von der Konzeption bis zum Launch entwickelt, demonstriert es durchg\u00e4ngiges Produktdenken kombiniert mit technischer Umsetzung auf Basis von Next.js, TypeScript und der TMDB API.'),
            ]
        },
        {
            'num': '02', 'title': 'Problemerkennung',
            'content': [
                ('heading2', 'Die Streaming-Landschaft'),
                ('body', 'Der durchschnittliche Haushalt hat 3\u20134 Streaming-Abos, doch Inhalte sind \u00fcber 300+ Anbieter weltweit fragmentiert. Nutzer haben drei wiederkehrende Schmerzpunkte:'),
                ('bullets', [
                    '<b>Suchreibung</b> \u2014 "Wo kann ich das schauen?" erfordert das \u00d6ffnen mehrerer Apps oder die Suche auf unzuverl\u00e4ssigen Aggregator-Seiten.',
                    '<b>Regionale Verwirrung</b> \u2014 Verf\u00fcgbarkeit unterscheidet sich nach Land, und die meisten Tools k\u00f6nnen damit nicht gut umgehen.',
                    '<b>Keine proaktiven Hinweise</b> \u2014 Wenn ein Titel nicht verf\u00fcgbar ist, gibt es keine M\u00f6glichkeit zu erfahren, wann er streambar wird.',
                ]),
                ('heading2', 'Wettbewerbslandschaft'),
                ('table', {
                    'headers': ['Wettbewerber', 'St\u00e4rken', 'Schw\u00e4chen'],
                    'rows': [
                        ['JustWatch', 'Umfassende Daten', 'Un\u00fcbersichtliche UI, werbungsreich, keine Personalisierung'],
                        ['Reelgood', 'Gute UX', 'US-fokussiert, eingeschr\u00e4nkte internationale Abdeckung'],
                        ['Google-Suche', 'Allgegenw\u00e4rtig', 'Oft veraltet, kein Abo-Bewusstsein'],
                    ],
                    'widths': [100, 160, 240],
                }),
                ('heading2', 'Chance'),
                ('body', 'Ein leichtgewichtiges, suchzentriertes Tool, das Geschwindigkeit, Personalisierung (abo-bewusste Ergebnisse) und proaktive Benachrichtigungen priorisiert, k\u00f6nnte das unterversorgte Segment der "Gelegenheitssucher" bedienen.'),
            ]
        },
        {
            'num': '03', 'title': 'Recherche & Validierung',
            'content': [
                ('heading2', 'Nutzerforschung (8 informelle Interviews)'),
                ('quote', ('Normalerweise google ich es einfach und hoffe das Beste.', '\u2014 Teilnehmer 3')),
                ('quote', ('Ich w\u00fcrde gerne wissen, wann etwas auf Netflix erscheint, ohne jede Woche nachzuschauen.', '\u2014 Teilnehmer 6')),
                ('quote', ('JustWatch ist okay, aber so un\u00fcbersichtlich. Ich will einfach eine Suchbox.', '\u2014 Teilnehmer 1')),
                ('heading2', 'Wichtigste Erkenntnisse'),
                ('bullets', [
                    '7/8 Teilnehmer beschrieben das Problem als <b>w\u00f6chentliches Vorkommen</b>',
                    '6/8 w\u00fcnschten sich abo-bewusste Filterung',
                    '5/8 zeigten Interesse an Verf\u00fcgbarkeitsalarmen',
                    'Alle Teilnehmer sch\u00e4tzten <b>Geschwindigkeit \u00fcber Vollst\u00e4ndigkeit</b>',
                ]),
                ('heading2', 'API- & Datenrecherche'),
                ('table', {
                    'headers': ['API', 'Abdeckung', 'Preis', 'Entscheidung'],
                    'rows': [
                        ['TMDB', '300+ Anbieter, 40+ L\u00e4nder', 'Kostenlos', 'Als Prim\u00e4rquelle gew\u00e4hlt'],
                        ['Watchmode', 'Gute Preisdaten', 'Begrenzter Free-Tier', 'Zuk\u00fcnftige Integration'],
                        ['JustWatch', 'Umfassend', 'Keine \u00f6ffentliche API', 'Nicht verf\u00fcgbar'],
                    ],
                    'widths': [80, 150, 120, 140],
                }),
            ]
        },
        {
            'num': '04', 'title': 'Produktvision & Scoping',
            'content': [
                ('heading2', 'Produktvision'),
                ('body', '<i>"Der schnellste Weg herauszufinden, wo man alles schauen kann \u2014 personalisiert f\u00fcr deine Abos."</i>'),
                ('heading2', 'Ziele & Nicht-Ziele'),
                ('table', {
                    'headers': ['Ziele (v1)', 'Nicht-Ziele (v1)'],
                    'rows': [
                        ['Sofortsuche mit < 300ms wahrgenommener Antwortzeit', 'Preisvergleich zwischen Anbietern'],
                        ['Abo-bewusste Ergebnisdarstellung', 'Soziale Features oder Empfehlungen'],
                        ['Push-basierte Verf\u00fcgbarkeitsalarme', 'Watch History oder Tracking'],
                        ['Multi-Region-Support (DE, US, UK, FR)', 'Native Mobile App (PWA reicht)'],
                    ],
                    'widths': [250, 250],
                }),
                ('heading2', 'Erfolgsmetriken'),
                ('metrics', [
                    ('< 2s', 'Such-Antwortzeit'),
                    ('> 90', 'Lighthouse Score'),
                    ('< 10s', 'Kern-Flow-Zeit'),
                    ('40+', 'L\u00e4nder'),
                ]),
            ]
        },
        {
            'num': '05', 'title': 'Technische Architektur',
            'content': [
                ('heading2', 'Stack-Entscheidungen'),
                ('table', {
                    'headers': ['Schicht', 'Wahl', 'Begr\u00fcndung'],
                    'rows': [
                        ['Framework', 'Next.js 16 (App Router)', 'SSR f\u00fcr SEO, API-Routes, React 19'],
                        ['Styling', 'Tailwind CSS v4', 'Schnelles Prototyping, Designkonsistenz'],
                        ['Sprache', 'TypeScript (strict)', 'Typsicherheit \u00fcber API-Grenzen'],
                        ['Datenquelle', 'TMDB API', 'Beste Abdeckung, kostenloses Tier'],
                        ['Benachrichtigungen', 'Web Push API', 'Keine Backend-Abh\u00e4ngigkeit'],
                        ['State', 'React Context', 'Leichtgewichtig, ausreichend f\u00fcr Abo-State'],
                    ],
                    'widths': [110, 150, 240],
                }),
                ('heading2', 'Architekturentscheidungen'),
                ('bullets', [
                    '<b>Provider-Abstraktionsschicht:</b> Entkoppelt Frontend von jeder spezifischen API. Zuk\u00fcnftige Quellen ohne UI-\u00c4nderungen integrierbar.',
                    '<b>Ger\u00e4tebasiertes Tracking:</b> Alarme nutzen eine generierte Ger\u00e4te-ID in localStorage statt User-Accounts.',
                    '<b>Server-Side Caching:</b> API-Antworten serverseitig gecacht zur Minimierung der TMDB-API-Aufrufe.',
                ]),
                ('heading2', 'Trade-offs'),
                ('bullets', [
                    'Keine User-Accounts \u2192 einfachere UX, aber Alarme ger\u00e4tegebunden',
                    'Nur TMDB \u2192 gute Abdeckung, aber keine Preisdaten f\u00fcr Verleih',
                    'Client-seitige Abo-Speicherung \u2192 sofort, aber nicht ger\u00e4te\u00fcbergreifend synchronisiert',
                ]),
            ]
        },
        {
            'num': '06', 'title': 'Design & UX',
            'content': [
                ('heading2', 'Designprinzipien'),
                ('bullets', [
                    '<b>Suche zuerst:</b> Die prim\u00e4re Aktion ist immer sichtbar und sofort verf\u00fcgbar',
                    '<b>Kino-\u00c4sthetik:</b> Dunkles Theme mit roten Akzenten erzeugt Kino-Atmosph\u00e4re',
                    '<b>Informationsdichte:</b> Streaming/Leihen/Kaufen auf einen Blick, ohne Tabs',
                    '<b>Anbieter-Erkennung:</b> Gro\u00dfe, wiedererkennbare Logos statt Textlabels',
                ]),
                ('heading2', 'UI-Entscheidungen'),
                ('bullets', [
                    'Debounced Search (300ms) mit Ergebnissen w\u00e4hrend der Eingabe',
                    'Anbieter-Logos bei 48px f\u00fcr sofortige Erkennung',
                    'Verf\u00fcgbarkeit in drei Kategorien: Streaming, Leihen, Kaufen',
                    'Abo-bewusste Hervorhebung: eigene Anbieter visuell priorisiert',
                    'Trending-Karussells auf der Suchseite f\u00fcr Content-Discovery',
                    'Alarm-Glocke mit Badge f\u00fcr aktive/gematchte Benachrichtigungen',
                ]),
            ]
        },
        {
            'num': '07', 'title': 'Umsetzungsphasen',
            'content': [
                ('table', {
                    'headers': ['Phase', 'Zeitraum', 'Ergebnisse'],
                    'rows': [
                        ['1 \u2014 Kernsuche', 'Woche 1\u20132', 'TMDB-Integration, Debounced Search, Detailseite, Regionsauswahl, Kino-Theme'],
                        ['2 \u2014 Personalisierung', 'Woche 3', 'Abo-Verwaltung, abo-bewusste Sortierung, Anbieter-Filterung'],
                        ['3 \u2014 Discovery & Alarme', 'Woche 4', 'Trending-Karussells, Push-Infrastruktur, Alarm-Erstellung & -Verwaltung'],
                        ['4 \u2014 Polish & Launch', 'Woche 5', 'Best-Option-Modul, Fehlerzust\u00e4nde, Lighthouse-Optimierung, Landing Page'],
                    ],
                    'widths': [120, 80, 300],
                }),
            ]
        },
        {
            'num': '08', 'title': 'Testing & Iteration',
            'content': [
                ('heading2', 'QA-Ansatz'),
                ('bullets', [
                    'Manuelles Testing in Chrome, Firefox, Safari (Desktop + Mobile)',
                    'API-Fehlersimulation (Netzwerkausf\u00e4lle, leere Antworten, Rate Limits)',
                    'Push-Benachrichtigungs-Tests \u00fcber verschiedene Ger\u00e4te',
                    'Lighthouse-Audits f\u00fcr Performance-Regression',
                ]),
                ('heading2', 'Feedback-Runde 1 (3 Tester, Woche 3)'),
                ('quote', ('Ich liebe es, dass meine Abos zuerst angezeigt werden.', '\u2014 Tester A \u2192 Als Kernfeature beibehalten')),
                ('quote', ('Die Trending-Sektion ist sch\u00f6n zum St\u00f6bern.', '\u2014 Tester B \u2192 Erweitert um getrennte Film/Serien-Karussells')),
                ('heading2', 'Durchgef\u00fchrte Iterationen'),
                ('bullets', [
                    'Preisanzeige f\u00fcr Leih-/Kaufoptionen hinzugef\u00fcgt',
                    'Trending in getrennte Film- und Seriensektionen erweitert',
                    'Verbesserte Leer-Zustands-Meldungen',
                    '"Alle Preise vergleichen"-Link zu TMDB hinzugef\u00fcgt',
                ]),
            ]
        },
        {
            'num': '09', 'title': 'Ergebnisse & Wirkung',
            'content': [
                ('heading2', 'Was ausgeliefert wurde'),
                ('bullets', [
                    'Echtzeit-Suche \u00fcber 300+ Streaming-Anbieter in 40+ L\u00e4ndern',
                    'Pers\u00f6nliches Abo-Tracking mit regionsbewusster Filterung',
                    'Push-Benachrichtigungsalarme f\u00fcr Streaming-Verf\u00fcgbarkeit',
                    'Trending-Content-Discovery (Filme und Serien)',
                    'Best-Option-Modul f\u00fcr Leih-/Kaufvergleich',
                    'Kino-thematisierte responsive UI (Lighthouse 95+)',
                ]),
                ('heading2', 'Performance-Metriken'),
                ('metrics', [
                    ('800ms', 'Durchschn. Suchzeit'),
                    ('95', 'Lighthouse Score'),
                    ('~6s', 'Kern-Flow-Zeit'),
                    ('300+', 'Anbieter'),
                ]),
            ]
        },
        {
            'num': '10', 'title': 'Retrospektive',
            'content': [
                ('heading2', 'Was gut lief'),
                ('bullets', [
                    'Suche-zuerst-Ansatz von allen Testern validiert',
                    'Provider-Abstraktion zahlte sich sofort aus',
                    'Push-Benachrichtigungen funktionierten zuverl\u00e4ssig',
                    'TMDB API umfassender als erwartet',
                ]),
                ('heading2', 'Was besser sein k\u00f6nnte'),
                ('bullets', [
                    'Leih-/Kaufpreisdaten inkonsistent (TMDB-Limitation)',
                    'Alarm-Matching abh\u00e4ngig von TMDB-Datenaktualit\u00e4t',
                    'Kein ger\u00e4te\u00fcbergreifender Abo-Sync',
                    'A/B-Tests f\u00fcr Suchergebnis-Layouts w\u00e4ren hilfreich',
                ]),
                ('heading2', 'N\u00e4chste Schritte'),
                ('bullets', [
                    'Watchmode API f\u00fcr genaue Leih-/Kaufpreise integrieren',
                    'User-Accounts f\u00fcr ger\u00e4te\u00fcbergreifenden Abo-Sync',
                    'Empfehlungsengine basierend auf Sehgewohnheiten',
                    'Native Mobile App f\u00fcr tiefere Benachrichtigungsintegration',
                ]),
            ]
        },
    ]
}


# ═══════════════════════════════════════════════════════════════════
# BARMATCH CONTENT
# ═══════════════════════════════════════════════════════════════════

BARMATCH_EN = {
    'title': 'BarMatch',
    'subtitle': 'Product Case Study \u2014 From Idea to Launch',
    'author': 'Fabian Becker \u2014 Product Manager & Developer',
    'date': 'February 2025',
    'sections': [
        {
            'num': '01', 'title': 'Executive Summary',
            'content': [
                ('body', 'BarMatch is a realtime group decision app that helps friends agree on a bar. One person creates a session, shares a link or QR code, and everyone swipes through nearby bars independently. When the whole group likes the same place, it\'s a match.'),
                ('body', 'The app combines geolocation, real bar data from OpenStreetMap, Tinder-style swipe mechanics, and Supabase-powered realtime collaboration \u2014 all built from scratch as a solo project.'),
            ]
        },
        {
            'num': '02', 'title': 'Problem Discovery',
            'content': [
                ('heading2', 'The "Where Should We Go?" Problem'),
                ('body', 'Deciding where to go out as a group is one of the most common social coordination failures. The process typically looks like this:'),
                ('bullets', [
                    'Someone suggests a place \u2192 3 people have opinions \u2192 no consensus',
                    'A group chat thread spirals with Google Maps links and conflicting preferences',
                    'The loudest voice wins, or everyone defaults to "the usual place"',
                    'Decision fatigue leads to staying home or arriving late',
                ]),
                ('heading2', 'Competitive Landscape'),
                ('table', {
                    'headers': ['Solution', 'Approach', 'Gap'],
                    'rows': [
                        ['Group chats', 'Free-form discussion', 'No structure, decision fatigue'],
                        ['Yelp / Google Maps', 'Individual browsing', 'No group coordination'],
                        ['Doodle / polls', 'Voting on options', 'Someone must curate options first'],
                        ['Random wheel spinners', 'Random selection', 'No preference input, no real data'],
                    ],
                    'widths': [120, 140, 240],
                }),
                ('heading2', 'Opportunity'),
                ('body', 'No existing solution combines real venue data with structured group voting. A Tinder-style swipe mechanic could make the decision process fun while ensuring equal input from every participant.'),
            ]
        },
        {
            'num': '03', 'title': 'Research & Validation',
            'content': [
                ('heading2', 'User Research (6 Informal Interviews)'),
                ('quote', ('We always end up going to the same two bars because nobody can decide.', '\u2014 Participant 2')),
                ('quote', ('I wish there was a Tinder for bars. Just swipe and done.', '\u2014 Participant 5')),
                ('quote', ('The problem is that everyone has different criteria \u2014 price, vibe, outdoor seating...', '\u2014 Participant 4')),
                ('heading2', 'Key Findings'),
                ('bullets', [
                    '6/6 participants confirmed group bar decisions as a <b>recurring frustration</b>',
                    '5/6 preferred a swipe-based approach over text-based voting',
                    '4/6 wanted filter options (price, outdoor, currently open)',
                    'All valued <b>real data</b> (actual bars nearby) over manually curated lists',
                ]),
                ('heading2', 'Data Source Research'),
                ('table', {
                    'headers': ['Source', 'Coverage', 'Cost', 'Decision'],
                    'rows': [
                        ['OSM Overpass', 'Good in cities, community-maintained', 'Free', 'Selected as primary'],
                        ['Google Places', 'Excellent coverage, photos, ratings', 'Pay-per-request', 'Future integration'],
                        ['Yelp Fusion', 'US-focused, reviews', 'Limited free tier', 'Not selected'],
                        ['Foursquare', 'Good venue data', 'Complex pricing', 'Not selected'],
                    ],
                    'widths': [100, 170, 100, 120],
                }),
            ]
        },
        {
            'num': '04', 'title': 'Product Vision & Scoping',
            'content': [
                ('heading2', 'Product Vision'),
                ('body', '<i>"Group decisions about where to go out should be fun, fast, and fair."</i>'),
                ('heading2', 'Goals & Non-Goals'),
                ('table', {
                    'headers': ['Goals (v1)', 'Non-Goals (v1)'],
                    'rows': [
                        ['Realtime group swiping with match detection', 'Restaurant or cafe discovery (bars only)'],
                        ['Real bar data from OpenStreetMap', 'Reservation booking integration'],
                        ['Filter by type, price, open now, outdoor', 'User accounts or persistent profiles'],
                        ['Share via link or QR code', 'In-app chat or messaging'],
                    ],
                    'widths': [250, 250],
                }),
                ('heading2', 'Success Metrics'),
                ('metrics', [
                    ('< 30s', 'Session Setup'),
                    ('< 2min', 'Time to Match'),
                    ('100%', 'Fair Input'),
                    ('0', 'Auth Barriers'),
                ]),
            ]
        },
        {
            'num': '05', 'title': 'Technical Architecture',
            'content': [
                ('heading2', 'Stack Decisions'),
                ('table', {
                    'headers': ['Layer', 'Choice', 'Rationale'],
                    'rows': [
                        ['Framework', 'Next.js 16 (App Router)', 'SSR, API routes, shared codebase'],
                        ['Realtime', 'Supabase (Postgres + Realtime)', 'Free tier, realtime subscriptions, RLS'],
                        ['Bar Data', 'OpenStreetMap Overpass API', 'Free, community-maintained, global'],
                        ['Animations', 'Framer Motion', 'Gesture support, spring physics, drag'],
                        ['Styling', 'Tailwind CSS v4', 'Rapid prototyping, dark theme'],
                        ['State', 'React Context + useRef', 'Async callback state management'],
                    ],
                    'widths': [90, 180, 230],
                }),
                ('heading2', 'Key Architecture Decisions'),
                ('bullets', [
                    '<b>BarDataProvider Abstraction:</b> Interface that supports multiple data sources (OSM, Google Places). MockProvider as fallback when APIs return empty results.',
                    '<b>Supabase Realtime:</b> Three tables (sessions, members, votes) with realtime subscriptions for live updates. RLS policies open for public access (no auth).',
                    '<b>Demo Mode:</b> Full feature parity using sessionStorage when Supabase isn\'t configured. Simulates voting with 3-like threshold for match.',
                    '<b>Ref-Based State:</b> useRef pattern for async callbacks that need current state (Supabase subscriptions). Prevents stale closures.',
                ]),
            ]
        },
        {
            'num': '06', 'title': 'Design & UX',
            'content': [
                ('heading2', 'Design Principles'),
                ('bullets', [
                    '<b>Nightlife aesthetic:</b> Dark background with amber accents for a going-out mood',
                    '<b>Familiar mechanics:</b> Tinder-style swiping \u2014 everyone already knows how it works',
                    '<b>Social presence:</b> See who\'s in the session and how they\'re voting',
                    '<b>Zero friction:</b> No accounts, no passwords \u2014 just a name and a link',
                ]),
                ('heading2', 'Key UI Decisions'),
                ('bullets', [
                    'Card stack with visible next/third cards for depth',
                    'Drag gesture with threshold and velocity detection',
                    'Custom SVG avatars with deterministic color generation',
                    'Live voting indicators (green = liked, red = noped, white = pending)',
                    'Progress bar showing X/total bars remaining',
                    'Undo button for the last swipe decision',
                ]),
                ('heading2', 'Session Flow'),
                ('table', {
                    'headers': ['Step', 'Screen', 'Key Interactions'],
                    'rows': [
                        ['1', 'Landing', 'Create session or join via code'],
                        ['2', 'Create: Name', 'Enter display name, pick avatar'],
                        ['3', 'Create: Location', 'Use geolocation or search neighborhood'],
                        ['4', 'Create: Filters', 'Bar type, price, open now, outdoor'],
                        ['5', 'Lobby', 'Share link/QR, see members join in realtime'],
                        ['6', 'Swiping', 'Swipe bars, see group voting status'],
                        ['7', 'Match!', 'Celebration screen with bar details + directions'],
                    ],
                    'widths': [40, 110, 350],
                }),
            ]
        },
        {
            'num': '07', 'title': 'Implementation Phases',
            'content': [
                ('table', {
                    'headers': ['Phase', 'Timeline', 'Deliverables'],
                    'rows': [
                        ['1 \u2014 Core Swipe', 'Week 1\u20132', 'Swipe UI with Framer Motion, card stack, OSM data integration, basic session flow'],
                        ['2 \u2014 Realtime', 'Week 3', 'Supabase tables, realtime subscriptions, vote syncing, match detection, lobby'],
                        ['3 \u2014 Social Features', 'Week 4', 'Custom avatars, voting status indicators, QR sharing, member presence'],
                        ['4 \u2014 Polish', 'Week 5\u20136', 'Filters, undo, demo mode, no-match recovery, directions, responsive testing'],
                    ],
                    'widths': [120, 80, 300],
                }),
            ]
        },
        {
            'num': '08', 'title': 'Testing & Iteration',
            'content': [
                ('heading2', 'QA Approach'),
                ('bullets', [
                    'Multi-device testing with 3\u20134 phones simultaneously',
                    'Supabase realtime latency testing under concurrent connections',
                    'OSM data quality validation across different neighborhoods',
                    'Demo mode full-flow testing without backend',
                ]),
                ('heading2', 'Feedback Round 1 (4 Testers, Week 3)'),
                ('quote', ('The swiping feels great! Just like Tinder.', '\u2014 Tester A')),
                ('quote', ('Can I undo my last swipe? I accidentally noped a good one.', '\u2014 Tester B \u2192 Added undo feature')),
                ('heading2', 'Feedback Round 2 (6 Testers, Week 5)'),
                ('bullets', [
                    '"I like seeing who voted what" \u2014 validated social voting indicators',
                    '"The QR code is perfect for sharing at the table" \u2014 kept as primary share method',
                    '"What if nobody matches?" \u2014 added no-match recovery (expand radius / relax filters)',
                ]),
                ('heading2', 'Critical Bug: Stale State in Realtime Callbacks'),
                ('body', 'Discovered that Supabase realtime subscription callbacks captured stale state via closures. Fixed by introducing useRef pattern (barsRef) for all async callbacks that need current state. This became a key architectural pattern for the entire app.'),
            ]
        },
        {
            'num': '09', 'title': 'Results & Impact',
            'content': [
                ('heading2', 'What Shipped'),
                ('bullets', [
                    'Tinder-style group swiping with gesture support and undo',
                    'Realtime sessions via Supabase with live voting indicators',
                    'Geolocation-based bar discovery from OpenStreetMap',
                    'Filters: bar type, price range, open now, outdoor seating',
                    'Custom SVG avatars with QR code session sharing',
                    'Full demo mode with simulated voting fallback',
                    'Match celebration with directions to the chosen bar',
                ]),
                ('heading2', 'Performance'),
                ('metrics', [
                    ('< 20s', 'Session Setup'),
                    ('~90s', 'Avg. Match Time'),
                    ('< 500ms', 'Vote Sync'),
                    ('100%', 'Offline Demo'),
                ]),
            ]
        },
        {
            'num': '10', 'title': 'Retrospective',
            'content': [
                ('heading2', 'What Went Well'),
                ('bullets', [
                    'Swipe mechanic immediately understood by all testers',
                    'Supabase realtime performed well even with 4+ concurrent users',
                    'Demo mode made testing and showcasing effortless',
                    'Provider abstraction future-proofs the data layer',
                ]),
                ('heading2', 'What Could Improve'),
                ('bullets', [
                    'OSM data quality varies \u2014 some bars lack opening hours or details',
                    'No photos of venues (OSM limitation)',
                    'Session expiry (4 hours) may be too short for some use cases',
                    'Could benefit from Google Places integration for richer data',
                ]),
                ('heading2', 'Next Steps'),
                ('bullets', [
                    'Integrate Google Places API for photos and ratings',
                    'Add "rounds" \u2014 re-swipe on top matches to narrow down',
                    'Push notifications when everyone is done swiping',
                    'Persistent session history for repeat groups',
                ]),
            ]
        },
    ]
}


BARMATCH_DE = {
    'title': 'BarMatch',
    'subtitle': 'Produkt-Fallstudie \u2014 Von der Idee zum Launch',
    'author': 'Fabian Becker \u2014 Product Manager & Entwickler',
    'date': 'Februar 2025',
    'sections': [
        {
            'num': '01', 'title': 'Zusammenfassung',
            'content': [
                ('body', 'BarMatch ist eine Echtzeit-Gruppenentscheidungs-App, die Freunden hilft, sich auf eine Bar zu einigen. Eine Person erstellt eine Session, teilt einen Link oder QR-Code, und alle swipen unabh\u00e4ngig durch Bars in der N\u00e4he. Wenn die ganze Gruppe denselben Ort mag, gibt es ein Match.'),
                ('body', 'Die App kombiniert Geolocation, echte Bar-Daten von OpenStreetMap, Tinder-artige Swipe-Mechanik und Supabase-basierte Echtzeit-Kollaboration \u2014 alles von Grund auf als Solo-Projekt entwickelt.'),
            ]
        },
        {
            'num': '02', 'title': 'Problemerkennung',
            'content': [
                ('heading2', 'Das "Wohin gehen wir?"-Problem'),
                ('body', 'Sich als Gruppe zu entscheiden, wohin man ausgeht, ist eines der h\u00e4ufigsten sozialen Koordinationsprobleme:'),
                ('bullets', [
                    'Jemand schl\u00e4gt etwas vor \u2192 3 Leute haben Meinungen \u2192 kein Konsens',
                    'Gruppenchat eskaliert mit Google-Maps-Links und widerspr\u00fcchlichen Pr\u00e4ferenzen',
                    'Die lauteste Stimme gewinnt oder alle gehen zum "Stammlokal"',
                    'Entscheidungsm\u00fcdigkeit f\u00fchrt zum Zuhausebleiben',
                ]),
                ('heading2', 'Wettbewerbslandschaft'),
                ('table', {
                    'headers': ['L\u00f6sung', 'Ansatz', 'L\u00fccke'],
                    'rows': [
                        ['Gruppenchats', 'Freie Diskussion', 'Keine Struktur, Entscheidungsm\u00fcdigkeit'],
                        ['Yelp / Google Maps', 'Individuelles Browsing', 'Keine Gruppenkoordination'],
                        ['Doodle / Umfragen', 'Abstimmung', 'Jemand muss Optionen kuratieren'],
                        ['Zufallsgeneratoren', 'Zuf\u00e4llige Auswahl', 'Keine Pr\u00e4ferenzen, keine echten Daten'],
                    ],
                    'widths': [120, 140, 240],
                }),
            ]
        },
        {
            'num': '03', 'title': 'Recherche & Validierung',
            'content': [
                ('heading2', 'Nutzerforschung (6 informelle Interviews)'),
                ('quote', ('Wir landen immer in den gleichen zwei Bars, weil sich niemand entscheiden kann.', '\u2014 Teilnehmer 2')),
                ('quote', ('Ich w\u00fcnschte, es g\u00e4be ein Tinder f\u00fcr Bars. Einfach swipen und fertig.', '\u2014 Teilnehmer 5')),
                ('heading2', 'Wichtigste Erkenntnisse'),
                ('bullets', [
                    '6/6 Teilnehmer best\u00e4tigten Gruppen-Bar-Entscheidungen als <b>wiederkehrende Frustration</b>',
                    '5/6 bevorzugten Swipe-Ansatz gegen\u00fcber textbasierter Abstimmung',
                    '4/6 w\u00fcnschten Filteroptionen (Preis, Outdoor, ge\u00f6ffnet)',
                    'Alle sch\u00e4tzten <b>echte Daten</b> \u00fcber manuell kuratierte Listen',
                ]),
            ]
        },
        {
            'num': '04', 'title': 'Produktvision & Scoping',
            'content': [
                ('heading2', 'Produktvision'),
                ('body', '<i>"Gruppenentscheidungen f\u00fcrs Ausgehen sollen Spa\u00df machen, schnell sein und fair."</i>'),
                ('heading2', 'Erfolgsmetriken'),
                ('metrics', [
                    ('< 30s', 'Session-Setup'),
                    ('< 2min', 'Zeit bis Match'),
                    ('100%', 'Fairer Input'),
                    ('0', 'Auth-Barrieren'),
                ]),
            ]
        },
        {
            'num': '05', 'title': 'Technische Architektur',
            'content': [
                ('heading2', 'Stack-Entscheidungen'),
                ('table', {
                    'headers': ['Schicht', 'Wahl', 'Begr\u00fcndung'],
                    'rows': [
                        ['Framework', 'Next.js 16', 'SSR, API-Routes, geteilte Codebasis'],
                        ['Echtzeit', 'Supabase', 'Kostenloses Tier, Echtzeit-Subscriptions, RLS'],
                        ['Bar-Daten', 'OpenStreetMap Overpass', 'Kostenlos, community-gepflegt, global'],
                        ['Animationen', 'Framer Motion', 'Gesten-Support, Spring-Physik, Drag'],
                        ['State', 'React Context + useRef', 'Async-Callback-State-Management'],
                    ],
                    'widths': [100, 160, 240],
                }),
                ('heading2', 'Architekturentscheidungen'),
                ('bullets', [
                    '<b>BarDataProvider-Abstraktion:</b> Interface f\u00fcr mehrere Datenquellen mit MockProvider als Fallback.',
                    '<b>Supabase Realtime:</b> Drei Tabellen mit Echtzeit-Subscriptions f\u00fcr Live-Updates.',
                    '<b>Demo-Modus:</b> Volle Feature-Parit\u00e4t via sessionStorage ohne Backend.',
                    '<b>Ref-basierter State:</b> useRef-Pattern f\u00fcr aktuelle State-Werte in async Callbacks.',
                ]),
            ]
        },
        {
            'num': '06', 'title': 'Design & UX',
            'content': [
                ('heading2', 'Designprinzipien'),
                ('bullets', [
                    '<b>Nachtleben-\u00c4sthetik:</b> Dunkler Hintergrund mit Amber-Akzenten',
                    '<b>Vertraute Mechanik:</b> Tinder-artiges Swipen \u2014 jeder wei\u00df sofort, wie es funktioniert',
                    '<b>Soziale Pr\u00e4senz:</b> Sehen, wer in der Session ist und wie abgestimmt wurde',
                    '<b>Null Reibung:</b> Keine Accounts, keine Passw\u00f6rter \u2014 nur ein Name und ein Link',
                ]),
                ('heading2', 'Session-Ablauf'),
                ('table', {
                    'headers': ['Schritt', 'Screen', 'Interaktionen'],
                    'rows': [
                        ['1', 'Landing', 'Session erstellen oder per Code beitreten'],
                        ['2', 'Name', 'Anzeigename eingeben, Avatar w\u00e4hlen'],
                        ['3', 'Standort', 'Geolocation oder Nachbarschaft suchen'],
                        ['4', 'Filter', 'Bar-Typ, Preis, Ge\u00f6ffnet, Outdoor'],
                        ['5', 'Lobby', 'Link/QR teilen, Mitglieder sehen'],
                        ['6', 'Swipen', 'Bars swipen, Gruppen-Voting-Status sehen'],
                        ['7', 'Match!', 'Feier-Screen mit Bar-Details + Wegbeschreibung'],
                    ],
                    'widths': [50, 100, 350],
                }),
            ]
        },
        {
            'num': '07', 'title': 'Umsetzungsphasen',
            'content': [
                ('table', {
                    'headers': ['Phase', 'Zeitraum', 'Ergebnisse'],
                    'rows': [
                        ['1 \u2014 Kern-Swipe', 'Woche 1\u20132', 'Swipe-UI, Card Stack, OSM-Daten, Session-Flow'],
                        ['2 \u2014 Echtzeit', 'Woche 3', 'Supabase-Tabellen, Echtzeit-Subscriptions, Match-Erkennung'],
                        ['3 \u2014 Soziale Features', 'Woche 4', 'Avatare, Voting-Indikatoren, QR-Sharing, Pr\u00e4senz'],
                        ['4 \u2014 Polish', 'Woche 5\u20136', 'Filter, Undo, Demo-Modus, Kein-Match-Recovery'],
                    ],
                    'widths': [120, 80, 300],
                }),
            ]
        },
        {
            'num': '08', 'title': 'Testing & Iteration',
            'content': [
                ('heading2', 'Kritischer Bug: Veralteter State in Realtime-Callbacks'),
                ('body', 'Supabase-Realtime-Subscription-Callbacks erfassten veralteten State durch Closures. Gel\u00f6st durch Einf\u00fchrung des useRef-Patterns (barsRef) f\u00fcr alle async Callbacks. Dies wurde zum Schl\u00fcssel-Architekturmuster der gesamten App.'),
                ('heading2', 'Feedback-Runden'),
                ('quote', ('Das Swipen f\u00fchlt sich super an! Genau wie Tinder.', '\u2014 Tester A')),
                ('quote', ('Kann ich meinen letzten Swipe r\u00fcckg\u00e4ngig machen?', '\u2014 Tester B \u2192 Undo-Feature hinzugef\u00fcgt')),
            ]
        },
        {
            'num': '09', 'title': 'Ergebnisse & Wirkung',
            'content': [
                ('heading2', 'Was ausgeliefert wurde'),
                ('bullets', [
                    'Tinder-artiges Gruppen-Swipen mit Gesten-Support und Undo',
                    'Echtzeit-Sessions via Supabase mit Live-Voting-Indikatoren',
                    'Standortbasierte Bar-Entdeckung von OpenStreetMap',
                    'Filter: Bar-Typ, Preisklasse, Ge\u00f6ffnet, Au\u00dfenbereich',
                    'Eigene SVG-Avatare mit QR-Code-Session-Sharing',
                    'Vollst\u00e4ndiger Demo-Modus mit simuliertem Voting',
                ]),
                ('heading2', 'Performance'),
                ('metrics', [
                    ('< 20s', 'Session-Setup'),
                    ('~90s', 'Match-Zeit'),
                    ('< 500ms', 'Vote-Sync'),
                    ('100%', 'Offline-Demo'),
                ]),
            ]
        },
        {
            'num': '10', 'title': 'Retrospektive',
            'content': [
                ('heading2', 'Was gut lief'),
                ('bullets', [
                    'Swipe-Mechanik sofort von allen Testern verstanden',
                    'Supabase Realtime performant auch mit 4+ gleichzeitigen Nutzern',
                    'Demo-Modus machte Testing und Pr\u00e4sentation m\u00fchelos',
                ]),
                ('heading2', 'N\u00e4chste Schritte'),
                ('bullets', [
                    'Google Places API f\u00fcr Fotos und Bewertungen integrieren',
                    '"Runden" hinzuf\u00fcgen \u2014 Top-Matches erneut swipen',
                    'Push-Benachrichtigungen wenn alle fertig geswipt haben',
                ]),
            ]
        },
    ]
}


# ═══════════════════════════════════════════════════════════════════
# FLOWBOARD CONTENT
# ═══════════════════════════════════════════════════════════════════

FLOWBOARD_EN = {
    'title': 'FlowBoard',
    'subtitle': 'Product Case Study \u2014 From Idea to Launch',
    'author': 'Fabian Becker \u2014 Product Manager & Developer',
    'date': 'March 2025',
    'sections': [
        {
            'num': '01', 'title': 'Executive Summary',
            'content': [
                ('body', 'FlowBoard is a hybrid planning tool that merges Kanban columns with a freeform canvas. Every card exists in both views simultaneously \u2014 switch modes seamlessly, connect cards with visual arrows, manage checklists and due dates, and work completely offline.'),
                ('body', 'Built as an installable PWA with IndexedDB persistence, it targets the gap between structured tools like Trello and spatial tools like Miro. No account required, no data leaves the device.'),
            ]
        },
        {
            'num': '02', 'title': 'Problem Discovery',
            'content': [
                ('heading2', 'The Planning Tool Dilemma'),
                ('body', 'Project planning tools force users into one paradigm:'),
                ('bullets', [
                    '<b>Linear tools</b> (Trello, Asana) \u2014 Great for task tracking, but bad for brainstorming and spatial relationships',
                    '<b>Spatial tools</b> (Miro, FigJam) \u2014 Great for ideation, but lack structure for execution',
                    '<b>The switch cost:</b> Moving between tools means duplicating data, losing context, and fragmenting information',
                ]),
                ('heading2', 'Competitive Landscape'),
                ('table', {
                    'headers': ['Tool', 'Strengths', 'Gap'],
                    'rows': [
                        ['Trello', 'Simple Kanban, great adoption', 'No canvas/spatial mode'],
                        ['Miro', 'Flexible canvas, collaboration', 'No structured task management'],
                        ['Notion', 'All-in-one, databases', 'No spatial view, complex'],
                        ['Linear', 'Dev-focused, fast', 'No canvas, team-only'],
                    ],
                    'widths': [80, 180, 240],
                }),
                ('heading2', 'Opportunity'),
                ('body', 'A tool that keeps both modes in perfect sync \u2014 every card exists in Kanban AND Canvas simultaneously \u2014 would eliminate the switching cost entirely. Offline-first design removes the account barrier.'),
            ]
        },
        {
            'num': '03', 'title': 'Research & Validation',
            'content': [
                ('heading2', 'User Research (5 Informal Interviews)'),
                ('quote', ('I use Trello for tasks and Miro for planning. It\'s annoying to keep both updated.', '\u2014 Participant 1')),
                ('quote', ('I need to see how tasks connect to each other. Kanban boards can\'t show that.', '\u2014 Participant 3')),
                ('quote', ('I don\'t want to create yet another account for a planning tool.', '\u2014 Participant 5')),
                ('heading2', 'Key Findings'),
                ('bullets', [
                    '4/5 used multiple tools for planning (one structured, one spatial)',
                    '5/5 wanted to visualize <b>dependencies between tasks</b>',
                    '3/5 expressed frustration with account requirements and cloud lock-in',
                    'All valued <b>mode switching without data duplication</b>',
                ]),
            ]
        },
        {
            'num': '04', 'title': 'Product Vision & Scoping',
            'content': [
                ('heading2', 'Product Vision'),
                ('body', '<i>"Plan in columns. Think in space. Never lose context."</i>'),
                ('heading2', 'Goals & Non-Goals'),
                ('table', {
                    'headers': ['Goals (v1)', 'Non-Goals (v1)'],
                    'rows': [
                        ['Dual Kanban + Canvas with shared data model', 'Real-time collaboration (multi-user)'],
                        ['Visual connectors between cards', 'File attachments or rich media'],
                        ['Rich cards (checklists, due dates, comments)', 'Calendar view or Gantt charts'],
                        ['Offline-first with no account required', 'Cloud sync or backup'],
                    ],
                    'widths': [250, 250],
                }),
                ('heading2', 'Success Metrics'),
                ('metrics', [
                    ('0ms', 'Mode Switch'),
                    ('100%', 'Data Parity'),
                    ('Offline', 'Full Support'),
                    ('50', 'Undo Steps'),
                ]),
            ]
        },
        {
            'num': '05', 'title': 'Technical Architecture',
            'content': [
                ('heading2', 'Stack Decisions'),
                ('table', {
                    'headers': ['Layer', 'Choice', 'Rationale'],
                    'rows': [
                        ['Framework', 'Next.js 16 (App Router)', 'SSR for SEO landing, client-side app'],
                        ['State', 'Zustand + temporal middleware', 'Lightweight, undo/redo built-in'],
                        ['Persistence', 'IndexedDB', 'Offline-first, large data support'],
                        ['Drag & Drop', 'dnd-kit', 'Accessible, flexible, React-native'],
                        ['Styling', 'Tailwind CSS v4', 'Glass morphism design system'],
                        ['Animations', 'Framer Motion', 'Smooth transitions between modes'],
                    ],
                    'widths': [90, 180, 230],
                }),
                ('heading2', 'Key Architecture Decisions'),
                ('bullets', [
                    '<b>Shared Data Model:</b> Every card has Kanban properties (column, order) AND Canvas properties (x, y position). Both views read from the same store.',
                    '<b>Zustand + Temporal:</b> Global state with 50-step undo/redo history. Every user action is recorded and reversible.',
                    '<b>Smart Connectors:</b> SVG arrows auto-calculate best anchor points between cards. Connectors update in real-time as cards are moved.',
                    '<b>Viewport Persistence:</b> Canvas pan/zoom state is saved per board, so users return to exactly where they left off.',
                ]),
            ]
        },
        {
            'num': '06', 'title': 'Design & UX',
            'content': [
                ('heading2', 'Design Principles'),
                ('bullets', [
                    '<b>Apple Liquid Glass:</b> Frosted glass morphism with blur and transparency for depth',
                    '<b>Dual-mode confidence:</b> Users should trust that switching modes preserves everything',
                    '<b>Progressive disclosure:</b> Simple by default, powerful features revealed on interaction',
                    '<b>Keyboard-first:</b> Power users can operate entirely without a mouse',
                ]),
                ('heading2', 'Card Features'),
                ('table', {
                    'headers': ['Feature', 'Implementation', 'Purpose'],
                    'rows': [
                        ['Title & Description', 'Inline editing', 'Core content'],
                        ['Checklists', 'Add items, progress bar', 'Sub-task tracking'],
                        ['Due Dates', 'Overdue/soon/on-time/done status', 'Time management'],
                        ['Comments', 'Thread with author tracking', 'Context and decisions'],
                        ['Assignees', 'Board member selection', 'Ownership'],
                        ['Priority', 'None/Low/Medium/High/Urgent', 'Prioritization'],
                        ['Colors', '4 options (indigo, pink, cyan, emerald)', 'Visual categorization'],
                        ['Labels', 'Dynamic add/remove', 'Custom taxonomy'],
                    ],
                    'widths': [100, 180, 220],
                }),
            ]
        },
        {
            'num': '07', 'title': 'Implementation Phases',
            'content': [
                ('table', {
                    'headers': ['Phase', 'Timeline', 'Deliverables'],
                    'rows': [
                        ['1 \u2014 Kanban Core', 'Week 1\u20132', 'Columns, cards, drag-and-drop with dnd-kit, Zustand store, IndexedDB persistence'],
                        ['2 \u2014 Canvas Mode', 'Week 3\u20134', 'Pan/zoom viewport, card positioning, mode switching, SVG connectors'],
                        ['3 \u2014 Rich Cards', 'Week 5\u20136', 'Checklists, due dates, comments, assignees, priority, colors, labels'],
                        ['4 \u2014 Power Features', 'Week 7', 'Command palette, keyboard shortcuts, board archive, undo/redo, filters'],
                        ['5 \u2014 PWA & Polish', 'Week 8', 'Service worker, manifest, glass morphism, responsive, landing page'],
                    ],
                    'widths': [120, 80, 300],
                }),
            ]
        },
        {
            'num': '08', 'title': 'Testing & Iteration',
            'content': [
                ('heading2', 'QA Approach'),
                ('bullets', [
                    'Mode-switching stress tests (rapid Kanban \u2194 Canvas toggling)',
                    'Large board testing (50+ cards, 20+ connectors)',
                    'IndexedDB persistence validation (refresh, close, reopen)',
                    'Keyboard-only navigation testing',
                ]),
                ('heading2', 'Feedback Round 1 (3 Testers, Week 4)'),
                ('quote', ('Wait, the card is in both views? That\'s exactly what I needed.', '\u2014 Tester A')),
                ('quote', ('The connectors are really satisfying to draw.', '\u2014 Tester B')),
                ('quote', ('I need checklists inside cards, not just titles.', '\u2014 Tester C \u2192 Added checklists with progress tracking')),
                ('heading2', 'Feedback Round 2 (4 Testers, Week 7)'),
                ('bullets', [
                    '"Undo is a lifesaver" \u2014 validated 50-step undo/redo',
                    '"The glass morphism looks premium" \u2014 kept frosted glass design',
                    '"Keyboard shortcuts make this really fast" \u2014 expanded shortcut coverage',
                    '"Archive is useful for completed projects" \u2014 kept board archive feature',
                ]),
            ]
        },
        {
            'num': '09', 'title': 'Results & Impact',
            'content': [
                ('heading2', 'What Shipped'),
                ('bullets', [
                    'Dual Kanban + Canvas modes with instant, lossless switching',
                    'Smart SVG connectors with automatic anchor-point routing',
                    'Rich cards: checklists, due dates, comments, assignees, priorities, labels',
                    '50-step undo/redo with full state recovery',
                    'Command palette and comprehensive keyboard shortcuts',
                    'Board archiving for completed projects',
                    'Installable PWA with full offline support',
                    'Apple Liquid Glass design with frosted glass morphism',
                ]),
                ('heading2', 'Performance'),
                ('metrics', [
                    ('< 16ms', 'Mode Switch'),
                    ('100%', 'Data Parity'),
                    ('Full', 'Offline PWA'),
                    ('50 Steps', 'Undo/Redo'),
                ]),
            ]
        },
        {
            'num': '10', 'title': 'Retrospective',
            'content': [
                ('heading2', 'What Went Well'),
                ('bullets', [
                    'Shared data model eliminated the dual-tool problem completely',
                    'Zustand + temporal middleware made undo/redo almost trivial to implement',
                    'IndexedDB provided reliable offline persistence without backend complexity',
                    'Glass morphism gave the app a premium, distinctive aesthetic',
                ]),
                ('heading2', 'What Could Improve'),
                ('bullets', [
                    'Canvas performance degrades slightly with 100+ cards (optimization needed)',
                    'No real-time collaboration yet (single-user only)',
                    'Connector routing could be smarter (avoid overlapping cards)',
                    'Mobile canvas interaction is limited (touch gestures need refinement)',
                ]),
                ('heading2', 'Next Steps'),
                ('bullets', [
                    'Real-time collaboration via Supabase or CRDT-based sync',
                    'Export to common formats (JSON, CSV, image)',
                    'Canvas auto-layout algorithms for automatic card arrangement',
                    'Templates for common project structures',
                ]),
            ]
        },
    ]
}


FLOWBOARD_DE = {
    'title': 'FlowBoard',
    'subtitle': 'Produkt-Fallstudie \u2014 Von der Idee zum Launch',
    'author': 'Fabian Becker \u2014 Product Manager & Entwickler',
    'date': 'M\u00e4rz 2025',
    'sections': [
        {
            'num': '01', 'title': 'Zusammenfassung',
            'content': [
                ('body', 'FlowBoard ist ein hybrides Planungstool, das Kanban-Spalten mit einem Freeform-Canvas vereint. Jede Karte existiert gleichzeitig in beiden Ansichten \u2014 nahtlos zwischen Modi wechseln, Karten visuell verbinden, Checklisten und F\u00e4lligkeiten verwalten, komplett offline arbeiten.'),
                ('body', 'Als installierbare PWA mit IndexedDB-Persistenz gebaut, zielt es auf die L\u00fccke zwischen strukturierten Tools wie Trello und r\u00e4umlichen Tools wie Miro. Kein Account n\u00f6tig, keine Daten verlassen das Ger\u00e4t.'),
            ]
        },
        {
            'num': '02', 'title': 'Problemerkennung',
            'content': [
                ('heading2', 'Das Planungstool-Dilemma'),
                ('body', 'Projektplanungstools zwingen Nutzer in ein Paradigma:'),
                ('bullets', [
                    '<b>Lineare Tools</b> (Trello, Asana) \u2014 Gut f\u00fcr Task-Tracking, schlecht f\u00fcr Brainstorming',
                    '<b>R\u00e4umliche Tools</b> (Miro, FigJam) \u2014 Gut f\u00fcr Ideation, fehlt Struktur f\u00fcr Umsetzung',
                    '<b>Wechselkosten:</b> Zwischen Tools wechseln bedeutet Daten duplizieren und Kontext verlieren',
                ]),
                ('heading2', 'Wettbewerbslandschaft'),
                ('table', {
                    'headers': ['Tool', 'St\u00e4rken', 'L\u00fccke'],
                    'rows': [
                        ['Trello', 'Einfaches Kanban', 'Kein Canvas/r\u00e4umlicher Modus'],
                        ['Miro', 'Flexibler Canvas', 'Kein strukturiertes Task-Management'],
                        ['Notion', 'All-in-one, Datenbanken', 'Keine r\u00e4umliche Ansicht, komplex'],
                        ['Linear', 'Dev-fokussiert, schnell', 'Kein Canvas, nur f\u00fcr Teams'],
                    ],
                    'widths': [80, 180, 240],
                }),
            ]
        },
        {
            'num': '03', 'title': 'Recherche & Validierung',
            'content': [
                ('heading2', 'Nutzerforschung (5 informelle Interviews)'),
                ('quote', ('Ich nutze Trello f\u00fcr Tasks und Miro f\u00fcr Planung. Es nervt, beides aktuell zu halten.', '\u2014 Teilnehmer 1')),
                ('quote', ('Ich muss sehen, wie Tasks zusammenh\u00e4ngen. Kanban-Boards k\u00f6nnen das nicht zeigen.', '\u2014 Teilnehmer 3')),
                ('heading2', 'Wichtigste Erkenntnisse'),
                ('bullets', [
                    '4/5 nutzten mehrere Tools (eines strukturiert, eines r\u00e4umlich)',
                    '5/5 wollten <b>Abh\u00e4ngigkeiten zwischen Tasks</b> visualisieren',
                    '3/5 frustriert \u00fcber Account-Pflicht und Cloud-Lock-in',
                    'Alle sch\u00e4tzten <b>Moduswechsel ohne Datenduplizierung</b>',
                ]),
            ]
        },
        {
            'num': '04', 'title': 'Produktvision & Scoping',
            'content': [
                ('heading2', 'Produktvision'),
                ('body', '<i>"Plane in Spalten. Denke im Raum. Verliere nie den Kontext."</i>'),
                ('heading2', 'Erfolgsmetriken'),
                ('metrics', [
                    ('0ms', 'Moduswechsel'),
                    ('100%', 'Datenparit\u00e4t'),
                    ('Offline', 'Voller Support'),
                    ('50', 'Undo-Schritte'),
                ]),
            ]
        },
        {
            'num': '05', 'title': 'Technische Architektur',
            'content': [
                ('heading2', 'Stack-Entscheidungen'),
                ('table', {
                    'headers': ['Schicht', 'Wahl', 'Begr\u00fcndung'],
                    'rows': [
                        ['Framework', 'Next.js 16', 'SSR f\u00fcr Landing, Client-Side App'],
                        ['State', 'Zustand + Temporal', 'Leichtgewichtig, Undo/Redo eingebaut'],
                        ['Persistenz', 'IndexedDB', 'Offline-first, gro\u00dfe Datenmengen'],
                        ['Drag & Drop', 'dnd-kit', 'Barrierefrei, flexibel, React-nativ'],
                        ['Animationen', 'Framer Motion', 'Fl\u00fcssige \u00dcberg\u00e4nge zwischen Modi'],
                    ],
                    'widths': [100, 160, 240],
                }),
                ('heading2', 'Architekturentscheidungen'),
                ('bullets', [
                    '<b>Geteiltes Datenmodell:</b> Jede Karte hat Kanban- UND Canvas-Eigenschaften. Beide Ansichten lesen vom selben Store.',
                    '<b>Zustand + Temporal:</b> 50-Schritt-Undo/Redo-Historie. Jede Aktion ist aufgezeichnet und umkehrbar.',
                    '<b>Smarte Verbinder:</b> SVG-Pfeile berechnen automatisch optimale Ankerpunkte zwischen Karten.',
                    '<b>Viewport-Persistenz:</b> Canvas Pan/Zoom-State wird pro Board gespeichert.',
                ]),
            ]
        },
        {
            'num': '06', 'title': 'Design & UX',
            'content': [
                ('heading2', 'Designprinzipien'),
                ('bullets', [
                    '<b>Apple Liquid Glass:</b> Frosted-Glass-Morphismus mit Blur und Transparenz',
                    '<b>Dual-Mode-Vertrauen:</b> Nutzer sollen darauf vertrauen, dass Moduswechsel alles beh\u00e4lt',
                    '<b>Progressive Offenlegung:</b> Einfach standardm\u00e4\u00dfig, m\u00e4chtige Features bei Interaktion',
                    '<b>Tastatur-zuerst:</b> Power-User k\u00f6nnen komplett ohne Maus arbeiten',
                ]),
                ('heading2', 'Karten-Features'),
                ('table', {
                    'headers': ['Feature', 'Umsetzung', 'Zweck'],
                    'rows': [
                        ['Titel & Beschreibung', 'Inline-Editing', 'Kerninhalt'],
                        ['Checklisten', 'Items + Fortschrittsbalken', 'Sub-Task-Tracking'],
                        ['F\u00e4lligkeiten', '\u00dcberf\u00e4llig/Bald/P\u00fcnktlich/Erledigt', 'Zeitmanagement'],
                        ['Kommentare', 'Thread mit Autoren-Tracking', 'Kontext und Entscheidungen'],
                        ['Zuweisungen', 'Board-Mitglieder-Auswahl', 'Verantwortlichkeit'],
                        ['Priorit\u00e4t', 'Keine/Niedrig/Mittel/Hoch/Dringend', 'Priorisierung'],
                    ],
                    'widths': [110, 170, 220],
                }),
            ]
        },
        {
            'num': '07', 'title': 'Umsetzungsphasen',
            'content': [
                ('table', {
                    'headers': ['Phase', 'Zeitraum', 'Ergebnisse'],
                    'rows': [
                        ['1 \u2014 Kanban-Kern', 'Woche 1\u20132', 'Spalten, Karten, Drag-and-Drop, Zustand Store, IndexedDB'],
                        ['2 \u2014 Canvas-Modus', 'Woche 3\u20134', 'Pan/Zoom, Kartenpositionierung, Moduswechsel, SVG-Verbinder'],
                        ['3 \u2014 Reiche Karten', 'Woche 5\u20136', 'Checklisten, F\u00e4lligkeiten, Kommentare, Zuweisungen, Priorit\u00e4t'],
                        ['4 \u2014 Power-Features', 'Woche 7', 'Befehlspalette, Shortcuts, Archiv, Undo/Redo, Filter'],
                        ['5 \u2014 PWA & Polish', 'Woche 8', 'Service Worker, Manifest, Glass-Morphismus, Responsive'],
                    ],
                    'widths': [120, 80, 300],
                }),
            ]
        },
        {
            'num': '08', 'title': 'Testing & Iteration',
            'content': [
                ('heading2', 'Feedback-Runden'),
                ('quote', ('Moment, die Karte ist in beiden Ansichten? Genau das habe ich gebraucht.', '\u2014 Tester A')),
                ('quote', ('Die Verbinder zu zeichnen macht richtig Spa\u00df.', '\u2014 Tester B')),
                ('bullets', [
                    '"Undo ist ein Lebensretter" \u2014 50-Schritt-Undo/Redo validiert',
                    '"Der Glass-Morphismus sieht premium aus" \u2014 Frosted-Glass-Design beibehalten',
                    '"Tastenkombinationen machen es richtig schnell" \u2014 Shortcut-Abdeckung erweitert',
                ]),
            ]
        },
        {
            'num': '09', 'title': 'Ergebnisse & Wirkung',
            'content': [
                ('heading2', 'Was ausgeliefert wurde'),
                ('bullets', [
                    'Dualer Kanban + Canvas mit sofortigem, verlustfreiem Wechsel',
                    'Smarte SVG-Verbinder mit automatischem Ankerpunkt-Routing',
                    'Reiche Karten: Checklisten, F\u00e4lligkeiten, Kommentare, Zuweisungen',
                    '50-Schritt-Undo/Redo mit vollst\u00e4ndiger State-Wiederherstellung',
                    'Befehlspalette und umfassende Tastenkombinationen',
                    'Installierbare PWA mit vollem Offline-Support',
                    'Apple Liquid Glass Design mit Frosted-Glass-Morphismus',
                ]),
                ('heading2', 'Performance'),
                ('metrics', [
                    ('< 16ms', 'Moduswechsel'),
                    ('100%', 'Datenparit\u00e4t'),
                    ('Voll', 'Offline PWA'),
                    ('50', 'Undo-Schritte'),
                ]),
            ]
        },
        {
            'num': '10', 'title': 'Retrospektive',
            'content': [
                ('heading2', 'Was gut lief'),
                ('bullets', [
                    'Geteiltes Datenmodell eliminierte das Dual-Tool-Problem komplett',
                    'Zustand + Temporal machte Undo/Redo fast trivial zu implementieren',
                    'IndexedDB lieferte zuverl\u00e4ssige Offline-Persistenz',
                    'Glass-Morphismus gab der App eine premium \u00c4sthetik',
                ]),
                ('heading2', 'N\u00e4chste Schritte'),
                ('bullets', [
                    'Echtzeit-Kollaboration via Supabase oder CRDT-basiertem Sync',
                    'Export in g\u00e4ngige Formate (JSON, CSV, Bild)',
                    'Canvas Auto-Layout-Algorithmen',
                    'Templates f\u00fcr g\u00e4ngige Projektstrukturen',
                ]),
            ]
        },
    ]
}


# ═══════════════════════════════════════════════════════════════════
# PDF BUILDER
# ═══════════════════════════════════════════════════════════════════

def build_pdf(data, project_key, output_path):
    """Build a case study PDF from structured data."""
    theme = THEMES[project_key]
    accent = theme['primary']
    styles = create_styles(accent)
    template = CaseStudyTemplate(data['title'], accent, data['author'])

    doc = SimpleDocTemplate(
        output_path,
        pagesize=A4,
        topMargin=45,
        bottomMargin=45,
        leftMargin=30,
        rightMargin=30,
        title=f"{data['title']} \u2014 Case Study",
        author="Fabian Becker",
    )

    story = []

    # Cover page
    build_cover_page(
        story, data['title'], data['subtitle'],
        data['author'], data['date'], accent, theme
    )

    # Sections
    for i, sec in enumerate(data['sections']):
        if i > 0:
            story.append(PageBreak())

        section_header(story, sec['num'], sec['title'], styles)

        for item in sec['content']:
            item_type = item[0]

            if item_type == 'body':
                story.append(Paragraph(item[1], styles['body']))

            elif item_type == 'heading2':
                story.append(Paragraph(item[1], styles['heading2']))

            elif item_type == 'bullets':
                bullet_list(story, item[1], styles, accent)
                story.append(Spacer(1, 4))

            elif item_type == 'quote':
                text, attr = item[1]
                quote_block(story, text, attr, styles, accent)

            elif item_type == 'table':
                tdata = item[1]
                t = make_table(
                    tdata['headers'], tdata['rows'], accent, styles,
                    col_widths=tdata.get('widths')
                )
                story.append(Spacer(1, 4))
                story.append(t)
                story.append(Spacer(1, 8))

            elif item_type == 'metrics':
                m = metrics_row(item[1], accent, styles)
                story.append(Spacer(1, 8))
                story.append(m)
                story.append(Spacer(1, 8))

    doc.build(story, onFirstPage=template.on_page, onLaterPages=template.on_page)
    print(f"  Created: {output_path}")


def main():
    docs_dir = os.path.dirname(os.path.abspath(__file__))

    projects = [
        ('streaming-finder', STREAMING_FINDER_EN, 'streaming-finder-case-study-en.pdf'),
        ('streaming-finder', STREAMING_FINDER_DE, 'streaming-finder-case-study-de.pdf'),
        ('barmatch', BARMATCH_EN, 'barmatch-case-study-en.pdf'),
        ('barmatch', BARMATCH_DE, 'barmatch-case-study-de.pdf'),
        ('flowboard', FLOWBOARD_EN, 'flowboard-case-study-en.pdf'),
        ('flowboard', FLOWBOARD_DE, 'flowboard-case-study-de.pdf'),
    ]

    print("Generating case study PDFs...")
    for project_key, data, filename in projects:
        output_path = os.path.join(docs_dir, filename)
        build_pdf(data, project_key, output_path)

    print("\nDone! All 6 PDFs generated.")


if __name__ == '__main__':
    main()

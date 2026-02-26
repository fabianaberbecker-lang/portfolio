'use client';

import { Container } from '@/components/layout/Container';
import { Badge } from '@/components/ui/Badge';
import { Timeline } from '@/components/sections/Timeline';
import { useLanguage } from '@/lib/i18n/LanguageContext';

const iconColors: Record<string, string> = {
    chart: 'bg-pop-purple/10 text-pop-purple',
    rocket: 'bg-pop-red/10 text-pop-red',
    handshake: 'bg-pop-green/10 text-pop-green',
    code: 'bg-pop-yellow/10 text-pop-yellow',
};

/** Clean monoline icons for "How I Work" cards */
function WorkIcon({ iconKey }: { iconKey: string }) {
    const colorClass = iconColors[iconKey] || 'bg-pop-purple/10 text-pop-purple';
    return (
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${colorClass}`}>
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {iconKey === 'chart' && (
                    <>
                        <line x1="18" y1="20" x2="18" y2="10" />
                        <line x1="12" y1="20" x2="12" y2="4" />
                        <line x1="6" y1="20" x2="6" y2="14" />
                    </>
                )}
                {iconKey === 'rocket' && (
                    <>
                        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                        <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
                        <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
                        <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
                    </>
                )}
                {iconKey === 'handshake' && (
                    <>
                        <path d="M17 6.1H3" />
                        <path d="M21 12.1H3" />
                        <path d="M15.1 18H3" />
                        <circle cx="19" cy="18" r="2" />
                        <circle cx="19" cy="6" r="2" fill="currentColor" fillOpacity="0.3" />
                    </>
                )}
                {iconKey === 'code' && (
                    <>
                        <polyline points="16 18 22 12 16 6" />
                        <polyline points="8 6 2 12 8 18" />
                    </>
                )}
            </svg>
        </div>
    );
}

export default function AboutPage() {
    const { t } = useLanguage();

    return (
        <section className="py-20 sm:py-28">
            <Container className="max-w-4xl">
                {/* Title */}
                <h1 className="text-4xl font-black lowercase tracking-tight sm:text-6xl">
                    {t.about.title}
                </h1>

                {/* Narrative Intro */}
                <div className="mt-10 space-y-5 text-lg leading-relaxed text-muted">
                    {t.about.intro.map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                    ))}
                </div>

                {/* What I Do */}
                <div className="mt-20">
                    <h2 className="text-3xl font-black lowercase tracking-tight">
                        {t.about.whatIDo.title}
                    </h2>
                    <div className="mt-8 grid gap-6 sm:grid-cols-3">
                        {t.about.whatIDo.items.map((item) => (
                            <div
                                key={item.title}
                                className="rounded-[2rem] border border-border bg-surface p-8"
                            >
                                <h3 className="text-lg font-bold lowercase text-foreground">
                                    {item.title}
                                </h3>
                                <p className="mt-2 text-sm leading-relaxed text-muted">
                                    {item.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* How I Work */}
                <div className="mt-20">
                    <h2 className="text-3xl font-black lowercase tracking-tight">
                        {t.about.howIWork.title}
                    </h2>
                    <div className="mt-10 grid gap-6 sm:grid-cols-2">
                        {t.about.howIWork.principles.map((principle) => (
                            <div
                                key={principle.title}
                                className="rounded-[2rem] border border-border bg-surface p-8"
                            >
                                <WorkIcon iconKey={principle.iconKey} />
                                <h3 className="mt-4 text-lg font-bold lowercase text-foreground">
                                    {principle.title}
                                </h3>
                                <p className="mt-2 text-sm leading-relaxed text-muted">
                                    {principle.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Experience Timeline */}
                <div className="mt-20">
                    <h2 className="text-3xl font-black lowercase tracking-tight">
                        {t.about.experience.title}
                    </h2>
                    <div className="mt-10">
                        <Timeline items={t.about.experience.timeline} />
                    </div>
                </div>

                {/* Toolbox */}
                <div className="mt-20">
                    <h2 className="text-3xl font-black lowercase tracking-tight">
                        {t.about.toolbox.title}
                    </h2>
                    <div className="mt-10 grid gap-8 sm:grid-cols-2">
                        {t.about.toolbox.categories.map((group) => (
                            <div
                                key={group.category}
                                className="rounded-[2rem] border border-border bg-surface p-8"
                            >
                                <div className="mb-5 flex items-center gap-3">
                                    <div
                                        className={`h-3 w-3 rounded-full ${group.colorClass}`}
                                    />
                                    <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">
                                        {group.category}
                                    </h3>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {group.items.map((item) => (
                                        <Badge key={item}>{item}</Badge>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Container>
        </section>
    );
}

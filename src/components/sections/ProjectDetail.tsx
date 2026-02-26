'use client';

import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { getProjectBySlug } from '@/data/projects';

export function ProjectDetail({ slug }: { slug: string }) {
    const { locale, t } = useLanguage();
    const project = getProjectBySlug(slug, locale);

    if (!project) {
        return (
            <section className="py-20 sm:py-28">
                <Container className="max-w-3xl text-center">
                    <p className="text-lg text-muted">Project not found.</p>
                </Container>
            </section>
        );
    }

    const sections = [
        { title: t.projects.sectionProblem, content: project.problem },
        { title: t.projects.sectionRole, content: `${project.role} — ${project.scope}` },
        { title: t.projects.sectionApproach, content: project.approach },
        { title: t.projects.sectionOutcome, content: project.outcome },
    ];

    return (
        <section className="py-20 sm:py-28">
            <Container className="max-w-3xl">
                {/* Back */}
                <Link
                    href="/projects"
                    className="mb-10 inline-flex items-center gap-2 text-sm font-medium lowercase text-muted hover:text-foreground"
                >
                    {t.projects.backToProjects}
                </Link>

                {/* Header */}
                <div className="mb-14">
                    <div className="mb-5 flex flex-wrap items-center gap-2">
                        <Badge variant={project.status === 'shipped' ? 'success' : 'warning'}>
                            {project.status === 'shipped' ? t.projects.statusShipped : t.projects.statusWip}
                        </Badge>
                        {project.stack.map((tech) => (
                            <Badge key={tech}>{tech}</Badge>
                        ))}
                    </div>
                    <h1 className="text-4xl font-black lowercase tracking-tight sm:text-5xl">
                        {project.title}
                    </h1>
                    <p className="mt-4 text-lg text-muted leading-relaxed">{project.summary}</p>
                </div>

                {/* Sections */}
                <div className="space-y-12">
                    {sections.map((section) => (
                        <div key={section.title}>
                            <h2 className="mb-3 text-sm font-bold uppercase tracking-widest text-pop-purple">
                                {section.title}
                            </h2>
                            <p className="text-lg leading-relaxed text-muted">{section.content}</p>
                        </div>
                    ))}
                </div>

                {/* Highlights */}
                {project.highlights.length > 0 && (
                    <div className="mt-14">
                        <h2 className="mb-6 text-sm font-bold uppercase tracking-widest text-pop-purple">
                            {t.projects.sectionHighlights}
                        </h2>
                        <div className="grid gap-4 sm:grid-cols-2">
                            {project.highlights.map((h, i) => (
                                <div
                                    key={h}
                                    className="rounded-[1.5rem] border border-border bg-surface p-6"
                                >
                                    <span className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-pop-purple/10 text-sm font-bold text-pop-purple">
                                        {i + 1}
                                    </span>
                                    <span className="text-sm text-muted leading-relaxed">{h}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Links */}
                <div className="mt-14 flex flex-wrap gap-4">
                    {project.links.demo && (
                        <Link href={project.links.demo}>
                            <Button size="lg">{t.projects.viewLiveDemo}</Button>
                        </Link>
                    )}
                    {project.links.repo && (
                        <Link href={project.links.repo} target="_blank" rel="noopener noreferrer">
                            <Button variant="secondary" size="lg">{t.projects.viewRepository}</Button>
                        </Link>
                    )}
                </div>
            </Container>
        </section>
    );
}

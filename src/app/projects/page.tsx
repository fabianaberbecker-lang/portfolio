'use client';

import { Container } from '@/components/layout/Container';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { getProjects } from '@/data/projects';
import { useLanguage } from '@/lib/i18n/LanguageContext';

const accentColors = ['bg-pop-purple', 'bg-pop-red', 'bg-pop-yellow', 'bg-pop-pink', 'bg-pop-green'];

export default function ProjectsPage() {
    const { locale, t } = useLanguage();
    const projects = getProjects(locale);

    return (
        <section className="py-20 sm:py-28">
            <Container>
                <div className="mb-16">
                    <h1 className="text-4xl font-black lowercase tracking-tight sm:text-6xl">
                        {t.projects.title}
                    </h1>
                    <p className="mt-4 max-w-xl text-lg text-muted">
                        {t.projects.subtitle}
                    </p>
                </div>

                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {projects.map((project, i) => (
                        <Card key={project.slug} href={`/projects/${project.slug}`}>
                            <div className={`mb-6 h-2 w-16 rounded-full ${accentColors[i % accentColors.length]}`} />
                            <div className="mb-4 flex flex-wrap items-center gap-2">
                                <Badge variant={project.status === 'shipped' ? 'success' : 'warning'}>
                                    {project.status === 'shipped' ? t.projects.statusShipped : t.projects.statusWip}
                                </Badge>
                                <Badge variant="accent">{project.role.toLowerCase()}</Badge>
                            </div>
                            <CardTitle>{project.title}</CardTitle>
                            <CardDescription>{project.summary}</CardDescription>
                            <div className="mt-5 flex flex-wrap gap-1.5">
                                {project.stack.map((tech) => (
                                    <Badge key={tech}>{tech}</Badge>
                                ))}
                            </div>
                            {project.highlights.length > 0 && (
                                <ul className="mt-5 space-y-1.5">
                                    {project.highlights.map((h) => (
                                        <li key={h} className="flex items-start gap-2 text-xs text-muted">
                                            <span className={`mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full ${accentColors[i % accentColors.length]}`} />
                                            {h}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </Card>
                    ))}
                </div>
            </Container>
        </section>
    );
}

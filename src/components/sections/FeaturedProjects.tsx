'use client';

import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { getProjects } from '@/data/projects';

const accentColors = ['bg-pop-purple', 'bg-pop-red', 'bg-pop-yellow'];

export function FeaturedProjects() {
  const { locale, t } = useLanguage();
  const featured = getProjects(locale).slice(0, 3);

  return (
    <section className="py-24 sm:py-32">
      <Container>
        <div className="mb-16 flex items-end justify-between">
          <div>
            <h2 className="text-4xl font-black lowercase tracking-tight sm:text-5xl">
              {t.projects.selectedWork}
            </h2>
            <p className="mt-3 text-muted">
              {t.projects.caseStudies}
            </p>
          </div>
          <Link
            href="/projects"
            className="hidden text-sm font-semibold lowercase text-foreground underline underline-offset-4 hover:text-pop-purple sm:block"
          >
            {t.projects.viewAll}
          </Link>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((project, i) => (
            <Card
              key={project.slug}
              href={`/projects/${project.slug}`}
              className={`animate-fade-in-up delay-${(i + 1) * 100}`}
            >
              {/* Color accent bar */}
              <div
                className={`mb-6 h-2 w-16 rounded-full ${accentColors[i] ?? 'bg-pop-purple'}`}
              />
              <div className="mb-4 flex items-center gap-2">
                <Badge variant={project.status === 'shipped' ? 'success' : 'warning'}>
                  {project.status === 'shipped'
                    ? t.projects.statusShipped
                    : t.projects.statusWip}
                </Badge>
              </div>
              <CardTitle>{project.title}</CardTitle>
              <CardDescription>{project.summary}</CardDescription>
              <div className="mt-5 flex flex-wrap gap-1.5">
                {project.stack.slice(0, 4).map((tech) => (
                  <Badge key={tech}>{tech}</Badge>
                ))}
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-10 text-center sm:hidden">
          <Link href="/projects">
            <Button variant="secondary">{t.projects.viewAllProjects}</Button>
          </Link>
        </div>
      </Container>
    </section>
  );
}

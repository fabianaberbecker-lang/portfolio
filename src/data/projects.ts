import type { Locale } from '@/lib/i18n/types';
import { projectsEn } from './projects-en';
import { projectsDe } from './projects-de';

export interface ProjectLink {
  demo?: string;
  repo?: string;
}

export interface Project {
  slug: string;
  title: string;
  summary: string;
  status: 'shipped' | 'wip';
  role: string;
  scope: string;
  stack: string[];
  problem: string;
  approach: string;
  outcome: string;
  links: ProjectLink;
  highlights: string[];
}

const projectMap: Record<Locale, Project[]> = { en: projectsEn, de: projectsDe };

export function getProjects(locale: Locale = 'en'): Project[] {
  return projectMap[locale];
}

export function getProjectBySlug(slug: string, locale: Locale = 'en'): Project | undefined {
  return getProjects(locale).find((p) => p.slug === slug);
}

// Default export for backward compatibility during migration
export const projects = projectsEn;

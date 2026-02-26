import type { Metadata } from 'next';
import { projects, getProjectBySlug } from '@/data/projects';
import { ProjectDetail } from '@/components/sections/ProjectDetail';

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const project = getProjectBySlug(slug);
    if (!project) return {};
    return { title: project.title, description: project.summary };
}

export default async function ProjectDetailPage({ params }: PageProps) {
    const { slug } = await params;
    return <ProjectDetail slug={slug} />;
}

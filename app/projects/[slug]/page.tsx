import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projectsData } from "@/data/content";
import { ProjectDetailClient } from "@/components/sections/ProjectDetailClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return projectsData.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = projectsData.find((p) => p.slug === slug);
  if (!project) return { title: "Karya tidak ditemukan" };

  return {
    title: `${project.title} — Afif Fauzi`,
    description: project.description,
    openGraph: {
      title: `${project.title} — Afif Fauzi`,
      description: project.description,
      images: [{ url: project.image, alt: project.title }],
    },
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const index = projectsData.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();

  const project = projectsData[index];
  const nextProject = projectsData[(index + 1) % projectsData.length];

  return <ProjectDetailClient project={project} nextProject={nextProject} />;
}

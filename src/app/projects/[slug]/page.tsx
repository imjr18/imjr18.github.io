import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projectBySlug, projectSlugs } from "@/data/projects";
import { DeepDiveShell } from "@/components/projects/DeepDiveShell";

export function generateStaticParams() {
  return projectSlugs.map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projectBySlug(slug);
  if (!project) return {};
  return {
    title: project.og.title,
    description: project.og.description,
    openGraph: {
      title: `${project.og.title} — Jawahar Ranganathan`,
      description: project.og.description,
      url: `/projects/${slug}/`,
      images: [{ url: "/og.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.og.title} — Jawahar Ranganathan`,
      description: project.og.description,
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projectBySlug(slug);
  if (!project) notFound();

  const { default: Body } = await import(`@/content/projects/${slug}.mdx`);

  return (
    <main id="main">
      <DeepDiveShell project={project}>
        <Body />
      </DeepDiveShell>
    </main>
  );
}

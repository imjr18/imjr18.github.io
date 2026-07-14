import Link from "next/link";
import type { Project } from "@/lib/types";
import { site } from "@/data/site";
import { MetricStrip } from "./MetricStrip";
import { TagRow } from "@/components/ui/Tag";
import { GitHubIcon, ArrowIcon } from "@/components/ui/icons";

export function DeepDiveShell({
  project,
  children,
}: {
  project: Project;
  children: React.ReactNode;
}) {
  return (
    <div className="graph-paper min-h-screen">
      {/* top rail */}
      <header className="sticky top-0 z-30 border-b border-hairline bg-bg0/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1120px] items-center justify-between px-5 py-3.5 sm:px-8">
          <Link
            href="/"
            className="group flex items-center gap-2 font-mono text-[12px] text-ink1 transition-colors hover:text-phosphor"
          >
            <ArrowIcon className="h-3 w-3 rotate-180" />
            <span>jawahar.ranganathan</span>
          </Link>
          <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink2">
            {project.domain}
          </span>
        </div>
      </header>

      <article className="mx-auto max-w-[1120px] px-5 pb-28 pt-10 sm:px-8">
        {/* breadcrumb */}
        <nav className="mb-6 font-mono text-[11px] uppercase tracking-[0.1em] text-ink2">
          <Link href="/" className="hover:text-phosphor">
            index
          </Link>{" "}
          / <Link href="/#work" className="hover:text-phosphor">work</Link> /{" "}
          <span className="text-ink1">[{project.index}]</span>
        </nav>

        {/* title */}
        <h1 className="max-w-3xl font-display text-[clamp(2rem,5vw,3.25rem)] font-600 leading-[1.05] tracking-[-0.02em] text-ink0">
          {project.title}
        </h1>
        <p className="mt-5 max-w-2xl text-[1.05rem] leading-relaxed text-ink1">
          {project.thesis}
        </p>

        {/* metadata row */}
        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[11px] uppercase tracking-[0.08em] text-ink2">
          <span className="text-phosphor">[{project.index}] {project.codename}</span>
          <span>{project.domain}</span>
        </div>

        {/* abstract */}
        <div className="ticks mt-8 border border-hairline bg-bg1 p-5 sm:p-6">
          <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.12em] text-ink2">
            Abstract
          </div>
          <p className="max-w-3xl text-[15px] leading-relaxed text-ink1">
            {project.abstract}
          </p>
        </div>

        {/* metrics strip */}
        <div className="mt-6">
          <MetricStrip metrics={project.metrics} />
        </div>

        {/* body */}
        <div className="prose-paper mt-4">{children}</div>

        {/* footer: tags + links */}
        <div className="mt-12 border-t border-hairline pt-6">
          <TagRow tags={project.tags} />
          <div className="mt-5 flex flex-wrap items-center gap-4">
            {project.repo && (
              <a
                href={project.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 border border-hairline px-4 py-2 font-mono text-[12px] text-ink1 transition-colors hover:border-phosphor hover:text-phosphor"
              >
                <GitHubIcon className="h-4 w-4" />
                <span>view repository</span>
              </a>
            )}
            {project.repoNote && (
              <span className="font-mono text-[12px] text-ink2">
                {"// "}
                {project.repoNote}
              </span>
            )}
            {project.links?.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-mono text-[12px] text-phosphor hover:underline"
              >
                {l.label} <ArrowIcon className="h-3 w-3" />
              </a>
            ))}
          </div>
        </div>

        {/* next project */}
        <div className="mt-10 flex justify-between font-mono text-[12px]">
          <Link href="/#work" className="text-ink2 transition-colors hover:text-phosphor">
            ← all work
          </Link>
          <a
            href={`mailto:${site.email}`}
            className="text-ink2 transition-colors hover:text-phosphor"
          >
            get in touch →
          </a>
        </div>
      </article>
    </div>
  );
}

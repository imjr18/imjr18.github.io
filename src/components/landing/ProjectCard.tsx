import Link from "next/link";
import type { Project } from "@/lib/types";
import { ArrowIcon } from "@/components/ui/icons";

/** Pinned to a latent-space cluster in cinematic mode; a list item in fallback. */
export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}/`}
      className="cine-card group block"
      data-card={project.index}
      style={{ ["--accent" as string]: project.cluster.color }}
    >
      <article className="ticks border border-hairline bg-bg1/90 p-5 backdrop-blur-sm transition-transform duration-200 group-hover:-translate-y-0.5 sm:p-6">
        <div className="flex items-center justify-between">
          <span
            className="font-mono text-[12px] uppercase tracking-[0.1em]"
            style={{ color: project.cluster.color }}
          >
            [{project.index}] {project.codename}
          </span>
          <span
            className="h-2 w-2 rounded-full"
            style={{
              background: project.cluster.color,
              boxShadow: `0 0 8px ${project.cluster.color}`,
            }}
            aria-hidden
          />
        </div>

        <h3 className="mt-3 font-display text-[1.35rem] font-600 leading-tight text-ink0">
          {project.title}
        </h3>
        <p className="mt-2 text-[14.5px] leading-relaxed text-ink1">
          {project.thesis}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {project.metrics.slice(0, 3).map((m) => (
            <span
              key={m.label}
              className="border border-hairline px-2 py-1 font-mono text-[11px] text-ink1"
            >
              <span className="text-phosphor">{m.value}</span> {m.label}
            </span>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-x-2.5 gap-y-1">
          {project.tags.slice(0, 4).map((t) => (
            <span
              key={t}
              className="font-mono text-[10.5px] uppercase tracking-[0.06em] text-ink2"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="mt-5 inline-flex items-center gap-1.5 font-mono text-[12px] text-phosphor">
          deep-dive
          <ArrowIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </div>
      </article>
    </Link>
  );
}

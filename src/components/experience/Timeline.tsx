import { experience } from "@/data/experience";
import { site } from "@/data/site";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { DownloadIcon } from "@/components/ui/icons";

export function Timeline() {
  return (
    <section
      id="experience"
      className="mx-auto w-full max-w-[1120px] px-5 py-20 sm:px-8 sm:py-28"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <SectionHeading index="05" label="EXPERIENCE" className="flex-1 min-w-[220px]" />
        <a
          href={site.cv}
          className="group inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.1em] text-phosphor hover:underline"
        >
          <DownloadIcon className="h-4 w-4" />
          download cv →
        </a>
      </div>

      <ol className="mt-10 border-l border-hairline">
        {experience.map((e) => (
          <li key={`${e.org}-${e.period}`} className="relative pl-6 pb-9 last:pb-0 sm:pl-8">
            <span
              className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full"
              style={{
                background: e.current ? "var(--color-amber)" : "var(--color-ink2)",
                boxShadow: e.current ? "0 0 10px var(--color-amber)" : "none",
              }}
              aria-hidden
            />
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h3 className="font-display text-[1.1rem] font-500 text-ink0">
                {e.role}
              </h3>
              <span className="text-ink1">· {e.org}</span>
              {e.current && (
                <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-amber">
                  ● current
                </span>
              )}
            </div>
            <div className="mt-0.5 font-mono text-[11px] uppercase tracking-[0.08em] text-ink2">
              {e.period}
              {e.location ? ` · ${e.location}` : ""}
            </div>
            <ul className="mt-2 space-y-1">
              {e.bullets.map((b) => (
                <li key={b} className="text-[14.5px] leading-relaxed text-ink1">
                  {b}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </section>
  );
}

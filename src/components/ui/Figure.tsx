import type { ReactNode } from "react";

interface FigureProps {
  id?: string;
  caption: string;
  children: ReactNode;
  className?: string;
}

/** Every figure carries a mono caption bar: `FIG. 3 — CROSS-MODAL ATTENTION FUSION`. */
export function Figure({ id, caption, children, className }: FigureProps) {
  return (
    <figure
      className={`my-8 border border-hairline bg-bg1 ${className ?? ""}`}
    >
      <div className="overflow-x-auto p-4 sm:p-6">{children}</div>
      <figcaption className="border-t border-hairline px-4 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-ink2">
        {id ? `FIG. ${id} — ` : ""}
        {caption}
      </figcaption>
    </figure>
  );
}

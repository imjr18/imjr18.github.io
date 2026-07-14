import type { ReactNode } from "react";

interface SectionHeadingProps {
  index?: string;
  label: string;
  children?: ReactNode;
  className?: string;
}

/** Mono kicker like `[02] SELECTED WORK`, used across landing sections. */
export function SectionHeading({
  index,
  label,
  children,
  className,
}: SectionHeadingProps) {
  return (
    <div className={`flex items-center gap-3 ${className ?? ""}`}>
      <span className="font-mono text-[12px] uppercase tracking-[0.18em] text-phosphor">
        {index ? `[${index}] ` : ""}
        {label}
      </span>
      <span className="h-px flex-1 bg-hairline" aria-hidden />
      {children}
    </div>
  );
}

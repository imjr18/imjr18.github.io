import type { ReactNode } from "react";

interface InstrumentCardProps {
  children: ReactNode;
  className?: string;
  as?: "div" | "article" | "li";
}

/** Panel with bezel corner ticks instead of heavy glass. */
export function InstrumentCard({
  children,
  className,
  as: Tag = "div",
}: InstrumentCardProps) {
  return (
    <Tag
      className={`ticks border border-hairline bg-bg1/85 backdrop-blur-[2px] ${className ?? ""}`}
    >
      {children}
    </Tag>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import type { Metric } from "@/lib/types";

/**
 * Stat tile. Numeric metrics count up once on first view; symbolic ones
 * (↑, MADDPG, Next.js) render verbatim. Caveat sits below in muted mono.
 */
export function MetricStat({ metric }: { metric: Metric }) {
  const ref = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState(
    metric.countTo != null ? formatFrom(metric.value, 0) : metric.value,
  );

  useEffect(() => {
    if (metric.countTo == null) return;
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) {
      setDisplay(metric.value);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        const target = metric.countTo!;
        const dur = 1100;
        let raf = 0;
        let start = 0;
        const step = (t: number) => {
          if (!start) start = t;
          const k = Math.min(1, (t - start) / dur);
          const eased = 1 - Math.pow(1 - k, 3);
          setDisplay(formatFrom(metric.value, target * eased));
          if (k < 1) raf = requestAnimationFrame(step);
          else setDisplay(metric.value);
        };
        raf = requestAnimationFrame(step);
        cleanup = () => cancelAnimationFrame(raf);
      },
      { threshold: 0.5 },
    );
    let cleanup = () => {};
    io.observe(el);
    return () => {
      io.disconnect();
      cleanup();
    };
  }, [metric]);

  return (
    <div ref={ref} className="ticks border border-hairline bg-bg1 px-4 py-3.5">
      <div className="font-display text-2xl font-600 leading-none text-phosphor tabular-nums sm:text-[1.75rem]">
        {display}
      </div>
      <div className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.08em] text-ink1">
        {metric.label}
      </div>
      {metric.caveat && (
        <div className="mt-0.5 font-mono text-[10px] text-ink2">
          {metric.caveat}
        </div>
      )}
    </div>
  );
}

/** Keep the value's non-numeric decoration (%, mg/dL) while animating the number. */
function formatFrom(template: string, n: number): string {
  const decimals = /\.\d/.test(template) ? 1 : 0;
  const num = n.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  const m = template.match(/^([^\d]*)([\d.,]+)(.*)$/);
  if (!m) return template;
  return `${m[1]}${num}${m[3]}`;
}

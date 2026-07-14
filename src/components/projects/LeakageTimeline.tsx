"use client";

import { useReveal } from "@/components/ui/useReveal";

interface Step {
  version: string;
  title: string;
  dice: number | null;
  note: string;
  kind: "baseline" | "alert" | "champion" | "experiment";
}

const STEPS: Step[] = [
  {
    version: "v1",
    title: "Baseline U-Net",
    dice: 89,
    note: "Looked excellent. Random slice-level split.",
    kind: "baseline",
  },
  {
    version: "v2",
    title: "Data leakage discovered",
    dice: null,
    note: "Same-patient slices spanned train + val. Re-split at patient level. Dice collapsed to an honest 43–53%.",
    kind: "alert",
  },
  {
    version: "v3",
    title: "UNet++ · Focal Tversky",
    dice: 51.7,
    note: "Champion on a genuinely held-out patient set. 62.5% recall.",
    kind: "champion",
  },
  {
    version: "v4",
    title: "Loss / augmentation sweep",
    dice: 49,
    note: "Ablations around α, β, γ and patient-aware augmentation.",
    kind: "experiment",
  },
  {
    version: "v5",
    title: "Swin-UNet hybrid",
    dice: 50,
    note: "Transformer encoder experiment; comparable, not a clear win.",
    kind: "experiment",
  },
];

const COLOR: Record<Step["kind"], string> = {
  baseline: "var(--color-ink2)",
  alert: "var(--color-alert)",
  champion: "var(--color-phosphor)",
  experiment: "var(--color-signal)",
};

export function LeakageTimeline() {
  const ref = useReveal<HTMLDivElement>();

  return (
    <div ref={ref} className="reveal">
      {/* Bar chart: the headline contrast */}
      <div className="mb-8 border border-hairline bg-bg1 p-5">
        <div className="mb-4 font-mono text-[11px] uppercase tracking-[0.12em] text-ink2">
          HELD-OUT DICE — LEAKED vs HONEST
        </div>
        <div className="flex items-end gap-8" style={{ height: 160 }}>
          <Bar label="v1 leaked" value={89} color="var(--color-alert)" strike />
          <Bar label="v3 honest" value={51.7} color="var(--color-phosphor)" />
        </div>
        <p className="mt-4 font-mono text-[11px] leading-relaxed text-ink2">
          {"// the 89% was measured against slices the model had already seen"}
          <br />
          {"// the 51.7% is the number I actually trust"}
        </p>
      </div>

      {/* Vertical version arc */}
      <ol className="relative ml-1 border-l border-hairline">
        {STEPS.map((s) => (
          <li key={s.version} className="relative pl-6 pb-6 last:pb-0">
            <span
              className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full"
              style={{
                background: COLOR[s.kind],
                boxShadow:
                  s.kind === "champion" || s.kind === "alert"
                    ? `0 0 10px ${COLOR[s.kind]}`
                    : "none",
              }}
              aria-hidden
            />
            {s.kind === "alert" ? (
              <div className="ticks border border-alert/50 bg-alert/[0.06] p-3.5">
                <div className="flex items-center gap-2 font-mono text-[12px] font-medium uppercase tracking-[0.1em] text-alert">
                  <span aria-hidden>⚠</span>
                  <span>{s.version} — AUDIT</span>
                </div>
                <div className="mt-1 font-display text-[15px] text-ink0">
                  {s.title}
                </div>
                <p className="mt-1 text-[14px] leading-relaxed text-ink1">
                  {s.note}
                </p>
              </div>
            ) : (
              <div>
                <div className="flex items-baseline gap-2.5">
                  <span
                    className="font-mono text-[12px] font-medium"
                    style={{ color: COLOR[s.kind] }}
                  >
                    {s.version}
                  </span>
                  <span className="font-display text-[15px] text-ink0">
                    {s.title}
                  </span>
                  {s.dice != null && (
                    <span className="ml-auto font-mono text-[12px] tabular-nums text-ink1">
                      {s.dice}% Dice
                    </span>
                  )}
                </div>
                <p className="mt-1 text-[14px] leading-relaxed text-ink1">
                  {s.note}
                </p>
              </div>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

function Bar({
  label,
  value,
  color,
  strike,
}: {
  label: string;
  value: number;
  color: string;
  strike?: boolean;
}) {
  return (
    <div className="flex h-full flex-1 flex-col items-center justify-end">
      <div className="mb-1.5 font-mono text-[13px] tabular-nums" style={{ color }}>
        {value}%
      </div>
      <div
        className="w-full max-w-[120px] origin-bottom transition-transform"
        style={{
          height: `${value}%`,
          background: `linear-gradient(to top, ${color}, transparent 160%)`,
          borderTop: `2px solid ${color}`,
          opacity: strike ? 0.5 : 1,
        }}
      />
      <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.08em] text-ink2">
        {label}
      </div>
    </div>
  );
}

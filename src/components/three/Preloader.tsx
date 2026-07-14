"use client";

import { useEffect, useRef, useState } from "react";

const EQUATIONS = [
  "softmax(QKᵀ / √dₖ) V",
  "ℒ = ½·e⁻ˢ‖y − μ̂‖² + ½s",
  "ℒ_FT = (1 − TI)^γ",
];

/**
 * Full-screen boot overlay. Intentionally imports NOTHING from three/drei so it
 * paints instantly, before the 3D chunk streams in. A manual eased counter
 * "charges" toward 99%; CinematicClient unmounts this the moment the live scene
 * draws its first frame. Skip jumps straight to the loaded state.
 */
export function Preloader({ onSkip }: { onSkip: () => void }) {
  const [pct, setPct] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const rafRef = useRef(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setPct(100);
      return;
    }
    const start = performance.now();
    const DUR = 2400;
    const tick = (t: number) => {
      const k = Math.min(1, (t - start) / DUR);
      const eased = 1 - Math.pow(1 - k, 2);
      setPct(Math.min(99, Math.round(eased * 99)));
      if (k < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const skip = () => {
    setLeaving(true);
    setPct(100);
    window.setTimeout(onSkip, 320);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === "Escape") skip();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="scanlines fixed inset-0 z-[100] flex flex-col items-center justify-center bg-bg0 transition-opacity duration-300"
      style={{ opacity: leaving ? 0 : 1 }}
      role="status"
      aria-live="polite"
      aria-label="Loading interactive scene"
    >
      <div className="graph-paper pointer-events-none absolute inset-0 opacity-40" />

      <div className="relative w-[min(440px,80vw)]">
        <div className="mb-3 flex items-baseline justify-between font-mono text-[12px] uppercase tracking-[0.14em] text-ink2">
          <span>{"// calibrating signal…"}</span>
          <span className="tabular-nums text-phosphor">
            {String(pct).padStart(3, "0")}%
          </span>
        </div>

        {/* waveform charge bar */}
        <div className="relative h-10 w-full overflow-hidden border border-hairline bg-bg1">
          <div
            className="absolute inset-y-0 left-0 transition-[width] duration-150 ease-out"
            style={{
              width: `${pct}%`,
              background:
                "linear-gradient(90deg, rgba(107,199,255,0.25), rgba(74,242,161,0.45))",
            }}
          />
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 440 40"
            preserveAspectRatio="none"
            aria-hidden
          >
            <path
              d="M0 20 H120 l6 -13 l7 26 l6 -20 l5 7 H220 l6 -16 l7 24 l6 -8 H440"
              fill="none"
              stroke="var(--color-phosphor)"
              strokeWidth="1.3"
              opacity="0.9"
            />
          </svg>
        </div>

        {/* flickering equations */}
        <div className="mt-6 space-y-1.5">
          {EQUATIONS.map((eq, i) => (
            <div
              key={eq}
              className="flicker font-mono text-[12px] text-ink1"
              style={{ animationDelay: `${i * 0.6}s` }}
            >
              {eq}
            </div>
          ))}
        </div>

        <button
          onClick={skip}
          className="mt-7 inline-flex items-center gap-2 border border-hairline px-4 py-2 font-mono text-[12px] uppercase tracking-[0.1em] text-ink1 transition-colors hover:border-phosphor hover:text-phosphor"
        >
          Skip / Enter →
        </button>
      </div>

      <style>{`
        .flicker { animation: flick 3.2s steps(1) infinite; }
        @keyframes flick {
          0%, 92%, 100% { opacity: 0.85; }
          93% { opacity: 0.25; }
          95% { opacity: 0.9; }
          97% { opacity: 0.4; }
        }
        @media (prefers-reduced-motion: reduce) { .flicker { animation: none; } }
      `}</style>
    </div>
  );
}

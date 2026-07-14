"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Live "monitor" figure: a scrolling glucose trace with a ±2σ uncertainty band.
 * Toggling REC → NOISE degrades the inputs; the log-variance head responds by
 * widening the band and attention entropy climbs. Demonstrates the research
 * claim rather than decorating it. Pauses when offscreen; honors reduced-motion.
 */
export function GlucoseMonitor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [noise, setNoise] = useState(false);
  const noiseRef = useRef(noise);
  const [entropy, setEntropy] = useState(0.32);

  // Mirror `noise` into a ref so the rAF loop reads the latest value.
  useEffect(() => {
    noiseRef.current = noise;
  }, [noise]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    let running = true;
    let t = 0;
    let sigma = 6; // current band half-width (mg/dL), eased
    let ent = 0.32;
    const entropyRef = { current: ent };

    const W = 640;
    const H = 260;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);

    // deterministic pseudo-noise so SSR/repaint is stable-ish frame to frame
    const rand = (x: number) => {
      const s = Math.sin(x * 12.9898) * 43758.5453;
      return s - Math.floor(s) - 0.5;
    };

    const truth = (x: number) =>
      120 +
      26 * Math.sin(x * 0.9) +
      12 * Math.sin(x * 2.3 + 1) +
      6 * Math.sin(x * 5.1);

    const io = new IntersectionObserver(
      (e) => {
        running = e[0].isIntersecting;
        if (running && !reduce) raf = requestAnimationFrame(draw);
      },
      { threshold: 0.15 },
    );
    io.observe(canvas);

    function y(v: number) {
      // glucose 60..180 mapped into padded canvas
      return H - 30 - ((v - 60) / 120) * (H - 60);
    }

    function draw() {
      if (!running) return;
      t += 0.02;
      const targetSigma = noiseRef.current ? 30 : 6;
      const targetEnt = noiseRef.current ? 0.86 : 0.32;
      sigma += (targetSigma - sigma) * 0.06;
      ent += (targetEnt - ent) * 0.06;
      if (Math.abs(ent - entropyRef.current) > 0.01) {
        entropyRef.current = ent;
        setEntropy(ent);
      }

      ctx!.clearRect(0, 0, W, H);

      // grid
      ctx!.strokeStyle = "rgba(232,238,244,0.05)";
      ctx!.lineWidth = 1;
      for (let gx = 0; gx <= W; gx += 32) {
        ctx!.beginPath();
        ctx!.moveTo(gx, 0);
        ctx!.lineTo(gx, H);
        ctx!.stroke();
      }
      for (let gy = 0; gy <= H; gy += 32) {
        ctx!.beginPath();
        ctx!.moveTo(0, gy);
        ctx!.lineTo(W, gy);
        ctx!.stroke();
      }

      const N = 120;
      const pts: { x: number; mu: number; band: number }[] = [];
      for (let i = 0; i <= N; i++) {
        const px = (i / N) * W;
        const phase = t + i * 0.05;
        const noiseAmp = noiseRef.current ? 26 : 3;
        const mu =
          truth(phase) + rand(phase * 7 + i) * noiseAmp * 0.6;
        const band = sigma * (1 + 0.4 * Math.abs(rand(phase * 3)));
        pts.push({ x: px, mu, band });
      }

      // uncertainty band (±2σ)
      ctx!.beginPath();
      pts.forEach((p, i) => {
        const yy = y(p.mu + 2 * p.band);
        if (i === 0) ctx!.moveTo(p.x, yy);
        else ctx!.lineTo(p.x, yy);
      });
      for (let i = pts.length - 1; i >= 0; i--) {
        ctx!.lineTo(pts[i].x, y(pts[i].mu - 2 * pts[i].band));
      }
      ctx!.closePath();
      const bandColor = noiseRef.current ? "255,180,84" : "74,242,161";
      ctx!.fillStyle = `rgba(${bandColor},0.14)`;
      ctx!.fill();

      // mean trace
      ctx!.beginPath();
      pts.forEach((p, i) => {
        const yy = y(p.mu);
        if (i === 0) ctx!.moveTo(p.x, yy);
        else ctx!.lineTo(p.x, yy);
      });
      ctx!.strokeStyle = noiseRef.current
        ? "rgba(255,180,84,0.95)"
        : "rgba(74,242,161,0.95)";
      ctx!.lineWidth = 1.6;
      ctx!.shadowColor = ctx!.strokeStyle as string;
      ctx!.shadowBlur = 8;
      ctx!.stroke();
      ctx!.shadowBlur = 0;

      raf = requestAnimationFrame(draw);
    }

    // static single frame under reduced-motion
    if (reduce) {
      noiseRef.current = noise;
      sigma = noise ? 30 : 6;
      running = true;
      draw();
      running = false;
    }

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="ticks border border-hairline bg-bg1">
      <div className="flex items-center justify-between border-b border-hairline px-4 py-2.5">
        <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.1em]">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{
              background: noise ? "var(--color-amber)" : "var(--color-phosphor)",
              boxShadow: `0 0 8px ${noise ? "var(--color-amber)" : "var(--color-phosphor)"}`,
            }}
            aria-hidden
          />
          <span style={{ color: noise ? "var(--color-amber)" : "var(--color-phosphor)" }}>
            {noise ? "NOISE ▲" : "REC ●"}
          </span>
        </div>
        <div className="flex items-center gap-3 font-mono text-[11px] text-ink2">
          <span>
            attn entropy{" "}
            <span style={{ color: noise ? "var(--color-amber)" : "var(--color-ink1)" }}>
              {entropy.toFixed(2)}
            </span>
          </span>
          <button
            onClick={() => setNoise((v) => !v)}
            className="border border-hairline px-2.5 py-1 uppercase tracking-[0.08em] text-ink1 transition-colors hover:border-phosphor hover:text-phosphor"
            aria-pressed={noise}
          >
            inject noise
          </button>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "auto", display: "block" }}
        aria-label="Live glucose prediction with an uncertainty band that widens when input signals are degraded."
      />
      <div className="border-t border-hairline px-4 py-2 font-mono text-[11px] text-ink2">
        {"// σ ↑ when inputs degrade — that's the point of the log-variance head."}
      </div>
    </div>
  );
}

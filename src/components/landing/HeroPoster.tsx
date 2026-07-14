/**
 * Static backdrop for the hero. In fallback mode this is the permanent
 * scene stand-in; in cinematic mode it shows instantly and fades once the
 * live WebGL canvas reports ready (.gl-ready on <html>).
 *
 * Placeholder art: layered radial glows + a procedural SVG waveform, evoking
 * the ECG/EEG ribbon. Swap for a rendered WebP screenshot of the live scene
 * once it exists (see plan §7.5) — same element, drop in a background-image.
 */
export function HeroPoster() {
  return (
    <div className="hero-poster pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 20% 15%, rgba(107,199,255,0.12), transparent 55%), radial-gradient(110% 80% at 85% 80%, rgba(74,242,161,0.10), transparent 55%), radial-gradient(100% 100% at 50% 50%, transparent 40%, rgba(7,10,13,0.85))",
        }}
      />
      <svg
        className="absolute left-0 top-1/2 h-[40vh] w-full -translate-y-1/2 opacity-40"
        viewBox="0 0 1200 300"
        preserveAspectRatio="none"
        aria-hidden
      >
        <defs>
          <linearGradient id="wave" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#6bc7ff" stopOpacity="0" />
            <stop offset="45%" stopColor="#6bc7ff" stopOpacity="0.9" />
            <stop offset="55%" stopColor="#4af2a1" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#4af2a1" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M0 150 L280 150 L300 150 L312 60 L326 240 L340 110 L354 150 L520 150 L544 150 L556 95 L570 205 L584 150 L900 150 L918 150 L930 40 L946 250 L960 120 L974 150 L1200 150"
          fill="none"
          stroke="url(#wave)"
          strokeWidth="1.6"
        />
        <path
          className="ecg-draw"
          pathLength={1}
          d="M0 150 L280 150 L300 150 L312 60 L326 240 L340 110 L354 150 L520 150 L544 150 L556 95 L570 205 L584 150 L900 150 L918 150 L930 40 L946 250 L960 120 L974 150 L1200 150"
          fill="none"
          stroke="#4af2a1"
          strokeWidth="2.2"
          opacity="0.9"
        />
      </svg>
      <div className="graph-paper absolute inset-0 opacity-40" />
    </div>
  );
}

/**
 * Module-singleton bridge between the scroll shell (Lenis + ScrollTrigger),
 * the 3D scene, and the nav — deliberately NOT React state, so per-frame
 * updates never re-render React.
 */

export interface ScrollBus {
  /** Master 0→1 progress across the cinematic container. Written by ScrollTrigger. */
  progress: { p: number };
  /** True while the viewport is inside the cinematic container. */
  active: { v: boolean };
  /** Scroll to a named landing section (cinematic mode). Set by CinematicDirector. */
  scrollToSection: ((id: string) => void) | null;
  /** Tear down Lenis + triggers (used when the 3D scene fails and we fall back). */
  teardown: (() => void) | null;
}

export const scrollBus: ScrollBus = {
  progress: { p: 0 },
  active: { v: true },
  scrollToSection: null,
  teardown: null,
};

export type GlTier = "off" | "lite" | "full";

/** Read the tier decided by the pre-paint probe script in layout.tsx. */
export function readTier(): GlTier {
  if (typeof document === "undefined") return "off";
  const cl = document.documentElement.classList;
  if (!cl.contains("cinematic")) return "off";
  return cl.contains("gl-lite") ? "lite" : "full";
}

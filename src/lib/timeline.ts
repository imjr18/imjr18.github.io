/**
 * SINGLE SOURCE OF TRUTH for the cinematic scroll timeline.
 * All fractions are of the master 0→1 progress across #cine.
 * Both the GSAP panel timeline and the 3D morph/camera read these.
 */

export const CINE_LENGTH_VH = 760;

/** Panel visibility windows [in, out] as progress fractions. */
export const PANELS = {
  hero: { in: 0, out: 0.15 },
  work: { in: 0.24, out: 0.42 },
  about: { in: 0.875, out: 1.0 },
} as const;

/** Per-project card windows (4 cards across the latent segment). */
export const CARDS: { in: number; hold: number; out: number }[] = [
  { in: 0.485, hold: 0.52, out: 0.565 },
  { in: 0.565, hold: 0.6, out: 0.645 },
  { in: 0.645, hold: 0.68, out: 0.725 },
  { in: 0.725, hold: 0.76, out: 0.805 },
];

/**
 * Morph state as a function of progress. 0 = waveform, 1 = neural net,
 * 2 = latent space, 3 = brain. Fractional values are transitions.
 */
export const MORPH = {
  waveHold: 0.16,
  toNet: [0.16, 0.26],
  netHold: [0.26, 0.4],
  toLatent: [0.4, 0.48],
  latentHold: [0.48, 0.8],
  toBrain: [0.8, 0.88],
} as const;

export function morphAt(p: number): number {
  if (p < MORPH.toNet[0]) return 0;
  if (p < MORPH.toNet[1]) return remap(p, MORPH.toNet[0], MORPH.toNet[1]);
  if (p < MORPH.toLatent[0]) return 1;
  if (p < MORPH.toLatent[1]) return 1 + remap(p, MORPH.toLatent[0], MORPH.toLatent[1]);
  if (p < MORPH.toBrain[0]) return 2;
  if (p < MORPH.toBrain[1]) return 2 + remap(p, MORPH.toBrain[0], MORPH.toBrain[1]);
  return 3;
}

export function remap(v: number, a: number, b: number): number {
  return Math.min(1, Math.max(0, (v - a) / (b - a)));
}

/** Progress fraction the nav scrolls to for each landing section. */
export const NAV_TARGETS: Record<string, number> = {
  work: 0.5,
  about: 0.93,
};

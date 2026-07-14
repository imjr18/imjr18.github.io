/**
 * SINGLE SOURCE OF TRUTH for the cinematic scroll timeline.
 * All fractions are of the master 0→1 progress across #cine.
 * The GSAP panel timeline, the camera rig, and the particle morph all read
 * these — nothing is hardcoded twice.
 */

// Total scroll distance for the whole cinematic. Keep in sync with the
// `.cinematic #cine` height in globals.css. All windows below are fractions,
// so changing this one number compresses/stretches the entire experience.
export const CINE_LENGTH_VH = 620;

/** Panel visibility windows [in, out] as progress fractions. */
export const PANELS = {
  hero: { in: 0, out: 0.07 },
  work: { in: 0.28, out: 0.44 },
  about: { in: 0.875, out: 1.0 },
} as const;

/** Latent-cluster segment: where the 4 project cards live. */
export const CARD_SPAN: [number, number] = [0.45, 0.8];

const CARD_COUNT = 4;
const cardStep = (CARD_SPAN[1] - CARD_SPAN[0]) / CARD_COUNT;

/** Per-project card windows, evenly tiled across CARD_SPAN — no manual drift. */
export const CARDS: { in: number; hold: number; out: number }[] = Array.from(
  { length: CARD_COUNT },
  (_, i) => {
    const cardIn = CARD_SPAN[0] + i * cardStep;
    return { in: cardIn, hold: cardIn + cardStep * 0.35, out: cardIn + cardStep };
  },
);

/**
 * Morph state as a function of progress. 0 = waveform, 1 = double helix,
 * 2 = neural net, 3 = latent space, 4 = brain. Fractional values are
 * in-flight transitions between the two bracketing states.
 */
export const MORPH = {
  waveHold: 0.07,
  toHelix: [0.07, 0.13],
  helixHold: [0.13, 0.21],
  toNet: [0.21, 0.27],
  netHold: [0.27, 0.39],
  toLatent: [0.39, CARD_SPAN[0]],
  latentHold: CARD_SPAN,
  toBrain: [CARD_SPAN[1], 0.87],
} as const;

export function morphAt(p: number): number {
  if (p < MORPH.toHelix[0]) return 0;
  if (p < MORPH.toHelix[1]) return remap(p, MORPH.toHelix[0], MORPH.toHelix[1]);
  if (p < MORPH.toNet[0]) return 1;
  if (p < MORPH.toNet[1]) return 1 + remap(p, MORPH.toNet[0], MORPH.toNet[1]);
  if (p < MORPH.toLatent[0]) return 2;
  if (p < MORPH.toLatent[1]) return 2 + remap(p, MORPH.toLatent[0], MORPH.toLatent[1]);
  if (p < MORPH.toBrain[0]) return 3;
  if (p < MORPH.toBrain[1]) return 3 + remap(p, MORPH.toBrain[0], MORPH.toBrain[1]);
  return 4;
}

export function remap(v: number, a: number, b: number): number {
  return Math.min(1, Math.max(0, (v - a) / (b - a)));
}

/**
 * Always-on stage ticker copy, indexed by the nearest morph state (0..4).
 * Exists so no stretch of scroll ever shows a blank/meaningless viewport —
 * there is always a small mono label saying what's forming.
 */
export const STAGE_LABELS: { title: string; blurb: string }[] = [
  { title: "SIGNAL", blurb: "biosignal waveform — ECG · EEG" },
  { title: "CODE", blurb: "the double helix — biology's own encoding" },
  { title: "FORWARD PASS", blurb: "a signal becomes a computation" },
  { title: "LATENT SPACE", blurb: "four projects, four clusters" },
  { title: "COGNITION", blurb: "point-cloud cortex" },
];

/** Progress fraction the nav scrolls to for each landing section. */
export const NAV_TARGETS: Record<string, number> = {
  work: CARD_SPAN[0] + cardStep * 0.4,
  about: 0.93,
};

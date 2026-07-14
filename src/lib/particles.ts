import * as THREE from "three";

interface Cluster {
  position: [number, number, number];
  color: string;
}

export interface ParticleData {
  count: number;
  attrs: {
    aWave: Float32Array;
    aHelix: Float32Array;
    aHelixTone: Float32Array;
    aNet: Float32Array;
    aLatent: Float32Array;
    aBrain: Float32Array;
    /** 0 = dim translucent cortex shell … 1 = bright internal structure. */
    aBrainTone: Float32Array;
    aClusterColor: Float32Array;
    aNetLayer: Float32Array;
    aSeed: Float32Array;
  };
}

const rand = (a = 0, b = 1) => a + Math.random() * (b - a);
const gauss = () => {
  // Box–Muller
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
};

/** ECG/EEG-ish y for a normalized position t∈[0,1] along the ribbon. */
function ecg(t: number): number {
  const eeg = 0.5 * Math.sin(t * 60) + 0.28 * Math.sin(t * 133 + 1.3);
  // periodic QRS spike
  const beat = (t * 7) % 1;
  let qrs = 0;
  if (beat > 0.46 && beat < 0.54) {
    const s = (beat - 0.5) / 0.04;
    qrs = (1 - Math.abs(s)) * 3.4 * Math.sign(0.5 - Math.abs(s) + 0.001);
  }
  return eeg + qrs;
}

/** Neural-net layer geometry. */
const LAYER_X = [-6, -3, 0, 3, 6];
const LAYER_N = [5, 8, 8, 5, 3];

function layerNodes(): { x: number; y: number; z: number; nx: number }[][] {
  const xmin = LAYER_X[0];
  const xmax = LAYER_X[LAYER_X.length - 1];
  return LAYER_X.map((x, li) => {
    const n = LAYER_N[li];
    const nodes = [];
    for (let i = 0; i < n; i++) {
      const spread = (n - 1) / 2;
      const y = (i - spread) * 1.15;
      const z = Math.sin(i * 1.7 + li) * 0.6;
      nodes.push({ x, y, z, nx: (x - xmin) / (xmax - xmin) });
    }
    return nodes;
  });
}

/**
 * Anatomical brain target, sagittal orientation (long axis on x, profile
 * facing the camera; hemispheres split across z). Five layers, mirroring the
 * classic "x-ray brain" look:
 *   1. dim translucent cortex shell (folded, fissured)
 *   2. bright branching vessel/dendrite trees filling the interior
 *   3. corpus-callosum swirl arcing over the center
 *   4. finely-striated cerebellum at the back-bottom
 *   5. brainstem descending below
 * `tone` per point: 0 = ghost shell … 1 = bright structure.
 */
function buildBrainTarget(count: number): { pos: Float32Array; tone: Float32Array } {
  const pos = new Float32Array(count * 3);
  const tone = new Float32Array(count);
  let idx = 0;
  const put = (x: number, y: number, z: number, t: number) => {
    if (idx >= count) return;
    pos[idx * 3] = x;
    pos[idx * 3 + 1] = y;
    pos[idx * 3 + 2] = z;
    tone[idx] = t;
    idx++;
  };

  const RX = 3.05; // anterior–posterior (profile length)
  const RY = 2.1; // height
  const RZ = 2.2; // lateral (depth toward camera)
  const inside = (x: number, y: number, z: number) =>
    (x * x) / (RX * RX) + ((y - 0.2) * (y - 0.2)) / (RY * RY) + (z * z) / (RZ * RZ) <= 0.94;

  const nShell = Math.floor(count * 0.43);
  const nTree = Math.floor(count * 0.33);
  const nCall = Math.floor(count * 0.1);
  const nCereb = Math.floor(count * 0.125);
  // remainder (~1.5%) → brainstem: sparse on purpose, additive blending
  // makes dense small volumes glow far brighter than intended

  // 1 ── cortex shell (dim)
  for (let i = 0; i < nShell; i++) {
    const u = Math.random() * Math.PI * 2;
    const v = Math.acos(2 * Math.random() - 1);
    const shell = 0.9 + Math.random() * 0.1;
    const dx = Math.sin(v) * Math.cos(u);
    const dy = Math.cos(v);
    const dz = Math.sin(v) * Math.sin(u);
    const fold =
      0.09 * Math.sin(dx * 8 + dy * 6) * Math.sin(dz * 7) +
      0.05 * Math.sin(dx * 14 - dy * 9);
    let x = dx * (RX + fold) * shell;
    let y = dy * (RY + fold) * shell + 0.2;
    let z = dz * (RZ + fold) * shell;
    // interhemispheric fissure now runs along z
    z += Math.sign(z) * Math.exp(-z * z * 14) * 0.2;
    // flatten the base a little (temporal lobes)
    if (y < -1.15) y = -1.15 + (y + 1.15) * 0.5;
    // taper the back-bottom quadrant to make room for the cerebellum
    if (x > 1.2 && y < -0.55) {
      x = 1.2 + (x - 1.2) * 0.62;
      y = -0.55 + (y + 0.55) * 0.62;
    }
    put(x, y, z, 0.16 + Math.random() * 0.12);
  }

  // 2 ── branching trees (bright): grown from central seeds outward
  const treeBudget = nTree;
  let treePlaced = 0;
  while (treePlaced < treeBudget) {
    // seed near the deep white matter, one per hemisphere at random
    const x = rand(-1.3, 1.1);
    const y = rand(-0.2, 0.7);
    const z = (Math.random() < 0.5 ? -1 : 1) * rand(0.15, 0.5);
    type Seg = { x: number; y: number; z: number; dx: number; dy: number; dz: number; depth: number; len: number };
    const stack: Seg[] = [];
    {
      const d = new THREE.Vector3(gauss(), gauss() + 0.5, gauss() * 0.45).normalize();
      stack.push({ x, y, z, dx: d.x, dy: d.y, dz: d.z, depth: 0, len: 0.8 });
    }
    while (stack.length && treePlaced < treeBudget) {
      const s = stack.pop()!;
      const steps = Math.max(3, Math.floor(s.len / 0.045));
      let px = s.x, py = s.y, pz = s.z;
      let alive = true;
      for (let st = 0; st < steps; st++) {
        px += s.dx * 0.045 + gauss() * 0.008;
        py += s.dy * 0.045 + gauss() * 0.008;
        pz += s.dz * 0.045 + gauss() * 0.008;
        if (!inside(px, py, pz)) { alive = false; break; }
        put(px + gauss() * 0.012, py + gauss() * 0.012, pz + gauss() * 0.012,
            Math.max(0.55, 1.0 - s.depth * 0.09));
        treePlaced++;
        if (treePlaced >= treeBudget) break;
      }
      if (alive && s.depth < 5) {
        const kids = Math.random() < 0.75 ? 2 : 1;
        for (let c = 0; c < kids; c++) {
          const dir = new THREE.Vector3(s.dx, s.dy, s.dz);
          const axis = new THREE.Vector3(gauss(), gauss(), gauss()).normalize();
          dir.applyAxisAngle(axis, rand(0.35, 0.8)).normalize();
          stack.push({ x: px, y: py, z: pz, dx: dir.x, dy: dir.y, dz: dir.z, depth: s.depth + 1, len: s.len * 0.78 });
        }
      }
    }
  }

  // 3 ── corpus-callosum swirl: nested arcs over the thalamus, curling at the end
  for (let i = 0; i < nCall; i++) {
    const arc = i % 3;
    const t = Math.random();
    const ang = Math.PI * 1.12 - t * Math.PI * 1.28; // ~202° → −29°
    let rx = 1.55 - arc * 0.24;
    let ry = 1.02 - arc * 0.16;
    // splenium curl: spiral inward near the posterior end
    if (t > 0.82) {
      const c = (t - 0.82) / 0.18;
      rx *= 1 - c * 0.55;
      ry *= 1 - c * 0.55;
    }
    put(
      0.12 + rx * Math.cos(ang) + gauss() * 0.03,
      0.42 + ry * Math.sin(ang) + gauss() * 0.03,
      gauss() * 0.12,
      0.92,
    );
  }

  // 4 ── cerebellum: bright, finely-banded folia
  for (let i = 0; i < nCereb; i++) {
    const u = Math.random() * Math.PI * 2;
    const v = Math.acos(2 * Math.random() - 1);
    const shell = 0.72 + Math.random() * 0.28;
    const dx = Math.sin(v) * Math.cos(u);
    const dy = Math.cos(v);
    const dz = Math.sin(v) * Math.sin(u);
    const band = 0.5 + 0.5 * Math.sin(Math.atan2(dy, dx) * 16);
    const ripple = 0.05 * Math.sin(16 * Math.atan2(dy, dx));
    put(
      1.85 + dx * (1.08 + ripple) * shell,
      -1.2 + dy * (0.82 + ripple) * shell,
      dz * 0.98 * shell,
      0.5 + band * 0.45,
    );
  }

  // 5 ── brainstem: slim, dimmer stalk descending from the midbrain —
  // a supporting detail, not a spotlight (v1 read as a bright funnel).
  while (idx < count) {
    const t = Math.random();
    const bx = 0.55 - 0.2 * t + 0.4 * t * t;
    const by = -0.85 - t * 1.3;
    const r = (1 - t * 0.5) * 0.15;
    const a = Math.random() * Math.PI * 2;
    put(bx + Math.cos(a) * r, by, Math.sin(a) * r * 0.8 + gauss() * 0.02, 0.45);
  }

  return { pos, tone };
}

/** Double-helix geometry: two backbone strands + discrete ladder rungs. */
const HELIX_SPAN = 22;
const HELIX_TURNS = 5.5;
const HELIX_R = 1.7;
const HELIX_RUNG_SLOTS = 34;

function helixAngle(t: number): number {
  return t * HELIX_TURNS * Math.PI * 2;
}

export function buildParticleData(
  count: number,
  clusters: Cluster[],
): ParticleData {
  const aWave = new Float32Array(count * 3);
  const aHelix = new Float32Array(count * 3);
  const aHelixTone = new Float32Array(count);
  const aNet = new Float32Array(count * 3);
  const aLatent = new Float32Array(count * 3);
  const aBrain = new Float32Array(count * 3);
  const aBrainTone = new Float32Array(count);
  const aClusterColor = new Float32Array(count * 3);
  const aNetLayer = new Float32Array(count);
  const aSeed = new Float32Array(count);

  const nodes = layerNodes();
  const cols = clusters.map((c) => new THREE.Color(c.color));

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const t = i / count;
    aSeed[i] = Math.random();

    // ── Wave ribbon ──────────────────────────────────────────────
    {
      const x = (t - 0.5) * HELIX_SPAN;
      const base = ecg(t);
      const lane = gauss() * 0.55;
      aWave[i3] = x;
      aWave[i3 + 1] = base + lane;
      aWave[i3 + 2] = gauss() * 0.7 + (i % 2 === 0 ? 0.5 : -0.5);
    }

    // ── Double helix (two backbone strands + ladder rungs) ───────
    // Reuses the same `t` as the wave ribbon so points slide continuously
    // in x while curling into the twist — the signal becomes code.
    {
      // 45% strand A, 45% strand B, 10% rungs — rungs are the minority so
      // they read as thin bridges, never a solid band.
      const role = i % 20;
      if (role < 9) {
        const angle = helixAngle(t);
        aHelix[i3] = (t - 0.5) * HELIX_SPAN;
        aHelix[i3 + 1] = HELIX_R * Math.cos(angle) + gauss() * 0.035;
        aHelix[i3 + 2] = HELIX_R * Math.sin(angle) + gauss() * 0.035;
        aHelixTone[i] = 0;
      } else if (role < 18) {
        const angle = helixAngle(t) + Math.PI;
        aHelix[i3] = (t - 0.5) * HELIX_SPAN;
        aHelix[i3 + 1] = HELIX_R * Math.cos(angle) + gauss() * 0.035;
        aHelix[i3 + 2] = HELIX_R * Math.sin(angle) + gauss() * 0.035;
        aHelixTone[i] = 1;
      } else {
        // Quantize to sparse, discrete rung slots so the ladder reads as
        // distinct bridges, not a continuous smear.
        const slotT = Math.round(t * HELIX_RUNG_SLOTS) / HELIX_RUNG_SLOTS;
        const angleA = helixAngle(slotT);
        const angleB = angleA + Math.PI;
        const ay = HELIX_R * Math.cos(angleA);
        const az = HELIX_R * Math.sin(angleA);
        const by = HELIX_R * Math.cos(angleB);
        const bz = HELIX_R * Math.sin(angleB);
        const f = Math.random();
        aHelix[i3] = (slotT - 0.5) * HELIX_SPAN + gauss() * 0.025;
        aHelix[i3 + 1] = ay + (by - ay) * f;
        aHelix[i3 + 2] = az + (bz - az) * f;
        aHelixTone[i] = 0.5;
      }
    }

    // ── Neural net (nodes + edges) ───────────────────────────────
    {
      const onEdge = Math.random() < 0.6;
      if (onEdge) {
        const li = Math.floor(rand(0, LAYER_X.length - 1));
        const a = nodes[li][Math.floor(rand(0, nodes[li].length))];
        const b =
          nodes[li + 1][Math.floor(rand(0, nodes[li + 1].length))];
        const tt = Math.random();
        aNet[i3] = a.x + (b.x - a.x) * tt + gauss() * 0.05;
        aNet[i3 + 1] = a.y + (b.y - a.y) * tt + gauss() * 0.05;
        aNet[i3 + 2] = a.z + (b.z - a.z) * tt + gauss() * 0.05;
        aNetLayer[i] = a.nx + (b.nx - a.nx) * tt;
      } else {
        const li = Math.floor(rand(0, LAYER_X.length));
        const nd = nodes[li][Math.floor(rand(0, nodes[li].length))];
        aNet[i3] = nd.x + gauss() * 0.18;
        aNet[i3 + 1] = nd.y + gauss() * 0.18;
        aNet[i3 + 2] = nd.z + gauss() * 0.18;
        aNetLayer[i] = nd.nx;
      }
    }

    // ── Latent clusters (4 = the 4 projects) ─────────────────────
    {
      const c = i % clusters.length;
      const centroid = clusters[c].position;
      const r = 0.55 + Math.abs(gauss()) * 0.55;
      const dir = new THREE.Vector3(gauss(), gauss(), gauss()).normalize();
      aLatent[i3] = centroid[0] + dir.x * r;
      aLatent[i3 + 1] = centroid[1] + dir.y * r;
      aLatent[i3 + 2] = centroid[2] + dir.z * r;
      const col = cols[c];
      aClusterColor[i3] = col.r;
      aClusterColor[i3 + 1] = col.g;
      aClusterColor[i3 + 2] = col.b;
    }

  }

  // Brain target is built as coherent layered structures (shell, trees,
  // callosum, cerebellum, brainstem) rather than per-particle sampling.
  const brain = buildBrainTarget(count);
  aBrain.set(brain.pos);
  aBrainTone.set(brain.tone);

  return {
    count,
    attrs: {
      aWave,
      aHelix,
      aHelixTone,
      aNet,
      aLatent,
      aBrain,
      aBrainTone,
      aClusterColor,
      aNetLayer,
      aSeed,
    },
  };
}

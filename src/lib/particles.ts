import * as THREE from "three";

interface Cluster {
  position: [number, number, number];
  color: string;
}

export interface ParticleData {
  count: number;
  attrs: {
    aWave: Float32Array;
    aNet: Float32Array;
    aLatent: Float32Array;
    aBrain: Float32Array;
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

export function buildParticleData(
  count: number,
  clusters: Cluster[],
): ParticleData {
  const aWave = new Float32Array(count * 3);
  const aNet = new Float32Array(count * 3);
  const aLatent = new Float32Array(count * 3);
  const aBrain = new Float32Array(count * 3);
  const aClusterColor = new Float32Array(count * 3);
  const aNetLayer = new Float32Array(count);
  const aSeed = new Float32Array(count);

  const nodes = layerNodes();
  const cols = clusters.map((c) => new THREE.Color(c.color));

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    aSeed[i] = Math.random();

    // ── Wave ribbon ──────────────────────────────────────────────
    {
      const t = i / count;
      const x = (t - 0.5) * 22;
      const base = ecg(t);
      const lane = gauss() * 0.55;
      aWave[i3] = x;
      aWave[i3 + 1] = base + lane;
      aWave[i3 + 2] = gauss() * 0.7 + (i % 2 === 0 ? 0.5 : -0.5);
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

    // ── Brain point cloud (two hemispheres + fissure) ────────────
    {
      const u = Math.random() * Math.PI * 2;
      const v = Math.acos(2 * Math.random() - 1);
      const shell = 0.86 + Math.random() * 0.14;
      const x = Math.sin(v) * Math.cos(u);
      const y = Math.cos(v);
      const z = Math.sin(v) * Math.sin(u);
      // cortical folding
      const fold = 0.12 * Math.sin(x * 6 + y * 5) * Math.sin(z * 6);
      const sx = 3.1 + fold;
      const sy = 2.3 + fold;
      const sz = 2.7 + fold;
      // longitudinal fissure: push points away from x≈0 plane
      const fissure = Math.sign(x) * Math.exp(-x * x * 12) * 0.18;
      aBrain[i3] = x * sx * shell + fissure;
      aBrain[i3 + 1] = y * sy * shell + 0.3;
      aBrain[i3 + 2] = z * sz * shell;
    }
  }

  return {
    count,
    attrs: { aWave, aNet, aLatent, aBrain, aClusterColor, aNetLayer, aSeed },
  };
}

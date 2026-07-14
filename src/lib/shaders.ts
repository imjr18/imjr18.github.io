/**
 * Morph shader for the particle spine. One material, five target position
 * attributes, blended by a single uProgress (0=wave,1=helix,2=net,3=latent,
 * 4=brain). Curl-noise turbulence swells while actively morphing (gated by
 * CPU-computed velocity, uSwarm) so points swarm rather than slide, and
 * settles the instant scroll stops. Additive soft round sprites, depth fade,
 * HR-centric pulse in the net state, pointer nudge in the wave/hero state.
 */

export const morphVert = /* glsl */ `
  uniform float uProgress;
  uniform float uTime;
  uniform float uPulse;
  uniform float uSize;
  uniform float uSizeScale;
  uniform float uPixelRatio;
  uniform float uSwarm;
  uniform vec3  uPointer;
  uniform float uPointerActive;

  attribute vec3 aWave;
  attribute vec3 aHelix;
  attribute float aHelixTone;
  attribute vec3 aNet;
  attribute vec3 aLatent;
  attribute vec3 aBrain;
  attribute vec3 aClusterColor;
  attribute float aNetLayer;
  attribute float aSeed;

  varying vec3  vColor;
  varying float vGlow;
  varying float vFade;

  // hash / value-noise based pseudo curl offset (cheap, GPU-friendly)
  vec3 hash3(vec3 p){
    p = vec3(dot(p,vec3(127.1,311.7,74.7)),
             dot(p,vec3(269.5,183.3,246.1)),
             dot(p,vec3(113.5,271.9,124.6)));
    return -1.0 + 2.0*fract(sin(p)*43758.5453123);
  }

  void main(){
    // Bracket the two active targets by state.
    vec3 pos;
    vec3 col;
    vec3 cWave = vec3(0.42, 0.78, 1.0);   // signal blue
    vec3 cNet  = vec3(0.29, 0.95, 0.63);  // phosphor
    vec3 cBrn  = vec3(0.35, 0.85, 0.78);  // teal
    // Helix backbone strands lean toward the states either side of them —
    // strand A toward signal-blue, strand B toward phosphor — so the color
    // story reads as a continuous thread, not a hard cut.
    vec3 cHelix = mix(cWave, cNet, aHelixTone);

    float g = 0.0; // extra glow

    if (uProgress < 1.0){
      float k = uProgress;
      pos = mix(aWave, aHelix, k);
      col = mix(cWave, cHelix, k);
    } else if (uProgress < 2.0){
      float k = uProgress - 1.0;
      pos = mix(aHelix, aNet, k);
      col = mix(cHelix, cNet, k);
    } else if (uProgress < 3.0){
      float k = uProgress - 2.0;
      pos = mix(aNet, aLatent, k);
      col = mix(cNet, aClusterColor, k);
    } else {
      float k = clamp(uProgress - 3.0, 0.0, 1.0);
      pos = mix(aLatent, aBrain, k);
      col = mix(aClusterColor, cBrn, k);
    }

    // Turbulence is gated by morph VELOCITY (uSwarm from the CPU), so points
    // swarm only while actively morphing and settle the moment scroll stops.
    vec3 noise = hash3(pos * 0.6 + aSeed + uTime * 0.15);
    pos += noise * uSwarm * 0.9;

    // Forward-pass pulse: light a travelling band across net layers
    // (net is state index 2 — window straddles its full transition-in/out).
    if (uProgress > 1.55 && uProgress < 2.55){
      float band = 1.0 - smoothstep(0.0, 0.14, abs(aNetLayer - uPulse));
      g += band * 0.9;
      col = mix(col, cNet, band * 0.6);
    }

    // Pointer nudge (hero/wave state only): bulge nearby points toward cursor.
    if (uPointerActive > 0.5 && uProgress < 0.9){
      vec3 d = pos - uPointer;
      float dist = length(d.xy);
      float infl = exp(-dist * dist * 0.9) * uPointerActive;
      pos.xy += normalize(d.xy + 0.0001) * infl * 0.6;
      pos.z += infl * 0.4;
      g += infl * 0.8;
    }

    vColor = col;
    vGlow = g;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    vFade = clamp(1.0 - (-mv.z - 4.0) / 18.0, 0.15, 1.0);

    gl_Position = projectionMatrix * mv;
    float sizeJitter = 0.7 + 0.6 * fract(aSeed * 1.37);
    gl_PointSize = uSize * uSizeScale * uPixelRatio * sizeJitter * (1.0 / -mv.z);
  }
`;

export const morphFrag = /* glsl */ `
  precision mediump float;
  varying vec3  vColor;
  varying float vGlow;
  varying float vFade;

  void main(){
    // soft round sprite
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    float alpha = smoothstep(0.5, 0.08, d);
    if (alpha < 0.01) discard;

    vec3 c = vColor + vGlow * vec3(0.4, 1.0, 0.7);
    // additive core highlight
    float core = smoothstep(0.28, 0.0, d);
    c += core * 0.35;

    gl_FragColor = vec4(c, alpha * vFade);
  }
`;

"use client";

import { useMemo, useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { buildParticleData } from "@/lib/particles";
import { morphVert, morphFrag } from "@/lib/shaders";
import { morphAt, MORPH } from "@/lib/timeline";
import { scrollBus } from "@/lib/scroll-bus";
import { projects } from "@/data/projects";

// Windows derived from the single-source timeline so they can't drift out
// of sync with the panel/card fades or the camera rig.
const NET_PULSE_WINDOW: [number, number] = [MORPH.toNet[0] - 0.02, MORPH.toLatent[1] + 0.01];
const HERO_POINTER_END = MORPH.toHelix[0] + 0.02;

const damp = THREE.MathUtils.damp;

export function ParticleField({ count }: { count: number }) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const { size, camera } = useThree();

  const clusters = useMemo(
    () => projects.map((p) => ({ position: p.cluster.position, color: p.cluster.color })),
    [],
  );

  const geometry = useMemo(() => {
    const data = buildParticleData(count, clusters);
    const g = new THREE.BufferGeometry();
    // Base position attribute (unused by shader math, but three needs it).
    g.setAttribute("position", new THREE.BufferAttribute(data.attrs.aWave.slice(), 3));
    g.setAttribute("aWave", new THREE.BufferAttribute(data.attrs.aWave, 3));
    g.setAttribute("aHelix", new THREE.BufferAttribute(data.attrs.aHelix, 3));
    g.setAttribute("aHelixTone", new THREE.BufferAttribute(data.attrs.aHelixTone, 1));
    g.setAttribute("aNet", new THREE.BufferAttribute(data.attrs.aNet, 3));
    g.setAttribute("aLatent", new THREE.BufferAttribute(data.attrs.aLatent, 3));
    g.setAttribute("aBrain", new THREE.BufferAttribute(data.attrs.aBrain, 3));
    g.setAttribute("aClusterColor", new THREE.BufferAttribute(data.attrs.aClusterColor, 3));
    g.setAttribute("aNetLayer", new THREE.BufferAttribute(data.attrs.aNetLayer, 1));
    g.setAttribute("aSeed", new THREE.BufferAttribute(data.attrs.aSeed, 1));
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 20);
    return g;
  }, [count, clusters]);

  const uniforms = useMemo(
    () => ({
      uProgress: { value: 0 },
      uTime: { value: 0 },
      uPulse: { value: -1 },
      uSize: { value: 26 },
      uSizeScale: { value: 1 },
      uPixelRatio: { value: 1 },
      uSwarm: { value: 0 },
      uPointer: { value: new THREE.Vector3(999, 999, 0) },
      uPointerActive: { value: 0 },
    }),
    [],
  );

  useEffect(() => {
    uniforms.uPixelRatio.value = Math.min(2, window.devicePixelRatio || 1);
  }, [uniforms]);

  // Pointer → world position on the z=0 plane (for the hero bulge).
  const pointer = useRef(new THREE.Vector3(999, 999, 0));
  const pointerActiveTarget = useRef(0);
  useEffect(() => {
    const ndc = new THREE.Vector2();
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const ray = new THREE.Raycaster();
    const hit = new THREE.Vector3();
    const onMove = (e: PointerEvent) => {
      ndc.x = (e.clientX / window.innerWidth) * 2 - 1;
      ndc.y = -(e.clientY / window.innerHeight) * 2 + 1;
      ray.setFromCamera(ndc, camera);
      if (ray.ray.intersectPlane(plane, hit)) {
        pointer.current.copy(hit);
        pointerActiveTarget.current = 1;
      }
    };
    const onLeave = () => (pointerActiveTarget.current = 0);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerout", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerout", onLeave);
    };
  }, [camera]);

  useFrame((state, dt) => {
    const m = matRef.current;
    if (!m) return;
    const u = m.uniforms;
    const p = scrollBus.progress.p;

    // Damp morph state toward the scroll-derived target (framerate-independent).
    const target = morphAt(p);
    u.uProgress.value = damp(u.uProgress.value, target, 6, dt);
    u.uTime.value = state.clock.elapsedTime;

    // Swarm turbulence tracks how far the morph still has to travel: it swells
    // while morphing and eases to 0 once the state settles (no perpetual jitter).
    const dist = Math.abs(target - u.uProgress.value);
    u.uSwarm.value = damp(u.uSwarm.value, Math.min(1, dist * 3), 9, dt);
    (window as unknown as { __cineSwarm?: number }).__cineSwarm = u.uSwarm.value;

    // Forward-pass pulse cycles while the net is on screen.
    if (p > NET_PULSE_WINDOW[0] && p < NET_PULSE_WINDOW[1]) {
      u.uPulse.value = (state.clock.elapsedTime * 0.35) % 1;
    } else {
      u.uPulse.value = -1;
    }

    // Pointer nudge only meaningful in the hero; ease active factor.
    u.uPointer.value.copy(pointer.current);
    const wantPointer = p < HERO_POINTER_END ? pointerActiveTarget.current : 0;
    u.uPointerActive.value = damp(u.uPointerActive.value, wantPointer, 5, dt);

    // Idle drift so rest states breathe.
    u.uSize.value = 24 + Math.sin(state.clock.elapsedTime * 0.6) * 1.5;

    // Wave + helix want small, crisp points so thin strands stay resolvable;
    // net/latent/brain read better as a soft volumetric cloud at full size.
    // Keyed off the damped morph value so it transitions smoothly with it.
    const sizeTarget = THREE.MathUtils.lerp(
      0.6,
      1.0,
      THREE.MathUtils.smoothstep(u.uProgress.value, 1.6, 2.2),
    );
    u.uSizeScale.value = damp(u.uSizeScale.value, sizeTarget, 5, dt);
  });

  useEffect(() => {
    uniforms.uPixelRatio.value = Math.min(2, window.devicePixelRatio || 1);
  }, [size, uniforms]);

  return (
    <points frustumCulled={false}>
      <primitive object={geometry} attach="geometry" />
      <shaderMaterial
        ref={matRef}
        args={[
          {
            uniforms,
            vertexShader: morphVert,
            fragmentShader: morphFrag,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
          },
        ]}
      />
    </points>
  );
}

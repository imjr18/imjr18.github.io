"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { scrollBus } from "@/lib/scroll-bus";
import { projects } from "@/data/projects";

const damp = THREE.MathUtils.damp;
const CARD_SPAN: [number, number] = [0.485, 0.805];

/**
 * Camera choreography driven by master scroll progress:
 *  wave   → fly along the ribbon
 *  net    → pull back to frame the whole graph
 *  latent → dolly cluster→cluster (one station per project)
 *  brain  → pull back and slowly orbit
 * Position + lookAt are damped every frame — never set from the scroll event.
 */
export function Rig() {
  const { camera } = useThree();
  const look = useRef(new THREE.Vector3(0, 0, 0));
  const tmpPos = useRef(new THREE.Vector3());
  const tmpLook = useRef(new THREE.Vector3());

  useFrame((state, dt) => {
    const p = scrollBus.progress.p;
    const pos = tmpPos.current;
    const lk = tmpLook.current;

    if (p < 0.18) {
      // Fly along the waveform.
      const k = p / 0.18;
      pos.set(-8 + k * 11, 1.2, 8.5);
      lk.set(-4 + k * 11, 0, 0);
    } else if (p < 0.44) {
      // Frame the neural net.
      const k = (p - 0.18) / 0.26;
      pos.set(Math.sin(k * 0.6) * 2, 0.6, 13.5 - k * 1.5);
      lk.set(0, 0, 0);
    } else if (p < CARD_SPAN[1]) {
      // Dolly across the latent clusters.
      const t = THREE.MathUtils.clamp(
        (p - CARD_SPAN[0]) / (CARD_SPAN[1] - CARD_SPAN[0]),
        0,
        1,
      );
      const f = t * (projects.length - 1);
      const i = Math.min(projects.length - 2, Math.floor(f));
      const frac = f - i;
      const a = projects[i].cluster.position;
      const b = projects[i + 1].cluster.position;
      const cx = a[0] + (b[0] - a[0]) * frac;
      const cy = a[1] + (b[1] - a[1]) * frac;
      const cz = a[2] + (b[2] - a[2]) * frac;
      // Sit in front of the current centroid, offset to the opposite side of the card.
      pos.set(cx * 0.55, cy * 0.5 + 0.4, 8.2);
      lk.set(cx, cy, cz);
    } else {
      // Brain: pull back with a slow orbit.
      const k = THREE.MathUtils.clamp((p - CARD_SPAN[1]) / (1 - CARD_SPAN[1]), 0, 1);
      const ang = state.clock.elapsedTime * 0.12;
      pos.set(Math.sin(ang) * (2 + k * 2), 0.8, 11 + k * 1.5);
      lk.set(0, 0.3, 0);
    }

    const lambda = 3.2;
    // Mutating the camera each frame is the documented R3F pattern.
    camera.position.x = damp(camera.position.x, pos.x, lambda, dt);
    camera.position.y = damp(camera.position.y, pos.y, lambda, dt);
    camera.position.z = damp(camera.position.z, pos.z, lambda, dt);
    look.current.x = damp(look.current.x, lk.x, lambda, dt);
    look.current.y = damp(look.current.y, lk.y, lambda, dt);
    look.current.z = damp(look.current.z, lk.z, lambda, dt);
    camera.lookAt(look.current);
  });

  return null;
}

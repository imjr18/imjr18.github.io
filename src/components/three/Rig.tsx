"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { scrollBus } from "@/lib/scroll-bus";
import { projects } from "@/data/projects";
import { MORPH, CARD_SPAN } from "@/lib/timeline";

const damp = THREE.MathUtils.damp;

/**
 * Camera choreography driven by master scroll progress:
 *  wave   → fly along the ribbon
 *  helix  → fly alongside the strand with a slow orbit that reveals the twist
 *  net    → pull back to frame the whole graph
 *  latent → dolly cluster→cluster (one station per project)
 *  brain  → pull back and slowly orbit
 * Position + lookAt are damped every frame — never set from the scroll event.
 * Segment boundaries come from lib/timeline.ts so the camera can never drift
 * out of sync with the morph state or the panel/card fades.
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

    if (p < MORPH.waveHold) {
      // Fly along the waveform.
      const k = p / MORPH.waveHold;
      pos.set(-8 + k * 4, 1.15, 8.3);
      lk.set(-4.5 + k * 4, 0, 0);
    } else if (p < MORPH.toNet[0]) {
      // True constant-radius orbit around the helix's own axis (not an
      // ellipse) — a lopsided orbit swings the camera from close-and-crisp
      // to far-and-washed-out as it revolves, which is what made some
      // angles of this shot fall apart before.
      const k = (p - MORPH.waveHold) / (MORPH.toNet[0] - MORPH.waveHold);
      const travelX = -4 + k * 10;
      const orbitR = 4.0;
      const ang = k * Math.PI * 2.4;
      pos.set(travelX, Math.sin(ang) * orbitR, Math.cos(ang) * orbitR);
      lk.set(travelX + 1.8, 0, 0);
    } else if (p < CARD_SPAN[0]) {
      // Pull back to frame the whole neural net.
      const k = (p - MORPH.toNet[0]) / (CARD_SPAN[0] - MORPH.toNet[0]);
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
      // Brain: sagittal profile faces the camera; gentle orbit for parallax
      // through the internal branching. Framed right-of-center beside the
      // About copy — the text scrim keeps the paragraph legible.
      const k = THREE.MathUtils.clamp((p - CARD_SPAN[1]) / (1 - CARD_SPAN[1]), 0, 1);
      const ang = state.clock.elapsedTime * 0.12;
      pos.set(Math.sin(ang) * (1.4 + k * 1.4), 0.5, 7.6 + k * 0.9);
      lk.set(-1.7, -0.05, 0);
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

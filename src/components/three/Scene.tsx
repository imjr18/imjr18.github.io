"use client";

import { ParticleField } from "./ParticleField";
import { Rig } from "./Rig";

/** Inner R3F content: the particle spine + camera rig. */
export function Scene({ count }: { count: number }) {
  return (
    <>
      <Rig />
      <ParticleField count={count} />
    </>
  );
}

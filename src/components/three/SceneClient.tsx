"use client";

import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import type { GlTier } from "@/lib/scroll-bus";
import { Scene } from "./Scene";

const COUNT: Record<Exclude<GlTier, "off">, number> = {
  full: 48000,
  lite: 16000,
};

/**
 * Canvas host. Owns render-tier count, first-frame ready signal, WebGL
 * context-loss fallback, and offscreen pausing (frameloop → never when the
 * cinematic section scrolls out of view → ~0% GPU).
 */
export function SceneClient({
  tier,
  onReady,
  onError,
}: {
  tier: GlTier;
  onReady: () => void;
  onError: () => void;
}) {
  const [paused, setPaused] = useState(false);
  const count = tier === "lite" ? COUNT.lite : COUNT.full;

  useEffect(() => {
    const onActive = (e: Event) => {
      const active = (e as CustomEvent<boolean>).detail;
      setPaused(!active);
    };
    window.addEventListener("cine-active", onActive as EventListener);
    return () => window.removeEventListener("cine-active", onActive as EventListener);
  }, []);

  if (tier === "off") return null;

  return (
    <Canvas
      style={{ width: "100%", height: "100%" }}
      dpr={tier === "lite" ? [1, 1.5] : [1, 2]}
      frameloop={paused ? "never" : "always"}
      gl={{
        powerPreference: "high-performance",
        antialias: false,
        alpha: true,
        failIfMajorPerformanceCaveat: false,
      }}
      camera={{ position: [-8, 1.2, 8.5], fov: 55, near: 0.1, far: 100 }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x070a0d, 0);
        const canvas = gl.domElement;
        const lost = (e: Event) => {
          e.preventDefault();
          onError();
        };
        canvas.addEventListener("webglcontextlost", lost, { once: true });
        // Report ready after the first frame is on screen.
        requestAnimationFrame(() => requestAnimationFrame(onReady));
      }}
    >
      <Scene count={count} />
    </Canvas>
  );
}

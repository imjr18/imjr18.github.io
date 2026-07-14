"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { readTier, type GlTier } from "@/lib/scroll-bus";
import { Preloader } from "@/components/three/Preloader";

// The 3D scene AND the scroll shell (GSAP + Lenis) are both code-split here, so
// none of them touch the initial landing bundle. Fallback devices never reach
// these imports because we gate on the pre-paint tier probe before calling them.
const SceneClient = dynamic(
  () => import("@/components/three/SceneClient").then((m) => m.SceneClient),
  { ssr: false },
);
const CinematicDirector = dynamic(
  () => import("./CinematicDirector").then((m) => m.CinematicDirector),
  { ssr: false },
);

/**
 * Client shell that decides — at runtime, after the pre-paint probe — whether
 * to upgrade the SSR'd document into the cinematic experience. Renders nothing
 * (keeping the pure HTML fallback) unless html.cinematic was set.
 */
export function CinematicClient() {
  const [tier, setTier] = useState<GlTier | null>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const t = readTier();
    setTier(t);
    if (t === "off") return;

    // Safety net: if the scene never reports ready in 6s, drop to fallback.
    const timeout = window.setTimeout(() => {
      setReady((r) => {
        if (!r) handleFallback();
        return r;
      });
    }, 6000);
    return () => window.clearTimeout(timeout);
  }, []);

  function handleReady() {
    setReady(true);
    document.documentElement.classList.add("gl-ready");
    try {
      sessionStorage.setItem("cine-seen", "1");
    } catch {}
  }

  function handleFallback() {
    // WebGL died or timed out: tear down and become the static document.
    setFailed(true);
    document.documentElement.classList.remove("cinematic", "gl-lite");
    document.documentElement.classList.add("no-cine");
  }

  if (tier === null || tier === "off" || failed) return null;

  return (
    <>
      <div id="gl-root" aria-hidden={!ready ? undefined : true}>
        <SceneClient tier={tier} onReady={handleReady} onError={handleFallback} />
      </div>
      <CinematicDirector />
      {!ready && <Preloader onSkip={handleReady} />}
    </>
  );
}

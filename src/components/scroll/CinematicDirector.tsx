"use client";

import { useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { scrollBus } from "@/lib/scroll-bus";
import { PANELS, CARDS, NAV_TARGETS } from "@/lib/timeline";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Smooth 0→1 ramp with hold: 0 before `a`, 1 after `b`, cubic-eased between. */
function ramp(p: number, a: number, b: number): number {
  if (p <= a) return 0;
  if (p >= b) return 1;
  const k = (p - a) / (b - a);
  return k * k * (3 - 2 * k);
}

const FADE = 0.03;

export function CinematicDirector() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const cine = document.getElementById("cine");
      if (!cine) return;

      ScrollTrigger.config({ ignoreMobileResize: true });

      const lenis = new Lenis({
        autoRaf: false,
        // Snappier catch-up + damped wheel input so trackpad inertia doesn't
        // overshoot far past where the gesture stopped.
        lerp: 0.11,
        wheelMultiplier: 0.8,
        touchMultiplier: 1.4,
      });
      lenis.on("scroll", ScrollTrigger.update);
      const tickerFn = (t: number) => lenis.raf(t * 1000);
      gsap.ticker.add(tickerFn);
      gsap.ticker.lagSmoothing(0);

      // Cache the driven elements once.
      const panels = {
        hero: document.getElementById("panel-hero"),
        work: document.getElementById("work"),
        about: document.getElementById("about"),
      };
      const cards = Array.from(
        document.querySelectorAll<HTMLElement>(".cine-card"),
      );

      const setPanel = (el: HTMLElement | null, o: number) => {
        if (!el) return;
        el.style.opacity = o.toFixed(3);
        el.style.visibility = o < 0.02 ? "hidden" : "visible";
      };

      function apply(p: number) {
        scrollBus.progress.p = p;
        // Lightweight introspection hook (used by e2e driver; harmless in prod).
        (window as unknown as { __cineP?: number }).__cineP = p;

        // Panels crossfade in/out over their windows.
        setPanel(
          panels.hero,
          1 - ramp(p, PANELS.hero.out - FADE, PANELS.hero.out),
        );
        setPanel(
          panels.work,
          ramp(p, PANELS.work.in, PANELS.work.in + FADE) *
            (1 - ramp(p, PANELS.work.out - FADE, PANELS.work.out)),
        );
        setPanel(panels.about, ramp(p, PANELS.about.in, PANELS.about.in + FADE));

        // Project cards appear as the camera dollies cluster→cluster.
        cards.forEach((el, i) => {
          const w = CARDS[i];
          if (!w) return;
          const o =
            ramp(p, w.in, w.in + FADE) *
            (1 - ramp(p, w.out - FADE, w.out));
          el.style.opacity = o.toFixed(3);
          el.style.visibility = o < 0.02 ? "hidden" : "visible";
        });
      }

      apply(0);

      const master = ScrollTrigger.create({
        trigger: cine,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => apply(self.progress),
        onToggle: (self) => {
          scrollBus.active.v = self.isActive;
          // Fade the canvas out (and stop rendering) once the reader scrolls
          // past the cinematic container into the timeline/footer.
          document.documentElement.classList.toggle("cine-past", !self.isActive);
          window.dispatchEvent(
            new CustomEvent("cine-active", { detail: self.isActive }),
          );
        },
      });

      // Nav → scroll wiring, in terms of the master range or DOM offsets.
      scrollBus.scrollToSection = (id: string) => {
        if (id === "top") {
          lenis.scrollTo(0, { duration: 1.1 });
          return;
        }
        const frac = NAV_TARGETS[id];
        if (frac != null) {
          const st = master.start as number;
          const en = master.end as number;
          lenis.scrollTo(st + frac * (en - st), { duration: 1.2 });
          return;
        }
        const el = document.getElementById(id);
        if (el) lenis.scrollTo(el, { offset: -64, duration: 1.2 });
      };

      // Pin positions depend on layout; refresh after fonts settle.
      let cancelled = false;
      const refresh = () => !cancelled && ScrollTrigger.refresh();
      const t1 = window.setTimeout(refresh, 300);
      if (document.fonts?.ready) document.fonts.ready.then(refresh);

      scrollBus.teardown = () => {
        lenis.stop();
      };

      return () => {
        cancelled = true;
        window.clearTimeout(t1);
        gsap.ticker.remove(tickerFn);
        master.kill();
        lenis.destroy();
        scrollBus.scrollToSection = null;
        scrollBus.teardown = null;
      };
    },
    { scope },
  );

  return <div ref={scope} aria-hidden style={{ display: "contents" }} />;
}

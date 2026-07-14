# imjr18.github.io

Personal site for **Jawahar Ranganathan** — a cinematic, scroll-driven deep-learning portfolio.

A single real-time WebGL particle system morphs through the story as you scroll —
**biosignal waveform → neural-network forward pass → latent space (whose 4 clusters
are the 4 projects) → point-cloud brain** — over an SSR'd HTML layer. Deep-dive pages
are fast, paper-style documents with build-time math and syntax highlighting.

## Stack

- **Next.js 16** (App Router, `output: 'export'`) → static site on **GitHub Pages**
- **React 19.2**, **three 0.185**, **@react-three/fiber 9**, **@react-three/drei 10**
- **GSAP 3.15** + **ScrollTrigger** + **Lenis** (smooth scroll) via **@gsap/react**
- **MDX** deep-dives with **KaTeX** (math) + **rehype-pretty-code / Shiki** — rendered
  at build time, **zero client JS** for math/highlighting
- **Tailwind v4** (`@theme` tokens, no config file)

## Architecture notes

- **Tiered degradation.** A pre-paint probe (`layout.tsx`) sets `html.cinematic` /
  `html.gl-lite` / `html.no-cine` from `prefers-reduced-motion`, WebGL support, and
  device class **before** anything imports. The 3D scene *and* the scroll shell
  (GSAP + Lenis) are dynamically imported only when the probe opts in — fallback
  devices never download them.
- **LCP is the SSR'd hero `<h1>`**, never the canvas. The whole site is readable and
  recruiter-scannable with zero WebGL.
- **One particle system, one shader, four morph targets** (`lib/particles.ts`,
  `lib/shaders.ts`), interpolated by a single `uProgress`. The camera + morph are
  driven inside `useFrame` and damped toward a target — never set from scroll events.
- **Scroll → progress.** One master ScrollTrigger over `#cine` writes 0→1 progress to
  a plain module singleton (`lib/scroll-bus.ts`) that `useFrame` and the panel/card
  timeline read. Never `scrollY / docHeight`.
- **Single source of truth** for content: `src/data/*.ts` (typed). Deep-dive prose is
  MDX joined to `data/projects.ts` by slug.

## Develop

```bash
npm install
npm run dev            # http://localhost:3000
npm run build          # static export → ./out
npx serve out          # preview the production build
```

### Regenerate assets

```bash
node scripts/make-og.mjs             # public/og.png (1200×630 card)
node scripts/make-cv-placeholder.mjs # public/cv.pdf placeholder
node scripts/drive.mjs               # headless e2e (needs Chrome + puppeteer-core)
```

## Deploy

Push to `main`. GitHub → Settings → Pages → Source = **GitHub Actions**.
`.github/workflows/deploy.yml` builds and publishes `./out`. The repo must be public
and named exactly `imjr18.github.io`.

## ⚠ Blocking inputs before launch (placeholders in place)

1. **`public/cv.pdf`** — replace the generated placeholder with the real CV.
2. **Display email** — currently the personal Gmail (`data/site.ts`); confirm.
3. **Temple phrasing** — confirm whether the glucose repo may be described as
   Temple-related (`content/projects/glucose.mdx` rigor notes).

Optional, never fabricated: real figures (Clarke grid, CT overlays, MADDPG curves),
a rendered `poster-hero.webp` + intro clip (the hero currently uses a CSS-gradient
placeholder poster), headshot, concrete GoodFoods/ride-sharing numbers.

import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    // The imperative animation layer (React Three Fiber + rAF-driven canvases)
    // intentionally mutates live three objects inside useFrame and drives state
    // from effects. The React-Compiler-era hooks rules model neither pattern, so
    // they produce false positives here. These are the documented R3F idioms.
    files: [
      "src/components/three/**/*.{ts,tsx}",
      "src/components/scroll/CinematicClient.tsx",
      "src/components/projects/MetricStat.tsx",
      "src/components/projects/GlucoseMonitor.tsx",
      "src/lib/particles.ts",
    ],
    rules: {
      "react-hooks/immutability": "off",
      "react-hooks/set-state-in-effect": "off",
    },
  },
]);

export default eslintConfig;

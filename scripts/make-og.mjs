// Rasterizes the OG card SVG → public/og.png (1200×630) using sharp
// (already a Next dependency). Run: node scripts/make-og.mjs
import sharp from "sharp";
import { writeFileSync } from "node:fs";

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#070A0D"/>
      <stop offset="1" stop-color="#0D1318"/>
    </linearGradient>
    <linearGradient id="w" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#6BC7FF" stop-opacity="0"/>
      <stop offset="0.45" stop-color="#6BC7FF"/>
      <stop offset="0.55" stop-color="#4AF2A1"/>
      <stop offset="1" stop-color="#4AF2A1" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <g stroke="rgba(232,238,244,0.05)" stroke-width="1">
    ${Array.from({ length: 25 }, (_, i) => `<line x1="${i * 48}" y1="0" x2="${i * 48}" y2="630"/>`).join("")}
    ${Array.from({ length: 14 }, (_, i) => `<line x1="0" y1="${i * 48}" x2="1200" y2="${i * 48}"/>`).join("")}
  </g>
  <path d="M0 400 L300 400 L318 250 L336 540 L354 340 L372 400 L620 400 L642 300 L660 500 L678 400 L980 400 L1000 220 L1018 560 L1036 360 L1054 400 L1200 400"
        fill="none" stroke="url(#w)" stroke-width="2.5" opacity="0.5"/>
  <text x="80" y="150" font-family="monospace" font-size="26" letter-spacing="6" fill="#4AF2A1">CS + ECONOMICS · BITS PILANI</text>
  <text x="76" y="270" font-family="sans-serif" font-size="76" font-weight="700" fill="#E8EEF4">Jawahar Ranganathan</text>
  <text x="80" y="345" font-family="sans-serif" font-size="34" fill="#9AA8B5">I build learning systems that read the body</text>
  <text x="80" y="392" font-family="sans-serif" font-size="34" fill="#9AA8B5">and reason about the world.</text>
  <text x="80" y="560" font-family="monospace" font-size="24" fill="#5F6E7C">Biomedical DL · Multi-Agent RL · Agentic AI</text>
</svg>`;

const png = await sharp(Buffer.from(svg)).png().toBuffer();
writeFileSync(new URL("../public/og.png", import.meta.url), png);
console.log("wrote public/og.png", png.length, "bytes");

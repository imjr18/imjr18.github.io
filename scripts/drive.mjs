import puppeteer from "puppeteer-core";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const BASE = process.env.BASE || "http://localhost:4322";

async function run(label, opts, steps) {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: "new",
    args: ["--no-sandbox", "--use-gl=angle", "--use-angle=swiftshader", "--enable-webgl", "--ignore-gpu-blocklist"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  if (opts.reducedMotion) await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push("PAGEERROR: " + e.message));
  await page.goto(BASE + "/", { waitUntil: "networkidle0", timeout: 30000 });
  await new Promise((r) => setTimeout(r, 1500));
  const out = await steps(page);
  console.log(`\n[${label}]`);
  console.log("  html classes:", await page.evaluate(() => document.documentElement.className.split(" ").filter((c) => /cine|gl|no-/.test(c)).join(" ") || "(none)"));
  console.log("  " + out);
  console.log("  console errors:", errors.length ? errors.slice(0, 6) : "none");
  await browser.close();
  return errors;
}

const e1 = await run("FULL (WebGL on)", {}, async (page) => {
  const canvas = await page.$("#gl-root canvas");
  const glReady = await page.evaluate(() => document.documentElement.classList.contains("gl-ready"));
  const h = await page.evaluate(() => document.getElementById("cine")?.offsetHeight || 0);

  // Drive with REAL wheel events (small steps) so Lenis + ScrollTrigger advance
  // slowly enough to catch each narrow card window.
  await page.mouse.move(720, 450);
  const seenCards = new Set();
  const morphStates = new Set();
  let maxProg = 0;
  for (let i = 0; i < 220; i++) {
    await page.mouse.wheel({ deltaY: 120 });
    await new Promise((r) => setTimeout(r, 25));
    const s = await page.evaluate(() => {
      const vis = [...document.querySelectorAll(".cine-card")]
        .filter((el) => getComputedStyle(el).visibility === "visible" && +getComputedStyle(el).opacity > 0.4)
        .map((el) => el.getAttribute("data-card"));
      const panels = ["panel-hero", "work", "about"].filter((id) => {
        const el = document.getElementById(id);
        return el && getComputedStyle(el).visibility === "visible" && +getComputedStyle(el).opacity > 0.5;
      });
      return { p: window.__cineP ?? 0, vis, panels };
    });
    maxProg = Math.max(maxProg, s.p);
    s.vis.forEach((c) => seenCards.add(c));
    s.panels.forEach((p) => morphStates.add(p));
  }
  return `canvas: ${!!canvas} · gl-ready: ${glReady} · cine: ${h}px · max p: ${maxProg.toFixed(2)} · panels seen: {${[...morphStates].join(",")}} · distinct cards revealed: {${[...seenCards].sort().join(",")}} (want 01,02,03,04)`;
});

const e2 = await run("FALLBACK (reduced-motion)", { reducedMotion: true }, async (page) => {
  const canvas = await page.$("#gl-root canvas");
  const cls = await page.evaluate(() => document.documentElement.className);
  const headline = await page.$eval("h1", (el) => el.textContent?.slice(0, 30));
  const cardsInFlow = await page.evaluate(() => document.querySelectorAll(".cine-card").length);
  return `canvas mounted: ${!!canvas} (want false) · has no-cine: ${/no-cine/.test(cls)} · headline: "${headline}..." · cards in DOM: ${cardsInFlow}`;
});

const total = e1.length + e2.length;
console.log(`\n=== ${total === 0 ? "PASS — no console errors" : total + " console errors total"} ===`);
process.exit(total === 0 ? 0 : 1);

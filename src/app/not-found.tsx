import Link from "next/link";

export default function NotFound() {
  return (
    <main
      id="main"
      className="graph-paper flex min-h-screen flex-col items-center justify-center px-6 text-center"
    >
      <p className="font-mono text-[13px] uppercase tracking-[0.2em] text-alert">
        ERROR 404 — SIGNAL LOST
      </p>
      <h1 className="mt-4 font-display text-[clamp(2.5rem,10vw,6rem)] font-600 leading-none text-ink0">
        404
      </h1>
      <p className="mt-4 max-w-[42ch] text-ink1">
        That route isn&apos;t in the manifest. The trace may have been moved or
        never existed.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 border border-hairline px-5 py-2.5 font-mono text-[12px] uppercase tracking-[0.1em] text-phosphor transition-colors hover:border-phosphor"
      >
        ← return to index
      </Link>
    </main>
  );
}

import { site } from "@/data/site";

export function Footer() {
  return (
    <footer className="border-t border-hairline">
      <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-2 px-5 py-8 font-mono text-[11px] text-ink2 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <span>
          © 2026 Jawahar Ranganathan · built with Next.js + React Three Fiber ·
          hosted on GitHub Pages
        </span>
        <a
          href={`${site.github}/tree/main`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-phosphor"
        >
          view source →
        </a>
      </div>
    </footer>
  );
}

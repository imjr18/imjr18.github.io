"use client";

import Link from "next/link";
import { scrollBus } from "@/lib/scroll-bus";

const LINKS = [
  { id: "work", label: "work" },
  { id: "about", label: "about" },
  { id: "experience", label: "experience" },
  { id: "contact", label: "contact" },
];

export function Nav() {
  const go = (e: React.MouseEvent, id: string) => {
    // In cinematic mode the director installs a progress-based scroller;
    // otherwise fall back to native anchor scrolling.
    if (scrollBus.scrollToSection) {
      e.preventDefault();
      scrollBus.scrollToSection(id);
    }
  };

  return (
    <nav className="fixed inset-x-0 top-0 z-40 border-b border-hairline bg-bg0/70 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-[1120px] items-center justify-between px-5 py-3 sm:px-8">
        <Link
          href="/"
          className="font-mono text-[13px] font-500 tracking-[0.02em] text-ink0"
          onClick={(e) => go(e, "top")}
        >
          <span className="text-phosphor">&gt;</span> jr
        </Link>
        <ul className="flex items-center gap-5 sm:gap-7">
          {LINKS.map((l) => (
            <li key={l.id}>
              <a
                href={`#${l.id}`}
                onClick={(e) => go(e, l.id)}
                className="font-mono text-[12px] uppercase tracking-[0.08em] text-ink1 transition-colors hover:text-phosphor"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

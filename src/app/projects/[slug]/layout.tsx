// KaTeX CSS is imported HERE (not in the root layout) so math styling and its
// self-hosted fonts only ship on deep-dive routes. Next bundles the woff2 files
// into _next/static — no external requests.
import "katex/dist/katex.min.css";

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

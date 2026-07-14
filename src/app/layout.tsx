import type { Metadata } from "next";
import { Space_Grotesk, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import { site } from "@/data/site";
import { PersonJsonLd } from "@/components/seo/PersonJsonLd";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-sans",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: "%s — Jawahar Ranganathan",
  },
  description: site.description,
  authors: [{ name: site.name, url: site.url }],
  openGraph: {
    type: "website",
    siteName: site.name,
    title: site.title,
    description: site.description,
    url: site.url,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: site.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
    images: ["/og.png"],
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
};

/**
 * Pre-paint probe: decides the render tier BEFORE React hydrates or the 3D
 * chunk imports. Sets html.cinematic / html.gl-lite so CSS + the SceneClient
 * gate on it. Fallback devices never even fetch the 3D bundle.
 */
const TIER_PROBE = `(function(){
  try {
    var d = document.documentElement;
    var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var replay = false;
    try { replay = sessionStorage.getItem('cine-seen') === '1'; } catch(e){}
    var gl = false;
    try {
      var c = document.createElement('canvas');
      gl = !!(window.WebGL2RenderingContext && c.getContext('webgl2'));
    } catch(e){ gl = false; }
    var cores = navigator.hardwareConcurrency || 4;
    var narrow = window.matchMedia && window.matchMedia('(max-width: 640px)').matches;
    var lowEnd = cores <= 4;
    if (reduced || !gl) { d.classList.add('no-cine'); return; }
    d.classList.add('cinematic');
    if (narrow || lowEnd) d.classList.add('gl-lite');
    if (replay) d.classList.add('cine-replay');
  } catch(e){ document.documentElement.classList.add('no-cine'); }
})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${plexSans.variable} ${plexMono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: TIER_PROBE }} />
        <PersonJsonLd />
      </head>
      <body>
        <div className="aurora" aria-hidden />
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}

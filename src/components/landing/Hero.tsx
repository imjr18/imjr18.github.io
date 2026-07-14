import { site } from "@/data/site";
import { GitHubIcon, LinkedInIcon, MailIcon, DownloadIcon } from "@/components/ui/icons";

/** SSR'd hero — this h1 is the LCP element, never the canvas. */
export function Hero() {
  return (
    <div className="cine-scrim mx-auto w-full max-w-[1120px] px-5 sm:px-8">
      <p className="font-mono text-[13px] uppercase tracking-[0.22em] text-phosphor">
        {site.kicker}
      </p>
      <h1 className="mt-5 max-w-[16ch] text-balance font-display text-[clamp(2.1rem,6.2vw,4.6rem)] font-semibold leading-[1.02] tracking-[-0.03em] text-ink0">
        I build learning systems that{" "}
        <span className="bg-linear-to-r from-signal to-phosphor bg-clip-text text-transparent">
          read the body
        </span>{" "}
        and reason about the world.
      </h1>
      <p className="mt-6 max-w-[62ch] text-[clamp(1rem,1.6vw,1.15rem)] leading-relaxed text-ink1">
        {site.subline}
      </p>
      <div className="mt-8 flex flex-wrap items-center gap-4">
        <IconLink href={site.github} label="GitHub">
          <GitHubIcon className="h-[18px] w-[18px]" />
        </IconLink>
        <IconLink href={site.linkedin} label="LinkedIn">
          <LinkedInIcon className="h-[18px] w-[18px]" />
        </IconLink>
        <IconLink href={`mailto:${site.email}`} label="Email" external={false}>
          <MailIcon className="h-[18px] w-[18px]" />
        </IconLink>
        <a
          href={site.cv}
          className="group inline-flex items-center gap-2 border border-hairline px-4 py-2 font-mono text-[12px] uppercase tracking-[0.1em] text-ink1 transition-colors hover:border-phosphor hover:text-phosphor"
        >
          <DownloadIcon className="h-4 w-4" />
          download cv
        </a>
      </div>
      <p className="mt-10 hidden font-mono text-[11px] uppercase tracking-[0.16em] text-ink2 md:block">
        scroll to begin{" "}
        <span className="inline-block animate-pulse text-phosphor">↓</span>
      </p>
    </div>
  );
}

function IconLink({
  href,
  label,
  children,
  external = true,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      {...(external
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
      className="flex h-10 w-10 items-center justify-center border border-hairline text-ink1 transition-colors hover:border-phosphor hover:text-phosphor"
    >
      {children}
    </a>
  );
}

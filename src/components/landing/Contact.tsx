"use client";

import { useState } from "react";
import { site, emailParts } from "@/data/site";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GitHubIcon, LinkedInIcon, MailIcon, DownloadIcon } from "@/components/ui/icons";

/** Email assembled on interaction so it isn't a plain scrapeable mailto in the HTML. */
export function Contact() {
  const [email, setEmail] = useState<string | null>(null);
  const reveal = () => setEmail(`${emailParts.user}@${emailParts.domain}`);

  return (
    <section
      id="contact"
      className="mx-auto w-full max-w-[1120px] px-5 pb-24 pt-4 sm:px-8"
    >
      <SectionHeading index="06" label="CONTACT" />
      <div className="mt-8 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="max-w-[46ch] font-display text-[clamp(1.4rem,3vw,2rem)] font-500 leading-tight text-ink0">
            Open to research and engineering roles in ML.
          </p>
          <a
            href={email ? `mailto:${email}` : undefined}
            onMouseEnter={reveal}
            onFocus={reveal}
            onClick={reveal}
            className="mt-4 inline-block font-mono text-[14px] text-phosphor hover:underline"
          >
            {email ?? `${emailParts.user} [at] ${emailParts.domain}`}
          </a>
        </div>

        <div className="flex items-center gap-3">
          <Social href={site.github} label="GitHub"><GitHubIcon className="h-[18px] w-[18px]" /></Social>
          <Social href={site.linkedin} label="LinkedIn"><LinkedInIcon className="h-[18px] w-[18px]" /></Social>
          <button
            onMouseEnter={reveal}
            onFocus={reveal}
            onClick={() => {
              reveal();
              window.location.href = `mailto:${emailParts.user}@${emailParts.domain}`;
            }}
            aria-label="Email"
            className="flex h-10 w-10 items-center justify-center border border-hairline text-ink1 transition-colors hover:border-phosphor hover:text-phosphor"
          >
            <MailIcon className="h-[18px] w-[18px]" />
          </button>
          <a
            href={site.cv}
            aria-label="Download CV"
            className="flex h-10 w-10 items-center justify-center border border-hairline text-ink1 transition-colors hover:border-phosphor hover:text-phosphor"
          >
            <DownloadIcon className="h-[18px] w-[18px]" />
          </a>
        </div>
      </div>
    </section>
  );
}

function Social({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center border border-hairline text-ink1 transition-colors hover:border-phosphor hover:text-phosphor"
    >
      {children}
    </a>
  );
}

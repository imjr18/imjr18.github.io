export type ProjectSlug =
  | "glucose"
  | "lesion"
  | "ridesharing"
  | "goodfoods"
  | "protein";

export interface Metric {
  value: string;
  label: string;
  /** Rendered as a small mono footnote under the stat — honesty caveats live here. */
  caveat?: string;
  /** If set, MetricStat counts up to this number (prefix/suffix derived from `value`). */
  countTo?: number;
}

export interface ProjectLink {
  label: string;
  href: string;
}

export interface Project {
  slug: ProjectSlug;
  index: string;
  codename: string;
  title: string;
  domain: string;
  /** One-line thesis for the landing card. */
  thesis: string;
  /** Abstract paragraph for the deep-dive header — self-sufficient for skimmers. */
  abstract: string;
  metrics: Metric[];
  tags: string[];
  repo?: string;
  repoNote?: string;
  links?: ProjectLink[];
  cluster: {
    /** Hex color used for the latent-space cluster and card accents. */
    color: string;
    /** World-space centroid of this project's cluster in the 3D latent state. */
    position: [number, number, number];
  };
  og: { title: string; description: string };
}

export interface ExperienceEntry {
  role: string;
  org: string;
  period: string;
  location?: string;
  current?: boolean;
  bullets: string[];
}

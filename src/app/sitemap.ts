import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { projectSlugs } from "@/data/projects";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = [
    { url: `${site.url}/`, priority: 1 },
    ...projectSlugs.map((slug) => ({
      url: `${site.url}/projects/${slug}/`,
      priority: 0.8,
    })),
  ];
  return routes;
}

import { site } from "@/data/site";

export function PersonJsonLd() {
  const json = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    url: site.url,
    email: `mailto:${site.email}`,
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: site.education.school,
    },
    knowsAbout: site.knowsAbout,
    sameAs: [site.github, site.linkedin],
    jobTitle: "Research Intern",
    worksFor: { "@type": "Organization", name: "Temple" },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}

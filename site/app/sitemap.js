import { content, siteUrl } from "../lib/content";
export const dynamic = "force-static";
export default function sitemap() {
  return [
    { url: siteUrl, changeFrequency: "monthly", priority: 1 },
    { url: `${siteUrl}/founder/`, changeFrequency: "yearly", priority: 0.7 },
    ...content.services
      .filter((s) => s.slug)
      .map((s) => ({
        url: `${siteUrl}/services/${s.slug}/`,
        changeFrequency: "monthly",
        priority: 0.7,
      })),
  ];
}

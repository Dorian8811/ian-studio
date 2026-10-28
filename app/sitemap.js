import { siteUrl } from "@/data/site";
import { actualizado, privacidad, terminos } from "@/data/legal";

export default function sitemap() {
  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    ...[privacidad, terminos].map((doc) => ({
      url: `${siteUrl}${doc.slug}`,
      lastModified: new Date(actualizado.iso),
      changeFrequency: "yearly",
      priority: 0.3,
    })),
  ];
}

import type { MetadataRoute } from "next";
import modelsData from "@/data/models.json";
import type { ModelsData } from "@/lib/types";
import { SITE, modelSlug } from "@/lib/seo";

const data = modelsData as ModelsData;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(data.lastUpdated);

  const homepage = {
    url: SITE.url,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 1.0,
  };

  const modelPages = data.models.map((m) => ({
    url: `${SITE.url}/${modelSlug(m.id)}`,
    lastModified: new Date(m.lastVerified),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [homepage, ...modelPages];
}

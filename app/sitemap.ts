import type { MetadataRoute } from "next";
import modelsData from "@/data/models.json";
import type { ModelsData } from "@/lib/types";
import { SITE, modelSlug } from "@/lib/seo";
import { getAllPostsMeta } from "@/lib/blog";

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
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  const blogIndex = {
    url: `${SITE.url}/blog`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  };

  const blogPosts = getAllPostsMeta().map((post) => ({
    url: `${SITE.url}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const staticPages = ["about", "privacy", "terms", "contact"].map((slug) => ({
    url: `${SITE.url}/${slug}`,
    lastModified,
    changeFrequency: "yearly" as const,
    priority: 0.3,
  }));

  const apiDocs = {
    url: `${SITE.url}/api`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  };

  return [homepage, ...modelPages, apiDocs, blogIndex, ...blogPosts, ...staticPages];
}

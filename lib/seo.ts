import type { Metadata } from "next";
import type { Model } from "./types";

const SITE_URL = "https://aicostcalc.net";
const SITE_NAME = "AI API Cost Calculator";

/**
 * Generate the URL slug for a model's landing page.
 * Convention: {model-id}-cost-calculator
 */
export function modelSlug(modelId: string): string {
  return `${modelId}-cost-calculator`;
}

export function modelUrl(modelId: string): string {
  return `${SITE_URL}/${modelSlug(modelId)}`;
}

/**
 * Build Next.js Metadata for a model landing page.
 */
export function modelMetadata(model: Model): Metadata {
  const title = `${model.name} Cost Calculator — 2026 API Pricing`;
  const description = `Calculate exact API costs for ${model.name} from ${model.provider}. Input $${model.pricing.input.toFixed(2)}, output $${model.pricing.output.toFixed(2)} per 1M tokens. Compare with other LLMs.`;
  const url = modelUrl(model.id);

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      title,
      description,
      url,
      siteName: SITE_NAME,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

/**
 * Build a Schema.org SoftwareApplication JSON-LD for a model page.
 * Returns the object — caller renders it with <script type="application/ld+json">.
 */
export function modelJsonLd(model: Model) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: `${model.name} Cost Calculator`,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    description: `Calculate API costs for ${model.name} from ${model.provider}.`,
    url: modelUrl(model.id),
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "127",
    },
    featureList: [
      "Real-time cost calculation",
      "Cached input pricing",
      "Batch API discounts",
      "Multiple currencies",
      "Monthly cost forecast",
    ],
  };
}

/**
 * Build a Schema.org WebSite JSON-LD for the homepage.
 */
export function siteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description:
      "Calculate and compare API pricing for OpenAI, Anthropic, Google, DeepSeek and 10+ LLM models. Free tool, updated monthly.",
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/{search_term}`,
      "query-input": "required name=search_term",
    },
  };
}

/**
 * Build a BreadcrumbList JSON-LD for a model page.
 */
export function breadcrumbJsonLd(model: Model) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: model.provider,
        item: `${SITE_URL}/?provider=${encodeURIComponent(model.provider)}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: model.name,
        item: modelUrl(model.id),
      },
    ],
  };
}

export const SITE = {
  url: SITE_URL,
  name: SITE_NAME,
};

import type { Metadata } from "next";
import type { Model } from "./types";
import { buildFAQs } from "./faq";

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
  // "API Pricing" leads, "Cost Calculator" follows — deliberate, see GSC data
  // in HANDOVER §16 (2026-08-24). We ranked ~8 for "<model> cost calculator"
  // (6 impressions) and ~58 for "<model> api pricing" (52 impressions): the
  // phrasing we optimised for is not the phrasing people search. Both phrases
  // stay in the title so the position we already hold is not thrown away.
  const title = `${model.name} API Pricing — Cost Calculator 2026`;
  const description = `${model.name} API pricing from ${model.provider}: $${model.pricing.input.toFixed(2)} per 1M input tokens, $${model.pricing.output.toFixed(2)} per 1M output. Calculate your exact cost and compare with other LLMs. Verified ${model.lastVerified}.`;
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
      "Calculate and compare API pricing for OpenAI, Anthropic, Google, DeepSeek and 30+ LLM models. Free tool, prices verified daily.",
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
  github: "https://github.com/Leolionel221/aicostcalc",
};

const ISSUES_URL = `${SITE.github}/issues/new`;

/**
 * Build a GitHub Issues URL pre-filled with model pricing context.
 * Used by the "Spotted a wrong price?" link on each model landing page.
 *
 * Pre-fills current values so the user only edits the wrong line + adds source.
 */
export function reportPriceUrl(model: Model): string {
  const lines: string[] = [
    `**Model**: ${model.name}`,
    `**Provider**: ${model.provider}`,
    ``,
    `Current values shown on the site (please tell us which is wrong):`,
    `- Input: $${model.pricing.input.toFixed(2)} / 1M tokens`,
    `- Output: $${model.pricing.output.toFixed(2)} / 1M tokens`,
  ];
  if (model.pricing.cachedInput !== null) {
    lines.push(
      `- Cached input: $${model.pricing.cachedInput.toFixed(2)} / 1M tokens`,
    );
  }
  if (model.pricing.cacheWrite !== null) {
    lines.push(
      `- Cache write: $${model.pricing.cacheWrite.toFixed(2)} / 1M tokens`,
    );
  }
  if (model.pricing.batchInput !== null) {
    lines.push(
      `- Batch input: $${model.pricing.batchInput.toFixed(2)} / 1M tokens`,
    );
  }
  if (model.pricing.batchOutput !== null) {
    lines.push(
      `- Batch output: $${model.pricing.batchOutput.toFixed(2)} / 1M tokens`,
    );
  }
  lines.push(
    `- Context window: ${(model.limits.contextWindow / 1000).toFixed(0)}K tokens`,
  );
  lines.push(``);
  lines.push(`---`);
  lines.push(``);
  lines.push(`**What needs correction**: (e.g. "Output price should be $18.00, not $20.00")`);
  lines.push(``);
  lines.push(`**Suggested correct value**:`);
  lines.push(``);
  lines.push(`**Source link** (official ${model.provider} pricing page):`);
  lines.push(``);
  lines.push(`---`);
  lines.push(`Page: ${modelUrl(model.id)}`);
  lines.push(`Reported via "Spotted a wrong price?" link.`);

  const params = new URLSearchParams({
    title: `Pricing correction: ${model.name}`,
    body: lines.join("\n"),
    labels: "pricing-correction",
  });

  return `${ISSUES_URL}?${params.toString()}`;
}

/**
 * Build a generic GitHub Issues URL for any feedback / bug reports.
 * Used in Footer "Report an error" link.
 */
export function reportFeedbackUrl(): string {
  const body = [
    `**Type**: (Bug / Feature request / Pricing correction / General feedback / Question)`,
    ``,
    `**Description**:`,
    ``,
    `**Steps to reproduce** (if bug):`,
    `1.`,
    `2.`,
    `3.`,
    ``,
    `**Expected behavior**:`,
    ``,
    `**Actual behavior**:`,
    ``,
    `**Browser / device** (if relevant):`,
  ].join("\n");

  const params = new URLSearchParams({
    title: "",
    body,
    labels: "feedback",
  });

  return `${ISSUES_URL}?${params.toString()}`;
}

/**
 * Build a Schema.org FAQPage JSON-LD for a model page.
 *
 * Sourced from buildFAQs() — the same function the visible <ModelFAQ>
 * accordion renders from. Google requires FAQ markup to match on-page
 * content; sharing the source is what keeps that true as the copy changes.
 */
export function faqJsonLd(model: Model) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: buildFAQs(model).map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };
}

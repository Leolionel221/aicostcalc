import type { NextConfig } from "next";
import modelsData from "./data/models.json";

/**
 * Model ids use dashes throughout ("gpt-5-6"), but the models are named with
 * dots ("GPT-5.6"). Anyone typing a URL by hand writes the dot.
 */
function dottedForm(id: string): string {
  return id.replace(/(\d)-(\d)/g, "$1.$2");
}

/**
 * Catch the URLs people actually try.
 *
 * A link check on 2026-08-25 found no broken internal links, yet the 404 page
 * was one of the most-viewed pages of the week. The misses are guesses from
 * outside: the bare model id, the dotted spelling of the model's real name, and
 * — now that page titles lead with "API Pricing" — the "-pricing" suffix.
 * None of these ever existed, so there is no link equity to preserve; the point
 * is simply that a reader who guesses close enough should land on the page.
 */
function modelAliasRedirects() {
  const canonical = (id: string) => `/${id}-cost-calculator`;
  const out: { source: string; destination: string; permanent: boolean }[] = [];
  const seen = new Set<string>();

  const add = (source: string, destination: string) => {
    if (source === destination || seen.has(source)) return;
    seen.add(source);
    out.push({ source, destination, permanent: true });
  };

  for (const { id } of modelsData.models) {
    const target = canonical(id);
    add(`/${id}`, target);
    add(`/${id}-pricing`, target);
    add(`/${id}-api-pricing`, target);

    const dotted = dottedForm(id);
    if (dotted !== id) {
      add(`/${dotted}`, target);
      add(`/${dotted}-cost-calculator`, target);
      add(`/${dotted}-pricing`, target);
      add(`/${dotted}-api-pricing`, target);
    }
  }
  return out;
}

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // 2026-05-12 data realignment: renamed slugs after switching from
      // projected pricing to LiteLLM-verified real model data.
      // Preserve SEO link equity via 301 permanent redirects.
      {
        source: "/gemini-3-0-pro-cost-calculator",
        destination: "/gemini-3-1-pro-cost-calculator",
        permanent: true,
      },
      {
        source: "/gemini-3-0-flash-cost-calculator",
        destination: "/gemini-3-flash-cost-calculator",
        permanent: true,
      },
      {
        source: "/deepseek-v4-cost-calculator",
        destination: "/deepseek-v3-2-cost-calculator",
        permanent: true,
      },

      // Section-style paths people try before finding the real navigation.
      { source: "/models", destination: "/#compare", permanent: true },
      { source: "/pricing", destination: "/#compare", permanent: true },
      { source: "/calculator", destination: "/#calculator", permanent: true },

      ...modelAliasRedirects(),
    ];
  },
};

export default nextConfig;

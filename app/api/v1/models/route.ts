import { NextResponse } from "next/server";
import modelsData from "@/data/models.json";
import type { ModelsData, Model } from "@/lib/types";

const data = modelsData as ModelsData;

/**
 * GET /api/v1/models
 *
 * Returns the full list of all supported AI models with their pricing,
 * capabilities, and metadata.
 *
 * Optional query filters:
 *   ?provider=openai        - filter by provider id (case-insensitive)
 *   ?category=flagship      - filter by category (flagship / small / reasoning / balanced)
 *   ?capability=vision      - filter by supported capability (vision / tools / caching / batch / etc.)
 *   ?status=active          - filter by lifecycle status
 *
 * Filters compose with AND logic.
 *
 * Free to use. No authentication required. Rate-limited by Vercel CDN.
 *
 * Data source: Verified against LiteLLM's public model registry
 * (github.com/BerriAI/litellm) and each provider's official pricing page.
 * Reconciled against the LiteLLM registry daily; see scripts/sync-prices.mjs.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const provider = searchParams.get("provider")?.toLowerCase();
  const category = searchParams.get("category")?.toLowerCase();
  const capability = searchParams.get("capability")?.toLowerCase();
  const status = searchParams.get("status")?.toLowerCase();

  let filtered: Model[] = data.models;

  if (provider) {
    filtered = filtered.filter(
      (m) => m.providerId.toLowerCase() === provider,
    );
  }
  if (category) {
    filtered = filtered.filter((m) => m.category.toLowerCase() === category);
  }
  if (capability) {
    filtered = filtered.filter(
      (m) =>
        (m.supports as unknown as Record<string, unknown>)[capability] === true ||
        m.useCase.map((u) => u.toLowerCase()).includes(capability),
    );
  }
  if (status) {
    filtered = filtered.filter((m) => m.status.toLowerCase() === status);
  }

  return NextResponse.json(
    {
      schemaVersion: data.schemaVersion,
      lastUpdated: data.lastUpdated,
      count: filtered.length,
      filters: {
        provider: provider ?? null,
        category: category ?? null,
        capability: capability ?? null,
        status: status ?? null,
      },
      models: filtered,
      _meta: {
        dataSource:
          "LiteLLM public registry + provider official pricing pages",
        license: "MIT",
        documentation: "https://aicostcalc.net/api",
        reportError:
          "https://github.com/Leolionel221/aicostcalc/issues/new?labels=pricing-correction",
      },
    },
    {
      headers: {
        "Cache-Control": "public, max-age=3600, s-maxage=86400",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
      },
    },
  );
}

export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Max-Age": "86400",
    },
  });
}

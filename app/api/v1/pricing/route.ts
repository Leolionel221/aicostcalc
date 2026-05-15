import { NextResponse } from "next/server";
import modelsData from "@/data/models.json";
import type { ModelsData } from "@/lib/types";

const data = modelsData as ModelsData;

/**
 * GET /api/v1/pricing
 *
 * Lightweight pricing-only endpoint. Returns just the essential pricing
 * fields per model — useful for clients that only need cost data and
 * want a smaller payload than /api/v1/models.
 *
 * All prices are USD per 1M tokens.
 *
 * Optional query parameters:
 *   ?provider=openai  - filter by provider id
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const provider = searchParams.get("provider")?.toLowerCase();

  let models = data.models;
  if (provider) {
    models = models.filter((m) => m.providerId.toLowerCase() === provider);
  }

  return NextResponse.json(
    {
      lastUpdated: data.lastUpdated,
      currency: "USD",
      unit: "per_1m_tokens",
      count: models.length,
      models: models.map((m) => ({
        id: m.id,
        name: m.name,
        provider: m.provider,
        providerId: m.providerId,
        input: m.pricing.input,
        output: m.pricing.output,
        cachedInput: m.pricing.cachedInput,
        cacheWrite: m.pricing.cacheWrite,
        batchInput: m.pricing.batchInput,
        batchOutput: m.pricing.batchOutput,
        contextWindow: m.limits.contextWindow,
        maxOutput: m.limits.maxOutput,
      })),
      _meta: {
        dataSource:
          "LiteLLM public registry + provider official pricing pages",
        license: "MIT",
        fullData: "https://aicostcalc.net/api/v1/models",
        documentation: "https://aicostcalc.net/api",
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

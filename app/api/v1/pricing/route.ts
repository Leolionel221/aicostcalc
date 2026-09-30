import modelsData from "@/data/models.json";
import type { ModelsData } from "@/lib/types";
import { API_HEADERS, API_META, filterModels, preflight, readFilters } from "@/lib/api";

const data = modelsData as ModelsData;

/**
 * GET /api/v1/pricing
 *
 * Prices and limits only — a smaller payload than /api/v1/models. USD per 1M
 * tokens. Same filters as /models (provider, category, capability, status).
 *
 * Lifecycle fields are included on purpose. The docs suggest routing requests
 * to the cheapest capable model, and this endpoint used to return prices with
 * no way to tell that a model (e.g. Grok 4, retired 2026-05-15) no longer
 * accepts requests. Use `?status=active` to exclude retired models entirely.
 */
export async function GET(request: Request) {
  const filters = readFilters(new URL(request.url).searchParams);
  const models = filterModels(data.models, filters);

  return Response.json(
    {
      schemaVersion: data.schemaVersion,
      lastUpdated: data.lastUpdated,
      currency: "USD",
      unit: "per_1m_tokens",
      count: models.length,
      filters,
      models: models.map((m) => ({
        id: m.id,
        name: m.name,
        provider: m.provider,
        providerId: m.providerId,
        status: m.status,
        deprecatedAt: m.deprecatedAt,
        successorId: m.successorId,
        input: m.pricing.input,
        output: m.pricing.output,
        cachedInput: m.pricing.cachedInput,
        cacheWrite: m.pricing.cacheWrite,
        batchInput: m.pricing.batchInput,
        batchOutput: m.pricing.batchOutput,
        contextWindow: m.limits.contextWindow,
        maxOutput: m.limits.maxOutput,
      })),
      _meta: { ...API_META, fullData: "https://aicostcalc.net/api/v1/models" },
    },
    { headers: API_HEADERS },
  );
}

export const OPTIONS = preflight;

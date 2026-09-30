import modelsData from "@/data/models.json";
import type { ModelsData } from "@/lib/types";
import { API_HEADERS, API_META, filterModels, preflight, readFilters } from "@/lib/api";

const data = modelsData as ModelsData;

/**
 * GET /api/v1/models
 *
 * Every model with full data: pricing, limits, capabilities, lifecycle.
 *
 * Optional filters (AND-composed, case-insensitive):
 *   ?provider=openai   ?category=flagship   ?capability=vision   ?status=active
 *
 * Free, no auth. Reconciled against the LiteLLM registry daily
 * (scripts/sync-prices.mjs); new models are published the day they appear.
 */
export async function GET(request: Request) {
  const filters = readFilters(new URL(request.url).searchParams);
  const models = filterModels(data.models, filters);

  return Response.json(
    {
      schemaVersion: data.schemaVersion,
      lastUpdated: data.lastUpdated,
      count: models.length,
      filters,
      models,
      _meta: {
        ...API_META,
        changes: "https://aicostcalc.net/api/v1/changes",
        reportError:
          "https://github.com/Leolionel221/aicostcalc/issues/new?labels=pricing-correction",
      },
    },
    { headers: API_HEADERS },
  );
}

export const OPTIONS = preflight;

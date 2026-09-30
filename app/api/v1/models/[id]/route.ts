import modelsData from "@/data/models.json";
import type { ModelsData } from "@/lib/types";
import { API_HEADERS, API_META, preflight, resolveModel } from "@/lib/api";

const data = modelsData as ModelsData;

/**
 * GET /api/v1/models/{id}
 *
 * Full record for one model. Accepts the canonical dashed id ("gpt-6-luna")
 * and the dotted form people type from the model name ("gpt-6.luna",
 * "GPT-5.6"); see resolveModel in lib/api.ts. When a non-canonical form was
 * used, `_meta.resolvedFrom` says what was asked for — use `id` from then on.
 *
 * Unknown ids return 404 with the full list of valid ids.
 */
export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id: raw } = await context.params;
  const model = resolveModel(data.models, raw);

  if (!model) {
    return Response.json(
      {
        error: "Model not found",
        message: `No model with id "${raw}". See /api/v1/models for the full list.`,
        availableIds: data.models.map((m) => m.id),
      },
      { status: 404, headers: { "Access-Control-Allow-Origin": "*" } },
    );
  }

  return Response.json(
    {
      ...model,
      _meta: {
        ...API_META,
        schemaVersion: data.schemaVersion,
        ...(model.id !== raw ? { resolvedFrom: raw } : {}),
      },
    },
    { headers: API_HEADERS },
  );
}

export const OPTIONS = preflight;

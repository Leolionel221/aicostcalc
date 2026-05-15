import { NextResponse } from "next/server";
import modelsData from "@/data/models.json";
import type { ModelsData } from "@/lib/types";

const data = modelsData as ModelsData;

/**
 * GET /api/v1/models/{id}
 *
 * Returns the complete data record for a single model by its ID.
 *
 * Valid IDs (as of 2026-05-12):
 *   gpt-5-5, gpt-5-mini, o4-mini,
 *   claude-opus-4-7, claude-haiku-4-5,
 *   gemini-3-1-pro, gemini-3-flash,
 *   deepseek-v3-2, grok-4, mistral-large-3
 *
 * Returns 404 with error JSON if model not found.
 */
export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const model = data.models.find((m) => m.id === id);

  if (!model) {
    return NextResponse.json(
      {
        error: "Model not found",
        message: `No model with id "${id}". See /api/v1/models for the full list.`,
        availableIds: data.models.map((m) => m.id),
      },
      {
        status: 404,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      },
    );
  }

  return NextResponse.json(
    {
      ...model,
      _meta: {
        dataSource:
          "LiteLLM public registry + provider official pricing pages",
        license: "MIT",
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

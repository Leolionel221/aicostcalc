import modelsData from "@/data/models.json";
import type { ModelsData } from "@/lib/types";
import { API_HEADERS, API_META, preflight } from "@/lib/api";
import { buildChangeLog, changeTitle, type ChangeKind } from "@/lib/changes";

const data = modelsData as ModelsData;
const KINDS: ChangeKind[] = ["released", "added", "price-cut", "price-rise", "price-change"];

/**
 * GET /api/v1/changes
 *
 * New models and price changes, newest first — the JSON form of /changes and
 * /changes/rss.xml, for anyone who wants to be told when a price moves.
 *
 * Optional parameters:
 *   ?since=2026-09-01                     only events on or after this date
 *   ?kind=price-cut,price-rise            comma-separated subset of kinds
 *   ?provider=openai                      one provider
 *   ?limit=20                             1–500, default 100
 *
 * Our own data corrections are excluded; "added" means the day we started
 * listing a model, "released" the provider's release date. See lib/changes.ts.
 */
export async function GET(request: Request) {
  const p = new URL(request.url).searchParams;
  const since = p.get("since");
  const provider = p.get("provider")?.toLowerCase() || null;
  const kinds = p.get("kind")?.split(",").map((k) => k.trim()).filter(Boolean) ?? null;
  const limitRaw = Number(p.get("limit") ?? 100);
  const limit = Number.isFinite(limitRaw) ? Math.min(500, Math.max(1, Math.floor(limitRaw))) : 100;

  if (since && !/^\d{4}-\d{2}-\d{2}$/.test(since)) {
    return Response.json(
      { error: "Bad request", message: "`since` must be a date in YYYY-MM-DD form." },
      { status: 400, headers: { "Access-Control-Allow-Origin": "*" } },
    );
  }
  const unknown = kinds?.filter((k) => !KINDS.includes(k as ChangeKind));
  if (unknown?.length) {
    return Response.json(
      { error: "Bad request", message: `Unknown kind: ${unknown.join(", ")}.`, validKinds: KINDS },
      { status: 400, headers: { "Access-Control-Allow-Origin": "*" } },
    );
  }

  const events = buildChangeLog(data.models)
    .filter((e) => !since || e.date >= since)
    .filter((e) => !provider || e.providerId.toLowerCase() === provider)
    .filter((e) => !kinds || kinds.includes(e.kind))
    .slice(0, limit)
    .map((e) => ({
      date: e.date,
      kind: e.kind,
      modelId: e.modelId,
      modelName: e.modelName,
      provider: e.provider,
      providerId: e.providerId,
      input: e.input,
      output: e.output,
      before: e.before ?? null,
      callCostChange: e.callDelta ?? null,
      summary: changeTitle(e),
      url: `https://aicostcalc.net${e.href}`,
    }));

  return Response.json(
    {
      schemaVersion: data.schemaVersion,
      lastUpdated: data.lastUpdated,
      count: events.length,
      filters: { since, kind: kinds, provider, limit },
      events,
      _meta: { ...API_META, rss: "https://aicostcalc.net/changes/rss.xml" },
    },
    { headers: API_HEADERS },
  );
}

export const OPTIONS = preflight;

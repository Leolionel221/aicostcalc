import type { Model } from "./types";

/**
 * Shared pieces of the public JSON API (app/api/v1/*).
 *
 * Filtering lived inline in /models only, while the docs promised /pricing had
 * "the same filter support" — it accepted `provider` and silently ignored the
 * rest. One implementation now serves every list endpoint, so the docs and the
 * behaviour cannot drift apart again.
 */

export const API_HEADERS = {
  // Vercel purges its CDN on every deploy, and the daily price sync deploys,
  // so a 24h edge cache never serves data older than the latest sync.
  "Cache-Control": "public, max-age=3600, s-maxage=86400",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
} as const;

export const API_META = {
  dataSource: "LiteLLM public registry + provider official pricing pages",
  license: "MIT",
  documentation: "https://aicostcalc.net/api",
} as const;

export function preflight(): Response {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Max-Age": "86400",
    },
  });
}

export interface ModelFilters {
  provider: string | null;
  category: string | null;
  capability: string | null;
  status: string | null;
}

export function readFilters(params: URLSearchParams): ModelFilters {
  const get = (k: string) => params.get(k)?.trim().toLowerCase() || null;
  return {
    provider: get("provider"),
    category: get("category"),
    capability: get("capability"),
    status: get("status"),
  };
}

/** AND-composed filters. Unknown values simply match nothing. */
export function filterModels(models: Model[], f: ModelFilters): Model[] {
  return models.filter((m) => {
    if (f.provider && m.providerId.toLowerCase() !== f.provider) return false;
    if (f.category && m.category.toLowerCase() !== f.category) return false;
    if (f.status && m.status.toLowerCase() !== f.status) return false;
    if (f.capability) {
      const supports = m.supports as unknown as Record<string, unknown>;
      const key = Object.keys(supports).find((k) => k.toLowerCase() === f.capability);
      const viaSupports = key ? supports[key] === true : false;
      const viaUseCase = m.useCase.some((u) => u.toLowerCase() === f.capability);
      if (!viaSupports && !viaUseCase) return false;
    }
    return true;
  });
}

/**
 * Resolve the id forms people actually send.
 *
 * Model ids are dashed ("gpt-6-luna") but the names are dotted ("GPT-6 Luna",
 * "gpt-5.6"), and the website already redirects dotted URLs. The API returned
 * 404 for the same input. Accepted, in order: exact id; case-insensitive;
 * dots → dashes; a trailing "-cost-calculator" (a pasted page slug).
 */
export function resolveModel(models: Model[], raw: string): Model | undefined {
  const byId = new Map(models.map((m) => [m.id, m]));
  const decoded = (() => {
    try {
      return decodeURIComponent(raw);
    } catch {
      return raw;
    }
  })();
  const candidates = [
    decoded,
    decoded.toLowerCase(),
    decoded.toLowerCase().replace(/\./g, "-"),
    decoded.toLowerCase().replace(/\./g, "-").replace(/-cost-calculator$/, ""),
  ];
  for (const c of candidates) {
    const m = byId.get(c);
    if (m) return m;
  }
  return undefined;
}

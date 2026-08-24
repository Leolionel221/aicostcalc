import modelsData from "@/data/models.json";
import type { Model, ModelsData } from "./types";
import { calculateStandard } from "./calculator";

const data = modelsData as ModelsData;
const byId = new Map<string, Model>(data.models.map((m) => [m.id, m]));

/**
 * Live-data placeholders for blog markdown.
 *
 * Articles used to hard-code prices in prose and tables. Every one of the six
 * posts had drifted by 2026-08-24 — `claude-api-pricing-2026.md` still quoted a
 * batch price derived from the $15/$75 figure corrected back in May. Prose has
 * no way to notice the data moved, so the numbers are pulled at build time
 * instead of typed.
 *
 * Unresolvable tokens throw rather than render: a renamed model id should break
 * the build, not silently ship a page with `{{price:whatever}}` in it.
 */

function need(id: string, token: string): Model {
  const m = byId.get(id);
  if (!m) {
    throw new Error(
      `blog token ${token}: unknown model id "${id}". ` +
        `Valid ids: ${[...byId.keys()].join(", ")}`,
    );
  }
  return m;
}

function usd(n: number): string {
  return n >= 1 ? `$${n.toFixed(2)}` : `$${n.toFixed(2)}`;
}

function ctxLabel(tokens: number): string {
  return tokens >= 1_000_000
    ? `${(tokens / 1_000_000).toFixed(tokens % 1_000_000 === 0 ? 0 : 1)}M`
    : `${Math.round(tokens / 1000)}K`;
}

/** Single-call cost used for the cheapest ranking: 1000 in + 500 out. */
function callCost(m: Model): number {
  return calculateStandard(1000, 500, m).totalCost;
}

function cheapestTable(n: number): string {
  const rows = [...data.models]
    .map((m) => ({ m, c: callCost(m) }))
    .sort((a, b) => a.c - b.c)
    .slice(0, n);

  const head =
    "| # | Model | Provider | Cost / call | Input | Output |\n" +
    "|---|---|---|---|---|---|";
  const body = rows
    .map(
      ({ m, c }, i) =>
        `| ${i + 1} | **${m.name}** | ${m.provider} | $${c.toFixed(5)} | ` +
        `${usd(m.pricing.input)} | ${usd(m.pricing.output)} |`,
    )
    .join("\n");

  return `${head}\n${body}\n\n_Cost per call assumes 1,000 input + 500 output tokens. ` +
    `Prices verified ${data.lastUpdated} against the LiteLLM registry._`;
}

type Handler = (id: string, token: string) => string;

const HANDLERS: Record<string, Handler> = {
  name: (id, t) => need(id, t).name,
  in: (id, t) => usd(need(id, t).pricing.input),
  out: (id, t) => usd(need(id, t).pricing.output),
  price: (id, t) => {
    const p = need(id, t).pricing;
    return `${usd(p.input)} input / ${usd(p.output)} output per 1M tokens`;
  },
  pair: (id, t) => {
    const p = need(id, t).pricing;
    return `${usd(p.input)}/${usd(p.output)}`;
  },
  cached: (id, t) => {
    const p = need(id, t).pricing;
    if (p.cachedInput === null) {
      throw new Error(`blog token ${t}: ${id} has no cached input price`);
    }
    return usd(p.cachedInput);
  },
  "cache-write": (id, t) => {
    const p = need(id, t).pricing;
    if (p.cacheWrite === null) {
      throw new Error(`blog token ${t}: ${id} has no cache write price`);
    }
    return usd(p.cacheWrite);
  },
  "batch-pair": (id, t) => {
    const p = need(id, t).pricing;
    if (p.batchInput === null || p.batchOutput === null) {
      throw new Error(`blog token ${t}: ${id} has no batch pricing`);
    }
    return `${usd(p.batchInput)}/${usd(p.batchOutput)}`;
  },
  ctx: (id, t) => ctxLabel(need(id, t).limits.contextWindow),
  call: (id, t) => `$${callCost(need(id, t)).toFixed(5)}`,
};

const TOKEN_RE = /\{\{([a-z-]+)(?::([a-z0-9.-]+))?\}\}/gi;

/**
 * Replace {{token}} / {{token:model-id}} placeholders with live values.
 * Throws on any token this module does not know how to resolve.
 */
export function resolveBlogTokens(markdown: string): string {
  return markdown.replace(TOKEN_RE, (full, rawKind: string, arg?: string) => {
    const kind = rawKind.toLowerCase();

    if (kind === "updated") return data.lastUpdated;
    if (kind === "model-count") return String(data.models.length);
    if (kind === "cheapest-table") {
      const n = Number(arg ?? "10");
      if (!Number.isInteger(n) || n < 1 || n > data.models.length) {
        throw new Error(`blog token ${full}: bad row count "${arg}"`);
      }
      return cheapestTable(n);
    }

    const handler = HANDLERS[kind];
    if (!handler) throw new Error(`blog token ${full}: unknown token "${kind}"`);
    if (!arg) throw new Error(`blog token ${full}: missing model id`);
    return handler(arg, full);
  });
}

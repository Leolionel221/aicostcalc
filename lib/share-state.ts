import { ALL_CURRENCIES, type CurrencyCode } from "./currency";

/**
 * Calculator state ⇄ query string, so a configuration can be shared as a link.
 *
 * Read on mount from `window.location.search` rather than `useSearchParams`:
 * the calculator sits on statically generated pages, and `useSearchParams`
 * would push everything up to the nearest Suspense boundary into client-side
 * rendering — the calculator HTML search engines see today would disappear.
 *
 * Only values that differ from the defaults are written, so an untouched
 * calculator keeps a clean URL. Anything unparseable is ignored, never thrown:
 * a mangled link should open the calculator with defaults, not break it.
 */

export interface ShareState {
  modelId: string;
  inputTokens: string;
  outputTokens: string;
  cachingEnabled: boolean;
  cachedPortion: number;
  batchEnabled: boolean;
  currency: CurrencyCode;
}

export const SHARE_DEFAULTS = {
  inputTokens: "1000",
  outputTokens: "500",
  cachingEnabled: false,
  cachedPortion: 0.5,
  batchEnabled: false,
  currency: "USD" as CurrencyCode,
};

const MAX_TOKENS = 100_000_000;
const CURRENCIES = new Set<string>(ALL_CURRENCIES.map((c) => c.code));

function tokens(raw: string | null): string | undefined {
  if (raw === null || !/^\d{1,9}$/.test(raw)) return undefined;
  const n = Number(raw);
  return n <= MAX_TOKENS ? String(n) : undefined;
}

/** Parse what a link carries. Missing or invalid fields are simply absent. */
export function parseShareState(search: string, modelIds: readonly string[]): Partial<ShareState> {
  const p = new URLSearchParams(search);
  const out: Partial<ShareState> = {};

  const m = p.get("model");
  if (m && modelIds.includes(m)) out.modelId = m;

  const i = tokens(p.get("in"));
  if (i !== undefined) out.inputTokens = i;
  const o = tokens(p.get("out"));
  if (o !== undefined) out.outputTokens = o;

  const cache = p.get("cache");
  if (cache !== null && /^\d{1,3}$/.test(cache) && Number(cache) <= 100) {
    out.cachingEnabled = true;
    // The slider steps by 5%; snap so a hand-edited link can't leave it between ticks.
    out.cachedPortion = Math.round(Number(cache) / 5) * 0.05;
  }

  if (p.get("batch") === "1") out.batchEnabled = true;

  const cur = p.get("cur")?.toUpperCase();
  if (cur && CURRENCIES.has(cur)) out.currency = cur as CurrencyCode;

  return out;
}

/** Query string for the given state, "" when everything is default. */
export function serializeShareState(s: ShareState, defaultModelId: string | undefined): string {
  const p = new URLSearchParams();
  if (s.modelId !== defaultModelId) p.set("model", s.modelId);
  const i = tokens(s.inputTokens);
  if (i !== undefined && i !== SHARE_DEFAULTS.inputTokens) p.set("in", i);
  const o = tokens(s.outputTokens);
  if (o !== undefined && o !== SHARE_DEFAULTS.outputTokens) p.set("out", o);
  if (s.cachingEnabled) p.set("cache", String(Math.round(s.cachedPortion * 100)));
  if (s.batchEnabled) p.set("batch", "1");
  if (s.currency !== SHARE_DEFAULTS.currency) p.set("cur", s.currency);
  const qs = p.toString();
  return qs ? `?${qs}` : "";
}

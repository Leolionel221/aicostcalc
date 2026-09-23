import type { Model } from "./types";

/**
 * Display order for model pickers: grouped by provider, newest first within
 * each provider, retired models last.
 *
 * `data/models.json` is in insertion order, and the daily sync appends new
 * models to the end — so a picker that iterates the raw array shows Claude
 * Opus 5.5 twenty rows below Claude Opus 5, and every new release lands at the
 * very bottom. Ordering is a display concern, so it lives here rather than in
 * the data file, where the next auto-draft would undo any manual reordering.
 */

/** Provider order used across the site copy. Unknown providers sort after these. */
export const PROVIDER_ORDER = [
  "openai",
  "anthropic",
  "google",
  "deepseek",
  "xai",
  "mistral",
] as const;

const NEW_WINDOW_DAYS = 30;

/**
 * Best available "when did this model appear" date.
 *
 * Most auto-drafted models have no `releaseDate` (the registry does not carry
 * one), but every entry starts its price history on the day it was first
 * listed. The earlier of the two is the closest honest proxy for recency.
 */
export function firstSeen(model: Model): string {
  const listed = model.priceHistory[0]?.date;
  if (model.releaseDate && listed) {
    return model.releaseDate < listed ? model.releaseDate : listed;
  }
  return model.releaseDate ?? listed ?? "0000-00-00";
}

/**
 * Reference date for "New" badges: the most recent listing in the dataset.
 *
 * Deliberately not `new Date()`. Pickers and chips render on the server at
 * build time and again on the client; a wall-clock date can disagree between
 * the two and trip a hydration mismatch. The newest listing is identical on
 * both sides, and "new relative to the latest release we track" is the
 * meaning a reader wants anyway.
 */
export function latestListing(models: Model[]): string {
  let latest = "0000-00-00";
  for (const m of models) {
    const d = firstSeen(m);
    if (d > latest) latest = d;
  }
  return latest;
}

/** Listed within the last 30 days (relative to `today`, YYYY-MM-DD). */
export function isNew(model: Model, today: string): boolean {
  if (model.status === "deprecated") return false;
  const seen = Date.parse(firstSeen(model));
  const now = Date.parse(today);
  if (Number.isNaN(seen) || Number.isNaN(now)) return false;
  return now - seen <= NEW_WINDOW_DAYS * 86_400_000;
}

function providerRank(providerId: string): number {
  const i = (PROVIDER_ORDER as readonly string[]).indexOf(providerId);
  return i === -1 ? PROVIDER_ORDER.length : i;
}

export function sortForPicker(models: Model[]): Model[] {
  return [...models].sort((a, b) => {
    const p = providerRank(a.providerId) - providerRank(b.providerId);
    if (p !== 0) return p;
    // Providers outside PROVIDER_ORDER share a rank; keep each one contiguous.
    const byName = a.provider.localeCompare(b.provider);
    if (byName !== 0) return byName;
    const retiredA = a.status === "deprecated" ? 1 : 0;
    const retiredB = b.status === "deprecated" ? 1 : 0;
    if (retiredA !== retiredB) return retiredA - retiredB;
    const d = firstSeen(b).localeCompare(firstSeen(a));
    if (d !== 0) return d;
    // Same day: the pricier model is usually the flagship of the release.
    return b.pricing.output - a.pricing.output;
  });
}

export interface ModelGroup {
  providerId: string;
  provider: string;
  models: Model[];
}

export function groupForPicker(models: Model[]): ModelGroup[] {
  const groups: ModelGroup[] = [];
  for (const m of sortForPicker(models)) {
    const last = groups[groups.length - 1];
    if (last && last.providerId === m.providerId) last.models.push(m);
    else groups.push({ providerId: m.providerId, provider: m.provider, models: [m] });
  }
  return groups;
}

/* ------------------------------------------------------------------ */
/* Fuzzy search                                                        */
/* ------------------------------------------------------------------ */

/** Lowercase and drop everything but letters and digits: "GPT-5.6 Sol" -> "gpt56sol". */
const squash = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

function isSubsequence(needle: string, hay: string): boolean {
  let i = 0;
  for (let j = 0; j < hay.length && i < needle.length; j += 1) {
    if (hay[j] === needle[i]) i += 1;
  }
  return i === needle.length;
}

/**
 * Score a model against a free-text query, or return null for no match.
 *
 * Built for how people actually type model names: without punctuation
 * ("gpt6sol", "opus55"), in fragments ("sol"), with the provider ("claude
 * haiku", "deepseek flash"), or with gaps ("gm flsh"). Every whitespace-
 * separated term must match; a term scores highest as a prefix of the name,
 * then as a substring anywhere, then as an in-order subsequence.
 */
export function scoreModel(model: Model, query: string): number | null {
  const terms = query.trim().split(/\s+/).map(squash).filter(Boolean);
  if (!terms.length) return 0;

  const name = squash(model.name);
  const short = squash(model.shortName);
  const hay = squash(`${model.name} ${model.shortName} ${model.provider} ${model.id}`);
  let score = 0;

  for (const t of terms) {
    if (name.startsWith(t)) score += 30;
    else if (name.includes(t) || short.includes(t)) score += 20;
    else if (hay.includes(t)) score += 12;
    // Subsequence only against the model's own name. Run against the joined
    // name+provider+id string it matched far too much: "sol" found s-o-l
    // spread across "opus" and "anthropic" and surfaced Claude Opus 5.
    else if (t.length >= 2 && isSubsequence(t, name)) score += 4;
    else return null;
  }

  // The whole query read as one run is the strongest signal of intent.
  // Split into terms, "gpt 6" matched GPT-5.6 ("6" is inside "gpt56") as well
  // as GPT-6 Sol; squashed to "gpt6" it only fits the GPT-6 family.
  const whole = squash(query);
  if (whole.length > 1) {
    if (name.startsWith(whole)) score += 40;
    else if (name.includes(whole)) score += 25;
  }
  return score;
}

export function searchModels(models: Model[], query: string): Model[] {
  const ordered = sortForPicker(models);
  if (!query.trim()) return ordered;
  const rank = new Map(ordered.map((m, i) => [m.id, i]));
  return ordered
    .map((m) => ({ m, s: scoreModel(m, query) }))
    .filter((x): x is { m: Model; s: number } => x.s !== null)
    .sort((a, b) => b.s - a.s || rank.get(a.m.id)! - rank.get(b.m.id)!)
    .map((x) => x.m);
}

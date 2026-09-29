import type { Model } from "./types";
import { modelSlug } from "./seo";

/**
 * Change log derived from `priceHistory`: models appearing and prices moving.
 *
 * Built entirely from data the daily sync already writes, so the /changes page
 * and its RSS feed update themselves with every deploy — no one maintains them.
 *
 * Two honesty rules, because a change feed that overstates is worse than none:
 *
 *  - Entries noted "Corrected to match LiteLLM registry" were fixes to our own
 *    wrong data (2026-08-24), not price moves by a provider. They are skipped.
 *    The next real change on such a model is measured from the corrected value.
 *
 *  - A first entry noted "First listed…" is the day *we* added the model — the
 *    registry carries no release dates. It is reported as "added", never as
 *    "released". Only "Initial release" entries count as a release date.
 */

export type ChangeKind = "released" | "added" | "price-cut" | "price-rise" | "price-change";

export interface ChangeEvent {
  date: string; // YYYY-MM-DD
  kind: ChangeKind;
  modelId: string;
  modelName: string;
  provider: string;
  providerId: string;
  href: string;
  input: number;
  output: number;
  /** Previous prices, for price events. */
  before?: { input: number; output: number };
  /** Change in cost of a 1,000-in / 500-out call, as a fraction (-0.2 = 20% cheaper). */
  callDelta?: number;
}

const isCorrection = (note?: string) => /^Corrected to match/i.test(note ?? "");
const isListing = (note?: string) => /^First listed/i.test(note ?? "");
const callCost = (i: number, o: number) => (1000 / 1e6) * i + (500 / 1e6) * o;

export function buildChangeLog(models: Model[]): ChangeEvent[] {
  const events: ChangeEvent[] = [];

  for (const m of models) {
    const base = {
      modelId: m.id,
      modelName: m.name,
      provider: m.provider,
      providerId: m.providerId,
      href: `/${modelSlug(m.id)}`,
    };
    const [first, ...rest] = m.priceHistory;
    if (!first) continue;

    events.push({
      ...base,
      date: first.date,
      kind: isListing(first.note) ? "added" : "released",
      input: first.input,
      output: first.output,
    });

    let prev = { input: first.input, output: first.output };
    for (const h of rest) {
      const now = { input: h.input, output: h.output };
      if (isCorrection(h.note)) {
        prev = now; // our own fix — becomes the baseline, never an event
        continue;
      }
      if (now.input === prev.input && now.output === prev.output) continue;

      const before = callCost(prev.input, prev.output);
      const after = callCost(now.input, now.output);
      const delta = before > 0 ? after / before - 1 : 0;
      const cheaper = now.input <= prev.input && now.output <= prev.output;
      const dearer = now.input >= prev.input && now.output >= prev.output;

      events.push({
        ...base,
        date: h.date,
        kind: cheaper ? "price-cut" : dearer ? "price-rise" : "price-change",
        input: now.input,
        output: now.output,
        before: prev,
        callDelta: delta,
      });
      prev = now;
    }
  }

  // Newest first; on the same day, price moves before listings, then by name.
  const rank: Record<ChangeKind, number> = {
    "price-cut": 0, "price-rise": 0, "price-change": 0, released: 1, added: 1,
  };
  return events.sort(
    (a, b) =>
      b.date.localeCompare(a.date) ||
      rank[a.kind] - rank[b.kind] ||
      a.modelName.localeCompare(b.modelName),
  );
}

export function changeTitle(e: ChangeEvent): string {
  const usd = (n: number) => `$${n.toFixed(2)}`;
  switch (e.kind) {
    case "released":
      return `${e.modelName} released at ${usd(e.input)}/${usd(e.output)} per 1M tokens`;
    case "added":
      return `${e.modelName} added — ${usd(e.input)}/${usd(e.output)} per 1M tokens`;
    default: {
      const pct = Math.round(Math.abs(e.callDelta ?? 0) * 100);
      const verb = e.kind === "price-cut" ? "cut" : e.kind === "price-rise" ? "raised" : "changed";
      const tail = e.kind === "price-change" ? "" : ` (${pct}% ${e.kind === "price-cut" ? "cheaper" : "more"} per call)`;
      return `${e.modelName} price ${verb}: ${usd(e.before!.input)}/${usd(e.before!.output)} → ${usd(e.input)}/${usd(e.output)}${tail}`;
    }
  }
}

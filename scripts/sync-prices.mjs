#!/usr/bin/env node
/**
 * Daily reconciliation against the LiteLLM public registry.
 *
 * Why this exists: the monthly manual sync did not work. On 2026-08-24 an
 * ad-hoc check found four models carrying wrong prices — one of them
 * (deepseek-v4-flash) understated by 79%, and it was the model the affiliate
 * CTA pointed at. Nobody noticed because nothing was watching.
 *
 * Two jobs, deliberately separated by how much judgement they need:
 *
 *   Prices/limits of models we already list  -> mechanical, applied automatically.
 *   Models we do not list yet                -> needs a name, tagline, category,
 *                                               use cases. Reported, never invented.
 *
 * Guard rails, because auto-committing upstream data is only safe if a bad feed
 * cannot silently ship: any single price moving more than MAX_DELTA_PCT, or the
 * registry failing to parse, aborts the whole run and leaves the data untouched.
 *
 * Usage:
 *   node scripts/sync-prices.mjs            # report only, exit 0/1
 *   node scripts/sync-prices.mjs --write    # apply mechanical corrections
 */

import fs from "node:fs";
import path from "node:path";

const REGISTRY_URL =
  "https://raw.githubusercontent.com/BerriAI/litellm/main/model_prices_and_context_window.json";
const DATA_PATH = path.join(process.cwd(), "data", "models.json");
const MAX_DELTA_PCT = 60;
const WRITE = process.argv.includes("--write");

/**
 * Our model id -> the registry key that is authoritative for it.
 *
 * Explicit rather than inferred: registry keys are inconsistent across
 * providers ("gpt-5.6" vs "xai/grok-4.5" vs "gemini-3.1-pro-preview"), and a
 * fuzzy match that silently picks the wrong key is worse than no sync at all.
 * A model missing from this map is reported, not guessed at.
 */
const REGISTRY_KEYS = {
  "gpt-5-6": "gpt-5.6",
  "gpt-5-6-sol": "gpt-5.6-sol",
  "gpt-5-6-terra": "gpt-5.6-terra",
  "gpt-5-6-luna": "gpt-5.6-luna",
  "gpt-5-5": "gpt-5.5",
  "gpt-5-mini": "gpt-5-mini",
  "o4-mini": "o4-mini",
  "claude-opus-5": "claude-opus-5",
  "claude-fable-5": "claude-fable-5",
  "claude-opus-4-8": "claude-opus-4-8",
  "claude-sonnet-5": "claude-sonnet-5",
  "claude-opus-4-7": "claude-opus-4-7",
  "claude-haiku-4-5": "claude-haiku-4-5",
  "gemini-3-6-flash": "gemini-3.6-flash",
  "gemini-3-5-flash": "gemini-3.5-flash",
  "gemini-3-5-flash-lite": "gemini-3.5-flash-lite",
  "gemini-3-1-pro": "gemini-3.1-pro-preview",
  "gemini-3-flash": "gemini-3-flash-preview",
  "deepseek-v4-flash": "deepseek/deepseek-v4-flash",
  "deepseek-v3-2": "deepseek/deepseek-v3.2",
  "grok-4-5": "xai/grok-4.5",
  "grok-4": "xai/grok-4",
  "mistral-large-3": "mistral/mistral-large-3",
  "claude-mythos-5": "claude-mythos-5",
  "gpt-5-6-cyber": "gpt-5.6-cyber",
  "gemini-3-7-flash": "gemini-3.7-flash",
  "deepseek-v4-pro": "deepseek/deepseek-v4-pro",
  "grok-4-6": "xai/grok-4.6",
  "grok-4-3": "xai/grok-4.3",
  "gpt-5-5-pro": "gpt-5.5-pro",
  "gemini-3-1-flash-lite": "gemini-3.1-flash-lite",
};

/** Families worth watching for new releases, by registry key prefix. */
const WATCHED = [
  { label: "OpenAI", re: /^(gpt-[45]|o[34])[a-z0-9.\-]*$/i },
  { label: "Anthropic", re: /^claude-[a-z0-9.\-]+$/i },
  { label: "Google", re: /^gemini-[a-z0-9.\-]+$/i },
  { label: "DeepSeek", re: /^deepseek\/[a-z0-9.\-]+$/i },
  { label: "xAI", re: /^xai\/grok[a-z0-9.\-]*$/i },
  { label: "Mistral", re: /^mistral\/[a-z0-9.\-]+$/i },
];

/** Aliases, dated snapshots and preview duplicates — noise, not new models. */
const NOISE = /-(latest|beta|preview|exp|thinking)$|-\d{4}-\d{2}-\d{2}$|-\d{6,}$|^ft:/i;

/**
 * Deliberate out-of-scope decisions, with the reason each was made.
 * Without this the "new models" section reports ~80 rows every morning — mostly
 * previous generations — and a genuinely new release gets lost in the list.
 */
const IGNORE = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "data", "sync-ignore.json"), "utf8"),
).ignore.map((e) => ({ re: new RegExp(e.pattern, "i"), reason: e.reason }));

const per1M = (v) => (v == null ? null : Math.round(v * 1e6 * 1e4) / 1e4);
const pct = (from, to) => (from === 0 ? Infinity : Math.abs((to - from) / from) * 100);

async function fetchRegistry() {
  const res = await fetch(REGISTRY_URL, { headers: { "user-agent": "aicostcalc-sync" } });
  if (!res.ok) throw new Error(`registry fetch failed: HTTP ${res.status}`);
  const json = await res.json();
  const n = Object.keys(json).length;
  if (n < 1000) throw new Error(`registry looks truncated: only ${n} entries`);
  return json;
}

function diffModel(model, entry) {
  const changes = [];
  const push = (field, from, to) => {
    if (to == null || from === to) return;
    changes.push({ field, from, to });
  };
  push("pricing.input", model.pricing.input, per1M(entry.input_cost_per_token));
  push("pricing.output", model.pricing.output, per1M(entry.output_cost_per_token));
  if (model.pricing.cachedInput != null) {
    push("pricing.cachedInput", model.pricing.cachedInput, per1M(entry.cache_read_input_token_cost));
  }
  const ctx = entry.max_input_tokens ? Math.round(entry.max_input_tokens) : null;
  push("limits.contextWindow", model.limits.contextWindow, ctx);
  const out = entry.max_output_tokens ? Math.round(entry.max_output_tokens) : null;
  push("limits.maxOutput", model.limits.maxOutput, out);
  return changes;
}

function findNewModels(registry, today) {
  const known = new Set(Object.values(REGISTRY_KEYS));
  const out = [];
  for (const [key, entry] of Object.entries(registry)) {
    if (known.has(key) || NOISE.test(key)) continue;
    if (IGNORE.some((i) => i.re.test(key))) continue;
    if (!["chat", "responses"].includes(entry.mode)) continue;
    if (entry.input_cost_per_token == null || entry.output_cost_per_token == null) continue;
    if (entry.deprecation_date && entry.deprecation_date <= today) continue;
    const family = WATCHED.find((f) => f.re.test(key));
    if (!family) continue;
    out.push({
      key,
      provider: family.label,
      input: per1M(entry.input_cost_per_token),
      output: per1M(entry.output_cost_per_token),
      context: entry.max_input_tokens ? Math.round(entry.max_input_tokens) : null,
      deprecates: entry.deprecation_date ?? null,
    });
  }
  return out.sort((a, b) => a.provider.localeCompare(b.provider) || a.key.localeCompare(b.key));
}

function setPath(obj, dotted, value) {
  const parts = dotted.split(".");
  const last = parts.pop();
  let cur = obj;
  for (const p of parts) cur = cur[p];
  cur[last] = value;
}

async function main() {
  const today = new Date().toISOString().slice(0, 10);
  const registry = await fetchRegistry();
  const data = JSON.parse(fs.readFileSync(DATA_PATH, "utf8"));

  const drift = [];
  const unmapped = [];
  for (const model of data.models) {
    const key = REGISTRY_KEYS[model.id];
    if (!key) { unmapped.push(model.id); continue; }
    const entry = registry[key];
    if (!entry) { unmapped.push(`${model.id} (key "${key}" gone from registry)`); continue; }
    const changes = diffModel(model, entry);
    if (changes.length) drift.push({ model, changes });
  }

  // Abort before touching anything if a move looks implausible.
  const suspicious = [];
  for (const { model, changes } of drift) {
    for (const c of changes) {
      if (!c.field.startsWith("pricing")) continue;
      const delta = pct(c.from, c.to);
      if (delta > MAX_DELTA_PCT) {
        suspicious.push(`${model.id} ${c.field}: ${c.from} -> ${c.to} (${delta.toFixed(0)}%)`);
      }
    }
  }

  const news = findNewModels(registry, today);

  console.log(`## Price reconciliation — ${today}\n`);
  if (unmapped.length) {
    console.log(`### ⚠️ Unmapped models (${unmapped.length})\n`);
    unmapped.forEach((u) => console.log(`- ${u}`));
    console.log("");
  }
  if (drift.length) {
    console.log(`### Drift detected (${drift.length} models)\n`);
    console.log("| Model | Field | Site | Registry |");
    console.log("|---|---|---|---|");
    for (const { model, changes } of drift) {
      for (const c of changes) console.log(`| ${model.id} | ${c.field} | ${c.from} | ${c.to} |`);
    }
    console.log("");
  } else {
    console.log("### ✅ No drift — every listed model matches the registry\n");
  }
  if (news.length) {
    console.log(`### New models not on the site (${news.length})\n`);
    console.log("| Provider | Registry key | Input $/1M | Output $/1M | Context |");
    console.log("|---|---|---|---|---|");
    for (const n of news) {
      const ctx = n.context ? `${Math.round(n.context / 1000)}K` : "?";
      console.log(`| ${n.provider} | \`${n.key}\` | ${n.input} | ${n.output} | ${ctx} |`);
    }
    console.log("\n_Adding one needs a name, tagline, category and use cases — a human call, so these are reported rather than written._\n");
  }

  if (suspicious.length) {
    console.log("### 🛑 Aborted — implausible price movement\n");
    suspicious.forEach((s) => console.log(`- ${s}`));
    console.log(`\nNothing was written. A move over ${MAX_DELTA_PCT}% is more likely a bad upstream entry than a real price change; confirm against the provider's own pricing page, then apply by hand.\n`);
    process.exit(1);
  }

  if (WRITE && drift.length) {
    for (const { model, changes } of drift) {
      const before = { input: model.pricing.input, output: model.pricing.output };
      for (const c of changes) setPath(model, c.field, c.to);
      model.lastVerified = today;
      for (const s of model.sources) if (s.type === "community") s.fetchedAt = today;
      if (before.input !== model.pricing.input || before.output !== model.pricing.output) {
        model.priceHistory.push({
          date: today,
          input: model.pricing.input,
          output: model.pricing.output,
          note: `Automated sync with LiteLLM registry (was $${before.input}/$${before.output})`,
        });
      }
    }
    data.lastUpdated = today;
    fs.writeFileSync(DATA_PATH, `${JSON.stringify(data, null, 2)}\n`);
    console.log(`### Applied ${drift.length} correction(s) to data/models.json\n`);
  }

  process.exit(drift.length || news.length ? 1 : 0);
}

main().catch((err) => {
  console.error(`sync failed: ${err.message}`);
  process.exit(2);
});

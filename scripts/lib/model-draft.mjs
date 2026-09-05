/**
 * Derive a complete, honest model entry from a registry key + entry — or
 * refuse.
 *
 * Why this exists: the one lever this site has that demonstrably works is
 * being first on a new model (uncontested names land on page 1; contested
 * ones sit at 50-80 regardless of copy). The window is days. Yet the loop was
 * registry → Issue → wait for a human → hand-write copy → push, and the Issue
 * for gpt-6-astra sat unread for six days.
 *
 * Reading back the copy hand-written for the last ten models: all of it was
 * formulaic — price, context, per-call cost, delta vs predecessor. Nothing in
 * it came from anywhere but the registry. The only real judgement was the
 * display name, so that is the only thing allowed to fail closed here: a key
 * whose name cannot be derived by an explicit rule is reported, not published.
 *
 * Everything this produces is marked `draft` so the page says so and a human
 * can polish later. The point is the page exists on day one.
 */

const PROVIDERS = {
  openai:    { name: "OpenAI",    id: "openai",    logo: "/logos/openai.svg",    site: "https://openai.com",    encoder: "o200k_base" },
  anthropic: { name: "Anthropic", id: "anthropic", logo: "/logos/anthropic.svg", site: "https://anthropic.com", encoder: "approximate" },
  google:    { name: "Google",    id: "google",    logo: "/logos/google.svg",    site: "https://ai.google.dev", encoder: "approximate" },
  deepseek:  { name: "DeepSeek",  id: "deepseek",  logo: "/logos/deepseek.svg",  site: "https://deepseek.com",  encoder: "approximate" },
  xai:       { name: "xAI",       id: "xai",       logo: "/logos/xai.svg",       site: "https://x.ai",          encoder: "approximate" },
  mistral:   { name: "Mistral",   id: "mistral",   logo: "/logos/mistral.svg",   site: "https://mistral.ai",    encoder: "approximate" },
};

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const per1M = (v) => (v == null ? null : Math.round(v * 1e6 * 1e4) / 1e4);

/** Strip provider prefix and -preview/-latest suffixes; dots become dashes. */
export function deriveId(key) {
  return key
    .replace(/^(xai|deepseek|mistral|gemini)\//, "")
    .replace(/-(preview|latest)$/, "")
    .replace(/\./g, "-");
}

/**
 * Display name from a registry key. Returns null when no rule matches —
 * that is the fail-closed path and it is deliberate.
 */
export function deriveName(key) {
  const k = deriveId(key);
  let m;

  // gpt-5-6-sol -> GPT-5.6 Sol ; gpt-5-mini -> GPT-5 mini ; gpt-6-astra -> GPT-6 Astra
  if ((m = k.match(/^gpt-(\d+)(?:-(\d+))?(?:-([a-z]+))?$/))) {
    const ver = m[2] ? `${m[1]}.${m[2]}` : m[1];
    if (!m[3]) return `GPT-${ver}`;
    const suffix = m[3] === "mini" || m[3] === "nano" ? m[3] : cap(m[3]);
    return `GPT-${ver} ${suffix}`;
  }
  // o4-mini -> o4-mini (OpenAI keeps these lowercase)
  if ((m = k.match(/^o\d+(?:-(mini|pro))?$/))) return k;

  // claude-opus-4-8 -> Claude Opus 4.8 ; claude-fable-5-1 -> Claude Fable 5.1
  if ((m = k.match(/^claude-([a-z]+)-(\d+)(?:-(\d+))?$/))) {
    return `Claude ${cap(m[1])} ${m[3] ? `${m[2]}.${m[3]}` : m[2]}`;
  }

  // gemini-3-5-flash-lite -> Gemini 3.5 Flash Lite ; gemini-3-flash -> Gemini 3 Flash
  if ((m = k.match(/^gemini-(\d+)(?:-(\d+))?-([a-z]+)(?:-([a-z]+))?$/))) {
    const ver = m[2] ? `${m[1]}.${m[2]}` : m[1];
    return `Gemini ${ver} ${cap(m[3])}${m[4] ? ` ${cap(m[4])}` : ""}`;
  }

  // deepseek-v4-flash -> DeepSeek V4-Flash ; deepseek-v3-2 -> DeepSeek V3.2
  if ((m = k.match(/^deepseek-v(\d+)(?:-(\d+))?(?:-([a-z]+))?$/))) {
    if (m[3]) return `DeepSeek V${m[1]}-${cap(m[3])}`;
    return `DeepSeek V${m[2] ? `${m[1]}.${m[2]}` : m[1]}`;
  }

  // grok-4-6 -> Grok 4.6 ; grok-4 -> Grok 4
  if ((m = k.match(/^grok-(\d+)(?:-(\d+))?$/))) {
    return `Grok ${m[2] ? `${m[1]}.${m[2]}` : m[1]}`;
  }

  // mistral-large-3 -> Mistral Large 3
  if ((m = k.match(/^mistral-([a-z]+)-(\d+)(?:-(\d+))?$/))) {
    return `Mistral ${cap(m[1])} ${m[3] ? `${m[2]}.${m[3]}` : m[2]}`;
  }

  return null;
}

export function deriveProvider(key, entry) {
  const lp = String(entry.litellm_provider ?? "");
  if (key.startsWith("xai/") || lp === "xai") return PROVIDERS.xai;
  if (key.startsWith("deepseek/") || lp === "deepseek") return PROVIDERS.deepseek;
  if (key.startsWith("mistral/") || lp === "mistral") return PROVIDERS.mistral;
  if (key.startsWith("gemini") || lp.startsWith("vertex_ai") || lp === "gemini") return PROVIDERS.google;
  if (key.startsWith("claude") || lp === "anthropic") return PROVIDERS.anthropic;
  if (/^(gpt|o\d)/.test(key) || lp === "openai") return PROVIDERS.openai;
  return null;
}

/**
 * Category from per-call cost (1,000 in + 500 out). Thresholds calibrated on
 * the hand-labelled set: every "flagship" is ≥ $0.005/call, every "small" is
 * ≤ $0.0035. "reasoning" is reserved for the o-series and set by rule.
 */
export function deriveCategory(id, input, output) {
  if (/^o\d/.test(id)) return "reasoning";
  const call = 1000 / 1e6 * input + 500 / 1e6 * output;
  if (call >= 0.005) return "flagship";
  if (call >= 0.0036) return "balanced";
  return "small";
}

export function deriveUseCases(entry, ctx, category) {
  const uc = new Set(["general"]);
  if (entry.supports_reasoning) uc.add("reasoning");
  if (entry.supports_vision) uc.add("vision");
  if (entry.supports_audio_input) uc.add("audio");
  if (ctx >= 500_000) uc.add("long-context");
  if (category === "small") uc.add("fast");
  return [...uc];
}

const money = (x) => `$${x.toFixed(2)}`;
const ctxLabel = (n) => (n >= 1_000_000 ? "1M" : `${Math.round(n / 1000)}K`);

/**
 * Build a full entry, or return { reason } explaining why it cannot be built.
 * `models` is the current dataset, used to phrase a comparison against the
 * closest existing sibling from the same provider when there is one.
 */
export function buildDraft(key, entry, models, today) {
  const name = deriveName(key);
  if (!name) return { reason: `no naming rule matches "${key}"` };
  const provider = deriveProvider(key, entry);
  if (!provider) return { reason: `cannot determine provider for "${key}"` };

  const id = deriveId(key);
  if (models.some((m) => m.id === id)) return { reason: `id "${id}" already exists` };

  const input = per1M(entry.input_cost_per_token);
  const output = per1M(entry.output_cost_per_token);
  const ctx = Math.round(entry.max_input_tokens ?? 0);
  const maxOut = Math.round(entry.max_output_tokens ?? 0);
  if (!input || !output || !ctx || !maxOut) return { reason: `"${key}" is missing price or limit fields` };

  const cached = per1M(entry.cache_read_input_token_cost);
  const cacheWrite = per1M(entry.cache_creation_input_token_cost);
  const batchIn = per1M(entry.input_cost_per_token_batches);
  const batchOut = per1M(entry.output_cost_per_token_batches);
  const category = deriveCategory(id, input, output);
  const call = 1000 / 1e6 * input + 500 / 1e6 * output;

  // Closest sibling: same provider, nearest per-call cost. Gives the reader
  // one honest anchor without pretending to know lineage.
  const sibling = models
    .filter((m) => m.providerId === provider.id && m.status !== "deprecated")
    .map((m) => ({ m, c: 1000 / 1e6 * m.pricing.input + 500 / 1e6 * m.pricing.output }))
    .sort((a, b) => Math.abs(a.c - call) - Math.abs(b.c - call))[0]?.m;

  let cmpEn = "", cmpZh = "";
  if (sibling) {
    const sc = 1000 / 1e6 * sibling.pricing.input + 500 / 1e6 * sibling.pricing.output;
    if (Math.abs(sc - call) < 1e-9) {
      cmpEn = ` Same per-call cost as ${sibling.name}.`;
      cmpZh = `单次成本与 ${sibling.name} 相同。`;
    } else {
      const x = (call / sc).toFixed(2).replace(/\.?0+$/, "");
      cmpEn = ` That is ${x}x the per-call cost of ${sibling.name} (${money(sibling.pricing.input)}/${money(sibling.pricing.output)}).`;
      cmpZh = `单次成本是 ${sibling.name}（${money(sibling.pricing.input)}/${money(sibling.pricing.output)}）的 ${x} 倍。`;
    }
  }
  const cacheEn = cached != null ? ` Cached input ${money(cached)}/1M.` : "";
  const cacheZh = cached != null ? `缓存输入 ${money(cached)}/1M。` : "";

  return {
    model: {
      id, name,
      shortName: name.replace(/^(GPT-|Claude |Gemini |DeepSeek |Grok |Mistral )/, "").trim() || name,
      provider: provider.name, providerId: provider.id, providerLogo: provider.logo, providerWebsite: provider.site,
      category,
      useCase: deriveUseCases(entry, ctx, category),
      releaseDate: null, status: "active",
      deprecatedAt: entry.deprecation_date ?? null, successorId: null,
      pricing: { currency: "USD", unit: "per_1m_tokens", input, output, cachedInput: cached, cacheWrite,
        batchInput: batchIn, batchOutput: batchOut, imagePerImage: null, imageTokensFormula: null,
        reasoningOutput: null, fineTunedInput: null, fineTunedOutput: null },
      limits: { contextWindow: ctx, maxOutput: maxOut, maxImagesPerRequest: null, knowledgeCutoff: null },
      tokenization: { encoder: provider.encoder, approximationRatio: { english: 4, chinese: 1.5, code: 3 } },
      supports: { vision: !!entry.supports_vision, audio: !!entry.supports_audio_input,
        tools: !!entry.supports_function_calling, streaming: true, caching: !!entry.supports_prompt_caching,
        batch: batchIn != null, fineTuning: false, structuredOutput: !!entry.supports_response_schema },
      lastVerified: today,
      sources: [
        { type: "community", url: "https://github.com/BerriAI/litellm/blob/main/model_prices_and_context_window.json", fetchedAt: today },
        ...(entry.source ? [{ type: "official", url: entry.source, fetchedAt: today }] : []),
      ],
      priceHistory: [{ date: today, input, output, note: "First listed; auto-drafted from LiteLLM registry" }],
      i18n: {
        en: { tagline: `${name} — ${money(input)}/${money(output)} per 1M tokens, ${ctxLabel(ctx)} context`,
              description: `${name} is priced at ${money(input)} input / ${money(output)} output per 1M tokens, with a ${ctxLabel(ctx)} context window and ${ctxLabel(maxOut)} max output.${cacheEn}${cmpEn} A 1,000-in / 500-out call costs $${call.toFixed(5)}.` },
        zh: { tagline: `${name} —— 输入 ${money(input)} / 输出 ${money(output)}（每 1M token），${ctxLabel(ctx)} 上下文`,
              description: `${name} 定价为输入 ${money(input)} / 输出 ${money(output)}（每 1M token），${ctxLabel(ctx)} 上下文，${ctxLabel(maxOut)} 最大输出。${cacheZh}${cmpZh}一次 1000 输入 / 500 输出的调用约 $${call.toFixed(5)}。` },
      },
      draft: {
        generatedAt: today,
        note: "Auto-drafted from the LiteLLM registry the day it appeared. Prices and limits are registry values; the name follows a fixed rule; tagline and description are formulaic. Needs a human read for lineage, positioning and anything the registry cannot know.",
      },
    },
  };
}

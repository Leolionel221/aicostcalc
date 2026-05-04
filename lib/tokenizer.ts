import type { Model } from "./types";

// Character-ratio approximation. Used as a fallback when no tiktoken encoder
// is available for a model. See PRD v1.1 §2.2.
function approximateTokens(text: string, model: Model): number {
  const ratio = model.tokenization.approximationRatio;

  // Heuristic: detect Chinese / code / English mix.
  // V1.0 simplification — refine in V1.1.
  const chineseChars = (text.match(/[一-龥]/g) || []).length;
  const codeChars = (text.match(/[{}();=<>\[\]]/g) || []).length;
  const otherChars = text.length - chineseChars - codeChars;

  const tokens =
    chineseChars / ratio.chinese +
    codeChars / ratio.code +
    otherChars / ratio.english;

  return Math.ceil(tokens);
}

// Lazy-loaded tiktoken encoders. We dynamically import js-tiktoken only when
// an OpenAI-family model is selected, to keep the initial bundle light.
type TiktokenEncoder = { encode: (text: string) => number[] };
const encoderCache = new Map<string, TiktokenEncoder>();

async function loadTiktokenEncoder(name: string): Promise<TiktokenEncoder | null> {
  if (encoderCache.has(name)) {
    return encoderCache.get(name) ?? null;
  }
  try {
    const { getEncoding } = await import("js-tiktoken");
    // js-tiktoken exposes encoders by name: "cl100k_base", "o200k_base", etc.
    const encoder = getEncoding(name as Parameters<typeof getEncoding>[0]);
    encoderCache.set(name, encoder);
    return encoder;
  } catch {
    return null;
  }
}

export async function countTokens(
  text: string,
  model: Model,
): Promise<{ count: number; exact: boolean }> {
  if (!text) return { count: 0, exact: true };

  const encoderName = model.tokenization.encoder;
  if (encoderName !== "approximate") {
    const encoder = await loadTiktokenEncoder(encoderName);
    if (encoder) {
      return { count: encoder.encode(text).length, exact: true };
    }
  }
  return { count: approximateTokens(text, model), exact: false };
}

// Synchronous estimate (fallback) — used when async loading is undesirable
// (e.g. server-side static rendering). Always returns approximation.
export function estimateTokensSync(text: string, model: Model): number {
  return approximateTokens(text, model);
}

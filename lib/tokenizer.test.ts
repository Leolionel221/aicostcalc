import { describe, it, expect } from "vitest";
import { countTokens, estimateTokensSync } from "./tokenizer";
import type { Model } from "./types";

const baseModel: Model = {
  id: "test",
  name: "Test",
  shortName: "Test",
  provider: "Test",
  providerId: "test",
  providerLogo: "",
  providerWebsite: "",
  category: "flagship",
  useCase: [],
  releaseDate: "",
  status: "active",
  deprecatedAt: null,
  successorId: null,
  pricing: {
    currency: "USD",
    unit: "per_1m_tokens",
    input: 1,
    output: 1,
    cachedInput: null,
    cacheWrite: null,
    batchInput: null,
    batchOutput: null,
    imagePerImage: null,
    imageTokensFormula: null,
    reasoningOutput: null,
    fineTunedInput: null,
    fineTunedOutput: null,
  },
  limits: {
    contextWindow: 128000,
    maxOutput: 4096,
    maxImagesPerRequest: null,
    knowledgeCutoff: null,
  },
  tokenization: {
    encoder: "approximate",
    approximationRatio: { english: 4, chinese: 1.5, code: 3 },
  },
  supports: {
    vision: false,
    audio: false,
    tools: false,
    streaming: true,
    caching: false,
    batch: false,
    fineTuning: false,
    structuredOutput: false,
  },
  lastVerified: "",
  sources: [],
  priceHistory: [],
  i18n: {
    en: { tagline: "", description: "" },
    zh: { tagline: "", description: "" },
  },
};

const openaiModel: Model = {
  ...baseModel,
  tokenization: {
    encoder: "o200k_base",
    approximationRatio: { english: 4, chinese: 1.5, code: 3 },
  },
};

describe("estimateTokensSync (approximation)", () => {
  it("returns 0 for empty string", () => {
    expect(estimateTokensSync("", baseModel)).toBe(0);
  });

  it("approximates English text at ~4 chars/token", () => {
    // 16 chars / 4 = 4 tokens
    const text = "hello world test"; // 16 chars
    expect(estimateTokensSync(text, baseModel)).toBeGreaterThanOrEqual(3);
    expect(estimateTokensSync(text, baseModel)).toBeLessThanOrEqual(5);
  });

  it("approximates Chinese text at ~1.5 chars/token (denser)", () => {
    const chinese = "你好世界今天天气真好"; // 10 Chinese chars
    const tokens = estimateTokensSync(chinese, baseModel);
    // 10 / 1.5 ≈ 7 tokens
    expect(tokens).toBeGreaterThanOrEqual(6);
    expect(tokens).toBeLessThanOrEqual(8);
  });

  it("returns higher token count for longer input", () => {
    const short = estimateTokensSync("hi", baseModel);
    const long = estimateTokensSync("hi ".repeat(100), baseModel);
    expect(long).toBeGreaterThan(short);
  });
});

describe("countTokens (async with tiktoken fallback)", () => {
  it("returns 0 and exact=true for empty input", async () => {
    const result = await countTokens("", baseModel);
    expect(result.count).toBe(0);
    expect(result.exact).toBe(true);
  });

  it("uses approximation when encoder is 'approximate'", async () => {
    const result = await countTokens("hello world", baseModel);
    expect(result.exact).toBe(false);
    expect(result.count).toBeGreaterThan(0);
  });

  it("uses tiktoken for OpenAI models (exact=true)", async () => {
    const result = await countTokens("hello world", openaiModel);
    // Should be exact via js-tiktoken
    expect(result.exact).toBe(true);
    // "hello world" in o200k_base is typically 2 tokens
    expect(result.count).toBeGreaterThanOrEqual(1);
    expect(result.count).toBeLessThanOrEqual(3);
  });

  it("counts more tokens for longer text", async () => {
    const short = await countTokens("hi", openaiModel);
    const long = await countTokens("This is a much longer piece of text.", openaiModel);
    expect(long.count).toBeGreaterThan(short.count);
  });
});

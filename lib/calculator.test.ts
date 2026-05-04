import { describe, it, expect } from "vitest";
import {
  calculateStandard,
  calculateCached,
  calculateBatch,
  calculateCost,
  calculateComparison,
  estimateMonthlyCost,
} from "./calculator";
import type { Model } from "./types";

// ----- Test fixtures -----

const gpt4o: Model = {
  id: "gpt-4o",
  name: "GPT-4o",
  shortName: "GPT-4o",
  provider: "OpenAI",
  providerId: "openai",
  providerLogo: "/logos/openai.svg",
  providerWebsite: "https://openai.com",
  category: "flagship",
  useCase: ["general"],
  releaseDate: "2024-05-13",
  status: "active",
  deprecatedAt: null,
  successorId: null,
  pricing: {
    currency: "USD",
    unit: "per_1m_tokens",
    input: 2.5,
    output: 10.0,
    cachedInput: 1.25,
    cacheWrite: null,
    batchInput: 1.25,
    batchOutput: 5.0,
    imagePerImage: null,
    imageTokensFormula: null,
    reasoningOutput: null,
    fineTunedInput: null,
    fineTunedOutput: null,
  },
  limits: {
    contextWindow: 128000,
    maxOutput: 16384,
    maxImagesPerRequest: null,
    knowledgeCutoff: null,
  },
  tokenization: {
    encoder: "o200k_base",
    approximationRatio: { english: 4, chinese: 1.5, code: 3 },
  },
  supports: {
    vision: true,
    audio: false,
    tools: true,
    streaming: true,
    caching: true,
    batch: true,
    fineTuning: true,
    structuredOutput: true,
  },
  lastVerified: "2026-05-01",
  sources: [],
  priceHistory: [],
  i18n: {
    en: { tagline: "", description: "" },
    zh: { tagline: "", description: "" },
  },
};

// Model that does NOT support caching or batch (used to verify graceful fallback)
const noCacheNoBatch: Model = {
  ...gpt4o,
  id: "no-features",
  pricing: {
    ...gpt4o.pricing,
    cachedInput: null,
    batchInput: null,
    batchOutput: null,
  },
  supports: {
    ...gpt4o.supports,
    caching: false,
    batch: false,
  },
};

// ----- calculateStandard -----

describe("calculateStandard", () => {
  it("computes cost for 1M input + 1M output tokens (round numbers)", () => {
    const result = calculateStandard(1_000_000, 1_000_000, gpt4o);
    expect(result.inputCost).toBeCloseTo(2.5, 6);
    expect(result.outputCost).toBeCloseTo(10.0, 6);
    expect(result.totalCost).toBeCloseTo(12.5, 6);
  });

  it("scales linearly with smaller token counts", () => {
    const result = calculateStandard(1000, 500, gpt4o);
    // 1000 / 1M * 2.50 = 0.0025
    // 500  / 1M * 10.0 = 0.005
    expect(result.inputCost).toBeCloseTo(0.0025, 6);
    expect(result.outputCost).toBeCloseTo(0.005, 6);
    expect(result.totalCost).toBeCloseTo(0.0075, 6);
  });

  it("returns zero for zero tokens", () => {
    const result = calculateStandard(0, 0, gpt4o);
    expect(result.inputCost).toBe(0);
    expect(result.outputCost).toBe(0);
    expect(result.totalCost).toBe(0);
  });

  it("handles input-only call", () => {
    const result = calculateStandard(10_000, 0, gpt4o);
    expect(result.inputCost).toBeCloseTo(0.025, 6);
    expect(result.outputCost).toBe(0);
    expect(result.totalCost).toBeCloseTo(0.025, 6);
  });
});

// ----- calculateCached -----

describe("calculateCached", () => {
  it("returns null when model does not support caching", () => {
    const result = calculateCached(1000, 500, noCacheNoBatch, 0.5);
    expect(result).toBeNull();
  });

  it("applies cached price to cached portion of input", () => {
    // 1M input @ 50% cached = 500K cached + 500K standard
    // Standard: 500K * 2.50 / 1M = 1.25
    // Cached:   500K * 1.25 / 1M = 0.625
    // Output:   500K * 10.0 / 1M = 5.00
    const result = calculateCached(1_000_000, 500_000, gpt4o, 0.5);
    expect(result).not.toBeNull();
    expect(result!.inputCost).toBeCloseTo(1.875, 6);
    expect(result!.outputCost).toBeCloseTo(5.0, 6);
    expect(result!.totalCost).toBeCloseTo(6.875, 6);
  });

  it("equals standard cost when cachedPortion = 0", () => {
    const cached = calculateCached(10_000, 5_000, gpt4o, 0)!;
    const standard = calculateStandard(10_000, 5_000, gpt4o);
    expect(cached.totalCost).toBeCloseTo(standard.totalCost, 6);
  });

  it("uses fully cached price when cachedPortion = 1", () => {
    // 1M input fully cached: 1M * 1.25 / 1M = 1.25
    // Output: 1M * 10 / 1M = 10
    const result = calculateCached(1_000_000, 1_000_000, gpt4o, 1.0)!;
    expect(result.inputCost).toBeCloseTo(1.25, 6);
    expect(result.totalCost).toBeCloseTo(11.25, 6);
  });

  it("clamps cachedPortion above 1", () => {
    const r1 = calculateCached(1_000_000, 0, gpt4o, 1.0)!;
    const r2 = calculateCached(1_000_000, 0, gpt4o, 1.5)!;
    expect(r2.totalCost).toBeCloseTo(r1.totalCost, 6);
  });

  it("clamps cachedPortion below 0", () => {
    const r1 = calculateCached(1_000_000, 0, gpt4o, 0)!;
    const r2 = calculateCached(1_000_000, 0, gpt4o, -0.5)!;
    expect(r2.totalCost).toBeCloseTo(r1.totalCost, 6);
  });
});

// ----- calculateBatch -----

describe("calculateBatch", () => {
  it("returns null when model does not support batch", () => {
    const result = calculateBatch(1000, 500, noCacheNoBatch);
    expect(result).toBeNull();
  });

  it("applies batch prices (typically 50% off)", () => {
    // 1M input @ batchInput 1.25 = 1.25
    // 1M output @ batchOutput 5.00 = 5.00
    const result = calculateBatch(1_000_000, 1_000_000, gpt4o)!;
    expect(result.inputCost).toBeCloseTo(1.25, 6);
    expect(result.outputCost).toBeCloseTo(5.0, 6);
    expect(result.totalCost).toBeCloseTo(6.25, 6);
  });

  it("returns null when batchInput is set but batchOutput is missing", () => {
    const partial: Model = {
      ...gpt4o,
      pricing: { ...gpt4o.pricing, batchOutput: null },
    };
    expect(calculateBatch(1000, 500, partial)).toBeNull();
  });
});

// ----- calculateCost (orchestrator) -----

describe("calculateCost", () => {
  it("falls through to standard when no options enabled", () => {
    const result = calculateCost(1000, 500, gpt4o, {
      cachingEnabled: false,
      cachedPortion: 0,
      batchEnabled: false,
    });
    const standard = calculateStandard(1000, 500, gpt4o);
    expect(result.totalCost).toBeCloseTo(standard.totalCost, 6);
  });

  it("prefers batch over caching when both enabled", () => {
    const result = calculateCost(1_000_000, 1_000_000, gpt4o, {
      cachingEnabled: true,
      cachedPortion: 0.5,
      batchEnabled: true,
    });
    const batch = calculateBatch(1_000_000, 1_000_000, gpt4o)!;
    expect(result.totalCost).toBeCloseTo(batch.totalCost, 6);
  });

  it("uses caching when only caching enabled", () => {
    const result = calculateCost(1_000_000, 500_000, gpt4o, {
      cachingEnabled: true,
      cachedPortion: 0.5,
      batchEnabled: false,
    });
    const cached = calculateCached(1_000_000, 500_000, gpt4o, 0.5)!;
    expect(result.totalCost).toBeCloseTo(cached.totalCost, 6);
  });

  it("falls back to standard when caching enabled but model doesn't support it", () => {
    const result = calculateCost(1000, 500, noCacheNoBatch, {
      cachingEnabled: true,
      cachedPortion: 0.5,
      batchEnabled: false,
    });
    const standard = calculateStandard(1000, 500, noCacheNoBatch);
    expect(result.totalCost).toBeCloseTo(standard.totalCost, 6);
  });

  it("falls back to standard when batch enabled but model doesn't support it", () => {
    const result = calculateCost(1000, 500, noCacheNoBatch, {
      cachingEnabled: false,
      cachedPortion: 0,
      batchEnabled: true,
    });
    const standard = calculateStandard(1000, 500, noCacheNoBatch);
    expect(result.totalCost).toBeCloseTo(standard.totalCost, 6);
  });
});

// ----- calculateComparison -----

describe("calculateComparison", () => {
  it("returns all three breakdowns when model supports all features", () => {
    const result = calculateComparison(1_000_000, 1_000_000, gpt4o, 0.5);
    expect(result.standard.totalCost).toBeCloseTo(12.5, 6);
    expect(result.cached).not.toBeNull();
    expect(result.batch).not.toBeNull();
  });

  it("returns null for unsupported features", () => {
    const result = calculateComparison(1000, 500, noCacheNoBatch, 0.5);
    expect(result.standard).toBeDefined();
    expect(result.cached).toBeNull();
    expect(result.batch).toBeNull();
  });

  it("uses default cachedPortion of 0.5 when omitted", () => {
    const r1 = calculateComparison(1_000_000, 0, gpt4o);
    const r2 = calculateComparison(1_000_000, 0, gpt4o, 0.5);
    expect(r1.cached!.totalCost).toBeCloseTo(r2.cached!.totalCost, 6);
  });
});

// ----- estimateMonthlyCost -----

describe("estimateMonthlyCost", () => {
  it("multiplies cost-per-call by call frequency", () => {
    const result = estimateMonthlyCost(0.01, 1000);
    expect(result.daily).toBeCloseTo(10, 6);
    expect(result.monthly).toBeCloseTo(300, 6);
    expect(result.yearly).toBeCloseTo(3650, 6);
  });

  it("returns zeros for zero calls", () => {
    const result = estimateMonthlyCost(0.01, 0);
    expect(result.daily).toBe(0);
    expect(result.monthly).toBe(0);
    expect(result.yearly).toBe(0);
  });

  it("returns zeros for free model", () => {
    const result = estimateMonthlyCost(0, 1000);
    expect(result.daily).toBe(0);
    expect(result.monthly).toBe(0);
    expect(result.yearly).toBe(0);
  });

  it("uses 30-day month and 365-day year", () => {
    const result = estimateMonthlyCost(1, 1);
    expect(result.daily).toBe(1);
    expect(result.monthly).toBe(30);
    expect(result.yearly).toBe(365);
  });
});

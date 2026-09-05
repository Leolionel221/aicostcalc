// Schema v2 — see docs/PRD_v1.1_Supplement.md §4.1

export type ModelStatus = "active" | "deprecated" | "preview" | "legacy";
export type ModelCategory = "flagship" | "balanced" | "small" | "reasoning" | "open-source";

export interface ModelPricing {
  currency: "USD";
  unit: "per_1m_tokens";
  input: number;
  output: number;
  cachedInput: number | null;
  cacheWrite: number | null;
  batchInput: number | null;
  batchOutput: number | null;
  imagePerImage: number | null;
  imageTokensFormula: string | null;
  reasoningOutput: number | null;
  fineTunedInput: number | null;
  fineTunedOutput: number | null;
}

export interface ModelLimits {
  contextWindow: number;
  maxOutput: number;
  maxImagesPerRequest: number | null;
  knowledgeCutoff: string | null;
}

export interface ModelTokenization {
  encoder: string; // tiktoken encoder name, or "approximate"
  approximationRatio: {
    english: number;
    chinese: number;
    code: number;
  };
}

export interface ModelSupports {
  vision: boolean;
  audio: boolean;
  tools: boolean;
  streaming: boolean;
  caching: boolean;
  batch: boolean;
  fineTuning: boolean;
  structuredOutput: boolean;
}

export interface ModelSource {
  type: "official" | "community";
  url: string;
  fetchedAt: string;
}

export interface PriceHistoryEntry {
  date: string;
  input: number;
  output: number;
  note?: string;
}

export interface ModelI18n {
  tagline: string;
  description: string;
}

export interface Model {
  id: string;
  name: string;
  shortName: string;
  provider: string;
  providerId: string;
  providerLogo: string;
  providerWebsite: string;
  category: ModelCategory;
  useCase: string[];
  /**
   * Provider announcement date, YYYY-MM-DD.
   *
   * Null when unknown: the LiteLLM registry carries pricing and limits but no
   * release dates, so models discovered through the daily sync start without
   * one. The page renders a dash rather than a guess — this field is shown to
   * readers, and an invented date is indistinguishable from a real one.
   */
  releaseDate: string | null;
  status: ModelStatus;
  deprecatedAt: string | null;
  successorId: string | null;
  pricing: ModelPricing;
  limits: ModelLimits;
  tokenization: ModelTokenization;
  supports: ModelSupports;
  lastVerified: string;
  sources: ModelSource[];
  priceHistory: PriceHistoryEntry[];
  i18n: {
    en: ModelI18n;
    zh: ModelI18n;
  };
  /**
   * Present only on entries the daily sync published automatically.
   *
   * Prices and limits on a draft are registry values and can be trusted; the
   * name follows a fixed rule and the copy is formulaic. What is missing is a
   * human read for lineage and positioning. The page shows a notice while this
   * field exists; deleting the field is the review sign-off.
   */
  draft?: {
    generatedAt: string;
    note: string;
  };
}

export interface ModelsData {
  schemaVersion: string;
  lastUpdated: string;
  models: Model[];
}

// ----- Calculation types -----

export interface CalculationOptions {
  cachingEnabled: boolean;
  cachedPortion: number; // 0..1
  batchEnabled: boolean;
}

export interface CostBreakdown {
  inputCost: number;
  outputCost: number;
  totalCost: number;
}

export interface CostComparison {
  standard: CostBreakdown;
  cached: CostBreakdown | null;
  batch: CostBreakdown | null;
}

export interface MonthlyEstimate {
  daily: number;
  monthly: number;
  yearly: number;
}

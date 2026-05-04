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
  releaseDate: string;
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

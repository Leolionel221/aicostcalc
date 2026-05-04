import type {
  CalculationOptions,
  CostBreakdown,
  CostComparison,
  Model,
  MonthlyEstimate,
} from "./types";

const TOKENS_PER_MILLION = 1_000_000;

function priceFor(tokens: number, perMillion: number): number {
  return (tokens / TOKENS_PER_MILLION) * perMillion;
}

export function calculateStandard(
  inputTokens: number,
  outputTokens: number,
  model: Model,
): CostBreakdown {
  const inputCost = priceFor(inputTokens, model.pricing.input);
  const outputCost = priceFor(outputTokens, model.pricing.output);
  return { inputCost, outputCost, totalCost: inputCost + outputCost };
}

export function calculateCached(
  inputTokens: number,
  outputTokens: number,
  model: Model,
  cachedPortion: number,
): CostBreakdown | null {
  if (model.pricing.cachedInput === null) return null;
  const clampedPortion = Math.max(0, Math.min(1, cachedPortion));
  const cachedTokens = inputTokens * clampedPortion;
  const uncachedTokens = inputTokens - cachedTokens;
  const inputCost =
    priceFor(uncachedTokens, model.pricing.input) +
    priceFor(cachedTokens, model.pricing.cachedInput);
  const outputCost = priceFor(outputTokens, model.pricing.output);
  return { inputCost, outputCost, totalCost: inputCost + outputCost };
}

export function calculateBatch(
  inputTokens: number,
  outputTokens: number,
  model: Model,
): CostBreakdown | null {
  if (model.pricing.batchInput === null || model.pricing.batchOutput === null) {
    return null;
  }
  const inputCost = priceFor(inputTokens, model.pricing.batchInput);
  const outputCost = priceFor(outputTokens, model.pricing.batchOutput);
  return { inputCost, outputCost, totalCost: inputCost + outputCost };
}

export function calculateCost(
  inputTokens: number,
  outputTokens: number,
  model: Model,
  options: CalculationOptions,
): CostBreakdown {
  if (options.batchEnabled && model.supports.batch) {
    const batch = calculateBatch(inputTokens, outputTokens, model);
    if (batch) return batch;
  }
  if (options.cachingEnabled && model.supports.caching) {
    const cached = calculateCached(
      inputTokens,
      outputTokens,
      model,
      options.cachedPortion,
    );
    if (cached) return cached;
  }
  return calculateStandard(inputTokens, outputTokens, model);
}

export function calculateComparison(
  inputTokens: number,
  outputTokens: number,
  model: Model,
  cachedPortion = 0.5,
): CostComparison {
  return {
    standard: calculateStandard(inputTokens, outputTokens, model),
    cached: calculateCached(inputTokens, outputTokens, model, cachedPortion),
    batch: calculateBatch(inputTokens, outputTokens, model),
  };
}

export function estimateMonthlyCost(
  costPerCall: number,
  callsPerDay: number,
): MonthlyEstimate {
  return {
    daily: costPerCall * callsPerDay,
    monthly: costPerCall * callsPerDay * 30,
    yearly: costPerCall * callsPerDay * 365,
  };
}

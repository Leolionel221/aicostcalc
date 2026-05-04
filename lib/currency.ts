import currenciesData from "@/data/currencies.json";

export type CurrencyCode = "USD" | "CNY" | "EUR" | "GBP" | "INR";

export interface Currency {
  code: CurrencyCode;
  symbol: string;
  rate: number;
  name: string;
}

const currencies = currenciesData.currencies as Currency[];
const currencyMap = new Map(currencies.map((c) => [c.code, c]));

export const ALL_CURRENCIES = currencies;

export function getCurrency(code: CurrencyCode): Currency {
  return currencyMap.get(code) ?? currencies[0];
}

export function convert(amountUsd: number, code: CurrencyCode): number {
  return amountUsd * getCurrency(code).rate;
}

/**
 * Format a USD amount in the target currency.
 * Non-USD values are prefixed with ~ to signal approximation.
 */
export function formatCost(amountUsd: number, code: CurrencyCode): string {
  const { symbol } = getCurrency(code);
  const value = convert(amountUsd, code);
  const isApprox = code !== "USD";
  const prefix = isApprox ? "~" : "";

  if (value === 0) return `${symbol}0`;

  // Adapt precision based on magnitude
  let formatted: string;
  if (value < 0.0001) formatted = value.toExponential(2);
  else if (value < 0.01) formatted = value.toFixed(6);
  else if (value < 1) formatted = value.toFixed(4);
  else if (value < 100) formatted = value.toFixed(4);
  else formatted = value.toFixed(2);

  return `${prefix}${symbol}${formatted}`;
}

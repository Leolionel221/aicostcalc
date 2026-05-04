import { describe, it, expect } from "vitest";
import {
  ALL_CURRENCIES,
  getCurrency,
  convert,
  formatCost,
  type CurrencyCode,
} from "./currency";

describe("ALL_CURRENCIES", () => {
  it("contains exactly 5 currencies (USD, CNY, EUR, GBP, INR)", () => {
    const codes = ALL_CURRENCIES.map((c) => c.code).sort();
    expect(codes).toEqual(["CNY", "EUR", "GBP", "INR", "USD"]);
  });

  it("USD has rate 1.0", () => {
    const usd = ALL_CURRENCIES.find((c) => c.code === "USD");
    expect(usd?.rate).toBe(1.0);
  });

  it("each currency has a non-empty symbol", () => {
    for (const c of ALL_CURRENCIES) {
      expect(c.symbol.length).toBeGreaterThan(0);
    }
  });
});

describe("convert", () => {
  it("returns same value for USD", () => {
    expect(convert(10, "USD")).toBe(10);
    expect(convert(0.001, "USD")).toBe(0.001);
  });

  it("multiplies by rate for CNY", () => {
    const cny = getCurrency("CNY");
    expect(convert(1, "CNY")).toBeCloseTo(cny.rate, 6);
  });

  it("scales linearly with input", () => {
    expect(convert(100, "EUR")).toBeCloseTo(convert(1, "EUR") * 100, 6);
  });
});

describe("formatCost", () => {
  it("returns symbol + 0 for zero amount", () => {
    expect(formatCost(0, "USD")).toBe("$0");
    expect(formatCost(0, "CNY")).toBe("¥0");
  });

  it("USD has no ~ prefix (canonical currency)", () => {
    expect(formatCost(0.5, "USD")).not.toContain("~");
  });

  it("non-USD currencies have ~ prefix to signal approximation", () => {
    expect(formatCost(0.5, "CNY")).toContain("~");
    expect(formatCost(0.5, "EUR")).toContain("~");
    expect(formatCost(0.5, "GBP")).toContain("~");
    expect(formatCost(0.5, "INR")).toContain("~");
  });

  it("uses each currency's symbol", () => {
    expect(formatCost(1, "USD")).toContain("$");
    expect(formatCost(1, "CNY")).toContain("¥");
    expect(formatCost(1, "EUR")).toContain("€");
    expect(formatCost(1, "GBP")).toContain("£");
    expect(formatCost(1, "INR")).toContain("₹");
  });

  it("uses scientific notation for very small values", () => {
    const out = formatCost(0.00001, "USD");
    expect(out).toMatch(/e-/);
  });

  it("uses 6 decimals for values < 0.01", () => {
    const out = formatCost(0.005, "USD");
    expect(out).toMatch(/^\$0\.\d{6}$/);
  });

  it("uses 4 decimals for values >= 0.01 and < 100", () => {
    const out = formatCost(0.5, "USD");
    expect(out).toMatch(/^\$0\.\d{4}$/);
  });

  it("uses 2 decimals for values >= 100", () => {
    const out = formatCost(150, "USD");
    expect(out).toMatch(/^\$\d+\.\d{2}$/);
  });
});

describe("getCurrency", () => {
  it("returns the correct currency object for known codes", () => {
    const codes: CurrencyCode[] = ["USD", "CNY", "EUR", "GBP", "INR"];
    for (const code of codes) {
      const c = getCurrency(code);
      expect(c.code).toBe(code);
    }
  });
});

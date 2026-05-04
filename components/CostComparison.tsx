"use client";

import type { CostComparison } from "@/lib/types";
import { cn } from "@/lib/utils";

const USD_TO_CNY = 7.2;

function formatCurrency(amount: number, currency: "USD" | "CNY"): string {
  const value = currency === "CNY" ? amount * USD_TO_CNY : amount;
  const symbol = currency === "CNY" ? "¥" : "$";
  if (value === 0) return `${symbol}0`;
  if (value < 0.01) return `${symbol}${value.toFixed(6)}`;
  if (value < 1) return `${symbol}${value.toFixed(4)}`;
  return `${symbol}${value.toFixed(4)}`;
}

function savePercent(standard: number, alt: number): number {
  if (standard === 0) return 0;
  return Math.round(((standard - alt) / standard) * 100);
}

interface CostComparisonStripProps {
  comparison: CostComparison;
  currency: "USD" | "CNY";
}

export function CostComparisonStrip({
  comparison,
  currency,
}: CostComparisonStripProps) {
  const standardCost = comparison.standard.totalCost;

  const columns = [
    {
      key: "standard" as const,
      label: "Standard",
      cost: standardCost,
      saving: null,
      supported: true,
    },
    {
      key: "cached" as const,
      label: "With Caching",
      cost: comparison.cached?.totalCost ?? null,
      saving: comparison.cached
        ? savePercent(standardCost, comparison.cached.totalCost)
        : null,
      supported: comparison.cached !== null,
    },
    {
      key: "batch" as const,
      label: "With Batch",
      cost: comparison.batch?.totalCost ?? null,
      saving: comparison.batch
        ? savePercent(standardCost, comparison.batch.totalCost)
        : null,
      supported: comparison.batch !== null,
    },
  ];

  return (
    <div className="border-t pt-6">
      <div className="text-xs text-muted-foreground mb-3">
        Cost comparison
      </div>
      <div className="grid grid-cols-3 gap-2">
        {columns.map((col) => (
          <div
            key={col.key}
            className={cn(
              "rounded-lg border p-4 text-center transition-colors",
              col.supported
                ? "border-border"
                : "border-border bg-muted opacity-60",
            )}
          >
            <div className="text-xs font-medium text-muted-foreground mb-1">
              {col.label}
            </div>
            {col.supported ? (
              <>
                <div className="text-lg font-semibold font-mono tabular-nums">
                  {formatCurrency(col.cost!, currency)}
                </div>
                {col.saving !== null && col.saving > 0 && (
                  <div className="text-xs mt-1 text-[color:var(--accent)] font-medium">
                    Save {col.saving}% ↓
                  </div>
                )}
                {col.saving === 0 && (
                  <div className="text-xs mt-1 text-muted-foreground">
                    Same
                  </div>
                )}
              </>
            ) : (
              <div className="text-xs text-muted-foreground py-2">
                Not supported
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { calculateStandard, estimateMonthlyCost } from "@/lib/calculator";
import { formatCost, type CurrencyCode } from "@/lib/currency";
import { cn } from "@/lib/utils";
import type { Model } from "@/lib/types";

const MAX_SELECTED = 5;

interface MonthlyEstimatorProps {
  models: Model[];
  defaultModelIds?: string[];
}

export function MonthlyEstimator({
  models,
  defaultModelIds,
}: MonthlyEstimatorProps) {
  const initialIds = (defaultModelIds ?? models.slice(0, 3).map((m) => m.id)).slice(
    0,
    MAX_SELECTED,
  );

  const [callsPerDay, setCallsPerDay] = useState("1000");
  const [inputTokens, setInputTokens] = useState("500");
  const [outputTokens, setOutputTokens] = useState("300");
  const [selectedIds, setSelectedIds] = useState<string[]>(initialIds);
  const [currency] = useState<CurrencyCode>("USD");

  const callsNum = Number(callsPerDay) || 0;
  const inputNum = Number(inputTokens) || 0;
  const outputNum = Number(outputTokens) || 0;

  const rows = useMemo(() => {
    return selectedIds
      .map((id) => models.find((m) => m.id === id))
      .filter((m): m is Model => Boolean(m))
      .map((model) => {
        const perCall = calculateStandard(inputNum, outputNum, model);
        const monthly = estimateMonthlyCost(perCall.totalCost, callsNum);
        return { model, perCall: perCall.totalCost, ...monthly };
      })
      .sort((a, b) => a.monthly - b.monthly);
  }, [selectedIds, models, inputNum, outputNum, callsNum]);

  const maxMonthly = rows.length > 0 ? Math.max(...rows.map((r) => r.monthly)) : 0;
  const cheapest = rows[0];
  const mostExpensive = rows[rows.length - 1];
  const monthlySavings =
    rows.length >= 2 ? mostExpensive.monthly - cheapest.monthly : 0;

  function toggleModel(id: string) {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= MAX_SELECTED) return prev;
      return [...prev, id];
    });
  }

  return (
    <Card className="w-full max-w-3xl">
      <CardContent className="p-6 space-y-6">
        <div>
          <h2 className="text-xl font-semibold">Monthly cost forecast</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Estimate your monthly bill across up to {MAX_SELECTED} models.
          </p>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="me-calls">Calls per day</Label>
            <Input
              id="me-calls"
              type="number"
              min={0}
              value={callsPerDay}
              onChange={(e) => setCallsPerDay(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="me-input">Avg input tokens</Label>
            <Input
              id="me-input"
              type="number"
              min={0}
              value={inputTokens}
              onChange={(e) => setInputTokens(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="me-output">Avg output tokens</Label>
            <Input
              id="me-output"
              type="number"
              min={0}
              value={outputTokens}
              onChange={(e) => setOutputTokens(e.target.value)}
            />
          </div>
        </div>

        {/* Model selector chips */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Compare models</Label>
            <span className="text-xs text-muted-foreground">
              {selectedIds.length}/{MAX_SELECTED} selected
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {models.map((m) => {
              const selected = selectedIds.includes(m.id);
              const disabled = !selected && selectedIds.length >= MAX_SELECTED;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => toggleModel(m.id)}
                  disabled={disabled}
                  className={cn(
                    "px-3 py-1 rounded-full border text-xs transition-colors",
                    selected
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border text-muted-foreground hover:text-foreground",
                    disabled && "opacity-40 cursor-not-allowed",
                  )}
                >
                  {m.shortName}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bar chart + table */}
        {rows.length > 0 ? (
          <div className="space-y-3">
            {rows.map((row) => {
              const widthPct = maxMonthly > 0 ? (row.monthly / maxMonthly) * 100 : 0;
              const isCheapest = row.model.id === cheapest.model.id && rows.length > 1;
              return (
                <div key={row.model.id} className="space-y-1">
                  <div className="flex items-baseline justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{row.model.shortName}</span>
                      <span className="text-xs text-muted-foreground">{row.model.provider}</span>
                      {isCheapest && (
                        <span className="text-[10px] uppercase tracking-wide text-[color:var(--accent)] font-semibold">
                          cheapest
                        </span>
                      )}
                    </div>
                    <span className="font-mono tabular-nums font-semibold">
                      {formatCost(row.monthly, currency)}/mo
                    </span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        isCheapest ? "bg-[color:var(--accent)]" : "bg-primary/70",
                      )}
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                  <div className="text-[11px] text-muted-foreground font-mono tabular-nums flex justify-between">
                    <span>per call: {formatCost(row.perCall, currency)}</span>
                    <span>year: {formatCost(row.yearly, currency)}</span>
                  </div>
                </div>
              );
            })}

            {/* Savings highlight */}
            {monthlySavings > 0.01 && (
              <div className="mt-4 p-4 rounded-lg bg-[color:var(--accent)]/10 border border-[color:var(--accent)]/30">
                <div className="text-sm">
                  Choosing <span className="font-semibold">{cheapest.model.shortName}</span> over{" "}
                  <span className="font-semibold">{mostExpensive.model.shortName}</span> saves{" "}
                  <span className="font-mono font-semibold text-[color:var(--accent)]">
                    {formatCost(monthlySavings, currency)}/month
                  </span>{" "}
                  (
                  <span className="font-mono font-semibold text-[color:var(--accent)]">
                    {formatCost(monthlySavings * 12, currency)}/year
                  </span>
                  ).
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground text-center py-8">
            Select at least one model to see forecasts.
          </div>
        )}
      </CardContent>
    </Card>
  );
}

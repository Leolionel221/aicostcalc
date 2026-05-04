"use client";

import { useState, useMemo } from "react";
import { ChevronDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { CostComparisonStrip } from "./CostComparison";
import { calculateCost, calculateComparison } from "@/lib/calculator";
import { ALL_CURRENCIES, formatCost, type CurrencyCode } from "@/lib/currency";
import { cn } from "@/lib/utils";
import type { Model } from "@/lib/types";

interface CalculatorProps {
  models: Model[];
  defaultModelId?: string;
}

export function Calculator({ models, defaultModelId }: CalculatorProps) {
  const [modelId, setModelId] = useState(defaultModelId ?? models[0]?.id);
  const [inputTokens, setInputTokens] = useState("1000");
  const [outputTokens, setOutputTokens] = useState("500");
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [cachingEnabled, setCachingEnabled] = useState(false);
  const [cachedPortion, setCachedPortion] = useState(0.5);
  const [batchEnabled, setBatchEnabled] = useState(false);
  const [currency, setCurrency] = useState<CurrencyCode>("USD");

  const selectedModel = useMemo(
    () => models.find((m) => m.id === modelId) ?? models[0],
    [models, modelId],
  );

  const inputNum = Number(inputTokens) || 0;
  const outputNum = Number(outputTokens) || 0;

  const cost = useMemo(
    () =>
      calculateCost(inputNum, outputNum, selectedModel, {
        cachingEnabled,
        cachedPortion,
        batchEnabled,
      }),
    [inputNum, outputNum, selectedModel, cachingEnabled, cachedPortion, batchEnabled],
  );

  const comparison = useMemo(
    () => calculateComparison(inputNum, outputNum, selectedModel, cachedPortion),
    [inputNum, outputNum, selectedModel, cachedPortion],
  );

  const isExactTokenizer = selectedModel.tokenization.encoder !== "approximate";
  const supportsCaching = selectedModel.supports.caching && selectedModel.pricing.cachedInput !== null;
  const supportsBatch = selectedModel.supports.batch && selectedModel.pricing.batchInput !== null;

  return (
    <Card className="w-full max-w-3xl">
      <CardContent className="p-6 space-y-6">
        {/* Model selector */}
        <div className="space-y-2">
          <Label htmlFor="model-select">Model</Label>
          <Select value={modelId} onValueChange={setModelId}>
            <SelectTrigger id="model-select" className="w-full">
              <SelectValue placeholder="Select a model" />
            </SelectTrigger>
            <SelectContent>
              {models.map((m) => (
                <SelectItem key={m.id} value={m.id}>
                  {m.name} <span className="text-muted-foreground">· {m.provider}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {isExactTokenizer ? (
              <span className="inline-flex items-center gap-1 text-[color:var(--accent)]">
                ✓ Exact tokenizer
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[color:var(--warning)]">
                ≈ Estimated tokenizer
              </span>
            )}
            <span>·</span>
            <span>${selectedModel.pricing.input.toFixed(2)} in</span>
            <span>·</span>
            <span>${selectedModel.pricing.output.toFixed(2)} out (per 1M)</span>
          </div>
        </div>

        {/* Token inputs */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="input-tokens">Input tokens</Label>
            <Input
              id="input-tokens"
              type="number"
              min={0}
              value={inputTokens}
              onChange={(e) => setInputTokens(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="output-tokens">Output tokens</Label>
            <Input
              id="output-tokens"
              type="number"
              min={0}
              value={outputTokens}
              onChange={(e) => setOutputTokens(e.target.value)}
            />
          </div>
        </div>

        {/* Advanced options collapsible */}
        <div className="border-t pt-4">
          <button
            type="button"
            onClick={() => setAdvancedOpen(!advancedOpen)}
            className="flex w-full items-center justify-between text-sm font-medium hover:text-primary transition-colors"
          >
            <span>Advanced options</span>
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform",
                advancedOpen && "rotate-180",
              )}
            />
          </button>

          {advancedOpen && (
            <div className="mt-4 space-y-5">
              {/* Caching */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="caching-switch">Use prompt caching</Label>
                    {!supportsCaching && (
                      <p className="text-xs text-muted-foreground">Not supported by this model</p>
                    )}
                  </div>
                  <Switch
                    id="caching-switch"
                    checked={cachingEnabled && supportsCaching}
                    onCheckedChange={setCachingEnabled}
                    disabled={!supportsCaching}
                  />
                </div>
                {cachingEnabled && supportsCaching && (
                  <div className="space-y-2 pl-1">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Cached portion of input</span>
                      <span className="font-mono tabular-nums">
                        {Math.round(cachedPortion * 100)}%
                      </span>
                    </div>
                    <Slider
                      value={[cachedPortion]}
                      onValueChange={(v) => setCachedPortion(v[0])}
                      min={0}
                      max={1}
                      step={0.05}
                    />
                  </div>
                )}
              </div>

              {/* Batch */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="batch-switch">Use Batch API (~24h, 50% off)</Label>
                  {!supportsBatch && (
                    <p className="text-xs text-muted-foreground">Not supported by this model</p>
                  )}
                </div>
                <Switch
                  id="batch-switch"
                  checked={batchEnabled && supportsBatch}
                  onCheckedChange={setBatchEnabled}
                  disabled={!supportsBatch}
                />
              </div>

              {/* Currency */}
              <div className="space-y-2">
                <Label htmlFor="currency-select">Currency</Label>
                <Select
                  value={currency}
                  onValueChange={(v) => setCurrency(v as CurrencyCode)}
                >
                  <SelectTrigger id="currency-select" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ALL_CURRENCIES.map((c) => (
                      <SelectItem key={c.code} value={c.code}>
                        <span className="font-mono mr-2">{c.symbol}</span>
                        {c.code} <span className="text-muted-foreground">· {c.name}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {currency !== "USD" && (
                  <p className="text-xs text-muted-foreground">
                    AI APIs are billed in USD. Other currencies shown for reference only (~).
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Result */}
        <div className="border-t pt-6 space-y-4">
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-muted-foreground">Total cost per call</span>
            <span className="text-3xl font-semibold font-mono tabular-nums">
              {formatCost(cost.totalCost, currency)}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
            <div className="flex justify-between rounded-md bg-muted px-3 py-2">
              <span>Input</span>
              <span className="font-mono tabular-nums">
                {formatCost(cost.inputCost, currency)}
              </span>
            </div>
            <div className="flex justify-between rounded-md bg-muted px-3 py-2">
              <span>Output</span>
              <span className="font-mono tabular-nums">
                {formatCost(cost.outputCost, currency)}
              </span>
            </div>
          </div>
        </div>

        {/* F1.5 three-column comparison */}
        <CostComparisonStrip comparison={comparison} currency={currency} />
      </CardContent>
    </Card>
  );
}

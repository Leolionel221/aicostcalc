"use client";

import { useState, useMemo } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown, EyeOff } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { calculateStandard } from "@/lib/calculator";
import { formatCost, type CurrencyCode } from "@/lib/currency";
import { cn } from "@/lib/utils";
import type { Model } from "@/lib/types";

type SortKey = "name" | "input" | "output" | "totalCost" | "context";
type SortDirection = "asc" | "desc";

interface ModelComparisonProps {
  models: Model[];
  defaultInputTokens?: number;
  defaultOutputTokens?: number;
}

export function ModelComparison({
  models,
  defaultInputTokens = 1000,
  defaultOutputTokens = 500,
}: ModelComparisonProps) {
  const [inputTokens, setInputTokens] = useState(String(defaultInputTokens));
  const [outputTokens, setOutputTokens] = useState(String(defaultOutputTokens));
  const [currency] = useState<CurrencyCode>("USD");
  const [sortKey, setSortKey] = useState<SortKey>("totalCost");
  const [sortDir, setSortDir] = useState<SortDirection>("asc");
  const [hiddenIds, setHiddenIds] = useState<Set<string>>(new Set());
  const [providerFilter, setProviderFilter] = useState<Set<string>>(new Set());

  const inputNum = Number(inputTokens) || 0;
  const outputNum = Number(outputTokens) || 0;

  const allProviders = useMemo(
    () => Array.from(new Set(models.map((m) => m.provider))).sort(),
    [models],
  );

  const rows = useMemo(() => {
    const enriched = models
      .filter((m) => !hiddenIds.has(m.id))
      .filter((m) => providerFilter.size === 0 || providerFilter.has(m.provider))
      .map((m) => {
        const cost = calculateStandard(inputNum, outputNum, m);
        return {
          model: m,
          totalCost: cost.totalCost,
        };
      });

    enriched.sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "name":
          cmp = a.model.name.localeCompare(b.model.name);
          break;
        case "input":
          cmp = a.model.pricing.input - b.model.pricing.input;
          break;
        case "output":
          cmp = a.model.pricing.output - b.model.pricing.output;
          break;
        case "totalCost":
          cmp = a.totalCost - b.totalCost;
          break;
        case "context":
          cmp = a.model.limits.contextWindow - b.model.limits.contextWindow;
          break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });

    return enriched;
  }, [models, hiddenIds, providerFilter, sortKey, sortDir, inputNum, outputNum]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  function toggleProvider(provider: string) {
    setProviderFilter((prev) => {
      const next = new Set(prev);
      if (next.has(provider)) next.delete(provider);
      else next.add(provider);
      return next;
    });
  }

  function hideModel(id: string) {
    setHiddenIds((prev) => new Set(prev).add(id));
  }

  function showAll() {
    setHiddenIds(new Set());
    setProviderFilter(new Set());
  }

  return (
    <Card className="w-full max-w-5xl">
      <CardContent className="p-6 space-y-5">
        <div>
          <h2 className="text-xl font-semibold">All models compared</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Sorted by cost for your token usage. Click column headers to re-sort.
          </p>
        </div>

        {/* Token inputs */}
        <div className="grid grid-cols-2 gap-4 max-w-md">
          <div className="space-y-1.5">
            <Label htmlFor="cmp-input">Input tokens</Label>
            <Input
              id="cmp-input"
              type="number"
              min={0}
              value={inputTokens}
              onChange={(e) => setInputTokens(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cmp-output">Output tokens</Label>
            <Input
              id="cmp-output"
              type="number"
              min={0}
              value={outputTokens}
              onChange={(e) => setOutputTokens(e.target.value)}
            />
          </div>
        </div>

        {/* Provider filter */}
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground">Filter by provider</div>
          <div className="flex flex-wrap gap-2">
            {allProviders.map((p) => {
              const active = providerFilter.size === 0 || providerFilter.has(p);
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => toggleProvider(p)}
                  className={cn(
                    "px-3 py-1 rounded-full border text-xs transition-colors",
                    active
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border text-muted-foreground hover:text-foreground",
                  )}
                >
                  {p}
                </button>
              );
            })}
            {(hiddenIds.size > 0 || providerFilter.size > 0) && (
              <button
                type="button"
                onClick={showAll}
                className="px-3 py-1 rounded-full border border-dashed text-xs text-muted-foreground hover:text-foreground"
              >
                Reset filters
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-xs text-muted-foreground">
                <SortableHeader
                  label="Model"
                  active={sortKey === "name"}
                  dir={sortDir}
                  onClick={() => toggleSort("name")}
                  className="text-left py-2 pr-4"
                />
                <SortableHeader
                  label="Input /1M"
                  active={sortKey === "input"}
                  dir={sortDir}
                  onClick={() => toggleSort("input")}
                  className="text-right py-2 px-3"
                />
                <SortableHeader
                  label="Output /1M"
                  active={sortKey === "output"}
                  dir={sortDir}
                  onClick={() => toggleSort("output")}
                  className="text-right py-2 px-3"
                />
                <SortableHeader
                  label="Per call"
                  active={sortKey === "totalCost"}
                  dir={sortDir}
                  onClick={() => toggleSort("totalCost")}
                  className="text-right py-2 px-3"
                />
                <SortableHeader
                  label="Context"
                  active={sortKey === "context"}
                  dir={sortDir}
                  onClick={() => toggleSort("context")}
                  className="text-right py-2 px-3 hidden md:table-cell"
                />
                <th className="py-2 pl-3 w-8"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ model, totalCost }, i) => (
                <tr
                  key={model.id}
                  className={cn(
                    "border-b border-border/50 hover:bg-muted/30 transition-colors",
                    i === 0 && sortKey === "totalCost" && sortDir === "asc"
                      ? "bg-[color:var(--accent)]/5"
                      : "",
                  )}
                >
                  <td className="py-3 pr-4">
                    <div className="font-medium">{model.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {model.provider} · {model.category}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums">
                    {formatCost(model.pricing.input, currency)}
                  </td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums">
                    {formatCost(model.pricing.output, currency)}
                  </td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums font-semibold">
                    {formatCost(totalCost, currency)}
                  </td>
                  <td className="py-3 px-3 text-right text-xs text-muted-foreground hidden md:table-cell">
                    {(model.limits.contextWindow / 1000).toFixed(0)}K
                  </td>
                  <td className="py-3 pl-3 w-8">
                    <button
                      type="button"
                      onClick={() => hideModel(model.id)}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      title="Hide this model"
                    >
                      <EyeOff className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-sm text-muted-foreground">
                    No models match current filters.{" "}
                    <button onClick={showAll} className="underline hover:text-foreground">
                      Reset
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {hiddenIds.size > 0 && (
          <div className="text-xs text-muted-foreground">
            {hiddenIds.size} model{hiddenIds.size > 1 ? "s" : ""} hidden ·{" "}
            <button onClick={showAll} className="underline hover:text-foreground">
              Show all
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function SortableHeader({
  label,
  active,
  dir,
  onClick,
  className,
}: {
  label: string;
  active: boolean;
  dir: SortDirection;
  onClick: () => void;
  className?: string;
}) {
  const Icon = !active ? ArrowUpDown : dir === "asc" ? ArrowUp : ArrowDown;
  return (
    <th className={className}>
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "inline-flex items-center gap-1 hover:text-foreground transition-colors",
          active && "text-foreground font-medium",
        )}
      >
        {label}
        <Icon className="h-3 w-3 opacity-60" />
      </button>
    </th>
  );
}

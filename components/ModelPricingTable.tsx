import type { Model } from "@/lib/types";
import { formatCost } from "@/lib/currency";

interface ModelPricingTableProps {
  model: Model;
}

export function ModelPricingTable({ model }: ModelPricingTableProps) {
  const rows = [
    {
      label: "Input",
      price: model.pricing.input,
      note: "Standard input tokens",
      always: true,
    },
    {
      label: "Output",
      price: model.pricing.output,
      note: "Generated output tokens",
      always: true,
    },
    {
      label: "Cached input",
      price: model.pricing.cachedInput,
      note: "Reused prompt content",
      always: false,
    },
    {
      label: "Cache write",
      price: model.pricing.cacheWrite,
      note: "First-time cache deposit (Anthropic / Gemini style)",
      always: false,
    },
    {
      label: "Batch input",
      price: model.pricing.batchInput,
      note: "~24h delay, 50% off",
      always: false,
    },
    {
      label: "Batch output",
      price: model.pricing.batchOutput,
      note: "Batch API output",
      always: false,
    },
  ];

  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50 text-xs text-muted-foreground">
            <th className="text-left py-3 px-4 font-medium">Type</th>
            <th className="text-right py-3 px-4 font-medium">Price (per 1M tokens)</th>
            <th className="text-left py-3 px-4 font-medium hidden sm:table-cell">Note</th>
          </tr>
        </thead>
        <tbody>
          {rows
            .filter((r) => r.always || r.price !== null)
            .map((r) => (
              <tr key={r.label} className="border-b border-border/50 last:border-b-0">
                <td className="py-3 px-4 font-medium">{r.label}</td>
                <td className="py-3 px-4 text-right font-mono tabular-nums">
                  {r.price !== null ? formatCost(r.price, "USD") : (
                    <span className="text-muted-foreground italic text-xs">N/A</span>
                  )}
                </td>
                <td className="py-3 px-4 text-xs text-muted-foreground hidden sm:table-cell">
                  {r.note}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

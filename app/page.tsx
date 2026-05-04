import modelsData from "@/data/models.json";
import type { ModelsData } from "@/lib/types";
import { Calculator } from "@/components/Calculator";

const data = modelsData as ModelsData;

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center px-6 py-12 md:py-20">
      <div className="w-full max-w-3xl space-y-8">
        {/* Hero */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            AI API Cost Calculator
          </h1>
          <p className="text-lg text-muted-foreground">
            Compare API pricing for {data.models.length}+ LLM models. Get exact
            costs in seconds.
          </p>
        </div>

        {/* Calculator */}
        <Calculator
          models={data.models}
          defaultModelId={data.models[0]?.id}
        />

        {/* Trust strip */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <span className="text-[color:var(--accent)]">✓</span>
            Last verified {data.lastUpdated}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="text-[color:var(--accent)]">✓</span>
            Schema v{data.schemaVersion}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="text-[color:var(--accent)]">✓</span>
            Updated monthly
          </span>
        </div>

        {/* Coming soon section */}
        <div className="rounded-lg border border-border bg-muted/30 p-6 text-center text-sm text-muted-foreground">
          <div className="font-medium text-foreground mb-1">Coming this week</div>
          Multi-model comparison table · Scenario templates · Monthly cost forecaster
        </div>
      </div>
    </main>
  );
}

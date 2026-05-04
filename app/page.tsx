import modelsData from "@/data/models.json";
import type { ModelsData } from "@/lib/types";
import { Calculator } from "@/components/Calculator";
import { ModelComparison } from "@/components/ModelComparison";
import { MonthlyEstimator } from "@/components/MonthlyEstimator";

const data = modelsData as ModelsData;

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center px-4 sm:px-6 py-12 md:py-20">
      <div className="w-full max-w-5xl space-y-16">
        {/* Hero */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            AI API Cost Calculator
          </h1>
          <p className="text-lg text-muted-foreground">
            Calculate and compare API pricing for {data.models.length}+ LLM models —
            OpenAI, Anthropic, Google, DeepSeek, xAI, Mistral.
          </p>
        </div>

        {/* Calculator */}
        <section className="flex justify-center">
          <Calculator
            models={data.models}
            defaultModelId={data.models[0]?.id}
          />
        </section>

        {/* Model comparison table */}
        <section className="flex justify-center">
          <ModelComparison models={data.models} />
        </section>

        {/* Monthly estimator */}
        <section className="flex justify-center">
          <MonthlyEstimator
            models={data.models}
            defaultModelIds={[
              "gpt-5-5",
              "claude-opus-4-7",
              "gemini-3-0-pro",
            ]}
          />
        </section>

        {/* Trust strip */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground border-t pt-8">
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
          <span className="inline-flex items-center gap-1.5 opacity-60">
            Pricing is informational — verify against official sources for billing
          </span>
        </div>
      </div>
    </main>
  );
}

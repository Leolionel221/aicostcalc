import modelsData from "@/data/models.json";
import type { ModelsData } from "@/lib/types";

const data = modelsData as ModelsData;

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-24">
      <div className="max-w-2xl w-full space-y-8 text-center">
        <div className="inline-block rounded-full border px-4 py-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Foundation scaffold · Week 1
        </div>

        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          AI API Cost Calculator
        </h1>

        <p className="text-lg text-muted-foreground">
          Compare API pricing for {data.models.length}+ LLM models. Calculator
          UI shipping Week 2.
        </p>

        <div className="grid gap-3 text-left text-sm">
          {data.models.map((model) => (
            <div
              key={model.id}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div>
                <div className="font-semibold">{model.name}</div>
                <div className="text-muted-foreground text-xs">
                  {model.provider} · {model.i18n.en.tagline}
                </div>
              </div>
              <div className="text-right text-xs font-mono">
                <div>${model.pricing.input.toFixed(2)} in</div>
                <div>${model.pricing.output.toFixed(2)} out</div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-xs text-muted-foreground pt-4">
          Schema v{data.schemaVersion} · Last updated {data.lastUpdated}
        </div>
      </div>
    </main>
  );
}

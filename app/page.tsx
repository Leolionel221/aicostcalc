import modelsData from "@/data/models.json";
import type { ModelsData } from "@/lib/types";
import { Calculator } from "@/components/Calculator";
import { ModelComparison } from "@/components/ModelComparison";
import { MonthlyEstimator } from "@/components/MonthlyEstimator";
import { siteJsonLd } from "@/lib/seo";

const data = modelsData as ModelsData;

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary mb-3">
      <span className="h-1 w-4 rounded-full bg-primary" />
      {children}
    </div>
  );
}

export default function Home() {
  return (
    <main>
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }}
      />

      {/* Hero — two columns on desktop */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/8 via-background to-background" />
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 md:py-20">
          <div className="grid lg:grid-cols-[1.1fr_1.3fr] gap-12 items-center">
            {/* Left: copy */}
            <div className="space-y-6 lg:pr-4">
              <Eyebrow>Free · Open · Updated monthly</Eyebrow>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
                Calculate AI API costs in&nbsp;seconds.
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Compare pricing across {data.models.length}+ models from OpenAI,
                Anthropic, Google, DeepSeek, xAI and Mistral — including cached input
                and Batch API discounts.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-[color:var(--accent)] mt-0.5">✓</span>
                  <span><strong>Exact</strong> tokenization for OpenAI models, transparent estimates for others</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[color:var(--accent)] mt-0.5">✓</span>
                  <span>Side-by-side <strong>caching & batch</strong> savings</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[color:var(--accent)] mt-0.5">✓</span>
                  <span>Monthly cost forecasts for high-volume workloads</span>
                </li>
              </ul>
              <div className="flex flex-wrap gap-3 pt-2 text-xs text-muted-foreground">
                <span>Updated {data.lastUpdated}</span>
                <span>·</span>
                <span>USD / CNY / EUR / GBP / INR</span>
              </div>
            </div>

            {/* Right: calculator */}
            <div id="calculator" className="lg:pl-2">
              <Calculator
                models={data.models}
                defaultModelId={data.models[0]?.id}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Compare table — muted background for rhythm */}
      <section
        id="compare"
        className="border-b border-border bg-muted/30"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 md:py-24">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <Eyebrow>Side by side</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              All {data.models.length} models, ranked by cost
            </h2>
            <p className="mt-3 text-muted-foreground">
              Plug in your token usage. Sort, filter, hide. The cheapest pick for
              your workload is at the top.
            </p>
          </div>
          <div className="flex justify-center">
            <ModelComparison models={data.models} />
          </div>
        </div>
      </section>

      {/* Monthly estimator — back to default background */}
      <section id="forecast" className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 md:py-24">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <Eyebrow>Plan ahead</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Forecast your monthly bill
            </h2>
            <p className="mt-3 text-muted-foreground">
              Enter your daily call volume and average tokens. See the monthly damage
              across up to 5 models with savings highlighted.
            </p>
          </div>
          <div className="flex justify-center">
            <MonthlyEstimator
              models={data.models}
              defaultModelIds={[
                "gpt-5-6",
                "claude-opus-5",
                "gemini-3-6-flash",
              ]}
            />
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <span className="text-[color:var(--accent)] font-bold">✓</span>
              Last verified <strong className="text-foreground">{data.lastUpdated}</strong>
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="text-[color:var(--accent)] font-bold">✓</span>
              Schema v{data.schemaVersion}
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="text-[color:var(--accent)] font-bold">✓</span>
              Updated monthly
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="text-[color:var(--accent)] font-bold">✓</span>
              Open source on GitHub
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}

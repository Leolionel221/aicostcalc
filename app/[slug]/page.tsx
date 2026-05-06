import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import modelsData from "@/data/models.json";
import type { ModelsData, Model } from "@/lib/types";
import { Calculator } from "@/components/Calculator";
import { ModelPricingTable } from "@/components/ModelPricingTable";
import { ModelFAQ } from "@/components/ModelFAQ";
import { Card, CardContent } from "@/components/ui/card";
import { calculateStandard } from "@/lib/calculator";
import { formatCost } from "@/lib/currency";
import {
  modelSlug,
  modelMetadata,
  modelJsonLd,
  breadcrumbJsonLd,
  reportPriceUrl,
} from "@/lib/seo";

const data = modelsData as ModelsData;

// Force only the slugs returned by generateStaticParams to be valid; everything else 404s.
export const dynamicParams = false;

export async function generateStaticParams() {
  return data.models.map((m) => ({ slug: modelSlug(m.id) }));
}

function findModelBySlug(slug: string): Model | null {
  for (const m of data.models) {
    if (modelSlug(m.id) === slug) return m;
  }
  return null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const model = findModelBySlug(slug);
  if (!model) return {};
  return modelMetadata(model);
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary mb-3">
      <span className="h-1 w-4 rounded-full bg-primary" />
      {children}
    </div>
  );
}

export default async function ModelPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const model = findModelBySlug(slug);
  if (!model) notFound();

  // Top 5 alternative models for comparison (excluding self), sorted by cost ascending @1k+500
  const alternatives = data.models
    .filter((m) => m.id !== model.id)
    .map((m) => ({
      model: m,
      cost: calculateStandard(1000, 500, m).totalCost,
    }))
    .sort((a, b) => a.cost - b.cost)
    .slice(0, 5);

  const selfCost = calculateStandard(1000, 500, model).totalCost;

  // Recommended use cases — derive from model.useCase
  const useCaseLabels: Record<string, string> = {
    general: "general-purpose tasks",
    vision: "image and document understanding",
    coding: "code generation and review",
    reasoning: "complex multi-step reasoning",
    math: "mathematical problem-solving",
    science: "scientific research and analysis",
    "long-context": "long documents and large codebases",
    fast: "high-throughput, low-latency tasks",
    "real-time": "tasks needing real-time information",
    multilingual: "multilingual content",
    audio: "audio understanding and generation",
  };

  return (
    <main>
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(modelJsonLd(model)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd(model)),
        }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/8 via-background to-background" />
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 md:py-20">
          {/* Breadcrumb */}
          <div className="text-xs text-muted-foreground mb-6">
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span>{model.provider}</span>
            <span className="mx-2">/</span>
            <span className="text-foreground">{model.name}</span>
          </div>

          <div className="grid lg:grid-cols-[1.1fr_1.3fr] gap-12 items-start">
            {/* Left: copy */}
            <div className="space-y-6 lg:pr-4">
              <Eyebrow>{model.provider} pricing</Eyebrow>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.1]">
                {model.name} Cost Calculator
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {model.i18n.en.description}
              </p>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="rounded-lg border border-border p-3">
                  <div className="text-xs text-muted-foreground">Input</div>
                  <div className="text-lg font-semibold font-mono tabular-nums">
                    ${model.pricing.input.toFixed(2)}
                  </div>
                  <div className="text-[10px] text-muted-foreground">per 1M tokens</div>
                </div>
                <div className="rounded-lg border border-border p-3">
                  <div className="text-xs text-muted-foreground">Output</div>
                  <div className="text-lg font-semibold font-mono tabular-nums">
                    ${model.pricing.output.toFixed(2)}
                  </div>
                  <div className="text-[10px] text-muted-foreground">per 1M tokens</div>
                </div>
                <div className="rounded-lg border border-border p-3">
                  <div className="text-xs text-muted-foreground">Context window</div>
                  <div className="text-lg font-semibold font-mono tabular-nums">
                    {(model.limits.contextWindow / 1000).toFixed(0)}K
                  </div>
                  <div className="text-[10px] text-muted-foreground">tokens</div>
                </div>
                <div className="rounded-lg border border-border p-3">
                  <div className="text-xs text-muted-foreground">Released</div>
                  <div className="text-lg font-semibold">
                    {model.releaseDate.slice(0, 7)}
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    Cutoff {model.limits.knowledgeCutoff ?? "—"}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: calculator pre-selected */}
            <div className="lg:pl-2">
              <Calculator models={data.models} defaultModelId={model.id} />
            </div>
          </div>
        </div>
      </section>

      {/* Full pricing details */}
      <section className="border-b border-border bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-16 md:py-20">
          <div className="text-center mb-10">
            <Eyebrow>Detailed pricing</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              {model.name} pricing breakdown
            </h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              All pricing dimensions including caching and batch discounts.
            </p>
          </div>
          <ModelPricingTable model={model} />
          <p className="text-xs text-muted-foreground mt-4 text-center">
            Last verified {model.lastVerified} ·{" "}
            <a
              href={model.sources[0]?.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 underline hover:text-foreground"
            >
              {model.provider} official pricing
              <ExternalLink className="h-3 w-3" />
            </a>
            {" "}·{" "}
            <a
              href={reportPriceUrl(model)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 underline hover:text-foreground text-[color:var(--warning)]"
              title="Open a pre-filled GitHub issue to correct this price"
            >
              ⚠️ Spotted a wrong price? Report in 30s →
            </a>
          </p>
        </div>
      </section>

      {/* Comparison */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-16 md:py-20">
          <div className="text-center mb-10">
            <Eyebrow>How it compares</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              {model.name} vs alternatives
            </h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              Single-call cost (1000 input + 500 output tokens) ranked from cheapest.
            </p>
          </div>
          <Card>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-xs text-muted-foreground">
                    <th className="text-left py-3 px-4">Model</th>
                    <th className="text-right py-3 px-4">Per call</th>
                    <th className="text-right py-3 px-4 hidden sm:table-cell">vs {model.shortName}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/50 bg-primary/5">
                    <td className="py-3 px-4">
                      <div className="font-semibold">{model.name}</div>
                      <div className="text-xs text-muted-foreground">{model.provider} · this page</div>
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums font-semibold">
                      {formatCost(selfCost, "USD")}
                    </td>
                    <td className="py-3 px-4 text-right text-xs text-muted-foreground hidden sm:table-cell">
                      —
                    </td>
                  </tr>
                  {alternatives.map(({ model: alt, cost }) => {
                    const diff = cost - selfCost;
                    const pct = selfCost > 0 ? (diff / selfCost) * 100 : 0;
                    return (
                      <tr key={alt.id} className="border-b border-border/50 last:border-b-0 hover:bg-muted/30">
                        <td className="py-3 px-4">
                          <Link
                            href={`/${modelSlug(alt.id)}`}
                            className="font-medium hover:text-primary transition-colors"
                          >
                            {alt.name}
                          </Link>
                          <div className="text-xs text-muted-foreground">{alt.provider}</div>
                        </td>
                        <td className="py-3 px-4 text-right font-mono tabular-nums">
                          {formatCost(cost, "USD")}
                        </td>
                        <td className="py-3 px-4 text-right text-xs hidden sm:table-cell">
                          <span
                            className={
                              diff < 0
                                ? "text-[color:var(--accent)]"
                                : diff > 0
                                  ? "text-muted-foreground"
                                  : ""
                            }
                          >
                            {diff < 0 ? "−" : "+"}
                            {Math.abs(pct).toFixed(0)}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* When to use */}
      <section className="border-b border-border bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-16 md:py-20">
          <div className="text-center mb-8">
            <Eyebrow>Recommended use</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              When to choose {model.name}
            </h2>
          </div>
          <Card>
            <CardContent className="p-6 space-y-4">
              <p className="text-base leading-relaxed">
                <strong>{model.name}</strong> shines for{" "}
                {model.useCase
                  .map((uc) => useCaseLabels[uc] ?? uc)
                  .join(", ")
                  .replace(/, ([^,]*)$/, ", and $1")}
                .{" "}
                {model.tokenization.encoder !== "approximate"
                  ? "Token counts on this page are exact via the official tokenizer."
                  : "Token counts are estimated within ~10-20% margin."}
              </p>
              <div className="text-sm text-muted-foreground space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-[color:var(--accent)] mt-0.5">✓</span>
                  <span>
                    Context window of <strong>{(model.limits.contextWindow / 1000).toFixed(0)}K tokens</strong>{" "}
                    handles {model.limits.contextWindow >= 1_000_000 ? "entire codebases or book-length documents" : model.limits.contextWindow >= 200000 ? "long conversations and large documents" : "typical chat and document tasks"}.
                  </span>
                </div>
                {model.supports.caching && (
                  <div className="flex items-start gap-2">
                    <span className="text-[color:var(--accent)] mt-0.5">✓</span>
                    <span>
                      Prompt caching available — significant savings for repeated system prompts.
                    </span>
                  </div>
                )}
                {model.supports.batch && (
                  <div className="flex items-start gap-2">
                    <span className="text-[color:var(--accent)] mt-0.5">✓</span>
                    <span>Batch API support for non-realtime workloads at ~50% discount.</span>
                  </div>
                )}
                {model.supports.tools && (
                  <div className="flex items-start gap-2">
                    <span className="text-[color:var(--accent)] mt-0.5">✓</span>
                    <span>Tool / function calling supported.</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16 md:py-20">
          <div className="text-center mb-10">
            <Eyebrow>FAQ</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Frequently asked questions
            </h2>
          </div>
          <ModelFAQ model={model} />
        </div>
      </section>

      {/* Related models */}
      <section className="bg-muted/30">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-16 md:py-20">
          <div className="text-center mb-10">
            <Eyebrow>Related</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Other models you might consider
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {alternatives.slice(0, 6).map(({ model: alt }) => (
              <Link
                key={alt.id}
                href={`/${modelSlug(alt.id)}`}
                className="group rounded-xl border border-border bg-background p-5 hover:border-primary/50 hover:shadow-sm transition-all"
              >
                <div className="text-xs text-muted-foreground mb-1">
                  {alt.provider}
                </div>
                <div className="font-semibold mb-2 group-hover:text-primary transition-colors flex items-center gap-1">
                  {alt.name}
                  <ArrowRight className="h-3.5 w-3.5 opacity-0 -ml-1 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                </div>
                <div className="text-xs text-muted-foreground line-clamp-2 mb-3">
                  {alt.i18n.en.tagline}
                </div>
                <div className="flex justify-between text-xs font-mono tabular-nums">
                  <span>${alt.pricing.input.toFixed(2)} in</span>
                  <span>${alt.pricing.output.toFixed(2)} out</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

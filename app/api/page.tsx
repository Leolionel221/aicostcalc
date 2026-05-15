import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Free Public API — AI Model Pricing Data",
  description:
    "Free, public, no-auth JSON API for AI model pricing and capability data. Powered by LiteLLM-verified data. MIT licensed, CDN-cached, rate-limit-free for normal use.",
  alternates: { canonical: "/api" },
};

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary mb-3">
      <span className="h-1 w-4 rounded-full bg-primary" />
      {children}
    </div>
  );
}

function Endpoint({
  method,
  path,
  description,
  example,
  children,
}: {
  method: string;
  path: string;
  description: string;
  example: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-background p-6 mb-6">
      <div className="flex items-center gap-3 mb-2">
        <span className="px-2 py-0.5 rounded text-xs font-mono font-semibold bg-[color:var(--accent)]/10 text-[color:var(--accent)]">
          {method}
        </span>
        <code className="font-mono text-sm font-semibold">{path}</code>
      </div>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      <div className="text-xs text-muted-foreground mb-1.5">Example:</div>
      <pre className="text-xs bg-muted rounded-md p-3 overflow-x-auto font-mono">
        <code>{example}</code>
      </pre>
      {children}
    </div>
  );
}

export default function ApiDocsPage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/8 via-background to-background" />
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12 md:py-20 text-center">
          <Eyebrow>Free Public API · No auth · MIT</Eyebrow>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.1]">
            AI model pricing data, <br />
            <span className="text-primary">free for everyone</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            A community-friendly JSON API exposing the same pricing data that
            powers the calculator. LiteLLM-verified, monthly-refreshed, CDN-cached.
            Build cost estimators, comparison tools, internal dashboards — no
            signup required.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href="/api/v1/models"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors"
            >
              Try /api/v1/models →
            </a>
            <a
              href="https://github.com/Leolionel221/aicostcalc"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md border border-border font-medium text-sm hover:bg-muted transition-colors"
            >
              Source on GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Quick start */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12 md:py-16">
          <Eyebrow>30-second start</Eyebrow>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
            Just fetch it.
          </h2>
          <p className="text-muted-foreground mb-6">
            No API key, no rate limits for normal use, no signup. Hit any
            endpoint with a GET request.
          </p>
          <pre className="text-sm bg-muted rounded-lg p-4 overflow-x-auto font-mono">
            <code>{`# Get all models
curl https://aicostcalc.net/api/v1/models

# Get a single model
curl https://aicostcalc.net/api/v1/models/gpt-5-5

# Get just pricing (lighter payload)
curl https://aicostcalc.net/api/v1/pricing?provider=anthropic`}</code>
          </pre>
          <p className="text-sm text-muted-foreground mt-4">
            All responses are JSON, all CORS-enabled, all aggressively CDN-cached
            (1 hour browser, 24 hour edge).
          </p>
        </div>
      </section>

      {/* Endpoints */}
      <section className="border-b border-border bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-16 md:py-20">
          <div className="text-center mb-10">
            <Eyebrow>Endpoints</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Three endpoints. Zero ceremony.
            </h2>
          </div>

          <Endpoint
            method="GET"
            path="/api/v1/models"
            description="List all 10 supported AI models with full data (pricing, limits, capabilities, lifecycle). Supports filter query params."
            example={`GET /api/v1/models
GET /api/v1/models?provider=anthropic
GET /api/v1/models?category=flagship
GET /api/v1/models?capability=caching
GET /api/v1/models?status=active`}
          >
            <div className="mt-3 text-xs text-muted-foreground">
              <strong>Filters</strong>: <code className="font-mono">provider</code> /{" "}
              <code className="font-mono">category</code> /{" "}
              <code className="font-mono">capability</code> /{" "}
              <code className="font-mono">status</code>. Filters compose with AND.
            </div>
          </Endpoint>

          <Endpoint
            method="GET"
            path="/api/v1/models/{id}"
            description="Full data for a single model. Returns 404 with availableIds list if id is unknown."
            example={`GET /api/v1/models/gpt-5-5
GET /api/v1/models/claude-opus-4-7
GET /api/v1/models/deepseek-v3-2`}
          />

          <Endpoint
            method="GET"
            path="/api/v1/pricing"
            description="Lightweight pricing-only response. Skip the metadata, keep just the prices. Same filter support as /models."
            example={`GET /api/v1/pricing
GET /api/v1/pricing?provider=openai`}
          />
        </div>
      </section>

      {/* Schema */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12 md:py-16">
          <Eyebrow>Schema</Eyebrow>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            What you get back
          </h2>
          <p className="text-muted-foreground mb-6">
            Full schema reference is in our{" "}
            <a
              href="https://github.com/Leolionel221/aicostcalc/blob/main/lib/types.ts"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline hover:no-underline"
            >
              TypeScript types file
            </a>
            . The shape of a model entry:
          </p>
          <pre className="text-xs bg-muted rounded-lg p-4 overflow-x-auto font-mono">
            <code>{`{
  "id": "gpt-5-5",
  "name": "GPT-5.5",
  "shortName": "GPT-5.5",
  "provider": "OpenAI",
  "providerId": "openai",
  "category": "flagship",          // flagship | small | reasoning | balanced
  "useCase": ["general", "vision", "reasoning", "coding"],
  "releaseDate": "2026-04-23",
  "status": "active",              // active | deprecated | preview | legacy
  "deprecatedAt": null,
  "successorId": null,

  "pricing": {
    "currency": "USD",
    "unit": "per_1m_tokens",
    "input": 5.00,
    "output": 30.00,
    "cachedInput": 0.50,           // null if not supported
    "cacheWrite": null,            // null if not supported
    "batchInput": 2.50,            // null if not supported
    "batchOutput": 15.00,
    "imagePerImage": null,         // null until image pricing added (V1.1)
    "reasoningOutput": null,
    "fineTunedInput": null,
    "fineTunedOutput": null
  },

  "limits": {
    "contextWindow": 1050000,
    "maxOutput": 128000,
    "maxImagesPerRequest": null,
    "knowledgeCutoff": "2026-02"
  },

  "tokenization": {
    "encoder": "o200k_base",       // tiktoken encoder, or "approximate"
    "approximationRatio": { "english": 4, "chinese": 1.5, "code": 3 }
  },

  "supports": {
    "vision": true, "audio": false, "tools": true, "streaming": true,
    "caching": true, "batch": true, "fineTuning": false, "structuredOutput": true
  },

  "lastVerified": "2026-05-12",
  "sources": [
    { "type": "community", "url": "...", "fetchedAt": "..." },
    { "type": "official",  "url": "...", "fetchedAt": "..." }
  ],
  "priceHistory": [
    { "date": "2026-04-23", "input": 5.00, "output": 30.00, "note": "Initial release" }
  ],
  "i18n": {
    "en": { "tagline": "...", "description": "..." },
    "zh": { "tagline": "...", "description": "..." }
  }
}`}</code>
          </pre>
        </div>
      </section>

      {/* Data accuracy */}
      <section className="border-b border-border bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12 md:py-16">
          <Eyebrow>Data accuracy</Eyebrow>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Where the numbers come from
          </h2>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-[color:var(--accent)] mt-0.5">✓</span>
              <span>
                <strong>Primary source</strong>:{" "}
                <a
                  href="https://github.com/BerriAI/litellm/blob/main/model_prices_and_context_window.json"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline hover:no-underline"
                >
                  LiteLLM&apos;s public model registry
                </a>{" "}
                — the de facto industry standard, used by millions of LangChain
                and LiteLLM installations. Errors get caught and PR&apos;d by
                the community within hours.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[color:var(--accent)] mt-0.5">✓</span>
              <span>
                <strong>Secondary source</strong>: Each provider&apos;s official
                pricing page (links in every model&apos;s{" "}
                <code className="font-mono">sources</code> field).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[color:var(--accent)] mt-0.5">✓</span>
              <span>
                <strong>Refresh cadence</strong>: Monthly (1st of every month)
                against both sources, with diff review before publication.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[color:var(--warning)] mt-0.5">⚠</span>
              <span>
                <strong>Disclaimer</strong>: This is informational data. For
                final billing accuracy, always verify against the
                provider&apos;s own pricing page. Spotted an error?{" "}
                <a
                  href="https://github.com/Leolionel221/aicostcalc/issues/new?labels=pricing-correction"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline hover:no-underline"
                >
                  Open a GitHub issue
                </a>
                {" "}— corrections typically deploy within 24 hours.
              </span>
            </li>
          </ul>
        </div>
      </section>

      {/* Use cases */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12 md:py-16">
          <Eyebrow>What people build with this</Eyebrow>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
            Some ideas
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                title: "Internal cost dashboards",
                description:
                  "Pipe pricing into your team's BI tool. See your AI spend against current public rates.",
              },
              {
                title: "Slack/Discord bots",
                description:
                  "/cost gpt-5.5 → instant pricing. /compare gpt-5.5 claude-opus-4-7 → side-by-side.",
              },
              {
                title: "Browser extensions",
                description:
                  "Inject cost estimates into provider playground / chat UI based on token count.",
              },
              {
                title: "AI model recommendation UX",
                description:
                  "In your AI product, recommend the cheapest model meeting a capability requirement.",
              },
              {
                title: "FinOps automation",
                description:
                  "Flag when a model's price changes (poll the API, diff against last snapshot).",
              },
              {
                title: "AI gateway / proxy",
                description:
                  "Route requests to the cheapest available model that supports the required capability.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-lg border border-border p-4"
              >
                <div className="font-semibold mb-1">{item.title}</div>
                <div className="text-sm text-muted-foreground">
                  {item.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* License + rate limits */}
      <section className="bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <Eyebrow>License</Eyebrow>
              <h3 className="text-xl font-bold tracking-tight mb-2">MIT</h3>
              <p className="text-sm text-muted-foreground">
                The data is free to use commercially, embed in products,
                redistribute. Attribution appreciated but not required. The same
                license applies to the{" "}
                <a
                  href="https://github.com/Leolionel221/aicostcalc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline hover:no-underline"
                >
                  source code
                </a>
                .
              </p>
            </div>
            <div>
              <Eyebrow>Rate limits</Eyebrow>
              <h3 className="text-xl font-bold tracking-tight mb-2">
                None for normal use
              </h3>
              <p className="text-sm text-muted-foreground">
                Vercel CDN handles the load. Cached at edge for 24 hours, so
                most requests never even hit the origin. If you&apos;re planning
                10K+ requests/hour, please <Link href="/contact" className="text-primary underline hover:no-underline">say hi</Link> so we can size accordingly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section>
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12 text-center">
          <h3 className="text-2xl font-bold tracking-tight mb-3">
            Built something with this?
          </h3>
          <p className="text-muted-foreground mb-6">
            Tell us on GitHub — we&apos;ll feature it here.
          </p>
          <a
            href="https://github.com/Leolionel221/aicostcalc/issues/new?title=Built+with+aicostcalc+API&labels=showcase"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors"
          >
            Share what you built →
          </a>
        </div>
      </section>
    </main>
  );
}

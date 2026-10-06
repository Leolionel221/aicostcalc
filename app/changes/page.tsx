import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, Plus, Rss, Sparkles, ArrowLeftRight } from "lucide-react";
import modelsData from "@/data/models.json";
import type { ModelsData } from "@/lib/types";
import { buildChangeLog, type ChangeEvent, type ChangeKind } from "@/lib/changes";
import { cn } from "@/lib/utils";

const data = modelsData as ModelsData;
const events = buildChangeLog(data.models);

export const metadata: Metadata = {
  title: "AI API Price Changes & New Models — Updated Daily",
  description:
    "Every new LLM API model and every price change we track, newest first — OpenAI, Anthropic, Google, DeepSeek, xAI and Mistral. Reconciled daily against the LiteLLM registry. RSS available.",
  alternates: {
    canonical: "/changes",
    types: { "application/rss+xml": "/changes/rss.xml" },
  },
};

const usd = (n: number) => `$${n.toFixed(2)}`;

const KIND: Record<ChangeKind, { label: string; icon: typeof Plus; tone: string }> = {
  released: { label: "Released", icon: Sparkles, tone: "text-primary" },
  added: { label: "Added", icon: Plus, tone: "text-primary" },
  "price-cut": { label: "Price cut", icon: ArrowDownRight, tone: "text-[color:var(--accent)]" },
  "price-rise": { label: "Price rise", icon: ArrowUpRight, tone: "text-destructive" },
  "price-change": { label: "Price change", icon: ArrowLeftRight, tone: "text-muted-foreground" },
};

function monthLabel(ym: string) {
  const [y, m] = ym.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

function EventRow({ e }: { e: ChangeEvent }) {
  const k = KIND[e.kind];
  const Icon = k.icon;
  const isPrice = e.kind.startsWith("price");
  return (
    <li className="flex gap-3 py-3">
      <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", k.tone)} aria-hidden />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <Link href={e.href} className="font-medium hover:underline">
            {e.modelName}
          </Link>
          <span className="text-xs text-muted-foreground">{e.provider}</span>
          <span className={cn("text-xs font-semibold uppercase tracking-wide", k.tone)}>{k.label}</span>
        </div>
        <div className="mt-0.5 font-mono text-xs tabular-nums text-muted-foreground">
          {isPrice && e.before ? (
            <>
              {usd(e.before.input)}/{usd(e.before.output)} → {usd(e.input)}/{usd(e.output)} per 1M
              {e.kind !== "price-change" && e.callDelta !== undefined && (
                <span className={cn("ml-2", k.tone)}>
                  {e.callDelta < 0 ? "" : "+"}
                  {Math.round(e.callDelta * 100)}% per call
                </span>
              )}
            </>
          ) : (
            <>
              {usd(e.input)} input / {usd(e.output)} output per 1M
            </>
          )}
        </div>
      </div>
      <time dateTime={e.date} className="shrink-0 font-mono text-xs tabular-nums text-muted-foreground">
        {e.date}
      </time>
    </li>
  );
}

export default function ChangesPage() {
  const byMonth = new Map<string, ChangeEvent[]>();
  for (const e of events) {
    const ym = e.date.slice(0, 7);
    if (!byMonth.has(ym)) byMonth.set(ym, []);
    byMonth.get(ym)!.push(e);
  }
  const priceMoves = events.filter((e) => e.kind.startsWith("price")).length;

  return (
    <main className="mx-auto max-w-3xl px-4 sm:px-6 py-12 md:py-16">
      <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary mb-3">
        <span className="h-1 w-4 rounded-full bg-primary" />
        Changelog
      </div>
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
        AI API price changes &amp; new models
      </h1>
      <p className="mt-3 text-muted-foreground leading-relaxed">
        Every model we list and every price move we have recorded, newest first. Prices are
        reconciled against the{" "}
        <a
          href="https://github.com/BerriAI/litellm"
          className="underline underline-offset-2 hover:text-foreground"
          target="_blank"
          rel="noopener noreferrer"
        >
          LiteLLM registry
        </a>{" "}
        every day, and new models are added the day they appear there.
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
        <span className="text-muted-foreground">
          {data.models.length} models · {priceMoves} price change{priceMoves === 1 ? "" : "s"} · data
          last changed <time dateTime={data.lastUpdated}>{data.lastUpdated}</time>
          {/* Not "last checked": the daily sync only commits when something changed, so
              on quiet days this date stays put while the check itself still ran. */}
        </span>
        <a
          href="/changes/rss.xml"
          className="inline-flex items-center gap-1.5 text-primary hover:underline"
        >
          <Rss className="h-3.5 w-3.5" aria-hidden />
          RSS feed
        </a>
      </div>

      <p className="mt-4 text-xs text-muted-foreground leading-relaxed">
        <strong className="font-semibold">Released</strong> uses the provider&apos;s release date.{" "}
        <strong className="font-semibold">Added</strong>{" "}is the day we started listing a model —
        the registry doesn&apos;t record release dates, so we don&apos;t guess one. Corrections to
        our own data are not shown as price changes.
      </p>

      <div className="mt-10 space-y-10">
        {[...byMonth.entries()].map(([ym, list]) => (
          <section key={ym}>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground border-b border-border pb-2">
              {monthLabel(ym)}
            </h2>
            <ul className="divide-y divide-border">
              {list.map((e) => (
                <EventRow key={`${e.modelId}-${e.kind}-${e.date}`} e={e} />
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}

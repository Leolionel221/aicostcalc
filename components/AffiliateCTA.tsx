"use client";

import { ExternalLink } from "lucide-react";
import modelsData from "@/data/models.json";
import { NOVITA, novitaServes, novitaUrl } from "@/lib/affiliate";
import { track } from "@/lib/analytics";
import type { Model, ModelsData } from "@/lib/types";

/**
 * Cheapest input price among the open-weight models Novita actually hosts.
 *
 * Derived from data/models.json rather than hardcoded: this line previously
 * read "$0.14/1M", which was a DeepSeek V4-Flash price that turned out not to
 * match the LiteLLM registry (corrected 2026-08-24 to $0.44). A number typed
 * into ad copy has no way of noticing when the data moves; a computed one does.
 */
const OPEN_MODEL_FLOOR = Math.min(
  ...(modelsData as ModelsData).models
    .filter((m) => m.providerId === "deepseek")
    .map((m) => m.pricing.input),
);

interface AffiliateCTAProps {
  model: Model;
  /** Attribution tag: "calculator" | "model-page" */
  placement: string;
}

/**
 * The cash register. Rendered in high-intent spots (calculator result,
 * model landing pages). Honest framing:
 * - DeepSeek models: Novita actually hosts them → direct CTA
 * - Other models: cost-saving alternative pitch (never claims Novita
 *   hosts proprietary models)
 * Compliance: rel="sponsored", visible affiliate disclosure, GA4 tracking.
 */
export function AffiliateCTA({ model, placement }: AffiliateCTAProps) {
  const direct = novitaServes(model.providerId);
  const href = novitaUrl(placement);

  const handleClick = () => {
    track("affiliate_link_clicked", {
      partner: NOVITA.id,
      model_id: model.id,
      placement,
      direct,
    });
  };

  return (
    <div className="rounded-lg border border-[color:var(--accent)]/30 bg-[color:var(--accent)]/5 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          {direct ? (
            <>
              <div className="text-sm font-semibold">
                Run {model.name} on {NOVITA.name}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Hosted API for 200+ open models — pay-as-you-go, no subscription.
              </p>
            </>
          ) : (
            <>
              <div className="text-sm font-semibold">
                Cutting costs? Open models start at $
                {OPEN_MODEL_FLOOR.toFixed(2)}/1M
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                DeepSeek, Kimi &amp; 200+ open models on {NOVITA.name} — often
                5–20x cheaper than proprietary APIs for comparable tasks.
              </p>
            </>
          )}
        </div>
        <a
          href={href}
          target="_blank"
          rel="sponsored noopener noreferrer"
          onClick={handleClick}
          className="shrink-0 inline-flex items-center gap-1.5 rounded-md bg-[color:var(--accent)] px-3 py-1.5 text-xs font-medium text-white hover:opacity-90 transition-opacity"
        >
          Try {NOVITA.name}
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
      <p className="mt-2 text-[10px] text-muted-foreground/70">
        Affiliate link — we may earn a commission at no extra cost to you.
      </p>
    </div>
  );
}

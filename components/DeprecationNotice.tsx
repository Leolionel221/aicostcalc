import Link from "next/link";
import { AlertTriangle, Clock } from "lucide-react";
import modelsData from "@/data/models.json";
import type { Model, ModelsData } from "@/lib/types";
import { modelSlug } from "@/lib/seo";

const data = modelsData as ModelsData;

/**
 * Warn when the provider has scheduled this model for retirement.
 *
 * `status` and `deprecatedAt` existed in the schema from the start but nothing
 * rendered them, so on 2026-08-27 the site was still presenting Grok 4 as a
 * current option — xAI retired it on 2026-05-15, three months earlier. Quoting
 * a price for an API that no longer answers is the same class of error as
 * quoting the wrong price, and a reader picking a model has no other way to
 * find out from this page.
 *
 * Replacements are listed, not asserted: the registry carries retirement dates
 * but no successor mapping, so this offers the provider's other current models
 * rather than inventing an official upgrade path.
 */
export function DeprecationNotice({ model }: { model: Model }) {
  if (!model.deprecatedAt) return null;

  const retired = model.status === "deprecated";
  const alternatives = data.models
    .filter(
      (m) =>
        m.providerId === model.providerId &&
        m.id !== model.id &&
        m.status !== "deprecated",
    )
    .sort((a, b) => b.pricing.input - a.pricing.input)
    .slice(0, 3);

  return (
    <div
      className={
        retired
          ? "rounded-lg border border-destructive/40 bg-destructive/5 p-4"
          : "rounded-lg border border-border bg-muted/40 p-4"
      }
      role="note"
    >
      <div className="flex gap-3">
        {retired ? (
          <AlertTriangle className="h-5 w-5 shrink-0 text-destructive mt-0.5" />
        ) : (
          <Clock className="h-5 w-5 shrink-0 text-muted-foreground mt-0.5" />
        )}
        <div className="space-y-1.5 text-sm">
          <div className="font-semibold">
            {retired
              ? `${model.provider} retired ${model.name} on ${model.deprecatedAt}`
              : `${model.provider} plans to retire ${model.name} on ${model.deprecatedAt}`}
          </div>
          <p className="text-muted-foreground leading-relaxed">
            {retired
              ? "The prices below are kept for reference and for comparing against current models. New requests to this model are unlikely to succeed."
              : "Pricing below is still current. Worth factoring the retirement date into anything you are building on it long-term."}
          </p>
          {alternatives.length > 0 && (
            <p className="text-muted-foreground">
              Still available from {model.provider}:{" "}
              {alternatives.map((m, i) => (
                <span key={m.id}>
                  {i > 0 && ", "}
                  <Link
                    href={`/${modelSlug(m.id)}`}
                    className="text-primary hover:underline"
                  >
                    {m.name}
                  </Link>
                </span>
              ))}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

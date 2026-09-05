import { PencilLine } from "lucide-react";
import type { Model } from "@/lib/types";

/**
 * Shown on pages the daily sync published without a human read.
 *
 * The numbers on a draft are registry values and are as trustworthy as any
 * other page here. What has not happened yet is someone checking lineage and
 * positioning — so the notice says exactly that, rather than hedging on the
 * prices themselves. Deleting the model's `draft` field removes this.
 */
export function DraftNotice({ model }: { model: Model }) {
  if (!model.draft) return null;
  return (
    <div className="rounded-lg border border-border bg-muted/40 p-4" role="note">
      <div className="flex gap-3">
        <PencilLine className="h-5 w-5 shrink-0 text-muted-foreground mt-0.5" />
        <div className="space-y-1 text-sm">
          <div className="font-semibold">
            Listed automatically on {model.draft.generatedAt}
          </div>
          <p className="text-muted-foreground leading-relaxed">
            Prices and limits come straight from the LiteLLM registry and are
            verified daily. The description is generated from those numbers and
            has not yet been reviewed by a person, so it may miss context about
            how this model relates to others in its family.
          </p>
        </div>
      </div>
    </div>
  );
}

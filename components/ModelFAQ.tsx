"use client";

import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Model } from "@/lib/types";
import { buildFAQs } from "@/lib/faq";

interface ModelFAQProps {
  model: Model;
}

export function ModelFAQ({ model }: ModelFAQProps) {
  const faqs = buildFAQs(model);
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const baseId = useId();

  return (
    <div className="space-y-3">
      {faqs.map((faq, i) => {
        const open = openIdx === i;
        const panelId = `${baseId}-panel-${i}`;
        const buttonId = `${baseId}-button-${i}`;
        return (
          <div
            key={i}
            className="rounded-lg border border-border overflow-hidden"
          >
            <button
              type="button"
              id={buttonId}
              aria-controls={panelId}
              onClick={() => setOpenIdx(open ? null : i)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/30 transition-colors"
              aria-expanded={open}
            >
              <span className="font-medium pr-4">{faq.q}</span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 text-muted-foreground shrink-0 transition-transform",
                  open && "rotate-180",
                )}
              />
            </button>
            {/*
              Collapsed answers stay mounted and are hidden with CSS rather than
              unmounted. They previously used `{open && ...}`, which meant the
              statically rendered HTML carried only the first answer — the other
              six per page never reached a crawler, and the FAQPage JSON-LD below
              would have described text that wasn't on the page.
            */}
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={cn(
                "grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none",
                open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="overflow-hidden">
                <div className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed">
                  {faq.a}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

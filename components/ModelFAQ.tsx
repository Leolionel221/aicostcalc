"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Model } from "@/lib/types";

interface FAQItem {
  q: string;
  a: string;
}

function buildFAQs(model: Model): FAQItem[] {
  const inputPrice = `$${model.pricing.input.toFixed(2)}`;
  const outputPrice = `$${model.pricing.output.toFixed(2)}`;
  const ctx = `${(model.limits.contextWindow / 1000).toFixed(0)}K`;

  const faqs: FAQItem[] = [
    {
      q: `How much does ${model.name} cost per API call?`,
      a: `${model.name} costs ${inputPrice} per 1M input tokens and ${outputPrice} per 1M output tokens. A typical chat call (1000 input + 500 output tokens) costs approximately $${(model.pricing.input / 1000 + model.pricing.output / 2000).toFixed(4)}. Use the calculator above to estimate your specific use case.`,
    },
    {
      q: `What's the context window of ${model.name}?`,
      a: `${model.name} supports a ${ctx} token context window with a max output of ${model.limits.maxOutput.toLocaleString()} tokens.${
        model.limits.knowledgeCutoff
          ? ` Knowledge cutoff: ${model.limits.knowledgeCutoff}.`
          : ""
      }`,
    },
  ];

  if (model.supports.caching && model.pricing.cachedInput !== null) {
    const savings = Math.round(
      ((model.pricing.input - model.pricing.cachedInput) / model.pricing.input) * 100,
    );
    faqs.push({
      q: `Does ${model.name} support prompt caching?`,
      a: `Yes. Cached input is priced at $${model.pricing.cachedInput.toFixed(2)} per 1M tokens — ${savings}% cheaper than uncached input. This is especially valuable for repeated system prompts, long-context retrieval, and chat threads with shared history.`,
    });
  }

  if (model.supports.batch && model.pricing.batchInput !== null) {
    faqs.push({
      q: `Can I use the Batch API with ${model.name}?`,
      a: `Yes. ${model.name} supports the Batch API at $${model.pricing.batchInput.toFixed(2)} input / $${model.pricing.batchOutput?.toFixed(2)} output per 1M tokens — typically 50% off standard pricing. Batch jobs complete within ~24 hours, ideal for non-realtime workloads like overnight data processing or content generation pipelines.`,
    });
  }

  if (model.supports.vision) {
    faqs.push({
      q: `Does ${model.name} support image input?`,
      a: `Yes, ${model.name} accepts image input. Vision token pricing is generally calculated based on image dimensions and folded into the input token count. Specific image-specific pricing varies — refer to ${model.provider}'s official documentation.`,
    });
  }

  faqs.push({
    q: `How accurate is this calculator?`,
    a: `${
      model.tokenization.encoder !== "approximate"
        ? `Token counts for ${model.name} use the official ${model.tokenization.encoder} tokenizer (exact). Cost calculations use the prices verified on ${model.lastVerified}.`
        : `Token counts for ${model.name} are estimated from character ratios (~10-20% margin). Cost calculations use prices verified on ${model.lastVerified}.`
    } For final billing accuracy, always verify with ${model.provider}'s usage dashboard.`,
  });

  faqs.push({
    q: `Is ${model.name} available for fine-tuning?`,
    a: model.supports.fineTuning
      ? `Yes, ${model.provider} offers fine-tuning for ${model.name}. Fine-tuned model pricing is separate from base model pricing — check ${model.provider}'s pricing page for current fine-tuning rates.`
      : `${model.name} does not currently support fine-tuning. Consider another model in the ${model.provider} family if fine-tuning is required.`,
  });

  return faqs;
}

interface ModelFAQProps {
  model: Model;
}

export function ModelFAQ({ model }: ModelFAQProps) {
  const faqs = buildFAQs(model);
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {faqs.map((faq, i) => {
        const open = openIdx === i;
        return (
          <div
            key={i}
            className="rounded-lg border border-border overflow-hidden"
          >
            <button
              type="button"
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
            {open && (
              <div className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed">
                {faq.a}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

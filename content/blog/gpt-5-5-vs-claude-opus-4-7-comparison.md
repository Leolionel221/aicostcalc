---
title: "GPT-5.5 vs Claude Opus 4.7: Cost & Performance Comparison (and What Replaced Them)"
description: "GPT-5.5 and Claude Opus 4.7 are now previous-generation models. Their live prices side by side, what changed since May 2026, and the current equivalents to compare instead: GPT-6 Astra and GPT-6.1 Sol vs Claude Opus 5.5 and Sonnet 5.5."
date: "2026-05-05"
author: "AI Cost Calc Team"
tags: ["openai", "anthropic", "comparison", "gpt-5", "claude-opus", "cost-optimization"]
readingTime: "7 min read"
featured: true
lastUpdated: "2026-10-29"
---

> **📊 Prices on this page are live**: they're pulled from the site's dataset at build time, last verified **{{updated}}**. **October 2026 update:** both models in this comparison are now previous-generation. GPT-5.5 is still available. Claude Opus 4.7 is still available, with a listed retirement date of **2027-04-16**. This update removes per-call figures and capability claims from the original article that no longer hold, and adds the current models to compare instead.

In May 2026, **GPT-5.5** (OpenAI, released April 2026) and **Claude Opus 4.7** (Anthropic) were the two flagship models most teams were choosing between. Both have since been superseded. OpenAI released GPT-5.6 in June and the GPT-6 family in September. Anthropic followed Opus 4.7 with Opus 4.8, Opus 5, Opus 5.5 and Sonnet 5.5.

If you're choosing a model today, start with the next section. If you're running one of these two models and want to know what it costs and when to move, the original comparison follows it.

## What replaced them

| Model | Input / output per 1M | Cached input | Batch (in/out) | Context | Cost per call* |
|---|---|---|---|---|---|
| [**GPT-6 Astra**](/gpt-6-astra-cost-calculator) | {{pair:gpt-6-astra}} | {{cached:gpt-6-astra}} | {{batch-pair:gpt-6-astra}} | {{ctx:gpt-6-astra}} | {{call:gpt-6-astra}} |
| [**GPT-6.1 Sol**](/gpt-6-1-sol-cost-calculator) | {{pair:gpt-6-1-sol}} | {{cached:gpt-6-1-sol}} | {{batch-pair:gpt-6-1-sol}} | {{ctx:gpt-6-1-sol}} | {{call:gpt-6-1-sol}} |
| [**Claude Opus 5.5**](/claude-opus-5-5-cost-calculator) | {{pair:claude-opus-5-5}} | {{cached:claude-opus-5-5}} | not listed | {{ctx:claude-opus-5-5}} | {{call:claude-opus-5-5}} |
| [**Claude Sonnet 5.5**](/claude-sonnet-5-5-cost-calculator) | {{pair:claude-sonnet-5-5}} | {{cached:claude-sonnet-5-5}} | {{batch-pair:claude-sonnet-5-5}} | {{ctx:claude-sonnet-5-5}} | {{call:claude-sonnet-5-5}} |
| *GPT-5.5 (for reference)* | {{pair:gpt-5-5}} | {{cached:gpt-5-5}} | {{batch-pair:gpt-5-5}} | {{ctx:gpt-5-5}} | {{call:gpt-5-5}} |
| *Claude Opus 4.7 (for reference)* | {{pair:claude-opus-4-7}} | {{cached:claude-opus-4-7}} | {{batch-pair:claude-opus-4-7}} | {{ctx:claude-opus-4-7}} | {{call:claude-opus-4-7}} |

\* One call = 1,000 input + 500 output tokens, no caching.

What each provider says about its new models:

- **GPT-6 Astra** (released 2026-09-03): OpenAI calls it "our most capable model".
- **GPT-6.1 Sol** (released 2026-09-29): the same input/output price as GPT-6 Sol, with cached input at half GPT-6 Sol's rate. OpenAI pitches it as "Near-Astra performance for complex work at a lower cost". Prompts over 272K tokens are billed at a higher long-context rate: $4.00 input / $15.00 output per 1M tokens (OpenAI's published rate).
- **Claude Opus 5.5:** Anthropic's current Opus. It costs less per token than Opus 4.7. Anthropic says it "remains clearly stronger at complex, open-ended work" than Sonnet 5.5. Our dataset doesn't list a Batch price for it.
- **Claude Sonnet 5.5** (released 2026-09-28): Anthropic positions it as "a faster, lower-cost complement to Claude Opus 5.5". Anthropic says it is more than 30% faster than Sonnet 5, and it has a 1M context window with the same per-token price across the whole window.

Both providers now **charge for cache writes** on these models. OpenAI does this on GPT-6.1 (30-minute and 12-hour retention), and Anthropic on Claude (5-minute and 1-hour retention). In return, cache reads are much cheaper than uncached input. On GPT-6.1 Sol the cached-input discount is 95%. Batch is 50% off on GPT-6.1 Sol and is also available on Sonnet 5.5.

### If you're choosing today

For most production work, the comparison that matters now is **GPT-6.1 Sol vs Claude Sonnet 5.5**, not the two flagships. They list at {{pair:gpt-6-1-sol}} and {{pair:claude-sonnet-5-5}} respectively, so the price differences come down to the details:

- **Long prompts:** Sonnet 5.5 keeps its per-token price across the whole 1M window. GPT-6.1 Sol switches to its higher rate once a prompt goes over 272K tokens.
- **Caching:** compare the cached-input prices ({{cached:gpt-6-1-sol}} vs {{cached:claude-sonnet-5-5}}) *and* the write prices ({{cache-write:gpt-6-1-sol}} vs {{cache-write:claude-sonnet-5-5}}). Which one comes out cheaper depends on your hit rate.

Step up to Astra or Opus 5.5 only for work where you can see the middle tier falling short. The two providers describe that gap differently. OpenAI says the step from GPT-6.1 Sol to Astra is small ("near-Astra"). Anthropic says Opus 5.5 is "clearly stronger" than Sonnet 5.5 on complex, open-ended work. Neither statement replaces an eval on your own tasks. The top tiers aren't priced alike either: compare {{pair:gpt-6-astra}} with {{pair:claude-opus-5-5}}.

**If you're still on Opus 4.7,** plan the move before its 2027-04-16 retirement date. Opus 5.5 costs less per token, so the migration lowers your bill. **If you're on GPT-5.5,** our dataset has no retirement date for it, but GPT-6.1 Sol lists at {{pair:gpt-6-1-sol}} against GPT-5.5's {{pair:gpt-5-5}}. Re-run your evals and check whether your prompts cross 272K tokens.

## GPT-5.5 vs Claude Opus 4.7: the prices

| Dimension | GPT-5.5 | Claude Opus 4.7 |
|---|---|---|
| **Input price** | {{in:gpt-5-5}} / 1M | {{in:claude-opus-4-7}} / 1M |
| **Output price** | {{out:gpt-5-5}} / 1M | {{out:claude-opus-4-7}} / 1M |
| **Cached input** | {{cached:gpt-5-5}} / 1M | {{cached:claude-opus-4-7}} / 1M |
| **Cache write** | not listed in our data | {{cache-write:claude-opus-4-7}} / 1M |
| **Batch (in/out)** | {{batch-pair:gpt-5-5}} | {{batch-pair:claude-opus-4-7}} |
| **Context window** | {{ctx:gpt-5-5}} | {{ctx:claude-opus-4-7}} |
| **Max output** | 128K tokens | 128K tokens |
| **Vision** | ✓ | ✓ |
| **Audio input** | — | — |
| **Listed retirement** | none in our data | 2027-04-16 |

At the rates above, the two models **charge the same for input**, and output is where they differ ({{out:gpt-5-5}} vs {{out:claude-opus-4-7}} per 1M). Both discount cached input heavily, and both have a Batch price. The context windows are close ({{ctx:gpt-5-5}} vs {{ctx:claude-opus-4-7}}), so context size isn't a deciding factor between them.

In practice:

- **Output-heavy work** (long reports, code generation): the output price decides the cost, and the gap grows with output length. Caching never discounts output.
- **Input-heavy work** (classification, extraction, RAG over long documents): the two cost about the same. Choose on quality.
- **Cache-heavy work:** compare the cached-input rates above, and remember that Opus 4.7 bills cache writes.

> **A correction from the original.** The first version of this article was built on a widely circulated figure of $15/$75 per 1M tokens for Opus 4.7. That figure was wrong. With the correct price, the "Opus premium" that framed the original comparison disappears. Check the headline price before you build a cost model on it.

### Per-call cost for your token mix

The cost per call depends entirely on your input/output mix. Each link below opens the calculator with that mix already loaded:

| Scenario | Tokens (in / out) | GPT-5.5 | Claude Opus 4.7 |
|---|---|---|---|
| Standard chat | 1,000 / 500 | {{call:gpt-5-5}} | {{call:claude-opus-4-7}} |
| Long-context Q&A | 50,000 / 500 | [calculate](/?model=gpt-5-5&in=50000&out=500) | [calculate](/?model=claude-opus-4-7&in=50000&out=500) |
| Code generation | 500 / 2,000 | [calculate](/?model=gpt-5-5&in=500&out=2000) | [calculate](/?model=claude-opus-4-7&in=500&out=2000) |
| RAG with retrieval | 10,000 / 300 | [calculate](/?model=gpt-5-5&in=10000&out=300) | [calculate](/?model=claude-opus-4-7&in=10000&out=300) |

## How they differed beyond price

Here is what we can stand behind from the providers' own positioning:

- **GPT-5.5** was OpenAI's flagship from April 2026: multimodal input (text and images), a context window over 1M tokens, 128K max output, and strong reasoning, vision and tool use. OpenAI lists GPT-5.6 (June 2026) as its successor.
- **Claude Opus 4.7** was Anthropic's flagship for complex reasoning, coding and 1M-token long context, with extended thinking. Opus 4.8 succeeded it at the same price, with stronger coding and agentic performance, and Opus 5 and Opus 5.5 have followed since.

Both support vision, tool calling, structured output, prompt caching and Batch. Neither accepts audio input. The original version of this article claimed GPT-5.5 had native audio and a 256K context window, and made several benchmark-style claims about which model was "more reliable". The audio and context claims were wrong, and we couldn't verify the reliability claims, so they've been removed.

One non-model factor still applies: if your stack is built around one provider's SDK and tool-calling format, switching providers has an integration cost. Count that alongside the per-token price.

## A routing pattern with today's models

Most production setups shouldn't send everything to one model. Route each request by how hard it is:

```
Request arrives
  ↓
Cheap classifier / router  →  GPT-6 Luna or Claude Haiku 5.5
  ↓
Everyday work              →  GPT-6.1 Sol or Claude Sonnet 5.5
  ↓
Hardest, open-ended tasks  →  GPT-6 Astra or Claude Opus 5.5
```

| Tier | OpenAI (cost per call) | Anthropic (cost per call) |
|---|---|---|
| Router / classification | [{{name:gpt-6-luna}}](/gpt-6-luna-cost-calculator): {{call:gpt-6-luna}} | [{{name:claude-haiku-5-5}}](/claude-haiku-5-5-cost-calculator): {{call:claude-haiku-5-5}} |
| Everyday | {{name:gpt-6-1-sol}}: {{call:gpt-6-1-sol}} | {{name:claude-sonnet-5-5}}: {{call:claude-sonnet-5-5}} |
| Hardest | {{name:gpt-6-astra}}: {{call:gpt-6-astra}} | {{name:claude-opus-5-5}}: {{call:claude-opus-5-5}} |

Two caveats for the cheap tier. Claude Haiku 5.5's listed price applies only to prompts up to 100K tokens; above that, Anthropic bills $0.50/$2.50 per 1M. It also uses a newer tokenizer that counts about 30% more tokens than Haiku 4.5 did for the same text. (Haiku 4.5 was retired on 2026-10-15. The router tier in the original article used o4-mini, which was retired on 2026-10-23.)

## What we recommend

- **New projects:** don't start on GPT-5.5 or Opus 4.7. Start on GPT-6.1 Sol or Claude Sonnet 5.5, and escalate to Astra or Opus 5.5 where your evals show you need to.
- **On Opus 4.7:** move to Opus 5.5 before 2027-04-16. It's cheaper per token.
- **On GPT-5.5:** there's no deadline in our data, but compare against GPT-6.1 Sol's price and its 272K long-prompt rule.
- **Measure your cache hit rate.** Both providers now bill cache writes on their current models, so caching a prefix that rarely gets reused can cost more than not caching it.

## Try the math yourself

Load any of these into the [calculator](/) with your own token counts, and check the [changes page](/changes) for recent price moves:

- [GPT-5.5 cost calculator →](/gpt-5-5-cost-calculator)
- [Claude Opus 4.7 cost calculator →](/claude-opus-4-7-cost-calculator)
- [GPT-6.1 Sol cost calculator →](/gpt-6-1-sol-cost-calculator)
- [Claude Sonnet 5.5 cost calculator →](/claude-sonnet-5-5-cost-calculator)
- [GPT-6 Astra cost calculator →](/gpt-6-astra-cost-calculator)
- [Claude Opus 5.5 cost calculator →](/claude-opus-5-5-cost-calculator)

For more detail on each provider, see [Claude API pricing](/blog/claude-api-pricing-2026) and [OpenAI API pricing explained](/blog/openai-api-pricing-explained-2026).

---

*Prices are pulled live from our dataset (last verified {{updated}}). Release dates, positioning quotes and pricing rules (long-prompt tiers, cache writes) come from the providers' published pages as of 2026-10-29. Check the provider's pricing page before you commit budget.*

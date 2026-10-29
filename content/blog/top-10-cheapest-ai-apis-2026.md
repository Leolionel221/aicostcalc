---
title: "Top 10 Cheapest AI APIs in 2026 (Ranked by Real Cost)"
description: "Live cost ranking of the cheapest LLM APIs in 2026: per-call prices, where each model wins, and how caching, batch, long prompts and tokenizers change the order."
date: "2026-05-05"
author: "AI Cost Calc Team"
tags: ["pricing", "comparison", "deepseek", "gemini", "cost-optimization"]
readingTime: "11 min read"
featured: true
lastUpdated: "2026-10-29"
---

> **📊 Prices on this page are live.** Every figure below is pulled from [`data/models.json`](https://github.com/Leolionel221/aicostcalc) at build time and reconciled daily against [LiteLLM's public registry](https://github.com/BerriAI/litellm) — last verified **{{updated}}**. They cannot drift out of sync with the [calculator](/). Every price move is logged on the [price-change page](/changes).


"Cheapest AI API" is a misleading question. The model that costs the least per token might be useless for your task — and the one that looks expensive might be 10× cheaper *for what you actually use it for*. So before we hand you the list, two caveats:

1. **Cost is meaningless without capability matching.** A cheap model that gets 60% of your queries wrong is more expensive than a pricier one that nails them on the first try.
2. **Headline rates lie in 2026.** Caching can cut input bills by 90% or more. Batch APIs usually halve them. Some models charge more once your prompt passes a length threshold, and some introductory prices expire. The "cheapest" model on the price page might not be the cheapest in production.

With those out of the way: here's the ranking by **single-call cost** (1,000 input + 500 output tokens) across the {{model-count}} models this site tracks.

## Methodology

Each cost figure is calculated as:

```
cost = (1,000 / 1,000,000) × input_price + (500 / 1,000,000) × output_price
```

Where `input_price` and `output_price` are the providers' published standard rates per 1M tokens. A few things are deliberately left out, because they change the order — they're covered further down:

- caching and batch discounts
- long-context price tiers (the table uses each model's base rate)
- tokenizer differences (the same text is not the same number of tokens everywhere)

Retired models are excluded from the table — a retired API is not an option, however cheap. Every model is pre-loaded into [the calculator on the homepage](/) so you can plug in your own token counts.

## The Ranking

{{cheapest-table:10}}

**How to read this.** The order moves whenever a provider cuts a price or ships a new model, so treat it as a snapshot rather than a verdict. It has reshuffled several times since this article first ran in May — the [price-change log](/changes) has every move. Rather than argue about who is first this week, it's more useful to look at the tiers and at *why* each model is there.

**What's gone since May.** Three models this article used to recommend have been retired: Claude Haiku 4.5 (2026-10-15), o4-mini (2026-10-23) and the original Grok 4 (2026-05-15). The current options in their price ranges are covered below.

## The floor tier

Three models currently sit at the bottom of the price range, close enough that the order between them depends more on your workload than on the list price.

### {{name:gpt-6-luna}}

{{pair:gpt-6-luna}} per 1M tokens, {{call:gpt-6-luna}} per call, with a {{ctx:gpt-6-luna}} context window. OpenAI describes it as its most efficient model for focused, high-volume tasks. It supports vision, tools, prompt caching (cached input {{cached:gpt-6-luna}}) and the Batch API ({{batch-pair:gpt-6-luna}}).

Where it wins: high-volume chat, classification, extraction and routing where you want a long window without paying for it. It is the default to test first for cheap OpenAI work.

[GPT-6 Luna cost calculator →](/gpt-6-luna-cost-calculator)

### {{name:claude-haiku-5-5}}

Its list price is in the same range as GPT-6 Luna's: {{pair:claude-haiku-5-5}}, {{call:claude-haiku-5-5}} per call, cached input {{cached:claude-haiku-5-5}}, batch {{batch-pair:claude-haiku-5-5}}. Two things make its real cost different from what that suggests:

- **The list price only covers prompts up to 100K tokens.** Above 100K, Haiku 5.5 costs 5× per token. It is the one current Claude model without flat pricing across its {{ctx:claude-haiku-5-5}} window, so long-document work belongs elsewhere. The calculator shows the up-to-100K price.
- **Its tokenizer counts roughly 30% more tokens** for the same text than Claude Haiku 4.5's did. Equal per-token prices do not mean equal per-request bills — count your own prompts before comparing.

Within 100K it is still far cheaper than Claude Haiku 4.5 was: Anthropic puts the average saving at about 75%. Anthropic positions it for classification, extraction and routing, and recommends Sonnet or Opus 5.5 for agentic coding.

[Claude Haiku 5.5 cost calculator →](/claude-haiku-5-5-cost-calculator)

### {{name:deepseek-v3-2}}

{{pair:deepseek-v3-2}}, {{call:deepseek-v3-2}} per call. Its input is pricier than the two above, but its output rate ({{out:deepseek-v3-2}}) is among the lowest of any production model, so it pulls ahead on output-heavy calls. It's an open-weight MoE model, strong on code and Chinese.

The catches: the context window stops at {{ctx:deepseek-v3-2}}, there's no vision input, and there's no batch price on this site. It does have a cache-hit price ({{cached:deepseek-v3-2}}).

[DeepSeek V3.2 cost calculator →](/deepseek-v3-2-cost-calculator)

## Budget long-context: the rest of the table

The other slots go to models that cost a bit more per call but bring something the floor tier doesn't — a full long-context window at a flat rate, native audio, or EU-friendly hosting.

- **{{name:deepseek-v4-flash}}** ({{pair:deepseek-v4-flash}}, {{call:deepseek-v4-flash}} per call) — DeepSeek's long-window option: {{ctx:deepseek-v4-flash}} of context against V3.2's {{ctx:deepseek-v3-2}}. Its cache-hit price ({{cached:deepseek-v4-flash}}) is one of the lowest cached rates anywhere, which matters a lot for big, repeated prompts. [Calculator →](/deepseek-v4-flash-cost-calculator)
- **{{name:gpt-5-6-luna}}** ({{pair:gpt-5-6-luna}}, {{call:gpt-5-6-luna}} per call) — same {{ctx:gpt-5-6-luna}} window as GPT-6 Luna, but GPT-6 Luna now undercuts it. Mainly relevant if your prompts are already tuned for it. [Calculator →](/gpt-5-6-luna-cost-calculator)
- **{{name:gemini-3-1-flash-lite}}** ({{pair:gemini-3-1-flash-lite}}) and **{{name:gemini-3-5-flash-lite}}** ({{pair:gemini-3-5-flash-lite}}) — Google's budget multimodal tiers, with native audio and vision and a {{ctx:gemini-3-5-flash-lite}} window. 3.1 Flash Lite is cheaper but a generation behind and retires 2027-05-07; 3.5 Flash Lite retires 2027-07-21. [3.5 Flash Lite calculator →](/gemini-3-5-flash-lite-cost-calculator)
- **{{name:mistral-large-3}}** ({{pair:mistral-large-3}}) — Mistral's flagship-tier model at a budget price: strong at coding and dozens of European languages, with EU-friendly hosting. No caching or batch price, and a {{ctx:mistral-large-3}} window. [Calculator →](/mistral-large-3-cost-calculator)
- **{{name:gemini-3-flash}}** ({{pair:gemini-3-flash}}) — Google's high-throughput multimodal model with a {{ctx:gemini-3-flash}} window and cheap cached input ({{cached:gemini-3-flash}}). [Calculator →](/gemini-3-flash-cost-calculator)

**One retiring model is still in the table.** {{name:gpt-5-mini}} ({{call:gpt-5-mini}} per call) retires on **2026-12-11**. It appears in the ranking because it's still callable, but don't start a new project on it — GPT-6 Luna is cheaper per call and has a much bigger window.

## Just outside the table: the value tier

These don't make the top ten on raw per-call cost, but they're where most people should look when the floor models aren't good enough.

**{{name:gemini-3-8-flash}}** — {{pair:gemini-3-8-flash}}, {{call:gemini-3-8-flash}} per call, which Google calls its most intelligent Flash model, aimed at long-horizon coding, agents and enterprise workflows. **That price is introductory and ends on 2026-12-31; from 2027-01-01 it doubles.** Budget on the doubled rate for anything that runs into next year. (The older Gemini 3.6 Flash and 3.7 Flash retire on 2026-11-19 and 2027-01-28 respectively — don't start new work on them.) [Calculator →](/gemini-3-8-flash-cost-calculator)

**{{name:gpt-6-1-terra}}** — {{pair:gpt-6-1-terra}}, half of GPT-6.1 Sol's price. OpenAI aims it at visual reasoning, precise computer use and clear, natural writing. OpenAI doesn't say how it ranks against Sol on general reasoning, so test before swapping it in. [Calculator →](/gpt-6-1-terra-cost-calculator)

**{{name:grok-4-3}}** ({{pair:grok-4-3}}, {{ctx:grok-4-3}} context) and **{{name:grok-code-fast}}** ({{pair:grok-code-fast}}, {{ctx:grok-code-fast}} context) — xAI's value options. Grok 4.3 costs less per call than the newer {{name:grok-4-7}} ({{pair:grok-4-7}}) and has a bigger window, so check it before defaulting to the latest Grok. [Grok 4.3 calculator →](/grok-4-3-cost-calculator)

**{{name:deepseek-v4-pro}}** ({{pair:deepseek-v4-pro}}) and **{{name:mistral-large-4}}** ({{pair:mistral-large-4}}) — DeepSeek's and Mistral's flagships, both with ~1M windows. Mistral Large 4 is in Public Preview, with open weights and vision; Mistral Large 3 stays the cheaper choice when you don't need the longer context or image input.

## The workhorse tier: Sonnet 5.5 and GPT-6.1 Sol

**{{name:claude-sonnet-5-5}}** and **{{name:gpt-6-1-sol}}** list at {{pair:claude-sonnet-5-5}} and {{pair:gpt-6-1-sol}} respectively — {{call:claude-sonnet-5-5}} and {{call:gpt-6-1-sol}} per call, many times the floor tier. You pay that for serious coding, agent and analysis work.

- **Sonnet 5.5** keeps Sonnet 5's price but halves cached input to {{cached:claude-sonnet-5-5}}. Anthropic describes it as a faster, lower-cost complement to Opus 5.5, and says it is over 30% faster than Sonnet 5. 1M context, batch at {{batch-pair:claude-sonnet-5-5}}. [Calculator →](/claude-sonnet-5-5-cost-calculator)
- **GPT-6.1 Sol** keeps GPT-6 Sol's price, also halves cached input (to {{cached:gpt-6-1-sol}}), and OpenAI pitches it as "near-Astra performance for complex work at a lower cost". Prompts over 272K tokens are billed at a higher long-context rate. [Calculator →](/gpt-6-1-sol-cost-calculator)

If you're still on {{name:claude-sonnet-5}} or {{name:gpt-6-sol}}, the newer versions cost the same per uncached token and less per cached one. Sonnet 5 retires 2027-06-30.

## The top end: Opus 5.5 and GPT-6 Astra

**{{name:claude-opus-5-5}}** ({{pair:claude-opus-5-5}}, {{call:claude-opus-5-5}} per call) is Anthropic's current Opus, priced below Opus 5, 4.8 and 4.7 ({{pair:claude-opus-4-7}}). Anthropic says it "remains clearly stronger at complex, open-ended work" than Sonnet 5.5. If you're on an older Opus, note their retirement dates: Opus 4.7 on 2027-04-16, Opus 4.8 on 2027-05-28, Opus 5 on 2027-07-24. [Calculator →](/claude-opus-5-5-cost-calculator)

**{{name:gpt-6-astra}}** ({{pair:gpt-6-astra}}, {{call:gpt-6-astra}} per call) is what OpenAI calls its most capable model. At several times Sol's price, it's worth it only where Sol measurably falls short on your own tasks. [Calculator →](/gpt-6-astra-cost-calculator)

## What changes the order?

The table ranks naive single-call cost. Five things change which model is actually cheapest for you.

### 1. Caching ratio

If most of your input is a repeated prefix — a system prompt, tool definitions, retrieved documents — the cached rate matters more than the headline input rate:

| Model | Input | Cached input | Cache write | Batch (in/out) |
|---|---|---|---|---|
| {{name:gpt-6-luna}} | {{in:gpt-6-luna}} | {{cached:gpt-6-luna}} | {{cache-write:gpt-6-luna}} | {{batch-pair:gpt-6-luna}} |
| {{name:claude-haiku-5-5}} | {{in:claude-haiku-5-5}} | {{cached:claude-haiku-5-5}} | {{cache-write:claude-haiku-5-5}} | {{batch-pair:claude-haiku-5-5}} |
| {{name:deepseek-v3-2}} | {{in:deepseek-v3-2}} | {{cached:deepseek-v3-2}} | — | — |
| {{name:deepseek-v4-flash}} | {{in:deepseek-v4-flash}} | {{cached:deepseek-v4-flash}} | — | — |
| {{name:gemini-3-8-flash}} | {{in:gemini-3-8-flash}} | {{cached:gemini-3-8-flash}} | — | {{batch-pair:gemini-3-8-flash}} |
| {{name:gpt-6-1-terra}} | {{in:gpt-6-1-terra}} | {{cached:gpt-6-1-terra}} | {{cache-write:gpt-6-1-terra}} | {{batch-pair:gpt-6-1-terra}} |
| {{name:claude-sonnet-5-5}} | {{in:claude-sonnet-5-5}} | {{cached:claude-sonnet-5-5}} | {{cache-write:claude-sonnet-5-5}} | {{batch-pair:claude-sonnet-5-5}} |
| {{name:gpt-6-1-sol}} | {{in:gpt-6-1-sol}} | {{cached:gpt-6-1-sol}} | {{cache-write:gpt-6-1-sol}} | {{batch-pair:gpt-6-1-sol}} |
| {{name:claude-opus-5-5}} | {{in:claude-opus-5-5}} | {{cached:claude-opus-5-5}} | {{cache-write:claude-opus-5-5}} | — |

_All prices per 1M tokens. "—" means this site has no separate price listed._

Two things to read off this:

- **Cheap cache hits reshuffle the long-prompt end.** DeepSeek V4-Flash's uncached input costs more than GPT-6 Luna's, but its cache-hit rate is lower still — the more of a large prompt is cached, the narrower the gap. GPT-6.1 Sol and Terra take 95% off cached input.
- **Cache writes are not free.** Anthropic bills cache writes (5-minute and 1-hour), and OpenAI now does too on GPT-6.1 models (30-minute and 12-hour retention), at a rate above normal input. A cache that's written often and read rarely can cost more than no cache. The calculator models cache *reads*; add the write cost yourself for short-lived caches.

Try it: [20,000-token prompt, 80% cached, on DeepSeek V4-Flash](/?model=deepseek-v4-flash&in=20000&cache=80) — then switch the model and compare. The link carries the whole calculator state, so you can send a configuration to a colleague the same way.

### 2. Output ratio

If you're generating long content (output ≫ input), output prices dominate. Models with cheap output — DeepSeek V3.2 at {{out:deepseek-v3-2}}, GPT-6 Luna and Haiku 5.5 at {{out:gpt-6-luna}} — pull further ahead; models with expensive output relative to input fall back.

### 3. Batch eligibility

If your workload tolerates asynchronous processing, OpenAI, Anthropic and Google offer batch pricing on most models — usually half the standard rate (it's 50% on GPT-6.1 Sol and Terra, for example). DeepSeek, xAI and Mistral models have no batch price on this site, so they lose this lever, and not every model from the big three has one either: check the "With Batch" figure on each model's page.

### 4. Prompt length

Two current models price long prompts differently: **Claude Haiku 5.5 costs 5× per token above 100K tokens**, and **GPT-6.1 Sol and Terra switch to a higher long-context rate above 272K**. If your typical prompt is past those lines, the table above understates their cost. Claude Sonnet 5.5 and Opus 5.5 are priced flat across their 1M windows; for anything else, check the model page before assuming the base rate holds.

### 5. Tokenizer and time

Per-token prices only compare cleanly if the token counts match. Claude Haiku 5.5's tokenizer produces about 30% more tokens than Haiku 4.5's for the same text, so measure real prompts. And prices don't stand still: Gemini 3.8 Flash's introductory price ends 2026-12-31 and doubles on 2027-01-01, and GPT-5 mini disappears on 2026-12-11. Check [/changes](/changes) before you commit a budget.

## How to actually pick a model

A practical decision tree:

1. **Is the task hard reasoning or agentic coding?** → Claude Sonnet 5.5 or GPT-6.1 Sol; Claude Opus 5.5 or GPT-6 Astra when those fall short.
2. **Is the context routinely > 100K tokens?** → avoid Claude Haiku 5.5's upper tier and price the alternatives at your real prompt length (GPT-6 Luna, DeepSeek V4-Flash, the Gemini Flash models). Above 272K, factor in GPT-6.1's long-context rate.
3. **Is the workload cache-heavy with stable prompts?** → compare cached rates (DeepSeek V4-Flash, GPT-6 Luna, Claude Haiku 5.5), and include cache-write costs for Anthropic and GPT-6.1.
4. **Is the workload batchable (non-realtime)?** → anything with a batch price, usually at half off.
5. **Default high-volume simple tasks?** → GPT-6 Luna or Claude Haiku 5.5 (prompts under 100K).
6. **Multimodal with audio?** → Gemini Flash Lite or Gemini 3.8 Flash (budget on its 2027 price).
7. **Need EU hosting?** → Mistral Large 3, or Mistral Large 4 for longer context and vision.
8. **Cost is the *only* concern, quality acceptable, output-heavy?** → DeepSeek V3.2, if 164K of context is enough.

## Calculate your real cost

The ranking above assumes 1,000 input + 500 output tokens. **Your workload is different.**

[Use the calculator on the homepage →](/) — pick your model, plug in your token counts, toggle caching and batch. The comparison table sorts every model by cost for *your* numbers, so the cheapest model for your case ends up at the top. When you've found a setup worth keeping, copy the link: it reopens the calculator exactly as you left it.

If you're spending more than $500/month on AI APIs and haven't run this exercise, you're probably leaving money on the table.

---

*Prices on this page are live and were last verified {{updated}}. Verify with each provider's official pricing page before committing budget — the [price-change log](/changes) and [models.json on GitHub](https://github.com/Leolionel221/aicostcalc/blob/main/data/models.json) show what moved and when.*

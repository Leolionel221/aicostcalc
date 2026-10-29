---
title: "OpenAI API Pricing Explained: Complete Guide for 2026"
description: "OpenAI API pricing as of late 2026: GPT-6 Astra, GPT-6.1 Sol, GPT-6.1 Terra and GPT-6 Luna, the GPT-5.x models still running, 95% cached input, the new cache-write charge, the over-272K long-context rate and the 50% Batch discount."
date: "2026-05-04"
author: "AI Cost Calc Team"
tags: ["openai", "pricing", "gpt-6", "cost-optimization"]
readingTime: "8 min read"
featured: true
lastUpdated: "2026-10-29"
---

> **📊 Prices on this page are live**: they're pulled from the site dataset at build time, last verified **{{updated}}**.

OpenAI's lineup turned over between May and October 2026. The GPT-6 family arrived in September, the 6.1 updates followed, and o4-mini was retired on 2026-10-23. Pricing changed shape along the way too. On GPT-6.1 models you now pay to **write** a prompt to the cache, cached reads are **95% off**, and prompts over **272K tokens** are billed at a higher rate.

This guide covers what each current OpenAI model costs, how to pick a tier, and which billing details actually move the total.

## The current OpenAI lineup

### GPT-6 generation

| Model | Input / Output (per 1M) | Cached input | Batch | Context | One call* |
|---|---|---|---|---|---|
| [**{{name:gpt-6-astra}}**](/gpt-6-astra-cost-calculator) | {{pair:gpt-6-astra}} | {{cached:gpt-6-astra}} | {{batch-pair:gpt-6-astra}} | {{ctx:gpt-6-astra}} | {{call:gpt-6-astra}} |
| [**{{name:gpt-6-1-sol}}**](/gpt-6-1-sol-cost-calculator) | {{pair:gpt-6-1-sol}} | {{cached:gpt-6-1-sol}} | {{batch-pair:gpt-6-1-sol}} | {{ctx:gpt-6-1-sol}} | {{call:gpt-6-1-sol}} |
| [**{{name:gpt-6-sol}}**](/gpt-6-sol-cost-calculator) | {{pair:gpt-6-sol}} | {{cached:gpt-6-sol}} | {{batch-pair:gpt-6-sol}} | {{ctx:gpt-6-sol}} | {{call:gpt-6-sol}} |
| [**{{name:gpt-6-1-terra}}**](/gpt-6-1-terra-cost-calculator) | {{pair:gpt-6-1-terra}} | {{cached:gpt-6-1-terra}} | {{batch-pair:gpt-6-1-terra}} | {{ctx:gpt-6-1-terra}} | {{call:gpt-6-1-terra}} |
| [**{{name:gpt-6-luna}}**](/gpt-6-luna-cost-calculator) | {{pair:gpt-6-luna}} | {{cached:gpt-6-luna}} | {{batch-pair:gpt-6-luna}} | {{ctx:gpt-6-luna}} | {{call:gpt-6-luna}} |

_*One call = 1,000 input + 500 output tokens at the standard rate._

Here's how OpenAI describes each one:

- **GPT-6 Astra** (released 2026-09-03) is "our most capable model", and it's the most expensive GPT-6 model.
- **GPT-6.1 Sol** (2026-09-29) is pitched as "near-Astra performance for complex work at a lower cost". It costs the same as GPT-6 Sol for input and output, and its cached input is half of GPT-6 Sol's.
- **GPT-6 Sol** (2026-09-22) is the original GPT-6 middle tier. Since 6.1 Sol has the same input/output price and cheaper cached input, it's hard to justify for new work.
- **GPT-6.1 Terra** (2026-10-26) costs half as much as 6.1 Sol. OpenAI calls it "a fast, efficient model for visual reasoning, precise computer use, and clear, natural writing". OpenAI doesn't say how it ranks against Sol on general reasoning.
- **GPT-6 Luna** (2026-09-22) is OpenAI's "most efficient model for focused, high-volume tasks", and it has the full {{ctx:gpt-6-luna}} context window.

### GPT-5.x models still available

| Model | Input / Output (per 1M) | Cached input | Status |
|---|---|---|---|
| [{{name:gpt-5-5-pro}}](/gpt-5-5-pro-cost-calculator) | {{pair:gpt-5-5-pro}} | {{cached:gpt-5-5-pro}} | Active. The most expensive model we track |
| [{{name:gpt-5-5}}](/gpt-5-5-cost-calculator) | {{pair:gpt-5-5}} | {{cached:gpt-5-5}} | Active |
| [{{name:gpt-5-6-sol}}](/gpt-5-6-sol-cost-calculator) | {{pair:gpt-5-6-sol}} | {{cached:gpt-5-6-sol}} | Active, same price as base [{{name:gpt-5-6}}](/gpt-5-6-cost-calculator) |
| [{{name:gpt-5-6-terra}}](/gpt-5-6-terra-cost-calculator) | {{pair:gpt-5-6-terra}} | {{cached:gpt-5-6-terra}} | Active |
| [{{name:gpt-5-6-luna}}](/gpt-5-6-luna-cost-calculator) | {{pair:gpt-5-6-luna}} | {{cached:gpt-5-6-luna}} | Active |
| [{{name:gpt-5-mini}}](/gpt-5-mini-cost-calculator) | {{pair:gpt-5-mini}} | {{cached:gpt-5-mini}} | **Retires 2026-12-11** |

Compare each GPT-5.6 tier with the GPT-6 model that replaces it: GPT-5.6 Sol at {{pair:gpt-5-6-sol}} against GPT-6.1 Sol at {{pair:gpt-6-1-sol}}, and GPT-5.6 Luna at {{pair:gpt-5-6-luna}} against GPT-6 Luna at {{pair:gpt-6-luna}}. At the time of writing, the older model costs more on both input and output. Unless a GPT-5.x model is pinned in a workflow you can't retest yet, the price argument favours moving.

**GPT-5 mini retires on 2026-12-11.** The obvious replacement on price is GPT-6 Luna: {{call:gpt-6-luna}} per call against {{call:gpt-5-mini}} for GPT-5 mini. Note that GPT-5 mini has no Batch price in our data, while GPT-6 Luna does. Run your own test set before you switch, because a price comparison says nothing about output quality on your task.

**o4-mini was retired on 2026-10-23.** If you still have it in code or in a cost model, it needs replacing. For reasoning-heavy work, start testing with GPT-6.1 Sol.

## How to choose a tier

Work from the bottom up and stop at the first model that passes your evaluation set.

1. **High-volume, narrow tasks** such as classification, extraction, routing and short replies: start with **GPT-6 Luna**. One call costs {{call:gpt-6-luna}}, so it's cheap enough that you can afford a retry on the occasional failure.
2. **Screens, images, documents and writing**: try **GPT-6.1 Terra**, which OpenAI positions for visual reasoning, computer use and natural writing. It costs half as much as Sol. Test it before you swap it in for Sol on general reasoning, since OpenAI hasn't published that comparison.
3. **Complex coding, agents and long multi-step work**: use **GPT-6.1 Sol**. A call costs {{call:gpt-6-1-sol}} against {{call:gpt-6-astra}} for Astra, so you can run Sol for a long time before matching what a move to Astra would cost.
4. **The hardest problems, where a better answer is worth the price**: use **GPT-6 Astra**. Measure the difference on your own tasks, because Astra costs five times as much as 6.1 Sol per token.

The most common way to overspend is to run everything on the top tier. A mixed setup usually costs much less, for example Luna for triage, Sol for the hard cases and Astra only where its results clearly win.

## The billing details that move the total

### 1. Standard input and output

You pay per million tokens at the headline rate. On every GPT-6 model, output costs five times as much as input. On GPT-6.1 Sol that's {{out:gpt-6-1-sol}} against {{in:gpt-6-1-sol}}. As a result, long answers often cost more than long prompts. Set a max-output limit and ask for concise formats when you don't need prose.

### 2. Cached input: 95% off on GPT-6.1

If the start of your prompt (system prompt, tool definitions, reference documents) repeats across calls, those repeated tokens can be billed at the cached rate:

- **GPT-6.1 Sol**: {{cached:gpt-6-1-sol}} per 1M against {{in:gpt-6-1-sol}}, which is 95% off.
- **GPT-6.1 Terra**: {{cached:gpt-6-1-terra}} against {{in:gpt-6-1-terra}}, also 95% off.
- **GPT-6 Astra, GPT-6 Sol and GPT-6 Luna**: {{cached:gpt-6-astra}}, {{cached:gpt-6-sol}} and {{cached:gpt-6-luna}}. That's 90% off their input prices.

Caching only helps when the **prefix** is identical from call to call. Put stable content first and anything that changes per request (user message, timestamps, IDs) last. The [prompt caching guide](/blog/openai-prompt-caching-when-worth-it) covers the details.

### 3. Cache writes: new on GPT-6.1

OpenAI now charges to write a prompt prefix into the cache on GPT-6.1 models, with 30-minute and 12-hour retention options. For 30-minute retention on GPT-6.1 Sol, a write costs {{cache-write:gpt-6-1-sol}} per 1M tokens, more than the normal input price of {{in:gpt-6-1-sol}}. On Terra it's {{cache-write:gpt-6-1-terra}} against {{in:gpt-6-1-terra}}.

This means caching is no longer free. A prefix written once and never read again costs more than not caching it at all. The upside is that a single cache read on 6.1 Sol or Terra saves nearly four times the write premium. In practice, caching pays as soon as a prefix is read again within its retention window. The [caching guide works through the arithmetic](/blog/openai-prompt-caching-when-worth-it).

### 4. Prompts over 272K tokens

GPT-6.1 Sol and Terra accept {{ctx:gpt-6-1-sol}} tokens of input, but the standard rate doesn't cover all of it. OpenAI bills prompts over 272K tokens at a higher long-context rate:

- **GPT-6.1 Sol**: $4.00 input / $15.00 output per 1M (OpenAI's long-context rate)
- **GPT-6.1 Terra**: $2.00 input / $7.50 output per 1M (OpenAI's long-context rate)

That's twice the standard input price and 1.5 times the standard output price. Our calculator applies the standard rate only, so for prompts over 272K it will **understate** the bill. If you regularly send whole codebases or long document sets, it's often cheaper to retrieve the relevant pieces and stay under 272K.

### 5. Batch API: half price

Requests sent through the Batch API run asynchronously and cost half the standard rate. On GPT-6.1 Sol that's {{batch-pair:gpt-6-1-sol}} instead of {{pair:gpt-6-1-sol}}, and on Terra it's {{batch-pair:gpt-6-1-terra}}.

Batch suits work where nobody is waiting for the answer: overnight content generation, weekly ticket categorisation, backfills and evaluation runs. It's the wrong choice for anything interactive or streamed.

## A worked example: support chatbot on GPT-6.1 Terra

- **Volume**: 10,000 conversations a day, 5 messages each, for 50,000 calls a day
- **Input per call**: 1,500 tokens, of which 1,200 are an identical system prompt and 300 are the user turn
- **Output per call**: 200 tokens

**Without caching**, the daily volume is 75M input tokens × {{in:gpt-6-1-terra}} plus 10M output tokens × {{out:gpt-6-1-terra}} (both per 1M). Because output costs five times as much as input on Terra, input is 75 of the 125 price units here, or 60% of the bill. Open this workload in the calculator: [/?model=gpt-6-1-terra&in=1500&out=200](/?model=gpt-6-1-terra&in=1500&out=200).

**With caching**, 80% of each prompt is the shared system prompt, and at 95% off that removes 0.80 × 0.95 = **76% of the input bill**. Applied to input's 60% share, the total falls by about **46%**. The cache-write charge barely registers here: at this volume, the same 1,200-token prefix is requested hundreds of times within each 30-minute retention window. See it in the calculator: [/?model=gpt-6-1-terra&in=1500&out=200&cache=80](/?model=gpt-6-1-terra&in=1500&out=200&cache=80).

**With Batch for the nightly part**: anything that doesn't need an immediate answer, such as end-of-day conversation summaries, can go through Batch at half price.

**On GPT-6 Luna** instead, the same workload costs a fraction of the Terra figure (compare {{call:gpt-6-luna}} with {{call:gpt-6-1-terra}} per standard call). Whether that's acceptable depends on whether Luna's replies pass your quality bar.

## Optimisation checklist

1. **Pick the cheapest tier that passes your eval.** Re-check when OpenAI ships a new model, since the GPT-6 tiers undercut their GPT-5.6 equivalents.
2. **Keep a stable prefix** so the 95% cached rate applies. Don't let one-off prompts pay the write premium for nothing.
3. **Stay under 272K tokens** on GPT-6.1 unless the extra context earns its long-context rate.
4. **Batch anything that can wait**, at 50% off.
5. **Cap output.** At five times the input price, output tokens are the expensive ones.
6. **Get off retiring models early**: GPT-5 mini retires on 2026-12-11.

## Cheaper non-OpenAI options

For simple high-volume tasks, compare GPT-6 Luna with [{{name:claude-haiku-5-5}}](/claude-haiku-5-5-cost-calculator) ({{pair:claude-haiku-5-5}}) and [{{name:deepseek-v4-flash}}](/deepseek-v4-flash-cost-calculator) ({{pair:deepseek-v4-flash}}). Haiku 5.5's listed price applies to prompts up to 100K tokens. Above that, Anthropic charges five times as much per token. The [cheapest AI APIs list](/blog/top-10-cheapest-ai-apis-2026) ranks the whole field by cost per call.

## Bottom line

OpenAI's late-2026 pricing rewards three habits. Use the cheapest tier that works, keep a stable prompt prefix so cached reads apply, and batch anything that isn't interactive. Cache writes and the 272K long-context rate are the two new ways to overspend, and both are easy to avoid once you know about them.

To model your own workload, use the [calculator](/). It has a caching slider and a Batch toggle, and every price change we record is listed in the [change log](/changes).

---

*Prices on this page come from the site dataset, which is checked daily against the LiteLLM registry. The over-272K long-context rates are quoted from OpenAI and aren't in our dataset. Always confirm on [OpenAI's pricing page](https://openai.com/api/pricing) before committing budget.*

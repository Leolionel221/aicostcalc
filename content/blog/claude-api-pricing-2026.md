---
title: "Claude API Pricing in 2026: How Much Does Anthropic Cost?"
description: "Current Claude API prices for Opus 5.5, Sonnet 5.5 and Haiku 5.5: which tier to pick, how prompt caching is billed (writes cost extra), Batch, Haiku 5.5's 100K-token price tier, and which older Claude models are still available."
date: "2026-05-04"
author: "AI Cost Calc Team"
tags: ["anthropic", "claude", "pricing", "cost-optimization"]
readingTime: "8 min read"
featured: true
lastUpdated: "2026-10-29"
---

> **📊 Prices on this page are live**: they're pulled from the site's dataset at build time, last verified **{{updated}}**. The dataset is checked every day against the LiteLLM registry, and any move over 60% is held until someone checks it against the provider's page. Past price moves are logged on the [changes page](/changes).

Anthropic's current API lineup has three tiers: **Claude Opus 5.5**, **Claude Sonnet 5.5** and **Claude Haiku 5.5**. Several older Claude models are still on the API with published retirement dates. **Claude Haiku 4.5 was retired on 2026-10-15.** If you were using it, *Older Claude models still on the API* below covers what to move to.

The list prices are only part of the bill. Two other things decide what Claude actually costs you: how you use prompt caching (Anthropic charges for cache *writes* as well as reads), and whether your prompts stay under Haiku 5.5's 100K-token price tier.

## Current Claude API prices

| Model | Input / 1M | Output / 1M | Cache read / 1M | Cache write / 1M | Context | Cost per call* |
|---|---|---|---|---|---|---|
| [**Claude Opus 5.5**](/claude-opus-5-5-cost-calculator) | {{in:claude-opus-5-5}} | {{out:claude-opus-5-5}} | {{cached:claude-opus-5-5}} | {{cache-write:claude-opus-5-5}} | {{ctx:claude-opus-5-5}} | {{call:claude-opus-5-5}} |
| [**Claude Sonnet 5.5**](/claude-sonnet-5-5-cost-calculator) | {{in:claude-sonnet-5-5}} | {{out:claude-sonnet-5-5}} | {{cached:claude-sonnet-5-5}} | {{cache-write:claude-sonnet-5-5}} | {{ctx:claude-sonnet-5-5}} | {{call:claude-sonnet-5-5}} |
| [**Claude Haiku 5.5**](/claude-haiku-5-5-cost-calculator)† | {{in:claude-haiku-5-5}} | {{out:claude-haiku-5-5}} | {{cached:claude-haiku-5-5}} | {{cache-write:claude-haiku-5-5}} | {{ctx:claude-haiku-5-5}} | {{call:claude-haiku-5-5}} |

\* One call = 1,000 input + 500 output tokens, no caching.
† Haiku 5.5's price applies to prompts up to 100K tokens. Above that it costs more (see the Haiku 5.5 section below).

All three have a {{ctx:claude-sonnet-5-5}}-token context window and 128K max output. On Opus and Sonnet 5.5, a long prompt costs the same per token as a short one. Haiku 5.5 is the exception.

## Which Claude model to pick

**Claude Haiku 5.5: classification, extraction, routing.** Anthropic aims it at high-volume, narrow tasks: labelling tickets, pulling fields out of documents, and deciding which model should handle a request. Anthropic recommends Sonnet 5.5 or Opus 5.5 for agentic coding, not Haiku. At {{pair:claude-haiku-5-5}} it's the cheapest Claude model by a wide margin, as long as your prompts stay under 100K tokens.

**Claude Sonnet 5.5: the default for most production work.** Released 2026-09-28, it costs the same per input and output token as Sonnet 5, and its cached-input price is half of Sonnet 5's. Anthropic positions it as "a faster, lower-cost complement to Claude Opus 5.5" and says it is more than 30% faster than Sonnet 5. On most of the agentic benchmarks Anthropic published, it scores within a few points of Opus 5.5. Batch is available.

**Claude Opus 5.5: the hardest open-ended work.** Anthropic says Opus 5.5 "remains clearly stronger at complex, open-ended work" than Sonnet 5.5. It costs less than the Opus models before it: compare {{pair:claude-opus-5-5}} with Opus 5's {{pair:claude-opus-5}}. It still costs more than Sonnet, so use it for the tasks where Sonnet visibly falls short.

A rule that holds up in practice: **start on Sonnet 5.5, send the narrow high-volume steps down to Haiku 5.5, and escalate to Opus 5.5 only for tasks where you can see Sonnet failing.** Run your own evals before switching a whole workload. Anthropic's positioning tells you where to start testing, not what your results will be.

## Haiku 5.5: the 100K price tier and the new tokenizer

Haiku 5.5 is the only current Claude model without flat pricing across its whole context window:

- **Prompts up to 100K tokens:** {{price:claude-haiku-5-5}}
- **Prompts over 100K tokens:** $0.50 input / $2.50 output per 1M tokens (Anthropic's published rate), 5× the per-token price

Our calculator and the tables on this page show the up-to-100K price. If you're feeding Haiku long documents, compare the over-100K rate with Sonnet 5.5's flat {{pair:claude-sonnet-5-5}} before you assume Haiku is the cheap option. Splitting a long document into chunks under 100K tokens keeps you on the lower rate.

**The tokenizer counts more tokens.** Haiku 5.5 uses a newer tokenizer that produces roughly 30% more tokens than Haiku 4.5 did for the same text. Within 100K, Haiku 5.5 costs 90% less per token than Haiku 4.5 did. Anthropic puts the average real-world saving at about 75%. If you're sizing a migration from Haiku 4.5 usage logs, add about 30% to the token counts, then apply the new prices. Don't rely only on the per-token price cut.

## Prompt caching: writes cost extra, reads are cheap

Anthropic's caching is explicit. You mark the parts of the prompt that stay the same between calls, usually the system prompt, tool definitions and reference documents:

```python
messages = [
    {
        "role": "system",
        "content": [
            {
                "type": "text",
                "text": LONG_SYSTEM_PROMPT,
                "cache_control": {"type": "ephemeral"}
            }
        ]
    },
    {"role": "user", "content": "..."}
]
```

The first call **writes** the cache, and later calls within the retention window **read** it. Anthropic bills both. It offers 5-minute and 1-hour retention, and both kinds of write are charged. The write price shown here is the one in our dataset. Check [Anthropic's pricing page](https://platform.claude.com/docs/en/about-claude/pricing) for the rate that matches the retention you use.

| Model | Standard input | Cache write | Cache read |
|---|---|---|---|
| Claude Opus 5.5 | {{in:claude-opus-5-5}} | {{cache-write:claude-opus-5-5}} | {{cached:claude-opus-5-5}} |
| Claude Sonnet 5.5 | {{in:claude-sonnet-5-5}} | {{cache-write:claude-sonnet-5-5}} | {{cached:claude-sonnet-5-5}} |
| Claude Haiku 5.5 | {{in:claude-haiku-5-5}} | {{cache-write:claude-haiku-5-5}} | {{cached:claude-haiku-5-5}} |

A cache write costs **more** than sending the same tokens uncached, so caching only pays off when the cached prefix is reused before it expires. A prompt that changes every call, or traffic too sparse to hit the cache within the window, can cost *more* with caching turned on.

### Working out whether caching pays

For a stable prefix of *P* tokens sent on *N* calls a day, where *w* calls write the cache and the rest read it:

- **Writes:** w × P ÷ 1M × cache-write price (Sonnet 5.5: {{cache-write:claude-sonnet-5-5}})
- **Reads:** (N − w) × P ÷ 1M × cache-read price (Sonnet 5.5: {{cached:claude-sonnet-5-5}})
- **Without caching:** N × P ÷ 1M × input price (Sonnet 5.5: {{in:claude-sonnet-5-5}})

Output tokens and the part of the input that changes each call cost the same either way, so leave them out of the comparison. Caching saves the most on input-heavy work: RAG, document Q&A, and agents with long tool specs. On output-heavy work it barely moves the bill, because caching never discounts output.

To try your own numbers, [open the calculator with Sonnet 5.5 and caching set to 80%](/?model=claude-sonnet-5-5&in=20000&out=800&cache=80). One caveat: the calculator's cache slider prices the cached share at the **read** rate and doesn't add write costs. Add the writes yourself using the formula above.

## Batch API

For work that doesn't need an immediate answer, such as evaluations, data enrichment and overnight report generation, Anthropic's Batch API charges half the standard rate on both input and output:

| Model | Standard (in/out per 1M) | Batch (in/out per 1M) |
|---|---|---|
| Claude Sonnet 5.5 | {{pair:claude-sonnet-5-5}} | {{batch-pair:claude-sonnet-5-5}} |
| Claude Haiku 5.5 | {{pair:claude-haiku-5-5}} | {{batch-pair:claude-haiku-5-5}} |

Our dataset doesn't list a Batch price for Opus 5.5, Fable 5.1 or Mythos 5.1. If you're planning around batching one of those, check Anthropic's pricing page first. To see the Batch discount in the calculator, add `&batch=1` to a [share link](/?model=claude-haiku-5-5&in=2000&out=200&batch=1).

## Older Claude models still on the API

These are still available, but each has a retirement date (except Mythos 5, for which we have no date). Plan any migration before that date, not on it.

| Model | Input/output per 1M | Cache read | Listed retirement |
|---|---|---|---|
| [Claude Opus 5](/claude-opus-5-cost-calculator) | {{pair:claude-opus-5}} | {{cached:claude-opus-5}} | 2027-07-24 |
| [Claude Opus 4.8](/claude-opus-4-8-cost-calculator) | {{pair:claude-opus-4-8}} | {{cached:claude-opus-4-8}} | 2027-05-28 |
| [Claude Opus 4.7](/claude-opus-4-7-cost-calculator) | {{pair:claude-opus-4-7}} | {{cached:claude-opus-4-7}} | 2027-04-16 |
| [Claude Sonnet 5](/claude-sonnet-5-cost-calculator) | {{pair:claude-sonnet-5}} | {{cached:claude-sonnet-5}} | 2027-06-30 |
| [Claude Fable 5.1](/claude-fable-5-1-cost-calculator) | {{pair:claude-fable-5-1}} | {{cached:claude-fable-5-1}} | 2027-09-01 |
| [Claude Mythos 5.1](/claude-mythos-5-1-cost-calculator) | {{pair:claude-mythos-5-1}} | {{cached:claude-mythos-5-1}} | 2027-09-01 |
| [Claude Fable 5](/claude-fable-5-cost-calculator) | {{pair:claude-fable-5}} | {{cached:claude-fable-5}} | 2027-06-09 |
| [Claude Mythos 5](/claude-mythos-5-cost-calculator) | {{pair:claude-mythos-5}} | {{cached:claude-mythos-5}} | — |
| Claude Haiku 4.5 | — | — | **Retired 2026-10-15** |

A few things worth knowing:

- **On an older Opus, upgrading lowers your bill.** Opus 5, 4.8 and 4.7 all cost more per token than Opus 5.5.
- **On an older Sonnet,** Sonnet 5.5 has the same input/output price as Sonnet 5 and cheaper cached input.
- **Fable and Mythos are priced above Opus.** Fable 5 launched as Anthropic's premium tier above Opus 4.8. The 5.1 versions keep the same headline rate as the 5.0 versions and cut cached input to a quarter. If you run cache-heavy traffic on Fable 5 or Mythos 5, the 5.1 version is the cheaper drop-in. We don't have a verified comparison between these lines and Opus 5.5, so test before paying the higher rate.
- **Still on Haiku 4.5?** It was retired on 2026-10-15. The nearest current model is [Haiku 5.5](/claude-haiku-5-5-cost-calculator). Before you compare costs, read the tokenizer note in the Haiku 5.5 section above.

## Claude vs other providers, per call

For a 1,000-input / 500-output call, with no caching:

| Model | Cost per call | Note |
|---|---|---|
| {{name:claude-haiku-5-5}} | {{call:claude-haiku-5-5}} | Up-to-100K price |
| {{name:gpt-6-luna}} | {{call:gpt-6-luna}} | OpenAI: "most efficient model for focused, high-volume tasks" |
| {{name:gemini-3-8-flash}} | {{call:gemini-3-8-flash}} | Introductory price through 2026-12-31. It doubles from 2027-01-01 |
| **{{name:claude-sonnet-5-5}}** | {{call:claude-sonnet-5-5}} | Anthropic's default tier |
| {{name:gpt-6-1-sol}} | {{call:gpt-6-1-sol}} | OpenAI: "Near-Astra performance for complex work at a lower cost" |
| **{{name:claude-opus-5-5}}** | {{call:claude-opus-5-5}} | Anthropic's current Opus |
| {{name:gpt-6-astra}} | {{call:gpt-6-astra}} | OpenAI: "our most capable model" |

The per-call figure ignores caching, and caching can change the ranking. Every model above has a cached-input price. Anthropic and OpenAI's GPT-6.1 models also charge for cache writes. For OpenAI's side of this, see [OpenAI API pricing explained](/blog/openai-api-pricing-explained-2026).

## Cost checklist for production Claude workloads

1. **Cache stable prefixes** with `cache_control`, then measure your hit rate. A low hit rate means you're paying write prices for little benefit.
2. **Keep Haiku 5.5 prompts under 100K tokens**, or price the long ones at the higher rate.
3. **Route by difficulty:** Haiku 5.5 for classification and extraction, Sonnet 5.5 as the default, Opus 5.5 for the hard cases.
4. **Batch anything that isn't real-time**, on models with a Batch price.
5. **Cap output with `max_tokens` and stop sequences.** Output costs several times as much as input on every Claude model ({{pair:claude-sonnet-5-5}} on Sonnet 5.5), and caching never discounts it.
6. **Check retirement dates** in the table above, and on the [changes page](/changes) for price moves.

## Bottom line

For most teams in late 2026, **Claude Sonnet 5.5 at {{pair:claude-sonnet-5-5}}** is the starting point. Haiku 5.5 handles the cheap high-volume steps, as long as you watch the 100K tier and the tokenizer. Opus 5.5 is for the work where Sonnet falls short, and it costs less than any earlier Opus. Caching is where the savings are, but writes are billed, so only cache prefixes that actually get reused.

Plug your own token mix into the [calculator](/) and compare tiers side by side.

---

*Prices on this page are pulled live from our dataset (last verified {{updated}}). Policy details such as the 100K tier, the tokenizer and cache retention come from Anthropic's published pages as of 2026-10-29. Check [Anthropic's pricing page](https://platform.claude.com/docs/en/about-claude/pricing) before you commit budget.*

---
title: "How to Calculate Token Cost: A Beginner's Guide"
description: "Everything you need to know about tokens — what they are, how they're billed, and how to estimate your AI API bill before you ship. With worked examples."
date: "2026-05-05"
author: "AI Cost Calc Team"
tags: ["beginners", "tokens", "pricing", "tutorial"]
readingTime: "11 min read"
lastUpdated: "2026-10-29"
---

> **📊 How to read the numbers here:** Wherever this guide names a real model, its price is live — pulled from the same data as the [calculator](/) and last verified **{{updated}}**. The worked examples use **made-up round rates** so the arithmetic is easy to follow; the method is what matters. Price moves are logged on the [price-change page](/changes).


If you're new to AI APIs, the bills can feel confusing. Why is "1 million tokens" the unit instead of words or seconds? Why does a 100-word prompt cost differently across providers? Why does the same paragraph count as more tokens on Claude Haiku 5.5 than it did on Claude Haiku 4.5?

This guide walks through everything: **what tokens are**, **how they're billed**, **why the math is sometimes weird**, and **how to estimate your bill before shipping anything**. By the end you'll be able to look at any LLM pricing page and know what your real cost will be.

## What is a token, really?

A token is the **smallest unit of text** that a language model processes. It's not a word, not a character, not a syllable — it's a chunk that the model's tokenizer decides to treat as one piece.

Roughly:
- **English text**: 1 token ≈ 4 characters ≈ 0.75 words
- **Chinese text**: 1 token ≈ 1.5 characters
- **Code**: 1 token ≈ 3 characters (lots of punctuation = more tokens)
- **Numbers and rare strings**: highly variable

For example, with OpenAI's `o200k_base` tokenizer (used by every OpenAI model on this site):

- "Hello, world!" (13 characters) is **4 tokens**: `Hello` `,` ` world` `!`
- "antidisestablishmentarianism" (one word, 28 characters) is **6 tokens**: `ant` `idis` `est` `ablishment` `arian` `ism`
- `const x = arr.map((v) => v * 2);` (32 characters of code) is **14 tokens**

Different models use different tokenizers, so the *exact* count for the same text varies — sometimes a lot. The newer tokenizer that Claude Haiku 5.5 uses produces about **30% more tokens** for the same text than Claude Haiku 4.5's did. That's the same words, billed as 30% more units. When you compare two models' per-token prices, a tokenizer gap that size can flip which one is actually cheaper.

> **Want exact counts?** OpenAI publishes its tokenizer (`tiktoken`). Run a few sample texts through it to calibrate. The [calculator on this site](/) uses it for OpenAI models — you'll see "✓ Exact tokenizer" under the model picker. For other providers we estimate from character ratios, marked "≈ Estimated tokenizer", so check those against the provider's own token counter before committing budget.

## Why tokens, not words?

Three reasons:

1. **Models actually think in tokens.** The neural network's input layer accepts a sequence of token IDs, not characters or words. Tokens are the natural billing unit.
2. **Tokens work across languages.** Word counts mean little in a language like Chinese that doesn't put spaces between words; token counts apply the same way to every language.
3. **Tokens scale predictably with cost.** Every token consumes roughly the same compute, so per-token pricing is fair.

## How AI APIs bill you

Two-direction billing:

- **Input tokens** (what you send) — the cheaper side
- **Output tokens** (what the model generates) — usually several times more expensive; 5× input is common

Both are priced **per 1 million tokens**. A real example: {{name:gpt-6-1-sol}} costs {{price:gpt-6-1-sol}}.

Every worked example below uses **made-up round rates** — real current prices are on the [calculator](/). So if a model is "$2.50 input / $10 output", that means:

- Sending 1M tokens of input → $2.50
- Receiving 1M tokens of output → $10.00

For a typical chat call (1000 input + 500 output tokens):

```
Input cost  = (1000 / 1,000,000) × $2.50 = $0.0025
Output cost = (500 / 1,000,000)  × $10.00 = $0.0050
Total per call = $0.0075
```

Less than one cent. Easy. Until volume kicks in.

## Volume changes everything

Single-call costs are misleading. The interesting question is **monthly cost at production volume**.

Suppose your chatbot does 1,000 conversations/day, each with 5 message exchanges, each averaging 1500 input + 200 output tokens:

```
Calls per month   = 1,000 × 5 × 30 = 150,000
Total input       = 150,000 × 1,500 = 225M tokens
Total output      = 150,000 × 200 = 30M tokens

At $2.50/$10 (illustrative flagship rate):
  Input  cost = 225 × $2.50 = $562.50
  Output cost = 30  × $10   = $300.00
  Monthly total = $862.50

At $0.20/$0.80 (illustrative small-model rate):
  Input  cost = 225 × $0.20 = $45.00
  Output cost = 30  × $0.80 = $24.00
  Monthly total = $69.00
```

**12× cost difference at the same volume.** Real price spreads are even wider: today a single 1,000-in / 500-out call costs {{call:gpt-6-luna}} on {{name:gpt-6-luna}} and {{call:gpt-6-astra}} on {{name:gpt-6-astra}}. This is why model selection isn't just a quality question — it's a budget question.

## The hidden discounts

Two pricing dimensions that beginner guides skip but production users care about:

### Cached input (the big one)

Most modern LLMs support **prompt caching** — if you re-send a prompt prefix the provider has already seen within its retention window, the cached portion bills at a steep discount, often 90% or more:

- {{name:gpt-6-1-sol}}: {{in:gpt-6-1-sol}} input / {{cached:gpt-6-1-sol}} cached → **95% off**
- {{name:claude-sonnet-5-5}}: {{in:claude-sonnet-5-5}} input / {{cached:claude-sonnet-5-5}} cached
- {{name:claude-haiku-5-5}}: {{in:claude-haiku-5-5}} input / {{cached:claude-haiku-5-5}} cached
- {{name:gemini-3-1-pro}}: {{in:gemini-3-1-pro}} input / {{cached:gemini-3-1-pro}} cached
- {{name:deepseek-v4-flash}}: {{in:deepseek-v4-flash}} input / {{cached:deepseek-v4-flash}} on a cache hit

(All per 1M tokens.)

This matters enormously for:
- **System prompts** that don't change between calls
- **RAG context** that's retrieved once and re-sent
- **Tool/function specs** that are stable

**But writing to the cache can cost extra.** Anthropic charges for cache writes (with 5-minute and 1-hour retention options), and OpenAI now does too on its GPT-6.1 models (30-minute and 12-hour retention). The write is billed *above* the normal input rate — {{name:claude-sonnet-5-5}} charges {{cache-write:claude-sonnet-5-5}} per 1M tokens to write versus {{in:claude-sonnet-5-5}} for plain input, and {{name:gpt-6-1-sol}} charges {{cache-write:gpt-6-1-sol}}. You pay a little more the first time so that every re-read is cheap. If a prefix is written but rarely read again before it expires, caching can cost *more* than not caching.

Here's the method with illustrative rates — $1.00/1M input, $0.10/1M cached, $1.25/1M cache write. A 1,500-token system prompt, sent 10 times within the retention window:

```
Without caching:
  10 calls × 1,500 tokens × $1.00/1M = $0.0150 input cost

With caching:
  Call 1 (cache write):  1,500 × $1.25/1M     = $0.001875
  Calls 2-10 (reads):    9 × 1,500 × $0.10/1M = $0.00135
  Total: ≈ $0.0032
```

**About 4.6× cheaper** just from caching the system prompt — and the more reads per write, the bigger the gap. Now try it with only one re-read: $0.001875 + $0.00015 ≈ $0.0020 against $0.0030 uncached. Still a saving, but a slim one; with no re-read at all, the write premium is pure loss.

### Batch API (the second-biggest)

OpenAI, Anthropic and Google offer a Batch API on many of their models:
- Submit your requests asynchronously
- Get results back later (typically within 24 hours)
- Pay a reduced rate — usually **50% of standard**. On {{name:gpt-6-1-sol}} that's {{batch-pair:gpt-6-1-sol}} instead of {{pair:gpt-6-1-sol}}.

Not every model has one — on this site, DeepSeek, xAI and Mistral models have no batch price, and neither do some models from the big three. The calculator's "With Batch" figure only appears where a batch price exists.

This works for any workload that doesn't need real-time responses:
- Overnight content generation
- Periodic data enrichment
- Embedding refreshes
- Synthetic training data generation

You're trading latency for half the bill. For appropriate workloads this is an easy 50% saving.

## The hidden surcharges

Discounts aren't the only thing missing from the headline price. Three things can make your bill *higher* than the per-1M rate suggests:

**1. Long-context price tiers.** Some models charge more per token once a prompt passes a size threshold:
- {{name:claude-haiku-5-5}}'s {{pair:claude-haiku-5-5}} applies to prompts up to 100K tokens. Above that it costs **5× per token**, even though its context window is {{ctx:claude-haiku-5-5}}.
- {{name:gpt-6-1-sol}} and {{name:gpt-6-1-terra}} switch to a higher long-context rate for prompts over **272K tokens**.

If your prompts regularly cross those lines, price them at the higher tier. The calculator shows each model's base rate, and the model pages ([Haiku 5.5](/claude-haiku-5-5-cost-calculator), [GPT-6.1 Sol](/gpt-6-1-sol-cost-calculator)) spell out the tiers.

**2. Introductory prices.** {{name:gemini-3-8-flash}} lists at {{pair:gemini-3-8-flash}}, but that's an introductory price that ends **2026-12-31**; from 2027-01-01 it doubles. Budget anything long-running on the standard rate.

**3. Retirements.** A model you priced in May may not exist in December. Claude Haiku 4.5 retired on 2026-10-15 and o4-mini on 2026-10-23; {{name:gpt-5-mini}} retires on 2026-12-11. Migrating means re-measuring — a new model can have a different tokenizer, a different price tier, or both.

## The full pricing surface

Pulling it together, a single call's true cost is:

```
total_cost =
    (uncached_input_tokens / 1M)  × input_price
  + (cache_write_tokens / 1M)     × cache_write_price   (Anthropic, OpenAI GPT-6.1)
  + (cached_input_tokens / 1M)    × cached_input_price
  + (output_tokens / 1M)          × output_price

(if the prompt is over the model's long-context threshold: use the long-context rates)
(if batch API: use the batch rates — usually 50% of standard)
```

The [calculator on this site](/) computes the uncached, cached, output and batch parts. It does not add cache-write charges or long-context tiers, so add those yourself when they apply. Your provider invoice will reflect all of it — give or take small differences in tokenization.

## Worked example: chatbot at scale

Let's price a customer support chatbot in detail:

**Workload**:
- 5,000 conversations/day
- 4 messages per conversation on average
- System prompt: 2,000 tokens (stable, same for all conversations)
- User message: 100 tokens average
- Assistant response: 300 tokens average

We'll use an **illustrative small model** at $0.40 input / $2.00 output, $0.04 cached input and $0.50 cache write per 1M tokens.

**Naive calculation** (no caching):

```
Calls/day        = 5,000 × 4 = 20,000
Input/day        = 20,000 × (2,000 + 100) = 42M tokens
Output/day       = 20,000 × 300 = 6M tokens

Cost/day = (42 × $0.40) + (6 × $2.00) = $16.80 + $12.00 = $28.80
Cost/month ≈ $864
```

**With caching** (~95% of system-prompt reads hit the cache; the misses are re-written to it):

```
Cached reads/day   = 20,000 × 2,000 × 0.95 = 38M tokens × $0.04/1M = $1.52
Cache writes/day   = 20,000 × 2,000 × 0.05 = 2M tokens  × $0.50/1M = $1.00
User msg input/day = 20,000 × 100              = 2M tokens × $0.40/1M = $0.80
Output cost        = 6M × $2.00/1M                                   = $12.00
Total/day          = $15.32
Cost/month ≈ $460
```

**Savings: about $404/month, 47%** — entirely from structuring prompts to be cacheable. Notice two things. First, output is now most of the bill, so the next lever is capping response length, not squeezing the prompt. Second, the cache-write premium cost only $0.20/day here (2M tokens at $0.50 instead of $0.40) because the hit rate is high; at a low hit rate it would eat the saving.

**Adding the Batch API** for the 30% of conversations that are overnight summary generation: those calls bill at roughly half, which trims up to another ~15%. Whether batch and cache discounts stack depends on the provider — check before counting on both.

To run the same workload on real models, open [the calculator with roughly this setup](/?model=gpt-6-luna&in=2100&out=300&cache=90) and switch models — the link carries the token counts and cache share, so you can also send it to whoever signs off the budget.

## How to estimate before you ship

A practical workflow:

1. **Sample your prompts.** Write 10 representative prompts and 10 representative model responses. Don't guess — sample real or realistic data.
2. **Count tokens with the right tokenizer.** Use `tiktoken` for OpenAI models and the provider's token-counting endpoint for others. Average input tokens. Average output tokens.
3. **Project your volume.** Calls per day × average tokens × 30 = monthly tokens.
4. **Run the numbers** through [the calculator](/) for each candidate model.
5. **Apply caching realism.** What % of your input is reusable, and how often is it re-read within the retention window? Apply the cached price to the reads and the cache-write price to the writes.
6. **Check the fine print.** Is your typical prompt over a long-context threshold? Is the price introductory, or the model scheduled to retire? The [price-change log](/changes) shows what's moved recently.
7. **Add 20% buffer.** Real-world tokens are often 10-20% higher than samples (longer messages, retries, edge cases).

## Common mistakes

**1. Forgetting output is more expensive than input.**
A common pricing surprise: "I sent 500 tokens, why did this cost $0.005 not $0.001?" → because the model wrote 800 tokens of output, and output is several times more expensive.

**2. Not capping output tokens.**
If you don't set `max_tokens` (or `max_output_tokens`), the model will sometimes generate 2,000-token responses for tasks that only needed 200. Multiply by thousands of calls and the bill is several × what it should be.

**3. Re-sending the same system prompt with slight variations.**
Caching only works on **identical** prefixes. If your system prompt has the current timestamp or a user ID inline, you lose the cache — and on providers that charge for writes, you pay the write premium again and again. Fix: put dynamic data at the END of the prompt, after the cacheable prefix.

**4. Optimizing for input when output dominates.**
If you're generating long content (essays, code, summaries), output rate matters most. Compress your prompts all you want — output cost is the killer.

**5. Choosing models on price alone.**
A cheap model that gets your task wrong 30% of the time, requiring retries, ends up more expensive than a pricier one that works first try. Match the model to the task complexity.

**6. Comparing per-token prices across different tokenizers.**
Claude Haiku 5.5 counts about 30% more tokens than Haiku 4.5 for the same text. Count your own prompts on each candidate before declaring a winner.

**7. Budgeting on a price that won't last.**
Long-context tiers, introductory prices (Gemini 3.8 Flash doubles on 2027-01-01) and retirements all change what you'll actually pay. Price at the tier you'll really use, for the period you'll really run.

## Tools you should use

- **[The calculator on this site](/)**: cost estimation across the {{model-count}} models we track, with caching/batch toggles and shareable links
- **[Price-change log](/changes)**: every price move we've recorded, by date
- **OpenAI's `tiktoken`**: official tokenizer for exact OpenAI token counts
- **Anthropic's token-counting API**: free endpoint that returns exact Claude token counts
- **Google's `count_tokens` API**: same for Gemini

For day-to-day cost reasoning, this site's calculator covers most of what you need. For final budget commitments, validate against the provider's exact tokenizer and add any cache-write or long-context charges.

## Next steps

- **[Top 10 Cheapest AI APIs in 2026](/blog/top-10-cheapest-ai-apis-2026)**: live ranked comparison
- **[OpenAI API Pricing Explained](/blog/openai-api-pricing-explained-2026)**: deep dive on OpenAI's pricing
- **[Claude API Pricing](/blog/claude-api-pricing-2026)**: deep dive on Anthropic's caching mechanics
- Use [the calculator](/) to model your specific workload

---

*The basics in this guide (tokens, input vs output, caching, batch) are stable concepts; the specific rates change often. Model prices quoted above are live and were last verified {{updated}}.*

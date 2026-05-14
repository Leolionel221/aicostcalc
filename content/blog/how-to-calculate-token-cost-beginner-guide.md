---
title: "How to Calculate Token Cost: A Beginner's Guide"
description: "Everything you need to know about tokens — what they are, how they're billed, and how to estimate your AI API bill before you ship. With worked examples."
date: "2026-05-05"
author: "AI Cost Calc Team"
tags: ["beginners", "tokens", "pricing", "tutorial"]
readingTime: "8 min read"
lastUpdated: "2026-05-12"
---

> **📊 Updated 2026-05-12:** Pricing data refreshed against LiteLLM's public registry. Specific example prices in this guide were verified against early-2026 projections — the principles and structure remain accurate, but exact $ figures may differ from current rates. See the [calculator](/) for live numbers.


If you're new to AI APIs, the bills can feel confusing. Why is "1 million tokens" the unit instead of words or seconds? Why does a 100-word prompt cost differently across providers? Why did Claude charge you 1.3× what GPT did for the same text?

This guide walks through everything: **what tokens are**, **how they're billed**, **why the math is sometimes weird**, and **how to estimate your bill before shipping anything**. By the end you'll be able to look at any LLM pricing page and immediately know what your real cost will be.

## What is a token, really?

A token is the **smallest unit of text** that a language model processes. It's not a word, not a character, not a syllable — it's a chunk that the model's tokenizer decides to treat as one piece.

Roughly:
- **English text**: 1 token ≈ 4 characters ≈ 0.75 words
- **Chinese text**: 1 token ≈ 1.5 characters (denser, fewer tokens per char)
- **Code**: 1 token ≈ 3 characters (lots of punctuation = more tokens)
- **Numbers and rare strings**: highly variable

So "Hello, world!" (13 characters) is about **3-4 tokens** in most modern tokenizers. The phrase "internationalization" (one word, 20 characters) might be **5-7 tokens** because it's split into sub-pieces like `inter`, `national`, `ization`.

Different models use different tokenizers, so the *exact* token count for the same text varies:
- OpenAI GPT-5: 3 tokens for "Hello, world!"
- Claude: similar, ~3 tokens
- Gemini: ~3-4 tokens
- DeepSeek: ~3 tokens

The differences are usually within 10-20%, but for very long inputs they add up.

> **Want exact counts?** OpenAI publishes their tokenizer (`tiktoken`). Run a few sample texts through it to calibrate. The [calculator on this site](/) uses tiktoken for OpenAI models — you'll see "✓ Exact tokenizer" in the model dropdown. For other providers we use character ratios marked "≈ Estimated" because no comparable JS tokenizer exists yet.

## Why tokens, not words?

Three reasons:

1. **Models actually think in tokens.** The neural network's input layer accepts a sequence of token IDs, not characters or words. Tokens are the natural billing unit.
2. **Tokens normalize across languages.** A Chinese sentence and an English sentence with the same meaning may have very different word counts but similar token counts.
3. **Tokens scale predictably with cost.** Every token consumes roughly the same compute, so per-token pricing is fair.

## How AI APIs bill you

Two-direction billing:

- **Input tokens** (what you send) — usually the cheaper side
- **Output tokens** (what the model generates) — usually 3-5× more expensive than input

Both are priced **per 1 million tokens** at the standard rates. So if a model is "$2.50 input / $10 output", that means:

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

At $2.50/$10 (GPT-5.5):
  Input  cost = 225 × $2.50 = $562.50
  Output cost = 30  × $10   = $300.00
  Monthly total = $862.50

At $0.20/$0.80 (GPT-5 mini):
  Input  cost = 225 × $0.20 = $45.00
  Output cost = 30  × $0.80 = $24.00
  Monthly total = $69.00
```

**12× cost difference at the same volume.** This is why model selection isn't just a quality question — it's a budget question.

## The hidden discounts

Two pricing dimensions that beginner guides skip but production users care about:

### Cached input (the big one)

Most modern LLMs support **prompt caching** — if you re-send a prompt prefix you've sent before in the last few minutes, the cached portion bills at a steep discount:

- OpenAI GPT-5.5: $5.00 input / $1.25 cached → **75% off**
- Claude Opus 4.7: $5 input / $0.50 cached → **90% off**
- Claude Haiku 4.5: $1.00 input / $0.10 cached → **90% off**
- Gemini 3.1 Pro: $2.00 input / $0.20 cached → **90% off**

This matters enormously for:
- **System prompts** that don't change between calls
- **RAG context** that's retrieved once and re-sent
- **Tool/function specs** that are stable

If your system prompt is 1,500 tokens and you call the model 10 times with the same prefix:

```
Without caching:
  10 calls × 1,500 tokens × $5/1M = $0.075 input cost

With caching (90% cache hit after first call):
  Call 1: 1,500 × $5/1M     = $0.0075
  Calls 2-10: 9 × 1,500 × $1.25/1M = $0.0169
  Total: $0.0244
```

**3× cost reduction** just from caching the system prompt. For RAG and chat applications, savings of 50-80% are typical.

### Batch API (the second-biggest)

OpenAI, Anthropic, and Google all offer a Batch API:
- Submit your requests asynchronously
- Get results back within 24 hours
- Pay **50% of the standard rate**

This works for any workload that doesn't need real-time responses:
- Overnight content generation
- Periodic data enrichment
- Embedding refreshes
- Synthetic training data generation

You're trading latency (24h instead of seconds) for half the bill. For appropriate workloads this is a **no-brainer 50% saving**.

## The full pricing surface

Pulling it together, a single call's true cost is:

```
total_cost =
    (uncached_input_tokens / 1M)  × input_price
  + (cached_input_tokens / 1M)    × cached_input_price
  + (output_tokens / 1M)          × output_price

(if batch API: multiply all rates by 0.5)
```

This is what the [calculator on this site](/) computes. It's also what your actual provider invoice will reflect — give or take small differences in tokenization.

## Worked example: chatbot at scale

Let's price a customer support chatbot in detail:

**Workload**:
- 5,000 conversations/day
- 4 messages per conversation on average
- System prompt: 2,000 tokens (stable, same for all conversations)
- User message: 100 tokens average
- Assistant response: 300 tokens average

**Naive calculation** (no caching, GPT-5 mini at $0.20/$0.80):

```
Calls/day        = 5,000 × 4 = 20,000
Input/day        = 20,000 × (2,000 + 100) = 42M tokens
Output/day       = 20,000 × 300 = 6M tokens

Cost/day = (42 × $0.20) + (6 × $0.80) = $8.40 + $4.80 = $13.20
Cost/month ≈ $396
```

**With caching** (GPT-5 mini cached input at $0.05/1M, ~95% cache hits after warmup):

```
Cached input/day      = 20,000 × 2,000 × 0.95 = 38M tokens × $0.05/1M = $1.90
Uncached system /day  = 20,000 × 2,000 × 0.05 = 2M tokens  × $0.20/1M = $0.40
User msg input/day    = 20,000 × 100              = 2M tokens × $0.20/1M = $0.40
Output cost           = 6M × $0.80/1M = $4.80
Total/day             = $7.50
Cost/month ≈ $225
```

**Savings: $171/month, 43%** — entirely from structuring prompts to be cacheable.

**With caching + Batch API** for the 30% of conversations that are summary generation (overnight pipeline):

Skip the math but realistic estimate is another **$30-50/month savings**, bringing total to ~$180/month.

## How to estimate before you ship

A practical workflow:

1. **Sample your prompts.** Write 10 representative prompts and 10 representative model responses. Don't guess — sample real or realistic data.
2. **Count tokens.** Use OpenAI's `tiktoken` (Python or JS) on the samples. Average input tokens. Average output tokens.
3. **Project your volume.** Calls per day × average tokens × 30 = monthly tokens.
4. **Run the numbers** through [the calculator](/) for each candidate model.
5. **Apply caching realism.** What % of your input is reusable? Apply the cached input price to that portion.
6. **Add 20% buffer.** Real-world tokens are often 10-20% higher than samples (longer messages, retries, edge cases).

## Common mistakes

**1. Forgetting output is more expensive than input.**
A common pricing surprise: "I sent 500 tokens, why did this cost $0.005 not $0.001?" → because the model wrote 800 tokens of output, and output is 4-5× more expensive.

**2. Not capping output tokens.**
If you don't set `max_tokens` (or `max_output_tokens`), the model will sometimes generate 2,000-token responses for tasks that only needed 200. Multiply by thousands of calls and the bill is several × what it should be.

**3. Re-sending the same system prompt with slight variations.**
Caching only works on **identical** prefixes. If your system prompt has the current timestamp or a user ID inline, you lose the cache. Fix: put dynamic data at the END of the prompt, after the cacheable prefix.

**4. Optimizing for input when output dominates.**
If you're generating long content (essays, code, summaries), output rate matters most. Compress your prompts all you want — output cost is the killer.

**5. Choosing models on price alone.**
A $0.20 model that gets your task wrong 30% of the time, requiring retries, ends up more expensive than a $2.50 model that works first try. Match the model to the task complexity.

## Tools you should use

- **[The calculator on this site](/)**: real-time cost estimation across 10+ models with caching/batch toggles
- **OpenAI's `tiktoken`**: official tokenizer for exact OpenAI token counts
- **Anthropic's token-counting API**: free endpoint that returns exact Claude token counts
- **Google's `count_tokens` API**: same for Gemini

For day-to-day cost reasoning, this site's calculator covers ~95% of what you need. For final budget commitments, validate against the provider's exact tokenizer.

## Next steps

- **[Top 10 Cheapest AI APIs in 2026](/blog/top-10-cheapest-ai-apis-2026)**: ranked comparison
- **[OpenAI API Pricing Explained](/blog/openai-api-pricing-explained-2026)**: deep dive on OpenAI's pricing
- **[Claude API Pricing](/blog/claude-api-pricing-2026)**: deep dive on Anthropic's caching mechanics
- Use [the calculator](/) to model your specific workload

---

*This guide assumes 2026 pricing structures. The basics (tokens, input vs output, caching) are stable concepts; the specific rates change frequently.*

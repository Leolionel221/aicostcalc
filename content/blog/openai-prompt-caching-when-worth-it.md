---
title: "OpenAI Prompt Caching in 2026: When the 95% Discount Pays (And When It Costs You)"
description: "On GPT-6.1 Sol and Terra, cached input is 95% off, but OpenAI now charges for cache writes. Here's the break-even point with the arithmetic, how to structure prompts to reach it, and the patterns that waste the write charge."
date: "2026-05-12"
author: "AI Cost Calc Team"
tags: ["openai", "prompt-caching", "cost-optimization", "llm"]
readingTime: "8 min read"
featured: true
lastUpdated: "2026-10-29"
---

> **📊 Prices on this page are live**: they're pulled from the site dataset at build time, last verified **{{updated}}**.

Prompt caching is still the biggest single lever on an OpenAI bill. On [{{name:gpt-6-1-sol}}](/gpt-6-1-sol-cost-calculator) a cached input token costs {{cached:gpt-6-1-sol}} per 1M against {{in:gpt-6-1-sol}} at the standard rate, which is **95% off**.

What changed in 2026 is that caching can now **cost** you money. On GPT-6.1 models, OpenAI charges for writing a prefix into the cache, and the write costs more than a normal input token. If a prefix is written and never read back, you pay more than you would have without caching.

The core rule hasn't changed: **caching only saves money when the start of your prompt repeats.** What's new is that there's now a break-even point, and you should know which side of it each workload falls on.

## The prices that matter

| Model | Standard input | Cached read | Cache write | Read discount |
|---|---|---|---|---|
| [**{{name:gpt-6-1-sol}}**](/gpt-6-1-sol-cost-calculator) | {{in:gpt-6-1-sol}} | {{cached:gpt-6-1-sol}} | {{cache-write:gpt-6-1-sol}} | 95% |
| [**{{name:gpt-6-1-terra}}**](/gpt-6-1-terra-cost-calculator) | {{in:gpt-6-1-terra}} | {{cached:gpt-6-1-terra}} | {{cache-write:gpt-6-1-terra}} | 95% |
| [{{name:gpt-6-astra}}](/gpt-6-astra-cost-calculator) | {{in:gpt-6-astra}} | {{cached:gpt-6-astra}} | see note | 90% |
| [{{name:gpt-6-sol}}](/gpt-6-sol-cost-calculator) | {{in:gpt-6-sol}} | {{cached:gpt-6-sol}} | see note | 90% |
| [{{name:gpt-6-luna}}](/gpt-6-luna-cost-calculator) | {{in:gpt-6-luna}} | {{cached:gpt-6-luna}} | see note | 90% |

_All prices per 1M tokens. The GPT-6.1 write prices are for OpenAI's 30-minute retention. OpenAI also offers 12-hour retention, but its write price isn't in our dataset. For GPT-6 Astra, Sol and Luna, check OpenAI's pricing page for how writes are billed. The break-even method below works for any model once you plug in its write price._

Reading the GPT-6.1 rows as multiples of the standard input price:

- A **write** costs {{cache-write:gpt-6-1-sol}} ÷ {{in:gpt-6-1-sol}} = **1.25×** input, a 25% premium.
- A **read** costs {{cached:gpt-6-1-sol}} ÷ {{in:gpt-6-1-sol}} = **0.05×** input, which saves 95%.

Terra has the same ratios ({{cache-write:gpt-6-1-terra}}, {{in:gpt-6-1-terra}} and {{cached:gpt-6-1-terra}}).

## The break-even point on GPT-6.1

Take a prefix (system prompt, tool definitions, reference documents) that gets sent **N** times within one retention window. Measure everything in units of "sending this prefix once at full price".

- **Without caching**, the cost is N × 1.00.
- **With caching**, you pay one write at 1.25 and then (N − 1) reads at 0.05 each.

| Times the prefix is sent | No caching | With caching | Difference |
|---|---|---|---|
| 1 (never reused) | 1.00 | 1.25 | **25% more** |
| 2 | 2.00 | 1.30 | 35% less |
| 5 | 5.00 | 1.45 | 71% less |
| 10 | 10.00 | 1.70 | 83% less |
| 100 | 100.00 | 6.20 | 94% less |

The general form uses the live prices directly:

- **Write premium** = write − input = {{cache-write:gpt-6-1-sol}} − {{in:gpt-6-1-sol}} per 1M tokens
- **Saving per read** = input − cached = {{in:gpt-6-1-sol}} − {{cached:gpt-6-1-sol}} per 1M tokens
- **Reads needed to pay back one write** = premium ÷ saving = 0.25 ÷ 0.95 ≈ **0.26**

You can also express this as a hit rate. If a share *h* of the times the prefix is sent are cache reads and the rest are writes, caching wins once (1 − *h*) × 1.25 + *h* × 0.05 < 1. That works out to **h > 0.25 ÷ 1.20 ≈ 21%**.

**Rule of thumb for GPT-6.1:** caching pays as soon as a prefix is **read back at least once** before it expires, or more than about 1 call in 5 hits the cache. When a prefix won't be reused, the write costs you 25% extra on those tokens.

This also explains why one-off prompts and badly structured prompts are worse now than on models without a write charge. There they saved nothing. On GPT-6.1 they can cost extra.

**A note on our calculator.** The [calculator's](/) cache slider prices the cached share of your input at the cached rate. It doesn't add the cost of the write that put it there. For high-reuse workloads, where the write is a rounding error, that's accurate. For workloads near the break-even point, add the write premium yourself.

## A worked example: an agent with a large tool spec

An internal agent on GPT-6.1 Sol sends 20,000 input tokens per call, of which about 16,000 are a fixed block of instructions, tool definitions and a style guide. A typical session makes 10 calls within a few minutes.

- **The 16K prefix without caching**: 10 sends × 1.00 = 10.00 units
- **With caching**: 1.25 + 9 × 0.05 = 1.70 units, **83% less** on the prefix

In dollar terms, each write of that prefix costs 0.016 × {{cache-write:gpt-6-1-sol}} and each read costs 0.016 × {{cached:gpt-6-1-sol}}. Compare that with 0.016 × {{in:gpt-6-1-sol}} for every uncached send.

With 80% of input cached, open it in the calculator: [/?model=gpt-6-1-sol&in=20000&cache=80](/?model=gpt-6-1-sol&in=20000&cache=80). For comparison, the same call with no caching is at [/?model=gpt-6-1-sol&in=20000](/?model=gpt-6-1-sol&in=20000).

Now change one thing: the agent stamps the current time at the top of the system prompt. Every call has a new prefix, so every call pays a write and none ever read. The prefix now costs **12.50 units** per session instead of 10.00, which is worse than having no caching at all.

## When caching saves the most

### 1. Agent loops with fixed tool specs

Tool definitions often run to thousands of tokens and don't change between iterations of a session. Every call after the first reads them from the cache. This is usually the highest-leverage cache in an application.

*Catch:* if you generate tool descriptions per user or per request, the prefix changes and you pay a write each time.

### 2. Conversation threads that only append

A chat where the system prompt and earlier turns stay fixed and new messages are appended at the end. Each turn reuses everything before it.

*Catch:* frameworks that rewrite history, for example by summarising old turns in place, change the prefix. Every rewrite means a new write.

### 3. RAG with stable context

If the same documents get prepended for many similar queries, as in FAQ-style products, the retrieved context becomes part of the cached prefix.

*Catch:* retrieval has to return the same chunks in the same order. Non-deterministic ranking or tie-breaking produces a different prefix, and therefore a write, on each call.

### 4. Bulk jobs with shared instructions

When 10,000 records go through the same classification or extraction prompt, the instructions are identical every time. If the job can wait, also consider the **Batch API**, which is half price on GPT-6.1 Sol ({{batch-pair:gpt-6-1-sol}}) and Terra ({{batch-pair:gpt-6-1-terra}}). See [OpenAI API Pricing Explained](/blog/openai-api-pricing-explained-2026) for when Batch makes sense.

## When caching saves nothing, or costs extra

### 1. One-shot calls

A "summarise this article" endpoint that sends a unique document once has nothing to reuse. On GPT-6.1, a cache write on that prompt is pure overhead. If the API gives you a choice, don't cache prompts you know are one-offs.

### 2. Dynamic values at the top of the prompt

```python
# Every call has a unique prefix: you pay a write, never a read
prompt = f"""
The current time is {datetime.now()}.
User ID: {user_id}
You are a helpful assistant for {product_name}.

[2,000 tokens of system prompt...]
"""
```

**Fix:** move anything that varies to the **end**, after the stable block:

```python
prompt = f"""
You are a helpful assistant for {product_name}.

[2,000 tokens of system prompt...]

Context: current time {datetime.now()}, user {user_id}
"""
```

Now the first ~2,000 tokens are identical from call to call. Only the short tail at the end is billed at the full rate.

### 3. Traffic with gaps longer than the retention window

If a prefix is used in bursts separated by more than its retention period, each burst starts with a fresh write. Bursts of many calls still come out well ahead, because one write is spread across the whole burst. The case to watch is a prefix used once or twice and then left idle. Each use can be a write that's never read back. OpenAI's 12-hour retention option exists for longer gaps, but check its write price before relying on it.

### 4. Rotating few-shot examples

```python
# Anti-pattern: a different prefix on every call
examples = random.sample(all_examples, k=5)
prompt = f"{system}\n\nExamples:\n{examples}\n\nUser: {user_input}"
```

**Fix:** pin the example set and rotate it on a schedule (daily, for example), not on every call.

## Measure your hit rate

OpenAI reports how many prompt tokens were served from the cache in each response's `usage` object, as `cached_tokens` under the prompt token details. Log it.

```json
{
  "usage": {
    "prompt_tokens": 2500,
    "prompt_tokens_details": { "cached_tokens": 2000 },
    "completion_tokens": 250
  }
}
```

The cached share for this call is 2,000 ÷ 2,500 = **80%**.

On GPT-6.1, compare your measured hit rate with the ~21% break-even point above. Then check your invoice for cache-write charges as well. A high write total next to a low hit rate means you're paying the premium without getting the reads. A sudden drop in hit rate after a deploy almost always means something dynamic has crept into the prefix.

## How OpenAI's caching now compares

| Model | Input | Cached read | Cache write |
|---|---|---|---|
| [{{name:gpt-6-1-sol}}](/gpt-6-1-sol-cost-calculator) | {{in:gpt-6-1-sol}} | {{cached:gpt-6-1-sol}} | {{cache-write:gpt-6-1-sol}} |
| [{{name:gpt-6-1-terra}}](/gpt-6-1-terra-cost-calculator) | {{in:gpt-6-1-terra}} | {{cached:gpt-6-1-terra}} | {{cache-write:gpt-6-1-terra}} |
| [{{name:claude-sonnet-5-5}}](/claude-sonnet-5-5-cost-calculator) | {{in:claude-sonnet-5-5}} | {{cached:claude-sonnet-5-5}} | {{cache-write:claude-sonnet-5-5}} |
| [{{name:claude-opus-5-5}}](/claude-opus-5-5-cost-calculator) | {{in:claude-opus-5-5}} | {{cached:claude-opus-5-5}} | {{cache-write:claude-opus-5-5}} |
| [{{name:claude-haiku-5-5}}](/claude-haiku-5-5-cost-calculator) | {{in:claude-haiku-5-5}} | {{cached:claude-haiku-5-5}} | {{cache-write:claude-haiku-5-5}} |
| [{{name:gemini-3-1-pro}}](/gemini-3-1-pro-cost-calculator) | {{in:gemini-3-1-pro}} | {{cached:gemini-3-1-pro}} | not in our data |

_Per 1M tokens. Anthropic offers 5-minute and 1-hour cache writes; the table shows the write price in our dataset. For any other caching charges on Gemini, check Google's caching docs._

With cache writes on GPT-6.1, OpenAI's caching economics now look like Anthropic's. In both cases you pay a premium to write and get a deep discount on each read. At the time of writing, GPT-6.1 Sol and Claude Sonnet 5.5 have identical input, cached-read and cache-write prices. The same break-even reasoning applies to both: reuse the prefix at least once and caching pays. Our [Claude API pricing guide](/blog/claude-api-pricing-2026) covers Anthropic's side.

## Checklist

New integration:

- [ ] Stable content first: system prompt, tool specs, reference documents
- [ ] Anything dynamic last: timestamps, user IDs, the user's message
- [ ] Few-shot examples pinned, not sampled per request
- [ ] Deterministic retrieval order
- [ ] Message history appended, never rewritten
- [ ] `cached_tokens` logged and alerted on

Existing application on GPT-6.1:

- [ ] Find your highest-volume prompts and check whether their prefixes actually repeat
- [ ] Identify one-off endpoints that pay cache writes without ever reading them back
- [ ] Compare measured hit rate with the ~21% break-even point
- [ ] Re-measure after every prompt change

## Bottom line

Caching still delivers the biggest saving in OpenAI pricing: **95% off** every cached input token on GPT-6.1 Sol and Terra. It's no longer free, though. A write costs 25% more than a normal input token, so a prefix that's never reused costs you extra. In return, a single reuse more than pays for the write, which makes the rule simple. Structure prompts so the prefix repeats, and don't cache what won't.

To model your workload, open the [calculator](/), pick a model and set the caching slider to your measured hit rate. Keep in mind that it doesn't add the write cost.

---

*Related reading: [OpenAI API Pricing Explained](/blog/openai-api-pricing-explained-2026) covers every OpenAI pricing dimension, including Batch and the over-272K long-context rate. [Claude API Pricing](/blog/claude-api-pricing-2026) covers Anthropic's caching.*

---
title: "Claude API Pricing in 2026: How Much Does Anthropic Cost?"
description: "Complete breakdown of Claude Opus 4.7 and Claude Haiku 4.5 API pricing, including Anthropic's aggressive prompt caching that can cut bills by 90%."
date: "2026-05-04"
author: "AI Cost Calc Team"
tags: ["anthropic", "claude", "pricing", "cost-optimization"]
readingTime: "8 min read"
featured: true
lastUpdated: "2026-05-12"
---

> **📊 Prices on this page are live** — pulled from the site's dataset at build time, last verified **{{updated}}**. Worked examples further down use fixed illustrative rates (stated inline) so the arithmetic stays checkable; the reference tables are always current.


Anthropic's Claude family has the most **complex** but also the **most rewarding** pricing structure in the LLM market. The headline numbers — {{price:claude-opus-4-7}} for Claude Opus 4.7 — make Claude look expensive next to GPT-5 mini or DeepSeek V3.2. But that's the wrong comparison.

The right question is: *what does Claude actually cost when you use it correctly?* And the answer can be **10× lower** than the headline rates if your workload is cache-friendly.

Here's how Claude's 2026 pricing works and where the leverage lives.

## Claude's 2026 lineup

| Model | Input ($/1M) | Output ($/1M) | Cached read | Context | Strengths |
|---|---|---|---|---|---|
| **Claude Opus 4.7** | {{in:claude-opus-4-7}} | {{out:claude-opus-4-7}} | {{cached:claude-opus-4-7}} | {{ctx:claude-opus-4-7}} | Deep reasoning, coding, long context |
| **Claude Haiku 4.5** | {{in:claude-haiku-4-5}} | {{out:claude-haiku-4-5}} | {{cached:claude-haiku-4-5}} | {{ctx:claude-haiku-4-5}} | Fast everyday tasks |

Note the **cache read prices** — these are the magic numbers.

## Anthropic's caching is different (and better)

Most providers (OpenAI, Gemini) implement caching as **automatic prefix matching**: if you happen to send the same prefix within a few minutes, it gets discounted. You have limited control.

Anthropic implemented caching as an **explicit, controllable system** with two prices:

- **Cache write**: 1.25× standard input rate ({{cache-write:claude-opus-4-7}}/1M for Opus, {{cache-write:claude-haiku-4-5}}/1M for Haiku)
- **Cache read**: **0.10× standard input rate** ({{cached:claude-opus-4-7}}/1M for Opus, {{cached:claude-haiku-4-5}}/1M for Haiku)

That cache read price is the key. **A cached read on Claude Opus 4.7 ({{cached:claude-opus-4-7}}/1M) now costs less than standard input on Claude Haiku 4.5 ({{in:claude-haiku-4-5}}/1M).** Translated: if you reuse cached prompts heavily, the frontier model is priced below the small one.

### How it works in practice

You explicitly mark portions of your prompt as cacheable:

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

The cache lasts ~5 minutes (refreshed on each hit). First call writes the cache (1.25× cost). Subsequent calls within the window read from cache (0.10× cost).

### When this matters: a worked example

The arithmetic below uses **illustrative round rates** — $5.00 input / $25.00 output per 1M,
with cache write at 1.25× input and cache read at 0.10× input. Real current rates are in the
table above (they are pulled live); this example is fixed so the numbers stay checkable.

Suppose you're building a code review agent that ships a 5,000-token system prompt + tool spec
on every call. You make 1,000 calls / day, averaging 1,000 output tokens.

**Without caching**:
- Input: 1,000 × 5,000 / 1M × $5.00 = $25.00/day
- Output: 1,000 × 1,000 / 1M × $25.00 = $25.00/day
- **Total: $50.00/day = $1,500/month**

**With caching** (95% hit rate after warmup, cache write $6.25/1M, cache read $0.50/1M):
- 5% cache writes: 1,000 × 5,000 × 0.05 / 1M × $6.25 = $1.56/day
- 95% cache reads: 1,000 × 5,000 × 0.95 / 1M × $0.50 = $2.38/day
- Output unchanged: $25.00/day
- **Total: $28.94/day = $868/month**

**Savings: ~$632/month, 42%.**

The 42% is the part worth remembering — it barely moves when prices change, because it is set by
your input/output ratio and hit rate, not by the absolute rate. Plug your own numbers into the
[calculator](/) for current pricing.

The savings are dramatic but bounded by output cost, which doesn't get cached. For input-heavy workloads (RAG, document analysis), the savings are even larger.

## Batch API: 50% off, simpler

Anthropic also offers a Batch API at standard 50% off:

| Model | Batch input / output per 1M |
|---|---|
| Claude Opus 4.7 | {{batch-pair:claude-opus-4-7}} |
| Claude Haiku 4.5 | {{batch-pair:claude-haiku-4-5}} |

Same model, same quality, half the price — but **24-hour turnaround**. The trade-off is identical to OpenAI's Batch API: only useful for non-realtime workloads.

## When Claude is worth it

Claude's pricing premium over GPT-5 mini ({{pair:gpt-5-mini}}) or Haiku 4.5 ({{pair:claude-haiku-4-5}}) is real. Here's when it's worth it:

### 1. Long context (>500K tokens)

Claude Opus 4.7's **1M token context** is the largest among major frontier models, with cleaner long-context performance than alternatives. If you're doing book-length analysis or whole-codebase review, the alternatives don't really compete.

### 2. Extended thinking on hard problems

Claude's extended thinking mode (where you give the model thinking budget) consistently outperforms competitors on multi-step reasoning, complex code refactors, and dense legal/medical analysis. The output cost is high — but for tasks where one good answer beats five mediocre ones, the math works.

### 3. Tool use reliability

Claude's tool-use behavior is exceptionally consistent — fewer hallucinated function calls, better adherence to schemas. For agent loops where errors compound, this matters.

### 4. Coding tasks

Anthropic has consistently led on coding benchmarks since Claude 3.5. If you're building a coding assistant, Claude is rarely the wrong call — and with caching on a stable system prompt, the cost gap to alternatives shrinks substantially.

## When Haiku 4.5 wins

For high-volume everyday tasks, Claude Haiku 4.5 is one of the best price/performance models in the market in 2026:

- {{price:claude-haiku-4-5}} (cheaper than GPT-5 mini's {{pair:gpt-5-mini}}? No — but stronger reasoning per dollar)
- **{{cached:claude-haiku-4-5}} cached input** — among the most aggressive cached rates of any frontier model
- Same 200K context as the small competition
- Vision support included
- Often beats GPT-5 mini on tasks requiring nuance

## Cost comparison: Claude vs alternatives

For a typical 1,000 input + 500 output token call:

| Model | Single-call cost | Notes |
|---|---|---|
| {{name:gpt-5-mini}} | {{call:gpt-5-mini}} | Cheapest competitive small |
| {{name:gemini-3-flash}} | {{call:gemini-3-flash}} | Good multimodal alternative |
| **{{name:claude-haiku-4-5}}** | {{call:claude-haiku-4-5}} | **Pricier than the small alternatives — caching is what makes up for it** |
| {{name:gpt-5-6}} | {{call:gpt-5-6}} | OpenAI flagship |
| {{name:gemini-3-1-pro}} | {{call:gemini-3-1-pro}} | Long-context option |
| **{{name:claude-opus-4-7}}** | {{call:claude-opus-4-7}} | **Frontier reasoning tier** |

Use the [calculator](/) to plug in your actual token mix and toggle caching to see how the numbers change.

## Practical optimization checklist

If you're running production Claude workloads:

1. **Mark stable prefixes as cacheable** with `cache_control` — this is non-negotiable for production
2. **Profile your cache hit rate** — if it's <70%, your prompts are probably mutating too much
3. **Use Haiku for first-pass classification**, escalate to Opus only when needed (a "router" pattern)
4. **Batch any non-realtime work** — analysis pipelines, data enrichment, content generation queues
5. **Bound output with stop sequences and max_tokens** — output is 5× more expensive than input, and ungenerated tokens are saved tokens

## Bottom line

Claude looks expensive on the pricing page and is expensive if you use it naively.

With caching enabled and prompts structured for cache hits, Claude Opus 4.7 can cost less per call than GPT-5.5 — and Haiku 4.5 with caching beats almost everything in its tier on cost-per-quality.

The leverage is real but it requires you to **architect for it**. If you're not measuring your cache hit rate, you're leaving 50%+ on the table.

Plug your workload into the [calculator](/) — toggle the caching slider and see the gap.

---

*Pricing reflects Anthropic's published rates as of May 2026. Verify with [Anthropic's pricing page](https://www.anthropic.com/pricing) before committing budget.*

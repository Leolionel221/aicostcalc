<div align="center">

# AI API Cost Calculator

**Calculate and compare API pricing across 40+ LLMs — including caching and Batch API discounts. Prices reconciled daily.**

[![Live: aicostcalc.net](https://img.shields.io/badge/live-aicostcalc.net-2563eb?style=flat-square)](https://aicostcalc.net)
[![Next.js 16](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind v4](https://img.shields.io/badge/Tailwind-v4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

[**🌐 Live demo →**](https://aicostcalc.net) &nbsp;·&nbsp; [**📝 Blog**](https://aicostcalc.net/blog) &nbsp;·&nbsp; [**📊 Compare models**](https://aicostcalc.net/#compare) &nbsp;·&nbsp; [**📈 Price changes**](https://aicostcalc.net/changes) &nbsp;·&nbsp; [**🔌 Free API**](https://aicostcalc.net/api)

![AI API Cost Calculator](https://aicostcalc.net/opengraph-image)

</div>

---

## Why this exists

AI API pricing has become genuinely complex. Beyond headline input/output rates, modern providers offer:

- **Prompt caching** — often 10× cheaper than standard input
- **Batch API** — typically 50% off for non-realtime workloads
- **Vision tokens** — image-based pricing
- **Reasoning tokens** — separate pricing for o1/o3-style chain-of-thought
- **Fine-tuned models** — different pricing tier

A simple "$X per 1M tokens" calculation now misses most of the real cost picture. **For a typical RAG application, naive cost calculations can be 5-10× off from the actual bill.**

This tool surfaces all of those dimensions in one place — so you see what you'd actually pay, not what marketing pages imply.

## Features

- 🧮 **Real-time calculator** with input/output token fields and 5-currency display (USD / CNY / EUR / GBP / INR)
- 🔬 **Caching slider** — model what % of your prompt is cached, see real impact
- ⚡ **Batch API toggle** — instant 50% discount preview
- 📊 **Three-column comparison** — Standard / With Caching / With Batch side-by-side, with savings highlighted
- 🔎 **Fuzzy model search** — type "opus" or "g6 luna"; models grouped by provider, newest first
- 🏆 **Multi-model table** — every model ranked by cost, sortable by 5 dimensions, filter by provider
- 📅 **Monthly forecast** — multi-model bar chart with savings callout
- 🎯 **Scenario templates** — 6 use cases (chatbot / code assistant / RAG / etc.) with one-click setup
- 📈 **Price change log** — every new model and price move at [`/changes`](https://aicostcalc.net/changes), with an [RSS feed](https://aicostcalc.net/changes/rss.xml)
- 🌙 **Dark mode** — system / light / dark
- 🔍 **Exact tokenization** for OpenAI models via `js-tiktoken`; transparent estimates for others (clearly labeled)

## Models supported

40+ models from OpenAI, Anthropic, Google, DeepSeek, xAI and Mistral — the current GPT-6, Claude 5.x, Gemini 3.x, DeepSeek V4 and Grok 4.x lines plus the older models people still run in production. New models are added automatically the day they appear in the [LiteLLM registry](https://github.com/BerriAI/litellm).

The live list is always at [`/api/v1/models`](https://aicostcalc.net/api/v1/models) rather than in this README, so it can't go stale.

Each model has a dedicated landing page — e.g. [`/gpt-6-sol-cost-calculator`](https://aicostcalc.net/gpt-6-sol-cost-calculator), [`/claude-opus-5-5-cost-calculator`](https://aicostcalc.net/claude-opus-5-5-cost-calculator).

## Reading list

In-depth content on AI API pricing:

- [OpenAI API Pricing Explained: Complete Guide for 2026](https://aicostcalc.net/blog/openai-api-pricing-explained-2026)
- [Claude API Pricing in 2026: How Much Does Anthropic Cost?](https://aicostcalc.net/blog/claude-api-pricing-2026)
- [Top 10 Cheapest AI APIs in 2026 (Ranked by Real Cost)](https://aicostcalc.net/blog/top-10-cheapest-ai-apis-2026)
- [How to Calculate Token Cost: A Beginner's Guide](https://aicostcalc.net/blog/how-to-calculate-token-cost-beginner-guide)
- [GPT-5.5 vs Claude Opus 4.7: Cost & Performance Comparison](https://aicostcalc.net/blog/gpt-5-5-vs-claude-opus-4-7-comparison)
- [OpenAI Prompt Caching: When Is It Worth It?](https://aicostcalc.net/blog/openai-prompt-caching-when-worth-it)

## Public API (free, no auth)

This project exposes a free JSON API for the same model pricing data. No authentication, no rate limits for normal use, CORS-enabled, CDN-cached.

```bash
# All models
curl https://aicostcalc.net/api/v1/models

# Single model
curl https://aicostcalc.net/api/v1/models/gpt-6-sol

# Lightweight pricing only, with lifecycle status
curl "https://aicostcalc.net/api/v1/pricing?provider=anthropic"

# Price changes and new models since a date
curl "https://aicostcalc.net/api/v1/changes?since=2026-09-01"
```

Schema 2.1, versioned: list responses carry `schemaVersion` and `lastUpdated` (the date the pricing data last changed).

Full documentation: [aicostcalc.net/api](https://aicostcalc.net/api)

The data is MIT licensed. Build dashboards, bots, browser extensions, FinOps tools — whatever helps you understand AI API costs. If you build something cool, [open a GitHub issue](https://github.com/Leolionel221/aicostcalc/issues/new?title=Built+with+aicostcalc+API&labels=showcase) — we'll feature it.

## Tech stack

| Layer | Choice |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router, SSG) |
| Language | TypeScript 5 |
| UI | [Tailwind CSS v4](https://tailwindcss.com) + custom shadcn-style components on [Radix](https://www.radix-ui.com) primitives |
| Icons | [Lucide](https://lucide.dev) |
| Theming | [next-themes](https://github.com/pacocoursey/next-themes) |
| i18n | [next-intl](https://next-intl-docs.vercel.app) (routing planned for V1.1) |
| Tokenizer | [js-tiktoken](https://github.com/dqbd/tiktoken) for OpenAI; character-ratio approximation for others |
| Testing | [Vitest](https://vitest.dev) + [React Testing Library](https://testing-library.com/react) |
| Hosting | [Vercel](https://vercel.com) |
| Domain | [Cloudflare](https://www.cloudflare.com) Registrar + DNS |
| Analytics | Google Analytics 4 (typed event helper at `lib/analytics.ts`) |

## Quick start

```bash
git clone https://github.com/Leolionel221/aicostcalc.git
cd aicostcalc
npm install
npm run dev
# → http://localhost:3000
```

Available scripts:

```bash
npm run dev           # development server with hot reload
npm run build         # production build (SSG)
npm run start         # serve production build locally
npm run type-check    # TypeScript check (no emit)
npm run lint          # ESLint
npm test              # run unit tests once
npm run test:watch    # watch mode for tests
npm run test:coverage # coverage report
```

## Project structure

```
.
├── app/
│   ├── [slug]/                   # Per-model landing pages (SSG)
│   ├── blog/[slug]/              # Markdown blog posts
│   ├── api/v1/                   # Public JSON API (models, pricing, changes)
│   ├── changes/                  # Price change log + RSS feed
│   ├── about | privacy | terms | contact
│   ├── icon.tsx                  # Generated favicon
│   ├── apple-icon.tsx            # Generated Apple touch icon
│   ├── opengraph-image.tsx       # Generated OG image
│   ├── sitemap.ts                # Auto sitemap from data
│   └── robots.ts                 # robots.txt
├── components/
│   ├── Calculator.tsx            # Main calculator with Advanced Options
│   ├── CostComparison.tsx        # Three-column comparison
│   ├── ModelComparison.tsx       # Sortable, filterable model table
│   ├── MonthlyEstimator.tsx      # Volume forecast with bar chart
│   ├── ScenarioTemplates.tsx     # 6 use-case presets
│   ├── ModelPricingTable.tsx     # Detailed pricing table per model
│   ├── ModelFAQ.tsx              # Auto-generated FAQ per model
│   ├── Logo.tsx                  # Brand mark
│   ├── Nav.tsx | Footer.tsx | ThemeToggle.tsx
│   └── ui/                       # Radix-backed primitives
├── content/blog/                 # Markdown articles with frontmatter
├── data/
│   ├── models.json               # Single source of truth for pricing (schema 2.1)
│   ├── currencies.json           # Static exchange rates
│   └── scenarios.json            # Use-case template definitions
├── lib/
│   ├── calculator.ts             # Cost math (standard / cached / batch / monthly)
│   ├── tokenizer.ts              # tiktoken + approximation
│   ├── currency.ts               # Format / convert
│   ├── analytics.ts              # Typed GA4 event helper
│   ├── seo.ts                    # Metadata + JSON-LD generators
│   ├── blog.ts                   # Markdown rendering pipeline
│   └── types.ts                  # Schema TypeScript types
├── messages/                     # i18n strings (en, zh)
└── docs/                         # Original PRD + supplement
```

## How accuracy is maintained

- **Daily reconciliation.** A [GitHub Actions workflow](.github/workflows/sync-prices.yml) checks every price in `data/models.json` against the LiteLLM registry each day at 06:15 UTC and commits any change, which redeploys the site. Every change is recorded in the model's `priceHistory` and shows up on [`/changes`](https://aicostcalc.net/changes).
- **Safety rails.** A price that moves more than 60% in one day is quarantined for a human to look at instead of being published; the rest of the run still goes through.
- **New models** are drafted automatically from the registry and marked as drafts on their page until reviewed.
- **Search engines are told immediately** — successful production deploys push the changed pages to [IndexNow](https://www.indexnow.org).
- **Tokenization** uses official `tiktoken` encoders for OpenAI models (exact). Other providers use character-ratio approximation, clearly labeled "≈ Estimated" in the UI.
- **All prices are USD** at source — non-USD currencies use static rates. Display includes `~` prefix and disclaimer for non-USD.
- **Disclaimer**: providers can change prices without notice, and the registry can lag the provider by a day or two. For business decisions, always verify against the provider's official pricing page.

## Contributing

Pricing corrections, new models, and feature ideas are welcome:

- **Stale or wrong pricing** → open an issue with the model, the wrong figure, and a link to the official page. Fix typically deploys within 24h.
- **New models** → usually added automatically within a day of appearing in LiteLLM. If one is missing, open an issue.
- **Code improvements / new features** → open an issue first to discuss scope.
- **Translations** → `messages/zh.json` is partial; full Chinese routing is V1.1.

For substantial changes, please discuss in an issue before opening a PR.

## Roadmap

- Shareable calculator links (inputs encoded in the URL)
- Vision and reasoning-token pricing
- Multi-language routing

## Documentation

- [`HANDOVER.md`](./HANDOVER.md) — comprehensive project handover doc (stack, conventions, decisions, changelog)
- [`docs/AI_API_Cost_Calculator_PRD.pdf`](./docs) — original product requirements doc (v1.0)
- [`docs/PRD_v1.1_Supplement.md`](./docs/PRD_v1.1_Supplement.md) — product decisions supplement

## Trademark notice

Provider names (OpenAI, Anthropic, Google, DeepSeek, xAI, Mistral) and their logos are trademarks of their respective owners. This project is not affiliated with, endorsed by, or sponsored by any AI provider. References to specific models exist solely for descriptive identification and price comparison.

## License

[MIT](LICENSE) — free to use, fork, modify, and ship.

---

<div align="center">

Built with ☕ and [Claude](https://claude.com).

If this saved you money on your AI bill, [⭐ star the repo](https://github.com/Leolionel221/aicostcalc) — it helps with discovery.

</div>

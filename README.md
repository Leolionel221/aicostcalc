<div align="center">

# AI API Cost Calculator

**Calculate and compare API pricing across 10+ LLMs — including caching and Batch API discounts.**

[![Live: aicostcalc.net](https://img.shields.io/badge/live-aicostcalc.net-2563eb?style=flat-square)](https://aicostcalc.net)
[![Next.js 16](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind v4](https://img.shields.io/badge/Tailwind-v4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

[**🌐 Live demo →**](https://aicostcalc.net) &nbsp;·&nbsp; [**📝 Blog**](https://aicostcalc.net/blog) &nbsp;·&nbsp; [**📊 Compare models**](https://aicostcalc.net/#compare)

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
- 🏆 **Multi-model table** — all 10 models ranked by cost, sortable by 5 dimensions, filter by provider
- 📅 **Monthly forecast** — multi-model bar chart with savings callout
- 🎯 **Scenario templates** — 6 use cases (chatbot / code assistant / RAG / etc.) with one-click setup
- 🌙 **Dark mode** — system / light / dark
- 🔍 **Exact tokenization** for OpenAI models via `js-tiktoken`; transparent estimates for others (clearly labeled)

## Models supported

10 models from 6 providers, refreshed monthly:

| Provider | Models |
|---|---|
| **OpenAI** | GPT-5.5, GPT-5 mini, o4-mini |
| **Anthropic** | Claude Opus 4.7, Claude Haiku 4.5 |
| **Google** | Gemini 3.0 Pro, Gemini 3.0 Flash |
| **DeepSeek** | DeepSeek V4 |
| **xAI** | Grok 4 |
| **Mistral** | Mistral Large 3 |

Each model also has a dedicated landing page — e.g. [`/gpt-5-5-cost-calculator`](https://aicostcalc.net/gpt-5-5-cost-calculator), [`/claude-opus-4-7-cost-calculator`](https://aicostcalc.net/claude-opus-4-7-cost-calculator).

## Reading list

In-depth content on AI API pricing:

- [OpenAI API Pricing Explained: Complete Guide for 2026](https://aicostcalc.net/blog/openai-api-pricing-explained-2026)
- [Claude API Pricing in 2026: How Much Does Anthropic Cost?](https://aicostcalc.net/blog/claude-api-pricing-2026)
- [Top 10 Cheapest AI APIs in 2026 (Ranked by Real Cost)](https://aicostcalc.net/blog/top-10-cheapest-ai-apis-2026)
- [How to Calculate Token Cost: A Beginner's Guide](https://aicostcalc.net/blog/how-to-calculate-token-cost-beginner-guide)
- [GPT-5.5 vs Claude Opus 4.7: Cost & Performance Comparison](https://aicostcalc.net/blog/gpt-5-5-vs-claude-opus-4-7-comparison)

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
│   ├── models.json               # Single source of truth for pricing (Schema v2)
│   ├── currencies.json           # Static exchange rates
│   └── scenarios.json            # Use-case template definitions
├── lib/
│   ├── calculator.ts             # Cost math (standard / cached / batch / monthly)
│   ├── tokenizer.ts              # tiktoken + approximation
│   ├── currency.ts               # Format / convert
│   ├── analytics.ts              # Typed GA4 event helper
│   ├── seo.ts                    # Metadata + JSON-LD generators
│   ├── blog.ts                   # Markdown rendering pipeline
│   └── types.ts                  # Schema v2 TypeScript types
├── messages/                     # i18n strings (en, zh)
└── docs/                         # Original PRD + supplement
```

## How accuracy is maintained

- **Pricing data** (`data/models.json`) is verified against each provider's official pricing page on the 1st of each month. Each model entry includes a `lastVerified` date.
- **Tokenization** uses official `tiktoken` encoders for OpenAI models (exact). Other providers use character-ratio approximation, clearly labeled "≈ Estimated" in the UI.
- **All prices are USD** at source — non-USD currencies use static rates also updated monthly. Display includes `~` prefix and disclaimer for non-USD.
- **Disclaimer**: AI providers update pricing without notice. There may be a lag between such changes and updates here. For business decisions, always verify against the provider's official pricing page.

## Contributing

Pricing corrections, new models, and feature ideas are welcome:

- **Stale or wrong pricing** → open an issue with the model, the wrong figure, and a link to the official page. Fix typically deploys within 24h.
- **New models** → submit a PR adding an entry to `data/models.json` following the Schema v2 structure (see `lib/types.ts`).
- **Code improvements / new features** → open an issue first to discuss scope.
- **Translations** → `messages/zh.json` is partial; full Chinese routing is V1.1.

For substantial changes, please discuss in an issue before opening a PR.

## Roadmap

See [HANDOVER.md §10](./HANDOVER.md#10-当前开发进度) for the detailed development progress and roadmap. High-level next steps:

- **Q2 2026**: Vision pricing, F-share (URL-encoded deep links + image export), public JSON API endpoint
- **Q3 2026**: Reasoning tokens, multi-language routing, scenario templates V2
- **Q4 2026**: Live exchange rates, A/B testing infrastructure

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

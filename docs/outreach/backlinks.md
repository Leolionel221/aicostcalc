# 外链投稿记录

GSC 2026-10-04：外部链接 **0**。这份文件既是投稿草稿，也是跟踪表——投完一个就改状态。

> 说实话：GitHub README 里的链接是 `nofollow`，不直接传权重。价值在于
> ① 被真人发现、点进来（awesome 列表有稳定的开发者流量）；② 被抓取后搜索引擎
> 能更快发现站点；③ 别的博客/列表常从 awesome 列表里抄条目，那时才可能变成 dofollow。

## 跟踪表

| # | 目标 | 方式 | 状态 | 链接 |
|---|---|---|---|---|
| 1 | pleasedodisturb/awesome-llm-token-optimization · Pricing Comparison → Live Pricing Tools | PR | 已提交 2026-10-04，等审核（首次贡献者，lint CI 需维护者批准才跑） | [PR #58](https://github.com/pleasedodisturb/awesome-llm-token-optimization/pull/58) |
| 2 | foss42/awesome-generative-ai-apis · Other AI Tools | 先 Issue，后 PR | Issue 已开 2026-10-04，有回应后提 PR | [Issue #472](https://github.com/foss42/awesome-generative-ai-apis/issues/472) |
| 3 | taishi-i/awesome-ChatGPT-repositories · Others | PR | 已提交 2026-10-04，等审核 | [PR #255](https://github.com/taishi-i/awesome-ChatGPT-repositories/pull/255) |

**排除：**
- InftyAI/Awesome-LLMOps：条目强制带 Stars/Contributors 徽章，我们 2 星 1 贡献者，摆上去反而难看，维护者大概率拒。等星数上来再说。
- ai-collection：收录 **$19**，且只收 AI 应用，不对口。
- webfuse-com/awesome-claude：0 合并，100 个积压 PR。

---

## 1. awesome-llm-token-optimization

**为什么投它：** "Pricing Comparison" 一节就是我们的同类（Price Per Token、Simon Willison、Helicone…），读者正是目标用户。规则允许作者自荐，要求托管工具给出**可核查**的维护证据。

**放置：** `### Live Pricing Tools`。该节实际并非严格字母序（Price Per Token 在最前），我们放在 `Artificial Analysis Calculator` 前面，PR 里说明。

**条目：**

```markdown
- [AI API Cost Calculator](https://aicostcalc.net/) - 40+ models with cache and Batch API pricing, reconciled daily against the LiteLLM registry, with a public price-change log, RSS and free JSON API.
```

**PR 标题：** `Add AI API Cost Calculator to Pricing Comparison`

**PR 描述：**

```markdown
## What you're adding

- [AI API Cost Calculator](https://aicostcalc.net/) - 40+ models with cache and Batch API pricing, reconciled daily against the LiteLLM registry, with a public price-change log, RSS and free JSON API.

It belongs next to the other live pricing tools: it prices the cached-input and Batch API rates that most per-token comparisons skip, which is where most of the savings in this list come from.

## Evidence it's used and maintained

- **Public changelog:** every new model and price move, newest first — https://aicostcalc.net/changes (RSS: https://aicostcalc.net/changes/rss.xml)
- **Versioned data feed:** free JSON API, schema 2.1, no auth — https://aicostcalc.net/api/v1/changes and https://aicostcalc.net/api (docs)
- **Daily reconciliation, in public:** https://github.com/Leolionel221/aicostcalc/actions/workflows/sync-prices.yml — runs every day at 06:15 UTC; the last 30 runs all passed. New models are listed the day they appear in LiteLLM (e.g. GPT-6.1 Sol).
- Source is MIT: https://github.com/Leolionel221/aicostcalc

## Disclosure

- [x] I'm the author of, or affiliated with, this project
- [ ] No affiliation

---

- [x] One entry, in the correct section, alphabetically placed (the section isn't strictly sorted; placed among the "A" entries, before Artificial Analysis)
- [x] Description is one sentence and ends with a period
- [x] Link works and has no affiliate or tracking parameters

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

---

## 2. foss42/awesome-generative-ai-apis

**为什么投它：** 这是"生成式 AI **API**"列表，我们本身就有免费 API，比当成网页工具更对口。规则：先开 Issue，再提 PR。

**Issue 标题：** `Add AI API Cost Calculator — free LLM pricing API`

**Issue 正文：**

```markdown
I'd like to add a free, no-auth JSON API for LLM API prices to **Other AI Tools**.

- Homepage: https://aicostcalc.net
- Docs: https://aicostcalc.net/api
- What it returns: input, output, cached-input and Batch API prices, context limits and lifecycle status (active/deprecated, successor) for 40+ models from OpenAI, Anthropic, Google, DeepSeek, xAI and Mistral, plus a feed of price changes and new models (`/api/v1/changes`).
- Maintenance: reconciled daily against the LiteLLM registry by a public GitHub Actions workflow; data and code are MIT.

Disclosure: I maintain it. If this fits, I'll open a PR with the row below.

| [AI API Cost Calculator](https://aicostcalc.net) | [Link](https://aicostcalc.net/api) | Free, no-auth JSON API with input, output, cached and Batch prices for 40+ LLMs, reconciled daily. Includes a price-change feed |
```

**PR（Issue 有回应后）：** 在 `## Other AI Tools` 表格里按字母序插在第一行（`GEOScore` 之前），内容即上面那一行。PR 描述写 `Closes #<issue 号>`。

---

## 3. taishi-i/awesome-ChatGPT-repositories

**为什么投它：** 3.3k 星，合并很勤（9 月底几乎每天都有合并），只收 GitHub 仓库——我们是 MIT 开源，符合。维护者会自动同步到各语言版本，只改 README.md。

**放置：** `## Others` 末尾。

**条目：**

```markdown
 * [aicostcalc](https://github.com/Leolionel221/aicostcalc) - Calculator and free JSON API for 40+ LLM API prices, including cache and Batch discounts, reconciled daily against LiteLLM.
```

**PR 标题：** `Add aicostcalc to Others`

**PR 描述：**

```markdown
Adds [aicostcalc](https://github.com/Leolionel221/aicostcalc) to **Others**: an MIT-licensed calculator and free JSON API for OpenAI, Anthropic, Google, DeepSeek, xAI and Mistral API prices, kept current by a daily GitHub Actions sync against the LiteLLM registry. Live at https://aicostcalc.net.

Disclosure: I'm the author.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

---

## 投稿前顺手要做

- 仓库简介已于 2026-10-04 改为：`Free calculator + JSON API for 40+ LLM API prices (cache & Batch discounts), reconciled daily against LiteLLM.`
- README 已于 2026-10-04 更新为当前状态。

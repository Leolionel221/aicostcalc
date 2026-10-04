# 社区发帖稿（Show HN / Reddit）

目的：补上"有人在用"的公开证据（外链投稿时被卡的那一条），并带来第一批真实用户。
都要用**你本人的账号**发——这是你的项目，平台也要求作者本人发帖。

## 发帖前检查（都已完成 ✅）

- ✅ 计算结果可分享链接（2026-10-04 上线）：读者能把自己的配置发给别人
- ✅ README / 仓库简介已更新为当前状态
- ✅ 修掉了 DeepSeek V3.2 / V4-Flash 缓存价缺失（会被内行一眼挑出来）
- ✅ 修掉了 Gemini 3.1 Flash Lite 简介里的 "250¢" 笔误

## 时间

**Show HN：周二 10 月 6 日 北京时间 21:00**（美东 9:00）。HN 在美国工作日上午流量最高，
周末发帖容易沉。Reddit 可以错开，周三或周四同一时段。

**同一天不要两个都发**：发完 HN 后要守着回复评论 2–3 小时，这比帖子本身更重要。

## 规矩（违反了会被降权或封号）

- 不要让朋友/群里的人去点赞，HN 和 Reddit 都会识别投票圈，直接沉帖
- 不要在帖子里放联盟链接；页面上本来就有（已标注），帖子里如实说明即可
- 评论里有人批评就承认、修、回复"已修"，不要辩解——HN 最看重这个

---

## Show HN

**标题**（HN 限 80 字符，这条 77）：

```
Show HN: LLM API cost calculator that reconciles prices daily, with a free API
```

**URL：** `https://aicostcalc.net`

（URL 帖不填正文。发完立刻在自己的帖子下发第一条评论，内容如下。）

**第一条评论：**

```
Hi HN, I built this because comparing LLM API prices kept giving me the wrong answer. The headline input/output rate is only part of the bill: cached input is often 90%+ cheaper, Batch is 50% off, and the ranking of "cheapest model" changes once you account for them.

Example: a 20K-token prompt that's 80% cached. DeepSeek V4-Flash goes from the 6th cheapest model on the list to the 4th, and the call costs about 71% less than the list price suggests: https://aicostcalc.net/?model=deepseek-v4-flash&in=20000&cache=80

How it stays current: a GitHub Actions job reconciles every price against the LiteLLM registry each morning and commits any change. A price that moves more than 60% in a day is held for a human instead of published. New models get a page the day they show up in the registry, marked as a draft until someone reads it. Every change is logged at /changes (with RSS).

While preparing this post I found a bug in that job: it only updated cached prices that already existed, so two DeepSeek models had no cache price for months even though the registry had one. Fixed today, but it's a good reminder that "automated" isn't the same as "correct" — if you spot a wrong number, there's a report link on every model page.

The same data is a free JSON API, no key, CORS on: https://aicostcalc.net/api (MIT, source on GitHub).

Known limits: token counts are exact for OpenAI (tiktoken) and estimated for everyone else; the registry can lag a provider by a day or two; and there are affiliate links on some pages, which is how I'm hoping to cover hosting.

I'd love feedback on what's missing — especially which workloads you'd want as presets.
```

> 要不要提"用 Claude Code 写的"：README 末尾已经写了 "Built with Claude"。帖子里不必主动提；
> 如果有人问，直接承认，并说明数据和校验逻辑是你在把关。

---

## Reddit

**发哪里：**
- **r/SideProject**：专门给个人项目自我介绍的版块，最安全。
- **r/LLMDevs**：目标用户最集中；**发之前先看版块侧栏规则**——很多 AI 版块限制自我推广
  （常见要求：只在指定日期发、必须加 flair、账号要有一定 karma）。我没法替你读（Reddit 屏蔽了我的访问）。
- 不建议 r/LocalLLaMA：那里讨论本地部署，API 价格计算器偏题，容易被删。

**标题：**

```
I built a free LLM API cost calculator that re-checks prices every day (and a free JSON API for the data)
```

**正文：**

```
I kept getting LLM cost comparisons wrong because I only looked at input/output prices. Once you add prompt caching (often 90%+ off cached input) and Batch (50% off), the "cheapest model" ranking changes.

So I made https://aicostcalc.net:

- 40+ models from OpenAI, Anthropic, Google, DeepSeek, xAI and Mistral
- Caching and Batch discounts built into the calculator, and you can share a link to any calculation
- Prices are reconciled daily against the LiteLLM registry by a public GitHub Action; every change is logged at aicostcalc.net/changes (RSS too)
- Free JSON API, no key: aicostcalc.net/api

Example — a 20K-token prompt, 80% cached, on DeepSeek V4-Flash costs about 71% less than the list price suggests: https://aicostcalc.net/?model=deepseek-v4-flash&in=20000&cache=80

It's free and MIT licensed. Some pages have affiliate links (labelled), which is how I hope to cover hosting.

What would make this more useful for you? I'm especially curious which workloads you'd want as presets.
```

---

## 发完之后

- 把帖子链接发给我，我记进跟踪表，并在外链 PR（#58 等）里补一句"已有公开讨论"作为使用证据
- 24 小时后看 GA4：`shared_link_opened`、`share_link_copied` 两个新事件能直接看出有没有人在转发

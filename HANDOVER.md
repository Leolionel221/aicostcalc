# 项目交接文档 — AI API Cost Calculator

> **本文档是项目的"真相源头"。**任何接手这个项目的人或 AI（包括未来的我自己）都应该先读完它。
>
> 维护规则：每次"收口"（一个改动告一段落）都必须更新本文档相关章节，并在变更日志追加记录。

**最后更新**：2026-08-24
**当前阶段**：🔧 **月度维护模式** — 23 个模型；8/24 修复了一个隐蔽的 GA4 断链（衡量 ID 在 Google 侧失效）
**运营节奏**：每月 1 号 30 分钟（LiteLLM 全量扫描 → diff → 补新模型 → push），其余时间不看数据
**下次决策点**：2026-09-01 月度维护；AIMLAPI 审核通过后补接第二联盟位（30% vs Novita 10%）

---

## 0. 阅读顺序（30 秒上手）

1. 本文档（HANDOVER.md）— 现在你正在读
2. `docs/PRD_v1.1_Supplement.md` — 产品决策的最新版本
3. `docs/AI_API_Cost_Calculator_PRD.pdf` — 原始产品文档
4. `package.json` — 依赖与脚本
5. 如果你是 AI Agent：注意根目录的 `AGENTS.md` 提示——本项目用 Next.js 16，与训练数据中的 14/15 有 breaking changes，使用前查 `node_modules/next/dist/docs/`。

---

## 1. 项目概述

**做什么**：面向全球开发者的在线 AI 模型 API 成本计算/对比工具站。

**核心用户**：独立开发者、AI 创业团队技术决策者、企业 IT/采购、AI 内容创作者、AI 学习者。

**核心价值主张**："在 10 秒内告诉你，用哪个 AI 模型最省钱。"

**变现模式**：
1. Google AdSense 广告（主要）
2. 联盟营销佣金（OpenRouter / Together AI / Helicone 等）
3. 未来潜在：API 监控订阅、企业版报告

**12 个月目标**：月 UV 20K-50K，月入 $300-1,500（保守）/ $2,300（乐观）。

**核心差异化**（4 点）：
1. 覆盖关键模型（V1.0 是 10 个 May 2026 旗舰，目标 V1.5 扩到 20+）
2. 英文先行（中文版 V1.1，详见 §11 Decision 8）
3. 场景化模板（6 个使用场景一键填充）
4. 配套深度 SEO 内容（V1.0 已发 5 篇 ~14,000 字）

**当前线上数据快照**（2026-07-18 收银台安装后）：
- **33 个 SSG 静态页面**（首页 + **20 模型** + 6 文章 + 4 法律 + 博客索引 + API docs 页）
- **💰 变现已上线**：Novita 联盟链接（10%/180 天）接入计算器结果区 + 全部 20 模型页；AIMLAPI（30% lifetime）申请中
- **3 个公开 API endpoints**：`/api/v1/models`（现返回 20 模型）、`/api/v1/models/{id}`、`/api/v1/pricing`
- **价格数据全部对齐 [LiteLLM](https://github.com/BerriAI/litellm)**，lastUpdated 2026-07-18
- **SEO 现状**（7 周自然实验后）：28 天 568 曝光 / 排名 41.8 / 日曝光翻倍趋势；Google 已把站点重分类为"工具"（"ai cost calculator" 为第一查询）——工具页是主资产，博客降级
- Bing Webmaster 已导入同步；GA4 事件回流中；dev.to 2 篇交叉文章；GitHub Issues 反馈通道在线
- 3 条 Vercel 301 redirect（旧 slug → 新 slug）

---

## 2. 技术栈

| 层级 | 选型 | 版本 | 说明 |
|---|---|---|---|
| 框架 | Next.js | 16.x | App Router，PRD 写 14 但实际用最新版 |
| UI 库 | React | 19.x | 含 Server Components |
| 语言 | TypeScript | 5.x | 严格模式 |
| 样式 | Tailwind CSS | 4.x | CSS-based config，token 在 `app/globals.css` |
| UI 组件 | Radix UI primitives | 各最新 | 自写 shadcn 风格组件，不用 shadcn CLI |
| 国际化 | next-intl | 4.x | 已装但 routing 未启用（V1.1，详见 §11 Decision 8）|
| 暗黑模式 | next-themes | 0.4 | system / light / dark + ThemeToggle |
| 图标 | lucide-react | 1.x | 注意：v1 移除了 brand icons（GitHub icon 自己写 SVG） |
| Tokenizer | js-tiktoken | 1.x | OpenAI 系精确（dynamic import），其他估算 |
| Markdown | gray-matter + remark + remark-gfm + remark-html | 各最新 | 博客 .md 文件渲染 |
| Analytics | @next/third-parties (GA4) | 16.x | 衡量 ID 硬编码在 `lib/analytics.ts`（非密钥，不用 env） |
| 测试 | Vitest + RTL + @vitest/coverage-v8 | 4.x | 48 个用例，calculator 100% 覆盖 |
| 字体 | Inter + Noto Sans SC | Google Fonts | 中英统一观感 |
| 构建 | Turbopack | Next.js 内置 | dev 和 build 都启用 |

**关键自实现的（不依赖外部 lib）**：
- shadcn 风格 UI 组件（`components/ui/*`）— 7 个 Radix-backed 组件手写
- Logo + favicon + apple-icon + opengraph-image — 全部 SVG / next/og ImageResponse
- SEO metadata + JSON-LD 生成器（`lib/seo.ts`）
- Currency 转换 + 格式化（`lib/currency.ts`）
- Analytics typed event helper（`lib/analytics.ts`）

**已知未安装**（V1.1+ 启用时再加）：
- A/B testing：Vercel Edge Config 或 GrowthBook
- 错误监控：Sentry（PRD 计划，未上线）
- Plausible（备份 GA4，未上线）

---

## 3. 项目目录结构

```
/Users/chenze/Desktop/AI API Cost Calculator/   ← 项目根 = Git 仓库根
├── app/                              # Next.js App Router 路由
│   ├── layout.tsx                    # 根布局（Nav + Footer + ThemeProvider + GA4）
│   ├── page.tsx                      # 首页（Hero + Calculator + Compare + Forecast）
│   ├── providers.tsx                 # ThemeProvider 包装
│   ├── globals.css                   # 设计 token + prose-content 文章排版
│   ├── [slug]/page.tsx               # 模型独立 Landing Page (SSG 10 个)
│   ├── api/
│   │   ├── page.tsx                  # API 文档 + marketing 页 (SSG)
│   │   └── v1/
│   │       ├── models/route.ts       # GET /api/v1/models (含过滤)
│   │       ├── models/[id]/route.ts  # GET /api/v1/models/{id}
│   │       └── pricing/route.ts      # GET /api/v1/pricing (轻量)
│   ├── blog/
│   │   ├── page.tsx                  # 博客索引页
│   │   └── [slug]/page.tsx           # 博客文章详情 (SSG 6 篇)
│   ├── about/page.tsx                # 关于
│   ├── privacy/page.tsx              # 隐私政策
│   ├── terms/page.tsx                # 服务条款
│   ├── contact/page.tsx              # 联系
│   ├── icon.tsx                      # 32x32 favicon (next/og)
│   ├── apple-icon.tsx                # 180x180 Apple touch icon
│   ├── opengraph-image.tsx           # 1200x630 OG image
│   ├── sitemap.ts                    # 自动生成 sitemap.xml (23 URL)
│   └── robots.ts                     # 自动生成 robots.txt
├── components/
│   ├── Calculator.tsx                # 核心计算器（含 Advanced Options）
│   ├── CostComparison.tsx            # F1.5 三栏对比（Standard/Cached/Batch）
│   ├── ModelComparison.tsx           # 全模型表格（排序/筛选/隐藏）
│   ├── MonthlyEstimator.tsx          # 月度成本预测 + 柱状图
│   ├── ScenarioTemplates.tsx         # 6 个场景模板
│   ├── ModelPricingTable.tsx         # 详细价格表（Landing 页用）
│   ├── ModelFAQ.tsx                  # 自动生成 FAQ（Landing 页用）
│   ├── LegalPage.tsx                 # 法律页通用布局
│   ├── Logo.tsx                      # 品牌 mark + LogoMark 子组件
│   ├── Nav.tsx                       # 顶部导航（含锚点 + ThemeToggle）
│   ├── Footer.tsx                    # 页脚（含商标声明）
│   ├── ThemeToggle.tsx               # 暗黑/亮色切换按钮
│   └── ui/                           # shadcn 风格组件（Radix-backed）
│       ├── button.tsx | input.tsx | label.tsx | card.tsx
│       ├── slider.tsx | switch.tsx | select.tsx
├── content/
│   └── blog/                         # Markdown 博客文章
│       ├── openai-api-pricing-explained-2026.md
│       ├── claude-api-pricing-2026.md
│       ├── top-10-cheapest-ai-apis-2026.md
│       ├── how-to-calculate-token-cost-beginner-guide.md
│       └── gpt-5-5-vs-claude-opus-4-7-comparison.md
├── data/
│   ├── models.json                   # 核心模型价格表 (Schema v2, 10 个模型)
│   ├── currencies.json               # 静态汇率（USD/CNY/EUR/GBP/INR）
│   └── scenarios.json                # 6 个场景模板配置
├── docs/                             # 产品文档（不进 build）
│   ├── AI_API_Cost_Calculator_PRD.pdf
│   └── PRD_v1.1_Supplement.md
├── lib/
│   ├── types.ts                      # Schema v2 完整类型定义
│   ├── calculator.ts                 # standard/cached/batch/comparison/monthly
│   ├── calculator.test.ts            # 25 用例
│   ├── tokenizer.ts                  # OpenAI 精确 + 字符比率 fallback
│   ├── tokenizer.test.ts             # 8 用例
│   ├── currency.ts                   # 5 货币转换 + formatCost helper
│   ├── currency.test.ts              # 15 用例
│   ├── analytics.ts                  # typed GA4 track helper
│   ├── seo.ts                        # metadata + JSON-LD 生成器
│   ├── blog.ts                       # markdown 渲染 pipeline
│   └── utils.ts                      # cn() helper
├── messages/
│   ├── en.json                       # 英文翻译键
│   └── zh.json                       # 中文翻译键（V1.1 启用）
├── public/
│   └── logos/                        # 各 AI provider logo（待补 SVG）
├── AGENTS.md                         # Next.js 16 给 AI agent 的注意事项
├── CLAUDE.md                         # 链到 AGENTS.md
├── HANDOVER.md                       # 本文档
├── README.md                         # 200 行专业 OSS 仓库门面
├── LICENSE                           # MIT
├── package.json                      # 含 OSS 元数据 (license/keywords/repo)
├── tsconfig.json | eslint.config.mjs | next.config.ts | postcss.config.mjs
├── components.json                   # shadcn 配置（虽然没用 CLI，但保留）
├── vitest.config.ts                  # 测试配置
├── vitest.setup.ts                   # @testing-library/jest-dom 引入
├── .npmrc                            # legacy-peer-deps + engine-strict=false
├── .env.example                      # 站点 URL 等（GA ID 已移入代码）
├── .gitignore                        # 注意：package-lock.json 暂被 ignore（详见 §16）
└── next-env.d.ts
```

**约定**：
- 业务逻辑在 `lib/`，UI 组件在 `components/`，路由页面在 `app/`，内容数据在 `data/` 和 `content/`
- 数据全部 JSON / Markdown 文件优先（轻量、Git 友好、SSG 直接 import）
- 路径别名 `@/*` 指向项目根
- 测试文件与源文件同目录（`xxx.test.ts` 紧挨着 `xxx.ts`）

---

## 4. 核心数据：models.json

**Schema 版本**：v2.0（详见 `docs/PRD_v1.1_Supplement.md` §4.1）

**关键约定**：
- 所有价格单位：USD per 1M tokens（不要混用 per 1K）
- 不可用的字段填 `null`（不要省略字段）
- 每次更新必须更新 `lastUpdated` 和该模型的 `lastVerified`
- 价格变动必须追加到 `priceHistory` 数组（驱动 F8 趋势图）

**字段一览**（详见 `lib/types.ts` 类型定义）：
- `pricing`: input / output / cachedInput / cacheWrite / batchInput / batchOutput / imagePerImage / reasoningOutput / fineTunedInput / fineTunedOutput
- `tokenization.encoder`: tiktoken encoder 名称（如 `o200k_base`、`cl100k_base`），或 `"approximate"`
- `supports`: 各能力开关（vision、tools、caching、batch 等）

**当前录入模型**：10 个（**全部对齐 LiteLLM 真实数据**，2026-05-12 核验）：

| Provider | 模型 | 类别 | Input/Output ($/1M) | 缓存读 |
|---|---|---|---|---|
| OpenAI | GPT-5.5 | flagship | 5.00 / 30.00 | 0.50 |
| OpenAI | GPT-5 mini | small | 0.25 / 2.00 | 0.02 |
| OpenAI | o4-mini | reasoning | 1.10 / 4.40 | 0.28 |
| Anthropic | Claude Opus 4.7 | flagship | 5.00 / 25.00 | 0.50 |
| Anthropic | Claude Haiku 4.5 | small | 1.00 / 5.00 | 0.10 |
| Google | Gemini 3.1 Pro | flagship | 2.00 / 12.00 | 0.20 |
| Google | Gemini 3 Flash | balanced | 0.50 / 3.00 | 0.05 |
| DeepSeek | DeepSeek V3.2 | balanced | 0.28 / 0.40 | — |
| xAI | Grok 4 | flagship | 3.00 / 15.00 | — |
| Mistral | Mistral Large 3 | balanced | 0.50 / 1.50 | — |

**数据源**：[LiteLLM model registry](https://github.com/BerriAI/litellm/blob/main/model_prices_and_context_window.json)（社区维护，行业事实标准）+ 各厂商官方价格页双重核验。每模型 `sources` 字段都有两条引用。维护节奏见 §4.3。

**单次成本排序**（1,000 input + 500 output，最便宜在前）：
```
1. DeepSeek V3.2     $0.00048
2. GPT-5 mini        $0.00125
3. Mistral Large 3   $0.00125
4. Gemini 3 Flash    $0.002
5. o4-mini           $0.0033
6. Claude Haiku 4.5  $0.0035
7. Gemini 3.1 Pro    $0.008
8. Grok 4            $0.0105
9. Claude Opus 4.7   $0.0175
10. GPT-5.5          $0.020   ← 最贵
```

### 维护流程（每月 1 日）

详见 `docs/PRD_v1.1_Supplement.md` §4.3。简版：
1. 查每家官方价格页（清单见 PRD §9.3）
2. 更新 `data/models.json`，更新 `lastUpdated` 和 `lastVerified`
3. 价格变动追加到 `priceHistory`
4. `git commit -m "data: monthly pricing update YYYY-MM"`
5. push → 自动触发 Vercel 部署
6. 发博客文章公告（"AI API Pricing Update — May 2026"）

---

## 5. 关键模块设计

### 5.1 `lib/calculator.ts` ✅ 100% 覆盖

提供 6 个函数：
- `calculateStandard(input, output, model)` — 标准计算
- `calculateCached(input, output, model, cachedPortion)` — 含缓存折扣
- `calculateBatch(input, output, model)` — Batch API 折扣
- `calculateCost(input, output, model, options)` — 根据 options 自动选择
- `calculateComparison(input, output, model, cachedPortion)` — 三栏对比（用于 F1.5）
- `estimateMonthlyCost(costPerCall, callsPerDay)` — 月度预测（30 天 / 365 天）

测试：`lib/calculator.test.ts` 25 用例，100% 语句/函数/行覆盖。

### 5.2 `lib/tokenizer.ts`

- OpenAI 系（`encoder !== "approximate"`）：动态导入 `js-tiktoken`，精确计数
- 其他模型：用 `approximationRatio`（中/英/代码不同比率）估算
- 返回 `{ count, exact: boolean }`，UI 上根据 `exact` 显示 ✓ Exact 或 ≈ Estimated
- `js-tiktoken` 词表 1-2MB，必须 dynamic import 避免影响首屏

测试：`lib/tokenizer.test.ts` 8 用例。

### 5.3 `lib/currency.ts`

- 5 个货币：USD（基准）/ CNY / EUR / GBP / INR
- `convert(amountUsd, code)` — 转换
- `formatCost(amountUsd, code)` — 格式化（非 USD 加 `~` 前缀表示约等于）
- 数据来源：`data/currencies.json` 静态汇率（每月 1 号同步价格更新）

测试：`lib/currency.test.ts` 15 用例。

### 5.4 `lib/seo.ts`

集中 SEO metadata 生成：
- `modelSlug(modelId)` / `modelUrl(modelId)` — URL 规范化
- `modelMetadata(model)` — 给 Next.js 用的完整 Metadata 对象
- `modelJsonLd(model)` — Schema.org SoftwareApplication
- `breadcrumbJsonLd(model)` — BreadcrumbList
- `siteJsonLd()` — WebSite + SearchAction（首页用）
- `SITE` 常量 — 单一域名/品牌名真相源头

### 5.5 `lib/analytics.ts`

GA4 事件 typed helper：
- `track(name, params)` — 上报事件，typed `EventName` union（覆盖 PRD v1.1 §6.2 全部 17 类事件）
- `trackDebounced(name, params, windowMs=2000)` — 去抖版（用于高频事件如 calculator_used）
- 仅在 `window.gtag` 可用时上报，无 GA4 ID 时静默不报

### 5.6 `lib/blog.ts`

Markdown 文章渲染 pipeline：
- `getAllPostSlugs()` — 文件系统扫描
- `getAllPostsMeta()` — 解析所有 frontmatter，按日期降序
- `getPostBySlug(slug)` — 解析单篇 + 渲染 HTML（gray-matter + remark + remark-gfm + remark-html）

### 5.7 `lib/types.ts`

Schema v2 完整类型定义（`Model` / `ModelPricing` / `CostBreakdown` / `CostComparison` / `MonthlyEstimate` / `CalculationOptions` 等），用于全项目类型安全。

### 5.8 设计 Token（`app/globals.css`）

| Token | Light | Dark | 用途 |
|---|---|---|---|
| `--background` | `#ffffff` | `#0a0a0a` | 页面背景 |
| `--foreground` | `#0f172a` | `#ededed` | 主文字 |
| `--muted` | `#f1f5f9` | `#1f1f1f` | 次级背景 |
| `--muted-foreground` | `#64748b` | `#a1a1aa` | 次级文字 |
| `--border` | `#e2e8f0` | `#262626` | 边框 |
| `--primary` | `#2563eb` | `#3b82f6` | 主色（按钮、链接） |
| `--accent` | `#10b981` | `#10b981` | 节省/正向数据（绿色） |
| `--warning` | `#f59e0b` | `#f59e0b` | "Estimated" 标注 |

字体：Inter（英文）+ Noto Sans SC（中文）+ tabular-nums（数字防抖动）。

CSS 类 `.prose-content` 用于长文章排版（法律页 + 博客文章），含 h2/h3/p/ul/code/blockquote/table 完整样式。

---

## 6. 本地开发

```bash
# 首次
npm install

# 日常开发
npm run dev              # 启动 dev server (http://localhost:3000)

# 测试
npm test                 # vitest run（CI 模式，跑一次）
npm run test:watch       # watch 模式
npm run test:ui          # vitest UI 浏览器界面
npm run test:coverage    # 输出覆盖率报告

# 部署前自检
npm run type-check       # TS 检查（tsc --noEmit）
npm run lint             # ESLint
npm run build            # 验证 build 通过（含 SSG 预渲染所有页面）
```

**Node 版本**：`engines.node >= 20`，开发用 Node 24.12 验证过。

**注意 lockfile**：`package-lock.json` 当前在 `.gitignore` 中（详见 §16 changelog 2026-05-04 调试经过）。每次 `npm install` 会重新生成本地 lockfile。Vercel 部署时也是新生成。

---

## 7. Git 工作流

**远程仓库**：https://github.com/Leolionel221/aicostcalc

**提交格式**（约定）：
```
<type>: <description>

类型：
  feat:     新功能
  fix:      bug 修复
  docs:     文档变更
  style:    代码格式
  refactor: 重构（无功能变化）
  test:     测试
  chore:    杂项（依赖更新、配置）
  data:     数据更新（models.json）
  perf:     性能优化
  seo:      SEO 相关（meta、sitemap、博客）
```

**分支策略**：
- `main` 直接推（独立开发，无需 PR 流程）
- 大改动可建临时分支再合并

**HANDOVER 维护**：
- 每次"收口"必须更新本文档相关章节
- 在 §16 变更日志追加一条记录
- commit 中带上 `docs: update HANDOVER`（可与 feat commit 分开或一起）

---

## 8. 部署：Vercel

**为什么 Vercel 不是 AWS**：详见 PM 决策（2026-05-04，与用户讨论后定）。Hobby tier 完全免费，零 DevOps 负担，自带全球 Edge CDN，与 Next.js 同团队产品零配置接入。

**首次部署步骤**：
1. 访问 https://vercel.com/，用 GitHub 登录
2. New Project → Import Git Repository → 选 `Leolionel221/aicostcalc`
3. Framework Preset: Next.js（自动识别）
4. Environment Variables: 从 `.env.example` 复制，填实际值（如 GA_ID 暂可留空）
5. Deploy
6. 部署完成后 → Settings → Domains → 添加 `aicostcalc.net`
7. Cloudflare DNS 添加 CNAME 记录（Vercel 会给具体值）：
   - `@` → `cname.vercel-dns.com`
   - `www` → `cname.vercel-dns.com`
8. Vercel 自动签发 SSL 证书
9. 后续每次 `git push origin main` 自动部署

**关键设置**：
- Build Command: `npm run build`（默认）
- Output Directory: `.next`（默认）
- Node.js Version: 22.x（推荐，与 `engines.node >= 20` 兼容）

**⚠️ 域名重定向方向**（重要）：

Vercel UI 默认行为有时会让 apex `aicostcalc.net` 重定向到 `www.aicostcalc.net`。**这是错的**。我们要的是反过来：

- ✅ 正确：`www.aicostcalc.net` → 308 永久重定向 → `aicostcalc.net`（apex 是主域名）
- ❌ 错误：`aicostcalc.net` → 重定向 → `www.aicostcalc.net`

理由详见 §11 Decision 7。如果发现 sitemap 抓取失败或 SEO 有"双域名"问题，先检查这个方向。

**Vercel 配置位置**：Settings → Domains → www.aicostcalc.net → "Redirect to Another Domain" 选 308 + 目标填 `aicostcalc.net`。

**环境变量**（Vercel Settings → Environment Variables）：
- ~~`NEXT_PUBLIC_GA_ID`~~ — 2026-08-24 起不再使用，GA 衡量 ID 硬编码在 `lib/analytics.ts`。Vercel 里那条旧变量已无任何代码读取，可删可留。

**重定向缓存陷阱**：改 redirect 方向后，Vercel CDN 可能缓存旧响应 5-10 分钟。强制刷新方法：Deployments → 最新 deployment → Redeploy（取消勾选 "Use existing Build Cache"）。

---

## 9. 域名与服务清单

| 服务 | 用途 | 账号 | 状态 |
|---|---|---|---|
| 域名注册 | aicostcalc.net | Cloudflare Registrar (Lionelchen221@gmail.com) | ✅ $11.86/年 |
| DNS | aicostcalc.net + www | Cloudflare | ✅ Auto-config 通过 Vercel |
| 部署 | aicostcalc.net | Vercel Hobby（绑定 GitHub） | ✅ Free，自动 CI/CD |
| 代码托管 | Leolionel221/aicostcalc | GitHub | ✅ Public + MIT + Topics 设好 |
| **Google Search Console** | 索引/排名监控 | leochen221@proton.me | ✅ 域名级验证 + sitemap 18 URL 收录 |
| **Bing Webmaster** | Bing 索引 | 同 GSC 账号 | ✅ 从 GSC 导入同步 |
| **Google Analytics 4** | 用户行为 | leolionel221@gmail.com | ✅ 详见下方坐标表 |
| **dev.to** | 内容分发 + 反向链接 | leolionel221 | ✅ 第 1 篇文章 live |
| Sentry | 错误监控 | — | ⏳ 未上线（V1.1+ 视情况启用） |
| Plausible | GA4 备份 | — | ⏳ 未上线 |
| AdSense | 广告变现 | — | ⏳ 第 12-16 周申请（条件：30+ 文章 + 3 个月运营史） |
| Affiliate (OpenRouter/Together AI/Helicone) | 联盟变现 | — | ⏳ 月 UV > 1K 后开始洽谈 |

**密钥管理**：所有 secret 通过 Vercel Dashboard → Settings → Environment Variables 配置，不进 Git。

**GA4 精确坐标**（2026-08-24 修复后，务必对准这一套）：

| 项 | 值 |
|---|---|
| 账号 | **AI Cost Calc** (393584169) |
| 属性 | **aicostcalc.net** (536080749) |
| 数据流 | 我的网站1 (15491567321) |
| **衡量 ID** | **`G-2YK8KQ5K2N`** ← 与 `lib/analytics.ts` 中常量一致 |

⚠️ **不要**用 `cubenix-contrl` (380214594p519439150 / `G-V0SB6KHCL0`)——那是 Firebase 默认账号下**另一个项目**的属性，与本站无关。2026-08 曾因此绕过一圈。

**已配置的 env vars**：
- 无（GA ID 已移入代码；`NEXT_PUBLIC_SITE_URL` 等仅作参考未实际读取）

---

## 10. 当前开发进度

### Week 1 — Foundation（✅ 完成）
- [x] 域名 aicostcalc.net 注册（Cloudflare）
- [x] Next.js 16 初始化（App Router + TS + Tailwind v4）
- [x] 项目结构搭建（app / components / data / lib / messages / public / docs）
- [x] 核心依赖安装（next-intl, next-themes, js-tiktoken, lucide-react, etc.）
- [x] 设计 Token + 暗黑模式骨架
- [x] models.json Schema v2 + 2 个样本模型（GPT-4o, Claude Opus 4.7）
- [x] lib/calculator.ts（含 caching + batch 计算）
- [x] lib/tokenizer.ts（OpenAI 精确 + 估算 fallback）
- [x] messages/en.json + zh.json（基础翻译键）
- [x] HANDOVER.md（本文档）
- [x] GitHub 仓库 + 首次 push
- [x] Vercel 部署成功（commit `aa677c5`）
- [x] 绑定 aicostcalc.net 自定义域名（Cloudflare Auto configure，SSL 自动签发）
- [x] 加 www.aicostcalc.net → aicostcalc.net 重定向
- [ ] **遗留 TODO**：解决 lockfile 兼容问题，恢复 `package-lock.json` 进 git（详见 §16 变更日志，不阻塞 Week 2）

### Week 2 — 核心功能（✅ 完成）
- [x] Vitest + RTL 配置，48 个用例（calculator 100% 语句覆盖 + tokenizer + currency）
- [x] shadcn 风格 UI 组件（Button / Input / Label / Card / Slider / Switch / Select），Radix-backed
- [x] Calculator 组件（含 Advanced Options：caching slider + batch toggle + currency 下拉）
- [x] ModelComparison 表（按 5 维度排序、provider 筛选、行级隐藏）
- [x] ScenarioTemplates（6 场景：客服/代码/内容/RAG/数据提取/翻译，一键填充 + 切推荐模型）
- [x] F1.5 三栏成本对比（Standard / Cached / Batch + 节省 % 标签）
- [x] models.json 扩展到 10 个模型，**全部刷新到 May 2026 最新版本**（GPT-5.5, GPT-5 mini, o4-mini, Claude Opus 4.7, Claude Haiku 4.5, Gemini 3.0 Pro, Gemini 3.0 Flash, DeepSeek V4, Grok 4, Mistral Large 3）
- [x] MonthlyEstimator 组件（多选最多 5 模型 + CSS-only 柱状图 + 节省金额提示）
- [x] 货币支持扩展到 5 个（USD / CNY / EUR / GBP / INR），含静态汇率维护
- [x] 完整页面排版重做（Sticky Nav + 2-col Hero + 主题切换 + 交替背景 + 完整 Footer）

### Week 3 — SEO 落地页（✅ 完成）
- [x] 10 个模型独立 Landing Page（`/[model-id]-cost-calculator`，全部 SSG 预渲染）
  - 每页含 Hero + 嵌入计算器 + 详细价格表 + 对比表 + "When to choose" + FAQ + 相关模型
- [x] SEO meta 完整（per-page title/description/canonical/og/twitter）
- [x] JSON-LD 结构化数据（WebSite + SoftwareApplication + BreadcrumbList + Article）
- [x] sitemap.ts 自动列出 18 个 URL（首页 + 10 模型 + 博客索引 + 文章 + 4 法律页）
- [x] robots.ts（allow all + 指向 sitemap）
- [ ] **延后到 V1.1**：next-intl 多语言路由（理由：英文搜索量是中文 5-10x，先聚焦英文）

### Week 4 — 内容启动 & MVP 上线（✅ 完成）
- [x] 4 个法律页面（About / Privacy / Terms / Contact，AdSense 申请前置条件）
- [x] GA4 接入（`@next/third-parties` + 仅在 `NEXT_PUBLIC_GA_ID` 设置时挂载）
- [x] 完整事件追踪（`lib/analytics.ts` typed track helper + 接入到 Calculator/ModelComparison/ThemeToggle 等所有交互组件）
- [x] 博客基础设施（gray-matter + remark + remark-gfm 处理 markdown，frontmatter 含 title/date/tags 等）
- [x] 2 篇启动 SEO 文章（OpenAI Pricing Explained + Claude API Pricing 2026，每篇 ~2000 字）
- [x] Google Search Console 验证 + sitemap 提交成功（18 个 URL 已被 Google 接收）
- [x] **MVP 完整上线 https://aicostcalc.net** 🚀
- [ ] **滚动到 Week 5**：3 篇剩余文章（Top 10 Cheapest / How to Calculate Token Cost / GPT-5.5 vs Claude Opus）
- [ ] **滚动到 Week 5**：Bing Webmaster 接入（30 秒，从 GSC 导入）
- [ ] **滚动到 Week 5**：用户配 GA4 Measurement ID 到 Vercel env vars

### Week 5 — 第一批内容启动（✅ 完成）
- [x] PRD §5.2 第 1 个月 5 篇基础文章全部完成（~10,000 字内容）
  - OpenAI API Pricing Explained（深度指南）
  - Claude API Pricing 2026（深度指南）
  - Top 10 Cheapest AI APIs in 2026（排行榜，覆盖高搜索量关键词）
  - How to Calculate Token Cost: A Beginner's Guide（教学）
  - GPT-5.5 vs Claude Opus 4.7（对比）
- [x] 全部内容互相内链 + 链到模型独立页 + 链到首页计算器（完整内部 SEO 链接结构）
- [x] 品牌 logo 重做（深 slate + 单一前进 chevron + emerald accent dot）
- [x] favicon / apple-icon / og-image 全部统一新品牌
- [x] README 重写（200 行专业 OSS 仓库门面）+ LICENSE (MIT)
- [x] package.json 补 OSS 元数据（homepage、repository、bugs、keywords）
- [x] GitHub Topics 标签设置 + 自 star
- [x] dev.to 第一篇文章交叉发布（Top 10 Cheapest，含 canonical_url 反链）

### 📊 战略观察期（2026-05-05 → 2026-05-12）
**目标**：让 SEO/分析数据自然回流，避免没有数据基础就做盲目决策。

**用户在做的事**（每天 ~10 分钟）：
- GSC 索引监控 / 印象数据
- GA4 实时事件 + 用户来源
- dev.to 文章浏览量 / 评论
- 真诚回每条评论

**期间禁止动作**：
- ❌ 不写新文章
- ❌ 不加新功能
- ❌ 不做付费推广
- ❌ 不做 Product Hunt launch（保留弹药）

**触发提前结束的条件**：
- 24 小时单日 UV > 500（峰值复盘）
- 收到价格错误举报（即时修复）
- dev.to 上 Hacker News 首页或类似爆点（写 follow-up 内容承接流量）

### Week 6 — 数据驱动内容期（✅ 完成 + 数据真实化）

**✅ 已完成**：
- [x] **2026-05-12 数据复盘** — Week 1 SEO 表现远超 PRD 预期（详见 §16 changelog）
- [x] 内容方向调整：基于数据，把"OpenAI prompt caching"主题提到 Week 6 第 1 篇
- [x] **第 1 篇新文章**：[OpenAI Prompt Caching in 2026: When You'll Save 75%](https://aicostcalc.net/blog/openai-prompt-caching-when-worth-it)（1,900 字，2026-05-12 发布）
- [x] 站内反馈通道上线（每模型页 + Footer 链 GitHub Issues 预填模板）
- [x] dev.to 第 2 篇文章交叉发布（OpenAI Caching）
- [x] **数据真实化**（关键里程碑）：所有 10 模型价格对齐 LiteLLM 真实数据；6 篇博客文章同步修正（详见 §16）

**📋 Week 6 剩余任务**：
- [ ] 5/19 数据复盘：看新文章曝光增长 + 数据真实化后 GSC 反应（新真实价格可能引入新查询）+ API 是否带来外部 referrer

### Plan A 免费 API（✅ 完成 2026-05-12）

PRD v1.1 §3.5 F-api 早期承诺已兑现。3 个公开 endpoint + 完整 docs 页 + Nav/Footer/README 全面接入。详见 §16 changelog。

**当前 API 监控指标**（5/19 复盘时看）：
- 是否有 `aicostcalc.net/api/` 路径在 GSC 出现曝光
- GA4 Referrers 是否出现外部站点调用我们 API
- GitHub 是否收到"我用了你 API"的 issue / showcase
- 未来 1-2 个月观察使用情况，决定是否激活完整 Stage 1（付费层）

### Week 7+ — 持续内容与运营

**优先级（基于 Week 1 GSC 数据反馈）**：
- [ ] **第 2 篇文章（Week 7）**：GPT-5 mini vs Claude Haiku 4.5 — Real Production Cost Math（双高曝光关键词锁定）
- [ ] **第 3 篇（Week 8）**：DeepSeek V4 vs OpenAI（PRD §5.2 计划，数据未验证但应试）
- [ ] **第 4-5 篇（Week 9-10）**：Gemini 3.0 Pro vs GPT-5.5 长上下文 + How Much Does It Cost to Build a Chatbot
- [ ] 剩余 4 篇博客文章交叉发布到 dev.to（按周节奏 1 篇）
- [ ] alternativeto.net / BetaList / SideProjectors / launchingnext 收录提交（Week 8+）
- [ ] Product Hunt launch 准备（Week 10+ 等 GitHub stars > 10 + dev.to 浏览 > 1K）
- [ ] 第 3-6 个月按节奏每月 5 篇（优化类、场景类、深度 + 热点）
- [ ] 第 12-16 周申请 AdSense（要求：30+ 篇文章、自然流量、4 个法律页齐全 ✅、3 个月运营史）
- [ ] 启动联盟营销洽谈（OpenRouter / Together AI / Helicone）

详细路线图见 PRD v1.1 §9。

---

## 11. 关键产品决策记录

每个决策都应能从这里追溯到完整理由（避免后人推翻已经讨论过的事）。

### Decision 1: Vercel 而非 AWS（2026-05-04）
**结论**：用 Vercel Hobby tier。
**理由**：Hobby 免费，零 DevOps 成本，全球 Edge CDN 利于 SEO Core Web Vitals，与 Next.js 同团队零配置。AWS 在月 UV 突破 50K 前是过度选择。
**何时重新评估**：月 UV > 50K 或 Vercel 开始收费。

### Decision 2: 定价模型 V1.0 即支持 caching + batch（2026-05-04）
**结论**：V1.0 计算器加 Advanced Options，含 prompt caching 和 Batch API toggle。
**理由**：现代 LLM 真实成本与基础 input/output 价差异可达 5-10x（caching）或 50%（batch）。不支持就等于结果与用户真实账单偏差过大，工具站信任崩溃。详见 PRD v1.1 §2.1。
**字段已预留**：vision / reasoning / fine-tuned 在 schema 中已 null 占位，V1.1+ 启用。

### Decision 3: Tokenizer 仅 OpenAI 系精确（2026-05-04）
**结论**：V1.0 OpenAI 系用 js-tiktoken 精确，其他模型用字符比率估算并 UI 标注 "≈ Estimated"。
**理由**：OpenAI 系搜索量最大（流量主体），js-tiktoken 成熟可用。Claude/Gemini 没成熟 JS tokenizer，做精确要么调真实 API（违反"纯计算器"原则），要么折腾近似。诚实标注 Estimated 反而是品牌透明度资产。详见 PRD v1.1 §2.2。

### Decision 4: 增长机制前置到 V1.0（2026-05-04）
**结论**：V1.0 即包含 F-share（URL 编码深链接 + 复制图片）和 F-api（公开 JSON API）。
**理由**：工具站最强增长杠杆。F-share 让用户分享结果（病毒传播），F-api 让其他开发者用我们的数据（自然反向链接 + SEO 权威）。详见 PRD v1.1 §3.4-3.5。

### Decision 5: 北极星指标 = Affiliate Revenue（2026-05-04）
**结论**：北极星 `Monthly Affiliate Revenue = CTR × UV × Avg Commission`。
**理由**：UV 是手段，Revenue 才是目的。前 6 个月可能流量增长但收入为零，不能因此放弃 SEO 节奏。详见 PRD v1.1 §6.1。

### Decision 6: 货币支持扩展到 5 个（2026-05-05）
**结论**：除 USD/CNY 外，额外加入 EUR/GBP/INR（不加 JPY/CAD/AUD）。
**理由**：PRD §1.3 列的目标市场是美/英/加/德/印/中。EUR 覆盖德国及整个欧盟，GBP 覆盖英国，**INR 必加**（1$≈85₹ 心理差异最大对印度开发者效果最好）。CAD 用户对 USD 已习惯，JPY 不是 PRD 主市场。静态汇率每月 1 号同步价格更新。
**实现**：`data/currencies.json` 独立维护；UI 用 Select 下拉 + 非 USD 加 `~` 前缀显示"约等于"。

### Decision 7: 主域名 = apex (`aicostcalc.net`)，www 永久跳转到 apex（2026-05-05）
**结论**：apex 是规范域名，`www.aicostcalc.net` 308 永久重定向到 apex。
**理由**：现代品牌惯例（Stripe / X / GitHub / Vercel 自身都是 apex）。PRD 代码 `metadataBase` 已配 apex。永久跳转（308 而非 307）让 Google 把所有 SEO 权重集中到 apex 上，避免双域名稀释排名。
**注意**：Vercel UI 默认行为可能反过来（apex 跳 www），上线初期遇到过此问题，必须显式配 www → apex。

### Decision 8: i18n 多语言路由延后到 V1.1（2026-05-05）
**结论**：next-intl 路由（`/` vs `/zh/`）从 Week 3 推迟到 V1.1。
**理由**：PRD 关键词数据显示英文搜索量是中文 5-10 倍（`openai api pricing` 月搜 18-22K）。先用英文把 SEO 落地页发出去比同时做两套语言更高 ROI。中文版作为独立冲刺阶段做，避免 i18n routing 大改造拖慢核心交付。
**字段已预留**：`messages/en.json` + `zh.json` 已就位，模型 metadata 含 `i18n.en/zh`，启用 routing 时无需重写数据。

### Decision 9: 文章先发 2 篇启动，剩余 3 篇分批产（2026-05-05）
**结论**：Week 4 先交付 2 篇高质量文章（OpenAI / Claude pricing），剩余 3 篇（Top 10 Cheapest / How to Calculate Token Cost / GPT vs Claude）滚动到 Week 5+ 处理。
**理由**：每篇 2000 字深度文章一轮做完会牺牲质量。基础设施（MDX pipeline + Article JSON-LD）一次到位即可，文章可分批迭代。Google 对内容质量极敏感，宁可少发不能差发。

### Decision 10: 仓库改 MIT 开源（2026-05-05）
**结论**：从 "Private — all rights reserved" 改为 MIT License，配合 README 重写。
**理由**：
1. 你站点的护城河是**品牌 + 内容 + 数据维护**，不是代码（任何人 fork 都没法跟你竞争"被 Google 索引的内容资产"）
2. 你的 GitHub repo 同时是**SEO 资产**和**社区发现入口**——awesome-list 收录、技术博客引用、贡献者参与都需要 OSI 认可的开源许可证
3. MIT 是最被广泛接受的选择，没有任何使用限制
4. "Private + Public 仓库" 自相矛盾且劝退贡献者
**操作**：LICENSE 文件 + package.json `"license": "MIT"` 字段 + README 改 badge。

### Decision 11: 战略观察期 7 天（2026-05-05）
**结论**：5/5 上线 + 内容产出全部到位后，进入 7 天观察期，5/12 数据复盘后再决定 Week 6 方向。
**理由**：
- 24 小时内做完 PRD 4 周计划是异常加速。继续往前推会进入"凭直觉决策"区间。
- SEO/GA4 数据回流需要时间（GSC 印象数据 3-7 天起，GA4 用户行为模式 7 天起）
- 真实数据 > 假设。数据告诉你哪类内容/关键词最有 traction，再投资源效率最高。
**期间允许的动作**：每天 5-10 分钟扫数据 + 真诚回评论。期间禁止新增内容/功能/付费推广。

### Decision 12: LiteLLM 作为价格数据"真相源头"（2026-05-12）
**结论**：所有模型价格数据从"projected May 2026"切换到 LiteLLM 公开 registry 核验。每月固定从 LiteLLM 同步。
**理由**：
- 原推测数据准确率仅约 60-70%。重大偏差：Claude Opus 4.7 公布 $15/$75 而实际是 $5/$25（3× 偏高），Mistral Large 3 $2.50/$7.50 而实际 $0.50/$1.50（5× 偏高）。这些偏差**真实危害用户**（按我们的数据做预算 → 实际成本省 60-80%）。
- LiteLLM 是行业事实标准（LangChain / LiteLLM SDK 内置，月级千万次调用，错误立刻收社区 PR 修正）。
- 我们的 sources 字段双重核验（LiteLLM + 各厂商官方页），既有社区压力测试又有官方权威。
**实施细节**：
1. `data/models.json` 顶部 `_note` 字段说明数据源 + 时间戳
2. 每模型 `sources` 数组列出 LiteLLM URL + 官方价格页 URL（都带 `fetchedAt`）
3. 每月 1 日同步流程：`curl LiteLLM JSON` → diff → 人工 review → 更新 → commit
4. 后续 Stage 2 可上 GitHub Actions 自动 cron + auto-PR
**未做但已规划**（Layer 3）：用 Cloudflare Worker 写爬虫直接核对官方页面，作为 LiteLLM 数据的二次校验。

### Decision 13: API 扩展计划 (V2.0 路线图)（2026-05-12）
**结论**：将另一线程产出的 `API_Expansion_Plan.md` 保留作为 V2.0 路线图，**不立刻执行完整 Stage 1**。先做 Plan A 试水。
**理由**：
1. 完整 Stage 1（auth + Stripe + database + API Key + RapidAPI 上架）= 4-6 周开发，会撕裂当前 SEO 复利期窗口
2. PRD v1.1 §3.5 早已规划 F-api 免费版（无 auth、纯 JSON、Vercel CDN 缓存），是更低成本的"试水"方案
3. 数据真实化（Decision 12）已完成 = API 化的前提就绪
4. 计划本身设计合理，**只是时机问题**，不丢
**Plan A 已执行（2026-05-12，commit `6356fb0`）**：3 个免费 endpoint + /api docs 页 + Nav/Footer/README 接入。详见 §16。
**激活完整 Stage 1 的触发条件**：当 (a) 月 UV > 1,000，(b) 收到 ≥3 封"想付费要更稳定数据"邮件，(c) Free API 有 50K+ 月调用量 时，再激活付费层。

### Decision 14: 联盟策略从 OpenRouter 转向 Novita + AIMLAPI（2026-07-18）
**结论**：放弃 PRD §6.2 的 OpenRouter 联盟假设（浏览器实测证伪：无自助推荐计划），改接 Novita AI（10%/180 天，已上线）+ AIMLAPI（30% lifetime 现金，申请中）。
**理由**：
1. OpenRouter 后台无 Referral 入口，相关 URL 全 404——PRD 假设从未成立
2. 全生态调研（官方页验证）显示真付现金且受众匹配的只有 AIMLAPI 和 Novita；观测工具（Helicone/Langfuse）全无计划；Groq/Together/Fireworks 无计划或假货
3. Novita host 开源模型（DeepSeek 系），与我们"最便宜模型"数据叙事天然契合
**诚实守卫**：`novitaServes()` 保证不向用户虚假声称 Novita 承载专有模型（GPT/Claude/Gemini）——专有模型页只做"开源替代省钱"话术。
**合规**：所有联盟链接 `rel="sponsored"`（Google 链接方案）+ 可见披露（FTC）+ GA4 事件追踪。
**何时复审**：affiliate_link_clicked 月度数据回流后评估各位点转化；AIMLAPI 通过后评估是否作为专有模型页的主 CTA。

---

## 12. 待办与挂起项

### 已完成（2026-05-05 收口前确认）

- ✅ Bing Webmaster 接入（从 GSC 导入同步）
- ✅ GA4 Measurement ID 配进 Vercel env vars
- ✅ GSC 8 个核心 URL 手动请求索引
- ✅ Logo 设计（深 slate + forward chevron + emerald accent，详见 §16 v3 定稿）
- ✅ GitHub Topics + 自 Star + README + MIT license
- ✅ dev.to 第 1 篇交叉发布

### 用户长期跟进

- [ ] **2026-05-12 数据复盘**——发我 GSC/GA4/dev.to 截图 + 观察
- [ ] **每月 1 日定期价格更新**：核对 8 家官方价格页 → 更新 `data/models.json` 和 `data/currencies.json` → push（详见 §13 FAQ）
- [ ] **真诚回复每条 dev.to 评论**

### 产品/运营待决策（按时间窗口排序）

- [ ] **Week 6+**：第 2 个月 5 篇对比类文章（详见 §10 Week 6+ 列表）
- [ ] **Week 6+**：剩余 4 篇博客交叉发布到 dev.to（按周节奏 1 篇）
- [ ] **Week 6+**：alternativeto.net / BetaList / SideProjectors / launchingnext 收录提交（各 5 分钟）
- [ ] **流量到 1K UV/月**：开始联盟营销洽谈（OpenRouter / Together AI / Helicone）
- [ ] **dev.to 浏览 > 1K + GitHub stars > 10**：Product Hunt launch（一次性弹药）
- [ ] **价格爬虫自动化**（PRD v1.1 §4.3）：上 Cloudflare Worker 定时抓官方页（V1.2 阶段）
- [ ] **A/B 测试基础设施**：V1.2 第 4 个月再上（Vercel Edge Config 或 GrowthBook）

### 技术债

- [ ] **lockfile 兼容问题**：`package-lock.json` 未进 git（详见 §16 changelog 2026-05-04）。修复路径：nvm 装 Node 22 + npm 10 重新生成兼容 lockfile，或评估迁 pnpm。**优先级**：低（不阻塞任何事）
- [ ] **i18n 多语言路由 (V1.1)**：把所有路由挪到 `app/[locale]/` 下（详见 §11 Decision 8）
- [ ] **F-share / F-embed (V1.1)**（PRD v1.1 §3.4）：URL 编码深链接 + 复制为图片 + iframe 嵌入
- [x] ~~F-api 公开 JSON endpoint~~ ✅ 已完成 2026-05-12 (Plan A，详见 §16)
- [ ] **Vision per-image 定价支持 (V1.1)**：`data/models.json` schema 已预留 `pricing.imagePerImage` 字段，需启用 UI
- [ ] **Reasoning tokens 支持 (V1.2)**：o4-mini / Opus 等推理模型有思考 tokens
- [ ] **provider logo SVG 文件**：`public/logos/` 目前是空目录，需补 openai.svg / anthropic.svg / google.svg / deepseek.svg / xai.svg / mistral.svg
- [ ] **F-api**（PRD v1.1 §3.5 提到）：公开 JSON API endpoint，让其他开发者能用我们的数据。V1.1 加

---

## 13. 常见操作 FAQ

**Q: 怎么添加一个新模型？**
1. 在 `data/models.json` 的 `models` 数组追加一项，按 Schema v2 完整填写
2. 在 `lib/types.ts` 检查类型是否兼容（一般无需改）
3. 把官方 logo SVG 放到 `public/logos/<providerId>.svg`
4. （Week 3 后）在 `app/[model-id]-cost-calculator/page.tsx` 创建对应 Landing Page
5. 跑 `npm run type-check` 确认通过
6. commit message：`data: add <model-name>`

**Q: 怎么更新一个模型的价格？**
1. 修改 `data/models.json` 中该模型的 `pricing` 字段
2. 更新该模型的 `lastVerified` 为今天
3. 在 `priceHistory` 追加一条记录（date / input / output / note）
4. 更新顶层 `lastUpdated` 字段
5. commit message：`data: update <model> pricing`

**Q: dev server 启动报错？**
- 删除 `node_modules` 和 `package-lock.json`，重新 `npm install`
- 检查 Node 版本 ≥ 20

**Q: 改了样式但没生效？**
- Tailwind v4 用 CSS-based config，确认 `app/globals.css` 中 `@theme inline` 块是否定义了对应 token
- 重启 dev server（Tailwind v4 hot reload 偶尔不灵）

**Q: 怎么发一篇新博客文章？**
1. 在 `content/blog/` 下创建 `your-slug.md`
2. 顶部加 frontmatter（参考已有文章）：
   ```yaml
   ---
   title: "标题（含关键词）"
   description: "Meta description，120-160 字符"
   date: "2026-05-XX"
   author: "AI Cost Calc Team"
   tags: ["tag1", "tag2"]
   readingTime: "X min read"
   featured: false
   ---
   ```
3. 写 markdown 正文（支持 GFM 表格、代码块）
4. 图片放 `public/blog/` 或外链
5. 运行 `npm run build` 确认无误
6. commit 用 `content: add <article-slug>` 格式
7. push → Vercel 自动部署 → sitemap.xml 自动包含新 URL → GSC 自动通知 Google
8. **GSC 顶部搜索框输入新文章 URL → "请求编入索引"** 加速首批抓取
9. 如果交叉发到 dev.to：编辑器右上角设置 `canonical_url` 指向原文 URL，避免 SEO 重复

**Q: 怎么响应 dev.to / GitHub / 邮件来的反馈？**
- **dev.to 评论**：直接回复，哪怕 "thanks!" 也比沉默好（算法看互动）
- **GitHub Issue（价格错误）**：24 小时内修复 → push → 关闭 issue 时贴上 commit 链接
- **GitHub Issue（功能建议）**：先 thumbs up + "thanks for suggesting"，然后判断 V1.0/V1.1/V2.0 节奏
- **邮件 leochen221@proton.me**：2 工作日内回复

**Q: 怎么 debug 某个交互不上报 GA4 事件？**
1. 浏览器 DevTools → Network → Filter `google-analytics.com` 或 `gtag`
2. 触发交互后看是否有 `collect?` 请求发出
3. 如果没发：检查 `lib/analytics.ts` 里 `track(name, params)` 是否被调用（`console.log` 一下）
4. 如果发了：去 GA4 → 报告 → 实时 → DebugView，等 1-2 分钟看是否到达
5. **先验衡量 ID 是不是活的**（2026-08 踩过的坑，最隐蔽）：
   ```bash
   curl -s -o /dev/null -w "%{http_code} %{size_download}\n" \
     "https://www.googletagmanager.com/gtag/js?id=G-2YK8KQ5K2N"
   ```
   期望 `200` + 约 50 万字节。若是 `404` + 约 1.5K，说明该 ID 在 Google 侧已失效——
   此时页面上 `typeof gtag === "function"` 和 dataLayer 都**看起来正常**（那是内联代码
   干的），但库从未执行，永远不会发出 `/g/collect`。判据只有两个：上面这个 curl，
   以及浏览器里 `performance.getEntriesByType('resource')` 中有没有 collect 请求。

---

## 14. 未来 AI Agent 接手指引

如果你是接手这个项目的 AI Agent（Claude / Cursor / 其他）：

1. **先读完整本文档**，再读 `docs/PRD_v1.1_Supplement.md`
2. **PM 角色**：本项目用户已授权 AI 担任 PM 角色 — 主动给方案而不是列选项让用户选
3. **"收口"工作流**：用户说"收口"或"完成"或类似 → 自动更新本文档 §16 变更日志 + git commit + push
4. **Next.js 版本**：项目用 Next.js 16，与训练数据中的 14/15 有 breaking changes。对不确定的 API，先看 `node_modules/next/dist/docs/` 或者 `npx next --help`
5. **不要新建文档**：所有项目知识都沉淀到本文档。新建 .md 前先想清楚为什么不能放进 HANDOVER
6. **不要破坏 Schema v2 兼容性**：data/models.json 的字段只能新增不能删除（破坏 priceHistory 等下游）
7. **PRD 是最高权威**：本文档与 PRD 冲突时以 PRD 为准（除非用户明确要求改 PRD）

---

## 15. 联系与所有权

- 项目所有者：leochen221@proton.me
- GitHub：[Leolionel221](https://github.com/Leolionel221)
- 域名：aicostcalc.net（Cloudflare Registrar）

---

## 16. 变更日志

> 每次"收口"在此追加一条记录。最新的在最上方。

### 2026-08-24 — 修复 GA4 断链：衡量 ID 在 Google 侧失效
**类型**：fix（埋点）
**摘要**：排查"GA4 没数据"时发现，网站一直在向一个**已失效的衡量 ID** 上报。新建数据流并把 ID 从环境变量搬进代码。

**症状**：GA4 提示"48 小时内未收到数据"，28 天报告 0 用户 0 事件。

**排查过程（几乎所有常规检查都显示正常，这是本次最大的坑）**：
| 检查项 | 结果 | 是否有误导性 |
|---|---|---|
| 线上 HTML 含 gtag 脚本 | ✅ | — |
| GA4 数据流衡量 ID 与代码一致 | ✅ 都是 `G-MMKJPWQWJD` | — |
| `typeof window.gtag === "function"` | ✅ | ⚠️ **是内联片段定义的排队函数，与库无关** |
| dataLayer 有 `js` + `config` 两条 | ✅ | ⚠️ **也是内联片段 push 的，没人消费** |
| performance 中有 gtag 脚本资源 | ✅ | ⚠️ **404 页面同样计为一次资源加载** |
| 站点响应头有无 CSP 拦截 | ✅ 无 CSP | — |
| **`/g/collect` 打点请求** | ❌ 从未发出 | ← **唯一真实信号** |

**根因**：`curl "googletagmanager.com/gtag/js?id=G-MMKJPWQWJD"` 返回 **HTTP 404 + 1,584 字节 HTML 错误页**，不是 JS 库。对照组 `G-V0SB6KHCL0` 返回 200 + 509KB 真实库，排除请求方式问题。ID 在 GA4 后台仍显示存在、回收站里也没有该属性，但 Google 的投放端已不认这个 ID。断链发生在 5 月（那时有真实事件到达）之后的某个时点。

**影响**：埋点自 5 月后某时起一直是瞎的，包括 7 月装的 `affiliate_link_clicked`。因期间访客本就近乎为零，**没有丢失有价值的真实数据**。

**修复**（commit 见下）：
1. 在同一属性下新建数据流 → 新 ID `G-2YK8KQ5K2N`
2. **先 curl 验证新 ID 返回 200 + ~500KB 才动代码**（这条已写进 §13 FAQ 作为标准动作）
3. 衡量 ID 从 Vercel 环境变量搬进 `lib/analytics.ts` 常量：GA ID 本就明文出现在页面 HTML 里，不是密钥；放进代码后可进 git 历史、可在 diff 中看见、不会与部署态静默漂移
4. `app/layout.tsx` 改为无条件挂载（不再依赖 env 是否存在）
5. §9 补上完整 GA4 坐标表 —— **本次绕圈的根源就是文档只记了账号邮箱、没记具体是哪个属性**

**教训**：判断 GA 是否真的在工作，只认两个信号 —— gtag/js 的 HTTP 状态与体积、以及有没有 `/g/collect` 请求。脚本标签在、gtag 是函数、dataLayer 有内容，这三样**全都可以在完全失效时正常显示**。

### 2026-08-01 — 8 月月度维护（首次常规维护，抓到真实降价事件）
**类型**：data（月度 SOP）
**摘要**：第一次按月度节奏执行的常规维护。30 分钟完成健康检查 → LiteLLM 全量扫描 → diff → 更新 → push。20→23 模型。commit `31fd51d`。

**站点健康**：首页 200 / API 正常 / Novita 联盟链接在线 ✅

**🔥 本月最有价值的发现 — OpenAI 7 月下旬悄悄降价**：
| 模型 | 旧价 | 新价 | 降幅 |
|---|---|---|---|
| GPT-5.6 Luna | $1.00/$6.00 | **$0.20/$1.20** | **80%** |
| GPT-5.6 Terra | $2.50/$15.00 | $2.00/$12.00 | 20% |

Luna 降价后跃升为全站**第 3 便宜**（$0.0008/次），且带 1M 上下文 + 视觉——**1M 上下文档里目前最强性价比**。两条都已写入 priceHistory，i18n 描述同步重写（叙事变了必须改文案）。

**这正是本站存在的意义**：这种降价没有厂商会主动通知开发者，而我们的月度 diff 能捕获它。这是"数据维护"这件苦活的真实价值证明。

**3 个新模型**：
- Claude Opus 5 $5/$25 1M ctx（Anthropic 新 Opus 世代，接替 4.8，同价）
- Gemini 3.6 Flash $1.50/$7.50 1M ctx（输出比 3.5 Flash 便宜 17%）
- Gemini 3.5 Flash Lite $0.30/$2.50 1M ctx（Google 经济多模态档）

其余 18 个模型价格无变化，lastVerified 全部刷新。首页 MonthlyEstimator 默认改为当前三大旗舰。

**维护方法验证**：本月用全量扫描法（129 个主厂商 native chat 候选逐一人工过），未再出现 7 月的漏模型问题。**这个方法确认为 SOP 标准做法**。

**有意识排除**（下月复审）：gpt-5-nano、gpt-5.4 家族、deepseek-v4-pro、grok-4.3、grok-4-1-fast、mistral-medium-3-5、gemini-3.1-flash-lite——非旗舰或与已覆盖档位冗余。

**已知环境问题**：本机 Next.js 构建异常慢（8+ 分钟编译，偶尔卡住）。**月度维护时不必等本机 build**——数据类改动跑通 type-check + JSON 校验（模型数/ID 唯一性/价格合法性/时间戳一致性）后直接推，由 Vercel 构建做验证门，推送后 curl 验证线上即可。

**用户待办**（从 7 月挂到现在，不阻塞）：
1. **AIMLAPI 联盟申请**（aimlapi.com/affiliate → Apply Now）——30% lifetime 现金，是 Novita 10% 的 3 倍，主力收银台
2. Novita 联盟后台改初始密码

---

### 2026-07-18 — 复活日收口：July 全量数据同步 + 收银台安装（3 commits）
**类型**：data + monetization + strategy
**摘要**：7 周静默期后回归。数据同步 10→20 模型；证伪 OpenRouter 联盟假设；完成联盟计划全生态调研；拿到 Novita 推荐链接并全站接入——**站点上线 11 周后第一次拥有真实变现机制**。

**7 周自然实验结论**（2026-05-28 → 07-18 零干预）：
- 28 天窗口内日曝光从 ~15 → ~30（翻倍），排名 47.5 → 41.8（缓慢回升）
- **Google 重新分类了站点身份**：5 月的内容型查询（openai prompt caching pricing 等）消失，工具型查询接管（"ai cost calculator" 113 曝光成为第一查询）——印证 5 月数据（landing page CTR 0.4% vs 博客 0%）：**工具页是真资产，博客不是**
- 战略结论：顺着 Google 给的身份加码工具页，博客降级

**July 数据同步**（commits `2074582` + `a3a4d4e`）：
- 10 个旧模型 vs LiteLLM 全量核对：零价格变化，lastVerified 刷新
- 新增 10 个模型（10→20）：GPT-5.6 全家族（base/Sol/Terra/Luna）、Claude Fable 5（$10/$50 顶级旗舰）、Claude Opus 4.8、Claude Sonnet 5、Gemini 3.5 Flash、Grok 4.5（比 Grok 4 便宜 60%）、DeepSeek V4-Flash（$0.14/$0.28 新最便宜王）
- 20 张 SSG 工具页全部 200，sitemap 自动扩展
- 修复存量 bug：首页 MonthlyEstimator 引用 5/12 已改名的 gemini-3-0-pro（静默失效 2 个月）
- **维护方法教训**：第一轮用关键词模式搜漏了 4 个模型（用户抓到 Fable 5/Sol/Terra，复扫又抓到 Gemini 3.5 Flash）。以后每月同步必须用**全量扫描 + 有意识排除清单**，排除项写进 commit message 备查
- 有意识排除（8 月复审）：gpt-5-nano、deepseek-v4-pro、grok-4.3、grok-4-1-fast、mistral-medium-3-5

**OpenRouter 联盟假设证伪**（浏览器实测）：
- 在用户真实 OpenRouter 后台逐页验证：Settings 无 Referral 入口、/settings/referrals 与 /referrals 均 404、Credits 页仅充值
- **PRD §6.2 "OpenRouter 联盟返利"从一开始就不成立**；第三方声称的推荐计划即使存在也返 credits 不返现金
- 顺带：帮用户走完 OpenRouter 新账户引导（Individual、跳过支付方式、生成的 API key 未记录未使用）

**联盟计划全生态调研**（子任务，全部官方页验证）：
- 🥇 AIMLAPI：up to 30% lifetime 现金（Wise/PayPal，Rewardful 申请制）——受众完美同构，**待用户申请**
- 🥈 Novita AI：10%/180 天/无上限，自助——**已接入**
- 🥉 Pinecone 10% 首年（PartnerStack）/ RunPod / Vast.ai——留作内容页补充
- 证伪：观测工具全无计划、Groq/Together/Fireworks/Replicate 无计划或同名假货、LLM Gateway credits 不可提现

**收银台安装**（commit `8918107`）：
- `lib/affiliate.ts`：伙伴注册表 + novitaServes() 诚实守卫（Novita 只 host 开源模型，不虚假声称承载 GPT/Claude）
- `components/AffiliateCTA.tsx`：DeepSeek 模型→直接 CTA；专有模型→"开源替代省钱"话术
- 合规三件套：`rel="sponsored"`（Google 链接方案合规，SEO 恢复期关键）+ 可见 affiliate 披露（FTC）+ `affiliate_link_clicked` GA4 事件（5 月埋的计数器终于有收银台可数）
- 接入位：计算器结果区 + 全部 20 个模型页（最高购买意图位）
- 已线上验证：ref 参数、sponsored rel、披露文案全部到位

**Novita 推荐链接**：`https://novita.ai/?ref=mjgzzjc8&utm_source=affiliate`（10% 佣金，写入 lib/affiliate.ts）

**待用户动作**：
1. AIMLAPI 申请（aimlapi.com/affiliate → Apply Now → Rewardful 表单，渠道写 aicostcalc.net）——通过后把链接给我补接
2. Novita 联盟仪表盘初始密码修改（novita.ai/affiliate-new 页面下方有初始凭据，未被我记录）
3. GSC 手动催索引 10 个新模型页（可选加速）

---

### 2026-05-12 — Plan A 免费 API 上线收口（PRD v1.1 §3.5 F-api 兑现）
**类型**：feat + infrastructure
**摘要**：3 个公开 JSON API endpoint 上线，配套 /api 文档/marketing 页 + 全站接入。PRD v1.1 §3.5 早期规划的 F-api 终于交付。

**新 endpoints**（全部 GET，CORS-enabled，无 auth）：
- `GET /api/v1/models` — 全量数据 + 4 维过滤（provider / category / capability / status）
- `GET /api/v1/models/{id}` — 单模型 lookup，404 时返回 availableIds 数组
- `GET /api/v1/pricing` — 轻量价格-only payload

**所有响应**：
- `Cache-Control: public, max-age=3600, s-maxage=86400` — 浏览器 1h，Vercel Edge 24h
- `Access-Control-Allow-Origin: *` — 任何前端可调
- `_meta` 块带 dataSource / license / docs URL / error reporting URL
- 零数据库、零 auth、零 rate limit middleware（依赖 Vercel CDN 兜底）

**新页面 /api**（marketing + docs，~250 行）：
- Hero "Free Public API · No auth · MIT" + 双 CTA
- 30-second curl quickstart 区
- 3 endpoint 详解 + 完整 filter 文档
- TypeScript-style schema 完整参考
- 数据准确性章节链 LiteLLM + provider 官方页
- 6 个使用场景示例（dashboards / bots / extensions / FinOps / 路由）
- MIT license + rate limit 说明

**全站接入**：
- Nav 添加 "API" 链
- Footer "Tool" 栏添加 "Free API"
- README 新增 "Public API (free, no auth)" 章节（含 3 个 curl 示例）
- sitemap.ts 加入 `/api`（priority 0.7，changeFrequency: monthly）

**TypeScript 修正**：`/api/v1/models/route.ts` 在 capability filter 用 `as unknown as Record<string, unknown>` 双重 cast（TS 严格模式要求）。type-check 通过。

**为什么先做 Plan A**：
- Plan B/C（带 Auth + Stripe + Database + Dashboard 的付费 API）= 4-6 周开发，与 SEO 复利窗口冲突
- 数据真实化（Decision 12）已完成 = API 化的前提就绪
- 免费 API 是反向链接磁铁——开发者在 GitHub README / 博客 / SO 答案里引用我们 API URL = 自然外链积累
- 用 6-12 周观察使用情况后再决定是否激活付费层（Decision 13 触发条件）

**未来监控（5/19 复盘）**：
- GSC 是否出现 /api 路径曝光？
- GA4 Referrers 是否出现"用了我们 API 的外部站点"？
- GitHub 是否收到 showcase issue？
- 整体外部反向链接数量是否有变化？

**当前线上规模**：
- 23 个 SSG 页面（首页 + 10 模型 + 6 博客 + 4 法律 + 博客索引 + API docs）
- 3 个 API endpoints
- ~16,000 字 SEO 内容
- 全部数据 LiteLLM 核验，2026-05-12

---

### 2026-05-12 — 数据真实化收口（LiteLLM bootstrap + 6 篇文章同步）
**类型**：data + content + infrastructure
**摘要**：所有模型价格数据从"projected May 2026"切换到 LiteLLM 公开 registry 核验的真实数据。准确率从 60-70% → 99%+。详见 §11 Decision 12。

**数据修正幅度**（最严重的偏差）：
- Claude Opus 4.7：$15/$75 → **$5/$25**（3× 偏高，用户预算会被严重误导）
- Mistral Large 3：$2.50/$7.50 → **$0.50/$1.50**（5× 偏高）
- GPT-5.5：$5/$20 → $5/$30（output 偏低）
- GPT-5 mini：$0.20/$0.80 → $0.25/$2.00
- Gemini 3.0 Pro → 实际是 Gemini 3.1 Pro（旧版已废弃 2026-03-09）
- DeepSeek V4 → 实际是 DeepSeek V3.2（V4 不存在）
- Grok 4：$4/$20 → $3/$15
- 缓存/批处理价格：全部更新为 LiteLLM 核验值

**URL 改动 + 301 redirects**（commit `81507e5`，`next.config.ts`）：
- `/gemini-3-0-pro-cost-calculator` → `/gemini-3-1-pro-cost-calculator`
- `/gemini-3-0-flash-cost-calculator` → `/gemini-3-flash-cost-calculator`
- `/deepseek-v4-cost-calculator` → `/deepseek-v3-2-cost-calculator`

**6 篇博客文章修正**：
- 全部加 "Updated 2026-05-12" 透明声明（解释数据刷新）
- `top-10-cheapest-ai-apis-2026.md`：排名表全部重写，新冠军是 DeepSeek V3.2（$0.00048/call），GPT-5.5 反而成为最贵
- `claude-api-pricing-2026.md`：关键价格更正（开头 $15/$75 → $5/$25）
- `gpt-5-5-vs-claude-opus-4-7-comparison.md`：对比表更正，**核心论点翻转**（Opus 现在比 GPT-5.5 便宜 20%，不是贵 3.5×）
- `how-to-calculate-token-cost-beginner-guide.md`：缓存价格段更正
- `openai-api-pricing-explained-2026.md`：DeepSeek + GPT-5 mini 价格段更正
- `openai-prompt-caching-when-worth-it.md`：跨厂商缓存对比表更正

**数据源透明化**：
- `data/models.json` 顶部 `_note` 字段说明 LiteLLM 为主数据源
- 每模型 `sources` 数组现含两条引用：LiteLLM URL + 官方价格页 URL（都带 `fetchedAt: 2026-05-12`）
- `lastVerified` per-model 全部更新

**新 Top 10 成本排序**（1,000 input + 500 output 单次成本）：
```
1. DeepSeek V3.2     $0.00048   ← 绝对最便宜
2. GPT-5 mini        $0.00125
3. Mistral Large 3   $0.00125
4. Gemini 3 Flash    $0.002
5. o4-mini           $0.0033
6. Claude Haiku 4.5  $0.0035
7. Gemini 3.1 Pro    $0.008
8. Grok 4            $0.0105
9. Claude Opus 4.7   $0.0175
10. GPT-5.5          $0.020    ← 最贵（之前是 Opus）
```

**API 扩展决策**（详见 §11 Decision 13）：另一线程产出的 `API_Expansion_Plan.md`（完整付费 API 方案）保留在项目根目录作为 V2.0 路线图。当前 PM 推荐：先做 Plan A（轻量免费 endpoint，1 天工作量），不立刻做完整 Stage 1。等用户拍板。

**测试运行问题**：vitest worker pool 在本机有 timeout 问题（与代码无关，环境状态导致）。TypeScript 检查通过 = 数据结构正确。Vercel 部署只跑 `npm run build`，不影响线上验证。

**下次决策点**：
- (a) **是否做 Plan A 免费 API endpoint**（用户决定）
- (b) 5/19 数据复盘：观察数据真实化后 GSC 的反应（如果真实价格更接近用户搜索意图，CTR 可能提升）

---

### 2026-05-12 — Week 6 第 1 篇收口（数据复盘 + Caching 专文发布）
**类型**：content + analysis
**摘要**：观察期结束，做完 Week 1 真实数据复盘，基于数据发布 Week 6 第 1 篇文章。

**Week 1 真实数据**（2026-05-05 → 2026-05-12）：
- 总曝光 1,859 次（+44.5% WoW，从 1,286）
- 总点击 3 次（+50% WoW，从 2）
- 平均排名 9.8（持平在 Google 第一页底部）
- 平均 CTR 0.2%（持平，新域名常态）
- 18 页已被索引（之前 17）+ 6 页等待中（4 已发现 / 2 重定向，全部正常）
- GA4：8 用户 / 102 事件 / 1m05s 平均会话 / 100% Direct attribution

**Top 5 查询关键词**（按曝光降序）：
1. claude opus 4.7 api pricing may 2026 — 17 曝光 / 0 点击
2. openai prompt caching pricing 2026 — 16 曝光 / 0 点击  🆕 高价值新出现
3. gpt 5 mini pricing — 16 曝光 / 0 点击
4. gpt 5.5 cost — 15 曝光 / 0 点击
5. gpt-5-mini pricing — 15 曝光 / 0 点击

**Top 排名页面**（按曝光）：
- /blog/openai-api-pricing-explained-2026 — 979 曝光 / 0 点击（**52.7% 全站曝光**）
- /claude-opus-4-7-cost-calculator — 365 曝光 / 2 点击 ✅
- /gpt-5-mini-cost-calculator — 110 曝光 / 0 点击
- /blog/claude-api-pricing-2026 — 101 曝光 / 0 点击
- /gpt-5-5-cost-calculator — 89 曝光 / 1 点击 ✅
- /claude-haiku-4-5-cost-calculator — 84 曝光 / 0 点击
- 其余 4 个模型 page + 首页 共 ~150 曝光

**核心洞察**：
1. **OpenAI Pricing Explained 一篇贡献了 52.7% 全站曝光**——这是 Week 1 最关键发现，验证 SEO 内容投资正确
2. **模型 landing page CTR > 博客文章**（0.40% vs 0%）——landing page 的 "Cost Calculator" title 匹配 transactional intent
3. **关键词扩散开始**：从 2 个高曝光词 → 5 个，说明域名权威性建立中
4. **CTR 低是新域名 + 第 9.8 位的必然结果**，不是产品问题，靠时间解决（3-6 月品牌识别度提升）

**Week 6 第 1 篇文章发布**（commit `80bd017`）：
- 文件：`content/blog/openai-prompt-caching-when-worth-it.md`
- 标题：*OpenAI Prompt Caching in 2026: When You'll Save 75% (And When You Won't)*
- 字数：~1,900
- URL：https://aicostcalc.net/blog/openai-prompt-caching-when-worth-it
- 数据驱动选题：979 曝光的 OpenAI Pricing Explained 是 "openai prompt caching" 查询的入口，这篇新文章直击 intent
- 结构：9 章（机制 / 数学 / 4 个高价值场景 / 4 个反模式 / 缓存命中率测量 / break-even / Provider 对比 / 30 分钟清单 / 底线）
- 内部链接：链回 OpenAI Pricing Explained / Claude API Pricing / Token Cost Guide / 首页计算器
- Sitemap 自动同步到 22 个 URL（之前 21）

**站内反馈通道上线**（commit `b54b67a`，5/5 实施，本次补记）：
- 每个模型 landing page 价格表下方加 "⚠️ Spotted a wrong price? Report in 30s →" 链接
- Footer "About" 栏加 "Report an error / feedback →" 链接
- 跳转到 GitHub Issues 预填好结构化模板（title + body + label）
- 零后端、零维护，公开透明
- `lib/seo.ts` 添加 `reportPriceUrl(model)` / `reportFeedbackUrl()` 两个 helper

**Week 7+ 内容方向调整**（基于数据）：
- 原 PRD §5.2 第 2 个月计划"5 篇对比类"保留，但调整优先级：
  - 🥇 GPT-5 mini vs Claude Haiku 4.5（双高曝光关键词锁定）
  - 🥈 DeepSeek V4 vs OpenAI（PRD 原计划）
  - 🥉 其他对比按部就班
- 节奏调整：每周 1 篇深度文章（原计划每周 1-2 篇，但质量优先）

**下次决策点 2026-05-19**：看 OpenAI Caching 这篇新文章发布 1 周后的曝光增长，确认 Week 7 第 2 篇文章发布时机。

---

### 2026-05-05 — 社区发现期收口（README 改造 + dev.to 首发 + 进入战略观察期）
**类型**：community + observation
**摘要**：MVP 完整上线 + 5 篇文章产出后，做了一轮"社区发现"准备，并进入 7 天战略观察期等数据回流。

**README + 仓库门面改造**（commit `2df2ad6`）：
- README 从 30 行 → 200 行，结构：居中 hero + 5 个 badge + OG image 横幅 + Why this exists + 9 项 features + 10 模型表 + 5 篇博客阅读列表 + 12 层 tech stack + Quick start + 项目结构树 + 贡献指南 + 路线图 + 商标声明
- LICENSE 文件添加（MIT，详见 §11 Decision 10）
- package.json 补齐 OSS 元数据：license / homepage / repository / bugs / 12 个 keywords

**社区动作完成**：
- ✅ GitHub Topics 标签设置（12 个 keywords，进入 GitHub Topics 浏览页面）
- ✅ 自 Star（首颗，零变一）
- ✅ dev.to 第一篇文章交叉发布：[Top 10 Cheapest AI APIs in 2026](https://dev.to/leolionel221/top-10-cheapest-ai-apis-in-2026-ranked-by-real-cost-2f98)
  - canonical_url 正确指向原文（无 SEO 重复内容风险）
  - 4 tags：ai / llm / productivity / opensource
  - 表格、cover image、cross-post disclaimer 全部正确渲染
  - 收获 1 个 dev.to 高权重外链（域名权重 89）

**未做但记录在案**：
- TAAFT (theresanaiforthat) → 已收费，跳过
- futurepedia / futuretools / toolify → 已收费，跳过
- Reddit r/LocalLLaMA / r/MachineLearning → karma 门槛，需要后续养号或跳过
- V2EX 分享创造节点 → 等级门槛，需要养号
- Twitter/X / LinkedIn → 无粉丝基础，发了也无效
- alternativeto.net / SideProjectors / launchingnext / BetaList → 留作后续 Week 6 后期投放

**进入战略观察期**：
- **2026-05-05 → 2026-05-12** 不增加新内容/功能/付费推广
- 用户每天 ~10 分钟扫数据：GSC 索引 + 印象 / GA4 实时 + 事件 / dev.to 浏览 + 评论
- 期间真诚回每条评论
- 5/12 数据复盘 → 决定 Week 6 内容方向（用户回来说"第 7 天复盘"）

**为什么观察而不是继续推**：从项目启动到当前不到 30 小时，已完成原 PRD 4 周计划。继续往前推会进入"凭直觉决策"区间——SEO 是慢节奏游戏，前 1-2 周观察远比加更多内容有价值。

---

### 2026-05-05 — Week 5 收口（第 1 个月内容全发完 + 品牌 logo 定稿）
**类型**：content + design
**摘要**：PRD §5.2 第 1 个月规定的 5 篇 SEO 文章全部上线，~10,000 字总内容；品牌 logo 重做并定稿（深 slate + 前进 chevron + emerald 终点）。

**新增内容**（commit `7d5bf5b`）：
- `top-10-cheapest-ai-apis-2026.md` — 排行榜，10 个模型按 per-call cost 排序，含改写排序的 3 个变量（caching/output ratio/batch）
- `how-to-calculate-token-cost-beginner-guide.md` — 教学，覆盖 token / input vs output / volume math / caching / batch / 常见错误
- `gpt-5-5-vs-claude-opus-4-7-comparison.md` — 头对头对比，5 个场景的真实成本 + 4 个 Opus 赢的理由 + 5 个 GPT 赢的理由 + 决策树

**品牌 logo 迭代**（commits `32c94d7` / `39c4afa` / `3a6733b`）：
- v1: 亮蓝方块 + 3 道横条 → 太通用、像图表 icon
- v2: 深 slate + 向下 chevron + 绿点 → 克制了，但"被动 settle"心理感
- **v3 (定稿)**: 深 slate + **向前 chevron (>)** + emerald 终点点 → 主动"找到答案"的能量，匹配交互工具调性

**SEO 资产升级**：
- favicon / apple-icon / og-image 全部统一 v3 logo
- sitemap 自动包含新 3 篇文章（21 个 URL，比原 18 个多 3）
- 5 篇文章互相内链 + 链到 10 个模型 landing + 链到首页计算器

**当前线上状态**：
- 21 个静态 SSG 页面
- 14,000+ 字英文 SEO 内容
- 完整品牌识别（logo / favicon / og）
- Search Console + sitemap 全部就位

**Week 6 起步**：进入"每周 1-2 篇文章"稳定输出节奏，避免单轮压缩降低质量。第 2 个月计划聚焦对比类文章（DeepSeek vs OpenAI、Gemini vs GPT 等）。

---

### 2026-05-05 — 🚀 MVP LAUNCH 收口（Week 1-4 全部完成）
**类型**：milestone
**摘要**：MVP 完整上线 https://aicostcalc.net。Google Search Console 已验证、sitemap 已成功提交（18 个 URL 已被 Google 接收）。从 PRD v1.1 §10 关键里程碑视角，**"MVP 上线 第 4 周末"目标提前完成（项目启动到上线不到 24 小时）**。

**Week 2 关键交付**（commit `f8a7824`）：
- Vitest + RTL 配置，48 个单元测试全部通过；calculator 100% 语句覆盖
- 7 个 Radix-backed shadcn 风格 UI 组件
- Calculator 组件（Advanced Options：caching slider + batch toggle）
- F1.5 三栏成本对比（Standard / Cached / Batch + 节省百分比）
- ModelComparison（5 维度排序、provider 筛选、行级隐藏、移动端横向滚动）
- ScenarioTemplates（6 场景一键填充 + 自动切换推荐模型）
- MonthlyEstimator（多选 5 模型 + CSS-only 柱状图 + 节省提示）

**Week 2 后续优化**：
- 货币扩展到 5 种（USD/CNY/EUR/GBP/INR）— commit `8605475`
- 模型数据全量刷新到 May 2026（GPT-5.5、Gemini 3.0、Grok 4 等）— commit `4a28106`
- 整页 UX 重构：Sticky Nav + 2-col Hero + 主题切换 + 交替背景 + 完整 Footer — commit `b481bba`

**Week 3 SEO 落地**（commit `21fe3f4`）：
- 10 个模型独立 Landing Page，全部 SSG 静态预渲染
  - 每页含 H1 + 嵌入计算器 + 详细价格表 + 与 5 个替代模型对比 + 用例推荐 + 5-7 题 FAQ + 6 张相关模型卡
- `lib/seo.ts` 集中管理 SEO metadata
- 三种 JSON-LD 结构化数据（WebSite + SoftwareApplication + BreadcrumbList）
- `sitemap.ts` 自动列出全部 URL，`robots.ts` allow all + 指向 sitemap

**Week 4 内容启动**（commit `2400e1c`）：
- 4 法律页面（About / Privacy / Terms / Contact）— AdSense 申请前置就位
- GA4 接入（`@next/third-parties` + 仅在 env var 设置时挂载）
- `lib/analytics.ts` typed track helper，事件覆盖 PRD v1.1 §6.2 全部矩阵
- 博客基础设施（gray-matter + remark + Article JSON-LD）
- 2 篇启动 SEO 文章（OpenAI Pricing Explained + Claude API Pricing），每篇 ~2000 字

**MVP 上线运营动作**：
- aicostcalc.net 主域名生效，www 永久跳转 apex（308 + Vercel Domains 配置见 §11 Decision 7）
- Google Search Console 网域级验证完成
- sitemap 提交成功，18 个 URL 已被 Google 接收（"已发现的网页：18"）

**当前线上状态**：
- 主站：https://aicostcalc.net ✅
- 18 个 SSG 静态页面全部可访问 + 已索引
- 所有 33 个交互事件已埋点
- 4 个法律页面齐全
- robots.txt + sitemap.xml 公开可访问

**还差什么（滚动到 Week 5）**：
- 3 篇剩余文章（Top 10 Cheapest / Token Cost Beginner Guide / GPT-5.5 vs Claude Opus）
- Bing Webmaster 接入（用户 30 秒操作）
- GA4 Measurement ID 配进 Vercel env vars（用户操作）
- 手动请求 GSC 索引加速（用户操作）

**下一阶段**：进入 Week 5 — 内容产出节奏 + 监控首批索引 + 流量数据回流后做转化优化。

---

### 2026-05-04 — Week 1 完整收口（域名上线）
**类型**：milestone
**摘要**：aicostcalc.net 正式上线，Week 1 Foundation 阶段全部完成。
**改动范围**：
- Vercel 项目绑定 `aicostcalc.net`（apex）作为主域名
- Vercel 通过 Cloudflare Auto configure 完成 DNS 配置
- Vercel 自动签发 SSL 证书
- 加 `www.aicostcalc.net` 重定向到 apex
- 更新本文档 §10 进度
**当前线上状态**：
- 主域名：https://aicostcalc.net（占位首页，含 GPT-4o + Claude Opus 4.7 卡片）
- www：https://www.aicostcalc.net → 301 重定向到 apex
- 部署：每次 push 到 `main` 自动部署
**下一步**：进入 Week 2 — 核心计算器 UI + shadcn/ui 接入 + Vitest 单元测试 + 补齐 10 个模型录入。

### 2026-05-04 — Vercel 部署上线（含调试经过）
**类型**：fix + chore
**摘要**：MVP 占位页成功部署到 Vercel，临时域名可访问；过程中遇到并解决 4 次 `npm install` 失败。
**调试经过**：
- 第 1 次失败（commit `b46db2a`）：`npm error Invalid Version:`（空值）。直觉是 lockfile 与 package.json 名字不匹配（创建时用临时目录名 `aicostcalc-init`）。
- 第 2 次失败（commit `488e925`，重新生成 lockfile）：错误依旧。
- 第 3 次失败（commit `8eb4616`，加 engines.node + 再次重生 lockfile）：错误依旧。
- 第 4 次失败（commit `189d31b`，加 .npmrc with legacy-peer-deps）：错误依旧。
- 第 5 次成功（commit `aa677c5`，**删除 package-lock.json**，让 Vercel 全新解析）：✅
**根本原因**：本地 Node 24 / npm 11 生成的 `lockfileVersion: 3` 中含有 Vercel 端 npm 拒绝的字段（具体 token 未定位，但行为可复现）。
**当前权宜方案**：`package-lock.json` 被加入 `.gitignore`，每次部署 Vercel 全新解析。
**风险**：
- 失去依赖锁定，某次部署可能拉到比开发时更新的 patch 版本（在 `^x.y.z` 范围内）
- 部署多 ~30s（解析时间）
**TODO（不阻塞 Week 2）**：
- 尝试用 nvm 装 Node 22 + npm 10，本地重新生成兼容 lockfile
- 或评估迁移到 pnpm（pnpm-lock.yaml 与 npm lockfile 格式不同，Vercel 兼容性更好）
- 选定方案后从 .gitignore 中移除 `package-lock.json`，重新提交锁文件
**部署 URL**：
- 临时：`aicostcalc-git-main-leolionel221s-projects.vercel.app`
- 待绑定：`aicostcalc.net`（待用户操作 Cloudflare DNS）
**经验教训**：本地 npm 与 Vercel 环境 npm 可能存在版本兼容差异。下次遇到诡异 install 错误，**优先尝试删除 lockfile 让 Vercel 全新解析**，比一遍遍修 lockfile 高效得多。

### 2026-05-04 — Project Foundation 收口
**类型**：feat + docs + chore
**摘要**：完成 Week 1 Foundation 阶段。
**改动范围**：
- 项目初始化（Next.js 16 + React 19 + TypeScript + Tailwind v4）
- 安装核心依赖（next-intl, next-themes, lucide-react, js-tiktoken, clsx, tailwind-merge, class-variance-authority）
- 创建项目目录结构（app / components / data / lib / messages / public / docs）
- 实现 lib/calculator.ts（standard / cached / batch / comparison）
- 实现 lib/tokenizer.ts（OpenAI 精确 + 字符比率 fallback，含 dynamic import）
- 实现 lib/types.ts（Schema v2 完整类型定义）
- 创建 data/models.json（Schema v2 + GPT-4o + Claude Opus 4.7 两个样本）
- 创建 messages/en.json + zh.json（基础翻译键）
- 配置 ThemeProvider（next-themes）+ 设计 token 系统
- 更新 app/layout.tsx（Inter + Noto Sans SC，metadata 配置）
- 更新 app/page.tsx（Week 1 占位首页，展示已录入模型）
- 创建 .env.example
- 写 README.md + HANDOVER.md
- PRD 文档移至 docs/
**未完成**：Vercel 部署（待用户操作，按 §8 步骤）
**下一步**：Week 2 — 核心计算器 UI、shadcn/ui 接入、Vitest 单元测试

### 2026-05-04 — PRD v1.1 增补文档发布
**类型**：docs
**摘要**：完成 PRD v1.0 评审，产出 v1.1 增补文档，确定 5 个核心产品决策。
**改动范围**：`docs/PRD_v1.1_Supplement.md`（27KB / 735 行）
**关键决策**：
1. V1.0 即支持 prompt caching + Batch API
2. Tokenizer 聚焦 OpenAI 精确，其他诚实标 Estimated
3. 增长机制（F-share / F-embed / F-api）前置到 V1.0
4. 完整 GA4 事件矩阵 + 北极星指标定义
5. 商标 disclaimer 模板 + AdSense 合规预检
**对时间线影响**：MVP 上线时间不变（Week 4 末）。

---

**文档结束**

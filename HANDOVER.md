# 项目交接文档 — AI API Cost Calculator

> **本文档是项目的"真相源头"。**任何接手这个项目的人或 AI（包括未来的我自己）都应该先读完它。
>
> 维护规则：每次"收口"（一个改动告一段落）都必须更新本文档相关章节，并在变更日志追加记录。

**最后更新**：2026-05-04
**当前阶段**：Week 1 — Foundation 已搭建
**下一步**：Week 2 — 核心计算器 UI + 完成 10 个模型录入

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
1. 覆盖最全（20+ 模型）
2. 中英双语（默认英文）
3. 场景化模板
4. 配套深度 SEO 内容

---

## 2. 技术栈

| 层级 | 选型 | 版本 | 说明 |
|---|---|---|---|
| 框架 | Next.js | 16.x | App Router，PRD 写 14 但实际用最新版 |
| UI 库 | React | 19.x | 含 Server Components |
| 语言 | TypeScript | 5.x | 严格模式 |
| 样式 | Tailwind CSS | 4.x | CSS-based config，新版语法 |
| 国际化 | next-intl | 4.x | 路由 `/` 英文，`/zh/` 中文（V1.0 暂未启用 routing，V1.0 末或 Week 3 接入） |
| 暗黑模式 | next-themes | 0.4 | system / light / dark |
| 图标 | lucide-react | 1.x | shadcn/ui 默认 icon 库 |
| Tokenizer | js-tiktoken | 1.x | 仅 OpenAI 系精确，其他用估算 |
| 字体 | Inter + Noto Sans SC | Google Fonts | 中英统一观感 |
| 构建 | Turbopack | Next.js 内置 | dev 和 build 都启用 |

**未安装但 PRD 计划要用的**：
- shadcn/ui — 第一次需要组件时执行 `npx shadcn@latest init` 再 `add <component>`
- @vercel/analytics — 部署到 Vercel 后再加
- 测试框架（Vitest + React Testing Library）— Week 2 实现 calculator.test.ts 时安装

---

## 3. 项目目录结构

```
/Users/chenze/Desktop/AI API Cost Calculator/   ← 项目根 = Git 仓库根
├── app/                       # Next.js App Router 路由
│   ├── layout.tsx              # 根布局（含 ThemeProvider、字体）
│   ├── page.tsx                # 首页（当前是 Week 1 占位）
│   ├── providers.tsx           # ThemeProvider 包装
│   └── globals.css             # 全局样式 + design tokens
├── components/
│   └── ui/                     # shadcn/ui 组件（待 Week 2 添加）
├── data/
│   └── models.json             # 核心模型价格表 (Schema v2)
├── docs/                       # 产品文档（不进 build）
│   ├── AI_API_Cost_Calculator_PRD.pdf
│   └── PRD_v1.1_Supplement.md
├── lib/
│   ├── types.ts                # TypeScript 类型定义
│   ├── calculator.ts           # 成本计算逻辑（标准/缓存/批处理）
│   ├── tokenizer.ts            # Token 估算（OpenAI tiktoken + 字符比率 fallback）
│   └── utils.ts                # cn() helper for shadcn
├── messages/
│   ├── en.json                 # 英文翻译
│   └── zh.json                 # 中文翻译
├── public/
│   └── logos/                  # 各 AI provider 的 logo（SVG）
├── AGENTS.md                   # AI 助手提示（Next.js 16 注意事项）
├── CLAUDE.md                   # 链到 AGENTS.md
├── HANDOVER.md                 # 本文档
├── README.md                   # 项目入口介绍
├── PRD_v1.1_Supplement.md → docs/PRD_v1.1_Supplement.md
├── package.json
├── tsconfig.json
├── eslint.config.mjs
├── next.config.ts
├── postcss.config.mjs
├── .env.example
├── .gitignore
└── next-env.d.ts
```

**约定**：
- 业务逻辑在 `lib/`，UI 组件在 `components/`，路由页面在 `app/`
- 数据全部在 `data/`，JSON 优先（轻量、Git 友好、SSG 直接 import）
- 路径别名 `@/*` 指向项目根

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

**当前录入模型**：2 个（GPT-4o, Claude Opus 4.7）— Week 2 补齐到 10 个。

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

### 5.1 `lib/calculator.ts`

提供 4 个函数：
- `calculateStandard(input, output, model)` — 标准计算
- `calculateCached(input, output, model, cachedPortion)` — 含缓存折扣
- `calculateBatch(input, output, model)` — Batch API 折扣
- `calculateCost(input, output, model, options)` — 根据 options 自动选择
- `calculateComparison(input, output, model, cachedPortion)` — 三栏对比（用于 F1.5）
- `estimateMonthlyCost(costPerCall, callsPerDay)` — 月度预测

**单元测试要求**：100% 覆盖（PRD v1.1 §7.1）。Week 2 接入 Vitest。

### 5.2 `lib/tokenizer.ts`

- OpenAI 系（`encoder !== "approximate"`）：动态导入 `js-tiktoken`，精确计数
- 其他模型：用 `approximationRatio`（中/英/代码不同比率）估算
- 返回 `{ count, exact: boolean }`，UI 上根据 `exact` 显示 ✓ Exact 或 ≈ Estimated

**注意**：`js-tiktoken` 词表 1-2MB，必须 dynamic import 避免影响首屏。

### 5.3 设计 Token（`app/globals.css`）

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

---

## 6. 本地开发

```bash
# 首次
npm install

# 日常开发
npm run dev          # 启动 dev server (http://localhost:3000)

# 部署前自检
npm run type-check   # TS 检查
npm run lint         # ESLint
npm run build        # 验证 build 通过
```

**Node 版本**：建议 20+，开发用 24.12 验证过。

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
- Node.js Version: 22.x（推荐）

---

## 9. 域名与服务清单

| 服务 | 用途 | 账号 | 备注 |
|---|---|---|---|
| 域名注册 | aicostcalc.net | Cloudflare Registrar (Lionelchen221@gmail.com) | $11.86/年 |
| DNS | aicostcalc.net | Cloudflare | 同账号 |
| 部署 | aicostcalc.net | Vercel（Hobby tier，待绑定 GitHub） | 免费 |
| 代码托管 | aicostcalc | GitHub: Leolionel221 | Public repo |
| 分析 | TBD | Google Analytics 4 + Plausible | Week 4 接入 |
| 错误监控 | TBD | Sentry | Week 4 或更晚 |
| AdSense | TBD | Google AdSense | 第 12 周后申请 |

**密钥管理**：所有 secret 通过 Vercel Dashboard → Settings → Environment Variables 配置，不进 Git。

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
- [x] Vercel 部署成功（commit `aa677c5`，临时域名 live）
- [ ] 绑定 aicostcalc.net 自定义域名（待用户在 Cloudflare DNS 操作）
- [ ] **TODO**：解决 lockfile 兼容问题，恢复 `package-lock.json` 进 git（详见 §16 变更日志）

### Week 2 — 核心功能（待开始）
- [ ] 安装 Vitest + RTL，写 calculator.test.ts（100% 覆盖）
- [ ] 安装 shadcn/ui，引入 Button / Input / Select / Slider / Card / Table
- [ ] 实现 Calculator 组件（含 Advanced Options 折叠面板）
- [ ] 实现 ModelComparison 组件（多模型横向对比表）
- [ ] 实现 ScenarioTemplates 组件（6 个场景模板）
- [ ] 实现 F1.5 三栏成本对比（Standard / Cached / Batch）
- [ ] 补齐 10 个模型到 models.json
- [ ] 月度成本预测器

### Week 3 — 页面与多语言
- [ ] next-intl routing 启用 (`/` vs `/zh/`)
- [ ] 6 个模型独立 Landing Page
- [ ] SEO meta 标签 + JSON-LD
- [ ] sitemap.ts + robots.ts

### Week 4 — 内容启动
- [ ] 5 篇基础文章（MDX）
- [ ] 法律页面（Privacy / Terms / Contact / About）
- [ ] GA4 接入 + 完整事件追踪
- [ ] 提交 Search Console / Bing Webmaster
- [ ] **MVP 上线**

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

---

## 12. 待办与挂起项

近期需用户拍板的事项：

- [ ] **Logo 设计**：自己画 / v0.dev / Fiverr 外包？（不阻塞 MVP，但上线前要有）
- [ ] **价格爬虫自动化**：第 1 个月手动维护，第 2 个月再上 Cloudflare Worker（PRD v1.1 §11）
- [ ] **博客平台**：V1.0 用 MDX 直接写在 repo（推荐），V1.5+ 评估是否接 Notion / Sanity
- [ ] **A/B 测试方案**：留到 V1.2 第 4 个月再上（Vercel Edge Config 或 GrowthBook）

阻塞 Week 2 开发的：无。

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

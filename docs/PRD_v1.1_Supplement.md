# AI API Cost Calculator — 产品开发文档增补 (PRD v1.1)

**版本**：v1.1（增补）
**日期**：2026-05-04
**状态**：已确认，进入开发
**关系**：本文档是对 `AI_API_Cost_Calculator_PRD.pdf` (v1.0) 的增补与修订，与 v1.0 并行使用。**v1.0 未涉及部分仍以 v1.0 为准；本文档与 v1.0 冲突时以本文档为准。**

---

## 一、修订摘要

v1.0 评审后识别出三类缺口，本增补文档逐一覆盖：

| 类别 | v1.0 状态 | v1.1 处理 |
|---|---|---|
| **定价复杂度**（caching / batch / vision / reasoning） | 仅覆盖 input + output | V1.0 加 caching + batch；V1.1 加 vision；reasoning V1.2 |
| **Tokenizer 精度** | V1.5 才接 tiktoken | OpenAI 系提前到 V1.0 精确化；其他保持估算并明确标注 |
| **数据维护流程** | 仅约定每月 1 日更新 | 增加 SOP、schema 版本化、价格历史追溯 |
| **UI/UX 规范** | 仅功能描述 | 增加 wireframe 要求、设计 token、响应式断点 |
| **增长机制**（分享/嵌入） | 缺失 | 新增 F-share、F-embed、F-api |
| **数据追踪** | 仅约定配 GA4 | 完整事件矩阵 + 北极星指标定义 |
| **测试策略** | 缺失 | 核心计算函数 100% 单测覆盖 |
| **法律细化** | 仅基础页面 | 商标 disclaimer 模板、AdSense 合规预检 |

**对开发节奏影响**：第 1-2 周吸收新增工作量，**MVP 上线时间不变（第 4 周末）**。

---

## 二、核心产品决策

### 2.1 决策一：定价模型扩展

**问题**：2026 年 LLM 真实定价已不止 input/output 两个维度。Anthropic prompt caching 读价可降至正常的 10%，OpenAI Batch API 50% off，长 system prompt 场景的真实成本与简单计算结果可差 5-10x。如果计算器算不出这部分差异，用户对账单一比对就知道工具不靠谱。

**决策**：分阶段覆盖，但 schema 一次性预留所有字段。

| 维度 | V1.0 | V1.1 | V1.2 | 不做 |
|---|---|---|---|---|
| 标准 input/output | ✅ | - | - | - |
| Prompt caching（read price） | ✅ | - | - | - |
| Cache write surcharge（Anthropic/Gemini） | ✅ | - | - | - |
| Batch API 折扣 | ✅ | - | - | - |
| Vision per-image | - | ✅ | - | - |
| Reasoning tokens | - | - | ✅ | - |
| Fine-tuned pricing | - | - | - | ❌ |
| Audio (Realtime) | - | - | - | ❌ |

**理由**：
- Caching 是当前最大的"省钱杠杆"，做 RAG / 长 system prompt 的开发者超刚需，且与 SEO 内容强协同（"How to Reduce Bill by 70%" 文章可直接嵌入 caching toggle）
- Batch 是 toggle，零增量复杂度
- Vision/reasoning 数据维护更复杂且 token 估算难度高，延后
- Fine-tuned / Audio 用户群太小，维护成本不划算

### 2.2 决策二：Tokenizer 精度策略

**问题**：char-ratio 估算（英文 4:1）短文本误差可达 20-30%。但各家 tokenizer 不同，全部精确化代价大。

**决策**：聚焦 OpenAI 系精确化，其他诚实标注估算。

| 模型族 | V1.0 | V1.1 | V1.2 |
|---|---|---|---|
| OpenAI (GPT-4o, o1, o3, o3-mini) | ✅ js-tiktoken (`o200k_base`) | - | - |
| OpenAI legacy (GPT-3.5) | ✅ js-tiktoken (`cl100k_base`) | - | - |
| Anthropic (Claude) | ❌ Estimated | ✅ 近似 BPE 实现 | - |
| Google (Gemini) | ❌ Estimated | - | ✅ SentencePiece 或近似 |
| DeepSeek / xAI / Mistral / Llama | ❌ Estimated | ❌ Estimated | ✅ 视社区库成熟度 |

**UI 处理**：
- 精确计算的模型，token 数旁显示 ✓ "Exact"
- 估算的模型，显示 ≈ "Estimated" 并 tooltip 解释："Based on character ratio. Actual count may vary 10-20%."
- **这种透明度本身是品牌资产**，配套 SEO 文章 _"Why Most AI Cost Calculators Are 30% Wrong"_

**Bundle 影响**：tiktoken 词表 ~1-2MB，使用 dynamic import，仅在用户访问 OpenAI 系页面时加载，首屏无影响。

### 2.3 决策三：增长机制前置

v1.0 没有任何分享 / 嵌入机制，对工具站是重大遗漏。**新增 F-share、F-embed、F-api 进入 V1.0**——工作量小但 SEO 复利效应大。

---

## 三、新增/修订功能规格

### 3.1 F1 升级：计算器加 Advanced Options

在原计算器下方增加可折叠面板（默认折叠）：

```
┌─ Advanced options ▼ ─────────────────────┐
│ ☑ Use prompt caching                      │
│   Cached portion of input: [====|====] 50%│
│                                            │
│ ☐ Use Batch API (~24h delay, 50% off)     │
│                                            │
│ Currency: ⦿ USD  ◯ CNY                    │
└────────────────────────────────────────────┘
```

**交互**：
- 切换任一选项，结果区实时刷新
- Cached portion 滑块仅在 caching 勾选时启用
- 勾选 caching 但模型不支持时，显示 disabled + tooltip："This model does not support prompt caching"
- Currency 默认根据 locale 自动选择（中文 → CNY，英文 → USD）

**计算逻辑**（伪代码）：

```ts
function calculateCost(input, output, model, options) {
  const { cachingEnabled, cachedPortion = 0, batchEnabled } = options;
  
  let inputPrice = model.pricing.input;
  let outputPrice = model.pricing.output;
  
  if (batchEnabled && model.pricing.batchInput) {
    inputPrice = model.pricing.batchInput;
    outputPrice = model.pricing.batchOutput;
  }
  
  let inputCost;
  if (cachingEnabled && model.pricing.cachedInput) {
    const cachedTokens = input * cachedPortion;
    const uncachedTokens = input - cachedTokens;
    inputCost = (uncachedTokens / 1e6) * inputPrice 
              + (cachedTokens / 1e6) * model.pricing.cachedInput;
    // Anthropic/Gemini: first call still pays cache write surcharge
    // 在 UI 中通过额外说明告知，不计入单次成本
  } else {
    inputCost = (input / 1e6) * inputPrice;
  }
  
  const outputCost = (output / 1e6) * outputPrice;
  return { inputCost, outputCost, totalCost: inputCost + outputCost };
}
```

### 3.2 F1.5 新增：成本三栏对比

在结果区下方默认展示三栏对比，让用户直观看到节省空间：

```
┌────────────────┬────────────────┬────────────────┐
│   Standard     │ With Caching   │   With Batch   │
│   $0.0234      │   $0.0089      │   $0.0117      │
│                │ Save 62% ↓     │ Save 50% ↓     │
└────────────────┴────────────────┴────────────────┘
```

**作用**：
- 视觉化"省钱潜力"，强化用户对工具的价值感知
- 节省百分比直接成为 SEO 文章的截图素材
- 引导用户去探索 Advanced options

**展示规则**：
- 模型不支持某项时，对应栏显示 "Not supported" 灰态
- 三栏始终展示当前模型，与用户在 Advanced options 中的选择无关（即使没勾 caching，也展示能省多少）

### 3.3 F7 提前并降级：OpenAI 系精确 tokenization

**v1.0 修订**：F7 从 V1.5 移至 V1.0，但范围限定 OpenAI 系。

**实现**：
- 依赖 `js-tiktoken` (~1.2MB, 动态加载)
- 模型 metadata 中 `tokenization.encoder` 字段决定使用哪个 encoder
- 估算函数作为 fallback：`if (encoder == "approximate") use ratio`
- 用户输入文本时实时计算（debounce 300ms）

### 3.4 F-share 新增：分享与嵌入机制

**3.4.1 URL 编码深链接**

任何计算结果都可生成可分享 URL：

```
/calculator?model=gpt-4o&input=1000&output=500&caching=1&cachedPortion=0.5&batch=0
```

- "Share" 按钮位于结果区右上
- 点击复制到剪贴板，提示 toast: "Link copied"
- 该 URL 打开后自动还原所有参数和 Advanced options 状态

**3.4.2 复制为图片**

- 结果区右上 "Export as image" 按钮
- 使用 `html-to-image` 库截图含计算结果 + 模型 logo + 站点 watermark
- 输出 PNG 文件，文件名格式：`gpt-4o-cost-2026-05-04.png`

**3.4.3 嵌入到博客（V1.0 末或 V1.1 早期）**

```html
<iframe src="https://aicostcalc.com/embed?model=gpt-4o&theme=light"
        width="100%" height="400" frameborder="0"></iframe>
```

- 提供 `/embed` 路由，简化版 UI（无 nav、无 footer、单一计算器）
- 任何博客嵌入后形成天然反向链接
- 在 footer 加 "Powered by [our site]" 链回主站

### 3.5 F-api 新增：JSON API endpoint（V1.0）

公开只读 API，输出 models.json 数据：

```
GET /api/models           → 全量列表
GET /api/models/gpt-4o    → 单模型详情
GET /api/models?provider=openai → 筛选
```

**作用**：
- 让其他开发者能用我们的数据 → 反向链接 + 权威性
- API docs 本身是 SEO 资产
- 后续可扩展为付费 API（V2.0）

**速率限制**：60 req/min/IP（Vercel Edge Middleware 实现）
**CORS**：允许所有 origin
**Cache-Control**：`public, max-age=3600`

### 3.6 F-disclaimer 新增：数据信任标识

每个模型 Landing Page 显眼位置展示：

```
✓ Last verified: May 1, 2026
✓ Source: openai.com/api/pricing
ℹ Pricing updates monthly. Report errors →
```

**作用**：
- E-E-A-T (Experience, Expertise, Authority, Trust) 是 Google 对工具站的核心评估指标
- 透明度本身是与竞品的差异化

---

## 四、数据架构

### 4.1 models.json Schema v2

**完整示例**：

```json
{
  "schemaVersion": "2.0",
  "lastUpdated": "2026-05-01",
  "models": [
    {
      "id": "gpt-4o",
      "name": "GPT-4o",
      "shortName": "GPT-4o",
      "provider": "OpenAI",
      "providerId": "openai",
      "providerLogo": "/logos/openai.svg",
      "providerWebsite": "https://openai.com",
      
      "category": "flagship",
      "useCase": ["general", "vision", "coding"],
      "releaseDate": "2024-05-13",
      "status": "active",
      "deprecatedAt": null,
      "successorId": null,
      
      "pricing": {
        "currency": "USD",
        "unit": "per_1m_tokens",
        "input": 2.50,
        "output": 10.00,
        "cachedInput": 1.25,
        "cacheWrite": null,
        "batchInput": 1.25,
        "batchOutput": 5.00,
        "imagePerImage": null,
        "imageTokensFormula": null,
        "reasoningOutput": null,
        "fineTunedInput": null,
        "fineTunedOutput": null
      },
      
      "limits": {
        "contextWindow": 128000,
        "maxOutput": 16384,
        "maxImagesPerRequest": null,
        "knowledgeCutoff": "2024-10"
      },
      
      "tokenization": {
        "encoder": "o200k_base",
        "approximationRatio": {
          "english": 4,
          "chinese": 1.5,
          "code": 3
        }
      },
      
      "supports": {
        "vision": true,
        "audio": false,
        "tools": true,
        "streaming": true,
        "caching": true,
        "batch": true,
        "fineTuning": true,
        "structuredOutput": true
      },
      
      "lastVerified": "2026-05-01",
      "sources": [
        {
          "type": "official",
          "url": "https://openai.com/api/pricing",
          "fetchedAt": "2026-05-01"
        }
      ],
      
      "priceHistory": [
        {
          "date": "2024-05-13",
          "input": 5.00,
          "output": 15.00,
          "note": "Initial release"
        },
        {
          "date": "2024-08-06",
          "input": 2.50,
          "output": 10.00,
          "note": "Price reduction"
        }
      ],
      
      "i18n": {
        "en": {
          "tagline": "OpenAI's flagship multimodal model",
          "description": "GPT-4o is OpenAI's most capable model..."
        },
        "zh": {
          "tagline": "OpenAI 的旗舰多模态模型",
          "description": "GPT-4o 是 OpenAI 当前最强的模型..."
        }
      }
    }
  ]
}
```

**字段约定**：
- `null` 表示该维度不适用或未支持
- `pricing.unit` 永远是 `"per_1m_tokens"`（统一单位避免换算错误）
- `priceHistory` 记录每次价格变动，驱动 F8 趋势图
- `status` 取值：`active` / `deprecated` / `preview` / `legacy`
- `successorId` 在 deprecated 时指向继任模型（用于 UI 引导跳转）

### 4.2 V1.0 模型清单（10 个）

按 PRD v1.0 计划，第 2 周完成 10 个主流模型录入。建议优先级：

| 优先级 | 模型 | 理由 |
|---|---|---|
| 1 | GPT-4o | 流量最大 |
| 2 | GPT-4o-mini | 廉价版，对比刚需 |
| 3 | Claude Opus 4.7 | 旗舰对标 |
| 4 | Claude Haiku 4.5 | 廉价版对比 |
| 5 | o1 / o3-mini | reasoning 类代表 |
| 6 | Gemini 2.0 Pro | Google 系代表 |
| 7 | Gemini 2.0 Flash | 廉价版 |
| 8 | DeepSeek V3 | 中文用户高搜索 |
| 9 | Grok 3 | xAI 热度 |
| 10 | Mistral Large | 欧洲覆盖 |

V1.1 再补 Llama 3.3 (Together AI 托管)、Qwen、Command R+ 等。

### 4.3 数据维护 SOP

**每月 1 日固定流程**（自动化 + 人工审核）：

1. **抓取**：Cloudflare Worker 定时任务（cron `0 0 1 * *`）抓取 8 家官方价格页面 HTML
2. **Diff**：与当前 `models.json` 对比，输出差异报告（GitHub Issue 形式）
3. **人工审核**：PM（=我）review diff，确认价格变动
4. **更新**：编辑 `models.json`，更新 `lastUpdated`、`lastVerified`、`priceHistory`
5. **PR + 合并**：自动触发 Vercel 预览 + 部署
6. **通知**：发布博客文章 _"AI API Pricing Update — May 2026"_，列出所有变动
7. **社交推送**：Twitter / Hacker News / Reddit 发布更新（外链 + 流量回流）

**新模型上线 SOP**（24h 内响应）：

1. 监控信号源：OpenAI/Anthropic/Google 官方 Twitter、TechCrunch RSS、Hacker News 头条
2. 收到信号后 2h 内：录入 `models.json`，自动生成 Landing Page
3. 8h 内：发布博客 _"[New Model] Pricing & Cost Analysis"_
4. 24h 内：在 Reddit / HN 推送

**模型废弃流程**：

1. 官方公告废弃 → `status: "deprecated"`，记录 `deprecatedAt`
2. 在该模型 Landing Page 顶部显眼位置显示 banner："This model has been deprecated. Try [Successor Model] instead."
3. 6 个月后：移至 `data/models-legacy.json`，主页面 noindex 但保留可访问（保 SEO 旧链接）

### 4.4 价格信任与 E-E-A-T

每个模型详情页底部展示：

```markdown
## How we verify this data
- ✓ Last verified May 1, 2026 against OpenAI's official pricing page
- ✓ Updated monthly on the 1st
- ✓ Price history available since May 2024
- 📧 Found an error? [Report it →]
```

---

## 五、UI/UX 规范

### 5.1 设计系统基础

**主色板**（待美术细化，初版定调）：
- Primary: `#2563EB` (blue-600)，用于按钮、链接
- Accent: `#10B981` (emerald-500)，用于"省钱"、"折扣"等正向数据
- Warning: `#F59E0B` (amber-500)，用于 "Estimated" 标注
- Neutral: shadcn 默认 slate 系

**字体**：
- 英文：Inter (Google Fonts)
- 中文：Noto Sans SC
- 数字（成本数据）：tabular-nums 字体特性，避免抖动

**字号阶**（Tailwind token）：
- H1: `text-4xl md:text-5xl font-bold`
- H2: `text-2xl md:text-3xl font-semibold`
- H3: `text-xl font-semibold`
- Body: `text-base`
- 数据展示: `text-2xl font-mono tabular-nums`

**间距**：使用 Tailwind 默认 spacing scale，section 间距 `py-16 md:py-24`

### 5.2 关键页面布局（文字 wireframe）

#### 首页 `/`

```
┌─────────────────────────────────────────────┐
│ [Logo]  Calculator  Compare  Models  Blog  EN▾│
├─────────────────────────────────────────────┤
│                                             │
│  H1: Calculate AI API Costs in Seconds     │
│  Subtitle: Compare 20+ models, find the    │
│           cheapest for your use case        │
│                                             │
│  ┌─────────────┬──────────────────────┐    │
│  │  INPUT      │   RESULT             │    │
│  │  [Model ▾]  │   $0.0234 / call     │    │
│  │  [Textarea] │   ─────────────      │    │
│  │  Tokens: 0  │   Standard: $0.0234  │    │
│  │  ▾ Advanced │   Cached:   $0.0089  │    │
│  └─────────────┴──────────────────────┘    │
│                                             │
├─────────────────────────────────────────────┤
│  Compare All Models (sorted by cost)        │
│  ┌─────────────────────────────────────┐   │
│  │ [Sortable table, 8 default rows]    │   │
│  └─────────────────────────────────────┘   │
├─────────────────────────────────────────────┤
│  Try a use case template                    │
│  [Chatbot] [Code Asst] [RAG] [Translate]    │
├─────────────────────────────────────────────┤
│  Trust strip: ✓ Verified May 2026 | Source │
├─────────────────────────────────────────────┤
│  Footer: Blog | About | Privacy | Contact   │
└─────────────────────────────────────────────┘
```

#### 模型 Landing Page `/openai-cost-calculator`

```
H1: GPT-4o Cost Calculator — 2026 Pricing
└── Tagline: Calculate exact costs for OpenAI's flagship model

[Embedded Calculator, model pre-selected = GPT-4o]

## GPT-4o Pricing (per 1M tokens)
| Type        | Price  |
| Input       | $2.50  |
| Output      | $10.00 |
| Cached In   | $1.25  |
| Batch In    | $1.25  |
| Batch Out   | $5.00  |

## How GPT-4o compares to alternatives
[Comparison table with Claude, Gemini, etc.]

## When is GPT-4o the right choice?
[Use case recommendations, 200-300 words]

## FAQ (5-8 questions)
- How accurate is this calculator?
- Does this include caching discounts?
- ...

## Related articles
[3-5 internal links to blog posts]

[Trust strip: Last verified, source link]
```

### 5.3 响应式断点

| 断点 | 宽度 | 适配重点 |
|---|---|---|
| Mobile | < 640px | 计算器单列堆叠，对比表横向滚动 |
| Tablet | 640-1024px | 计算器双列，对比表显示主要列 |
| Desktop | ≥ 1024px | 完整布局 |

**关键约定**：
- 对比表移动端：固定模型名列，其他列横向滚动（不要折叠隐藏）
- 计算器移动端：输入区在上，结果区在下（不要并排）

### 5.4 暗黑模式

V1.0 支持，默认跟随系统：
- shadcn/ui 自带 dark mode token
- 实现：`<html class="dark">` 切换 + `next-themes` 库
- 右上角加 sun/moon toggle

**理由**：开发者用户群对暗黑模式偏好极强，几乎免费实现，不做反而显业余。

### 5.5 可访问性 (a11y)

V1.0 基线（WCAG AA）：
- 所有交互元素键盘可达（Tab 序列合理）
- Form 元素正确关联 label
- 颜色对比度 ≥ 4.5:1
- 数字结果区使用 `aria-live="polite"` 让屏幕阅读器朗读变化
- 图标按钮配 `aria-label`

---

## 六、数据追踪与北极星指标

### 6.1 北极星指标

**北极星**：`Monthly Affiliate Revenue = Affiliate Click Rate × Monthly UV × Avg Commission`

**驱动指标**（每周 review）：

| 指标 | 目标（第 6 月） | 数据源 |
|---|---|---|
| Monthly UV | ≥ 10,000 | GA4 |
| Affiliate CTR | ≥ 2% | GA4 event |
| Calculator completion rate | ≥ 50% | GA4 funnel |
| 进入 Google 前 10 关键词数 | ≥ 20 | Search Console |
| 博客文章平均停留 | ≥ 90s | GA4 |
| Share 行为 / Calculator Use | ≥ 5% | GA4 ratio |

### 6.2 GA4 事件矩阵

**计算器事件**：
- `calculator_used` (params: model_id, input_tokens, output_tokens)
- `model_selected` (params: model_id, selection_method: "dropdown"|"comparison"|"template")
- `advanced_options_opened`
- `caching_toggled` (params: enabled, cached_portion)
- `batch_toggled` (params: enabled)
- `currency_switched` (params: from, to)

**转化事件**（标为 conversion）：
- `affiliate_link_clicked` (params: partner_id, source_page) ⭐ 收入指标
- `share_link_copied` (params: model_id)
- `embed_code_copied` (params: model_id)
- `image_exported` (params: model_id)

**导航事件**：
- `comparison_table_filtered` (params: filter_type, value)
- `model_compared` (params: model_ids[])
- `scenario_template_selected` (params: template_id)
- `language_switched` (params: from, to)
- `model_landing_visited` (params: model_id)

**内容事件**：
- `blog_article_read` (50% scroll, params: article_id)
- `faq_expanded` (params: question_id)
- `external_source_clicked` (params: provider, url) — 信任建立指标

### 6.3 转化漏斗

```
Visit (UV)
  ↓ [calculator_used 50% target]
Calculator Used
  ↓ [advanced_options_opened 30% target]
Advanced Options Opened
  ↓ [model_compared 20% target]
Compared Models
  ↓ [affiliate_link_clicked 10% of step above]
Affiliate Click ⭐
```

第 4 个月开始针对每一步做 A/B 测试优化（用 Vercel Edge Config + 简单的 50/50 split）。

---

## 七、测试策略

### 7.1 单元测试（必须）

**`lib/calculator.test.ts`** — 100% 覆盖：
- 每个模型至少 1 个金标准测试（手算的预期值）
- caching 折扣计算
- batch 折扣计算
- caching + 部分缓存（如 50% cached portion）
- 货币换算（USD ↔ CNY）
- 边界：input=0, output=0, 超 contextWindow

**`lib/tokenizer.test.ts`** — 关键场景：
- OpenAI tiktoken 对照官方文档样本（"hello world" 应等于 2 tokens 等）
- 估算函数误差范围验证（与真实 tokenizer 对照，误差 < 30%）
- 中文/英文/代码混合文本

### 7.2 集成测试（建议）

**`components/Calculator.test.tsx`**：
- 用户输入 → 结果正确显示
- 切换模型 → 重新计算
- Toggle Advanced options → 状态保持

### 7.3 数据回归测试（每月更新后跑）

**`data/models.test.ts`**：
- Schema 校验（所有必需字段存在）
- 价格合理性范围检查（input < $200/1M，避免输入错误）
- `priceHistory` 时间序列合法（升序、无重复）

### 7.4 视觉回归（V1.1 可选）

Chromatic / Percy 截图对比，避免 UI 回归。

---

## 八、法律与合规细化

### 8.1 商标使用 disclaimer

每个模型 Landing Page footer 必须包含：

> **Trademark Notice**: [Provider Name], [Model Name], and related logos are trademarks of [Provider Legal Entity]. We are not affiliated with, endorsed by, or sponsored by [Provider]. Pricing data is provided for informational purposes only and may not reflect the most current rates. Please refer to [Provider's official pricing page](URL) for authoritative information.

**变体配置**：在 `data/models.json` 的 `provider` 字段中扩展 `legalEntity` 子字段，自动渲染。

### 8.2 全局免责声明

`/disclaimer` 页面 + 每个计算结果旁的小字：

> 本工具提供的成本估算仅供参考，实际费用以各 AI 服务商官方账单为准。本站不对因使用本工具产生的任何决策结果负责。请在做出商业决策前以官方文档核对最新价格。

### 8.3 AdSense 政策预防

**已知风险**：
- "价格"类内容可能被误判为金融建议 → 加 disclaimer 明确"非投资建议"
- 模型 logo 大量使用 → 确保都用官方 brand 资源（避免低质量 PNG）
- AdSense 申请前网站必须有：Privacy Policy / Terms / Contact / About 四个页面

**预申请 checklist**：
- [ ] 30+ 篇原创文章
- [ ] 4 个法律页面齐全
- [ ] 自然搜索流量 ≥ 100/天
- [ ] Mobile-friendly 通过 Google 测试
- [ ] Core Web Vitals 全绿
- [ ] 无版权侵权图片（图片来源 Unsplash / 自制）

### 8.4 Cookie 同意

- 欧盟 / 英国流量：首次访问显示 Cookie banner，使用 [Cookiebot](https://www.cookiebot.com/) 免费版
- 加州：提供 "Do Not Sell My Info" 链接（即使我们不卖，符合 CCPA 要求）
- 实现：next-cookiebot 或自实现简单 banner

---

## 九、修订后的开发节奏

### 9.1 调整后的时间线

| 周次 | 原 v1.0 任务 | v1.1 增量 |
|---|---|---|
| **第 1 周** | 域名、Cloudflare、Next.js 初始化、Vercel 部署 | + 设计系统 token 配置 + dark mode 接入 |
| **第 2 周** | models.json 10 个模型、核心计算器、对比表、月度预测 | + Schema v2、Advanced options、tiktoken 接入、单元测试 |
| **第 3 周** | 首页、6 个模型 Landing、中英翻译、SEO meta | + F-share 深链接 + 复制图片 + Trust strip |
| **第 4 周** | 5 篇基础文章、法律页面、sitemap、GA4 | + 完整事件追踪 + JSON API endpoint + 商标 disclaimer |
| **第 4 周末** | **MVP 上线** | （时间不变） |

### 9.2 V1.1 / V1.2 路线图

**V1.1（第 5-8 周）**：
- F-embed iframe 嵌入
- Vision per-image 计费
- Claude tokenizer 近似实现
- F8 价格趋势图（基于 priceHistory）
- 反向计算（"每月预算 $X 能用什么模型"）

**V1.2（第 9-12 周）**：
- Reasoning tokens 支持
- F9 成本优化智能建议
- Gemini tokenizer
- A/B 测试基础设施

---

## 十、关键里程碑（修订）

| 里程碑 | 时间 | 验收标准 |
|---|---|---|
| MVP 上线 | 第 4 周末 | 6 个核心页面可访问，计算器精确（OpenAI 系），Trust strip 完整 |
| 首篇 SEO 排名 | 第 8-12 周 | ≥ 1 篇文章进入 Google 前 50 |
| 第一批自然流量 | 第 16 周 | 月 UV ≥ 1,000，**计算器完成率 ≥ 40%** |
| AdSense 通过 | 第 12-16 周 | 申请通过，开始展示广告 |
| 第一笔联盟收入 | 第 16-20 周 | affiliate_link_clicked 事件 → 实际佣金到账 |
| 月入 $100 | 第 6 月 | 总收入达三位数 |

---

## 十一、待办与挂起项

以下项 v1.1 已识别但未完整定义，需后续补充：

- [ ] **品牌识别**：Logo 设计、域名最终确定（候选：aicostcalc.com / llmprice.io / aicalc.dev）
- [ ] **设计稿**：Figma 高保真稿（首页 + 模型 Landing），可在第 1-2 周用 v0.dev / Lovable 生成参考
- [ ] **博客平台技术选型**：MDX 还是接 Notion / Sanity？V1.0 用 MDX 即可，V1.5 再考虑 CMS
- [ ] **价格抓取爬虫**：Cloudflare Worker 实现，第 1 个月手动维护，第 2 个月自动化
- [ ] **A/B 测试方案**：V1.2 决定用 Vercel Edge Config 还是 GrowthBook

---

## 十二、版本变更记录

| 版本 | 日期 | 变更摘要 |
|---|---|---|
| v1.0 | 2026-05 | 初版 PRD（PDF） |
| v1.1 | 2026-05-04 | 增补 caching/batch 定价、tokenizer 提前、增长机制、追踪事件、测试策略、法律细化 |

---

**文档结束**

后续所有产品决策都将以增补版本形式追加（v1.2, v1.3...），不修改本文档。

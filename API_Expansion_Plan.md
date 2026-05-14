# AI Cost Calculator —— API 扩展产品规划

> **文档用途:** 这是给负责 AI Cost Calculator 网站开发的 Claude 线程的产品规划。目标是在现有网站基础上,叠加一个面向开发者的数据 API 产品,作为新的变现层。
>
> **当前状态:** AI Cost Calculator 网站已开发完成并上线,正在等待 SEO 起效。本规划描述的是下一阶段的功能扩展。

---

## 一、背景与目标

### 现状

AI Cost Calculator 现在是一个面向终端用户的工具网站,核心功能是计算和对比各 AI 模型的 API 调用成本。变现方式是 Google AdSense + 联盟营销。

### 要做什么

在现有网站的基础上,增加一个 **面向开发者的数据 API 服务**。其他开发者可以付费订阅,通过 API 获取标准化的 AI 模型元数据(价格、限速、能力、生命周期等)。

### 为什么做

1. **数据已经在维护** —— 网站本来就要维护模型价格数据,API 化几乎是零额外成本
2. **新增变现层** —— AdSense 收入有限,API 订阅是更高价值的收入来源
3. **不需要额外获客内容** —— API 用户是开发者,靠技术目录(RapidAPI 等)和 GitHub 获客,不依赖写文章
4. **市场有空白** —— 现有玩家(LLM-Stats、APIScout)都是网站形态,没有人把这些数据做成统一的、面向开发者的订阅 API

### 商业模式

订阅制 API,按调用量分级定价(详见第五部分)。

---

## 二、分阶段路线图

整个产品分三个阶段推进,**不要一次全做**。每个阶段都是一个可独立上线、可独立变现的里程碑。

### 阶段一:基础数据 API(MVP,优先做)

提供三类核心数据的查询 API:

- **价格数据** —— 各模型输入/输出/缓存价格(已有数据,直接 API 化)
- **限速数据** —— 各厂商各 tier 的 RPM/TPM/RPD 限制
- **能力数据** —— 各模型支持的功能(vision、function calling、structured output 等)

### 阶段二:对比与迁移 endpoint(阶段一稳定后再做)

在基础数据之上,增加对比类 endpoint:

- 任意两个模型的横向对比
- 迁移建议(从模型 A 换到模型 B 需要注意什么)

### 阶段三:高级迁移助手(远期,验证后再做)

完整的 Migration Assistant 功能,包括 prompt 格式转换建议、迁移成本估算等。本规划暂不展开阶段三的细节,等阶段一、二验证后再单独规划。

---

## 三、阶段一详细规格(本次开发重点)

### 3.1 技术架构

- 在现有 Next.js 项目中增加 `/api/v1/` 路由
- API 与现网站共用同一个域名、同一套部署(Vercel)
- 数据源:统一的 `data/models.json`(扩展现有的价格数据文件)
- 认证:API Key 机制(JWT 或简单 token 均可)
- 调用计数:记录每个 Key 的调用量,用于限额和计费
- 计费:集成 Stripe 订阅

### 3.2 数据结构扩展

现有的 `models.json` 需要扩展字段。每个模型的完整数据结构:

```json
{
  "id": "claude-opus-4-7",
  "name": "Claude Opus 4.7",
  "provider": "Anthropic",
  "providerId": "anthropic",

  "pricing": {
    "inputPricePer1M": 15.00,
    "outputPricePer1M": 75.00,
    "cachedInputPricePer1M": 1.50,
    "batchDiscountPercent": 50
  },

  "limits": {
    "contextWindow": 200000,
    "maxOutput": 8192,
    "rateLimits": {
      "tier1": { "rpm": 50, "tpm": 30000, "rpd": null },
      "tier2": { "rpm": 1000, "tpm": 80000, "rpd": null },
      "tier3": { "rpm": 2000, "tpm": 160000, "rpd": null },
      "tier4": { "rpm": 4000, "tpm": 400000, "rpd": null }
    }
  },

  "capabilities": {
    "vision": true,
    "functionCalling": true,
    "structuredOutput": true,
    "streaming": true,
    "promptCaching": true,
    "batchApi": true,
    "fineTuning": false,
    "inputFormats": ["text", "image"],
    "outputFormats": ["text"]
  },

  "lifecycle": {
    "releaseDate": "2026-XX-XX",
    "status": "active",
    "deprecationDate": null,
    "recommendedReplacement": null
  },

  "lastUpdated": "2026-05-01",
  "sourceUrl": "https://www.anthropic.com/pricing"
}
```

> **重要:** 上面的数值是结构示例,不是真实数据。实际数据必须从各厂商官网核对。价格、限速这些数据变化频繁,需要建立每月固定更新机制。

### 3.3 API Endpoints(阶段一)

#### `GET /api/v1/models`

返回所有模型的完整数据列表。

支持的 query 参数:
- `provider` —— 按厂商过滤(如 `?provider=anthropic`)
- `capability` —— 按能力过滤(如 `?capability=vision`)
- `status` —— 按生命周期状态过滤(如 `?status=active`)

#### `GET /api/v1/models/{id}`

返回单个模型的完整数据。

#### `GET /api/v1/pricing`

只返回所有模型的价格数据(轻量版,给只关心价格的用户)。

#### `GET /api/v1/calculate`

成本计算 endpoint。

query 参数:
- `model` —— 模型 id
- `inputTokens` —— 输入 token 数
- `outputTokens` —— 输出 token 数
- `callsPerMonth` —— (可选)每月调用次数,用于月度预测

返回:单次成本 + 月度成本 + 年度成本。

#### `GET /api/v1/changelog`

返回数据变更历史(价格变动、新模型上线、模型下线等)。这个 endpoint 是付费版的重要卖点,因为历史数据只能靠长期积累。

### 3.4 认证与限额机制

- 每个用户注册后获得一个 API Key
- 请求需在 header 中携带:`Authorization: Bearer {api_key}`
- 系统记录每个 Key 的月度调用量
- 超过套餐限额返回 `429 Too Many Requests`,并在响应中说明限额和重置时间
- 免费版 Key 也需要注册,方便追踪和后续转化

### 3.5 必须有的配套页面

- **`/api`** —— API 产品介绍页(讲清楚提供什么数据、怎么用、定价)
- **`/api/docs`** —— API 文档(每个 endpoint 的参数、返回示例、错误码)
- **`/api/dashboard`** —— 用户登录后查看自己的 API Key、调用量、账单
- 在现有网站合适位置增加 "For Developers" 入口,导流到 `/api`

---

## 四、数据维护机制(关键,不能忽视)

这是整个产品成败的核心。数据不准,产品就废了。

### 4.1 更新频率

- **价格数据:** 每月 1 日固定核对一次
- **限速数据:** 每月核对一次(变化较慢)
- **能力数据:** 每月核对 + 新模型发布时即时更新
- **生命周期数据:** 关注各厂商公告,有变化即时更新

### 4.2 自动化辅助

建议(阶段一可选,阶段二必做)写一套爬虫:
- 每天定时抓取各厂商定价页面
- 与上一次快照对比
- 发现变化时通知运营者人工确认
- 确认后更新数据库,并自动写入 changelog

### 4.3 数据源清单

需要持续监控的官方页面:
- OpenAI: openai.com/api/pricing
- Anthropic: anthropic.com/pricing
- Google AI: ai.google.dev/pricing
- DeepSeek: platform.deepseek.com/pricing
- xAI: x.ai/api
- Together AI: together.ai/pricing
- Groq: groq.com/pricing
- Mistral: mistral.ai (pricing 页)

### 4.4 透明度承诺

在 API 文档中明确标注:
- 每条数据的 `lastUpdated` 时间戳
- 数据来源 `sourceUrl`
- 一句话声明:数据每日监控、24 小时内更新;发现错误反馈可获赠免费时长

**不要承诺"100% 实时",这个承诺没人能做到,而且会带来客诉风险。**

---

## 五、定价方案

| 套餐 | 价格 | 月调用量 | 功能 |
|------|------|---------|------|
| Free | $0 | 1,000 次 | 基础数据查询,方便开发者试用 |
| Hobby | $9/月 | 100,000 次 | 全部基础 endpoint |
| Pro | $29/月 | 1,000,000 次 | + changelog 历史数据 + webhook 价格变更通知 |
| Business | $99/月 | 无限 | + 优先支持 + SLA |

定价逻辑:开发者自己写爬虫维护这些数据,人力成本远高于 $29/月。卖的是"省心",不是"独家"。

---

## 六、获客方式(不依赖写内容)

API 产品的获客可以做成"一次性投入,长期带量":

1. **上架 RapidAPI** —— 全球最大的 API 聚合市场,开发者会主动来搜,有自然流量
2. **上架 API 目录** —— APIs.guru、PublicAPIs 等
3. **GitHub 开源 SDK** —— 把 Python / JavaScript 版本的 SDK 开源,README 写清用法,开发者搜 "AI pricing API" 能找到
4. **现网站导流** —— AI Cost Calculator 已有的流量,通过 "For Developers" 入口转化
5. **开源基础数据集** —— 把 models.json 的基础版开源到 GitHub,吸引 star 和社区贡献(贡献者会帮忙更新数据),付费 API 卖的是实时更新版

以上都是配置型工作,不需要持续产出内容。

---

## 七、阶段二预告(本次不开发,仅说明方向)

阶段一稳定后,阶段二增加对比类 endpoint:

#### `GET /api/v1/compare?models=gpt-4o,claude-opus-4-7`

返回多个模型的横向对比(价格、限速、能力差异表)。

#### `GET /api/v1/migrate?from={modelA}&to={modelB}`

返回从模型 A 迁移到模型 B 的建议:
- 价格变化(会贵还是便宜,贵/便宜多少)
- 限速差异
- 能力差异(目标模型缺少哪些源模型的能力)
- Prompt 格式建议(如 OpenAI 偏好 markdown、Anthropic 偏好 XML 标签)
- 注意事项清单

这个 `migrate` endpoint 是高价值变现点,但依赖阶段一的数据库先稳定。

---

## 八、本次开发的具体任务清单

给开发线程的明确任务,按顺序执行:

1. 扩展 `data/models.json` 的数据结构(增加 limits、capabilities、lifecycle 字段)
2. 填充至少 10 个主流模型的完整数据(价格、限速、能力都要核对官网)
3. 实现 `/api/v1/` 路由和 5 个阶段一 endpoint
4. 实现 API Key 认证 + 调用计数机制
5. 集成 Stripe 订阅(4 个套餐)
6. 开发 `/api`、`/api/docs`、`/api/dashboard` 三个页面
7. 在现网站增加 "For Developers" 入口
8. 编写 changelog 数据的初始结构和录入流程
9. (可选)写基础版爬虫辅助数据更新

---

## 九、注意事项

1. **数据准确性高于一切。** 所有价格、限速数据上线前必须逐项核对官网,不能用示例值。
2. **不要承诺实时。** 文档措辞用"每日监控、24小时内更新",不要写"实时准确"。
3. **复用现有资产。** 不要新开域名、新建项目,就在现有 AI Cost Calculator 的代码库和域名上扩展。
4. **阶段一不要做迁移功能。** 先把基础数据 API 跑通、稳定,再考虑阶段二。
5. **changelog 从第一天就开始记录。** 历史数据是核心护城河,越早积累越值钱。

---

**规划结束。如对产品方向或技术细节有疑问,可反馈给产品方进一步讨论。**

# 古人早就说过 / Gu Ren Said

> 现代话 / 网络热梗 → 古诗文真实出处 → 手机传播卡片

**Gu Ren Said** helps you find authentic classical Chinese quotes that match modern Chinese slang, emotions, and everyday expressions.

它不是“AI 文言文翻译器”，而是一个**古诗文反查引擎**：输入一句现代话或网络热梗，先从知识库里检索真实存在的古诗文，再生成解释和适合传播的卡片。

```text
现代人说：我 emo 了

古人说：
抽刀断水水更流，举杯消愁愁更愁。

——唐·李白《宣州谢朓楼饯别校书叔云》
```

## 为什么做这个项目

很多“古文翻译器”会直接让大模型生成一句像古文的话，但这样很容易出现两个问题：

1. 句子看起来很古风，但古人没说过。
2. 出处看起来很可信，但其实是 AI 编的。

这个项目的核心原则是：

> **No hallucinated citations. 不编古文，不编出处。**

所以它的流程不是“让 AI 翻译”，而是：

```text
先检索真实古诗文
再解释为什么相似
最后生成可分享卡片
```

当前 MVP **默认不接入任何大模型**，查询成本几乎为 0 token。解释来自结构化字段和规则模板。后续如果接入大模型，也只会作为可选的文案润色层，不能直接生成古文和出处。

## Demo examples

| 现代说法 | 古人说 | 出处 |
|---|---|---|
| 我 emo 了 | 抽刀断水水更流，举杯消愁愁更愁。 | 唐·李白《宣州谢朓楼饯别校书叔云》 |
| 这事包的 / 稳了 | 长风破浪会有时，直挂云帆济沧海。 | 唐·李白《行路难·其一》 |
| 太卷了，想躺平 | 采菊东篱下，悠然见南山。 | 东晋·陶渊明《饮酒·其五》 |
| 这人太牛了 / 666 | 笔落惊风雨，诗成泣鬼神。 | 唐·杜甫《寄李十二白二十韵》 |
| 想家了 | 独在异乡为异客，每逢佳节倍思亲。 | 唐·王维《九月九日忆山东兄弟》 |
| 看开了 / 释怀了 | 回首向来萧瑟处，归去，也无风雨也无晴。 | 北宋·苏轼《定风波·莫听穿林打叶声》 |

## Features

- **真实出处**：每条结果包含原句、作者、朝代、篇名、上下文和匹配理由。
- **0 token by default**：默认不调用 OpenAI / DeepSeek / Claude 等大模型。
- **本地知识库检索**：内置数据兜底，可选 SQLite + FTS5 数据库。
- **热梗语义映射**：把 `emo`、`包的`、`躺平`、`内卷` 等转成可检索的情绪和主题。
- **移动端优先**：首页和结果卡片按手机浏览体验设计。
- **3:4 传播卡片**：适合小红书、朋友圈、视频号封面。
- **一键复制 / 下载 PNG**：方便直接拿去做内容分发。
- **可扩展向量检索**：预留 sqlite-vec / embedding 扩展路线。

## What it is not

This is **not** a free-form classical Chinese generator.

它不做这些事：

- 不让 AI 随便编一句“古人说”。
- 不输出没有出处的伪古文。
- 不把现代话逐字硬翻成文言文。
- 不保证每个热梗都有完美对应，只返回知识库中相对贴切的真实表达。

## How it works

```text
用户输入：我真的会谢
        ↓
1. 标准化 query
        ↓
2. 命中热梗映射
   例如：我真的会谢 → 无语 / 无奈 / 心累 / 离谱
        ↓
3. 扩展检索词和主题
        ↓
4. SQLite FTS5 或内置数据召回候选古诗文
        ↓
5. 根据主题、情绪、现代语义、人工权重 rerank
        ↓
6. 输出古诗文原句、作者、篇名、解释
        ↓
7. 生成 3:4 手机传播卡片
```

当前 MVP 的搜索由两层组成：

```text
内置数据检索：lib/data.ts + lib/search.ts
可选 SQLite：data/schema.sql + scripts/seed.ts + lib/db.server.ts
```

如果没有生成 `data/quotes.db`，项目仍然可以运行，会自动使用内置数据。

## Tech stack

- **Next.js App Router**：Web UI + API route
- **React**：移动端交互
- **SQLite + FTS5**：本地全文检索
- **better-sqlite3**：Node.js SQLite 访问
- **html-to-image**：将卡片下载为 PNG
- **TypeScript**：类型安全

## Quick start

```bash
pnpm install
pnpm db:seed
pnpm dev
```

然后打开：

```text
http://localhost:3000
```

不想生成 SQLite 数据库也可以直接运行：

```bash
pnpm install
pnpm dev
```

此时会使用 `lib/data.ts` 的内置种子数据。

## Scripts

```bash
pnpm dev       # start local dev server
pnpm build     # build production app
pnpm start     # start production server
pnpm db:seed   # generate data/quotes.db from seed data
```

## API usage

本地启动后，可以直接请求搜索接口：

```bash
curl -X POST http://localhost:3000/api/search \
  -H "Content-Type: application/json" \
  -d '{"query":"我 emo 了","limit":3}'
```

返回结构示例：

```json
{
  "query": "我 emo 了",
  "expanded": {
    "original": "我 emo 了",
    "terms": ["emo", "忧愁", "失意", "烦闷"],
    "themes": ["忧愁", "失意", "孤独"],
    "emotion": "sad"
  },
  "results": [
    {
      "quote": "抽刀断水水更流，举杯消愁愁更愁。",
      "author": "李白",
      "dynasty": "唐",
      "title": "宣州谢朓楼饯别校书叔云",
      "reason": "这句唐代李白的表达，和你的输入所包含的情绪低落、烦乱、情绪失控相近。"
    }
  ]
}
```

## Project structure

```text
.
├── app/
│   ├── api/search/route.ts      # Search API
│   ├── globals.css              # Mobile-first visual style
│   ├── layout.tsx               # SEO metadata / OG metadata
│   └── page.tsx                 # Home page
├── components/
│   ├── QuoteCard.tsx            # Share card + copy/download actions
│   └── SearchExperience.tsx     # Main product experience
├── data/
│   └── schema.sql               # SQLite / FTS5 schema
├── lib/
│   ├── data.ts                  # Seed quotes + slang mappings
│   ├── db.server.ts             # Optional SQLite search
│   ├── search.ts                # Query expansion + ranking
│   └── types.ts                 # Shared types
├── public/
│   └── og.svg                   # Open Graph image
└── scripts/
    └── seed.ts                  # Generate data/quotes.db
```

## Database design

核心表：

```sql
quotes
quotes_fts
slang_mappings
```

### `quotes`

存储真实古诗文记录：

```text
id
quote              # 古文原句
name/title         # 篇名
author             # 作者
dynasty            # 朝代
source             # 数据来源
context            # 上下文
translation        # 白话解释
themes             # 主题：忧愁 / 希望 / 归隐 / 友情
modern_meanings    # 可对应的现代说法
emotion            # 情绪标签
scene              # 使用场景
weight             # 人工精选权重
verified           # 是否校验过出处
```

### `quotes_fts`

SQLite FTS5 全文检索表，用于关键词召回。

### `slang_mappings`

把网络热梗转成可检索的语义标签，例如：

```text
emo → 忧愁 / 失意 / 烦闷 / 孤独
包的 → 信心 / 希望 / 成功
躺平 → 松弛 / 归隐 / 不争
内卷 → 压力 / 坚持 / 逆境
我真的会谢 → 无语 / 无奈 / 心累
```

## Add new quotes

目前最快的方式是修改 `lib/data.ts`。

新增一条 `QuoteRecord`：

```ts
{
  id: "su-shi-dingfengbo-letgo",
  quote: "回首向来萧瑟处，归去，也无风雨也无晴。",
  title: "定风波·莫听穿林打叶声",
  author: "苏轼",
  dynasty: "北宋",
  source: "东坡乐府",
  context: "竹杖芒鞋轻胜马，谁怕？一蓑烟雨任平生。",
  translation: "经历风雨后回头看，一切都可以放下。",
  themes: ["释怀", "豁达", "通透"],
  modernMeanings: ["算了", "释怀了", "不内耗了"],
  emotion: "relieved",
  scene: ["人生", "挫折", "雨天"],
  weight: 94
}
```

然后重新生成数据库：

```bash
pnpm db:seed
```

## Add new slang mappings

同样修改 `lib/data.ts` 中的 `SLANG_MAPPINGS`：

```ts
{
  id: "stable",
  patterns: ["包的", "稳了", "拿下", "一定能成"],
  keywords: ["会有时", "济沧海", "成功", "信心", "希望"],
  themes: ["希望", "信心", "成功"],
  emotion: "positive",
  explanation: "表达有把握、有信心、相信事情最终会成功。"
}
```

## Optional LLM enhancement

当前版本不需要大模型。

如果后续要接入大模型，建议只做**可选增强**：

```text
知识库检索 top 3
        ↓
只把这 3 条真实古文结果给 LLM
        ↓
LLM 只负责润色解释、生成小红书标题、生成短视频脚本
        ↓
古文原句和出处仍然必须来自数据库
```

不要让大模型直接回答：

```text
“我 emo 了，古人怎么说？”
```

否则很容易出现伪出处。

## sqlite-vec roadmap

当前 MVP 已经可用，默认不依赖 sqlite-vec。后续要加入向量检索，可以这样做：

1. 为每条 quote 生成 embedding。
2. 编译或安装 sqlite-vec。
3. 设置环境变量：

```bash
SQLITE_VEC_PATH=/absolute/path/to/sqlite_vec
```

4. 增加 `quote_vec` 向量表。
5. 搜索时融合：

```text
FTS5 score + vector score + theme score + manual weight
```

最终检索可以升级为：

```text
BM25 / FTS5 关键词召回
        +
Embedding 语义召回
        +
热梗主题映射
        +
人工精选权重
```

这样仍然可以保持低成本，不需要每次请求大模型。

## Deployment notes

### Vercel

可以直接部署到 Vercel。

注意：

- API route 使用 Node.js runtime，不是 Edge runtime。
- `data/*.db` 默认被 `.gitignore` 忽略。
- 不上传 SQLite DB 时，线上仍会使用内置数据兜底。
- 如果想在线上使用完整 SQLite 数据库，需要把生成后的数据库纳入构建产物，或者改成远程数据库。

### Other platforms

适合部署在：

- Vercel
- Railway
- Render
- Fly.io
- 自己的 VPS

如果要使用 SQLite 文件，推荐 Node.js 服务常驻环境，例如 VPS / Railway / Render。

## Roadmap

- [x] 现代话 / 热梗反查古诗文
- [x] 移动端优先首页
- [x] 3:4 分享卡片
- [x] 一键复制文案
- [x] 一键下载 PNG 卡片
- [x] SQLite + FTS5 schema
- [x] 内置数据兜底
- [ ] 批量导入 chinese-poetry 数据
- [ ] 人工精选 Top 100 热梗映射
- [ ] sqlite-vec 向量检索
- [ ] 分享卡片模板切换
- [ ] PWA / 保存到手机桌面
- [ ] 多语言 README
- [ ] 可选 LLM 润色层
- [ ] 管理后台：审核 quote / slang mapping
- [ ] 一键导出“作文高级表达素材包”

## Good first issues

适合第一次贡献的任务：

- 新增 10 条常见热梗映射。
- 新增 20 条高质量古诗文名句。
- 给每条 quote 增加更准确的 `context`。
- 优化移动端卡片样式。
- 增加“作文场景”筛选。
- 增加更多分享卡片模板。
- 接入 chinese-poetry 数据导入脚本。

## Data contribution rules

欢迎提交新的热梗和古诗文映射，但必须遵守：

1. **不能提交 AI 编造的古文。**
2. 必须有明确作者、篇名或古籍来源。
3. 尽量补充上下文，避免断章取义。
4. 热梗解释要说明“为什么匹配”，不要只做字面对照。
5. 如果存在争议版本，优先选择通行版本，并在 PR 中说明。

## Product positioning

这个项目适合做成：

- 古诗文学习小工具
- 语文作文高级表达素材库
- 小红书 / 朋友圈分享卡片生成器
- 亲子古诗词互动工具
- 老师课堂互动素材
- “反查出处”类开源 demo

适合的传播标题：

- 别再说 emo 了，古人这样说
- 把网络热梗换成作文高级表达
- 孩子总说 666？古人夸人更绝
- 一句“包的”，李白早就说过
- 这些网络用语，古人早就讲过

## Related ideas

这个项目的思想和 citation-first 产品类似：

```text
litsource: 现代观点 → 医学文献出处
Gu Ren Said: 现代话 / 热梗 → 古诗文真实出处
```

核心都是：

> 先找可信来源，再生成解释。

## Disclaimer

本项目当前是 MVP，内置数据量有限，结果以“语义相近”和“传播表达”为主，不等同于严格的学术训诂或古籍校勘。

如果用于正式教学、出版或严肃引用，请再次核对原典版本。

## License

MIT

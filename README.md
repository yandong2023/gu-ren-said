# 古人早就说过 / Gu Ren Said

<p align="center">
  <a href="https://gurensaid.com"><strong>Website</strong></a> ·
  <a href="https://github.com/yandong2023/gu-ren-said">GitHub</a>
</p>

> 现代话 / 网络热梗 → 古诗文真实出处 → 手机传播卡片

**Gu Ren Said** helps you find authentic classical Chinese quotes that match modern Chinese slang, emotions, and everyday expressions.

它不是“AI 文言文翻译器”，而是一个**古诗文反查工具**：输入一句现代话、口头禅或网络热梗，找到意思相近的古诗文原句，并展示作者、篇名、出处、原文和解释。

<p align="center">
  <img src="docs/assets/demo-hero.svg" alt="Gu Ren Said website preview" width="100%" />
</p>

## 效果预览

<p align="center">
  <img src="docs/assets/demo-cards.svg" alt="Gu Ren Said share card examples" width="100%" />
</p>

## 它解决什么问题

很多人想把日常表达写得更有文采，但常常只会说：

```text
我 emo 了
你真好看
我爱你
这事包的
太卷了，想躺平
```

这个项目希望把这些表达变成：

```text
我爱你
→ 愿得一心人，白头不相离。
→ 汉·卓文君《白头吟》

你真好看
→ 巧笑倩兮，美目盼兮。
→ 先秦·佚名《诗经·硕人》

我 emo 了
→ 抽刀断水水更流，举杯消愁愁更愁。
→ 唐·李白《宣州谢朓楼饯别校书叔云》
```

适合这些场景：

- 写作文，把普通表达换成有出处的句子。
- 发朋友圈 / 小红书，生成好看的古诗文卡片。
- 亲子语文启蒙，顺着孩子的网络热梗学古诗文。
- 老师课堂互动，把网络用语转换成经典表达。
- 想学习原文，不只看一句漂亮话，也能展开上下文。

## Demo examples

| 现代说法 | 古人说 | 出处 | 场景 |
|---|---|---|---|
| 我爱你 | 愿得一心人，白头不相离。 | 汉·卓文君《白头吟》 | 表白、相守 |
| 我喜欢你 | 山有木兮木有枝，心悦君兮君不知。 | 先秦·佚名《越人歌》 | 心动、暗恋 |
| 你真好看 | 巧笑倩兮，美目盼兮。 | 先秦·佚名《诗经·硕人》 | 夸人、赞美 |
| 我 emo 了 | 抽刀断水水更流，举杯消愁愁更愁。 | 唐·李白《宣州谢朓楼饯别校书叔云》 | 低落、烦闷 |
| 这事包的 / 稳了 | 长风破浪会有时，直挂云帆济沧海。 | 唐·李白《行路难·其一》 | 信心、鼓励 |
| 太卷了，想躺平 | 采菊东篱下，悠然见南山。 | 东晋·陶渊明《饮酒·其五》 | 松弛、归隐 |
| 这人太牛了 / 666 | 笔落惊风雨，诗成泣鬼神。 | 唐·杜甫《寄李十二白二十韵》 | 夸人、封神 |
| 想家了 | 独在异乡为异客，每逢佳节倍思亲。 | 唐·王维《九月九日忆山东兄弟》 | 思乡、漂泊 |
| 算了，不内耗了 | 回首向来萧瑟处，归去，也无风雨也无晴。 | 北宋·苏轼《定风波》 | 释怀、看开 |

## 核心原则

很多“古文翻译器”会直接让大模型生成一句像古文的话，但这样很容易出现两个问题：

1. 句子看起来很古风，但古人没说过。
2. 出处看起来很可信，但其实是 AI 编的。

所以这个项目坚持：

> **先找真实来源，再生成解释。**

DeepSeek 可以帮助理解用户表达、生成检索线索和重排候选，但最终展示的原句和出处必须来自数据库。

## 当前实现方式

```text
用户输入现代话 / 网络梗
        ↓
DeepSeek Query Planner 可选
理解语义，生成检索线索
        ↓
本地古诗文数据库召回真实候选
        ↓
DeepSeek Candidate Judge 可选
只从真实候选里排序和润色解释
        ↓
输出古诗文原句、出处、解释、原文
        ↓
生成手机分享卡片
```

也就是说，DeepSeek 不能直接创造最终答案。它可以说“应该去找山有木兮、愿得一心人这类表达”，但系统必须在数据库里找到真实出处，才能展示给用户。

## Features

- 现代话 / 网络热梗反查古诗文。
- 每条结果展示作者、朝代、篇名、出处和解释。
- 可展开查看原文和上下文。
- 生成 3:4 手机分享卡片。
- 微信内分享失败时，自动复制文案并提供可长按保存的图片。
- 可选 DeepSeek 增强：先生成检索计划，再从真实候选中排序。
- 内置查询质量回归测试，避免“你真好看 → 不以物喜”这类错误再次出现。

## Data

当前数据来源包括：

- 人工精选的高频表达映射，比如“我爱你”“你真好看”“我 emo 了”。
- `chinese-poetry` 开源数据中的唐诗、宋词等 JSON 数据。
- 构建时会生成 SQLite 数据库，线上 API 使用该数据库进行召回。

> 如果你提交新的古诗文映射，请确认原句和出处真实可靠。

## Quick start

```bash
pnpm install
pnpm db:seed
pnpm dev
```

打开：

```text
http://localhost:3000
```

## Environment variables

DeepSeek 是可选增强。如果不配置，项目仍然可以运行。

```bash
DEEPSEEK_API_KEY=sk-...
DEEPSEEK_MODEL=deepseek-chat
DEEPSEEK_ENABLED=1
DEEPSEEK_PLANNER_ENABLED=1
```

Google Analytics 已接入，当前 GA ID：

```text
G-V2YG6XD057
```

## Scripts

```bash
pnpm dev          # start local dev server
pnpm db:seed      # generate data/quotes.db
pnpm test:queries # run query relevance tests
pnpm build        # build production app
pnpm start        # start production server
```

## Project structure

```text
.
├── app/
│   ├── api/search/route.ts      # Search API
│   ├── globals.css              # Mobile-first visual style
│   ├── layout.tsx               # SEO / analytics / metadata
│   └── page.tsx                 # Home page
├── components/
│   ├── QuoteCard.tsx            # Share card + source display
│   └── SearchExperience.tsx     # Main product experience
├── data/
│   └── schema.sql               # SQLite / FTS schema
├── docs/assets/                 # README screenshots
├── lib/
│   ├── data.ts                  # Curated seed data
│   ├── db.server.ts             # SQLite search
│   ├── deepseek.server.ts       # Optional DeepSeek planner/reranker
│   ├── search.ts                # Query expansion + ranking
│   └── types.ts                 # Shared types
├── public/
│   ├── favicon.svg
│   └── og.svg
└── scripts/
    ├── evaluate-queries.ts      # Query quality regression tests
    └── seed.ts                  # Generate data/quotes.db
```

## Query quality tests

为了避免错误结果反复出现，项目内置了查询回归测试，覆盖：

```text
你真好看
我爱你
我 emo 了
这事包的
太卷了想躺平
我真的会谢
想家了
不内耗了
开心到飞起
有点心动念念不忘
```

运行：

```bash
pnpm test:queries
```

CI 会在构建前执行这些测试。

## Contribution rules

欢迎贡献新的热梗和古诗文映射，但请遵守：

1. 不能提交 AI 编造的古文。
2. 必须有明确作者、篇名或古籍来源。
3. 尽量补充上下文，避免断章取义。
4. 热梗解释要说明“为什么匹配”，不要只做字面对照。
5. 如果存在争议版本，请在 PR 中说明。

## Roadmap

- [x] 现代话 / 热梗反查古诗文
- [x] 移动端优先首页
- [x] 3:4 分享卡片
- [x] 微信分享兜底
- [x] 展示原文和出处
- [x] DeepSeek Query Planner
- [x] DeepSeek Candidate Judge
- [x] 查询质量回归测试
- [ ] 增加用户反馈：结果不对 / 出处有误 / 更好的句子
- [ ] 记录匿名高频搜索词，持续补精选映射
- [ ] 增加更多卡片模板
- [ ] PWA / 保存到手机桌面
- [ ] 批量导出作文高级表达素材包

## Disclaimer

本项目当前仍在快速迭代，结果以“语义相近”和“传播表达”为主，不等同于严格的学术训诂或古籍校勘。

如果用于正式教学、出版或严肃引用，请再次核对原典版本。

## License

MIT

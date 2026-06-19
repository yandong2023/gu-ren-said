# 古人早就说过 / Gu Ren Said

> 输入一句现代话或网络热梗，反查古诗文中真实存在的相似表达，并生成适合手机传播的出处卡片。

这个项目不是“AI 文言文翻译器”。它的核心是：

**先从知识库检索真实古诗文，再生成解释。**

这样可以避免常见问题：AI 编一句很像古文的话，再编一个不存在的出处。

## Demo 场景

输入：

```text
我 emo 了
```

输出：

```text
古人说：
抽刀断水水更流，举杯消愁愁更愁。

——唐·李白《宣州谢朓楼饯别校书叔云》
```

输入：

```text
这事包的
```

输出：

```text
古人说：
长风破浪会有时，直挂云帆济沧海。

——唐·李白《行路难·其一》
```

## 特点

- **真实出处**：每条结果包含原句、作者、朝代、篇名、出处。
- **几乎 0 token**：默认用 SQLite FTS5 + 语义映射，本地检索即可完成。
- **适合传播**：移动端优先，生成 3:4 分享卡片，适合小红书、朋友圈、视频号封面。
- **开源友好**：一个 Next.js 项目即可启动；SQLite 数据库可本地生成。
- **可扩展向量检索**：预留 sqlite-vec 扩展位，后续可加入 embedding 检索。

## 技术方案

```text
现代话 / 网络热梗
        ↓
热梗语义映射：emo → 忧愁 / 失意 / 烦闷
        ↓
SQLite FTS5 关键词召回
        ↓
语义主题 + 情绪 + 人工权重 rerank
        ↓
输出真实古诗文出处
        ↓
生成移动端分享卡片
```

> 后续可升级为：SQLite + FTS5 + sqlite-vec 混合检索。

## 快速开始

```bash
pnpm install
pnpm db:seed
pnpm dev
```

打开：

```text
http://localhost:3000
```

如果没有执行 `pnpm db:seed`，项目仍会使用 `lib/quotes.ts` 里的内置数据做内存检索。

## 项目结构

```text
.
├── app/
│   ├── api/search/route.ts      # 搜索 API
│   ├── globals.css              # 移动端优先样式
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── QuoteCard.tsx            # 分享卡片 + 下载 PNG
│   └── SearchExperience.tsx     # 首页交互
├── data/
│   ├── schema.sql               # SQLite / FTS5 schema
│   └── README.md
├── lib/
│   ├── quotes.ts                # 精选古诗文种子数据
│   ├── slang.ts                 # 网络热梗语义映射
│   ├── rank.ts                  # rerank 逻辑
│   ├── db.server.ts             # SQLite 查询
│   └── types.ts
└── scripts/
    └── seed.ts                  # 生成 data/quotes.db
```

## 数据库设计

核心表：

```sql
quotes
quotes_fts
slang_mappings
```

`quotes` 存原句、作者、朝代、篇名、上下文、现代语义、主题和人工权重。

`quotes_fts` 用 SQLite FTS5 做本地全文检索。

`slang_mappings` 把网络热梗映射为可检索的语义标签，例如：

```text
emo → 忧愁 / 失意 / 烦闷 / 孤独
包的 → 信心 / 希望 / 成功
躺平 → 松弛 / 归隐 / 不争
```

## sqlite-vec 扩展路线

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

这样仍然是本地检索，不需要每次请求大模型。

## 贡献数据原则

欢迎提交新的热梗和古诗文映射，但必须遵守：

1. 不能提交 AI 编造的古文。
2. 必须有明确作者、篇名或古籍来源。
3. 尽量补充上下文，避免断章取义。
4. 热梗解释要说明“为什么匹配”，不要只做字面对照。

## 适合做的增长内容

- “别再说 emo 了，古人这样说”
- “把网络热梗换成作文高级表达”
- “孩子总说 666？古人夸人更绝”
- “一句‘包的’，李白早就说过”
- “这些网络用语，古人早就讲过”

## License

MIT

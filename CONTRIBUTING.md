# Contributing to Gu Ren Said

感谢你愿意参与 **古人早就说过 / Gu Ren Said**。

这个项目的目标是：

> 输入一句现代话或网络热梗，反查古诗文中真实存在的相似表达，并生成适合传播的出处卡片。

它不是“AI 古文生成器”。核心原则是：

> **No hallucinated citations. 不编古文，不编出处。**

所以所有贡献都应该围绕“真实古诗文 + 可信出处 + 合理解释”。

## 可以贡献什么

你可以贡献：

- 新增古诗文名句
- 新增网络热梗 / 现代说法映射
- 修正出处、作者、篇名、朝代
- 补充上下文 `context`
- 优化匹配解释 `translation` / `modernMeanings`
- 优化移动端 UI / 分享卡片样式
- 增加卡片模板
- 增加 chinese-poetry 数据导入脚本
- 增加 sqlite-vec 向量检索
- 增加测试和 CI

## 数据贡献原则

### 1. 不要提交 AI 编造的古文

不接受这种内容：

```text
现代人说：我破防了
古人说：心碎如秋叶，泪落满江城。
出处：李白《夜雨寄北》
```

这类句子看起来像古文，但并不是真实出处。

### 2. 必须有明确出处

每条古诗文记录至少需要：

```text
quote     原句
title     篇名 / 书名
author    作者，无法确定时写“佚名”
dynasty   朝代
source    来源，例如 全唐诗 / 诗经 / 乐府诗集 / 东坡乐府
context   上下文，建议补充
```

### 3. 不要只做字面对照

好的映射应该解释“为什么相似”。

例如：

```text
现代说法：我 emo 了
古人说：抽刀断水水更流，举杯消愁愁更愁。
原因：这句写的是愁绪无法排解，和 emo 的低落、烦乱、失控感接近。
```

### 4. 避免断章取义

如果某句古诗文原本语境和现代说法差异较大，请在解释中说明。

例如“躺平”可以对应“采菊东篱下，悠然见南山”，但它更接近“远离喧嚣、松弛生活”，不应被解释成消极放弃一切。

### 5. 有争议版本要说明

如果一句话存在多个版本、作者争议或出处争议，请在 PR 描述中说明你采用的依据。

## 新增古诗文数据

当前 MVP 的种子数据在：

```text
lib/data.ts
```

新增 `QuoteRecord` 示例：

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

然后重新生成 SQLite 数据库：

```bash
pnpm db:seed
```

## 新增热梗映射

同样在 `lib/data.ts` 中修改 `SLANG_MAPPINGS`。

示例：

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

说明：

- `patterns`：用户可能输入的现代词 / 热梗。
- `keywords`：扩展检索词。
- `themes`：匹配古文的主题标签。
- `emotion`：情绪标签。
- `explanation`：用于生成解释的基础说明。

## 本地开发

```bash
pnpm install
pnpm db:seed
pnpm dev
```

打开：

```text
http://localhost:3000
```

如果不执行 `pnpm db:seed`，项目也可以运行，会使用内置数据兜底。

## 提交 PR 前检查

建议在提交前运行：

```bash
pnpm db:seed
pnpm build
```

如果只是改 README、文档或 issue 模板，可以不运行构建，但请确保 Markdown 可读。

## PR 描述建议

提交 PR 时请说明：

- 这次新增/修改了什么？
- 如果是古诗文数据，出处是什么？
- 如果是热梗映射，为什么这样匹配？
- 是否涉及 UI / 数据库 / API 变化？

## Commit message 建议

可以使用简单的英文动词开头：

```text
Add more emo quote mappings
Fix source for Tao Yuanming quote
Improve mobile share card style
Add chinese-poetry import script
```

## License

贡献即表示你同意你的贡献以本仓库的 MIT License 发布。

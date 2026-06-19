"use client";

import { FormEvent, useMemo, useState } from "react";
import QuoteCard from "@/components/QuoteCard";
import type { SearchResult } from "@/lib/types";

const EXAMPLES = [
  "我 emo 了",
  "这事包的",
  "太卷了，想躺平",
  "我真的会谢",
  "这人太牛了",
  "今天破防了",
  "不要焦虑，稳住",
  "想家了"
];

const PREVIEW: SearchResult = {
  id: "preview-li-bai-xuanzhou",
  quote: "抽刀断水水更流，举杯消愁愁更愁。",
  title: "宣州谢朓楼饯别校书叔云",
  author: "李白",
  dynasty: "唐",
  source: "全唐诗",
  context: "弃我去者，昨日之日不可留；乱我心者，今日之日多烦忧。",
  translation: "想借酒消愁，反而愁绪更深。",
  themes: ["忧愁", "失意", "烦闷"],
  modernMeanings: ["我 emo 了", "破防了", "心态崩了"],
  emotion: "sad",
  scene: ["情绪", "夜晚", "低落"],
  weight: 98,
  score: 100,
  matchedBy: ["demo"],
  reason: "这句写的是愁绪无法排解，和“emo”的低落、烦乱、失控感非常接近。"
};

export default function SearchExperience() {
  const [query, setQuery] = useState("我 emo 了");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const visibleResults = useMemo(() => (results.length ? results : [PREVIEW]), [results]);

  async function runSearch(nextQuery = query) {
    const value = nextQuery.trim();
    if (!value) return;
    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: value })
      });
      if (!response.ok) throw new Error("搜索服务暂时不可用");
      const payload = (await response.json()) as { results: SearchResult[] };
      setResults(payload.results ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "搜索失败");
    } finally {
      setLoading(false);
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void runSearch();
  }

  function pickExample(example: string) {
    setQuery(example);
    void runSearch(example);
  }

  return (
    <main className="shell">
      <nav className="nav" aria-label="主导航">
        <div className="brand"><span className="brand-mark">古</span><span>古人早就说过</span></div>
        <div className="nav-pill">真实出处 · 本地知识库 · 手机卡片</div>
      </nav>

      <section className="hero">
        <div className="hero-copy">
          <div className="badge">🪶 不是 AI 编古文，而是反查真实古诗文出处</div>
          <h1>网络热梗，<span className="title-accent">古人早就说过。</span></h1>
          <p className="subtitle">输入一句现代话、口头禅或网络梗，系统会从知识库里反查语义相近的古诗文原句，给出作者、篇名、解释，并生成适合小红书/朋友圈传播的手机卡片。</p>

          <form className="search-panel" onSubmit={submit}>
            <textarea value={query} onChange={(event) => setQuery(event.target.value)} placeholder="比如：我 emo 了 / 太卷了想躺平 / 这事包的 / 这人太牛了" aria-label="输入现代话或网络热梗" />
            <div className="search-actions">
              <span className="hint">先检索知识库，再生成解释，避免假出处。</span>
              <button className="primary-btn" type="submit" disabled={loading}>{loading ? "反查中…" : "反查古文"}</button>
            </div>
            <div className="examples" aria-label="示例">
              {EXAMPLES.map((example) => (
                <button className="example-chip" key={example} type="button" onClick={() => pickExample(example)}>{example}</button>
              ))}
            </div>
          </form>
        </div>

        <aside className="preview-stack" aria-label="传播卡片预览">
          <div className="phone-frame"><div className="phone-screen"><QuoteCard result={visibleResults[0]} query={query} compact /></div></div>
        </aside>
      </section>

      {error ? <div className="empty-state">{error}</div> : null}

      <section aria-label="搜索结果">
        <div className="section-title"><div><h2>{searched ? "反查结果" : "先看一张传播卡片"}</h2><p>每条结果都保留原句、作者、篇名和匹配理由。</p></div></div>
        {searched && !loading && results.length === 0 ? (
          <div className="empty-state">暂时没有特别贴切的结果。可以把现代话写得更具体，比如“我失恋了很难过”“考试稳了”“想远离内卷”。</div>
        ) : (
          <div className="results">{visibleResults.slice(0, 6).map((result) => <QuoteCard key={result.id} result={result} query={query} />)}</div>
        )}
      </section>

      <section className="tech-grid" aria-label="技术特点">
        <div className="tech-item"><strong>SQLite + FTS5</strong><span>本地全文检索，开源项目易部署，查询几乎不消耗 token。</span></div>
        <div className="tech-item"><strong>语义映射</strong><span>先把“emo/包的/躺平”扩展为情绪和场景，再检索古文。</span></div>
        <div className="tech-item"><strong>出处校验</strong><span>AI 只解释检索结果，不直接编造古文和出处。</span></div>
        <div className="tech-item"><strong>传播卡片</strong><span>移动端优先，一键复制文案、下载 3:4 卡片。</span></div>
      </section>
    </main>
  );
}

"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import QuoteCard from "@/components/QuoteCard";
import type { SearchResult } from "@/lib/types";

type HotItem = {
  query: string;
  href: string;
  count: number;
};

const EXAMPLES = [
  "你真好看",
  "我爱你",
  "我 emo 了",
  "这事包的",
  "太卷了，想躺平",
  "我真的会谢",
  "这人太牛了",
  "想家了"
];

const PREVIEW: SearchResult = {
  id: "preview-beauty",
  quote: "巧笑倩兮，美目盼兮。",
  title: "硕人",
  author: "佚名",
  dynasty: "先秦",
  source: "诗经",
  context: "手如柔荑，肤如凝脂，领如蝤蛴，齿如瓠犀。巧笑倩兮，美目盼兮。",
  translation: "形容笑容动人、眼神明亮，是夸人好看的经典表达。",
  themes: ["美貌", "赞美", "容貌"],
  modernMeanings: ["你真好看", "你好漂亮", "颜值高", "太美了"],
  emotion: "beauty",
  scene: ["夸人", "容貌", "心动"],
  weight: 110,
  score: 100,
  matchedBy: ["demo"],
  reason: "这句写笑容和眼神之美，用来替代“你真好看”更有文采，也适合分享。"
};

export default function SearchExperience() {
  const [query, setQuery] = useState("你真好看");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [hotItems, setHotItems] = useState<HotItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const visibleResults = useMemo(() => (results.length ? results : [PREVIEW]), [results]);

  useEffect(() => {
    let mounted = true;
    fetch("/api/hot")
      .then((response) => response.ok ? response.json() : null)
      .then((payload: { items?: HotItem[] } | null) => {
        if (mounted && payload?.items) setHotItems(payload.items);
      })
      .catch(() => undefined);
    return () => { mounted = false; };
  }, []);

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
        <div className="nav-actions"><a className="nav-pill" href="/hot">大家都在嘴替什么</a></div>
      </nav>

      <section className="hero">
        <div className="hero-copy">
          <div className="badge">🪶 把普通口头禅，换成古人嘴替的高级表达</div>
          <h1>现代话，<span className="title-accent">古人嘴替。</span></h1>
          <p className="subtitle">输入一句现代话、口头禅或网络梗，找到意思相近的古诗文原句。适合写作文、发朋友圈、小红书配图、亲子语文启蒙，也适合把“烂梗”换成更有出处的表达。</p>

          <form className="search-panel" onSubmit={submit}>
            <textarea value={query} onChange={(event) => setQuery(event.target.value)} placeholder="比如：你真好看 / 我爱你 / 我 emo 了 / 太卷了想躺平" aria-label="输入现代话或网络热梗" />
            <div className="search-actions">
              <span className="hint">每句都带作者、篇名和原文，方便学习，也方便分享。</span>
              <button className="primary-btn" type="submit" disabled={loading}>{loading ? "反查中…" : "反查古文"}</button>
            </div>
            <div className="examples" aria-label="示例">
              {EXAMPLES.map((example) => (
                <button className="example-chip" key={example} type="button" onClick={() => pickExample(example)}>{example}</button>
              ))}
            </div>
          </form>

          {hotItems.length > 0 ? (
            <section className="hot-strip" aria-label="大家都在嘴替什么">
              <div className="hot-strip-title">🔥 大家都在让古人嘴替什么</div>
              <div className="hot-strip-list">
                {hotItems.slice(0, 10).map((item, index) => (
                  <a href={item.href} className="hot-chip" key={item.href}><span>{index + 1}</span>{item.query}</a>
                ))}
              </div>
            </section>
          ) : null}
        </div>

        <aside className="preview-stack" aria-label="传播卡片预览">
          <div className="phone-frame"><div className="phone-screen"><QuoteCard result={visibleResults[0]} query={query} compact /></div></div>
        </aside>
      </section>

      {error ? <div className="empty-state">{error}</div> : null}

      <section aria-label="搜索结果">
        <div className="section-title"><div><h2>{searched ? "反查结果" : "先看一张传播卡片"}</h2><p>每条结果都保留原句、出处、解释和原文，方便核对和学习。</p></div></div>
        {searched && !loading && results.length === 0 ? (
          <div className="empty-state">暂时没有特别贴切的结果。可以把现代话写得更具体，比如“我失恋了很难过”“考试稳了”“想远离内卷”。</div>
        ) : (
          <div className="results">{visibleResults.slice(0, 6).map((result) => <QuoteCard key={result.id} result={result} query={query} />)}</div>
        )}
      </section>

      <section className="tech-grid" aria-label="使用场景">
        <div className="tech-item"><strong>写作文更高级</strong><span>把“很难过”“很开心”“很厉害”换成有出处的古诗文表达。</span></div>
        <div className="tech-item"><strong>发朋友圈更好看</strong><span>一键生成手机卡片，原句、出处和网站域名都在图里。</span></div>
        <div className="tech-item"><strong>教孩子少用烂梗</strong><span>不是禁止网络用语，而是顺着热梗找到更有文采的表达。</span></div>
        <div className="tech-item"><strong>想学原文也方便</strong><span>结果里可以展开原文和出处，不只看一句漂亮话。</span></div>
      </section>
    </main>
  );
}

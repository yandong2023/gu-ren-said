"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import QuoteCard from "@/components/QuoteCard";
import { trackEvent, trackVirtualPageView } from "@/lib/analytics";
import type { SearchResult } from "@/lib/types";

type HotItem = {
  query: string;
  href: string;
  count: number;
  source?: "search" | "editorial";
};

type HotPayload = {
  items?: HotItem[];
  label?: string;
  range?: "today" | "week" | "all";
  fallback?: boolean;
};

type SearchPayload = {
  results?: SearchResult[];
  href?: string;
  durationMs?: number;
  message?: string;
  enhancer?: {
    deepseek?: boolean;
  };
};

type SearchEntry = "form" | "example" | "history";

type HistoryItem = {
  query: string;
  href: string;
  quote?: string;
  source?: string;
  at: number;
};

type FavoriteItem = {
  id: string;
  query: string;
  href: string;
  quote: string;
  source: string;
  at: number;
};

const HISTORY_KEY = "grs:history";
const FAVORITES_KEY = "grs:favorites";

const EXAMPLES = [
  "你真好看",
  "我爱你",
  "我 emo 了",
  "这事包的",
  "太卷了，想躺平",
  "我想你",
  "不要放弃",
  "我真的会谢"
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

function queryToSlug(query: string) {
  return encodeURIComponent(
    query.trim().toLowerCase()
      .replace(/[，。！？!?.,、/\\]+/g, " ")
      .replace(/\s+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80)
  );
}

function queryHref(query: string) {
  return `/q/${queryToSlug(query)}`;
}

function readList<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(key) ?? "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveList<T>(key: string, items: T[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(items));
}

function resultSource(result: SearchResult) {
  return `${result.dynasty}·${result.author}《${result.title}》`;
}

function buildHistoryItem(query: string, result?: SearchResult): HistoryItem {
  return {
    query,
    href: queryHref(query),
    quote: result?.quote,
    source: result ? resultSource(result) : undefined,
    at: Date.now()
  };
}

export default function SearchExperience() {
  const router = useRouter();
  const [query, setQuery] = useState("你真好看");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [hotItems, setHotItems] = useState<HotItem[]>([]);
  const [hotLabel, setHotLabel] = useState("今日热门反查");
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [favoriteItems, setFavoriteItems] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const resultsRef = useRef<HTMLElement | null>(null);
  const searchAbortRef = useRef<AbortController | null>(null);
  const searchRequestIdRef = useRef(0);

  const hasResults = results.length > 0;
  const visibleResults = useMemo(() => (hasResults ? results : [PREVIEW]), [hasResults, results]);
  const visibleQuery = hasResults ? query : (PREVIEW.modernMeanings[0] ?? "你真好看");

  function refreshLocalPanels() {
    setHistoryItems(readList<HistoryItem>(HISTORY_KEY).slice(0, 8));
    setFavoriteItems(readList<FavoriteItem>(FAVORITES_KEY).slice(0, 8));
  }

  useEffect(() => {
    let mounted = true;
    fetch("/api/hot?range=today")
      .then((response) => response.ok ? response.json() : null)
      .then((payload: HotPayload | null) => {
        if (!mounted || !payload) return;
        if (payload.items) setHotItems(payload.items);
        if (payload.label) setHotLabel(payload.label);
      })
      .catch(() => undefined);

    refreshLocalPanels();
    window.addEventListener("grs:favorites-updated", refreshLocalPanels);
    return () => {
      mounted = false;
      searchAbortRef.current?.abort();
      window.removeEventListener("grs:favorites-updated", refreshLocalPanels);
    };
  }, []);

  function recordHistory(nextQuery: string, result?: SearchResult) {
    const item = buildHistoryItem(nextQuery, result);
    const existing = readList<HistoryItem>(HISTORY_KEY).filter((history) => history.query !== nextQuery);
    const next = [item, ...existing].slice(0, 12);
    saveList(HISTORY_KEY, next);
    setHistoryItems(next.slice(0, 8));
  }

  function clearHistory() {
    saveList<HistoryItem>(HISTORY_KEY, []);
    setHistoryItems([]);
    trackEvent("history_clear");
  }

  function clearFavorites() {
    saveList<FavoriteItem>(FAVORITES_KEY, []);
    setFavoriteItems([]);
    window.dispatchEvent(new Event("grs:favorites-updated"));
    trackEvent("favorites_clear");
  }

  async function runSearch(nextQuery = query, entry: SearchEntry = "form") {
    const value = nextQuery.trim().replace(/\s+/g, " ");
    if (!value) return;

    if (value.length < 2 || value.length > 60) {
      const message = value.length < 2 ? "请至少输入两个字，让意思更明确。" : "输入内容请控制在 60 个字以内。";
      setError(message);
      trackEvent("search_invalid", { entry, query_length: value.length });
      return;
    }

    searchAbortRef.current?.abort();
    const controller = new AbortController();
    searchAbortRef.current = controller;
    const requestId = searchRequestIdRef.current + 1;
    searchRequestIdRef.current = requestId;

    const startedAt = performance.now();
    setQuery(value);
    setLoading(true);
    setError(null);
    setSearched(true);
    trackEvent("search_submit", { entry, query_length: value.length });

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: value }),
        signal: controller.signal
      });
      const payload = (await response.json().catch(() => ({}))) as SearchPayload;
      if (!response.ok) throw new Error(payload.message || "搜索服务暂时不可用");
      if (requestId !== searchRequestIdRef.current) return;

      const nextResults = payload.results ?? [];
      const href = payload.href || queryHref(value);
      const durationMs = Math.round(payload.durationMs ?? performance.now() - startedAt);
      setResults(nextResults);
      recordHistory(value, nextResults[0]);

      if (nextResults.length > 0) {
        trackEvent("search_success", {
          entry,
          result_count: nextResults.length,
          query_length: value.length,
          duration_ms: durationMs,
          ai_enhanced: Boolean(payload.enhancer?.deepseek)
        });
        trackVirtualPageView(href);
        router.push(href);
        return;
      }

      trackEvent("search_empty", {
        entry,
        query_length: value.length,
        duration_ms: durationMs
      });
      window.setTimeout(() => {
        if (requestId === searchRequestIdRef.current) resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      if (requestId !== searchRequestIdRef.current) return;
      const message = err instanceof Error ? err.message : "搜索失败";
      setError(message);
      trackEvent("search_error", {
        entry,
        query_length: value.length,
        duration_ms: Math.round(performance.now() - startedAt)
      });
    } finally {
      if (requestId === searchRequestIdRef.current) setLoading(false);
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void runSearch(query, "form");
  }

  function pickExample(example: string) {
    setQuery(example);
    void runSearch(example, "example");
  }

  return (
    <main className="shell">
      <nav className="nav" aria-label="主导航">
        <div className="brand"><span className="brand-mark">古</span><span>古人曰</span></div>
        <div className="nav-actions">
          <a className="nav-pill" href="/chengyu">成语怎么说</a>
          <a className="nav-pill" href="/hot">热门反查</a>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-copy">
          <div className="badge">🪶 真实原句 · 真实出处 · 可看原文</div>
          <h1>现代话 / 网络热梗，<span className="title-accent">古人早就说过。</span></h1>
          <p className="subtitle">输入现代话、网络热梗或日常表达，找到意思相近的古诗文原句、作者、出处和原文。不是 AI 编一句古文，而是反查古人早就说过的表达。</p>

          <form className="search-panel" onSubmit={submit}>
            <textarea value={query} maxLength={60} onChange={(event) => setQuery(event.target.value)} placeholder="比如：你真好看 / 我爱你 / 我 emo 了 / 太卷了想躺平" aria-label="输入现代话或网络热梗" />
            <div className="search-actions">
              <span className="hint">每句都带作者、篇名和原文，方便核对、学习和分享。</span>
              <button className="primary-btn" type="submit" disabled={loading}>{loading ? "反查中…" : "反查古文"}</button>
            </div>
            <div className="examples" aria-label="示例">
              {EXAMPLES.map((example) => (
                <button className="example-chip" key={example} type="button" disabled={loading} onClick={() => pickExample(example)}>{example}</button>
              ))}
            </div>
          </form>

          <section className="return-grid" aria-label="回访入口">
            <div className="return-panel">
              <div className="return-panel-head"><strong>{hotLabel}</strong><a href="/hot">查看全部</a></div>
              {hotItems.length > 0 ? (
                <div className="return-list">
                  {hotItems.slice(0, 6).map((item, index) => (
                    <a className="return-item" href={item.href} key={item.href} onClick={() => trackEvent("hot_click", { hot_source: item.source ?? "search", hot_position: index + 1 })}><span>{index + 1}</span>{item.query}</a>
                  ))}
                </div>
              ) : <p className="return-empty">暂时还没有可展示的热门内容。</p>}
            </div>

            <div className="return-panel">
              <div className="return-panel-head"><strong>我的查询历史</strong>{historyItems.length > 0 ? <button type="button" onClick={clearHistory}>清空</button> : null}</div>
              {historyItems.length > 0 ? (
                <div className="return-list">
                  {historyItems.map((item) => (
                    <button className="return-item return-button" key={`${item.query}-${item.at}`} type="button" disabled={loading} onClick={() => { setQuery(item.query); void runSearch(item.query, "history"); }}>
                      <span>查</span>{item.query}
                    </button>
                  ))}
                </div>
              ) : <p className="return-empty">你查过的句子会保存在这里。</p>}
            </div>

            <div className="return-panel">
              <div className="return-panel-head"><strong>我的收藏句子</strong>{favoriteItems.length > 0 ? <button type="button" onClick={clearFavorites}>清空</button> : null}</div>
              {favoriteItems.length > 0 ? (
                <div className="favorite-list">
                  {favoriteItems.map((item) => (
                    <a className="favorite-item" href={item.href} key={`${item.id}-${item.at}`}>
                      <strong>{item.quote}</strong>
                      <span>{item.source}</span>
                    </a>
                  ))}
                </div>
              ) : <p className="return-empty">点结果卡片里的“收藏本句”，下次打开首页可以在这里看到。</p>}
            </div>
          </section>
        </div>

        <aside className="preview-stack" aria-label="传播卡片预览">
          <div className="phone-frame"><div className="phone-screen"><QuoteCard result={visibleResults[0]} query={visibleQuery} compact /></div></div>
        </aside>
      </section>

      {error ? <div className="empty-state">{error}</div> : null}

      <section aria-label="搜索结果" ref={resultsRef}>
        <div className="section-title"><div><h2>{searched ? "反查结果" : "先看一张知识卡片"}</h2><p>每条结果都保留原句、出处、解释和原文，方便核对和学习。</p></div></div>
        {searched && !loading && results.length === 0 ? (
          <div className="empty-state">暂时没有特别贴切的结果。可以把现代话写得更具体，比如“我失恋了很难过”“考试稳了”“想远离内卷”。</div>
        ) : (
          <div className="results">{visibleResults.slice(0, 6).map((result) => <QuoteCard key={result.id} result={result} query={visibleQuery} />)}</div>
        )}
      </section>

      <section className="tech-grid" aria-label="使用场景">
        <div className="tech-item"><strong>写作文更高级</strong><span>把“很难过”“很开心”“很厉害”换成有出处的古诗文表达。</span></div>
        <div className="tech-item"><strong>发朋友圈更好看</strong><span>一键生成知识卡片，原句、出处和网站域名都在图里。</span></div>
        <div className="tech-item"><strong>教孩子少用烂梗</strong><span>不是禁止网络用语，而是顺着热梗找到更有文采的表达。</span></div>
        <div className="tech-item"><strong>想学原文也方便</strong><span>结果里可以展开原文和出处，不只看一句漂亮话。</span></div>
      </section>
    </main>
  );
}

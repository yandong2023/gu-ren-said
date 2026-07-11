"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import type { ChengyuResult } from "@/lib/chengyu";

const EXAMPLES = [
  "表面一套背后一套",
  "说话前后矛盾",
  "看起来简单其实很难",
  "想太多",
  "很尴尬",
  "突然有转机",
  "很努力但很累",
  "稳了拿下"
];

const PREVIEW: ChengyuResult = {
  id: "yang-feng-yin-wei-preview",
  idiom: "阳奉阴违",
  pinyin: "yáng fèng yīn wéi",
  meaning: "表面上遵从，暗地里违背。",
  source: "明·范景文《革大户行召募疏》",
  tone: "贬义",
  modernMeanings: ["表面一套背后一套", "当面答应背后不做"],
  scenes: ["职场", "人际", "批评", "虚伪"],
  synonyms: ["口是心非", "两面三刀", "表里不一"],
  antonyms: ["言行一致", "表里如一"],
  example: "他表面支持方案，实际处处拖延，实在是阳奉阴违。",
  note: "多用于批评他人态度不诚、执行不真。",
  score: 100,
  matchedBy: ["preview"],
  reason: "“阳奉阴违”可以表达“表面一套背后一套 / 当面答应背后不做”这类意思，语气为贬义。"
};

function copyToClipboard(text: string) {
  if (navigator.clipboard?.writeText && window.isSecureContext) return navigator.clipboard.writeText(text).then(() => true).catch(() => false);
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "readonly");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  const ok = document.execCommand("copy");
  document.body.removeChild(textarea);
  return Promise.resolve(ok);
}

function ChengyuCard({ result, onNotice }: { result: ChengyuResult; onNotice: (value: string) => void }) {
  async function copy(text: string, notice: string) {
    const ok = await copyToClipboard(text);
    onNotice(ok ? notice : "当前浏览器不允许自动复制，可以手动复制页面文字。");
  }

  return (
    <article className="result-card chengyu-card">
      <div className="chengyu-card-main">
        <span className="card-kicker">成语怎么说</span>
        <div className="chengyu-query-line"><span className="knowledge-label">推荐成语</span><strong>{result.idiom}</strong>{result.pinyin ? <em>{result.pinyin}</em> : null}</div>
        <p className="chengyu-meaning"><span className="knowledge-label">意思</span>{result.meaning}</p>
        <div className="chengyu-meta">
          <span>{result.tone}</span>
          {result.scenes.slice(0, 4).map((scene) => <span key={scene}>{scene}</span>)}
        </div>
        <div className="match-reason"><strong>为什么匹配</strong><span>{result.reason}</span></div>
        <div className="chengyu-example"><span className="knowledge-label">例句</span>{result.example}</div>
        {result.source ? <div className="source-line"><span className="knowledge-label">出处</span>{result.source}</div> : null}
        <div className="chengyu-related">
          {result.synonyms.length > 0 ? <p><strong>近义：</strong>{result.synonyms.join(" / ")}</p> : null}
          {result.antonyms.length > 0 ? <p><strong>反义：</strong>{result.antonyms.join(" / ")}</p> : null}
        </div>
        {result.note ? <div className="chengyu-note">注意：{result.note}</div> : null}
      </div>
      <div className="copy-row" aria-label="复制成语常用格式">
        <button type="button" onClick={() => copy(result.idiom, "成语已复制。")}>复制成语</button>
        <button type="button" onClick={() => copy(`${result.idiom}：${result.meaning}`, "成语和释义已复制。")}>复制成语+释义</button>
        <button type="button" onClick={() => copy(result.example, "例句已复制。")}>复制例句</button>
      </div>
    </article>
  );
}

export default function ChengyuExperience() {
  const [query, setQuery] = useState("表面一套背后一套");
  const [results, setResults] = useState<ChengyuResult[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const searchAbortRef = useRef<AbortController | null>(null);
  const searchRequestIdRef = useRef(0);
  const visibleResults = useMemo(() => (searched ? results : [PREVIEW]), [results, searched]);

  useEffect(() => () => searchAbortRef.current?.abort(), []);

  async function runSearch(nextQuery = query) {
    const value = nextQuery.trim().replace(/\s+/g, " ");
    if (!value) return;
    if (value.length > 60) {
      setError("输入内容请控制在 60 个字以内。");
      return;
    }

    searchAbortRef.current?.abort();
    const controller = new AbortController();
    searchAbortRef.current = controller;
    const requestId = searchRequestIdRef.current + 1;
    searchRequestIdRef.current = requestId;

    setQuery(value);
    setLoading(true);
    setError(null);
    setNotice(null);
    setSearched(true);

    try {
      const response = await fetch("/api/chengyu/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: value, limit: 8 }),
        signal: controller.signal
      });
      const payload = (await response.json().catch(() => ({}))) as { results?: ChengyuResult[]; message?: string };
      if (!response.ok) throw new Error(payload.message || "成语搜索暂时不可用");
      if (requestId !== searchRequestIdRef.current) return;
      setResults(payload.results ?? []);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      if (requestId !== searchRequestIdRef.current) return;
      setError(err instanceof Error ? err.message : "搜索失败");
    } finally {
      if (requestId === searchRequestIdRef.current) setLoading(false);
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
        <a className="brand" href="/"><span className="brand-mark">古</span><span>古人曰</span></a>
        <div className="nav-actions">
          <a className="nav-pill" href="/">古文怎么说</a>
          <a className="nav-pill" href="/hot">热门反查</a>
        </div>
      </nav>

      <section className="hero chengyu-hero">
        <div className="hero-copy">
          <div className="badge">✍️ 口语转成语 · 扩展词库 · 避免误用</div>
          <h1>这句话，<span className="title-accent">用成语怎么说？</span></h1>
          <p className="subtitle">输入一句大白话，找到意思相近、语气合适、能正确使用的成语。已接入扩展成语库，并优先展示语义和场景更贴切的结果。</p>

          <form className="search-panel" onSubmit={submit}>
            <textarea value={query} maxLength={60} onChange={(event) => setQuery(event.target.value)} placeholder="比如：表面一套背后一套 / 说话前后矛盾 / 很努力但很累" aria-label="输入大白话或想表达的意思" />
            <div className="search-actions">
              <span className="hint">结果会显示成语、释义、语气、近义反义和例句，方便写作和表达。</span>
              <button className="primary-btn" type="submit" disabled={loading}>{loading ? "查找中…" : "查成语"}</button>
            </div>
            <div className="examples" aria-label="示例">
              {EXAMPLES.map((example) => <button className="example-chip" key={example} type="button" disabled={loading} onClick={() => pickExample(example)}>{example}</button>)}
            </div>
          </form>
        </div>
      </section>

      {notice ? <div className="share-notice">{notice}</div> : null}
      {error ? <div className="empty-state">{error}</div> : null}

      <section aria-label="成语搜索结果">
        <div className="section-title"><div><h2>{searched ? "推荐成语" : "先看一个例子"}</h2><p>宁可提示暂无结果，也不硬配不合适的成语。</p></div></div>
        {searched && !loading && results.length === 0 ? (
          <div className="empty-state">暂时没有找到特别贴切的成语。可以换一种更明确的说法，比如“表面一套背后一套”“说话前后矛盾”“事情突然变坏”。</div>
        ) : (
          <div className="chengyu-results">
            {visibleResults.map((result) => <ChengyuCard key={result.id} result={result} onNotice={setNotice} />)}
          </div>
        )}
      </section>
    </main>
  );
}

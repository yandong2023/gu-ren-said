"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import styles from "./QualityDashboard.module.css";

const STORAGE_KEY = "grs:quality-admin-key";

type QueryGroup = {
  query: string;
  attempts: number;
  success: number;
  empty: number;
  errors: number;
  lowConfidence: number;
  averageTopScore: number;
  lastSeen: string;
  topQuote: string;
  topSource: string;
  riskScore: number;
};

type FeedbackGroup = {
  query: string;
  resultId: string;
  quote: string;
  source: string;
  notAccurate: number;
  wrongSource: number;
  betterQuote: number;
  notes: string[];
  total: number;
  lastSeen: string;
};

type SearchRecord = {
  id: string;
  query: string;
  status: "success" | "empty" | "error";
  resultCount: number;
  topScore: number;
  topQuote: string;
  topSource: string;
  matchedBy: string[];
  lowConfidence: boolean;
  durationMs: number;
  aiEnhanced: boolean;
  createdAt: string;
};

type Snapshot = {
  ok: boolean;
  enabled: boolean;
  generatedAt: string;
  summary: {
    totalSearches: number;
    success: number;
    empty: number;
    errors: number;
    lowConfidence: number;
    feedback: number;
  };
  queryGroups: QueryGroup[];
  feedbackGroups: FeedbackGroup[];
  recentSearches: SearchRecord[];
  message?: string;
};

function formatDate(value: string) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).format(date);
}

function rate(part: number, total: number) {
  if (!total) return "0%";
  return `${Math.round((part / total) * 100)}%`;
}

export default function QualityDashboard() {
  const [adminKey, setAdminKey] = useState("");
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"queries" | "feedback" | "recent">("queries");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY) ?? "";
    if (saved) setAdminKey(saved);
  }, []);

  const riskyQueries = useMemo(
    () => snapshot?.queryGroups.filter((item) => item.riskScore > 0) ?? [],
    [snapshot]
  );

  async function loadSnapshot(key = adminKey) {
    const value = key.trim();
    if (!value) {
      setError("请输入质量后台访问密钥。");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/quality", {
        headers: { "X-Quality-Key": value },
        cache: "no-store"
      });
      const payload = (await response.json().catch(() => ({}))) as Snapshot;
      if (!response.ok) throw new Error(payload.message || "质量数据加载失败");
      window.localStorage.setItem(STORAGE_KEY, value);
      setSnapshot(payload);
    } catch (err) {
      setSnapshot(null);
      setError(err instanceof Error ? err.message : "质量数据加载失败");
    } finally {
      setLoading(false);
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void loadSnapshot();
  }

  return (
    <main className="shell">
      <nav className="nav" aria-label="后台导航">
        <a className="brand" href="/"><span className="brand-mark">古</span><span>古人曰</span></a>
        <div className="nav-actions"><a className="nav-pill" href="/">返回网站</a></div>
      </nav>

      <section className={styles.hero}>
        <div>
          <span className={styles.eyebrow}>SEARCH QUALITY</span>
          <h1>搜索质量后台</h1>
          <p>查看空结果、低置信度查询、异常请求和用户反馈，优先修复真正影响用户体验的问题。</p>
        </div>
        <form className={styles.keyForm} onSubmit={submit}>
          <label htmlFor="quality-key">访问密钥</label>
          <div className={styles.keyRow}>
            <input id="quality-key" type="password" value={adminKey} onChange={(event) => setAdminKey(event.target.value)} placeholder="QUALITY_ADMIN_KEY" autoComplete="current-password" />
            <button className="primary-btn" type="submit" disabled={loading}>{loading ? "加载中…" : snapshot ? "刷新数据" : "进入后台"}</button>
          </div>
          <small>密钥只保存在当前浏览器，不会写入 URL。</small>
        </form>
      </section>

      {error ? <div className="empty-state">{error}</div> : null}

      {snapshot ? (
        <>
          <section className={styles.summaryGrid} aria-label="质量概览">
            <div className={styles.summaryCard}><span>最近搜索</span><strong>{snapshot.summary.totalSearches}</strong><small>最多读取最近 500 条</small></div>
            <div className={styles.summaryCard}><span>空结果</span><strong>{snapshot.summary.empty}</strong><small>{rate(snapshot.summary.empty, snapshot.summary.totalSearches)} 空结果率</small></div>
            <div className={styles.summaryCard}><span>低置信度</span><strong>{snapshot.summary.lowConfidence}</strong><small>{rate(snapshot.summary.lowConfidence, snapshot.summary.success)} 成功结果中偏弱</small></div>
            <div className={styles.summaryCard}><span>异常</span><strong>{snapshot.summary.errors}</strong><small>{rate(snapshot.summary.errors, snapshot.summary.totalSearches)} 异常率</small></div>
            <div className={styles.summaryCard}><span>用户反馈</span><strong>{snapshot.summary.feedback}</strong><small>最近最多 500 条</small></div>
          </section>

          <div className={styles.toolbar}>
            <div className={styles.tabs} role="tablist" aria-label="质量数据分类">
              <button type="button" className={activeTab === "queries" ? styles.activeTab : ""} onClick={() => setActiveTab("queries")}>待优化查询 {riskyQueries.length}</button>
              <button type="button" className={activeTab === "feedback" ? styles.activeTab : ""} onClick={() => setActiveTab("feedback")}>用户反馈 {snapshot.feedbackGroups.length}</button>
              <button type="button" className={activeTab === "recent" ? styles.activeTab : ""} onClick={() => setActiveTab("recent")}>最近搜索</button>
            </div>
            <span>更新时间：{formatDate(snapshot.generatedAt)}</span>
          </div>

          {activeTab === "queries" ? (
            <section className={styles.tableCard} aria-label="待优化查询">
              <div className={styles.tableHeader}><div><h2>待优化查询</h2><p>优先处理空结果、低置信度和异常次数高的表达。</p></div></div>
              <div className={styles.tableWrap}>
                <table>
                  <thead><tr><th>查询</th><th>次数</th><th>空结果</th><th>低置信度</th><th>异常</th><th>平均分</th><th>当前首条</th><th>最后出现</th></tr></thead>
                  <tbody>
                    {(riskyQueries.length ? riskyQueries : snapshot.queryGroups).map((item) => (
                      <tr key={`${item.query}-${item.lastSeen}`}>
                        <td><strong>{item.query}</strong></td>
                        <td>{item.attempts}</td>
                        <td className={item.empty > 0 ? styles.danger : ""}>{item.empty}</td>
                        <td className={item.lowConfidence > 0 ? styles.warning : ""}>{item.lowConfidence}</td>
                        <td className={item.errors > 0 ? styles.danger : ""}>{item.errors}</td>
                        <td>{item.averageTopScore || "-"}</td>
                        <td><span className={styles.quote}>{item.topQuote || "暂无结果"}</span><small>{item.topSource}</small></td>
                        <td>{formatDate(item.lastSeen)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ) : null}

          {activeTab === "feedback" ? (
            <section className={styles.cardList} aria-label="用户反馈">
              {snapshot.feedbackGroups.length > 0 ? snapshot.feedbackGroups.map((item) => (
                <article className={styles.feedbackCard} key={`${item.query}-${item.resultId}`}>
                  <div className={styles.feedbackHead}><div><span>{item.query}</span><h3>{item.quote || item.resultId || "未指定结果"}</h3><p>{item.source}</p></div><strong>{item.total} 条</strong></div>
                  <div className={styles.feedbackStats}><span>不够贴切 {item.notAccurate}</span><span>出处有误 {item.wrongSource}</span><span>更好句子 {item.betterQuote}</span><span>{formatDate(item.lastSeen)}</span></div>
                  {item.notes.length > 0 ? <ul>{item.notes.map((note) => <li key={note}>{note}</li>)}</ul> : null}
                </article>
              )) : <div className="empty-state">暂时还没有用户反馈。</div>}
            </section>
          ) : null}

          {activeTab === "recent" ? (
            <section className={styles.tableCard} aria-label="最近搜索">
              <div className={styles.tableWrap}>
                <table>
                  <thead><tr><th>时间</th><th>查询</th><th>状态</th><th>结果数</th><th>首条分数</th><th>匹配信号</th><th>耗时</th><th>AI</th></tr></thead>
                  <tbody>
                    {snapshot.recentSearches.map((item) => (
                      <tr key={item.id}>
                        <td>{formatDate(item.createdAt)}</td>
                        <td><strong>{item.query}</strong><span className={styles.quote}>{item.topQuote}</span></td>
                        <td><span className={`${styles.status} ${styles[item.status]}`}>{item.lowConfidence ? "低置信度" : item.status}</span></td>
                        <td>{item.resultCount}</td>
                        <td>{item.topScore || "-"}</td>
                        <td>{item.matchedBy.join(" / ") || "-"}</td>
                        <td>{item.durationMs}ms</td>
                        <td>{item.aiEnhanced ? "是" : "否"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ) : null}
        </>
      ) : null}
    </main>
  );
}

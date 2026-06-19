"use client";

import { useRef, useState } from "react";
import type { SearchResult } from "@/lib/types";

type Props = {
  result: SearchResult;
  query: string;
  compact?: boolean;
};

export default function QuoteCard({ result, query, compact = false }: Props) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const sourceText = `——${result.dynasty}·${result.author}《${result.title}》`;
  const shareText = [`现代人说：${query || result.modernMeanings[0] || "我 emo 了"}`, "", "古人说：", result.quote, sourceText, "", result.reason || result.translation].join("\n");

  async function copyText() {
    await navigator.clipboard.writeText(shareText);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  async function downloadCard() {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(cardRef.current, { pixelRatio: 2, cacheBust: true, backgroundColor: "#f6e2c7" });
      const link = document.createElement("a");
      link.download = `古人早就说过-${result.author}.png`;
      link.href = dataUrl;
      link.click();
    } finally {
      setDownloading(false);
    }
  }

  return (
    <article className="result-card">
      <div className="share-card" ref={cardRef}>
        <div className="share-card-inner">
          <span className="card-kicker">古人早就说过</span>
          <div className="modern-line">现代人说：{query || result.modernMeanings[0]}</div>
          <h3 className="quote-line">{result.quote}</h3>
          <div className="source-line">{sourceText}</div>
          <div className="card-spacer" />
          <div className="explain-line">{result.reason || result.translation}</div>
          <div className="tags">{result.themes.slice(0, 4).map((tag) => <span className="tag" key={tag}>#{tag}</span>)}</div>
          <div className="watermark">gu-ren-said · no hallucinated citations</div>
        </div>
      </div>
      {!compact ? (
        <div className="card-actions">
          <button className="secondary-btn" type="button" onClick={copyText}>{copied ? "已复制" : "复制文案"}</button>
          <button className="ghost-btn" type="button" onClick={downloadCard} disabled={downloading}>{downloading ? "生成中…" : "下载卡片"}</button>
        </div>
      ) : null}
    </article>
  );
}

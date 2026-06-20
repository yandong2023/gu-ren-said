"use client";

import { useRef, useState } from "react";
import type { SearchResult } from "@/lib/types";

const SITE_URL = "https://gurensaid.com";

type Props = {
  result: SearchResult;
  query: string;
  compact?: boolean;
};

export default function QuoteCard({ result, query, compact = false }: Props) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [sharing, setSharing] = useState(false);
  const sourceText = `——${result.dynasty}·${result.author}《${result.title}》`;
  const shareText = [
    `现代人说：${query || result.modernMeanings[0] || "我 emo 了"}`,
    "",
    "古人说：",
    result.quote,
    sourceText,
    "",
    result.reason || result.translation,
    "",
    `来自：${SITE_URL}`
  ].join("\n");

  async function copyText() {
    await navigator.clipboard.writeText(shareText);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  async function createCardBlob() {
    if (!cardRef.current) return null;
    const { toPng } = await import("html-to-image");
    const dataUrl = await toPng(cardRef.current, { pixelRatio: 2, cacheBust: true, backgroundColor: "#f6e2c7" });
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    return { blob, dataUrl };
  }

  async function shareCard() {
    if (!cardRef.current) return;
    setSharing(true);
    try {
      const generated = await createCardBlob();
      const file = generated?.blob ? new File([generated.blob], `古人早就说过-${result.author}.png`, { type: "image/png" }) : null;
      const shareData: ShareData = {
        title: "古人早就说过",
        text: shareText,
        url: SITE_URL
      };
      const nav = navigator as Navigator & { canShare?: (data: ShareData) => boolean };

      if (file && navigator.share && (!nav.canShare || nav.canShare({ ...shareData, files: [file] }))) {
        await navigator.share({ ...shareData, files: [file] });
        return;
      }

      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }

      await copyText();
    } finally {
      setSharing(false);
    }
  }

  async function downloadCard() {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const generated = await createCardBlob();
      if (!generated) return;
      const link = document.createElement("a");
      link.download = `古人早就说过-${result.author}.png`;
      link.href = generated.dataUrl;
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
          <div className="watermark">gurensaid.com · no hallucinated citations</div>
        </div>
      </div>
      {!compact ? (
        <div className="card-actions">
          <button className="secondary-btn" type="button" onClick={shareCard} disabled={sharing}>{sharing ? "分享中…" : "分享卡片"}</button>
          <button className="ghost-btn" type="button" onClick={copyText}>{copied ? "已复制" : "复制文案"}</button>
          <button className="ghost-btn" type="button" onClick={downloadCard} disabled={downloading}>{downloading ? "生成中…" : "下载"}</button>
        </div>
      ) : null}
    </article>
  );
}

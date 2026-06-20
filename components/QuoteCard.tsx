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
  const [notice, setNotice] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const sourceText = `——${result.dynasty}·${result.author}《${result.title}》`;
  const fullSourceText = `${result.dynasty}·${result.author}《${result.title}》`;
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

  async function copyText(showNotice = true) {
    await navigator.clipboard.writeText(shareText);
    setCopied(true);
    if (showNotice) setNotice("分享文案已复制，可以直接粘贴到微信、朋友圈或小红书。");
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
    setNotice(null);
    setPreviewUrl(null);

    let generated: Awaited<ReturnType<typeof createCardBlob>> = null;

    try {
      generated = await createCardBlob();
      const isWeChat = /micromessenger/i.test(navigator.userAgent);

      if (isWeChat) {
        if (generated?.dataUrl) setPreviewUrl(generated.dataUrl);
        await copyText(false);
        setNotice("微信内网页不能总是直接调起图片分享。已复制文案；可长按下方卡片图片保存后转发。");
        return;
      }

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

      await copyText(false);
      if (generated?.dataUrl) setPreviewUrl(generated.dataUrl);
      setNotice("当前浏览器不支持直接分享图片，已复制文案；可下载卡片后转发。");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        setNotice("分享已取消。你也可以复制文案或下载卡片后再发。");
        return;
      }

      try {
        await copyText(false);
      } catch {
        // Ignore clipboard fallback failures.
      }
      if (generated?.dataUrl) setPreviewUrl(generated.dataUrl);
      setNotice("直接分享失败，已尽量为你复制文案；可以下载卡片后发到微信或朋友圈。");
    } finally {
      setSharing(false);
    }
  }

  async function downloadCard() {
    if (!cardRef.current) return;
    setDownloading(true);
    setNotice(null);
    try {
      const generated = await createCardBlob();
      if (!generated) return;
      const link = document.createElement("a");
      link.download = `古人早就说过-${result.author}.png`;
      link.href = generated.dataUrl;
      link.click();
      setNotice("卡片已生成。如果浏览器没有自动保存，可以长按预览图保存。");
      setPreviewUrl(generated.dataUrl);
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
          <div className="watermark">gurensaid.com · 每句都有出处</div>
        </div>
      </div>
      {!compact ? (
        <>
          <div className="card-actions">
            <button className="secondary-btn" type="button" onClick={shareCard} disabled={sharing}>{sharing ? "生成中…" : "分享卡片"}</button>
            <button className="ghost-btn" type="button" onClick={() => copyText()}>{copied ? "已复制" : "复制文案"}</button>
            <button className="ghost-btn" type="button" onClick={downloadCard} disabled={downloading}>{downloading ? "生成中…" : "下载"}</button>
          </div>

          {notice ? <div className="share-notice">{notice}</div> : null}
          {previewUrl ? (
            <div className="share-preview">
              <img src={previewUrl} alt="可保存的分享卡片" />
              <span>在微信里可长按图片保存，再发给朋友或朋友圈。</span>
            </div>
          ) : null}

          {result.context ? (
            <details className="source-detail">
              <summary>查看原文与出处</summary>
              <div className="source-detail-body">
                <strong>{fullSourceText}</strong>
                <p>{result.context}</p>
              </div>
            </details>
          ) : null}
        </>
      ) : null}
    </article>
  );
}

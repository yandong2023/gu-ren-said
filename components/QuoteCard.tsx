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

  async function copyToClipboard(text: string) {
    try {
      if (navigator.clipboard?.writeText && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch {
      // Continue to textarea fallback.
    }

    try {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.setAttribute("readonly", "readonly");
      textarea.style.position = "fixed";
      textarea.style.left = "-9999px";
      textarea.style.top = "-9999px";
      document.body.appendChild(textarea);
      textarea.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(textarea);
      return ok;
    } catch {
      return false;
    }
  }

  async function copyText(showNotice = true) {
    const ok = await copyToClipboard(shareText);
    setCopied(ok);
    if (showNotice) {
      setNotice(ok ? "分享文案已复制，可以直接粘贴到微信、朋友圈或小红书。" : "当前浏览器不允许自动复制，可以手动长按卡片保存或复制页面文字。");
    }
    window.setTimeout(() => setCopied(false), 1500);
    return ok;
  }

  async function createCardImage() {
    if (!cardRef.current) return null;
    const { toPng } = await import("html-to-image");
    const dataUrl = await toPng(cardRef.current, {
      pixelRatio: 2,
      cacheBust: true,
      backgroundColor: "#f6e2c7",
      skipFonts: true
    });
    return dataUrl;
  }

  async function prepareShareImage() {
    if (!cardRef.current) return;
    setSharing(true);
    setNotice(null);

    try {
      const dataUrl = await createCardImage();
      if (!dataUrl) return;
      setPreviewUrl(dataUrl);
      const copiedOk = await copyText(false);
      setNotice(copiedOk
        ? "分享图已生成，文案也已复制。微信里请长按下方图片保存，再发给朋友或朋友圈。"
        : "分享图已生成。微信里请长按下方图片保存，再发给朋友或朋友圈。"
      );
    } catch {
      const copiedOk = await copyText(false);
      setNotice(copiedOk
        ? "生成图片失败，但文案已复制。可以先把文案发到微信或小红书。"
        : "生成图片失败。可以尝试刷新页面，或换 Safari/Chrome 打开后再试。"
      );
    } finally {
      setSharing(false);
    }
  }

  async function downloadCard() {
    if (!cardRef.current) return;
    setDownloading(true);
    setNotice(null);

    try {
      const dataUrl = await createCardImage();
      if (!dataUrl) return;
      setPreviewUrl(dataUrl);

      const link = document.createElement("a");
      link.download = `古人早就说过-${result.author}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setNotice("卡片已生成。如果浏览器没有自动保存，可以长按下方图片保存。微信里建议长按保存后再转发。");
    } catch {
      setNotice("下载失败。可以先点“生成分享图”，再长按预览图保存。部分微信内置浏览器不支持自动下载。 ");
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
            <button className="secondary-btn" type="button" onClick={prepareShareImage} disabled={sharing}>{sharing ? "生成中…" : "生成分享图"}</button>
            <button className="ghost-btn" type="button" onClick={() => copyText()}>{copied ? "已复制" : "复制文案"}</button>
            <button className="ghost-btn" type="button" onClick={downloadCard} disabled={downloading}>{downloading ? "生成中…" : "下载图片"}</button>
          </div>

          {notice ? <div className="share-notice">{notice}</div> : null}
          {previewUrl ? (
            <div className="share-preview">
              <img src={previewUrl} alt="可保存的分享卡片" />
              <span>微信/朋友圈：长按图片保存后转发；小红书：保存图片后上传，文案可直接粘贴。</span>
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

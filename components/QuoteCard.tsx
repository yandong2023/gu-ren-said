"use client";

import { useEffect, useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { getPrimaryShareHook } from "@/lib/share-hook";
import type { SearchResult } from "@/lib/types";

const SITE_URL = "https://gurensaid.com";
const FAVORITES_KEY = "grs:favorites";

type Props = {
  result: SearchResult;
  query: string;
  compact?: boolean;
};

type FavoriteItem = {
  id: string;
  query: string;
  href: string;
  quote: string;
  source: string;
  at: number;
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

function readFavorites(): FavoriteItem[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(FAVORITES_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveFavorites(items: FavoriteItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("grs:favorites-updated"));
}

export default function QuoteCard({ result, query, compact = false }: Props) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [linkSharing, setLinkSharing] = useState(false);
  const [feedbacking, setFeedbacking] = useState(false);
  const [favorited, setFavorited] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const sourceText = `——${result.dynasty}·${result.author}《${result.title}》`;
  const fullSourceText = `${result.dynasty}·${result.author}《${result.title}》`;
  const whyText = result.reason || result.translation;
  const explainText = result.translation || whyText;
  const modernText = query || result.modernMeanings[0] || "我 emo 了";
  const hookText = getPrimaryShareHook(modernText, result);
  const shareUrl = `${SITE_URL}${queryHref(modernText)}?utm_source=share&utm_medium=link&utm_campaign=quote_card`;
  const analyticsContext = {
    result_id: result.id,
    query_length: modernText.length
  };
  const shareText = [
    hookText,
    "",
    result.quote,
    fullSourceText,
    "",
    `一句解释：${explainText}`,
    "",
    "gurensaid.com",
    "每一句都有真实出处",
    shareUrl
  ].join("\n");

  useEffect(() => {
    setFavorited(readFavorites().some((item) => item.id === result.id));
  }, [result.id]);

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

  async function copyFormatted(text: string, successText: string, copyType: "quote" | "quote_source" | "explanation") {
    const ok = await copyToClipboard(text);
    setCopied(ok);
    setNotice(ok ? successText : "当前浏览器不允许自动复制，可以手动长按卡片保存或复制页面文字。");
    if (ok) trackEvent("result_copy", { ...analyticsContext, copy_type: copyType });
    window.setTimeout(() => setCopied(false), 1500);
    return ok;
  }

  async function copyText(showNotice = true) {
    const ok = await copyToClipboard(shareText);
    setCopied(ok);
    if (showNotice) {
      setNotice(ok ? "分享文案已复制，可以直接粘贴到微信、朋友圈或小红书。" : "当前浏览器不允许自动复制，可以手动长按卡片保存或复制页面文字。");
      if (ok) trackEvent("share_text_copy", analyticsContext);
    }
    window.setTimeout(() => setCopied(false), 1500);
    return ok;
  }

  async function shareLink() {
    setLinkSharing(true);
    setNotice(null);

    const title = `古人曰｜${modernText}，古文怎么说？`;
    const text = `${hookText}\n${result.quote}\n${sourceText}`;

    try {
      if (navigator.share) {
        await navigator.share({ title, text, url: shareUrl });
        setNotice("已打开系统分享面板。微信、小红书或其他 App 里可继续转发这个链接。");
        trackEvent("share_link", { ...analyticsContext, share_method: "web_share" });
        return;
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        setNotice("已取消分享。");
        return;
      }
      // Fall back to copying below.
    } finally {
      setLinkSharing(false);
    }

    const ok = await copyToClipboard(`${text}\n\n${shareUrl}`);
    setNotice(ok ? "分享链接已复制，可以发给微信好友、朋友圈或小红书。" : "当前浏览器不允许自动复制，可以手动复制页面链接。 ");
    if (ok) trackEvent("share_link", { ...analyticsContext, share_method: "copy" });
    setLinkSharing(false);
  }

  function toggleFavorite() {
    const existing = readFavorites();
    const exists = existing.some((item) => item.id === result.id);

    if (exists) {
      saveFavorites(existing.filter((item) => item.id !== result.id));
      setFavorited(false);
      setNotice("已取消收藏。");
      trackEvent("favorite_remove", analyticsContext);
      return;
    }

    const favorite: FavoriteItem = {
      id: result.id,
      query: modernText,
      href: queryHref(modernText),
      quote: result.quote,
      source: fullSourceText,
      at: Date.now()
    };
    saveFavorites([favorite, ...existing.filter((item) => item.id !== result.id)].slice(0, 30));
    setFavorited(true);
    setNotice("已收藏。下次打开首页可以在“我的收藏句子”里看到。");
    trackEvent("favorite_add", analyticsContext);
  }

  async function sendFeedback(type: "not_accurate" | "wrong_source" | "better_quote") {
    let note = "";
    if (type === "better_quote") {
      note = window.prompt("可以写下你觉得更贴切的古文、出处或理由：")?.trim() ?? "";
      if (!note) return;
    }

    setFeedbacking(true);
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          query: modernText,
          resultId: result.id,
          quote: result.quote,
          source: fullSourceText,
          note
        })
      });
      if (!response.ok) throw new Error("feedback_failed");
      const text = type === "not_accurate" ? "收到反馈：这条结果不够贴切。" : type === "wrong_source" ? "收到反馈：需要核对出处。" : "收到你的推荐，后续会优先核对。";
      setNotice(text);
      trackEvent("feedback_submit", { ...analyticsContext, feedback_type: type });
    } catch {
      setNotice("反馈暂时没有提交成功，可以稍后再试。");
    } finally {
      setFeedbacking(false);
    }
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
      trackEvent("share_image_generate", { ...analyticsContext, copy_succeeded: copiedOk });
    } catch {
      const copiedOk = await copyText(false);
      setNotice(copiedOk
        ? "生成图片失败，但文案已复制。可以先把文案发到微信或小红书。"
        : "生成图片失败。可以尝试刷新页面，或换 Safari/Chrome 打开后再试。"
      );
      trackEvent("share_image_error", analyticsContext);
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
      link.download = `古文反查-${result.author}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setNotice("卡片已生成。如果浏览器没有自动保存，可以长按下方图片保存。微信里建议长按保存后再转发。");
      trackEvent("card_download", analyticsContext);
    } catch {
      setNotice("下载失败。可以先点“生成分享图”，再长按预览图保存。部分微信内置浏览器不支持自动下载。 ");
      trackEvent("card_download_error", analyticsContext);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <article className="result-card">
      <div className="share-card" ref={cardRef}>
        <div className="share-card-inner">
          <span className="card-kicker">古人曰</span>
          <div className="modern-line"><span className="knowledge-label">现代话</span>{modernText}</div>
          <div className="hook-line">{hookText}</div>
          <div className="quote-block">
            <span className="knowledge-label">古诗文表达</span>
            <h3 className="quote-line">{result.quote}</h3>
          </div>
          <div className="source-line"><span className="knowledge-label">出处</span>{sourceText}</div>
          <div className="card-spacer" />
          <div className="explain-line"><span className="knowledge-label">一句解释</span>{explainText}</div>
          <div className="watermark"><span>gurensaid.com</span><span>每一句都有真实出处</span></div>
        </div>
      </div>
      {!compact ? (
        <>
          <div className="match-reason"><strong>为什么匹配</strong><span>{whyText}</span></div>

          <div className="card-actions">
            <button className="secondary-btn" type="button" onClick={prepareShareImage} disabled={sharing}>{sharing ? "生成中…" : "生成分享图"}</button>
            <button className="ghost-btn" type="button" onClick={shareLink} disabled={linkSharing}>{linkSharing ? "分享中…" : "分享链接"}</button>
            <button className="ghost-btn" type="button" onClick={() => copyText()}>{copied ? "已复制" : "复制分享文案"}</button>
            <button className="ghost-btn" type="button" onClick={toggleFavorite}>{favorited ? "已收藏" : "收藏本句"}</button>
            <button className="ghost-btn" type="button" onClick={downloadCard} disabled={downloading}>{downloading ? "生成中…" : "下载图片"}</button>
          </div>

          <div className="copy-row" aria-label="复制常用格式">
            <button type="button" onClick={() => copyFormatted(result.quote, "原句已复制。", "quote")}>复制原句</button>
            <button type="button" onClick={() => copyFormatted(`${result.quote}${sourceText}`, "原句和出处已复制。", "quote_source")}>复制原句+出处</button>
            <button type="button" onClick={() => copyFormatted(explainText, "解释已复制。", "explanation")}>复制解释</button>
          </div>

          <div className="feedback-row" aria-label="结果反馈">
            <span>结果反馈：</span>
            <button type="button" disabled={feedbacking} onClick={() => sendFeedback("not_accurate")}>不够贴切</button>
            <button type="button" disabled={feedbacking} onClick={() => sendFeedback("wrong_source")}>出处有误</button>
            <button type="button" disabled={feedbacking} onClick={() => sendFeedback("better_quote")}>我有更好的句子</button>
          </div>

          {notice ? <div className="share-notice">{notice}</div> : null}
          {previewUrl ? (
            <div className="share-preview">
              <img src={previewUrl} alt="可保存的分享卡片" />
              <span>微信/朋友圈：长按图片保存后转发；小红书：保存图片后上传，文案和链接可直接粘贴。</span>
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

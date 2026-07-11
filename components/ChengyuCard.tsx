"use client";

import type { ChengyuResult } from "@/lib/chengyu";
import styles from "./ChengyuCard.module.css";

type Props = {
  result: ChengyuResult;
  showActions?: boolean;
  onNotice?: (value: string) => void;
};

async function copyToClipboard(text: string) {
  if (navigator.clipboard?.writeText && window.isSecureContext) {
    return navigator.clipboard.writeText(text).then(() => true).catch(() => false);
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "readonly");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  const ok = document.execCommand("copy");
  document.body.removeChild(textarea);
  return ok;
}

export default function ChengyuCard({ result, showActions = false, onNotice }: Props) {
  async function copy(text: string, notice: string) {
    const ok = await copyToClipboard(text);
    onNotice?.(ok ? notice : "当前浏览器不允许自动复制，可以手动复制页面文字。");
  }

  return (
    <article className={styles.card}>
      <div className={styles.topbar}>
        <span className={styles.kicker}>成语怎么说</span>
        <span className={styles.tone}>{result.tone}</span>
      </div>

      <div className={styles.titleArea}>
        <span className={styles.eyebrow}>推荐成语</span>
        <h3>{result.idiom}</h3>
        {result.pinyin ? <p className={styles.pinyin}>{result.pinyin}</p> : null}
      </div>

      <div className={styles.definition}>
        <span className={styles.label}>意思</span>
        <p>{result.meaning}</p>
      </div>

      {result.scenes.length > 0 ? (
        <div className={styles.scenes} aria-label="适用场景">
          {result.scenes.slice(0, 4).map((scene) => <span key={scene}>{scene}</span>)}
        </div>
      ) : null}

      <div className={styles.reason}>
        <strong>为什么匹配</strong>
        <p>{result.reason}</p>
      </div>

      <div className={styles.example}>
        <span className={styles.label}>例句</span>
        <p>{result.example}</p>
      </div>

      {result.source ? (
        <div className={styles.source}>
          <span className={styles.label}>出处</span>
          <p>{result.source}</p>
        </div>
      ) : null}

      {(result.synonyms.length > 0 || result.antonyms.length > 0) ? (
        <div className={styles.related}>
          {result.synonyms.length > 0 ? (
            <div className={styles.relatedItem}><strong>近义</strong>{result.synonyms.join(" / ")}</div>
          ) : null}
          {result.antonyms.length > 0 ? (
            <div className={styles.relatedItem}><strong>反义</strong>{result.antonyms.join(" / ")}</div>
          ) : null}
        </div>
      ) : null}

      {result.note ? (
        <div className={styles.note}>
          <span className={styles.label}>使用提醒</span>
          <p>{result.note}</p>
        </div>
      ) : null}

      {showActions ? (
        <div className={styles.actions} aria-label="复制成语常用格式">
          <button type="button" onClick={() => copy(result.idiom, "成语已复制。")}>复制成语</button>
          <button type="button" onClick={() => copy(`${result.idiom}：${result.meaning}`, "成语和释义已复制。")}>复制成语+释义</button>
          <button type="button" onClick={() => copy(result.example, "例句已复制。")}>复制例句</button>
        </div>
      ) : null}
    </article>
  );
}

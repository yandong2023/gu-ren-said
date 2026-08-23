"use client";

import { useState } from "react";
import styles from "@/app/en/english.module.css";
import { trackEvent } from "@/lib/analytics";
import { englishQueryHref } from "@/lib/english-url";
import type { EnglishClassic } from "@/lib/english-classics";

type Props = {
  item: EnglishClassic;
  query?: string;
  compact?: boolean;
};

const SITE_URL = "https://gurensaid.com";

export default function EnglishQuoteCard({ item, query, compact = false }: Props) {
  const [notice, setNotice] = useState<string | null>(null);
  const displayQuery = query?.trim() || item.searchTerms[0] || item.naturalMeaning;
  const sourceLine = `${item.authorEn} · ${item.eraEn} · ${item.titleEn}`;
  const shareUrl = `${SITE_URL}${englishQueryHref(displayQuery)}?utm_source=share&utm_medium=link&utm_campaign=en_quote`;
  const shareText = [
    `A classical Chinese line for “${displayQuery}”`,
    "",
    item.chinese.quote,
    item.pinyin,
    "",
    item.literalTranslation,
    "",
    sourceLine,
    `Source: ${item.sourceEn}`,
    "",
    shareUrl
  ].join("\n");

  async function copyText(text: string, successMessage: string) {
    try {
      await navigator.clipboard.writeText(text);
      setNotice(successMessage);
      trackEvent("en_quote_copy", { quote_id: item.id });
    } catch {
      setNotice("Copy was blocked by the browser. You can still select the text manually.");
    }
    window.setTimeout(() => setNotice(null), 2600);
  }

  async function share() {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `A classical Chinese line for “${displayQuery}”`,
          text: `${item.chinese.quote}\n${item.literalTranslation}\n${sourceLine}`,
          url: shareUrl
        });
        trackEvent("en_quote_share", { quote_id: item.id, method: "web_share" });
        return;
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
    }

    await copyText(shareText, "The quote, translation, source, and link were copied.");
  }

  return (
    <article className={`${styles.quoteCard} ${compact ? styles.compactCard : ""}`}>
      <div className={styles.quoteCardTop}>
        <div className={styles.cardMetaRow}>
          <span className={styles.verifiedBadge}>✓ Verified source</span>
          <span className={styles.translationBadge}>Bilingual</span>
        </div>
        <h3 className={styles.chineseQuote} lang="zh-CN">{item.chinese.quote}</h3>
        <p className={styles.pinyin}>{item.pinyin}</p>
      </div>

      <div className={styles.translationBlock}>
        <span className={styles.label}>Close English reading</span>
        <p className={styles.literalTranslation}>{item.literalTranslation}</p>
        <p className={styles.naturalMeaning}>
          <span className={styles.label}>Plain meaning</span>
          {item.naturalMeaning}
        </p>
      </div>

      <div className={styles.sourceBlock}>
        <span className={styles.label}>Source</span>
        <strong>{sourceLine}</strong><br />
        {item.sourceEn}
      </div>

      {!compact ? (
        <>
          <div className={styles.whyBlock}>
            <span className={styles.label}>Why it fits</span>
            {item.whyItFits}
          </div>

          <details className={styles.details}>
            <summary>Original context and translation note</summary>
            <div className={styles.detailsBody}>
              <strong lang="zh-CN">{item.chinese.context || item.chinese.quote}</strong>
              {item.culturalNote ? <p>{item.culturalNote}</p> : null}
              <p>English wording on Gu Ren Said is an original reading aid, not a claim that there is only one valid literary translation.</p>
            </div>
          </details>

          <div className={styles.cardActions}>
            <button className={styles.cardButton} type="button" onClick={() => copyText(item.chinese.quote, "The original Chinese line was copied.")}>Copy Chinese</button>
            <button className={styles.cardButton} type="button" onClick={() => copyText(`${item.chinese.quote}\n${item.pinyin}\n${item.literalTranslation}\n${sourceLine}`, "The bilingual quote and source were copied.")}>Copy bilingual</button>
            <button className={styles.cardButton} type="button" onClick={share}>Share</button>
            <a className={styles.cardLink} href={englishQueryHref(displayQuery)}>Open result page</a>
          </div>
          {notice ? <div className={styles.cardNotice} role="status">{notice}</div> : null}
        </>
      ) : null}
    </article>
  );
}

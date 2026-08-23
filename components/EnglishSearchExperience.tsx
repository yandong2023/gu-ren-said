"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import EnglishQuoteCard from "@/components/EnglishQuoteCard";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import styles from "@/app/en/english.module.css";
import { trackEvent } from "@/lib/analytics";
import { englishQueryHref } from "@/lib/english-url";
import type { EnglishClassic, EnglishTopic } from "@/lib/english-classics-wave2";

type TopicPreview = Pick<EnglishTopic, "slug" | "shortTitle" | "description">;

type Props = {
  featured: EnglishClassic[];
  topics: TopicPreview[];
};

const EXAMPLES = [
  "We are under the same moon",
  "Autumn can still be hopeful",
  "I miss my mother",
  "Review the old to learn the new",
  "Treat others as you wish to be treated",
  "Stay ambitious as you grow older"
];

export default function EnglishSearchExperience({ featured, topics }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  function go(nextQuery: string, entry: "form" | "example") {
    const value = nextQuery.trim().replace(/\s+/g, " ");
    if (value.length < 2) {
      setError("Describe a feeling, thought, or situation in at least two characters.");
      return;
    }
    if (value.length > 120) {
      setError("Please keep the description under 120 characters for a more focused match.");
      return;
    }
    setError(null);
    trackEvent("en_search_submit", { entry, query_length: value.length });
    router.push(englishQueryHref(value));
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    go(query, "form");
  }

  function chooseExample(example: string) {
    setQuery(example);
    go(example, "example");
  }

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <nav className={styles.nav} aria-label="English navigation">
          <a className={styles.brand} href="/en">
            <span className={styles.brandSeal} lang="zh-CN">古</span>
            <span>Gu Ren Said</span>
          </a>
          <div className={styles.navLinks}>
            <a className={styles.navLink} href="/en/topics">Browse themes</a>
            <LanguageSwitcher />
            <a className={styles.navPrimary} href="#search">Find a line</a>
          </div>
        </nav>

        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>Ancient words · real sources</p>
            <h1 className={styles.heroTitle}>Find the classic Chinese line for <span className={styles.heroAccent}>what you mean.</span></h1>
            <p className={styles.heroText}>Describe a feeling, thought, or situation in English. We will match it to a real line from Chinese poetry and philosophy—with the original Chinese, pinyin, a clear English reading, author, work, and source.</p>

            <form className={styles.searchPanel} id="search" onSubmit={submit}>
              <textarea
                className={styles.searchInput}
                value={query}
                maxLength={120}
                onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setQuery(event.target.value)}
                placeholder="Try: Looking at the moon makes me miss home."
                aria-label="Describe what you want to say"
              />
              <div className={styles.searchFooter}>
                <span className={styles.searchHint}>We search verified classical lines. We do not invent an ancient quotation.</span>
                <button className={styles.primaryButton} type="submit">Find a real line</button>
              </div>
              {error ? <p className={styles.searchError} role="alert">{error}</p> : null}
            </form>

            <div className={styles.examples} aria-label="Example searches">
              {EXAMPLES.map((example) => (
                <button className={styles.exampleButton} type="button" key={example} onClick={() => chooseExample(example)}>{example}</button>
              ))}
            </div>
          </div>

          <aside className={styles.heroAside} aria-label="Product principle">
            <div className={styles.manifestoCard}>
              <div className={styles.manifestoSeal} lang="zh-CN">真</div>
              <blockquote className={styles.manifestoQuote}>“Find first. Explain second. Never fabricate the source.”</blockquote>
              <p className={styles.manifestoText}>The Chinese line and its attribution must already exist in the corpus. AI may help interpret an English request later, but it is not allowed to manufacture the final quotation.</p>
            </div>
          </aside>
        </section>

        <section className={styles.proofStrip} aria-label="What each result includes">
          <div className={styles.proofItem}><strong>Original Chinese</strong><span>The authentic line, not generated pseudo-classical text.</span></div>
          <div className={styles.proofItem}><strong>Readable English</strong><span>A close reading plus a plain-language meaning.</span></div>
          <div className={styles.proofItem}><strong>Traceable source</strong><span>Author, era, work, collection, and original context.</span></div>
        </section>
      </div>

      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.sectionEyebrow}>Featured matches</p>
              <h2 className={styles.sectionTitle}>One feeling. A line that has survived centuries.</h2>
              <p className={styles.sectionText}>These examples show the bilingual result format. Search with your own words to find a closer match.</p>
            </div>
          </div>
          <div className={styles.cardGrid}>
            {featured.map((item) => <EnglishQuoteCard item={item} query={item.searchTerms[0]} compact key={item.id} />)}
          </div>
        </div>
      </section>

      <section className={styles.sectionMuted}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.sectionEyebrow}>Browse by feeling</p>
              <h2 className={styles.sectionTitle}>Start with the theme already on your mind.</h2>
            </div>
            <a className={styles.textLink} href="/en/topics">See all themes →</a>
          </div>
          <div className={styles.topicGrid}>
            {topics.slice(0, 16).map((topic) => (
              <a className={styles.topicCard} href={`/en/topics/${topic.slug}`} key={topic.slug}>
                <strong>{topic.shortTitle}</strong>
                <span>{topic.description}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.sectionEyebrow}>How it works</p>
              <h2 className={styles.sectionTitle}>English intent in. Verified Chinese classic out.</h2>
            </div>
          </div>
          <div className={styles.steps}>
            <div className={styles.step}><h3>Describe the meaning</h3><p>Use ordinary English. You do not need to know a poet, dynasty, title, or Chinese keyword.</p></div>
            <div className={styles.step}><h3>Match the intent</h3><p>The search compares themes, emotions, situations, and curated English expressions against the Chinese corpus.</p></div>
            <div className={styles.step}><h3>Check the source</h3><p>Read the original line, pinyin, English explanation, author, work, collection, and surrounding context.</p></div>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={`${styles.container} ${styles.footerInner}`}>
          <p><strong>Translation note:</strong> English wording on this site is an original reading aid designed to preserve meaning and make the line understandable. It is not copied from a modern copyrighted translation and is not presented as the only possible literary rendering.</p>
          <p>Gu Ren Said · <a className={styles.textLink} href="/">Chinese site</a></p>
        </div>
      </footer>
    </main>
  );
}

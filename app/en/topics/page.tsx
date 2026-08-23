import type { Metadata } from "next";
import styles from "@/app/en/english.module.css";
import { ENGLISH_SEO_QUERIES, ENGLISH_TOPICS } from "@/lib/english-classics";
import { englishQueryHref } from "@/lib/english-url";

export const metadata: Metadata = {
  title: "Chinese Poetry and Quote Themes | Gu Ren Said",
  description: "Browse source-verified classical Chinese poems and sayings by love, longing, friendship, homesickness, perseverance, inner peace, wisdom, learning, and more.",
  alternates: { canonical: "/en/topics", languages: { en: "/en/topics", "x-default": "/en/topics" } },
  openGraph: {
    title: "Browse Classical Chinese Poetry and Quotes by Theme",
    description: "Original Chinese, pinyin, English meaning, and traceable sources across the themes people search for most.",
    type: "website",
    url: "https://gurensaid.com/en/topics",
    siteName: "Gu Ren Said",
    images: ["/og-en.svg"]
  }
};

export default function EnglishTopicsPage() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <nav className={styles.nav} aria-label="English navigation">
          <a className={styles.brand} href="/en"><span className={styles.brandSeal} lang="zh-CN">古</span><span>Gu Ren Said</span></a>
          <div className={styles.navLinks}>
            <a className={styles.navLink} href="/">中文</a>
            <a className={styles.navPrimary} href="/en">Find a line</a>
          </div>
        </nav>

        <header className={styles.pageHero}>
          <div className={styles.breadcrumbs}><a href="/en">Home</a><span>›</span><span>Themes</span></div>
          <p className={styles.eyebrow}>Browse the corpus</p>
          <h1 className={styles.pageTitle}>Classical Chinese lines, organized by what you want to express.</h1>
          <p className={styles.pageIntro}>Each theme page contains verified original lines, pinyin, an English reading, author, work, source, and context. Start with a feeling—or search in your own words.</p>
          <form className={styles.inlineSearch} action="/en" method="get">
            <input className={styles.inlineInput} name="q" maxLength={120} placeholder="Describe a feeling, thought, or situation" aria-label="Search classical Chinese lines" />
            <button className={styles.inlineButton} type="submit">Find a line</button>
          </form>
        </header>
      </div>

      <section className={styles.sectionMuted}>
        <div className={styles.container}>
          <div className={styles.resultsHeader}>
            <div><p className={styles.sectionEyebrow}>All themes</p><h2 className={styles.sectionTitle}>Choose a starting point</h2></div>
            <span className={styles.resultCount}>{ENGLISH_TOPICS.length} curated themes</span>
          </div>
          <div className={styles.topicGrid}>
            {ENGLISH_TOPICS.map((topic) => (
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
          <div className={styles.sectionHeader}><div><p className={styles.sectionEyebrow}>Popular wording</p><h2 className={styles.sectionTitle}>Or begin with a common search</h2></div></div>
          <div className={styles.queryChips}>
            {ENGLISH_SEO_QUERIES.map((query) => <a className={styles.queryChip} href={englishQueryHref(query)} key={query}>{query}</a>)}
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={`${styles.container} ${styles.footerInner}`}>
          <p>Gu Ren Said matches modern English meaning to real lines from Chinese classics. It does not generate a fake ancient quotation.</p>
          <p><a className={styles.textLink} href="/en">Return to search →</a></p>
        </div>
      </footer>
    </main>
  );
}

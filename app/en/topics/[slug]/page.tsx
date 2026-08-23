import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EnglishQuoteCard from "@/components/EnglishQuoteCard";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import styles from "@/app/en/english.module.css";
import {
  ENGLISH_TOPICS,
  getEnglishClassicsForTopic,
  getEnglishTopic
} from "@/lib/english-classics-wave2";
import { englishQueryHref } from "@/lib/english-url";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return ENGLISH_TOPICS.map((topic) => ({ slug: topic.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const topic = getEnglishTopic(slug);
  if (!topic) return {};
  const canonical = `/en/topics/${topic.slug}`;

  return {
    title: `${topic.title} | Original Chinese, Pinyin and English Meaning`,
    description: topic.description,
    alternates: { canonical, languages: { en: canonical, "x-default": canonical } },
    openGraph: {
      title: topic.title,
      description: topic.description,
      type: "article",
      url: `https://gurensaid.com${canonical}`,
      siteName: "Gu Ren Said",
      images: ["/og-en.svg"]
    },
    twitter: {
      card: "summary_large_image",
      title: topic.title,
      description: topic.description,
      images: ["/og-en.svg"]
    }
  };
}

export default async function EnglishTopicPage({ params }: PageProps) {
  const { slug } = await params;
  const topic = getEnglishTopic(slug);
  if (!topic) notFound();

  const classics = getEnglishClassicsForTopic(topic.slug, 12);
  const relatedTopics = ENGLISH_TOPICS.filter((item) => item.slug !== topic.slug).slice(0, 4);

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <nav className={styles.nav} aria-label="English navigation">
          <a className={styles.brand} href="/en"><span className={styles.brandSeal} lang="zh-CN">古</span><span>Gu Ren Said</span></a>
          <div className={styles.navLinks}>
            <a className={styles.navLink} href="/en/topics">All themes</a>
            <LanguageSwitcher />
            <a className={styles.navPrimary} href="/en">Find a line</a>
          </div>
        </nav>

        <header className={styles.pageHero}>
          <div className={styles.breadcrumbs}><a href="/en">Home</a><span>›</span><a href="/en/topics">Themes</a><span>›</span><span>{topic.shortTitle}</span></div>
          <p className={styles.eyebrow}>Source-verified collection</p>
          <h1 className={styles.pageTitle}>{topic.title}</h1>
          <p className={styles.pageIntro}>{topic.intro}</p>
          <form className={styles.inlineSearch} action="/en" method="get">
            <input className={styles.inlineInput} name="q" maxLength={120} placeholder={`Describe your own thought about ${topic.shortTitle.toLowerCase()}`} aria-label="Search within a modern meaning" />
            <button className={styles.inlineButton} type="submit">Find a closer match</button>
          </form>
          <div className={styles.queryChips}>
            {topic.exampleQueries.map((query) => <a className={styles.queryChip} href={englishQueryHref(query)} key={query}>{query}</a>)}
          </div>
        </header>
      </div>

      <section className={styles.sectionMuted}>
        <div className={styles.container}>
          <div className={styles.resultsHeader}>
            <div><p className={styles.sectionEyebrow}>Original lines</p><h2 className={styles.sectionTitle}>Read the Chinese, meaning, and source together</h2></div>
            <span className={styles.resultCount}>{classics.length} curated line{classics.length === 1 ? "" : "s"}</span>
          </div>
          <div className={styles.resultsGrid}>
            {classics.map((item) => <EnglishQuoteCard item={item} query={topic.exampleQueries[0]} key={item.id} />)}
          </div>
          <div className={styles.disclaimer}><strong>Translation note:</strong> These English readings are original explanations prepared for Gu Ren Said. The Chinese original and source are the authoritative objects being verified; literary translations can reasonably differ.</div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}><div><p className={styles.sectionEyebrow}>Keep exploring</p><h2 className={styles.sectionTitle}>Other themes in the classics</h2></div><a className={styles.textLink} href="/en/topics">All themes →</a></div>
          <div className={styles.topicGrid}>
            {relatedTopics.map((item) => <a className={styles.topicCard} href={`/en/topics/${item.slug}`} key={item.slug}><strong>{item.shortTitle}</strong><span>{item.description}</span></a>)}
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={`${styles.container} ${styles.footerInner}`}>
          <p>Every displayed Chinese line is tied to a work and source in the verified corpus. English explanations may expand, but the source line is never replaced with generated text.</p>
          <p><a className={styles.textLink} href="/en">Search in your own words →</a></p>
        </div>
      </footer>
    </main>
  );
}

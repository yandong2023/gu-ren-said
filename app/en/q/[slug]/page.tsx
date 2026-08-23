import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EnglishQuoteCard from "@/components/EnglishQuoteCard";
import styles from "@/app/en/english.module.css";
import {
  ENGLISH_SEO_QUERIES,
  ENGLISH_TOPICS,
  searchEnglishClassics,
  shouldIndexEnglishQuery
} from "@/lib/english-classics";
import { englishQueryHref, englishSlugToQuery, normalizeEnglishQuery } from "@/lib/english-url";

type PageProps = {
  params: Promise<{ slug: string }>;
};

function formatQuery(query: string) {
  const withPronoun = query.replace(/\bi\b/g, "I");
  return withPronoun.charAt(0).toUpperCase() + withPronoun.slice(1);
}

async function getQuery(params: PageProps["params"]) {
  const { slug } = await params;
  return englishSlugToQuery(slug);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const query = await getQuery(params);
  const displayQuery = formatQuery(query);
  const results = searchEnglishClassics(query, 1);
  const top = results[0];
  const shouldIndex = shouldIndexEnglishQuery(query) && Boolean(top);
  const title = `A Classical Chinese Line for “${displayQuery}” | Gu Ren Said`;
  const description = top
    ? `For “${displayQuery}”: ${top.chinese.quote} — ${top.literalTranslation} Source: ${top.authorEn}, ${top.titleEn}.`
    : `Search verified classical Chinese poetry and philosophy for a line that expresses “${displayQuery}”.`;

  return {
    title,
    description,
    alternates: {
      canonical: englishQueryHref(query),
      languages: { en: englishQueryHref(query), "x-default": englishQueryHref(query) }
    },
    robots: {
      index: shouldIndex,
      follow: true
    },
    openGraph: {
      title,
      description,
      type: top ? "article" : "website",
      url: `https://gurensaid.com${englishQueryHref(query)}`,
      siteName: "Gu Ren Said",
      images: ["/og-en.svg"]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-en.svg"]
    }
  };
}

export default async function EnglishQueryPage({ params }: PageProps) {
  const query = await getQuery(params);
  if (query.length < 2 || query.length > 120 || !normalizeEnglishQuery(query)) notFound();

  const displayQuery = formatQuery(query);
  const results = searchEnglishClassics(query, 6);
  const topicSlugs = Array.from(new Set(results.flatMap((result) => result.matchedTopics.length > 0 ? result.matchedTopics : result.topicSlugs))).slice(0, 6);
  const relatedTopics = topicSlugs
    .map((slug) => ENGLISH_TOPICS.find((topic) => topic.slug === slug))
    .filter((topic): topic is NonNullable<typeof topic> => Boolean(topic));
  const normalizedCurrent = normalizeEnglishQuery(query);
  const suggestions = ENGLISH_SEO_QUERIES
    .filter((item) => normalizeEnglishQuery(item) !== normalizedCurrent)
    .slice(0, 8);

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <nav className={styles.nav} aria-label="English navigation">
          <a className={styles.brand} href="/en"><span className={styles.brandSeal} lang="zh-CN">古</span><span>Gu Ren Said</span></a>
          <div className={styles.navLinks}>
            <a className={styles.navLink} href="/en/topics">Browse themes</a>
            <a className={styles.navLink} href="/">中文</a>
            <a className={styles.navPrimary} href="/en">New search</a>
          </div>
        </nav>

        <header className={styles.pageHero}>
          <div className={styles.breadcrumbs}><a href="/en">Home</a><span>›</span><span>Search result</span></div>
          <p className={styles.eyebrow}>English intent · Chinese classic</p>
          <h1 className={styles.pageTitle}>A classical Chinese line for “{displayQuery}”</h1>
          <p className={styles.pageIntro}>{results.length > 0 ? "These matches come from a curated corpus of real Chinese poetry and philosophy. The source line is fixed; the English wording is provided to make its meaning accessible." : "We could not find a close enough verified match for this wording. Try a shorter description focused on one feeling or situation."}</p>
          <form className={styles.inlineSearch} action="/en" method="get">
            <input className={styles.inlineInput} name="q" defaultValue={displayQuery} maxLength={120} aria-label="Search again" />
            <button className={styles.inlineButton} type="submit">Search again</button>
          </form>
        </header>
      </div>

      <section className={styles.sectionMuted}>
        <div className={styles.container}>
          {results.length > 0 ? (
            <>
              <div className={styles.resultsHeader}>
                <div><p className={styles.sectionEyebrow}>Best verified matches</p><h2 className={styles.sectionTitle}>The closest lines we found</h2></div>
                <span className={styles.resultCount}>{results.length} source-verified result{results.length === 1 ? "" : "s"}</span>
              </div>
              <div className={styles.resultsGrid}>
                {results.map((result) => <EnglishQuoteCard item={result} query={displayQuery} key={result.id} />)}
              </div>
            </>
          ) : (
            <div className={styles.emptyState}>
              <h2>No close verified match yet</h2>
              <p>Try separating a long thought into one clear intent, such as “I miss home,” “I want to move on,” “stay strong,” or “true friendship.” We would rather return nothing than attach an unrelated classic to your words.</p>
              <div className={styles.queryChips}>
                {suggestions.slice(0, 6).map((item) => <a className={styles.queryChip} href={englishQueryHref(item)} key={item}>{item}</a>)}
              </div>
            </div>
          )}

          <div className={styles.disclaimer}><strong>Translation note:</strong> The English readings are original explanatory translations for this product. They are designed for clarity and source verification, not presented as definitive literary translations.</div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          {relatedTopics.length > 0 ? (
            <>
              <div className={styles.sectionHeader}><div><p className={styles.sectionEyebrow}>Explore nearby meanings</p><h2 className={styles.sectionTitle}>Related themes</h2></div></div>
              <div className={styles.topicGrid}>
                {relatedTopics.map((topic) => <a className={styles.topicCard} href={`/en/topics/${topic.slug}`} key={topic.slug}><strong>{topic.shortTitle}</strong><span>{topic.description}</span></a>)}
              </div>
            </>
          ) : (
            <div className={styles.emptyState}>
              <h2>Try one of these established searches</h2>
              <div className={styles.queryChips}>{suggestions.map((item) => <a className={styles.queryChip} href={englishQueryHref(item)} key={item}>{item}</a>)}</div>
            </div>
          )}
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={`${styles.container} ${styles.footerInner}`}>
          <p>Original Chinese line, pinyin, a readable English explanation, and a traceable source—without inventing an ancient quotation.</p>
          <p><a className={styles.textLink} href="/en">Search another idea →</a></p>
        </div>
      </footer>
    </main>
  );
}

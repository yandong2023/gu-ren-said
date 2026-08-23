import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EnglishNav from "@/components/EnglishNav";
import EnglishQuoteCard from "@/components/EnglishQuoteCard";
import baseStyles from "@/app/en/english.module.css";
import catalogStyles from "@/app/en/catalog.module.css";
import {
  getEnglishWorkCollection,
  getPublishedEnglishWorks
} from "@/lib/english-catalog.server";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getPublishedEnglishWorks().map((work) => ({ slug: work.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const work = getEnglishWorkCollection(slug);
  if (!work) return {};
  const canonical = work.href;
  const title = `${work.name} (${work.chineseName}) Quotes in English | Gu Ren Said`;
  const description = `${work.description} Read ${work.items.length} source-verified lines with original Chinese, pinyin, English meaning, author, title, and context.`;

  return {
    title,
    description,
    alternates: { canonical, languages: { en: canonical, "x-default": canonical } },
    openGraph: {
      title,
      description,
      type: "article",
      url: `https://gurensaid.com${canonical}`,
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

export default async function EnglishWorkPage({ params }: PageProps) {
  const { slug } = await params;
  const work = getEnglishWorkCollection(slug);
  if (!work) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${work.name} (${work.chineseName}) in English`,
    description: work.description,
    url: `https://gurensaid.com${work.href}`,
    about: {
      "@type": "CreativeWork",
      name: work.name,
      alternateName: work.chineseName,
      description: work.kind
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: work.items.length,
      itemListElement: work.items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.chinese.quote,
        description: item.literalTranslation
      }))
    }
  };

  return (
    <main className={baseStyles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className={baseStyles.container}>
        <EnglishNav />
        <header className={baseStyles.pageHero}>
          <div className={baseStyles.breadcrumbs}><a href="/en">Home</a><span>›</span><a href="/en/explore">Explore</a><span>›</span><a href="/en/works">Works & collections</a><span>›</span><span>{work.name}</span></div>
          <p className={baseStyles.eyebrow}>{work.kind} · source-linked collection</p>
          <h1 className={baseStyles.pageTitle}>{work.name} <span lang="zh-CN">{work.chineseName}</span></h1>
          <p className={baseStyles.pageIntro}>{work.intro}</p>
          <div className={catalogStyles.heroStats}>
            <span className={catalogStyles.heroStat}><strong>{work.items.length}</strong> verified lines</span>
            <span className={catalogStyles.heroStat}><strong>{work.authors.length}</strong> linked authors</span>
            <span className={catalogStyles.heroStat}><strong>{work.topics.length}</strong> connected themes</span>
          </div>
        </header>
      </div>

      <section className={baseStyles.sectionMuted}>
        <div className={baseStyles.container}>
          <div className={baseStyles.resultsHeader}>
            <div><p className={baseStyles.sectionEyebrow}>Verified selections</p><h2 className={baseStyles.sectionTitle}>Read selected lines without losing the source.</h2></div>
            <span className={baseStyles.resultCount}>{work.items.length} curated line{work.items.length === 1 ? "" : "s"}</span>
          </div>
          <div className={baseStyles.resultsGrid}>
            {work.items.map((item) => <EnglishQuoteCard item={item} query={item.searchTerms[0]} key={item.id} />)}
          </div>
        </div>
      </section>

      <section className={baseStyles.section}>
        <div className={baseStyles.container}>
          <div className={catalogStyles.linkSection}>
            <div className={catalogStyles.linkPanel}>
              <h2>Authors in this collection</h2>
              <p>Open substantial author collections where the corpus contains enough verified entries.</p>
              <div className={catalogStyles.chips}>
                {work.authors.length > 0 ? work.authors.map((author) => <a className={catalogStyles.chip} href={author.href} key={author.slug}>{author.name}<span className={catalogStyles.chipCount}>{author.count}</span></a>) : <span className={catalogStyles.chip}>Multiple or anonymous voices</span>}
              </div>
            </div>
            <div className={catalogStyles.linkPanel}>
              <h2>Explore related themes</h2>
              <p>See how lines from this source connect to modern feelings, questions, and situations.</p>
              <div className={catalogStyles.chips}>
                {work.topics.map((topic) => <a className={catalogStyles.chip} href={`/en/topics/${topic.slug}`} key={topic.slug}>{topic.shortTitle}</a>)}
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className={baseStyles.footer}>
        <div className={`${baseStyles.container} ${baseStyles.footerInner}`}>
          <p>{work.description} This page is a curated bilingual selection, not a claim to translate the complete source.</p>
          <p><a className={baseStyles.textLink} href="/en/works">All works and collections →</a></p>
        </div>
      </footer>
    </main>
  );
}

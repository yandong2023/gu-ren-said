import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EnglishNav from "@/components/EnglishNav";
import EnglishQuoteCard from "@/components/EnglishQuoteCard";
import baseStyles from "@/app/en/english.module.css";
import catalogStyles from "@/app/en/catalog.module.css";
import {
  getEnglishAuthorCollection,
  getPublishedEnglishAuthors
} from "@/lib/english-catalog.server";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getPublishedEnglishAuthors().map((author) => ({ slug: author.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const author = getEnglishAuthorCollection(slug);
  if (!author) return {};
  const canonical = author.href;
  const title = `${author.name} (${author.chineseName}) Quotes and Poems in English | Gu Ren Said`;
  const description = `${author.description} Read ${author.items.length} source-verified lines with original Chinese, pinyin, English meaning, work, and context.`;

  return {
    title,
    description,
    alternates: { canonical, languages: { en: canonical, "x-default": canonical } },
    openGraph: {
      title,
      description,
      type: "profile",
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

export default async function EnglishAuthorPage({ params }: PageProps) {
  const { slug } = await params;
  const author = getEnglishAuthorCollection(slug);
  if (!author) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${author.name} (${author.chineseName}) in English`,
    description: author.description,
    url: `https://gurensaid.com${author.href}`,
    about: {
      "@type": "Person",
      name: author.name,
      alternateName: author.chineseName,
      description: `${author.role}, ${author.era}`
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: author.items.length,
      itemListElement: author.items.map((item, index) => ({
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
          <div className={baseStyles.breadcrumbs}><a href="/en">Home</a><span>›</span><a href="/en/explore">Explore</a><span>›</span><a href="/en/poets">Poets & thinkers</a><span>›</span><span>{author.name}</span></div>
          <p className={baseStyles.eyebrow}>{author.role} · source-linked collection</p>
          <h1 className={baseStyles.pageTitle}>{author.name} <span lang="zh-CN">{author.chineseName}</span></h1>
          <p className={baseStyles.pageIntro}>{author.intro}</p>
          <div className={catalogStyles.heroStats}>
            <span className={catalogStyles.heroStat}><strong>{author.items.length}</strong> verified lines</span>
            <span className={catalogStyles.heroStat}><strong>{author.era}</strong></span>
            <span className={catalogStyles.heroStat}><strong>{author.topics.length}</strong> connected themes</span>
            <span className={catalogStyles.heroStat}><strong>{author.works.length}</strong> source collections</span>
          </div>
        </header>
      </div>

      <section className={baseStyles.sectionMuted}>
        <div className={baseStyles.container}>
          <div className={baseStyles.resultsHeader}>
            <div><p className={baseStyles.sectionEyebrow}>Bilingual collection</p><h2 className={baseStyles.sectionTitle}>Read the line, meaning, work, and source together.</h2></div>
            <span className={baseStyles.resultCount}>{author.items.length} curated line{author.items.length === 1 ? "" : "s"}</span>
          </div>
          <div className={baseStyles.resultsGrid}>
            {author.items.map((item) => <EnglishQuoteCard item={item} query={item.searchTerms[0]} key={item.id} />)}
          </div>
        </div>
      </section>

      <section className={baseStyles.section}>
        <div className={baseStyles.container}>
          <div className={catalogStyles.linkSection}>
            <div className={catalogStyles.linkPanel}>
              <h2>Explore related themes</h2>
              <p>See how the same author appears across feelings, situations, and ideas.</p>
              <div className={catalogStyles.chips}>
                {author.topics.map((topic) => <a className={catalogStyles.chip} href={`/en/topics/${topic.slug}`} key={topic.slug}>{topic.shortTitle}</a>)}
              </div>
            </div>
            <div className={catalogStyles.linkPanel}>
              <h2>Source collections</h2>
              <p>Move from the author to the anthology or text where these entries are verified.</p>
              <div className={catalogStyles.chips}>
                {author.works.map((work) => <a className={catalogStyles.chip} href={work.href} key={work.slug}>{work.name}<span className={catalogStyles.chipCount}>{work.count}</span></a>)}
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className={baseStyles.footer}>
        <div className={`${baseStyles.container} ${baseStyles.footerInner}`}>
          <p>{author.description} English translations on this page are original reading aids and do not replace the Chinese source text.</p>
          <p><a className={baseStyles.textLink} href="/en/poets">All poets and thinkers →</a></p>
        </div>
      </footer>
    </main>
  );
}

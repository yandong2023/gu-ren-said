import type { Metadata } from "next";
import EnglishNav from "@/components/EnglishNav";
import baseStyles from "@/app/en/english.module.css";
import catalogStyles from "@/app/en/catalog.module.css";
import { getPublishedEnglishAuthors } from "@/lib/english-catalog.server";

export const metadata: Metadata = {
  title: "Classical Chinese Poets and Thinkers in English | Gu Ren Said",
  description: "Browse substantial bilingual collections for Li Bai, Su Shi, Wang Wei, Du Fu, Confucius, Laozi, Mencius, Xunzi, Zhuangzi, Han Yu, and more.",
  alternates: {
    canonical: "/en/poets",
    languages: { en: "/en/poets", "x-default": "/en/poets" }
  },
  openGraph: {
    title: "Classical Chinese Poets and Thinkers in English",
    description: "Original Chinese lines, pinyin, English meaning, work, source, and context organized by author.",
    type: "website",
    url: "https://gurensaid.com/en/poets",
    siteName: "Gu Ren Said",
    images: ["/og-en.svg"]
  }
};

export default function EnglishPoetsPage() {
  const authors = getPublishedEnglishAuthors();

  return (
    <main className={baseStyles.page}>
      <div className={baseStyles.container}>
        <EnglishNav />
        <header className={baseStyles.pageHero}>
          <div className={baseStyles.breadcrumbs}><a href="/en">Home</a><span>›</span><a href="/en/explore">Explore</a><span>›</span><span>Poets & thinkers</span></div>
          <p className={baseStyles.eyebrow}>Browse by author</p>
          <h1 className={baseStyles.pageTitle}>Poets and thinkers with enough verified lines to explore.</h1>
          <p className={baseStyles.pageIntro}>These are not placeholder biography pages. An author appears here only when the bilingual corpus contains multiple source-linked lines, allowing you to compare themes, works, and modern meanings across a real collection.</p>
          <div className={catalogStyles.heroStats}>
            <span className={catalogStyles.heroStat}><strong>{authors.length}</strong> published author collections</span>
            <span className={catalogStyles.heroStat}><strong>{authors.reduce((sum, author) => sum + author.items.length, 0)}</strong> author-linked entries</span>
          </div>
        </header>
      </div>

      <section className={baseStyles.sectionMuted}>
        <div className={baseStyles.container}>
          <div className={catalogStyles.catalogGrid}>
            {authors.map((author) => (
              <a className={catalogStyles.catalogCard} href={author.href} key={author.slug}>
                <div className={catalogStyles.catalogTop}>
                  <span className={catalogStyles.catalogSeal} lang="zh-CN">{author.chineseName.slice(0, 1)}</span>
                  <span className={catalogStyles.catalogCount}>{author.items.length} lines</span>
                </div>
                <h2>{author.name}<span className={catalogStyles.catalogChinese} lang="zh-CN">{author.chineseName}</span></h2>
                <div className={catalogStyles.catalogMeta}>{author.role} · {author.era}</div>
                <p className={catalogStyles.catalogDescription}>{author.description}</p>
                <div className={catalogStyles.catalogBottom}><span>Explore author</span><span className={catalogStyles.catalogArrow}>→</span></div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className={baseStyles.section}>
        <div className={baseStyles.container}>
          <div className={catalogStyles.exploreGrid}>
            <a className={catalogStyles.exploreCard} href="/en/topics">
              <div><span className={catalogStyles.exploreKicker}>Another way in</span><h2>Browse themes</h2><p>Start with the feeling or idea already on your mind, then follow author links from each result.</p></div>
              <div className={catalogStyles.exploreFooter}><span>Love, wisdom, moonlight, family, work, and more</span><span className={catalogStyles.exploreArrow}>→</span></div>
            </a>
            <a className={catalogStyles.exploreCard} href="/en/works">
              <div><span className={catalogStyles.exploreKicker}>Return to the source</span><h2>Browse works</h2><p>Move from an author to the anthology, philosophical text, history, or poetry collection behind the line.</p></div>
              <div className={catalogStyles.exploreFooter}><span>Verified source collections</span><span className={catalogStyles.exploreArrow}>→</span></div>
            </a>
            <a className={catalogStyles.exploreCard} href="/en#search">
              <div><span className={catalogStyles.exploreKicker}>Describe your meaning</span><h2>Search directly</h2><p>Use ordinary English and let the system find the closest source-verified Chinese line.</p></div>
              <div className={catalogStyles.exploreFooter}><span>English intent → Chinese classic</span><span className={catalogStyles.exploreArrow}>→</span></div>
            </a>
          </div>
        </div>
      </section>

      <footer className={baseStyles.footer}>
        <div className={`${baseStyles.container} ${baseStyles.footerInner}`}>
          <p>Author pages are generated only for curated profiles with multiple verified entries. The product does not publish thousands of thin name pages.</p>
          <p><a className={baseStyles.textLink} href="/en/explore">Back to Explore →</a></p>
        </div>
      </footer>
    </main>
  );
}

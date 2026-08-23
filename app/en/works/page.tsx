import type { Metadata } from "next";
import EnglishNav from "@/components/EnglishNav";
import baseStyles from "@/app/en/english.module.css";
import catalogStyles from "@/app/en/catalog.module.css";
import { getPublishedEnglishWorks } from "@/lib/english-catalog.server";

export const metadata: Metadata = {
  title: "Classical Chinese Works and Poetry Collections in English | Gu Ren Said",
  description: "Browse verified bilingual lines from the Book of Songs, Analects, Tao Te Ching, Mencius, Xunzi, Zhuangzi, Complete Tang Poems, Records of the Grand Historian, and more.",
  alternates: {
    canonical: "/en/works",
    languages: { en: "/en/works", "x-default": "/en/works" }
  },
  openGraph: {
    title: "Classical Chinese Works and Source Collections in English",
    description: "Return famous Chinese lines to their original texts, anthologies, histories, and poetry collections.",
    type: "website",
    url: "https://gurensaid.com/en/works",
    siteName: "Gu Ren Said",
    images: ["/og-en.svg"]
  }
};

export default function EnglishWorksPage() {
  const works = getPublishedEnglishWorks();

  return (
    <main className={baseStyles.page}>
      <div className={baseStyles.container}>
        <EnglishNav />
        <header className={baseStyles.pageHero}>
          <div className={baseStyles.breadcrumbs}><a href="/en">Home</a><span>›</span><a href="/en/explore">Explore</a><span>›</span><span>Works & collections</span></div>
          <p className={baseStyles.eyebrow}>Browse by source</p>
          <h1 className={baseStyles.pageTitle}>Return familiar lines to the works and collections behind them.</h1>
          <p className={baseStyles.pageIntro}>A source page is published only when the English corpus contains multiple verified entries. This keeps the collection useful and avoids creating thin pages for every isolated title or attribution.</p>
          <div className={catalogStyles.heroStats}>
            <span className={catalogStyles.heroStat}><strong>{works.length}</strong> published source collections</span>
            <span className={catalogStyles.heroStat}><strong>{works.reduce((sum, work) => sum + work.items.length, 0)}</strong> source-linked entries</span>
          </div>
        </header>
      </div>

      <section className={baseStyles.sectionMuted}>
        <div className={baseStyles.container}>
          <div className={catalogStyles.catalogGrid}>
            {works.map((work) => (
              <a className={catalogStyles.catalogCard} href={work.href} key={work.slug}>
                <div className={catalogStyles.catalogTop}>
                  <span className={catalogStyles.catalogSeal} lang="zh-CN">{work.chineseName.replace(/[《》]/g, "").slice(0, 1)}</span>
                  <span className={catalogStyles.catalogCount}>{work.items.length} lines</span>
                </div>
                <h2>{work.name}<span className={catalogStyles.catalogChinese} lang="zh-CN">{work.chineseName}</span></h2>
                <div className={catalogStyles.catalogMeta}>{work.kind}</div>
                <p className={catalogStyles.catalogDescription}>{work.description}</p>
                <div className={catalogStyles.catalogBottom}><span>Explore source</span><span className={catalogStyles.catalogArrow}>→</span></div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className={baseStyles.section}>
        <div className={baseStyles.container}>
          <div className={catalogStyles.exploreGrid}>
            <a className={catalogStyles.exploreCard} href="/en/topics">
              <div><span className={catalogStyles.exploreKicker}>Start with meaning</span><h2>Browse themes</h2><p>See the same source appear across love, learning, nature, integrity, family, solitude, travel, and more.</p></div>
              <div className={catalogStyles.exploreFooter}><span>31 curated themes</span><span className={catalogStyles.exploreArrow}>→</span></div>
            </a>
            <a className={catalogStyles.exploreCard} href="/en/poets">
              <div><span className={catalogStyles.exploreKicker}>Start with a voice</span><h2>Browse authors</h2><p>Follow Li Bai, Su Shi, Confucius, Laozi, and other substantial author collections.</p></div>
              <div className={catalogStyles.exploreFooter}><span>Poets and thinkers</span><span className={catalogStyles.exploreArrow}>→</span></div>
            </a>
            <a className={catalogStyles.exploreCard} href="/en#search">
              <div><span className={catalogStyles.exploreKicker}>Start with your words</span><h2>Search directly</h2><p>Describe a feeling or idea and find the closest line from a verified source.</p></div>
              <div className={catalogStyles.exploreFooter}><span>English intent → Chinese classic</span><span className={catalogStyles.exploreArrow}>→</span></div>
            </a>
          </div>
        </div>
      </section>

      <footer className={baseStyles.footer}>
        <div className={`${baseStyles.container} ${baseStyles.footerInner}`}>
          <p>Source pages group only the entries already verified in the bilingual corpus; they are not complete machine translations of the underlying works.</p>
          <p><a className={baseStyles.textLink} href="/en/explore">Back to Explore →</a></p>
        </div>
      </footer>
    </main>
  );
}

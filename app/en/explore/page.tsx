import type { Metadata } from "next";
import EnglishNav from "@/components/EnglishNav";
import baseStyles from "@/app/en/english.module.css";
import catalogStyles from "@/app/en/catalog.module.css";
import {
  getEnglishCatalogStats,
  getPublishedEnglishAuthors,
  getPublishedEnglishWorks
} from "@/lib/english-catalog.server";

export const metadata: Metadata = {
  title: "Explore Chinese Poets, Classics and Themes | Gu Ren Said",
  description: "Browse source-verified classical Chinese lines by theme, poet or thinker, and original work or collection—with Chinese, pinyin, English meaning, and context.",
  alternates: {
    canonical: "/en/explore",
    languages: { en: "/en/explore", "x-default": "/en/explore" }
  },
  openGraph: {
    title: "Explore the Gu Ren Said Chinese Classics Corpus",
    description: "Browse verified Chinese lines by theme, author, and source collection.",
    type: "website",
    url: "https://gurensaid.com/en/explore",
    siteName: "Gu Ren Said",
    images: ["/og-en.svg"]
  }
};

export default function EnglishExplorePage() {
  const stats = getEnglishCatalogStats();
  const authors = getPublishedEnglishAuthors().slice(0, 6);
  const works = getPublishedEnglishWorks().slice(0, 6);

  return (
    <main className={baseStyles.page}>
      <div className={baseStyles.container}>
        <EnglishNav />

        <header className={baseStyles.pageHero}>
          <div className={baseStyles.breadcrumbs}><a href="/en">Home</a><span>›</span><span>Explore</span></div>
          <p className={baseStyles.eyebrow}>Browse the verified corpus</p>
          <h1 className={baseStyles.pageTitle}>Explore Chinese classics by meaning, author, and source.</h1>
          <p className={baseStyles.pageIntro}>A modern English search can lead to one line. These collections let you keep going—through related feelings, the work of a poet or thinker, and the original anthology or text behind the quotation.</p>
          <div className={catalogStyles.heroStats}>
            <span className={catalogStyles.heroStat}><strong>{stats.classics}+</strong> bilingual classics</span>
            <span className={catalogStyles.heroStat}><strong>{stats.themes}</strong> curated themes</span>
            <span className={catalogStyles.heroStat}><strong>{stats.authors}</strong> author collections</span>
            <span className={catalogStyles.heroStat}><strong>{stats.works}</strong> source collections</span>
          </div>
        </header>
      </div>

      <section className={baseStyles.sectionMuted}>
        <div className={baseStyles.container}>
          <div className={catalogStyles.exploreGrid}>
            <a className={catalogStyles.exploreCard} href="/en/topics">
              <div>
                <span className={catalogStyles.exploreKicker}>Browse by meaning</span>
                <h2>Themes</h2>
                <p>Love, moonlight, family, solitude, learning, integrity, resilience, nature, travel, and more.</p>
              </div>
              <div className={catalogStyles.exploreFooter}><span>{stats.themes} curated starting points</span><span className={catalogStyles.exploreArrow}>→</span></div>
            </a>
            <a className={catalogStyles.exploreCard} href="/en/poets">
              <div>
                <span className={catalogStyles.exploreKicker}>Browse by voice</span>
                <h2>Poets & thinkers</h2>
                <p>Move from a single line into verified collections for Li Bai, Su Shi, Confucius, Laozi, and others.</p>
              </div>
              <div className={catalogStyles.exploreFooter}><span>{stats.authors} substantial collections</span><span className={catalogStyles.exploreArrow}>→</span></div>
            </a>
            <a className={catalogStyles.exploreCard} href="/en/works">
              <div>
                <span className={catalogStyles.exploreKicker}>Browse by source</span>
                <h2>Works & collections</h2>
                <p>Return quotations to the Book of Songs, Analects, Tao Te Ching, Complete Tang Poems, and other sources.</p>
              </div>
              <div className={catalogStyles.exploreFooter}><span>{stats.works} verified source groups</span><span className={catalogStyles.exploreArrow}>→</span></div>
            </a>
          </div>
        </div>
      </section>

      <section className={baseStyles.section}>
        <div className={baseStyles.container}>
          <div className={baseStyles.sectionHeader}>
            <div>
              <p className={baseStyles.sectionEyebrow}>Popular author collections</p>
              <h2 className={baseStyles.sectionTitle}>Follow a voice across several themes.</h2>
            </div>
            <a className={baseStyles.textLink} href="/en/poets">All poets and thinkers →</a>
          </div>
          <div className={catalogStyles.catalogGrid}>
            {authors.map((author) => (
              <a className={catalogStyles.catalogCard} href={author.href} key={author.slug}>
                <div className={catalogStyles.catalogTop}>
                  <span className={catalogStyles.catalogSeal} lang="zh-CN">{author.chineseName.slice(0, 1)}</span>
                  <span className={catalogStyles.catalogCount}>{author.items.length} lines</span>
                </div>
                <h3>{author.name}<span className={catalogStyles.catalogChinese} lang="zh-CN">{author.chineseName}</span></h3>
                <div className={catalogStyles.catalogMeta}>{author.role} · {author.era}</div>
                <p className={catalogStyles.catalogDescription}>{author.description}</p>
                <div className={catalogStyles.catalogBottom}><span>Open collection</span><span className={catalogStyles.catalogArrow}>→</span></div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className={baseStyles.sectionMuted}>
        <div className={baseStyles.container}>
          <div className={baseStyles.sectionHeader}>
            <div>
              <p className={baseStyles.sectionEyebrow}>Source collections</p>
              <h2 className={baseStyles.sectionTitle}>See where the lines actually come from.</h2>
            </div>
            <a className={baseStyles.textLink} href="/en/works">All works and collections →</a>
          </div>
          <div className={catalogStyles.catalogGrid}>
            {works.map((work) => (
              <a className={catalogStyles.catalogCard} href={work.href} key={work.slug}>
                <div className={catalogStyles.catalogTop}>
                  <span className={catalogStyles.catalogSeal} lang="zh-CN">{work.chineseName.replace(/[《》]/g, "").slice(0, 1)}</span>
                  <span className={catalogStyles.catalogCount}>{work.items.length} lines</span>
                </div>
                <h3>{work.name}<span className={catalogStyles.catalogChinese} lang="zh-CN">{work.chineseName}</span></h3>
                <div className={catalogStyles.catalogMeta}>{work.kind}</div>
                <p className={catalogStyles.catalogDescription}>{work.description}</p>
                <div className={catalogStyles.catalogBottom}><span>Open source collection</span><span className={catalogStyles.catalogArrow}>→</span></div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <footer className={baseStyles.footer}>
        <div className={`${baseStyles.container} ${baseStyles.footerInner}`}>
          <p>Every collection is assembled from the same source-linked bilingual corpus used by English search. Thin or unsupported author and source pages are not published.</p>
          <p><a className={baseStyles.textLink} href="/en">Search in your own words →</a></p>
        </div>
      </footer>
    </main>
  );
}

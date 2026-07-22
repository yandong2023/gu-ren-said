import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import ChengyuCard from "@/components/ChengyuCard";
import { chengyuHref, getPreferredChengyuQuery, isChengyuIdiomQuery, isPublishedChengyuQuery, searchChengyu, slugToChengyuQuery } from "@/lib/chengyu-large";

type PageProps = {
  params: Promise<{ slug: string }>;
};

async function getQuery(params: PageProps["params"]) {
  const { slug } = await params;
  return slugToChengyuQuery(slug);
}

function normalizeRelatedQuery(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, "");
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const query = await getQuery(params);
  const idiomQuery = isChengyuIdiomQuery(query);
  const preferredQuery = getPreferredChengyuQuery(query);
  const canonicalQuery = preferredQuery ?? query;
  const canonicalPath = preferredQuery ? chengyuHref(preferredQuery) : idiomQuery ? "/chengyu" : chengyuHref(query);
  const result = searchChengyu(canonicalQuery, 1)[0];
  const title = idiomQuery && !preferredQuery
    ? "成语怎么说｜口语转成语｜古人曰"
    : `${canonicalQuery}，成语怎么说？｜古人曰`;
  const description = idiomQuery && !preferredQuery
    ? "输入一句大白话，找到意思相近、语气合适、能正确使用的成语。"
    : result
      ? `“${canonicalQuery}”可以用成语“${result.idiom}”表达：${result.meaning}`
      : `输入“${canonicalQuery}”，查找意思相近、语气合适、能正确使用的成语。`;

  return {
    title,
    description,
    alternates: { canonical: canonicalPath },
    robots: {
      index: !idiomQuery && Boolean(result) && isPublishedChengyuQuery(query),
      follow: true
    },
    openGraph: {
      title,
      description,
      type: "article",
      url: `https://gurensaid.com${canonicalPath}`,
      siteName: "古人曰",
      images: ["/og.svg"]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og.svg"]
    }
  };
}

export default async function ChengyuQueryPage({ params }: PageProps) {
  const query = await getQuery(params);
  const idiomQuery = isChengyuIdiomQuery(query);
  const preferredQuery = getPreferredChengyuQuery(query);

  if (idiomQuery) permanentRedirect(preferredQuery ? chengyuHref(preferredQuery) : "/chengyu");

  const results = searchChengyu(query, 8);
  const top = results[0];

  if (!top) notFound();

  const currentKey = normalizeRelatedQuery(query);
  const relatedQueries = Array.from(new Set([
    top.idiom,
    ...results.slice(1).map((result) => result.idiom),
    ...top.synonyms,
    ...top.antonyms,
    ...top.modernMeanings
  ]))
    .filter((item) => normalizeRelatedQuery(item) !== currentKey && isPublishedChengyuQuery(item))
    .slice(0, 8);

  return (
    <main className="shell">
      <nav className="nav" aria-label="主导航">
        <a className="brand" href="/"><span className="brand-mark">古</span><span>古人曰</span></a>
        <div className="nav-actions">
          <a className="nav-pill" href="/">古文怎么说</a>
          <a className="nav-pill" href="/chengyu">成语怎么说</a>
          <a className="nav-pill" href="/hot">热门反查</a>
        </div>
      </nav>

      <section className="query-hero">
        <h1>“{query}”，成语怎么说？</h1>
        <p>找到意思相近、语气合适的成语，并提供释义、例句和近义反义。</p>
      </section>

      <section aria-label="推荐成语">
        <div className="section-title"><div><h2>推荐成语</h2><p>结果会说明为什么匹配，以及适合什么语气和场景。</p></div></div>
        <div className="chengyu-results">
          {results.map((result) => <ChengyuCard key={result.id} result={result} />)}
        </div>
      </section>

      {relatedQueries.length > 0 ? (
        <section className="related-searches" aria-label="相关成语和说法">
          <div className="section-title"><div><h2>相关成语和说法</h2><p>继续查看近义、反义和相似使用场景。</p></div></div>
          <div className="hot-strip-list">
            {relatedQueries.map((item, index) => (
              <a href={chengyuHref(item)} className="hot-chip" key={item}><span>{index + 1}</span>{item}</a>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}

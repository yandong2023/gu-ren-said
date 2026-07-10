import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import QuoteCard from "@/components/QuoteCard";
import { runSearch } from "@/lib/search-service.server";
import { absoluteQueryUrl, queryHref, shouldIndexQuery, slugToQuery } from "@/lib/trends.server";

type PageProps = {
  params: Promise<{ slug: string }>;
};

const getQueryPageData = cache((query: string) => runSearch(query, 6, { enhance: false }));

async function getQuery(params: PageProps["params"]) {
  const { slug } = await params;
  return slugToQuery(slug);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const query = await getQuery(params);
  const shouldIndex = shouldIndexQuery(query);
  const payload = await getQueryPageData(query);
  const result = payload.results[0];
  const title = `${query}，古文怎么说？｜古人曰`;
  const description = result
    ? `${query}的古诗文表达：${result.quote} ——${result.dynasty}·${result.author}《${result.title}》。`
    : `把“${query}”反查成更有文化的古诗文原句，查看真实出处和原文。`;
  const image = result
    ? `/api/share-image?q=${encodeURIComponent(query)}&quote=${encodeURIComponent(result.quote)}&author=${encodeURIComponent(result.author)}&dynasty=${encodeURIComponent(result.dynasty)}&title=${encodeURIComponent(result.title)}&explain=${encodeURIComponent(result.translation || result.reason)}`
    : "/og.svg";

  return {
    title,
    description,
    alternates: {
      canonical: queryHref(query)
    },
    robots: {
      index: shouldIndex && Boolean(result),
      follow: true
    },
    openGraph: {
      title,
      description,
      type: "article",
      url: absoluteQueryUrl(query),
      siteName: "古人曰",
      images: [image]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image]
    }
  };
}

export default async function QueryPage({ params }: PageProps) {
  const query = await getQuery(params);
  const payload = await getQueryPageData(query);
  const top = payload.results[0];

  if (!top) notFound();

  return (
    <main className="shell">
      <nav className="nav" aria-label="主导航">
        <a className="brand" href="/"><span className="brand-mark">古</span><span>古人曰</span></a>
        <div className="nav-actions">
          <a className="nav-pill" href="/chengyu">成语怎么说</a>
          <a className="nav-pill" href="/hot">热门反查</a>
        </div>
      </nav>

      <section className="query-hero">
        <h1>“{query}”，古文怎么说？</h1>
        <p>找到意思相近的古诗文原句、作者、出处和原文。</p>
      </section>

      <section aria-label="推荐表达">
        <div className="section-title"><div><h2>推荐表达</h2><p>结果保留原句、出处、解释和原文，方便核对和学习。</p></div></div>
        <div className="single-result">
          <QuoteCard result={top} query={query} />
        </div>
      </section>

      {payload.results.length > 1 ? (
        <section aria-label="还能怎么说">
          <div className="section-title"><div><h2>还能怎么说</h2><p>不同句子适合不同语气和场景。</p></div></div>
          <div className="results">
            {payload.results.slice(1).map((result) => <QuoteCard key={result.id} result={result} query={query} compact />)}
          </div>
        </section>
      ) : null}

      <section className="related-searches" aria-label="相似搜索">
        <div className="section-title"><div><h2>相似搜索</h2><p>继续看看这些现代话，古人会怎么说。</p></div></div>
        <div className="hot-strip-list">
          {["我爱你", "你真好看", "我 emo 了", "这事包的", "太卷了想躺平", "不要放弃", "想家了", "我真的会谢"].filter((item) => item !== query).slice(0, 8).map((item, index) => (
            <a href={queryHref(item)} className="hot-chip" key={item}><span>{index + 1}</span>{item}</a>
          ))}
        </div>
      </section>
    </main>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import QuoteCard from "@/components/QuoteCard";
import { getRelatedQueries } from "@/lib/related-queries";
import { runSearch } from "@/lib/search-service.server";
import { absoluteQueryUrl, fallbackTrending, queryHref, shouldIndexQuery, slugToQuery } from "@/lib/trends.server";

type PageProps = {
  params: Promise<{ slug: string }>;
};

const getStableQueryPageData = cache((query: string) => runSearch(query, 6, { enhance: false }));
const getEnhancedQueryPageData = cache((query: string) => runSearch(query, 6, { enhance: true }));

async function getQuery(params: PageProps["params"]) {
  const { slug } = await params;
  return slugToQuery(slug);
}

function isUsableQuery(query: string) {
  const value = query.trim();
  return value.length >= 2 && value.length <= 60 && !/[\r\n<>]/.test(value);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const query = await getQuery(params);
  const shouldIndex = shouldIndexQuery(query);
  const payload = await getStableQueryPageData(query);
  const result = payload.results[0];
  const title = `${query}，古文怎么说？｜古人曰`;
  const description = result
    ? `${query}的古诗文表达：${result.quote} ——${result.dynasty}·${result.author}《${result.title}》。`
    : `暂时没有找到与“${query}”足够贴切的古诗文表达。可以换一种更明确的说法继续反查。`;
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
      type: result ? "article" : "website",
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
  if (!isUsableQuery(query)) notFound();

  const shouldIndex = shouldIndexQuery(query);
  const payload = shouldIndex
    ? await getStableQueryPageData(query)
    : await getEnhancedQueryPageData(query);
  const top = payload.results[0];
  const relatedQueries = getRelatedQueries(query, payload.results, 8);
  const fallbackQueries = fallbackTrending(8);
  const suggestions = relatedQueries.length > 0
    ? relatedQueries
    : fallbackQueries.map((item) => ({ query: item.query, href: item.href, score: item.count }));

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
        <p>{top ? "找到意思相近的古诗文原句、作者、出处和原文。" : "这句话暂时没有找到足够贴切、可以放心展示的古诗文表达。"}</p>
      </section>

      {top ? (
        <>
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
        </>
      ) : (
        <section aria-label="暂无贴切结果">
          <div className="section-title"><div><h2>暂时没有贴切结果</h2><p>宁可少给，也不硬凑一句看似有文化、实际不相关的古文。</p></div></div>
          <div className="empty-state">
            <strong>可以把表达改得更聚焦一些：</strong>
            <p>例如把“正常商业竞争，不要总是做些小动作”拆成“做事要光明磊落”“不要背后使小手段”“竞争也要守规矩”，通常更容易找到准确对应。</p>
            <p><a className="nav-pill" href="/">返回首页重新描述</a></p>
          </div>
        </section>
      )}

      {suggestions.length > 0 ? (
        <section className="related-searches" aria-label="相关搜索">
          <div className="section-title"><div><h2>你可能还想查</h2><p>{top ? "根据当前结果的主题、情绪和使用场景推荐。" : "先看看这些已有高质量结果的表达。"}</p></div></div>
          <div className="hot-strip-list">
            {suggestions.map((item, index) => (
              <a href={item.href} className="hot-chip" key={item.href}><span>{index + 1}</span>{item.query}</a>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}

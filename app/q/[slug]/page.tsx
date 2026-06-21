import type { Metadata } from "next";
import QuoteCard from "@/components/QuoteCard";
import { getSharePersona } from "@/lib/share-persona";
import { runSearch } from "@/lib/search-service.server";
import { absoluteQueryUrl, queryHref, shouldIndexQuery, slugToQuery } from "@/lib/trends.server";

type PageProps = {
  params: Promise<{ slug: string }>;
};

async function getQuery(params: PageProps["params"]) {
  const { slug } = await params;
  return slugToQuery(slug);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const query = await getQuery(params);
  const shouldIndex = await shouldIndexQuery(query);
  const payload = await runSearch(query, 1, { enhance: false });
  const result = payload.results[0];
  const title = `${query}，古人怎么说？｜古人嘴替`;
  const description = result
    ? `${query}的古人嘴替：${result.quote} ——${result.dynasty}·${result.author}《${result.title}》。`
    : `把“${query}”换成更有文化的古人说法，查看真实出处和原文。`;
  const share = result ? getSharePersona(result) : null;
  const image = result
    ? `/api/share-image?q=${encodeURIComponent(query)}&quote=${encodeURIComponent(result.quote)}&author=${encodeURIComponent(result.author)}&dynasty=${encodeURIComponent(result.dynasty)}&title=${encodeURIComponent(result.title)}&persona=${encodeURIComponent(share?.name ?? "古人嘴替生成器")}&slogan=${encodeURIComponent(share?.slogan ?? "把你的现代话换成古人说法")}`
    : "/og.svg";

  return {
    title,
    description,
    alternates: {
      canonical: queryHref(query)
    },
    robots: {
      index: shouldIndex,
      follow: true
    },
    openGraph: {
      title,
      description,
      url: absoluteQueryUrl(query),
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
  const payload = await runSearch(query, 6, { enhance: true });
  const top = payload.results[0];

  return (
    <main className="shell">
      <nav className="nav" aria-label="主导航">
        <a className="brand" href="/"><span className="brand-mark">古</span><span>古人早就说过</span></a>
        <a className="nav-pill" href="/hot">大家都在嘴替什么</a>
      </nav>

      <section className="query-hero">
        <h1>“{query}”，古人怎么说？</h1>
        <p>把这句现代话换成更有文化、更有出处的古人嘴替表达。</p>
      </section>

      {top ? (
        <section aria-label="最佳古人嘴替">
          <div className="section-title"><div><h2>最佳古人嘴替</h2><p>结果保留原句、出处、解释和原文，方便核对和学习。</p></div></div>
          <div className="single-result">
            <QuoteCard result={top} query={query} />
          </div>
        </section>
      ) : (
        <div className="empty-state">暂时没有找到足够贴切的古人嘴替。可以回到首页换一种说法再试。</div>
      )}

      {payload.results.length > 1 ? (
        <section aria-label="更多相似表达">
          <div className="section-title"><div><h2>更多相似说法</h2><p>不同句子适合不同语气和场景。</p></div></div>
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

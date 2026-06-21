import QuoteCard from "@/components/QuoteCard";
import { runSearch } from "@/lib/search-service.server";
import { getTrendingQueries } from "@/lib/trends.server";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "大家都在让古人嘴替什么｜古人早就说过",
  description: "查看全站最热门的古人嘴替搜索：我爱你、你真好看、我 emo 了、这事包的等。"
};

export default async function HotPage() {
  const items = await getTrendingQueries(10);
  const previews = await Promise.all(items.slice(0, 6).map(async (item) => {
    const payload = await runSearch(item.query, 1, { enhance: false });
    return { item, result: payload.results[0] };
  }));

  return (
    <main className="shell">
      <nav className="nav" aria-label="主导航">
        <a className="brand" href="/"><span className="brand-mark">古</span><span>古人早就说过</span></a>
        <a className="nav-pill" href="/">返回首页</a>
      </nav>

      <section className="section-title hot-title">
        <div>
          <h1>大家都在让古人嘴替什么？</h1>
          <p>这里会根据真实搜索动态更新。高频 query 也会变成独立页面，方便收藏、分享和被搜索引擎收录。</p>
        </div>
      </section>

      <section className="hot-ranking" aria-label="古人嘴替热榜">
        {items.map((item, index) => (
          <a className="hot-rank-row" href={item.href} key={item.href}>
            <span className="hot-rank-index">{index + 1}</span>
            <span className="hot-rank-query">{item.query}</span>
            <span className="hot-rank-count">{item.count} 次</span>
          </a>
        ))}
      </section>

      <section aria-label="热门卡片预览">
        <div className="section-title"><div><h2>热门古人嘴替卡片</h2><p>点进任意条目，可以打开独立长尾页。</p></div></div>
        <div className="results">
          {previews.filter((item) => item.result).map(({ item, result }) => (
            <a className="result-link" href={item.href} key={item.href}>
              <QuoteCard result={result!} query={item.query} compact />
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}

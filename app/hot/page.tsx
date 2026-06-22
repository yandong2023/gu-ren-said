import QuoteCard from "@/components/QuoteCard";
import { runSearch } from "@/lib/search-service.server";
import { getTrendingQueries, type TrendingQuery } from "@/lib/trends.server";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "热门反查｜古人曰",
  description: "查看今日、本周和历史最热门的古诗文反查：我爱你、你真好看、我 emo 了、这事包的等。"
};

function RankingBlock({ title, description, items, emptyText }: { title: string; description: string; items: TrendingQuery[]; emptyText?: string }) {
  return (
    <section aria-label={title}>
      <div className="section-title"><div><h2>{title}</h2><p>{description}</p></div></div>
      {items.length > 0 ? (
        <div className="hot-ranking">
          {items.map((item, index) => (
            <a className="hot-rank-row" href={item.href} key={`${title}-${item.href}`}>
              <span className="hot-rank-index">{index + 1}</span>
              <span className="hot-rank-query">{item.query}</span>
              <span className="hot-rank-count">{item.count} 次</span>
            </a>
          ))}
        </div>
      ) : (
        <div className="empty-state">{emptyText ?? "暂时还没有足够真实数据。"}</div>
      )}
    </section>
  );
}

export default async function HotPage() {
  const [todayItems, weekItems, allItems] = await Promise.all([
    getTrendingQueries(10, "today"),
    getTrendingQueries(10, "week"),
    getTrendingQueries(10, "all")
  ]);
  const previews = await Promise.all(todayItems.slice(0, 6).map(async (item) => {
    const payload = await runSearch(item.query, 1, { enhance: false });
    return { item, result: payload.results[0] };
  }));

  return (
    <main className="shell">
      <nav className="nav" aria-label="主导航">
        <a className="brand" href="/"><span className="brand-mark">古</span><span>古人曰</span></a>
        <a className="nav-pill" href="/">返回首页</a>
      </nav>

      <section className="section-title hot-title">
        <div>
          <h1>热门反查</h1>
          <p>今日排行榜看新鲜趋势，本周排行榜看近期热词，历史排行榜看长期高频表达。次数按搜索请求统计，不等于独立用户数。</p>
        </div>
      </section>

      <RankingBlock title="今日排行榜" description="今天大家正在查的现代话和网络热梗，只统计今天真实搜索。" items={todayItems} emptyText="今天还没有足够真实搜索数据。" />
      <RankingBlock title="本周排行榜" description="本周搜索次数最多的古诗文反查，只统计本周真实搜索。" items={weekItems} emptyText="本周还没有足够真实搜索数据。" />
      <RankingBlock title="历史排行榜" description="全站累计搜索次数最高的长期热门词。" items={allItems} />

      {previews.length > 0 ? (
        <section aria-label="今日热门知识卡片预览">
          <div className="section-title"><div><h2>今日热门知识卡片</h2><p>点开任意一句，查看对应的古诗文原句和出处。</p></div></div>
          <div className="results">
            {previews.filter((item) => item.result).map(({ item, result }) => (
              <a className="result-link" href={item.href} key={item.href}>
                <QuoteCard result={result!} query={item.query} compact />
              </a>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}

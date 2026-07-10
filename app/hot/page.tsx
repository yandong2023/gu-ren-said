import type { Metadata } from "next";
import QuoteCard from "@/components/QuoteCard";
import { getHotPageData, type HotItem } from "@/lib/hot.server";

export const revalidate = 60 * 30;

export const metadata: Metadata = {
  title: "热门反查｜古人曰",
  description: "查看今日、本周和历史最热门的古诗文反查：我爱你、你真好看、我 emo 了、这事包的等。",
  alternates: {
    canonical: "/hot"
  },
  openGraph: {
    title: "热门反查｜古人曰",
    description: "查看今日、本周和历史最热门的古诗文反查。",
    type: "website",
    url: "https://gurensaid.com/hot",
    siteName: "古人曰",
    images: ["/og.svg"]
  },
  twitter: {
    card: "summary_large_image",
    title: "热门反查｜古人曰",
    description: "查看今日、本周和历史最热门的古诗文反查。",
    images: ["/og.svg"]
  }
};

function RankingBlock({ title, description, items, emptyText }: { title: string; description: string; items: HotItem[]; emptyText?: string }) {
  return (
    <section aria-label={title}>
      <div className="section-title"><div><h2>{title}</h2><p>{description}</p></div></div>
      {items.length > 0 ? (
        <div className="hot-ranking">
          {items.map((item, index) => (
            <a className="hot-rank-row" href={item.href} key={`${title}-${item.href}`}>
              <span className="hot-rank-index">{index + 1}</span>
              <span className="hot-rank-query">{item.query}</span>
              <span className="hot-rank-count">{item.source === "editorial" ? "精选" : `${item.count} 次`}</span>
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
  const { today, week, all, previewGroup, previewLabel } = await getHotPageData();
  const todayItems = today.map(({ item }) => item);
  const weekItems = week.map(({ item }) => item);
  const allItems = all.map(({ item }) => item);
  const allIsEditorial = allItems[0]?.source === "editorial";

  return (
    <main className="shell">
      <nav className="nav" aria-label="主导航">
        <a className="brand" href="/"><span className="brand-mark">古</span><span>古人曰</span></a>
        <div className="nav-actions">
          <a className="nav-pill" href="/">返回首页</a>
          <a className="nav-pill" href="/chengyu">成语怎么说</a>
        </div>
      </nav>

      <section className="section-title hot-title">
        <div>
          <h1>热门反查</h1>
          <p>今日排行榜看新鲜趋势，本周排行榜看近期热词，长期热门看累计搜索。真实数据不足时会明确展示编辑精选，不使用虚假搜索次数。</p>
        </div>
      </section>

      <RankingBlock title="今日排行榜" description="今天大家正在查的现代话和网络热梗，只统计今天真实搜索，并过滤暂无有效古文结果的输入。" items={todayItems} emptyText="今天还没有足够真实且有效的搜索数据，可继续查看本周热门。" />
      <RankingBlock title="本周排行榜" description="本周搜索次数最多的古诗文反查，只统计本周真实搜索，并过滤暂无有效古文结果的输入。" items={weekItems} emptyText="本周还没有足够真实且有效的搜索数据，可继续查看长期热门。" />
      <RankingBlock title={allIsEditorial ? "编辑精选" : "历史排行榜"} description={allIsEditorial ? "真实历史数据不足时展示的人工精选表达，不代表搜索次数。" : "全站累计搜索次数最高的长期热门词。"} items={allItems} />

      {previewGroup.length > 0 ? (
        <section aria-label={`${previewLabel}知识卡片预览`}>
          <div className="section-title"><div><h2>{previewLabel}知识卡片</h2><p>点开任意一句，查看对应的古诗文原句和出处。</p></div></div>
          <div className="results">
            {previewGroup.slice(0, 6).map(({ item, result }) => (
              <a className="result-link" href={item.href} key={item.href}>
                <QuoteCard result={result} query={item.query} compact />
              </a>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}

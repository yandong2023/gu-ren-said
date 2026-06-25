import { chengyuHref, searchChengyu, slugToChengyuQuery } from "@/lib/chengyu";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

async function getQuery(params: PageProps["params"]) {
  const { slug } = await params;
  return slugToChengyuQuery(slug);
}

export async function generateMetadata({ params }: PageProps) {
  const query = await getQuery(params);
  const result = searchChengyu(query, 1)[0];
  const title = `${query}，成语怎么说？｜古人曰`;
  const description = result
    ? `“${query}”可以用成语“${result.idiom}”表达：${result.meaning}`
    : `输入“${query}”，查找意思相近、语气合适、能正确使用的成语。`;

  return {
    title,
    description,
    alternates: { canonical: chengyuHref(query) },
    openGraph: {
      title,
      description,
      url: `https://gurensaid.com${chengyuHref(query)}`
    },
    twitter: {
      card: "summary",
      title,
      description
    }
  };
}

export default async function ChengyuQueryPage({ params }: PageProps) {
  const query = await getQuery(params);
  const results = searchChengyu(query, 8);
  const top = results[0];

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

      {top ? (
        <section aria-label="推荐成语">
          <div className="section-title"><div><h2>推荐成语</h2><p>结果会说明为什么匹配，以及适合什么语气和场景。</p></div></div>
          <div className="chengyu-results">
            {results.map((result) => (
              <article className="result-card chengyu-card" key={result.id}>
                <div className="chengyu-card-main">
                  <span className="card-kicker">成语怎么说</span>
                  <div className="chengyu-query-line"><span className="knowledge-label">推荐成语</span><strong>{result.idiom}</strong><em>{result.pinyin}</em></div>
                  <p className="chengyu-meaning"><span className="knowledge-label">意思</span>{result.meaning}</p>
                  <div className="chengyu-meta"><span>{result.tone}</span>{result.scenes.slice(0, 4).map((scene) => <span key={scene}>{scene}</span>)}</div>
                  <div className="match-reason"><strong>为什么匹配</strong><span>{result.reason}</span></div>
                  <div className="chengyu-example"><span className="knowledge-label">例句</span>{result.example}</div>
                  {result.source ? <div className="source-line"><span className="knowledge-label">出处</span>{result.source}</div> : null}
                  <div className="chengyu-related">
                    {result.synonyms.length > 0 ? <p><strong>近义：</strong>{result.synonyms.join(" / ")}</p> : null}
                    {result.antonyms.length > 0 ? <p><strong>反义：</strong>{result.antonyms.join(" / ")}</p> : null}
                  </div>
                  {result.note ? <div className="chengyu-note">注意：{result.note}</div> : null}
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : (
        <div className="empty-state">暂时没有找到特别贴切的成语。可以回到“成语怎么说”页面换一种更明确的说法再试。</div>
      )}
    </main>
  );
}

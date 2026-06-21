import type { SearchResult } from "./types";

const SITE_URL = "https://gurensaid.com";
const ALL_TIME_KEY = "grs:queries:all";
const FALLBACK_COUNT = 128;

export type TrendingQuery = {
  query: string;
  slug: string;
  count: number;
  href: string;
};

export const FALLBACK_TRENDING_QUERIES = [
  "我爱你",
  "你真好看",
  "我 emo 了",
  "这事包的",
  "太卷了想躺平",
  "我想你",
  "我喜欢你",
  "不要放弃",
  "想家了",
  "我真的会谢",
  "不内耗了",
  "这人太牛了"
];

function redisConfig() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return { url: url.replace(/\/+$/, ""), token };
}

async function redisCommand<T>(command: Array<string | number>): Promise<T | null> {
  const config = redisConfig();
  if (!config) return null;

  try {
    const response = await fetch(config.url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(command),
      cache: "no-store"
    });

    if (!response.ok) return null;
    const payload = (await response.json()) as { result?: T };
    return payload.result ?? null;
  } catch {
    return null;
  }
}

export function normalizeQuery(query: string) {
  return query.trim().replace(/\s+/g, " ").slice(0, 60);
}

export function queryToSlug(query: string) {
  const normalized = normalizeQuery(query).toLowerCase();
  return encodeURIComponent(
    normalized
      .replace(/[，。！？!?.,、/\\]+/g, " ")
      .replace(/\s+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80)
  );
}

export function slugToQuery(slug: string) {
  try {
    return decodeURIComponent(slug).replace(/-/g, " ").trim();
  } catch {
    return slug.replace(/-/g, " ").trim();
  }
}

export function queryHref(query: string) {
  return `/q/${queryToSlug(query)}`;
}

function looksUnsafeForPublicPage(query: string) {
  const value = normalizeQuery(query);
  if (value.length < 2 || value.length > 40) return true;
  if (/https?:\/\//i.test(value) || /@/.test(value)) return true;
  if (/\d{5,}/.test(value)) return true;
  if (/[\r\n<>]/.test(value)) return true;
  return false;
}

export function isPublicQueryCandidate(query: string) {
  return !looksUnsafeForPublicPage(query);
}

export function fallbackTrending(limit = 10): TrendingQuery[] {
  return FALLBACK_TRENDING_QUERIES.slice(0, limit).map((query, index) => ({
    query,
    slug: queryToSlug(query),
    count: FALLBACK_COUNT - index * 7,
    href: queryHref(query)
  }));
}

export async function recordSearchQuery(query: string, results: SearchResult[]) {
  const normalized = normalizeQuery(query);
  if (!isPublicQueryCandidate(normalized)) return;

  const slug = queryToSlug(normalized);
  const first = results[0];
  const now = new Date().toISOString();
  const dayKey = `grs:queries:day:${now.slice(0, 10)}`;
  const metaKey = `grs:query:${slug}`;

  await Promise.all([
    redisCommand<number>(["ZINCRBY", ALL_TIME_KEY, 1, normalized]),
    redisCommand<number>(["ZINCRBY", dayKey, 1, normalized]),
    redisCommand<number>(["EXPIRE", dayKey, 60 * 60 * 24 * 14]),
    first
      ? redisCommand<number>([
          "HSET",
          metaKey,
          "query",
          normalized,
          "slug",
          slug,
          "quote",
          first.quote,
          "source",
          `${first.dynasty}·${first.author}《${first.title}》`,
          "updatedAt",
          now
        ])
      : null
  ]);
}

export async function getTrendingQueries(limit = 10): Promise<TrendingQuery[]> {
  const raw = await redisCommand<string[]>(["ZREVRANGE", ALL_TIME_KEY, 0, Math.max(0, limit - 1), "WITHSCORES"]);
  if (!raw || raw.length === 0) return fallbackTrending(limit);

  const items: TrendingQuery[] = [];
  for (let i = 0; i < raw.length; i += 2) {
    const query = raw[i];
    const score = Number(raw[i + 1] ?? 0);
    if (!query || !isPublicQueryCandidate(query)) continue;
    items.push({
      query,
      slug: queryToSlug(query),
      count: score,
      href: queryHref(query)
    });
  }

  return items.length > 0 ? items.slice(0, limit) : fallbackTrending(limit);
}

export async function getQueryCount(query: string): Promise<number> {
  const normalized = normalizeQuery(query);
  const score = await redisCommand<string | number>(["ZSCORE", ALL_TIME_KEY, normalized]);
  return Number(score ?? 0);
}

export async function shouldIndexQuery(query: string) {
  const normalized = normalizeQuery(query);
  if (!isPublicQueryCandidate(normalized)) return false;
  if (FALLBACK_TRENDING_QUERIES.includes(normalized)) return true;
  const count = await getQueryCount(normalized);
  return count >= Number(process.env.QUERY_INDEX_MIN_COUNT ?? 5);
}

export function absoluteQueryUrl(query: string) {
  return `${SITE_URL}${queryHref(query)}`;
}

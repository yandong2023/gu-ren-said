import type { SearchResult } from "./types";

const SITE_URL = "https://gurensaid.com";
const ALL_TIME_KEY = "grs:queries:all";
const FALLBACK_COUNT = 128;
const BEIJING_OFFSET_MS = 8 * 60 * 60 * 1000;

type TrendingRange = "all" | "today" | "week";

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

export const SEO_QUERY_WHITELIST = Array.from(new Set([
  ...FALLBACK_TRENDING_QUERIES,
  "你好漂亮",
  "我想和你一辈子在一起",
  "我暗恋你很久了",
  "今天破防了",
  "考试稳了拿下",
  "不想上班只想回家",
  "这作品封神了",
  "这事太离谱",
  "一个人在外突然想家",
  "算了不内耗了",
  "看开了没什么大不了",
  "别放弃继续扛住",
  "慢慢变强别急",
  "开心到飞起",
  "有点心动念念不忘",
  "我们真是同频朋友"
]));

const BLOCKED_PUBLIC_QUERY_PATTERNS = [
  /傻[逼比屄b]/i,
  /你是傻/i,
  /牛[逼比屄b]/i,
  /卧槽|我靠|草泥马|呆卵|妈的|艹|操你|去死/i,
  /你真丑|真丑|丑爆|长得丑|难看/i,
  /猥琐|别浪/i,
  /^牛福$/i,
  /^曼巴飞弹$/i,
  /这个故事告诉我们/i,
  /把.+说[得的]更有文化/i,
  /说[得的]更有文化/i
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

export function isSeoQueryWhitelisted(query: string) {
  return SEO_QUERY_WHITELIST.includes(normalizeQuery(query));
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
  if (!value) return true;
  if (isSeoQueryWhitelisted(value)) return false;
  if (value.length < 2 || value.length > 18) return true;
  if (/https?:\/\//i.test(value) || /@/.test(value)) return true;
  if (/\d{5,}/.test(value)) return true;
  if (/[\r\n<>]/.test(value)) return true;
  return BLOCKED_PUBLIC_QUERY_PATTERNS.some((pattern) => pattern.test(value));
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

function beijingDate() {
  return new Date(Date.now() + BEIJING_OFFSET_MS);
}

function todayKey() {
  return beijingDate().toISOString().slice(0, 10);
}

function weekKey() {
  const now = beijingDate();
  const date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const day = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const week = Math.ceil((((date.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return `${date.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

export async function recordSearchQuery(query: string, results: SearchResult[]) {
  const normalized = normalizeQuery(query);
  if (!isPublicQueryCandidate(normalized)) return;

  const slug = queryToSlug(normalized);
  const first = results[0];
  const now = new Date().toISOString();
  const dayRankKey = `grs:queries:day:${todayKey()}`;
  const weekRankKey = `grs:queries:week:${weekKey()}`;
  const metaKey = `grs:query:${slug}`;

  await Promise.all([
    redisCommand<number>(["ZINCRBY", ALL_TIME_KEY, 1, normalized]),
    redisCommand<number>(["ZINCRBY", dayRankKey, 1, normalized]),
    redisCommand<number>(["EXPIRE", dayRankKey, 60 * 60 * 24 * 14]),
    redisCommand<number>(["ZINCRBY", weekRankKey, 1, normalized]),
    redisCommand<number>(["EXPIRE", weekRankKey, 60 * 60 * 24 * 70]),
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

function parseTrendingRaw(raw: string[] | null, limit: number): TrendingQuery[] {
  if (!raw || raw.length === 0) return [];

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

  return items.slice(0, limit);
}

function trendingKey(range: TrendingRange) {
  if (range === "today") return `grs:queries:day:${todayKey()}`;
  if (range === "week") return `grs:queries:week:${weekKey()}`;
  return ALL_TIME_KEY;
}

export async function getTrendingQueries(limit = 10, range: TrendingRange = "all"): Promise<TrendingQuery[]> {
  const raw = await redisCommand<string[]>(["ZREVRANGE", trendingKey(range), 0, Math.max(0, limit - 1), "WITHSCORES"]);
  const items = parseTrendingRaw(raw, limit);
  if (items.length > 0) return items;
  return range === "all" ? fallbackTrending(limit) : [];
}

export async function getQueryCount(query: string): Promise<number> {
  const normalized = normalizeQuery(query);
  const score = await redisCommand<string | number>(["ZSCORE", ALL_TIME_KEY, normalized]);
  return Number(score ?? 0);
}

export function shouldIndexQuery(query: string) {
  const normalized = normalizeQuery(query);
  return isPublicQueryCandidate(normalized) && isSeoQueryWhitelisted(normalized);
}

export function absoluteQueryUrl(query: string) {
  return `${SITE_URL}${queryHref(query)}`;
}

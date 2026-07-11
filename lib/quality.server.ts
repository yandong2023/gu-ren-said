import { createHash } from "node:crypto";
import type { SearchResult } from "./types";
import { isPublicQueryCandidate, normalizeQuery } from "./trends.server";

const SEARCH_QUALITY_KEY = "grs:quality:searches";
const FEEDBACK_KEY = "grs:feedback";
const MAX_SEARCH_RECORDS = 3000;

export type SearchQualityStatus = "success" | "empty" | "error";

export type SearchQualityRecord = {
  id: string;
  query: string;
  queryHash: string;
  status: SearchQualityStatus;
  resultCount: number;
  topScore: number;
  topResultId: string;
  topQuote: string;
  topSource: string;
  matchedBy: string[];
  lowConfidence: boolean;
  planConfidence: number;
  durationMs: number;
  aiEnhanced: boolean;
  createdAt: string;
};

type FeedbackRecord = {
  id?: string;
  type?: string;
  query?: string;
  resultId?: string;
  quote?: string;
  source?: string;
  note?: string;
  createdAt?: string;
};

type RecordSearchQualityInput = {
  query: string;
  status: SearchQualityStatus;
  results?: SearchResult[];
  durationMs?: number;
  aiEnhanced?: boolean;
  planConfidence?: number;
};

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

function clean(value: unknown, max = 180) {
  return String(value ?? "").replace(/[\r\n<>]/g, " ").replace(/\s+/g, " ").trim().slice(0, max);
}

function queryHash(query: string) {
  return createHash("sha256").update(query).digest("hex").slice(0, 16);
}

function safeQueryLabel(query: string) {
  const normalized = normalizeQuery(query);
  return isPublicQueryCandidate(normalized) ? normalized : `[已隐藏:${queryHash(normalized)}]`;
}

function parseJson<T>(value: string): T | null {
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function isLowConfidence(top: SearchResult | undefined) {
  if (!top) return false;
  const directSignals = new Set(["modern-exact", "exact", "modern-meaning", "semantic-theme", "emotion"]);
  const hasDirectSignal = top.matchedBy.some((item) => directSignals.has(item));
  return top.score < 62 || (!hasDirectSignal && top.score < 75);
}

export async function recordSearchQuality(input: RecordSearchQualityInput) {
  const normalized = normalizeQuery(input.query);
  if (!normalized) return false;

  const top = input.results?.[0];
  const record: SearchQualityRecord = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    query: safeQueryLabel(normalized),
    queryHash: queryHash(normalized),
    status: input.status,
    resultCount: input.results?.length ?? 0,
    topScore: Number(top?.score ?? 0),
    topResultId: clean(top?.id, 100),
    topQuote: clean(top?.quote, 180),
    topSource: top ? clean(`${top.dynasty}·${top.author}《${top.title}》`, 140) : "",
    matchedBy: Array.isArray(top?.matchedBy) ? top.matchedBy.map((item) => clean(item, 40)).slice(0, 12) : [],
    lowConfidence: isLowConfidence(top),
    planConfidence: Math.max(0, Math.min(1, Number(input.planConfidence ?? 0))),
    durationMs: Math.max(0, Math.round(Number(input.durationMs ?? 0))),
    aiEnhanced: Boolean(input.aiEnhanced),
    createdAt: new Date().toISOString()
  };

  const saved = await redisCommand<number>(["LPUSH", SEARCH_QUALITY_KEY, JSON.stringify(record)]);
  await redisCommand<number>(["LTRIM", SEARCH_QUALITY_KEY, 0, MAX_SEARCH_RECORDS - 1]);
  return saved !== null;
}

function groupSearches(records: SearchQualityRecord[]) {
  const groups = new Map<string, {
    query: string;
    attempts: number;
    success: number;
    empty: number;
    errors: number;
    lowConfidence: number;
    totalTopScore: number;
    scoredAttempts: number;
    lastSeen: string;
    topQuote: string;
    topSource: string;
  }>();

  for (const record of records) {
    const key = record.queryHash || record.query;
    const current = groups.get(key) ?? {
      query: record.query,
      attempts: 0,
      success: 0,
      empty: 0,
      errors: 0,
      lowConfidence: 0,
      totalTopScore: 0,
      scoredAttempts: 0,
      lastSeen: record.createdAt,
      topQuote: "",
      topSource: ""
    };

    current.attempts += 1;
    if (record.status === "success") current.success += 1;
    if (record.status === "empty") current.empty += 1;
    if (record.status === "error") current.errors += 1;
    if (record.lowConfidence) current.lowConfidence += 1;
    if (record.topScore > 0) {
      current.totalTopScore += record.topScore;
      current.scoredAttempts += 1;
    }
    if (record.createdAt > current.lastSeen) current.lastSeen = record.createdAt;
    if (!current.topQuote && record.topQuote) current.topQuote = record.topQuote;
    if (!current.topSource && record.topSource) current.topSource = record.topSource;
    groups.set(key, current);
  }

  return Array.from(groups.values())
    .map((group) => ({
      query: group.query,
      attempts: group.attempts,
      success: group.success,
      empty: group.empty,
      errors: group.errors,
      lowConfidence: group.lowConfidence,
      averageTopScore: group.scoredAttempts > 0 ? Number((group.totalTopScore / group.scoredAttempts).toFixed(1)) : 0,
      lastSeen: group.lastSeen,
      topQuote: group.topQuote,
      topSource: group.topSource,
      riskScore: group.empty * 4 + group.lowConfidence * 3 + group.errors * 5
    }))
    .sort((a, b) => b.riskScore - a.riskScore || b.attempts - a.attempts || b.lastSeen.localeCompare(a.lastSeen));
}

function groupFeedback(records: FeedbackRecord[]) {
  const groups = new Map<string, {
    query: string;
    resultId: string;
    quote: string;
    source: string;
    notAccurate: number;
    wrongSource: number;
    betterQuote: number;
    notes: string[];
    lastSeen: string;
  }>();

  for (const record of records) {
    const query = clean(record.query, 80);
    const resultId = clean(record.resultId, 100);
    if (!query) continue;
    const key = `${query}::${resultId}`;
    const current = groups.get(key) ?? {
      query,
      resultId,
      quote: clean(record.quote, 180),
      source: clean(record.source, 140),
      notAccurate: 0,
      wrongSource: 0,
      betterQuote: 0,
      notes: [],
      lastSeen: clean(record.createdAt, 40)
    };

    if (record.type === "not_accurate") current.notAccurate += 1;
    if (record.type === "wrong_source") current.wrongSource += 1;
    if (record.type === "better_quote") current.betterQuote += 1;
    const note = clean(record.note, 300);
    if (note && !current.notes.includes(note)) current.notes.push(note);
    const createdAt = clean(record.createdAt, 40);
    if (createdAt > current.lastSeen) current.lastSeen = createdAt;
    groups.set(key, current);
  }

  return Array.from(groups.values())
    .map((group) => ({ ...group, total: group.notAccurate + group.wrongSource + group.betterQuote, notes: group.notes.slice(0, 5) }))
    .sort((a, b) => b.wrongSource * 10 + b.notAccurate * 4 + b.betterQuote * 2 - (a.wrongSource * 10 + a.notAccurate * 4 + a.betterQuote * 2));
}

export async function getQualitySnapshot() {
  const [searchRaw, feedbackRaw] = await Promise.all([
    redisCommand<string[]>(["LRANGE", SEARCH_QUALITY_KEY, 0, 499]),
    redisCommand<string[]>(["LRANGE", FEEDBACK_KEY, 0, 499])
  ]);

  const searches = (searchRaw ?? []).map((item) => parseJson<SearchQualityRecord>(item)).filter((item): item is SearchQualityRecord => Boolean(item));
  const feedback = (feedbackRaw ?? []).map((item) => parseJson<FeedbackRecord>(item)).filter((item): item is FeedbackRecord => Boolean(item));

  return {
    enabled: Boolean(redisConfig()),
    generatedAt: new Date().toISOString(),
    summary: {
      totalSearches: searches.length,
      success: searches.filter((item) => item.status === "success").length,
      empty: searches.filter((item) => item.status === "empty").length,
      errors: searches.filter((item) => item.status === "error").length,
      lowConfidence: searches.filter((item) => item.lowConfidence).length,
      feedback: feedback.length
    },
    queryGroups: groupSearches(searches).slice(0, 100),
    feedbackGroups: groupFeedback(feedback).slice(0, 100),
    recentSearches: searches.slice(0, 100)
  };
}

import { createHash } from "node:crypto";
import type { SearchResult } from "./types";

type DeepSeekRerankItem = {
  id: string;
  reason?: string;
  fitScore?: number;
  accepted?: boolean;
};

type DeepSeekRerankResponse = {
  results?: DeepSeekRerankItem[];
};

export type DeepSeekQueryPlan = {
  intent?: string;
  emotion?: string;
  themes?: string[];
  keywords?: string[];
  modernParaphrases?: string[];
  classicalHintPhrases?: string[];
  avoidThemes?: string[];
  confidence?: number;
};

type DeepSeekPlanResponse = {
  intent?: string;
  emotion?: string;
  themes?: string[];
  keywords?: string[];
  modern_paraphrases?: string[];
  modernParaphrases?: string[];
  classical_hint_phrases?: string[];
  classicalHintPhrases?: string[];
  avoid_themes?: string[];
  avoidThemes?: string[];
  confidence?: number;
};

type CacheLookup<T> =
  | { hit: true; value: T | null }
  | { hit: false };

const DEFAULT_DEEPSEEK_URL = "https://api.deepseek.com/chat/completions";
const DEFAULT_MODEL = "deepseek-chat";
const DEFAULT_PLAN_CACHE_TTL_SECONDS = 60 * 60 * 24 * 30;
const DEFAULT_RERANK_CACHE_TTL_SECONDS = 60 * 60 * 24 * 7;
const MIN_ACCEPTED_FIT_SCORE = 58;
const planCache = new Map<string, DeepSeekQueryPlan | null>();
const rerankCache = new Map<string, SearchResult[]>();

function isDeepSeekEnabled() {
  return Boolean(process.env.DEEPSEEK_API_KEY) && process.env.DEEPSEEK_ENABLED !== "0";
}

function cacheTtlSeconds(name: string, fallback: number) {
  const value = Number(process.env[name] ?? fallback);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

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

function makeRedisCacheKey(kind: "plan" | "rerank", rawKey: string) {
  const hash = createHash("sha256").update(rawKey).digest("hex");
  return `grs:deepseek:${kind}:v2:${hash}`;
}

async function readJsonCache<T>(key: string): Promise<CacheLookup<T>> {
  const raw = await redisCommand<string | null>(["GET", key]);
  if (raw === null || raw === undefined) return { hit: false };

  try {
    return { hit: true, value: JSON.parse(String(raw)) as T };
  } catch {
    return { hit: false };
  }
}

async function writeJsonCache(key: string, value: unknown, ttlSeconds: number) {
  if (ttlSeconds <= 0) return;
  await redisCommand<string | null>(["SET", key, JSON.stringify(value), "EX", ttlSeconds]);
}

function stripJsonFence(value: string): string {
  return value.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```$/i, "").trim();
}

function parseJsonObject<T>(content: string): T | null {
  try {
    return JSON.parse(stripJsonFence(content)) as T;
  } catch {
    const start = content.indexOf("{");
    const end = content.lastIndexOf("}");
    if (start < 0 || end <= start) return null;
    try {
      return JSON.parse(content.slice(start, end + 1)) as T;
    } catch {
      return null;
    }
  }
}

async function callDeepSeek(messages: Array<{ role: "system" | "user"; content: string }>, temperature = 0.1) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey || process.env.DEEPSEEK_ENABLED === "0") return null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), Number(process.env.DEEPSEEK_TIMEOUT_MS ?? 10000));

  try {
    const response = await fetch(process.env.DEEPSEEK_BASE_URL ?? DEFAULT_DEEPSEEK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: process.env.DEEPSEEK_MODEL ?? DEFAULT_MODEL,
        temperature,
        response_format: { type: "json_object" },
        messages
      }),
      signal: controller.signal
    });

    if (!response.ok) return null;
    const data = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
    return data.choices?.[0]?.message?.content ?? null;
  } finally {
    clearTimeout(timeout);
  }
}

function normalizeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => String(item).trim()).filter(Boolean).slice(0, 24);
}

export async function planQueryWithDeepSeek(query: string): Promise<DeepSeekQueryPlan | null> {
  const cacheKey = query.trim().toLowerCase();
  if (planCache.has(cacheKey)) return planCache.get(cacheKey) ?? null;
  if (!isDeepSeekEnabled() || process.env.DEEPSEEK_PLANNER_ENABLED === "0") {
    planCache.set(cacheKey, null);
    return null;
  }

  const redisCacheKey = makeRedisCacheKey("plan", cacheKey);
  const cached = await readJsonCache<DeepSeekQueryPlan | null>(redisCacheKey);
  if (cached.hit) {
    planCache.set(cacheKey, cached.value);
    return cached.value;
  }

  try {
    const content = await callDeepSeek([
      {
        role: "system",
        content: [
          "你是一个中文古诗文检索规划器，不负责输出最终答案。",
          "用户会输入现代话、网络热梗、口头禅或日常表达。",
          "你的任务是先判断肯定/否定、情绪方向和真实意图，再生成用于检索真实古诗文数据库的线索。",
          "特别注意‘不开心’‘不喜欢’‘没信心’这类否定表达，不能按其中的正向词理解。",
          "可以给出可能相关的经典短语作为检索提示，但这些短语不能直接展示，必须由数据库验证后才能使用。",
          "返回 JSON，字段包括 intent, emotion, themes, keywords, modern_paraphrases, classical_hint_phrases, avoid_themes, confidence。",
          "avoid_themes 必须列出与用户意图相反、应该排除的主题。",
          "themes/keywords/classical_hint_phrases 要简短，优先给能在古诗文中出现的词。"
        ].join("\n")
      },
      {
        role: "user",
        content: JSON.stringify({ query })
      }
    ]);

    if (!content) {
      planCache.set(cacheKey, null);
      await writeJsonCache(redisCacheKey, null, cacheTtlSeconds("DEEPSEEK_PLAN_CACHE_TTL_SECONDS", DEFAULT_PLAN_CACHE_TTL_SECONDS));
      return null;
    }

    const parsed = parseJsonObject<DeepSeekPlanResponse>(content);
    if (!parsed) {
      planCache.set(cacheKey, null);
      await writeJsonCache(redisCacheKey, null, cacheTtlSeconds("DEEPSEEK_PLAN_CACHE_TTL_SECONDS", DEFAULT_PLAN_CACHE_TTL_SECONDS));
      return null;
    }

    const plan: DeepSeekQueryPlan = {
      intent: parsed.intent,
      emotion: parsed.emotion,
      themes: normalizeStringArray(parsed.themes),
      keywords: normalizeStringArray(parsed.keywords),
      modernParaphrases: normalizeStringArray(parsed.modernParaphrases ?? parsed.modern_paraphrases),
      classicalHintPhrases: normalizeStringArray(parsed.classicalHintPhrases ?? parsed.classical_hint_phrases),
      avoidThemes: normalizeStringArray(parsed.avoidThemes ?? parsed.avoid_themes),
      confidence: Number(parsed.confidence ?? 0)
    };

    planCache.set(cacheKey, plan);
    await writeJsonCache(redisCacheKey, plan, cacheTtlSeconds("DEEPSEEK_PLAN_CACHE_TTL_SECONDS", DEFAULT_PLAN_CACHE_TTL_SECONDS));
    return plan;
  } catch {
    planCache.set(cacheKey, null);
    return null;
  }
}

function hasStrongBaseSignal(candidate: SearchResult) {
  return candidate.score >= 60 && candidate.matchedBy.some((signal) => ["modern-exact", "exact", "modern-meaning", "semantic-theme", "emotion"].includes(signal));
}

export async function enhanceWithDeepSeek(query: string, candidates: SearchResult[], plan?: DeepSeekQueryPlan | null): Promise<SearchResult[]> {
  const enabled = isDeepSeekEnabled();
  if (!enabled || candidates.length <= 1) return candidates;

  const candidateSignature = candidates.slice(0, 20).map((item) => item.id).join("|");
  const cacheKey = `${query.trim().toLowerCase()}::${candidateSignature}`;
  const cached = rerankCache.get(cacheKey);
  if (cached) return cached;

  const redisCacheKey = makeRedisCacheKey("rerank", cacheKey);
  const persistentCached = await readJsonCache<SearchResult[]>(redisCacheKey);
  if (persistentCached.hit && persistentCached.value) {
    rerankCache.set(cacheKey, persistentCached.value);
    return persistentCached.value;
  }

  const topCandidates = candidates.slice(0, 20);
  const payload = {
    query,
    plan,
    instruction: "只能从 candidates 里选择和排序，不能创造新古文，不能改作者、篇名、朝代、出处。若候选只是字面碰巧相似、情绪方向相反或没有真正表达用户意图，必须拒绝。允许全部拒绝。",
    candidates: topCandidates.map((item) => ({
      id: item.id,
      quote: item.quote,
      source: `${item.dynasty}·${item.author}《${item.title}》`,
      themes: item.themes,
      modernMeanings: item.modernMeanings,
      explanation: item.reason || item.translation,
      context: item.context?.slice(0, 520),
      baseScore: item.score,
      matchedBy: item.matchedBy
    }))
  };

  try {
    const content = await callDeepSeek([
      {
        role: "system",
        content: [
          "你是一个严格的中文古诗文匹配评审。",
          "先判断用户的肯定/否定、情绪、对象和表达目的，再判断候选是否真的贴切。",
          "关键词相同不代表语义相同；否定表达、反讽和相反情绪必须重点排除。",
          "只有 fitScore >= 58 才可以 accepted=true；勉强牵强的候选必须 rejected。",
          "允许没有任何合格候选，宁可少给或不给，也不要硬凑。",
          "不能编造古文，不能编造出处，不能修改候选原句、作者、篇名。",
          "只返回 JSON：{\"results\":[{\"id\":\"候选id\",\"accepted\":true,\"fitScore\":0-100,\"reason\":\"一句中文解释\"}]}。"
        ].join("\n")
      },
      {
        role: "user",
        content: JSON.stringify(payload)
      }
    ]);

    if (!content) return candidates;

    const parsed = parseJsonObject<DeepSeekRerankResponse>(content);
    const ranked = parsed?.results ?? [];
    if (ranked.length === 0) {
      const fallback = candidates.filter(hasStrongBaseSignal);
      rerankCache.set(cacheKey, fallback);
      await writeJsonCache(redisCacheKey, fallback, cacheTtlSeconds("DEEPSEEK_RERANK_CACHE_TTL_SECONDS", DEFAULT_RERANK_CACHE_TTL_SECONDS));
      return fallback;
    }

    const byId = new Map(candidates.map((item) => [item.id, item]));
    const used = new Set<string>();
    const enhanced: SearchResult[] = [];

    for (const item of ranked) {
      const candidate = byId.get(item.id);
      const fitScore = Math.max(0, Math.min(100, Number(item.fitScore ?? 0)));
      if (!candidate || used.has(item.id) || item.accepted === false || fitScore < MIN_ACCEPTED_FIT_SCORE) continue;
      used.add(item.id);
      enhanced.push({
        ...candidate,
        score: candidate.score + fitScore / 2,
        reason: item.reason?.trim() || candidate.reason,
        matchedBy: Array.from(new Set([...candidate.matchedBy, "deepseek-rerank", "deepseek-fit"]))
      });
    }

    for (const candidate of candidates) {
      if (!used.has(candidate.id) && hasStrongBaseSignal(candidate)) enhanced.push(candidate);
    }

    rerankCache.set(cacheKey, enhanced);
    await writeJsonCache(redisCacheKey, enhanced, cacheTtlSeconds("DEEPSEEK_RERANK_CACHE_TTL_SECONDS", DEFAULT_RERANK_CACHE_TTL_SECONDS));
    return enhanced;
  } catch {
    return candidates;
  }
}

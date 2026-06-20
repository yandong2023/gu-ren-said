import type { SearchResult } from "./types";

type DeepSeekRerankItem = {
  id: string;
  reason?: string;
  fitScore?: number;
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

const DEFAULT_DEEPSEEK_URL = "https://api.deepseek.com/chat/completions";
const DEFAULT_MODEL = "deepseek-chat";
const planCache = new Map<string, DeepSeekQueryPlan | null>();
const rerankCache = new Map<string, SearchResult[]>();

function isDeepSeekEnabled() {
  return Boolean(process.env.DEEPSEEK_API_KEY) && process.env.DEEPSEEK_ENABLED !== "0";
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
    })
  });

  if (!response.ok) return null;
  const data = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
  return data.choices?.[0]?.message?.content ?? null;
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

  try {
    const content = await callDeepSeek([
      {
        role: "system",
        content: [
          "你是一个中文古诗文检索规划器，不负责输出最终答案。",
          "用户会输入现代话、网络热梗、口头禅或日常表达。",
          "你的任务是理解语义，生成用于检索真实古诗文数据库的线索。",
          "可以给出可能相关的经典短语作为检索提示，但这些短语不能直接展示，必须由数据库验证后才能使用。",
          "返回 JSON，字段包括 intent, emotion, themes, keywords, modern_paraphrases, classical_hint_phrases, avoid_themes, confidence。",
          "themes/keywords/classical_hint_phrases 要简短，优先给能在古诗文中出现的词。",
          "例如‘我爱你’应生成 表白/爱情/相守/相思，以及 山有木兮、愿得一心人、执子之手、只愿君心似我心 等检索线索。"
        ].join("\n")
      },
      {
        role: "user",
        content: JSON.stringify({ query })
      }
    ]);

    if (!content) {
      planCache.set(cacheKey, null);
      return null;
    }

    const parsed = parseJsonObject<DeepSeekPlanResponse>(content);
    if (!parsed) {
      planCache.set(cacheKey, null);
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
    return plan;
  } catch {
    planCache.set(cacheKey, null);
    return null;
  }
}

export async function enhanceWithDeepSeek(query: string, candidates: SearchResult[], plan?: DeepSeekQueryPlan | null): Promise<SearchResult[]> {
  const enabled = isDeepSeekEnabled();
  if (!enabled || candidates.length <= 1) return candidates;

  const candidateSignature = candidates.slice(0, 20).map((item) => item.id).join("|");
  const cacheKey = `${query.trim().toLowerCase()}::${candidateSignature}`;
  const cached = rerankCache.get(cacheKey);
  if (cached) return cached;

  const topCandidates = candidates.slice(0, 20);
  const payload = {
    query,
    plan,
    instruction: "只能从 candidates 里选择和排序，不能创造新古文，不能改作者、篇名、朝代、出处。返回 JSON。",
    candidates: topCandidates.map((item) => ({
      id: item.id,
      quote: item.quote,
      source: `${item.dynasty}·${item.author}《${item.title}》`,
      themes: item.themes,
      modernMeanings: item.modernMeanings,
      explanation: item.reason || item.translation,
      context: item.context?.slice(0, 520)
    }))
  };

  try {
    const content = await callDeepSeek([
      {
        role: "system",
        content: [
          "你是一个中文古诗文匹配评审。",
          "用户会输入现代话、网络热梗或日常表达。",
          "你的任务是从候选古诗文中选出语义最贴切、最适合分享和学习的结果。",
          "必须遵守：不能编造古文，不能编造出处，不能修改候选原句、作者、篇名。",
          "只返回 JSON：{\"results\":[{\"id\":\"候选id\",\"fitScore\":0-100,\"reason\":\"一句中文解释\"}]}。"
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
    if (ranked.length === 0) return candidates;

    const byId = new Map(candidates.map((item) => [item.id, item]));
    const used = new Set<string>();
    const enhanced: SearchResult[] = [];

    for (const item of ranked) {
      const candidate = byId.get(item.id);
      if (!candidate || used.has(item.id)) continue;
      used.add(item.id);
      enhanced.push({
        ...candidate,
        score: candidate.score + Math.max(0, Math.min(100, Number(item.fitScore ?? 0))) / 2,
        reason: item.reason?.trim() || candidate.reason,
        matchedBy: Array.from(new Set([...candidate.matchedBy, "deepseek-rerank"]))
      });
    }

    for (const candidate of candidates) {
      if (!used.has(candidate.id)) enhanced.push(candidate);
    }

    rerankCache.set(cacheKey, enhanced);
    return enhanced;
  } catch {
    return candidates;
  }
}

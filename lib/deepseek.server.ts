import type { SearchResult } from "./types";

type DeepSeekRerankItem = {
  id: string;
  reason?: string;
  fitScore?: number;
};

type DeepSeekRerankResponse = {
  results?: DeepSeekRerankItem[];
};

const DEFAULT_DEEPSEEK_URL = "https://api.deepseek.com/chat/completions";
const DEFAULT_MODEL = "deepseek-chat";

function stripJsonFence(value: string): string {
  return value.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```$/i, "").trim();
}

function parseDeepSeekJson(content: string): DeepSeekRerankResponse | null {
  try {
    return JSON.parse(stripJsonFence(content)) as DeepSeekRerankResponse;
  } catch {
    const start = content.indexOf("{");
    const end = content.lastIndexOf("}");
    if (start < 0 || end <= start) return null;
    try {
      return JSON.parse(content.slice(start, end + 1)) as DeepSeekRerankResponse;
    } catch {
      return null;
    }
  }
}

export async function enhanceWithDeepSeek(query: string, candidates: SearchResult[]): Promise<SearchResult[]> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  const enabled = process.env.DEEPSEEK_ENABLED !== "0";

  if (!enabled || !apiKey || candidates.length <= 1) return candidates;

  const topCandidates = candidates.slice(0, 8);
  const payload = {
    query,
    instruction: "只能从 candidates 里选择和排序，不能创造新古文，不能改作者、篇名、朝代、出处。返回 JSON。",
    candidates: topCandidates.map((item) => ({
      id: item.id,
      quote: item.quote,
      source: `${item.dynasty}·${item.author}《${item.title}》`,
      themes: item.themes,
      modernMeanings: item.modernMeanings,
      explanation: item.reason || item.translation,
      context: item.context?.slice(0, 360)
    }))
  };

  try {
    const response = await fetch(process.env.DEEPSEEK_BASE_URL ?? DEFAULT_DEEPSEEK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: process.env.DEEPSEEK_MODEL ?? DEFAULT_MODEL,
        temperature: 0.1,
        response_format: { type: "json_object" },
        messages: [
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
        ]
      })
    });

    if (!response.ok) return candidates;

    const data = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
    const content = data.choices?.[0]?.message?.content;
    if (!content) return candidates;

    const parsed = parseDeepSeekJson(content);
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

    return enhanced;
  } catch {
    return candidates;
  }
}

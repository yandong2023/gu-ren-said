import { SEO_QUERY_WHITELIST, normalizeQuery, queryHref } from "./trends.server";
import type { SearchResult } from "./types";

export type RelatedQuery = {
  query: string;
  href: string;
  score: number;
};

type QueryGroup = {
  queries: string[];
  emotions: string[];
  signals: string[];
};

const QUERY_GROUPS: QueryGroup[] = [
  {
    queries: ["我爱你", "我喜欢你", "我想你", "我想和你一辈子在一起", "我暗恋你很久了", "有点心动念念不忘"],
    emotions: ["love"],
    signals: ["爱情", "喜欢", "暗恋", "心动", "相思", "思念", "想念", "陪伴", "一辈子"]
  },
  {
    queries: ["你真好看", "你好漂亮"],
    emotions: ["beauty"],
    signals: ["美貌", "容貌", "漂亮", "好看", "惊艳", "笑容", "赞美"]
  },
  {
    queries: ["我 emo 了", "今天破防了"],
    emotions: ["sad"],
    signals: ["忧愁", "失意", "烦闷", "难过", "低落", "心碎", "孤独", "破防"]
  },
  {
    queries: ["我真的会谢", "这事太离谱"],
    emotions: ["speechless"],
    signals: ["无语", "荒诞", "离谱", "吐槽", "复杂", "看不懂"]
  },
  {
    queries: ["这事包的", "考试稳了拿下", "这作品封神了", "这人太牛了"],
    emotions: ["positive", "admire"],
    signals: ["信心", "成功", "才华", "震撼", "赞美", "厉害", "封神", "考试", "鼓励"]
  },
  {
    queries: ["太卷了想躺平", "不想上班只想回家", "不内耗了", "算了不内耗了", "看开了没什么大不了"],
    emotions: ["calm", "relieved"],
    signals: ["松弛", "归隐", "自由", "不争", "释怀", "豁达", "通透", "放下", "内耗", "工作"]
  },
  {
    queries: ["想家了", "一个人在外突然想家"],
    emotions: ["homesick"],
    signals: ["思乡", "漂泊", "亲情", "异乡", "离家", "想家"]
  },
  {
    queries: ["不要放弃", "别放弃继续扛住", "慢慢变强别急"],
    emotions: ["driven"],
    signals: ["努力", "坚持", "成长", "逆境", "韧性", "扛住", "自律", "变强"]
  },
  {
    queries: ["开心到飞起"],
    emotions: ["happy"],
    signals: ["快乐", "开心", "畅快", "庆祝", "得意"]
  },
  {
    queries: ["我们真是同频朋友"],
    emotions: ["warm"],
    signals: ["友情", "知己", "朋友", "陪伴", "同频"]
  }
];

const PUBLISHED_QUERY_KEYS = new Set(SEO_QUERY_WHITELIST.map((item) => normalizeQuery(item)));

function compactText(value: string) {
  return value.toLowerCase().replace(/\s+/g, "");
}

function addScore(scores: Map<string, number>, query: string, score: number) {
  const key = normalizeQuery(query);
  if (!PUBLISHED_QUERY_KEYS.has(key)) return;
  scores.set(query, Math.max(scores.get(query) ?? 0, score));
}

export function getRelatedQueries(query: string, results: SearchResult[], limit = 8): RelatedQuery[] {
  const current = normalizeQuery(query);
  const resultText = compactText(results.flatMap((result) => [
    result.quote,
    result.translation,
    result.reason,
    ...result.themes,
    ...result.scene,
    ...result.modernMeanings
  ]).join(" "));
  const emotions = new Set(results.map((result) => result.emotion).filter(Boolean));
  const scores = new Map<string, number>();

  for (const group of QUERY_GROUPS) {
    let groupScore = 0;
    if (group.queries.some((item) => normalizeQuery(item) === current)) groupScore += 90;
    if (group.emotions.some((emotion) => emotions.has(emotion))) groupScore += 42;

    for (const signal of group.signals) {
      const compactSignal = compactText(signal);
      if (compactText(current).includes(compactSignal)) groupScore += 18;
      if (resultText.includes(compactSignal)) groupScore += 7;
    }

    if (groupScore <= 0) continue;
    group.queries.forEach((candidate, index) => {
      if (normalizeQuery(candidate) === current) return;
      const directMeaningMatch = results.some((result) => result.modernMeanings.some((meaning) => normalizeQuery(meaning) === normalizeQuery(candidate)));
      addScore(scores, candidate, groupScore + Math.max(0, 12 - index) + (directMeaningMatch ? 30 : 0));
    });
  }

  for (const result of results) {
    for (const meaning of result.modernMeanings) {
      if (normalizeQuery(meaning) === current) continue;
      addScore(scores, meaning, 70);
    }
  }

  return Array.from(scores.entries())
    .map(([relatedQuery, score]) => ({ query: relatedQuery, href: queryHref(relatedQuery), score }))
    .sort((a, b) => b.score - a.score || a.query.localeCompare(b.query, "zh-CN"))
    .slice(0, Math.max(0, limit));
}

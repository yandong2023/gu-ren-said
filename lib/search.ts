import { QUOTES, SLANG_MAPPINGS } from "./data";
import { EXTRA_QUOTES, EXTRA_SLANG_MAPPINGS } from "./extra-data";
import type { ExpandedQuery, QuoteRecord, SearchResult } from "./types";

const ALL_QUOTES = [...EXTRA_QUOTES, ...QUOTES];
const ALL_SLANG_MAPPINGS = [...EXTRA_SLANG_MAPPINGS, ...SLANG_MAPPINGS];

const STOP_WORDS = new Set(["我", "你", "他", "她", "它", "的", "了", "啊", "呀", "吧", "吗", "呢", "很", "太", "真", "真的", "有点"]);
const LOW_SIGNAL_CHARS = new Set(["好", "看", "说", "想", "人", "事", "不", "有", "没", "真", "太", "这", "那"]);
const NEGATIVE_APPEARANCE_PATTERNS = ["你真丑", "真丑", "丑", "难看", "不好看", "不好看", "不漂亮", "不美", "不帅", "丑爆", "丑死", "长得丑", "颜值低", "磕碜", "ugly"];
const BEAUTY_THEMES = new Set(["美貌", "赞美", "惊艳", "容貌"]);
const STRONG_MATCH_TYPES = new Set(["exact", "modern-meaning", "theme", "scene", "semantic-theme", "emotion"]);

function normalizeText(value: string): string {
  return value.toLowerCase().replace(/\s+/g, "");
}

function isNegativeAppearanceQuery(normalized: string) {
  const compact = normalizeText(normalized);
  return NEGATIVE_APPEARANCE_PATTERNS.some((pattern) => compact.includes(normalizeText(pattern)));
}

function isBeautyQuote(quote: QuoteRecord) {
  return quote.emotion === "beauty" || quote.themes.some((theme) => BEAUTY_THEMES.has(theme));
}

function quoteBlob(quote: QuoteRecord): string {
  return normalizeText([quote.quote, quote.title, quote.author, quote.dynasty, quote.context, quote.translation, quote.themes.join(" "), quote.modernMeanings.join(" "), quote.emotion, quote.scene.join(" ")].join(" "));
}

function addChinesePhraseTerms(normalized: string, terms: Set<string>) {
  const compact = normalizeText(normalized);
  if (compact.length > 18 || !/[\u4e00-\u9fa5]/.test(compact)) return;

  for (const char of compact) {
    if (/^[\u4e00-\u9fa5]$/.test(char) && !STOP_WORDS.has(char) && !LOW_SIGNAL_CHARS.has(char)) terms.add(char);
  }

  for (let size = 2; size <= 4; size += 1) {
    for (let i = 0; i <= compact.length - size; i += 1) {
      const phrase = compact.slice(i, i + size);
      if (!/^[\u4e00-\u9fa5]+$/.test(phrase)) continue;
      if (Array.from(phrase).every((char) => LOW_SIGNAL_CHARS.has(char) || STOP_WORDS.has(char))) continue;
      terms.add(phrase);
    }
  }
}

export function expandQuery(input: string): ExpandedQuery {
  const normalized = input.trim().toLowerCase().replace(/\s+/g, " ");
  const negativeAppearance = isNegativeAppearanceQuery(normalized);
  const rawTerms = normalized.split(/[\s,，。！？!?.、/\\]+/).map((item) => item.trim()).filter(Boolean).filter((item) => !STOP_WORDS.has(item));
  const terms = new Set<string>(rawTerms);
  const themes = new Set<string>();
  let emotion: string | undefined;
  let intentExplanation: string | undefined;

  for (const mapping of ALL_SLANG_MAPPINGS) {
    if (negativeAppearance && mapping.id === "beauty") continue;
    const hit = mapping.patterns.some((pattern) => normalized.includes(pattern.toLowerCase()));
    if (!hit) continue;
    mapping.keywords.forEach((keyword) => terms.add(keyword));
    mapping.themes.forEach((theme) => themes.add(theme));
    emotion = emotion ?? mapping.emotion;
    intentExplanation = intentExplanation ?? mapping.explanation;
  }

  if (negativeAppearance) {
    ["外貌", "反讽", "讽刺", "吐槽", "负向外貌", "以貌取人", "失之子羽", "相鼠", "无仪", "妍媸"].forEach((term) => terms.add(term));
    ["外貌", "反讽", "讽刺", "吐槽", "负向外貌"].forEach((theme) => themes.add(theme));
    emotion = "critical";
    intentExplanation = "表达对外貌评价、难看、丑或以貌取人的吐槽，需要避免误匹配成夸好看。";
  }

  addChinesePhraseTerms(normalized, terms);

  return { original: input, normalized, terms: Array.from(terms).slice(0, 48), themes: Array.from(themes), emotion, intentExplanation };
}

function makeReason(quote: QuoteRecord, expanded: ExpandedQuery): string {
  if (expanded.intentExplanation) return `这句${quote.dynasty}代${quote.author}的表达，和你的输入所包含的“${expanded.intentExplanation}”相近：${quote.translation}`;
  if (quote.modernMeanings.length > 0) return `这句常可对应“${quote.modernMeanings.slice(0, 2).join(" / ")}”这类现代说法：${quote.translation}`;
  return quote.translation;
}

export function scoreQuote(quote: QuoteRecord, expanded: ExpandedQuery): SearchResult {
  const blob = quoteBlob(quote);
  const normalized = normalizeText(expanded.normalized);
  const negativeAppearance = expanded.themes.includes("负向外貌");
  const matchedBy = new Set<string>();
  let score = quote.weight * 0.18;

  if (normalized && blob.includes(normalized)) {
    score += 60;
    matchedBy.add("exact");
  }

  for (const term of expanded.terms) {
    const normalizedTerm = normalizeText(term);
    if (!normalizedTerm) continue;
    const isSingleChar = normalizedTerm.length === 1;

    if (!isSingleChar && quote.modernMeanings.some((meaning) => normalizeText(meaning).includes(normalizedTerm))) { score += 18; matchedBy.add("modern-meaning"); }
    if (!isSingleChar && quote.themes.some((theme) => normalizeText(theme).includes(normalizedTerm))) { score += 14; matchedBy.add("theme"); }
    if (!isSingleChar && quote.scene.some((scene) => normalizeText(scene).includes(normalizedTerm))) { score += 8; matchedBy.add("scene"); }
    if (blob.includes(normalizedTerm)) { score += isSingleChar ? 1 : 7; matchedBy.add("keyword"); }
  }

  for (const theme of expanded.themes) {
    if (quote.themes.includes(theme)) { score += 22; matchedBy.add("semantic-theme"); }
  }

  if (expanded.emotion && expanded.emotion === quote.emotion) { score += 24; matchedBy.add("emotion"); }
  score += Math.min(8, quote.weight / 18);

  if (negativeAppearance && isBeautyQuote(quote)) {
    score -= 120;
    matchedBy.add("opposite-beauty-guard");
  }

  return { ...quote, score: Number(score.toFixed(2)), matchedBy: Array.from(matchedBy), reason: makeReason(quote, expanded) };
}

export function hasUsefulSearchSignal(result: SearchResult) {
  if (result.matchedBy.some((match) => STRONG_MATCH_TYPES.has(match))) return true;
  const weakOnly = result.matchedBy.every((match) => match === "keyword" || match === "fts5" || match === "deepseek-rerank");
  return !weakOnly && result.score >= 42;
}

export function searchInMemory(expanded: ExpandedQuery, limit = 8): SearchResult[] {
  return ALL_QUOTES.map((quote) => scoreQuote(quote, expanded)).filter(hasUsefulSearchSignal).sort((a, b) => b.score - a.score).slice(0, limit);
}

export function mergeResults(...groups: SearchResult[][]): SearchResult[] {
  const map = new Map<string, SearchResult>();
  for (const group of groups) {
    for (const result of group) {
      const existing = map.get(result.id);
      if (!existing || result.score > existing.score) map.set(result.id, result);
    }
  }
  return Array.from(map.values()).sort((a, b) => b.score - a.score);
}

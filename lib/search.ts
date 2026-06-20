import { QUOTES, SLANG_MAPPINGS } from "./data";
import { EXTRA_QUOTES, EXTRA_SLANG_MAPPINGS } from "./extra-data";
import type { ExpandedQuery, QuoteRecord, SearchResult } from "./types";

const ALL_QUOTES = [...EXTRA_QUOTES, ...QUOTES];
const ALL_SLANG_MAPPINGS = [...EXTRA_SLANG_MAPPINGS, ...SLANG_MAPPINGS];

const STOP_WORDS = new Set(["我", "你", "他", "她", "它", "的", "了", "啊", "呀", "吧", "吗", "呢", "很", "太", "真", "真的", "有点"]);
const LOW_SIGNAL_CHARS = new Set(["好", "看", "说", "想", "人", "事", "不", "有", "没", "真", "太", "这", "那"]);

function normalizeText(value: string): string {
  return value.toLowerCase().replace(/\s+/g, "");
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
  const rawTerms = normalized.split(/[\s,，。！？!?.、/\\]+/).map((item) => item.trim()).filter(Boolean).filter((item) => !STOP_WORDS.has(item));
  const terms = new Set<string>(rawTerms);
  const themes = new Set<string>();
  let emotion: string | undefined;
  let intentExplanation: string | undefined;

  for (const mapping of ALL_SLANG_MAPPINGS) {
    const hit = mapping.patterns.some((pattern) => normalized.includes(pattern.toLowerCase()));
    if (!hit) continue;
    mapping.keywords.forEach((keyword) => terms.add(keyword));
    mapping.themes.forEach((theme) => themes.add(theme));
    emotion = emotion ?? mapping.emotion;
    intentExplanation = intentExplanation ?? mapping.explanation;
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

  return { ...quote, score: Number(score.toFixed(2)), matchedBy: Array.from(matchedBy), reason: makeReason(quote, expanded) };
}

export function searchInMemory(expanded: ExpandedQuery, limit = 8): SearchResult[] {
  return ALL_QUOTES.map((quote) => scoreQuote(quote, expanded)).filter((item) => item.score > 18 || item.matchedBy.length > 0).sort((a, b) => b.score - a.score).slice(0, limit);
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

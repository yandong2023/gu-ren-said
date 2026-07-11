import { expandQuery, hasUsefulSearchSignal, mergeResults, searchInMemory } from "./search";
import { getDbStatus, searchSqlite } from "./db.server";
import { enhanceWithDeepSeek, planQueryWithDeepSeek } from "./deepseek.server";
import { recordSearchQuery } from "./trends.server";
import type { ExpandedQuery, SearchResult } from "./types";

const DIRECT_SIGNALS = new Set(["modern-exact", "exact", "modern-meaning", "semantic-theme", "emotion"]);

function uniq(values: Array<string | undefined>) {
  return Array.from(new Set(values.map((item) => String(item ?? "").trim()).filter(Boolean)));
}

function normalize(value: string) {
  return value.toLowerCase().replace(/\s+/g, "").replace(/[，。！？!?.,、/\\]/g, "");
}

function applyPlanToExpanded(expanded: ExpandedQuery, plan: Awaited<ReturnType<typeof planQueryWithDeepSeek>>): ExpandedQuery {
  if (!plan) return expanded;

  const avoidThemes = uniq([...(expanded.avoidThemes ?? []), ...(plan.avoidThemes ?? [])]);
  const allowedPlanThemes = (plan.themes ?? []).filter((theme) => !avoidThemes.includes(theme));

  return {
    ...expanded,
    terms: uniq([
      ...expanded.terms,
      ...(plan.keywords ?? []),
      ...allowedPlanThemes,
      ...(plan.modernParaphrases ?? []),
      ...(plan.classicalHintPhrases ?? [])
    ]).slice(0, 80),
    themes: uniq([...expanded.themes, ...allowedPlanThemes]).slice(0, 16),
    avoidThemes,
    emotion: expanded.emotion ?? plan.emotion,
    confidence: Math.max(expanded.confidence ?? 0, Number(plan.confidence ?? 0)),
    intentExplanation: expanded.intentExplanation ?? plan.intent
  };
}

function hasDirectSignal(result: SearchResult) {
  return result.matchedBy.some((signal) => DIRECT_SIGNALS.has(signal));
}

function isLowInformationQuery(expanded: ExpandedQuery) {
  const compact = normalize(expanded.normalized);
  return compact.length <= 3 && expanded.themes.length === 0 && !expanded.emotion;
}

function qualityGate(results: SearchResult[], expanded: ExpandedQuery) {
  const useful = results.filter(hasUsefulSearchSignal).filter((result) => {
    if (result.matchedBy.includes("avoid-theme") && !result.matchedBy.includes("modern-exact")) return false;
    if (isLowInformationQuery(expanded)) {
      return result.matchedBy.includes("modern-exact") || (result.matchedBy.includes("exact") && result.score >= 72);
    }
    return true;
  });

  const top = useful[0];
  if (!top) return [];
  if (top.score < 48) return [];
  if (!hasDirectSignal(top) && top.score < 68) return [];

  return useful;
}

function diversifyResults(results: SearchResult[], limit: number) {
  const seenQuotes = new Set<string>();
  const titleCounts = new Map<string, number>();
  const output: SearchResult[] = [];

  for (const result of results) {
    const quoteKey = normalize(result.quote);
    if (!quoteKey || seenQuotes.has(quoteKey)) continue;

    const titleKey = `${result.author}:${result.title}`;
    const titleCount = titleCounts.get(titleKey) ?? 0;
    if (titleCount >= 2) continue;

    seenQuotes.add(quoteKey);
    titleCounts.set(titleKey, titleCount + 1);
    output.push(result);
    if (output.length >= limit) break;
  }

  return output;
}

export async function runSearch(query: string, limit = 6, options: { record?: boolean; enhance?: boolean } = {}) {
  const safeLimit = Math.min(Math.max(Number(limit ?? 6), 1), 10);
  const shouldEnhance = options.enhance !== false;
  const baseExpanded = expandQuery(query);
  const plan = shouldEnhance ? await planQueryWithDeepSeek(query) : null;
  const expanded = applyPlanToExpanded(baseExpanded, plan);

  const sqliteResults = searchSqlite(expanded, Math.max(safeLimit * 3, 24));
  const memoryResults = searchInMemory(expanded, Math.max(safeLimit * 2, 12));
  const candidates = qualityGate(
    mergeResults(sqliteResults, memoryResults).slice(0, Math.max(safeLimit * 5, 30)),
    expanded
  ).slice(0, Math.max(safeLimit * 4, 24));

  const enhancedResults = shouldEnhance ? await enhanceWithDeepSeek(query, candidates, plan) : candidates;
  const gatedResults = qualityGate(enhancedResults, expanded);
  const results = diversifyResults(gatedResults, safeLimit);

  if (options.record && results.length > 0) {
    await recordSearchQuery(query, results);
  }

  return {
    query,
    expanded,
    plan,
    db: getDbStatus(),
    enhancer: {
      deepseek: shouldEnhance && Boolean(process.env.DEEPSEEK_API_KEY) && process.env.DEEPSEEK_ENABLED !== "0"
    },
    results
  };
}

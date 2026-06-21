import { expandQuery, mergeResults, searchInMemory } from "./search";
import { getDbStatus, searchSqlite } from "./db.server";
import { enhanceWithDeepSeek, planQueryWithDeepSeek } from "./deepseek.server";
import { recordSearchQuery } from "./trends.server";
import type { ExpandedQuery } from "./types";

function uniq(values: Array<string | undefined>) {
  return Array.from(new Set(values.map((item) => String(item ?? "").trim()).filter(Boolean)));
}

function applyPlanToExpanded(expanded: ExpandedQuery, plan: Awaited<ReturnType<typeof planQueryWithDeepSeek>>): ExpandedQuery {
  if (!plan) return expanded;

  return {
    ...expanded,
    terms: uniq([
      ...expanded.terms,
      ...(plan.keywords ?? []),
      ...(plan.themes ?? []),
      ...(plan.modernParaphrases ?? []),
      ...(plan.classicalHintPhrases ?? [])
    ]).slice(0, 80),
    themes: uniq([...expanded.themes, ...(plan.themes ?? [])]).slice(0, 16),
    emotion: expanded.emotion ?? plan.emotion,
    intentExplanation: expanded.intentExplanation ?? plan.intent
  };
}

export async function runSearch(query: string, limit = 6, options: { record?: boolean } = {}) {
  const safeLimit = Math.min(Math.max(Number(limit ?? 6), 1), 10);
  const baseExpanded = expandQuery(query);
  const plan = await planQueryWithDeepSeek(query);
  const expanded = applyPlanToExpanded(baseExpanded, plan);

  const sqliteResults = searchSqlite(expanded, Math.max(safeLimit * 3, 24));
  const memoryResults = searchInMemory(expanded, Math.max(safeLimit * 2, 12));
  const candidates = mergeResults(sqliteResults, memoryResults).slice(0, Math.max(safeLimit * 4, 24));
  const enhancedResults = await enhanceWithDeepSeek(query, candidates, plan);
  const results = enhancedResults.slice(0, safeLimit);

  if (options.record) {
    await recordSearchQuery(query, results);
  }

  return {
    query,
    expanded,
    plan,
    db: getDbStatus(),
    enhancer: {
      deepseek: Boolean(process.env.DEEPSEEK_API_KEY) && process.env.DEEPSEEK_ENABLED !== "0"
    },
    results
  };
}

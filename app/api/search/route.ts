import { NextRequest, NextResponse } from "next/server";
import { expandQuery, mergeResults, searchInMemory } from "@/lib/search";
import { getDbStatus, searchSqlite } from "@/lib/db.server";
import { enhanceWithDeepSeek, planQueryWithDeepSeek } from "@/lib/deepseek.server";
import type { ExpandedQuery } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = {
  query?: string;
  limit?: number;
};

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

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => ({}))) as Body;
  const query = String(body.query ?? "").trim();
  const limit = Math.min(Math.max(Number(body.limit ?? 6), 1), 10);

  if (!query) {
    return NextResponse.json({ results: [], message: "请输入一句现代话或网络热梗。" }, { status: 400 });
  }

  const baseExpanded = expandQuery(query);
  const plan = await planQueryWithDeepSeek(query);
  const expanded = applyPlanToExpanded(baseExpanded, plan);

  const sqliteResults = searchSqlite(expanded, Math.max(limit * 3, 24));
  const memoryResults = searchInMemory(expanded, Math.max(limit * 2, 12));
  const candidates = mergeResults(sqliteResults, memoryResults).slice(0, Math.max(limit * 4, 24));
  const enhancedResults = await enhanceWithDeepSeek(query, candidates, plan);
  const results = enhancedResults.slice(0, limit);

  return NextResponse.json({
    query,
    expanded,
    plan: plan ? {
      intent: plan.intent,
      themes: plan.themes,
      emotion: plan.emotion,
      keywords: plan.keywords,
      classicalHintPhrases: plan.classicalHintPhrases,
      confidence: plan.confidence
    } : null,
    db: getDbStatus(),
    enhancer: {
      deepseek: Boolean(process.env.DEEPSEEK_API_KEY) && process.env.DEEPSEEK_ENABLED !== "0"
    },
    results
  });
}

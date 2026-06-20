import { NextRequest, NextResponse } from "next/server";
import { expandQuery, mergeResults, searchInMemory } from "@/lib/search";
import { getDbStatus, searchSqlite } from "@/lib/db.server";
import { enhanceWithDeepSeek } from "@/lib/deepseek.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = {
  query?: string;
  limit?: number;
};

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => ({}))) as Body;
  const query = String(body.query ?? "").trim();
  const limit = Math.min(Math.max(Number(body.limit ?? 6), 1), 10);

  if (!query) {
    return NextResponse.json({ results: [], message: "请输入一句现代话或网络热梗。" }, { status: 400 });
  }

  const expanded = expandQuery(query);
  const sqliteResults = searchSqlite(expanded, Math.max(limit, 8));
  const memoryResults = searchInMemory(expanded, Math.max(limit, 8));
  const candidates = mergeResults(sqliteResults, memoryResults).slice(0, Math.max(limit, 8));
  const enhancedResults = await enhanceWithDeepSeek(query, candidates);
  const results = enhancedResults.slice(0, limit);

  return NextResponse.json({
    query,
    expanded,
    db: getDbStatus(),
    enhancer: {
      deepseek: Boolean(process.env.DEEPSEEK_API_KEY) && process.env.DEEPSEEK_ENABLED !== "0"
    },
    results
  });
}

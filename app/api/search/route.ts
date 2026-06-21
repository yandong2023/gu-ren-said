import { NextRequest, NextResponse } from "next/server";
import { runSearch } from "@/lib/search-service.server";

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

  const payload = await runSearch(query, limit, { record: true });

  return NextResponse.json({
    query: payload.query,
    expanded: payload.expanded,
    plan: payload.plan ? {
      intent: payload.plan.intent,
      themes: payload.plan.themes,
      emotion: payload.plan.emotion,
      keywords: payload.plan.keywords,
      classicalHintPhrases: payload.plan.classicalHintPhrases,
      confidence: payload.plan.confidence
    } : null,
    db: payload.db,
    enhancer: payload.enhancer,
    results: payload.results
  });
}

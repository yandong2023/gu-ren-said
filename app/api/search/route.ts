import { NextRequest, NextResponse } from "next/server";
import { recordSearchQuality } from "@/lib/quality.server";
import { checkRateLimit } from "@/lib/request-guard.server";
import { runSearch } from "@/lib/search-service.server";
import { queryHref, shouldIndexQuery } from "@/lib/trends.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = {
  query?: string;
  limit?: number;
};

function jsonResponse(body: unknown, status = 200, headers: Record<string, string> = {}) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      ...headers
    }
  });
}

export async function POST(request: NextRequest) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (Number.isFinite(contentLength) && contentLength > 4096) {
    return jsonResponse({ results: [], message: "请求内容过长。" }, 413);
  }

  const rateLimit = await checkRateLimit(request, [
    { name: "search-minute", limit: 12, windowSeconds: 60 },
    { name: "search-day", limit: 150, windowSeconds: 60 * 60 * 24 }
  ]);

  if (!rateLimit.ok) {
    return jsonResponse(
      { results: [], message: "搜索太频繁了，请稍后再试。", retryAfter: rateLimit.retryAfter },
      429,
      {
        "Retry-After": String(rateLimit.retryAfter),
        "X-RateLimit-Remaining": "0"
      }
    );
  }

  const body = (await request.json().catch(() => ({}))) as Body;
  const query = String(body.query ?? "").trim().replace(/\s+/g, " ");
  const limit = Math.min(Math.max(Number(body.limit ?? 6), 1), 8);

  if (!query) {
    return jsonResponse({ results: [], message: "请输入一句现代话或网络热梗。" }, 400);
  }

  if (query.length < 2) {
    return jsonResponse({ results: [], message: "请至少输入两个字，让意思更明确。" }, 400);
  }

  if (query.length > 60) {
    return jsonResponse({ results: [], message: "输入内容请控制在 60 个字以内。" }, 400);
  }

  if (/[\r\n<>]/.test(query)) {
    return jsonResponse({ results: [], message: "输入内容包含不支持的字符。" }, 400);
  }

  const startedAt = Date.now();
  const enhance = !shouldIndexQuery(query);

  try {
    const payload = await runSearch(query, limit, { record: true, enhance });
    const durationMs = Date.now() - startedAt;

    await recordSearchQuality({
      query,
      status: payload.results.length > 0 ? "success" : "empty",
      results: payload.results,
      durationMs,
      aiEnhanced: payload.enhancer.deepseek,
      planConfidence: payload.plan?.confidence
    });

    return jsonResponse({
      query: payload.query,
      href: queryHref(query),
      durationMs,
      expanded: payload.expanded,
      plan: payload.plan ? {
        intent: payload.plan.intent,
        themes: payload.plan.themes,
        emotion: payload.plan.emotion,
        keywords: payload.plan.keywords,
        classicalHintPhrases: payload.plan.classicalHintPhrases,
        avoidThemes: payload.plan.avoidThemes,
        confidence: payload.plan.confidence
      } : null,
      db: payload.db,
      enhancer: payload.enhancer,
      results: payload.results
    }, 200, {
      "X-RateLimit-Remaining": String(rateLimit.remaining)
    });
  } catch {
    const durationMs = Date.now() - startedAt;
    await recordSearchQuality({ query, status: "error", durationMs, aiEnhanced: enhance });
    return jsonResponse({ results: [], message: "搜索服务暂时不可用，请稍后再试。" }, 500);
  }
}

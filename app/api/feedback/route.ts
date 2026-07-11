import { NextRequest, NextResponse } from "next/server";
import { recordFeedback } from "@/lib/feedback.server";
import { checkRateLimit } from "@/lib/request-guard.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = {
  type?: string;
  query?: string;
  resultId?: string;
  quote?: string;
  source?: string;
  note?: string;
};

const ALLOWED_TYPES = new Set(["not_accurate", "wrong_source", "better_quote"]);

function json(body: unknown, status = 200, headers: Record<string, string> = {}) {
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
  if (Number.isFinite(contentLength) && contentLength > 8192) {
    return json({ ok: false, message: "反馈内容过长。" }, 413);
  }

  const rateLimit = await checkRateLimit(request, [
    { name: "feedback-minute", limit: 8, windowSeconds: 60 },
    { name: "feedback-day", limit: 100, windowSeconds: 60 * 60 * 24 }
  ]);

  if (!rateLimit.ok) {
    return json(
      { ok: false, message: "反馈提交太频繁，请稍后再试。", retryAfter: rateLimit.retryAfter },
      429,
      { "Retry-After": String(rateLimit.retryAfter) }
    );
  }

  const body = (await request.json().catch(() => ({}))) as Body;
  const type = String(body.type ?? "").trim();
  const query = String(body.query ?? "").trim().replace(/\s+/g, " ");
  const note = String(body.note ?? "").trim();

  if (!ALLOWED_TYPES.has(type) || !query) {
    return json({ ok: false, message: "反馈类型或查询内容无效。" }, 400);
  }

  if (query.length > 80 || note.length > 500 || /[<>]/.test(query)) {
    return json({ ok: false, message: "反馈内容格式无效或过长。" }, 400);
  }

  if (type === "better_quote" && !note) {
    return json({ ok: false, message: "请填写更好的句子、出处或理由。" }, 400);
  }

  const saved = await recordFeedback({
    type,
    query,
    resultId: body.resultId,
    quote: body.quote,
    source: body.source,
    note,
    userAgent: request.headers.get("user-agent") ?? ""
  });

  if (!saved) {
    return json({ ok: false, saved: false, message: "反馈暂时没有保存成功，请稍后再试。" }, 503);
  }

  return json({ ok: true, saved: true }, 200, {
    "X-RateLimit-Remaining": String(rateLimit.remaining)
  });
}

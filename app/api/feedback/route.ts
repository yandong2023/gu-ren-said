import { NextRequest, NextResponse } from "next/server";
import { recordFeedback } from "@/lib/feedback.server";

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

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => ({}))) as Body;
  const type = String(body.type ?? "").trim();
  const query = String(body.query ?? "").trim();

  if (!type || !query) {
    return NextResponse.json({ ok: false, message: "缺少反馈类型或查询内容。" }, { status: 400 });
  }

  const saved = await recordFeedback({
    type,
    query,
    resultId: body.resultId,
    quote: body.quote,
    source: body.source,
    note: body.note,
    userAgent: request.headers.get("user-agent") ?? ""
  });

  return NextResponse.json({ ok: true, saved });
}

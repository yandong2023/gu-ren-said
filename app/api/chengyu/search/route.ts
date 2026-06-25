import { NextRequest, NextResponse } from "next/server";
import { CHENGYU_RECORD_COUNT, searchChengyu } from "@/lib/chengyu-large";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = {
  query?: string;
  limit?: number;
};

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => ({}))) as Body;
  const query = String(body.query ?? "").trim();
  const limit = Math.min(Math.max(Number(body.limit ?? 8), 1), 10);

  if (!query) {
    return NextResponse.json({ results: [], total: CHENGYU_RECORD_COUNT, message: "请输入一句大白话或想表达的意思。" }, { status: 400 });
  }

  return NextResponse.json({ query, total: CHENGYU_RECORD_COUNT, results: searchChengyu(query, limit) });
}

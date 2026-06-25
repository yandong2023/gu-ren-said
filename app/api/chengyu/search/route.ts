import { NextRequest, NextResponse } from "next/server";
import { searchChengyu } from "@/lib/chengyu";

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
    return NextResponse.json({ results: [], message: "请输入一句大白话或想表达的意思。" }, { status: 400 });
  }

  return NextResponse.json({ query, results: searchChengyu(query, limit) });
}

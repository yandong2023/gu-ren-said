import { NextRequest, NextResponse } from "next/server";
import { getTrendingQueries } from "@/lib/trends.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const range = request.nextUrl.searchParams.get("range") === "today" ? "today" : "all";
  const items = await getTrendingQueries(10, range);
  return NextResponse.json({ items, range });
}

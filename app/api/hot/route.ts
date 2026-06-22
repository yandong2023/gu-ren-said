import { NextRequest, NextResponse } from "next/server";
import { getTrendingQueries } from "@/lib/trends.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type HotRange = "today" | "week" | "all";

function readRange(value: string | null): HotRange {
  if (value === "today") return "today";
  if (value === "week") return "week";
  return "all";
}

export async function GET(request: NextRequest) {
  const range = readRange(request.nextUrl.searchParams.get("range"));
  const items = await getTrendingQueries(10, range);
  return NextResponse.json({ items, range });
}

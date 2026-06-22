import { NextRequest, NextResponse } from "next/server";
import { runSearch } from "@/lib/search-service.server";
import { getTrendingQueries, type TrendingQuery } from "@/lib/trends.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type HotRange = "today" | "week" | "all";

function readRange(value: string | null): HotRange {
  if (value === "today") return "today";
  if (value === "week") return "week";
  return "all";
}

async function keepItemsWithResults(items: TrendingQuery[], limit: number) {
  const checked = await Promise.all(items.map(async (item) => {
    const payload = await runSearch(item.query, 1, { enhance: false });
    return payload.results.length > 0 ? item : null;
  }));
  return checked.filter((item): item is TrendingQuery => Boolean(item)).slice(0, limit);
}

export async function GET(request: NextRequest) {
  const range = readRange(request.nextUrl.searchParams.get("range"));
  const rawItems = await getTrendingQueries(20, range);
  const items = await keepItemsWithResults(rawItems, 10);
  return NextResponse.json({ items, range });
}

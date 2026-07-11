import { NextRequest, NextResponse } from "next/server";
import { getHotFeed, type HotRange } from "@/lib/hot.server";

export const runtime = "nodejs";

function readRange(value: string | null): HotRange {
  if (value === "today") return "today";
  if (value === "week") return "week";
  return "all";
}

export async function GET(request: NextRequest) {
  const requestedRange = readRange(request.nextUrl.searchParams.get("range"));
  const feed = await getHotFeed(requestedRange);

  return NextResponse.json({
    items: feed.items,
    requestedRange: feed.requestedRange,
    range: feed.range,
    label: feed.label,
    fallback: feed.fallback
  }, {
    headers: {
      "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600"
    }
  });
}

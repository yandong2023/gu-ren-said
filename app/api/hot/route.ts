import { NextResponse } from "next/server";
import { getTrendingQueries } from "@/lib/trends.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const items = await getTrendingQueries(10);
  return NextResponse.json({ items });
}

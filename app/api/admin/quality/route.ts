import { timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { getQualitySnapshot } from "@/lib/quality.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function configuredKey() {
  return String(process.env.QUALITY_ADMIN_KEY ?? "").trim();
}

function providedKey(request: NextRequest) {
  const headerKey = request.headers.get("x-quality-key")?.trim();
  if (headerKey) return headerKey;
  const authorization = request.headers.get("authorization") ?? "";
  return authorization.toLowerCase().startsWith("bearer ") ? authorization.slice(7).trim() : "";
}

function keysMatch(expected: string, actual: string) {
  if (!expected || !actual) return false;
  const left = Buffer.from(expected);
  const right = Buffer.from(actual);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export async function GET(request: NextRequest) {
  const expected = configuredKey();
  if (!expected) {
    return NextResponse.json(
      { ok: false, message: "质量后台尚未启用，请先配置 QUALITY_ADMIN_KEY。" },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );
  }

  if (!keysMatch(expected, providedKey(request))) {
    return NextResponse.json(
      { ok: false, message: "访问密钥不正确。" },
      { status: 401, headers: { "Cache-Control": "no-store" } }
    );
  }

  const snapshot = await getQualitySnapshot();
  return NextResponse.json(
    { ok: true, ...snapshot },
    { headers: { "Cache-Control": "no-store" } }
  );
}

import { createHash } from "node:crypto";
import type { NextRequest } from "next/server";

export type RateLimitRule = {
  name: string;
  limit: number;
  windowSeconds: number;
};

export type RateLimitResult = {
  ok: boolean;
  remaining: number;
  retryAfter: number;
};

type MemoryBucket = {
  count: number;
  expiresAt: number;
};

const memoryBuckets = new Map<string, MemoryBucket>();

function redisConfig() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return { url: url.replace(/\/+$/, ""), token };
}

async function redisCommand<T>(command: Array<string | number>): Promise<T | null> {
  const config = redisConfig();
  if (!config) return null;

  try {
    const response = await fetch(config.url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(command),
      cache: "no-store"
    });

    if (!response.ok) return null;
    const payload = (await response.json()) as { result?: T };
    return payload.result ?? null;
  } catch {
    return null;
  }
}

function clientFingerprint(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const address = forwarded || request.headers.get("x-real-ip") || request.headers.get("cf-connecting-ip") || "unknown";
  return createHash("sha256").update(address).digest("hex").slice(0, 24);
}

function incrementMemory(key: string, windowSeconds: number) {
  const now = Date.now();
  const existing = memoryBuckets.get(key);

  if (!existing || existing.expiresAt <= now) {
    const bucket = { count: 1, expiresAt: now + windowSeconds * 1000 };
    memoryBuckets.set(key, bucket);
    return { count: bucket.count, ttl: windowSeconds };
  }

  existing.count += 1;
  memoryBuckets.set(key, existing);

  if (memoryBuckets.size > 5000) {
    for (const [bucketKey, bucket] of memoryBuckets) {
      if (bucket.expiresAt <= now) memoryBuckets.delete(bucketKey);
    }
  }

  return {
    count: existing.count,
    ttl: Math.max(1, Math.ceil((existing.expiresAt - now) / 1000))
  };
}

async function incrementBucket(key: string, windowSeconds: number) {
  const script = [
    "local current = redis.call('INCR', KEYS[1])",
    "if current == 1 then redis.call('EXPIRE', KEYS[1], ARGV[1]) end",
    "local ttl = redis.call('TTL', KEYS[1])",
    "return {current, ttl}"
  ].join("\n");

  const remote = await redisCommand<Array<number | string>>(["EVAL", script, 1, key, windowSeconds]);
  if (Array.isArray(remote) && remote.length >= 2) {
    return {
      count: Number(remote[0] ?? 0),
      ttl: Math.max(1, Number(remote[1] ?? windowSeconds))
    };
  }

  return incrementMemory(key, windowSeconds);
}

export async function checkRateLimit(request: NextRequest, rules: RateLimitRule[]): Promise<RateLimitResult> {
  const fingerprint = clientFingerprint(request);
  let remaining = Number.POSITIVE_INFINITY;
  let retryAfter = 0;

  for (const rule of rules) {
    const key = `grs:rate:${rule.name}:${fingerprint}`;
    const bucket = await incrementBucket(key, rule.windowSeconds);
    remaining = Math.min(remaining, Math.max(0, rule.limit - bucket.count));

    if (bucket.count > rule.limit) {
      retryAfter = Math.max(retryAfter, bucket.ttl);
    }
  }

  return {
    ok: retryAfter === 0,
    remaining: Number.isFinite(remaining) ? remaining : 0,
    retryAfter
  };
}

type FeedbackPayload = {
  type: string;
  query: string;
  resultId?: string;
  quote?: string;
  source?: string;
  note?: string;
  userAgent?: string;
};

const FEEDBACK_KEY = "grs:feedback";

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

function clean(value: unknown, max = 300) {
  return String(value ?? "").replace(/[\r\n<>]/g, " ").trim().slice(0, max);
}

export async function recordFeedback(payload: FeedbackPayload) {
  const item = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type: clean(payload.type, 40),
    query: clean(payload.query, 80),
    resultId: clean(payload.resultId, 80),
    quote: clean(payload.quote, 160),
    source: clean(payload.source, 120),
    note: clean(payload.note, 500),
    userAgent: clean(payload.userAgent, 160),
    createdAt: new Date().toISOString()
  };

  if (!item.type || !item.query) return false;

  const saved = await redisCommand<number>(["LPUSH", FEEDBACK_KEY, JSON.stringify(item)]);
  await redisCommand<number>(["LTRIM", FEEDBACK_KEY, 0, 999]);
  return saved !== null;
}

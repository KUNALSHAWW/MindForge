import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Upstash sliding window when configured (works across serverless instances);
// otherwise an in-process fixed window, which is enough for one dev server.
const upstash =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN ? Redis.fromEnv() : null;

const limiters = new Map<string, Ratelimit>();
const memory = new Map<string, { count: number; resetAt: number }>();

export interface RateLimitResult {
  success: boolean;
  retryAfterSeconds: number;
}

/** Allow `limit` requests per `windowSeconds` for `key` within `bucket`. */
export async function rateLimit(bucket: string, key: string, limit: number, windowSeconds: number): Promise<RateLimitResult> {
  if (upstash) {
    let limiter = limiters.get(bucket);
    if (!limiter) {
      limiter = new Ratelimit({ redis: upstash, limiter: Ratelimit.slidingWindow(limit, `${windowSeconds} s`), prefix: `mindforge:${bucket}` });
      limiters.set(bucket, limiter);
    }
    const { success, reset } = await limiter.limit(key);
    return { success, retryAfterSeconds: Math.max(0, Math.ceil((reset - Date.now()) / 1000)) };
  }

  // ponytail: per-process memory window; set the Upstash env vars for multi-instance deployments
  const id = `${bucket}:${key}`;
  const now = Date.now();
  const entry = memory.get(id);
  if (!entry || entry.resetAt <= now) {
    memory.set(id, { count: 1, resetAt: now + windowSeconds * 1000 });
    return { success: true, retryAfterSeconds: 0 };
  }
  entry.count++;
  return { success: entry.count <= limit, retryAfterSeconds: Math.ceil((entry.resetAt - now) / 1000) };
}

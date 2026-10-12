import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  /** Unix epoch (ms) when the window resets. */
  reset: number;
}

export interface RateLimiter {
  limit(key: string): Promise<RateLimitResult>;
}

/**
 * Fixed-window, in-memory limiter. Good enough for local development and as a
 * fallback, but every serverless instance has its own memory, so in production
 * prefer the Upstash (Redis) limiter, which is shared by all instances.
 */
export function createMemoryRateLimiter(max: number, windowMs: number, now = () => Date.now()): RateLimiter {
  const hits = new Map<string, { count: number; reset: number }>();

  return {
    async limit(key) {
      const t = now();
      let entry = hits.get(key);
      if (!entry || entry.reset <= t) {
        entry = { count: 0, reset: t + windowMs };
        hits.set(key, entry);
      }
      entry.count++;
      if (hits.size > 10_000) {
        for (const [k, v] of hits) if (v.reset <= t) hits.delete(k);
      }
      return {
        success: entry.count <= max,
        limit: max,
        remaining: Math.max(0, max - entry.count),
        reset: entry.reset,
      };
    },
  };
}

/** 20 messages per IP every 10 minutes, plus a global daily budget as a cost circuit-breaker. */
const PER_IP = { max: 20, window: "10 m", windowMs: 10 * 60_000 } as const;
const GLOBAL_DAILY = { max: 2_000, window: "1 d", windowMs: 24 * 60 * 60_000 } as const;

function createLimiters(): { perIp: RateLimiter; global: RateLimiter } {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    const redis = Redis.fromEnv();
    return {
      perIp: new Ratelimit({
        redis,
        prefix: "portfolio:chat:ip",
        limiter: Ratelimit.slidingWindow(PER_IP.max, PER_IP.window),
      }),
      global: new Ratelimit({
        redis,
        prefix: "portfolio:chat:global",
        limiter: Ratelimit.fixedWindow(GLOBAL_DAILY.max, GLOBAL_DAILY.window),
      }),
    };
  }
  return {
    perIp: createMemoryRateLimiter(PER_IP.max, PER_IP.windowMs),
    global: createMemoryRateLimiter(GLOBAL_DAILY.max, GLOBAL_DAILY.windowMs),
  };
}

let limiters: ReturnType<typeof createLimiters> | undefined;

export async function checkChatRateLimit(ip: string): Promise<RateLimitResult> {
  limiters ??= createLimiters();
  try {
    const perIp = await limiters.perIp.limit(ip);
    if (!perIp.success) return perIp;
    return await limiters.global.limit("all");
  } catch (error) {
    // Fail open: a Redis outage must not take the chatbot down with it.
    console.error("[rate-limit] limiter unavailable, allowing request", error);
    return { success: true, limit: 0, remaining: 0, reset: 0 };
  }
}

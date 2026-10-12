import { describe, expect, it } from "vitest";
import { createMemoryRateLimiter } from "./rate-limit";

describe("createMemoryRateLimiter", () => {
  it("allows up to `max` hits per window and per key, then resets", async () => {
    let now = 0;
    const limiter = createMemoryRateLimiter(2, 1000, () => now);

    expect((await limiter.limit("a")).success).toBe(true);
    expect((await limiter.limit("a")).success).toBe(true);
    const blocked = await limiter.limit("a");
    expect(blocked.success).toBe(false);
    expect(blocked.remaining).toBe(0);
    expect(blocked.reset).toBe(1000);

    // Other keys are independent.
    expect((await limiter.limit("b")).success).toBe(true);

    now = 1000;
    expect((await limiter.limit("a")).success).toBe(true);
  });
});

import { APICallError, RetryError } from "ai";
import { describe, expect, it } from "vitest";
import { classifyProviderError } from "./errors";

const apiError = (statusCode: number, responseBody = "") =>
  new APICallError({
    message: "boom",
    url: "https://api.openai.com",
    requestBodyValues: {},
    statusCode,
    responseBody,
  });

describe("classifyProviderError", () => {
  it("tells 'no credit left' apart from a temporary rate limit", () => {
    expect(classifyProviderError(apiError(429, '{"error":{"code":"insufficient_quota"}}')).kind).toBe(
      "quota",
    );
    expect(classifyProviderError(apiError(429, '{"error":{"code":"rate_limit_exceeded"}}')).kind).toBe(
      "rate-limit",
    );
  });

  it("unwraps the SDK RetryError", () => {
    const retry = new RetryError({
      message: "Failed after 2 attempts",
      reason: "maxRetriesExceeded",
      errors: [apiError(429, "insufficient_quota"), apiError(429, "insufficient_quota")],
    });
    expect(classifyProviderError(retry)).toEqual({ kind: "quota", statusCode: 429 });
  });

  it("classifies auth, outages and unknown errors", () => {
    expect(classifyProviderError(apiError(401)).kind).toBe("auth");
    expect(classifyProviderError(apiError(503)).kind).toBe("unavailable");
    expect(classifyProviderError(new Error("?")).kind).toBe("unknown");
  });
});

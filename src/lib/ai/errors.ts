import { APICallError, RetryError } from "ai";

export type ProviderErrorKind = "quota" | "rate-limit" | "auth" | "unavailable" | "unknown";

/** The SDK wraps provider failures in a RetryError after retrying; dig out the real one. */
function unwrap(error: unknown): unknown {
  return RetryError.isInstance(error) ? (error.lastError ?? error) : error;
}

/**
 * Classifies a model-provider failure so we can log it precisely and show the
 * visitor an honest message. `quota` (no credit left) and `rate-limit` (too many
 * requests right now) are both HTTP 429 at OpenAI, distinguished by the body.
 */
export function classifyProviderError(error: unknown): { kind: ProviderErrorKind; statusCode?: number } {
  const err = unwrap(error);
  if (!APICallError.isInstance(err)) return { kind: "unknown" };

  const { statusCode, responseBody = "" } = err;
  if (statusCode === 429) {
    return {
      kind: /insufficient_quota|exceeded your current quota/i.test(responseBody + err.message)
        ? "quota"
        : "rate-limit",
      statusCode,
    };
  }
  if (statusCode === 401 || statusCode === 403) return { kind: "auth", statusCode };
  if (statusCode !== undefined && statusCode >= 500) return { kind: "unavailable", statusCode };
  return { kind: "unknown", statusCode };
}

export const visitorErrorMessages: Record<ProviderErrorKind, string> = {
  quota:
    "The assistant is taking a break right now (its AI budget is used up). Please try again later, or reach me through the contact form.",
  "rate-limit": "The assistant is very busy right now. Please try again in a minute.",
  auth: "The assistant is temporarily unavailable. Please use the contact form in the meantime.",
  unavailable: "The AI provider is having issues right now. Please try again in a moment.",
  unknown: "Sorry, something went wrong on my side. Please try again in a moment.",
};

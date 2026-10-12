import { APICallError, RetryError } from "ai";
import type { Locale } from "@/i18n/routing";
import { chatApiMessages } from "./messages";

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

const MESSAGE_KEYS = {
  quota: "quota",
  "rate-limit": "rateLimit",
  auth: "auth",
  unavailable: "unavailable",
  unknown: "unknown",
} as const satisfies Record<ProviderErrorKind, keyof (typeof chatApiMessages)["en"]>;

/** Honest, translated message for the visitor (texts live in messages/*.json → ChatApi). */
export function visitorErrorMessage(kind: ProviderErrorKind, locale: Locale = "en"): string {
  return chatApiMessages[locale][MESSAGE_KEYS[kind]];
}

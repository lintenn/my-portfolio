import { z } from "zod";
import { locales } from "@/i18n/routing";
import { chatConfig } from "./config";

/** Shape check only; deep validation of each message is done by `validateUIMessages`. */
export const chatRequestSchema = z.object({
  messages: z
    .array(
      z.looseObject({
        id: z.string().max(100),
        role: z.enum(["user", "assistant"]),
        parts: z.array(z.looseObject({ type: z.string() })).max(30),
      }),
    )
    .min(1)
    .max(100),
  /** UI language of the page the visitor is chatting from. */
  locale: z.enum(locales).catch("en"),
});

type RequestMessage = z.infer<typeof chatRequestSchema>["messages"][number];

export type PrepareResult<T> = { ok: true; messages: T[] } | { ok: false; error: "lastNotUser" | "tooLong" };

function textLength(message: RequestMessage): number {
  return message.parts.reduce(
    (sum, part) => sum + (part.type === "text" && typeof part.text === "string" ? part.text.length : 0),
    0,
  );
}

/**
 * Applies the conversation policy before anything reaches the model:
 * - the last message must come from the visitor,
 * - visitor messages must have a bounded size,
 * - only the last N messages are kept (bounds tokens, cost and latency).
 */
export function prepareMessages<T extends RequestMessage>(messages: T[]): PrepareResult<T> {
  const last = messages.at(-1);
  if (!last || last.role !== "user") {
    return { ok: false, error: "lastNotUser" };
  }

  const tooLong = messages.some((m) => m.role === "user" && textLength(m) > chatConfig.maxUserMessageChars);
  if (tooLong) {
    return { ok: false, error: "tooLong" };
  }

  let window = messages.slice(-chatConfig.maxHistoryMessages);
  // Never start the window with an orphan assistant reply.
  while (window.length > 1 && window[0]?.role !== "user") window = window.slice(1);

  return { ok: true, messages: window };
}

/** Best-effort client IP on Vercel (falls back to a shared bucket locally). */
export function getClientIp(headers: Headers): string {
  return headers.get("x-real-ip") ?? headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
}

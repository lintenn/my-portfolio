import { convertToModelMessages, safeValidateUIMessages, streamText } from "ai";
import { assistantSettings } from "@/lib/ai/assistant";
import { chatConfig } from "@/lib/ai/config";
import { classifyProviderError, visitorErrorMessage } from "@/lib/ai/errors";
import { chatApiMessages } from "@/lib/ai/messages";
import { chatRequestSchema, getClientIp, prepareMessages } from "@/lib/ai/request";
import { createChatTools, type ChatUIMessage } from "@/lib/ai/tools";
import { checkChatRateLimit } from "@/lib/rate-limit";

// Upper bound for one streamed answer (seconds). Fluid Compute bills active CPU, not waiting time.
export const maxDuration = 60;

function jsonError(status: number, error: string, headers?: HeadersInit) {
  return Response.json({ error }, { status, headers });
}

export async function POST(req: Request) {
  const body: unknown = await req.json().catch(() => null);
  // Read the locale first so even early errors are shown in the visitor's language.
  const locale = chatRequestSchema.shape.locale.parse((body as { locale?: unknown } | null)?.locale);
  const t = chatApiMessages[locale];

  if (!process.env.OPENAI_API_KEY) {
    console.error(JSON.stringify({ event: "chat.misconfigured", reason: "OPENAI_API_KEY is not set" }));
    return jsonError(503, t.notConfigured);
  }

  // 1. Rate limiting (per IP + global daily budget), before doing any work.
  const ip = getClientIp(req.headers);
  const rate = await checkChatRateLimit(ip);
  if (!rate.success) {
    const retryAfter = Math.max(1, Math.ceil((rate.reset - Date.now()) / 1000));
    return jsonError(429, t.tooManyRequests, { "Retry-After": String(retryAfter) });
  }

  // 2. Input validation: shape, conversation policy, then deep UI-message validation.
  const parsed = chatRequestSchema.safeParse(body);
  if (!parsed.success) return jsonError(400, t.invalidRequest);

  const prepared = prepareMessages(parsed.data.messages);
  if (!prepared.ok) {
    return jsonError(
      400,
      prepared.error === "tooLong"
        ? t.tooLong.replace("{max}", String(chatConfig.maxUserMessageChars))
        : t.lastNotUser,
    );
  }

  const validated = await safeValidateUIMessages<ChatUIMessage>({
    messages: prepared.messages,
    tools: createChatTools(locale),
  });
  if (!validated.success) return jsonError(400, t.invalidRequest);

  // 3. Generation, streamed back to the browser as typed UI message parts.
  const startedAt = Date.now();
  const result = streamText({
    ...assistantSettings({ userId: ip, locale }),
    messages: await convertToModelMessages(validated.data),
    onEnd: ({ usage, finishReason, steps }) => {
      // Structured log line → searchable in Vercel's runtime logs. No message content.
      console.info(
        JSON.stringify({
          event: "chat.completed",
          model: chatConfig.model,
          locale,
          finishReason,
          steps: steps.length,
          inputTokens: usage.inputTokens,
          cachedInputTokens: usage.inputTokenDetails.cacheReadTokens,
          outputTokens: usage.outputTokens,
          reasoningTokens: usage.outputTokenDetails.reasoningTokens,
          ms: Date.now() - startedAt,
        }),
      );
    },
    // Provider errors carry the request body (the visitor's messages): log a sanitized summary only.
    onError: ({ error }) =>
      console.error(
        JSON.stringify({
          event: "chat.error",
          ...classifyProviderError(error),
          name: error instanceof Error ? error.name : "Unknown",
          message: error instanceof Error ? error.message.slice(0, 300) : String(error),
        }),
      ),
  });

  return result.toUIMessageStreamResponse<ChatUIMessage>({
    originalMessages: validated.data,
    onError: (error) => visitorErrorMessage(classifyProviderError(error).kind, locale),
  });
}

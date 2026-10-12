import { convertToModelMessages, safeValidateUIMessages, streamText } from "ai";
import { assistantSettings } from "@/lib/ai/assistant";
import { chatConfig } from "@/lib/ai/config";
import { classifyProviderError, visitorErrorMessages } from "@/lib/ai/errors";
import { chatRequestSchema, getClientIp, prepareMessages } from "@/lib/ai/request";
import { chatTools, type ChatUIMessage } from "@/lib/ai/tools";
import { checkChatRateLimit } from "@/lib/rate-limit";

// Streaming responses can take a while; give the function room (seconds).
export const maxDuration = 30;

function jsonError(status: number, error: string, headers?: HeadersInit) {
  return Response.json({ error }, { status, headers });
}

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) {
    console.error(JSON.stringify({ event: "chat.misconfigured", reason: "OPENAI_API_KEY is not set" }));
    return jsonError(503, "The assistant is not configured right now.");
  }

  // 1. Rate limiting (per IP + global daily budget), before doing any work.
  const ip = getClientIp(req.headers);
  const rate = await checkChatRateLimit(ip);
  if (!rate.success) {
    const retryAfter = Math.max(1, Math.ceil((rate.reset - Date.now()) / 1000));
    return jsonError(429, "Too many messages. Please wait a few minutes and try again.", {
      "Retry-After": String(retryAfter),
    });
  }

  // 2. Input validation: shape, conversation policy, then deep UI-message validation.
  const parsed = chatRequestSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return jsonError(400, "Invalid request.");

  const prepared = prepareMessages(parsed.data.messages);
  if (!prepared.ok) return jsonError(400, prepared.error);

  const validated = await safeValidateUIMessages<ChatUIMessage>({
    messages: prepared.messages,
    tools: chatTools,
  });
  if (!validated.success) return jsonError(400, "Invalid messages.");

  // 3. Generation, streamed back to the browser as typed UI message parts.
  const startedAt = Date.now();
  const result = streamText({
    ...assistantSettings({ userId: ip }),
    messages: await convertToModelMessages(validated.data),
    onEnd: ({ usage, finishReason, steps }) => {
      // Structured log line → searchable in Vercel's runtime logs. No message content.
      console.info(
        JSON.stringify({
          event: "chat.completed",
          model: chatConfig.model,
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
    onError: (error) => visitorErrorMessages[classifyProviderError(error).kind],
  });
}

import { createHash } from "node:crypto";
import { openai, type OpenAILanguageModelResponsesOptions } from "@ai-sdk/openai";
import { isStepCount } from "ai";
import { chatConfig } from "./config";
import { buildSystemPrompt } from "./prompt";
import type { Locale } from "@/i18n/routing";
import { createChatTools } from "./tools";

/**
 * Everything that defines the assistant's behavior, in one place. Both the API
 * route (streaming, production) and the eval suite (`npm run eval`) use it, so
 * evals always test exactly what visitors get.
 */
export function assistantSettings({ userId, locale = "en" }: { userId?: string; locale?: Locale } = {}) {
  return {
    model: openai(chatConfig.model),
    instructions: buildSystemPrompt({ locale }),
    tools: createChatTools(locale),
    // Agent loop: model → tool call → tool result → model … at most `maxSteps` times.
    stopWhen: isStepCount(chatConfig.maxSteps),
    maxOutputTokens: chatConfig.maxOutputTokens,
    // One retry is enough for transient errors; a visitor shouldn't wait for more.
    maxRetries: 1,
    providerOptions: {
      openai: {
        reasoningEffort: chatConfig.reasoningEffort,
        // The UI doesn't show the model's reasoning, so don't pay for summaries of it.
        reasoningSummary: null,
        textVerbosity: "low",
        promptCacheKey: chatConfig.promptCacheKey,
        // Don't keep conversations stored on OpenAI's side.
        store: false,
        // Lets OpenAI attribute abuse to an anonymous end user instead of the whole API key.
        ...(userId && { safetyIdentifier: createHash("sha256").update(userId).digest("hex").slice(0, 32) }),
      } satisfies OpenAILanguageModelResponsesOptions,
    },
  };
}

/** Central knobs for the chatbot. See docs/CHATBOT.md for the reasoning behind each value. */
export const chatConfig = {
  /** Any OpenAI Responses API model id. Override with the OPENAI_MODEL env var. */
  model: process.env.OPENAI_MODEL || "gpt-6-luna",
  /** Reasoning models think before answering; "low" keeps latency and cost down for a Q&A bot. */
  reasoningEffort: "low",
  /** Hard cap on the answer length (also bounds cost per request). */
  maxOutputTokens: 1_000,
  /** Max model ↔ tool round-trips per request (tool call → result → final answer). */
  maxSteps: 3,
  /** Only the most recent messages are sent to the model (sliding window of history). */
  maxHistoryMessages: 12,
  /** Max characters of a single visitor message. */
  maxUserMessageChars: 1_000,
  /** Stable key so requests with the same prefix are routed to the same prompt cache. */
  promptCacheKey: "portfolio-assistant-v2",
} as const;

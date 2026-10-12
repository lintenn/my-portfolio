import { describe, expect, it } from "vitest";
import { chatConfig } from "./config";
import { chatRequestSchema, getClientIp, prepareMessages } from "./request";

const msg = (role: "user" | "assistant", text: string, id = Math.random().toString(36)) => ({
  id,
  role,
  parts: [{ type: "text", text }],
});

describe("chatRequestSchema", () => {
  it("rejects system messages and malformed bodies", () => {
    expect(chatRequestSchema.safeParse({ messages: [msg("user", "hi")] }).success).toBe(true);
    expect(chatRequestSchema.safeParse({ messages: [{ ...msg("user", "x"), role: "system" }] }).success).toBe(
      false,
    );
    expect(chatRequestSchema.safeParse({ messages: [] }).success).toBe(false);
    expect(chatRequestSchema.safeParse(null).success).toBe(false);
  });
});

describe("prepareMessages", () => {
  it("requires the last message to be from the user", () => {
    expect(prepareMessages([msg("user", "hi"), msg("assistant", "hello")]).ok).toBe(false);
  });

  it("rejects oversized user messages", () => {
    const result = prepareMessages([msg("user", "a".repeat(chatConfig.maxUserMessageChars + 1))]);
    expect(result.ok).toBe(false);
  });

  it("keeps a sliding window that starts with a user message", () => {
    const history = Array.from({ length: 30 }, (_, i) => msg(i % 2 === 0 ? "user" : "assistant", `m${i}`));
    history.push(msg("user", "last"));
    const result = prepareMessages(history);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.messages.length).toBeLessThanOrEqual(chatConfig.maxHistoryMessages);
    expect(result.messages[0]?.role).toBe("user");
    expect(result.messages.at(-1)?.parts[0]).toMatchObject({ text: "last" });
  });
});

describe("getClientIp", () => {
  it("prefers x-real-ip, then the first x-forwarded-for hop", () => {
    expect(getClientIp(new Headers({ "x-real-ip": "1.1.1.1", "x-forwarded-for": "2.2.2.2" }))).toBe(
      "1.1.1.1",
    );
    expect(getClientIp(new Headers({ "x-forwarded-for": "3.3.3.3, 10.0.0.1" }))).toBe("3.3.3.3");
    expect(getClientIp(new Headers())).toBe("local");
  });
});

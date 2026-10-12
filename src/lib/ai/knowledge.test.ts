import { describe, expect, it } from "vitest";
import { getContent } from "@/content";
import { buildKnowledgeBase } from "./knowledge";
import { buildSystemPrompt } from "./prompt";
import { createChatTools } from "./tools";

const NOW = new Date(2026, 9, 12);

describe("knowledge base", () => {
  const kb = buildKnowledgeBase(NOW);
  const { experience, projects } = getContent("en");

  it("includes every job and project from the content files", () => {
    for (const job of experience) expect(kb).toContain(job.company);
    for (const project of projects) expect(kb).toContain(project.title);
  });

  it("is deterministic for a given date (required for prompt caching)", () => {
    expect(buildKnowledgeBase(NOW)).toBe(kb);
  });

  it("stays small enough to send on every request", () => {
    // ~4 chars per token → keep the whole knowledge base under ~8k tokens.
    expect(kb.length).toBeLessThan(32_000);
  });
});

describe("system prompt", () => {
  it("puts the static content first and the variable part (language, date) last", () => {
    const es = buildSystemPrompt({ locale: "es", now: NOW });
    const de = buildSystemPrompt({ locale: "de", now: NOW });
    expect(es.trimEnd().endsWith("Site language: Spanish. Current month: 2026-10.")).toBe(true);
    // Same cacheable prefix regardless of the visitor's language.
    const prefix = es.slice(0, es.indexOf("Site language:"));
    expect(de.startsWith(prefix)).toBe(true);
  });
});

describe("chat tools", () => {
  const ctx = { toolCallId: "t", messages: [], context: {} } as never;

  it("showProjects filters by technology and falls back to featured, in the UI language", async () => {
    const tools = createChatTools("es");
    const tf = await tools.showProjects.execute!({ technology: "tensorflow" }, ctx);
    expect(Array.isArray(tf) && tf.map((p) => p.slug)).toContain("age-detector");
    expect(Array.isArray(tf) && tf.find((p) => p.slug === "age-detector")?.title).toBe("Detector de edad");

    const featured = await tools.showProjects.execute!({}, ctx);
    expect(Array.isArray(featured) && featured.length).toBeGreaterThan(0);
  });

  it("showContactCard returns public contact info only", async () => {
    const card = await createChatTools("en").showContactCard.execute!({}, ctx);
    expect(card).toMatchObject({ contactPage: "/contact" });
  });
});

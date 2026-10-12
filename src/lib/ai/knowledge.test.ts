import { describe, expect, it } from "vitest";
import { experience, projects } from "@/content";
import { buildKnowledgeBase } from "./knowledge";
import { buildSystemPrompt } from "./prompt";
import { chatTools } from "./tools";

const NOW = new Date(2026, 9, 12);

describe("knowledge base", () => {
  const kb = buildKnowledgeBase(NOW);

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
  it("puts the static content first and the date last", () => {
    const prompt = buildSystemPrompt(NOW);
    expect(prompt.indexOf("<knowledge>")).toBeLessThan(prompt.indexOf("Current month: 2026-10"));
    expect(prompt.trimEnd().endsWith("Current month: 2026-10.")).toBe(true);
  });
});

describe("chat tools", () => {
  const ctx = { toolCallId: "t", messages: [], context: {} } as never;

  it("showProjects filters by technology and falls back to featured", async () => {
    const tf = await chatTools.showProjects.execute!({ technology: "tensorflow" }, ctx);
    expect(Array.isArray(tf) && tf.map((p) => p.slug)).toContain("age-detector");

    const featured = await chatTools.showProjects.execute!({}, ctx);
    expect(Array.isArray(featured) && featured.length).toBeGreaterThan(0);
  });

  it("showContactCard returns public contact info only", async () => {
    const card = await chatTools.showContactCard.execute!({}, ctx);
    expect(card).toMatchObject({ contactPage: "/contact" });
  });
});

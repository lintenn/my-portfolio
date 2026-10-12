/**
 * Runs the assistant eval suite against the REAL model (costs a few cents).
 *
 *   npm run eval              # deterministic checks only
 *   npm run eval -- --judge   # + LLM-as-judge faithfulness grading
 *   npm run eval -- --only "spanish"
 *
 * Requires OPENAI_API_KEY (read from .env.local). Exits with code 1 on failure.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { openai } from "@ai-sdk/openai";
import { generateText, Output } from "ai";
import { z } from "zod";
import { evalCases, type EvalCase } from "../evals/chat-cases";
import { assistantSettings } from "../src/lib/ai/assistant";
import { chatConfig } from "../src/lib/ai/config";
import { buildKnowledgeBase } from "../src/lib/ai/knowledge";

const args = process.argv.slice(2);
const useJudge = args.includes("--judge");
const only = args.includes("--only") ? args[args.indexOf("--only") + 1]?.toLowerCase() : undefined;

if (!process.env.OPENAI_API_KEY) {
  console.error("✗ OPENAI_API_KEY is not set (put it in .env.local).");
  process.exit(1);
}

const judgeSchema = z.object({
  grounded: z.boolean().describe("true if every factual claim about Luis is supported by the knowledge base"),
  unsupportedClaims: z.array(z.string()).describe("claims not supported by the knowledge base"),
});

async function judge(question: string, answer: string) {
  const { output } = await generateText({
    model: openai(chatConfig.model),
    output: Output.object({ schema: judgeSchema }),
    instructions:
      "You are a strict evaluator. Given a knowledge base, a question and an answer written by an assistant that speaks as Luis, decide whether every factual claim about Luis in the answer is supported by the knowledge base. Saying that some information is not available is always grounded.",
    prompt: `<knowledge>\n${buildKnowledgeBase()}\n</knowledge>\n\n<question>${question}</question>\n\n<answer>${answer}</answer>`,
  });
  return output;
}

async function runCase(c: EvalCase) {
  const started = Date.now();
  const result = await generateText({
    ...assistantSettings({ userId: "eval", locale: c.locale }),
    prompt: c.input,
  });
  const text = result.text;
  const tools = result.steps.flatMap((s) => s.toolCalls.map((t) => t.toolName));
  const failures: string[] = [];

  for (const re of c.mustMatch ?? []) if (!re.test(text)) failures.push(`expected to match ${re}`);
  for (const re of c.mustNotMatch ?? []) if (re.test(text)) failures.push(`must not match ${re}`);
  if (c.expectTool && !tools.includes(c.expectTool)) failures.push(`expected tool call "${c.expectTool}"`);

  let judgement: z.infer<typeof judgeSchema> | undefined;
  if (useJudge && c.judge) {
    judgement = await judge(c.input, text);
    if (!judgement.grounded)
      failures.push(`judge: unsupported claims → ${judgement.unsupportedClaims.join(" | ")}`);
  }

  return {
    name: c.name,
    passed: failures.length === 0,
    failures,
    tools,
    text,
    judgement,
    ms: Date.now() - started,
    usage: result.totalUsage,
  };
}

async function main() {
  const cases = evalCases.filter((c) => !only || c.name.toLowerCase().includes(only));
  console.log(
    `Running ${cases.length} eval cases on ${chatConfig.model}${useJudge ? " (with LLM judge)" : ""}…\n`,
  );

  const results = [];
  for (const c of cases) {
    try {
      const r = await runCase(c);
      results.push(r);
      console.log(
        `${r.passed ? "✓" : "✗"} ${r.name} (${r.ms} ms${r.tools.length ? `, tools: ${r.tools.join(",")}` : ""})`,
      );
      for (const f of r.failures) console.log(`    ↳ ${f}`);
      if (!r.passed) console.log(`    answer: ${r.text.replace(/\s+/g, " ").slice(0, 300)}`);
    } catch (error) {
      results.push({ name: c.name, passed: false, failures: [String(error)] });
      console.log(`✗ ${c.name}\n    ↳ ${String(error).slice(0, 300)}`);
    }
  }

  const passed = results.filter((r) => r.passed).length;
  const tokens = results.reduce(
    (acc, r) => {
      const u = "usage" in r ? r.usage : undefined;
      return {
        input: acc.input + (u?.inputTokens ?? 0),
        cached: acc.cached + (u?.inputTokenDetails.cacheReadTokens ?? 0),
        output: acc.output + (u?.outputTokens ?? 0),
      };
    },
    { input: 0, cached: 0, output: 0 },
  );
  console.log(
    `\n${passed}/${results.length} passed · tokens in ${tokens.input} (cached ${tokens.cached}) · out ${tokens.output}`,
  );

  mkdirSync("evals/reports", { recursive: true });
  const file = `evals/reports/${new Date().toISOString().replace(/[:.]/g, "-")}.json`;
  writeFileSync(file, JSON.stringify({ model: chatConfig.model, judge: useJudge, results }, null, 2));
  console.log(`Report: ${file}`);

  process.exit(passed === results.length ? 0 : 1);
}

void main();

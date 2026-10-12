---
name: eval-chatbot
description: Run, interpret and extend the AI assistant's eval suite. Use after changing the system prompt, tools, model or content, when a bad chatbot answer is reported, or when asked to evaluate/test the chatbot.
---

# Evaluate the chatbot

Evals are the tests of an LLM feature: fixed inputs + checks on the outputs. They live in `evals/chat-cases.ts` and run with `scripts/eval-chat.ts` against the **real model** using the exact production settings (`src/lib/ai/assistant.ts`).

## Run

Costs a few cents per run and needs `OPENAI_API_KEY` in `.env.local`. **Ask Luis before running it.**

```bash
npm run eval                    # deterministic checks (regex, tool calls)
npm run eval -- --judge         # + LLM-as-judge: is every claim grounded in the knowledge base?
npm run eval -- --only spanish  # a subset by name
```

A JSON report is written to `evals/reports/` (git-ignored).

## Interpret failures

- **Regex/tool check failed** → read the printed answer. Is the check too strict (rephrase-sensitive) or is the behavior wrong?
- **Judge flagged unsupported claims** → hallucination. Fix the knowledge (`src/content/`) if the fact is true but missing; otherwise tighten the rules in `src/lib/ai/prompt.ts`.
- **Flaky** (passes/fails between runs) → LLMs are non-deterministic. Run 2–3 times; make checks test _meaning_ (key facts, tool used) not exact wording.

## Extend

When a real conversation goes wrong, first add it as a case (a regression test), see it fail, then fix the prompt/content and see it pass. Each case: one `input`, plus `mustMatch` / `mustNotMatch` regexes, `expectTool`, and `judge: true` for factual questions.

Document notable prompt or model changes in `docs/CHATBOT.md` and `CHANGELOG.md`.

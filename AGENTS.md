# Agent instructions

Guidance for AI coding agents (Claude Code, Codex, Copilot…) working in this repository. Humans: see [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md).

## Project in one paragraph

Next.js 16 (App Router) portfolio for Luis Miguel García Marín, in English, Spanish and German (next-intl, `src/app/[locale]`), with an AI assistant. All facts live as typed data in `src/content/` and feed both the pages and the assistant's knowledge base (`src/lib/ai/knowledge.ts`), which is sent in full to the model on every request (long-context, no RAG). The chat endpoint is `src/app/api/chat/route.ts` (Vercel AI SDK 7 `streamText` + OpenAI Responses API + tools). Deployed on Vercel: `develop` → Preview, `main` → Production.

## Commands

```bash
npm run dev          # local dev server
npm run check        # lint + typecheck + unit tests — run before saying you're done
npm run build        # production build
npm run docs:check   # which docs your change requires
npm run eval         # chatbot evals vs the real model — costs money, ask first
```

## Rules

1. **Content is data.** Never hard-code personal facts in components or prompts; edit `src/content/*.ts`. Computed values (years of experience, durations) must stay computed.
2. **Docs are part of done.** Every functional change updates `CHANGELOG.md` (`[Unreleased]`) and the docs mapped in `scripts/check-docs.mjs`. A `Stop` hook enforces this in Claude Code; CI enforces it on PRs.
3. **Chatbot changes need evals.** If you touch `src/lib/ai/**` or the content in a way that changes answers, add/adjust cases in `evals/chat-cases.ts` and suggest running `npm run eval -- --judge`.
4. **Keep the prompt cache-friendly.** The static part of the system prompt goes first; anything that changes per request goes last. Keep `buildKnowledgeBase()` deterministic.
5. **Privacy & security.** Never log message contents. Never commit `.env*` (only `.env.example`). Don't read `.env.local`. Don't publish recruiter-only LinkedIn info (e.g. "open to work").
6. **Next.js 16 specifics.** Request APIs (`cookies()`, `headers()`, `params`) are async; `middleware` is now `proxy`; lint with the ESLint CLI (`next lint` no longer exists). Consult `node_modules/next/dist/docs/` for version-matched docs.
7. **AI SDK 7 specifics.** Messages are `UIMessage` with `parts`; use `convertToModelMessages`, `isStepCount`, `instructions` (not `system`), `toUIMessageStreamResponse`. Check types in `node_modules/ai/dist/index.d.ts` rather than relying on older examples.
8. **Three languages.** Every UI string goes in `src/i18n/messages/{en,es,de}.json`; every translatable fact is an `{ en, es, de }` object in `src/content`. Use `Link`/`useRouter` from `@/i18n/navigation`, never `next/link`. Write natural translations, not literal ones.
9. **Motion with care.** Interactions use `motion/react`/CSS, must respect `prefers-reduced-motion`, and hover effects are gated to fine pointers (`pointer-fine:`).
10. Style: TypeScript strict, functional React components, Tailwind utility classes with `cn()`, Prettier (110 cols). Match the surrounding code; comment the _why_, not the _what_.
11. Git: work on `develop` or a feature branch; never push to `main` directly; releases go through the `release` skill.

## Claude Code extras

Skills in `.claude/skills/`: `update-docs`, `update-profile`, `add-project`, `eval-chatbot`, `release`. Subagent: `docs-auditor`. Hooks in `.claude/settings.json`: Prettier on every edit, docs guard on stop.

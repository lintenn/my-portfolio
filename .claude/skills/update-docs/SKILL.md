---
name: update-docs
description: Bring the project documentation (README, docs/*, CHANGELOG, AGENTS.md, ADRs) in sync with the current code. Use after any code change, when the docs-guard hook blocks, or when asked to "update the docs".
---

# Update docs

Documentation in this repo is part of the definition of done. Your goal: every doc describes the code **as it is now** — no stale versions, file paths, env vars or behaviors.

## 1. Find what changed

```bash
node scripts/check-docs.mjs          # which docs are required, and why
git status --short && git diff HEAD --stat
```

Read the actual diffs of the triggering files before writing anything. Never document from memory.

## 2. Map changes → docs

| You changed…                                                                           | Update                                                          |
| -------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| `src/lib/ai/**`, `src/app/api/chat/**`, `src/components/chat/**`, `evals/**`           | `docs/CHATBOT.md` (+ `docs/AI-CONCEPTS.es.md` if a new concept) |
| `src/content/types.ts`, `src/i18n/**`, `src/proxy.ts`, routes in `src/app/[locale]/**` | `docs/ARCHITECTURE.md`, `docs/CONTENT.md`                       |
| `.env.example`, `next.config.ts`, `.github/workflows/**`                               | `docs/DEPLOYMENT.md`                                            |
| `.claude/**`, `.githooks/**`, lint/format/test config, `scripts/check-docs`            | `docs/DEVELOPMENT.md`, `AGENTS.md`                              |
| `package.json` (deps, scripts)                                                         | `README.md` (stack, scripts), `docs/ARCHITECTURE.md`            |
| A significant design decision (new service, replaced library, new pattern)             | New ADR in `docs/adr/` (copy the format of existing ones)       |
| **Anything functional**                                                                | `CHANGELOG.md` → `## [Unreleased]`                              |

The mapping is enforced by `scripts/check-docs.mjs`; if you add a new area of code, add a rule there too.

## 3. Write

- **CHANGELOG.md**: add bullets under `## [Unreleased]` in the right group (`Added`, `Changed`, `Fixed`, `Removed`, `Security`). One line each, user-facing wording.
- Keep each doc's existing structure and tone. Update tables, code snippets, file paths and version numbers that the change affects. Remove what no longer exists.
- Public docs (README, docs/*.md) are in **English**. `docs/AI-CONCEPTS.es.md` is in **Spanish** (it's Luis's study guide).
- Diagrams are Mermaid; keep them consistent with the code.
- Don't pad: if a change needs one sentence, write one sentence.

## 4. Verify

```bash
node scripts/check-docs.mjs   # must print ✓
npm run format                # docs are Prettier-formatted too
```

For a deeper consistency review of all docs vs code, delegate to the `docs-auditor` subagent.

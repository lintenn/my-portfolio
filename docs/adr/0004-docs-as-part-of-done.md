# 0004 — Enforce documentation updates with automation

- **Status:** Accepted
- **Date:** 2026-10-12

## Context

Documentation goes stale because updating it relies on memory. The 2024 README still described a stack that no longer worked. Much of the work in this repo is now done with an AI coding agent (Claude Code), which is fast at writing docs but needs a trigger and clear rules.

## Decision

Encode _"changes to X require updating doc Y"_ as rules in one script, `scripts/check-docs.mjs`, and run it at three points:

1. **Claude Code `Stop` hook** — the agent can't end its turn until required docs are updated (with loop protection).
2. **Git pre-commit hook** — warns humans locally.
3. **GitHub Actions on PRs** — blocks merging (bypass with the `skip-docs` label for genuine exceptions).

Complement it with an `update-docs` skill (how to update), a `docs-auditor` subagent (deep accuracy review), a Keep-a-Changelog `CHANGELOG.md`, and ADRs for decisions.

## Consequences

- ✅ Docs and changelog evolve with the code, by default.
- ✅ Rules are explicit and versioned; one source for all three enforcement points.
- ⚠️ The guard checks that a doc was _touched_, not that it is _correct_ — the auditor subagent and code review cover accuracy.
- ⚠️ Occasional false positives (e.g. pure refactors) → explain in the PR and use `skip-docs`.

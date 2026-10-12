# 0003 — Typed content as the single source of truth

- **Status:** Accepted
- **Date:** 2026-10-12

## Context

Facts (jobs, projects, skills) were written directly inside page JSX, and the chatbot's knowledge was scraped from that JSX with regexes. Updating the CV meant editing markup, and the chatbot could drift from the pages or ingest noise. Values like "more than 2 years of experience" went stale silently.

## Decision

Model all personal content as typed TypeScript data in `src/content/` (`types.ts` defines the schema). Pages render it; `buildKnowledgeBase()` serializes it for the assistant and `/llms.txt`; metadata, JSON-LD and the OG image read it too. Derived values (durations, years of experience, honors count) are computed, never typed by hand.

## Consequences

- ✅ Update once, reflected everywhere — including the AI's answers.
- ✅ The type checker catches missing fields; unit tests assert every job/project reaches the knowledge base.
- ✅ Easy for humans and agents (`update-profile` skill) to edit safely.
- ⚠️ No CMS: editing requires a commit. Acceptable for a personal site; a headless CMS could later feed the same types.

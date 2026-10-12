# 0005 — Internationalization with next-intl and inline-translated typed content

- **Status:** Accepted
- **Date:** 2026-10-12
- **Extends:** [ADR-0003](0003-typed-content-single-source-of-truth.md)

## Context

The site must be readable in English, Spanish and German (Luis's languages). Two kinds of text exist: interface copy (buttons, headings, legal text) and facts about Luis (jobs, projects…), which are also the assistant's knowledge. Requirements: SEO-friendly URLs per language, static rendering, automatic language detection, type safety (no missing translations), and keeping the chatbot's prompt cache efficient.

## Decision

- **Routing:** next-intl with a `[locale]` segment, `localePrefix: "as-needed"` (English keeps `/about`; `/es/about`, `/de/about`), a Next.js 16 `proxy.ts` for `Accept-Language` detection + cookie, `hreflang` alternates in metadata and sitemap, all pages pre-rendered per locale.
- **UI copy:** JSON catalogues per locale; `en.json` types the others via `AppConfig` augmentation; a unit test asserts identical key sets.
- **Facts:** stay in `src/content/*.ts` (ADR-0003). Each text is a `string` (language-neutral) or an `L = { en, es, de }` object; `getContent(locale)` deep-resolves to plain strings. TypeScript enforces every translation.
- **Assistant:** knowledge base stays English-only; the page language is appended at the end of the system prompt and passed to tools/errors.

## Alternatives considered

- _Separate content files per locale_ — duplicates non-text data (dates, URLs, stacks) three times and lets them drift.
- _A headless CMS with localization_ — more infrastructure than a personal site needs.
- _Translating with an LLM at runtime_ — slower, costs money per view, unreviewed quality, bad for SEO.
- _Hand-rolled i18n_ — next-intl already solves detection, routing helpers, ICU messages, rich text and static rendering.

## Consequences

- ✅ One place per fact; translations can't be forgotten (compile error).
- ✅ SEO: real URLs per language with `hreflang`; `<html lang>` correct per page.
- ✅ The assistant's cached prompt prefix is identical for every visitor, whatever their language.
- ⚠️ Content files are ~3× longer. Mitigated by keeping language-neutral fields as plain strings.
- ⚠️ All pages render through the proxy (tiny latency); static HTML is still served from the CDN.

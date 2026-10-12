# Changelog

All notable changes to this project are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses [Semantic Versioning](https://semver.org/).

## [Unreleased]

## [2.0.0] - 2026-10-12

Complete rebuild: modern stack, new design, working AI assistant, updated career information and an automated documentation workflow.

### Added

- **AI assistant v2**: Vercel AI SDK 7 + OpenAI Responses API (`gpt-6-luna` by default, configurable with `OPENAI_MODEL`), long-context grounding on the full knowledge base, prompt caching, tool calling with generative UI (`showProjects`, `showContactCard`), answers in the visitor's language, suggested questions, stop/retry, ⌘K shortcut, conversation kept across navigation and reloads (sessionStorage).
- Guardrails: Zod request validation, `validateUIMessages`, sliding 12-message history window, 1000-char message limit, per-IP (20 / 10 min) and global (2,000 / day) rate limits with Upstash or in-memory fallback, output cap, `store: false`, hashed `safetyIdentifier`, provider error classification with honest messages, sanitized structured logs.
- Eval suite (`npm run eval`, optional LLM-as-judge) and a GitHub workflow to run it.
- Unit tests with Vitest.
- Typed content layer in `src/content/` used by pages, the assistant, `/llms.txt`, JSON-LD and the OG image.
- New design: OKLCH design tokens, refined brand gradient, light/dark themes, responsive header with mobile menu, home sections (ask box, stats, experience timeline, featured projects, tech marquee, "how the assistant works"), project covers, accessible carousel, skip link, reduced-motion support, 404 page.
- SEO: metadata base, canonical URLs, Open Graph image, sitemap, robots, JSON-LD `Person`, `/llms.txt`.
- Vercel Web Analytics and Speed Insights; security headers.
- Developer workflow: Claude Code hooks (Prettier on edit, docs guard on stop), skills (`update-docs`, `update-profile`, `add-project`, `eval-chatbot`, `release`), `docs-auditor` subagent, git pre-commit hook, CI (format, lint, types, tests, build, docs guard), Dependabot, PR template.
- Documentation: README, AGENTS/CLAUDE.md, architecture, chatbot, deployment, content and development guides, ADRs 0001–0004, Spanish AI concepts study guide.

### Changed

- Upgraded Next.js 14 → 16 (Turbopack, React Compiler, async request APIs), React 18 → 19, Tailwind CSS 3 → 4, ESLint 8 → 9 (flat config), AI SDK 3 → 7, Node.js ≥ 22.
- Career content synced with LinkedIn: Software Engineer at JCode Technologies (2025–present), EDAG Group split into internship (2022–2023) and Software Engineer (2023–2024), location Málaga, education details and 18 honors, all certifications, hackathon award, updated skills and languages.
- Contact form is now a Server Action with validation, honeypot spam protection and inline errors (`/api/send-email` removed).
- Project images reorganized under `public/projects/<slug>/`.
- Privacy policy rewritten to describe the chat (OpenAI), rate limiting, analytics and GDPR rights.

### Removed

- LangChain, AstraDB vector store, embedding generation script (`scripts/generate.ts`) and the Upstash response cache — the build no longer needs any external service or secret.
- Unused assets (`background.png`, duplicate favicons).

### Fixed

- The chatbot was returning HTTP 500 in production (dead external services, empty OpenAI balance and a build that depended on them).

## [1.0.0] - 2024-10-20

- First version: Next.js 14 portfolio with a RAG chatbot (LangChain, OpenAI `gpt-3.5-turbo`, AstraDB embeddings, Upstash Redis cache).

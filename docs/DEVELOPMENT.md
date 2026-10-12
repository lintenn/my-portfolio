# Development guide

## Setup

```bash
nvm use            # Node 24 (.nvmrc); ≥ 22 is required
npm install        # installs deps and enables git hooks (core.hooksPath = .githooks)
cp .env.example .env.local
npm run dev
```

## Branching & release flow

- `develop` — integration branch. Every push gets a Vercel **Preview** deployment.
- `main` — production. Only updated through a PR from `develop` (or a hotfix branch).
- Feature work: branch off `develop` (`feat/…`, `fix/…`), open a PR into `develop`.

Release: verify → version `CHANGELOG.md` and `package.json` → PR `develop → main` → merge → Vercel deploys production. The `release` Claude Code skill walks through it.

Commit messages: [Conventional Commits](https://www.conventionalcommits.org) are recommended (`feat(chat): …`, `fix: …`, `docs: …`, `chore(deps): …`).

## Quality gates

| Where                               | What runs                                                                                                                              |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| On every Claude edit                | Prettier on the edited file (`.claude/hooks/format-file.mjs`)                                                                          |
| When Claude stops                   | Docs guard (`.claude/hooks/docs-guard.mjs`) — blocks until required docs are updated                                                   |
| `git commit`                        | `.githooks/pre-commit`: Prettier check + ESLint on staged files, docs guard (warning)                                                  |
| Push / PR (GitHub)                  | `ci.yml`: format check, lint, typecheck, unit tests, build; on PRs also the docs guard (blocking; add the `skip-docs` label to bypass) |
| PR to `main` touching the assistant | `evals.yml`: chatbot evals vs the real model, if the `OPENAI_API_KEY` secret is set                                                    |
| Weekly                              | Dependabot PRs into `develop` (grouped; majors ignored)                                                                                |

Run everything locally with `npm run check && npm run build`.

## The docs guard

`scripts/check-docs.mjs` contains rules of the form _"if files matching X changed, one of docs Y must change too"_ (e.g. `src/lib/ai/**` → `docs/CHATBOT.md`; any functional change → `CHANGELOG.md`). The same script powers the Claude hook, the git hook and CI, so the rules live in one place. When you add a new area of code, add a rule.

```bash
npm run docs:check                          # working tree vs HEAD
node scripts/check-docs.mjs --staged        # what the pre-commit hook checks
node scripts/check-docs.mjs --base origin/main   # what CI checks on a PR
```

## Claude Code setup

Everything is versioned in `.claude/` so it works for anyone who clones the repo:

- **`CLAUDE.md` / `AGENTS.md`** — project context and rules loaded into every session.
- **Hooks** (`.claude/settings.json`): `PostToolUse` → Prettier; `Stop` → docs guard (with `stop_hook_active` loop protection).
- **Permissions**: common read-only/verification commands are pre-approved; `.env*` secrets are denied for reading.
- **Skills** (`.claude/skills/*/SKILL.md`), invoked automatically when relevant or with `/name`:
  - `update-docs` — sync docs with code; the hook points here.
  - `update-profile` — update jobs/education/skills from LinkedIn text or a CV.
  - `add-project` — add a project with images.
  - `eval-chatbot` — run and extend the LLM eval suite.
  - `release` — develop → main release checklist.
- **Subagent** `docs-auditor` — read-only audit of every doc claim against the code.

Personal overrides go in `.claude/settings.local.json` (git-ignored).

## Testing

- **Unit tests** (Vitest, `src/**/*.test.ts`): dates (per locale), request policy, rate limiter, error classification, knowledge base determinism/coverage, cache-friendly prompt prefix across languages, localized tools, translation key parity (en/es/de), content resolution and project ordering.
- **Evals** (`npm run eval`): LLM behavior against the real model — see [CHATBOT.md](CHATBOT.md#evals).
- **Manual/E2E**: `npm run build && npm start`, then check pages in light/dark and mobile. For chat E2E without credits, use a mock OpenAI server via `OPENAI_BASE_URL` (see CHATBOT.md).

## Conventions

- TypeScript strict + `noUncheckedIndexedAccess`. Path alias `@/` → `src/`.
- Server Components by default; add `"use client"` only for interactivity, as low in the tree as possible.
- Styling with Tailwind utilities and the tokens in `globals.css`; compose classes with `cn()`. No inline hex colors except brand icons.
- UI primitives live in `src/components/ui/`; reuse them before creating new ones.
- Accessibility: semantic HTML, labels for inputs, `aria-*` on icon buttons, focus-visible styles, respects `prefers-reduced-motion`.
- Comments explain _why_. Keep functions small and data-driven.

## Internationalization

- UI strings: `src/i18n/messages/{en,es,de}.json` (add the key to all three; a test checks parity). Facts: `src/content` with `{ en, es, de }` objects. See [CONTENT.md](CONTENT.md).
- Always import `Link`, `useRouter`, `usePathname` from `@/i18n/navigation` (they add the `/es`, `/de` prefix), never from `next/link` / `next/navigation`.
- Server code: `getTranslations({ locale, namespace })`; pages get the locale with `localeFromParams(params)` and spread `localizedMetadata(path, locale)` into their metadata.
- Format dates and durations with the helpers in `src/lib/dates.ts` (they use `Intl` with the locale).

## Motion & interaction

- Use `motion/react` for springs, layout animations and gestures; CSS for simple loops. Everything must survive `prefers-reduced-motion` (handled globally by `MotionProvider` and the CSS rule) — never encode information only in motion.
- Hover-only effects: use the `pointer-fine:` Tailwind variant or check `e.pointerType === "mouse"`, so touch devices don't get stuck states.
- Clickable toys (portrait, background ripples) must stay accessible: real `<button>`s with labels; mark decorative interactive areas with `data-no-ripple` where ripples would be noise.

## Dependency upgrades

Minor/patch updates arrive via Dependabot.

**Security advisories.** `npm audit` runs in your head before a release: never apply `npm audit fix --force` blindly (it often proposes downgrades). Prefer `overrides` in `package.json` to force a patched transitive version (current: `postcss-selector-parser` under `@tailwindcss/typography`). Known accepted risk: `braces` (via `eslint-config-next` → `fast-glob`) has no patched release yet; it's dev-only and only processes our own file globs.

**Install scripts.** npm blocks dependency install scripts unless listed in `package.json → allowScripts`. Review a package before adding it there. Major upgrades are deliberate: read the migration guide, upgrade one family at a time (e.g. `ai` + `@ai-sdk/*` together), run `npm run check && npm run build`, run the evals for AI SDK/model changes, and record it in the CHANGELOG (and an ADR if it changes the architecture).

#!/usr/bin/env node
/**
 * Docs guard: "if you changed X, you must also update doc Y".
 *
 * Used in three places so documentation can't silently rot:
 *   - Claude Code `Stop` hook (.claude/hooks/docs-guard.mjs) → Claude must update docs before finishing.
 *   - Git pre-commit hook (.githooks/pre-commit)              → warns you locally.
 *   - GitHub Actions on pull requests (.github/workflows)     → blocks the PR.
 *
 * Usage:
 *   node scripts/check-docs.mjs                 # working tree (+ untracked) vs HEAD
 *   node scripts/check-docs.mjs --staged        # staged changes only
 *   node scripts/check-docs.mjs --base <ref>    # everything since <ref> (CI)
 *   add --json for machine-readable output.
 *
 * Exit code 1 when a required doc was not updated.
 */
import { execSync } from "node:child_process";

/** Ordered rules: when a changed file matches `when`, one of `docs` must change too. */
export const RULES = [
  {
    when: /^(src\/lib\/ai\/|src\/app\/api\/chat\/|src\/components\/chat\/|evals\/|scripts\/eval-chat)/,
    docs: ["docs/CHATBOT.md"],
    why: "chatbot code or evals changed",
  },
  {
    when: /^(\.env\.example|next\.config\.ts|vercel\.json|\.github\/workflows\/)/,
    docs: ["docs/DEPLOYMENT.md"],
    why: "deployment/configuration changed",
  },
  {
    when: /^(\.claude\/|\.githooks\/|scripts\/check-docs|\.github\/(?!workflows)|eslint\.config|\.prettierrc|vitest\.config)/,
    docs: ["docs/DEVELOPMENT.md", "AGENTS.md"],
    why: "developer tooling changed",
  },
  {
    when: /^(src\/content\/(types|index)\.ts|src\/i18n\/[^/]+\.ts$|src\/proxy\.ts|src\/app\/\[locale\]\/([^/]+\/)?page\.tsx$)/,
    docs: ["docs/ARCHITECTURE.md", "docs/CONTENT.md"],
    why: "content model, i18n or routes changed",
  },
  {
    when: /^package\.json$/,
    docs: ["README.md", "docs/ARCHITECTURE.md"],
    why: "dependencies or scripts changed",
  },
  {
    // Any functional change must be recorded in the changelog.
    when: /^(src\/|scripts\/|evals\/|package\.json$|next\.config\.ts$|public\/)/,
    docs: ["CHANGELOG.md"],
    why: "user-visible or functional change",
  },
];

const DOC_FILE = /^(README\.md|CHANGELOG\.md|AGENTS\.md|CLAUDE\.md|docs\/)/;

function git(cmd) {
  try {
    return execSync(`git ${cmd}`, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] })
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
  } catch {
    return [];
  }
}

export function changedFiles(argv = process.argv.slice(2)) {
  if (argv.includes("--staged")) return git("diff --cached --name-only --diff-filter=ACMRD");
  const baseIdx = argv.indexOf("--base");
  if (baseIdx !== -1) return git(`diff --name-only --diff-filter=ACMRD ${argv[baseIdx + 1]}...HEAD`);
  return [
    ...new Set([
      ...git("diff --name-only --diff-filter=ACMRD HEAD"),
      ...git("ls-files --others --exclude-standard"),
    ]),
  ];
}

/** Returns the rules that were triggered but whose docs were not touched. */
export function missingDocs(files) {
  const touchedDocs = new Set(files.filter((f) => DOC_FILE.test(f)));
  const missing = [];
  for (const rule of RULES) {
    const triggers = files.filter((f) => rule.when.test(f) && !DOC_FILE.test(f));
    if (triggers.length === 0) continue;
    if (rule.docs.some((d) => touchedDocs.has(d))) continue;
    missing.push({ docs: rule.docs, why: rule.why, triggers: triggers.slice(0, 5) });
  }
  return missing;
}

const isMain = import.meta.url === `file://${process.argv[1]}`;
if (isMain) {
  const argv = process.argv.slice(2);
  const files = changedFiles(argv);
  const missing = missingDocs(files);

  if (argv.includes("--json")) {
    console.log(JSON.stringify({ files, missing }, null, 2));
  } else if (missing.length === 0) {
    console.log(`✓ Docs guard: documentation is in sync (${files.length} changed files checked).`);
  } else {
    console.log("✗ Docs guard: these changes need a documentation update:\n");
    for (const m of missing) {
      console.log(`  • ${m.why} → update ${m.docs.join(" or ")}`);
      console.log(`      e.g. ${m.triggers.join(", ")}`);
    }
    console.log("\n  Tip: in Claude Code, run the /update-docs skill.");
  }
  process.exit(missing.length ? 1 : 0);
}

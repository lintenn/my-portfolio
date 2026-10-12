#!/usr/bin/env node
/**
 * Claude Code PostToolUse hook: formats every file Claude writes or edits with
 * Prettier, so diffs stay clean without asking. Never blocks: formatting errors
 * are reported but don't fail the tool call.
 */
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { relative } from "node:path";

const FORMATTABLE = /\.(ts|tsx|js|mjs|mts|cjs|json|css|md|ya?ml)$/;

let input = "";
for await (const chunk of process.stdin) input += chunk;

try {
  const { tool_input: toolInput = {}, cwd = process.cwd() } = JSON.parse(input || "{}");
  const file = toolInput.file_path;
  if (!file || !FORMATTABLE.test(file) || !existsSync(file)) process.exit(0);
  if (relative(cwd, file).startsWith("..") || file.includes("node_modules")) process.exit(0);

  execFileSync("npx", ["--no-install", "prettier", "--write", "--log-level", "warn", file], {
    cwd,
    stdio: ["ignore", "ignore", "pipe"],
  });
} catch (error) {
  console.error(`[format-file hook] skipped: ${String(error).slice(0, 200)}`);
}
process.exit(0);

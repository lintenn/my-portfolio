#!/usr/bin/env node
/**
 * Claude Code Stop hook: before Claude ends its turn, check that every code
 * change has its matching documentation update (rules in scripts/check-docs.mjs).
 *
 * If something is missing, we return `{"decision":"block","reason":…}` so Claude
 * keeps working and updates the docs. `stop_hook_active` is true when Claude is
 * already continuing because of this hook: then we let it stop, to avoid loops.
 */
import { changedFiles, missingDocs } from "../../scripts/check-docs.mjs";

let input = "";
for await (const chunk of process.stdin) input += chunk;
const { stop_hook_active: alreadyContinuing } = JSON.parse(input || "{}");

if (alreadyContinuing) process.exit(0);

const missing = missingDocs(changedFiles([]));
if (missing.length === 0) process.exit(0);

const details = missing
  .map((m) => `- ${m.why} (${m.triggers.join(", ")}) → update ${m.docs.join(" or ")}`)
  .join("\n");

console.log(
  JSON.stringify({
    decision: "block",
    reason:
      `Docs guard: code changed but its documentation did not.\n${details}\n\n` +
      "Follow the update-docs skill: update the listed docs (and the [Unreleased] section of CHANGELOG.md) " +
      "so they describe the code as it is now. If a change truly needs no doc update, say why in one sentence.",
  }),
);

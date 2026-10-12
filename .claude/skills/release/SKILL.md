---
name: release
description: Prepare a production release from develop to main (verify, version the changelog, open the PR). Use when asked to release, ship, deploy to production or merge develop into main.
---

# Release develop → main

Deployment is done by **Vercel's Git integration**: every push to `develop` creates a _Preview_ deployment, and every push to `main` (the production branch) deploys to **luismigarcia.com**. So "releasing" = merging `develop` into `main` through a PR.

## Steps

1. **Be on an up-to-date develop with a clean tree**
   ```bash
   git checkout develop && git pull && git status --short
   ```
2. **Verify locally** (the same checks CI runs):
   ```bash
   npm run check && npm run build && node scripts/check-docs.mjs --base origin/main
   ```
   If prompts/model/content changed since the last release, suggest `npm run eval -- --judge` (ask first: it costs money).
3. **Check the Preview deployment** of the latest `develop` commit on Vercel (the bot links it on the commit/PR). Smoke-test: home, /about, /projects, contact form, and one chat question.
4. **Version the changelog**: in `CHANGELOG.md`, rename `## [Unreleased]` to `## [x.y.z] - YYYY-MM-DD` (SemVer: major = breaking/redesign, minor = features, patch = fixes/content) and add a fresh empty `## [Unreleased]` above it. Bump `"version"` in `package.json` to match. Commit: `chore(release): vx.y.z`.
5. **Open the PR** `develop → main` with the changelog section as the body:
   ```bash
   gh pr create --base main --head develop --title "Release vx.y.z" --body-file <(…changelog section…)
   ```
   Don't merge it yourself unless Luis asks; CI (lint, types, tests, build, docs guard) must be green.
6. After merge: `git tag vx.y.z origin/main && git push origin vx.y.z` (only if asked), and confirm the production deployment in Vercel.

Never push directly to `main`, never force-push, and never commit `.env*` files.

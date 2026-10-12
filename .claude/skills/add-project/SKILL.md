---
name: add-project
description: Add or update a portfolio project (data, screenshots, ordering, featured flag). Use when asked to add a project, showcase a repo, or change project images.
---

# Add a project

1. **Gather facts**: title, period, one-paragraph description, challenges, results, stack, GitHub URL, extra links (paper, demo, slides). If the user points to a GitHub repo, read its README to draft them — and ask before inventing results or metrics.
2. **Images** (optional): put them in `public/projects/<slug>/` (`1.png`, `2.png`…). Prefer 16:9, ≤ 1920 px wide, < 500 KB (Next.js serves AVIF/WebP automatically). Without images, a generated brand cover is shown.
3. **Data**: add an object to `src/content/projects.ts` following the `Project` type in `src/content/types.ts`.
   - `slug`: kebab-case, unique, stable (used in `/projects#slug` links and by the chatbot's `showProjects` tool).
   - Array order = display order. `featured: true` also shows it on the home page (keep 4 featured).
4. **Verify**:
   ```bash
   npm run typecheck && npm test
   npm run dev   # check /projects and the home page, light & dark
   ```
   Ask the chatbot "show me your projects with <tech>" to see the new card.
5. **CHANGELOG.md** → `[Unreleased] → Added`: "Project: <title>".

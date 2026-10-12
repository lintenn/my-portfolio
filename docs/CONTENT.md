# Updating content

All personal information is **data** in `src/content/`. Edit it there and every consumer updates automatically: pages, the assistant's knowledge, `/llms.txt`, the Open Graph image, JSON-LD and the sitemap.

| What                                                   | File                               | Type (in `types.ts`)       |
| ------------------------------------------------------ | ---------------------------------- | -------------------------- |
| Name, role, tagline, location, bio, languages, hobbies | `profile.ts`                       | `Profile`                  |
| Jobs                                                   | `experience.ts` → `experience`     | `Experience`               |
| Education (incl. honors list)                          | `experience.ts` → `education`      | `Education`                |
| Certifications                                         | `experience.ts` → `certifications` | `Certification`            |
| Awards                                                 | `experience.ts` → `awards`         | `Award`                    |
| Projects                                               | `projects.ts`                      | `Project`                  |
| Skills                                                 | `skills.ts`                        | `SkillGroup`, `softSkills` |
| Navigation, chat starter questions, site URL           | `site.ts`                          | —                          |

## Conventions

- **English** text (the assistant translates on the fly).
- Dates are `"YYYY-MM"`; omit `end` for the current job. Durations (“1 yr 7 mos”) and “N+ years of experience” are computed — never write them by hand.
- Lists are **most recent first** (except projects, where array order = display order).
- Keep job highlights to 2–5 bullets that start with a verb and state impact.
- Don't publish anything LinkedIn shows only to you or to recruiters (e.g. "open to work").

## Common tasks

**New job.** Set `end` on the previous current job, add the new one at the top of `experience`, and review `profile.tagline`, `profile.summary` and `chatSuggestions` in `site.ts` (they mention the current company).

**New certification or award.** Add it at the top of the corresponding array. `url` is optional for certifications.

**New project.** Add an entry to `projects.ts` and images under `public/projects/<slug>/` (16:9, ≤ 1920 px, < 500 KB). Without images a generated cover is shown. `featured: true` puts it on the home page.

**Profile photo.** Replace `src/assets/luis-photo.jpg` (square, ≥ 800 px).

## After editing

```bash
npm run typecheck && npm test   # tests check every job/project reaches the knowledge base
npm run dev                     # look at /, /about, /projects in light and dark mode
```

Optionally run `npm run eval -- --judge` to confirm the assistant answers with the new facts, and add a line to `CHANGELOG.md`. With Claude Code, the `update-profile` and `add-project` skills do all of this for you — you can paste your LinkedIn text or CV and ask to sync.

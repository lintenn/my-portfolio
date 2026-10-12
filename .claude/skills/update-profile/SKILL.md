---
name: update-profile
description: Update Luis's professional information (jobs, education, skills, certifications, awards, languages, bio) from LinkedIn text, a CV or a description. Use when asked to update experience, add a new job, certification or award, or "sync with my LinkedIn".
---

# Update profile content

All facts live in typed data files under `src/content/`. Pages, the chatbot's knowledge base, `/llms.txt`, the OG image and JSON-LD are all derived from them — **edit only these files**, never hard-code facts in components or prompts.

| Data                                              | File                                                    |
| ------------------------------------------------- | ------------------------------------------------------- |
| Name, headline, location, bio, languages, hobbies | `src/content/profile.ts`                                |
| Jobs, education, certifications, awards           | `src/content/experience.ts`                             |
| Projects                                          | `src/content/projects.ts` (see the `add-project` skill) |
| Skill groups, soft skills                         | `src/content/skills.ts`                                 |
| Chat suggestions, navigation                      | `src/content/site.ts`                                   |

## Rules

1. **Translate to English** (the site is in English; the chatbot answers in the visitor's language on its own).
2. **Never invent** numbers, clients, dates or technologies. If the source is ambiguous, ask.
3. Dates are `"YYYY-MM"`. Omit `end` for the current job. Durations and "years of experience" are computed — don't write them by hand.
4. Lists are ordered **most recent first**.
5. **Privacy**: LinkedIn "Open to work" set to _recruiters only_ must NOT become a public "looking for a job" statement. Keep `profile.availability` neutral unless Luis explicitly says otherwise. Don't publish personal phone numbers or addresses.
6. If the current employer changes, also review `profile.tagline`, `profile.summary` and `chatSuggestions` (they mention the current company).
7. Keep highlights to 2–5 bullets per role, each starting with a verb and stating impact where the source gives it.

## After editing

```bash
npm run typecheck && npm test      # knowledge-base tests check every job/project is included
npm run eval -- --judge            # optional, costs a few cents: verify the chatbot answers correctly
```

Then add a `CHANGELOG.md` entry under `[Unreleased] → Changed` (e.g. "Content: new role at …"). Check `/about` visually with `npm run dev`.

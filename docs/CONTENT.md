# Updating content

The site is available in **English, Spanish and German**. There are two kinds of text:

| Kind                                                                 | Where                               | Format                              |
| -------------------------------------------------------------------- | ----------------------------------- | ----------------------------------- |
| **Facts** about Luis (jobs, projects, skills, bio…)                  | `src/content/*.ts`                  | Typed data with inline translations |
| **Interface copy** (buttons, headings, labels, errors, privacy text) | `src/i18n/messages/{en,es,de}.json` | next-intl message catalogues        |

Edit them there and every consumer updates automatically: pages, the assistant's knowledge, `/llms.txt`, Open Graph images, JSON-LD and the sitemap.

## Content files

| What                                                              | File                               | Type (in `types.ts`)       |
| ----------------------------------------------------------------- | ---------------------------------- | -------------------------- |
| Name, role, tagline, location, bio, languages, hobbies, fun facts | `profile.ts`                       | `Profile`                  |
| Jobs                                                              | `experience.ts` → `experience`     | `Experience`               |
| Education (incl. honors list)                                     | `experience.ts` → `education`      | `Education`                |
| Certifications                                                    | `experience.ts` → `certifications` | `Certification`            |
| Awards                                                            | `experience.ts` → `awards`         | `Award`                    |
| Projects                                                          | `projects.ts`                      | `Project`                  |
| Skills                                                            | `skills.ts`                        | `SkillGroup`, `softSkills` |
| Navigation, chat starter questions, site URL & description        | `site.ts`                          | —                          |

### Translated fields

A text field is either:

```ts
title: "Smart Space Journey",                                   // same in every language
role: { en: "Software Engineer", es: "Ingeniero de Software", de: "Softwareentwickler" }, // translated
```

The types say which fields must be translated (`L`) and which may be either (`Text`). TypeScript fails the build if a translation is missing. Components never see these objects: they call `getContent(locale)`, which returns plain strings.

## Conventions

- Write the English version first; translate naturally (not word for word). Spanish uses Spain conventions; German uses the informal "du" in UI copy.
- Dates are `"YYYY-MM"`; omit `end` for the current job. Durations (“1 año y 7 meses”) and “N+ years of experience” are computed — never write them by hand.
- Jobs, certifications and awards are listed **most recent first**. Projects are **sorted automatically** newest first using `start`/`end` years (omit `end` for ongoing projects).
- Keep job highlights to 2–5 bullets that start with a verb and state impact.
- Don't publish anything LinkedIn shows only to you or to recruiters (e.g. "open to work"). Language levels describe real ability (German: intermediate) rather than the oldest certificate.

## Common tasks

**New job.** Set `end` on the previous current job, add the new one at the top of `experience` (all text fields in three languages), and review `profile.tagline`, `profile.summary` and `chatSuggestions` in `site.ts` (they mention the current company).

**New certification or award.** Add it at the top of the corresponding array. `url` is optional.

**New project.** Add an entry to `projects.ts` and images under `public/projects/<slug>/`. Any aspect ratio works (images are shown uncropped over a blurred fill); keep them ≤ 1920 px and < 500 KB. Without images a generated cover is shown. `featured: true` puts it on the home page.

**New UI text.** Add the key to `en.json`, then the same key to `es.json` and `de.json` (a unit test fails if the key sets differ). Use it with `useTranslations("Namespace")` (client or server component) or `getTranslations({ locale, namespace })` (async server code).

**Profile photo.** Replace `src/assets/luis-photo.jpg` (square, ≥ 800 px).

**Add a language** (e.g. French): add it to `locales` in `src/i18n/routing.ts` and `localeNames`, create `messages/fr.json`, then let TypeScript guide you — every `L` object will demand an `fr` translation. Add it to `LANGUAGE_NAMES` in `src/lib/ai/prompt.ts`, `PRESENT` in `src/lib/ai/tools.ts` and `OG_LOCALES` in `src/i18n/server.ts`.

## After editing

```bash
npm run typecheck && npm test   # missing translations, message keys, knowledge-base coverage, project order
npm run dev                     # look at /, /es, /de in light and dark mode
```

Optionally run `npm run eval -- --judge` to confirm the assistant answers with the new facts, and add a line to `CHANGELOG.md`. With Claude Code, the `update-profile` and `add-project` skills do all of this for you — you can paste your LinkedIn text or CV and ask to sync.

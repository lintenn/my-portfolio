import { Award, BadgeCheck, ExternalLink, GraduationCap, Heart, Languages } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import LuisPhoto from "@/assets/luis-photo.jpg";
import { ExperienceTimeline } from "@/components/about/experience-timeline";
import { Reveal } from "@/components/motion/reveal";
import { SpotlightCard } from "@/components/motion/spotlight-card";
import { Badge, Container, SectionHeading } from "@/components/ui/primitives";
import { getContent } from "@/content";
import { localeFromParams, localizedMetadata } from "@/i18n/server";
import { formatYearMonth } from "@/lib/dates";

export async function generateMetadata({ params }: PageProps<"/[locale]/about">): Promise<Metadata> {
  const locale = await localeFromParams(params);
  const t = await getTranslations({ locale, namespace: "About" });
  const { profile } = getContent(locale);
  return {
    title: t("eyebrow"),
    description: t("metaDescription", { name: profile.name }),
    ...localizedMetadata("/about", locale),
  };
}

export const revalidate = 86400;

export default async function AboutPage({ params }: PageProps<"/[locale]/about">) {
  const locale = await localeFromParams(params);
  const t = await getTranslations({ locale, namespace: "About" });
  const { profile, skillGroups, softSkills, education, awards, certifications } = getContent(locale);

  return (
    <Container className="space-y-28 pt-10 sm:pt-16">
      {/* Intro */}
      <section className="grid items-start gap-12 md:grid-cols-[1.6fr_1fr]">
        <div className="animate-fade-up space-y-6">
          <SectionHeading as="h1" eyebrow={t("eyebrow")} title={t("title")} />
          <div className="space-y-4 text-lg text-pretty text-muted-foreground">
            {profile.summary.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <p className="rounded-2xl border-l-4 border-primary bg-accent/60 px-4 py-3 text-sm backdrop-blur">
            {profile.availability}
          </p>
        </div>
        <div className="group relative mx-auto w-full max-w-xs animate-fade-up [animation-delay:150ms]">
          <div
            aria-hidden
            className="absolute -inset-3 rotate-3 rounded-[2rem] bg-brand-gradient opacity-30 blur-xl transition-all duration-500 group-hover:rotate-6 group-hover:opacity-60"
          />
          <Image
            src={LuisPhoto}
            alt={t("photoAlt", { name: profile.name })}
            placeholder="blur"
            sizes="(min-width: 768px) 33vw, 100vw"
            className="relative aspect-square w-full -rotate-2 rounded-[2rem] border-4 border-background object-cover shadow-2xl transition-transform duration-500 group-hover:scale-[1.02] group-hover:rotate-0"
          />
        </div>
      </section>

      {/* Experience */}
      <section className="space-y-10">
        <Reveal>
          <SectionHeading eyebrow={t("careerEyebrow")} title={t("experience")} />
        </Reveal>
        <ExperienceTimeline locale={locale} />
      </section>

      {/* Skills */}
      <section className="space-y-10">
        <Reveal>
          <SectionHeading eyebrow={t("skillsEyebrow")} title={t("skills")} />
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((group, i) => (
            <Reveal key={group.name} delay={(i % 3) * 0.06}>
              <SpotlightCard className="h-full p-5">
                <h3 className="mb-3 font-semibold">{group.name}</h3>
                <ul className="flex flex-wrap gap-1.5">
                  {group.skills.map((s) => (
                    <li key={s}>
                      <Badge className="transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:text-foreground">
                        {s}
                      </Badge>
                    </li>
                  ))}
                </ul>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <ul className="flex flex-wrap gap-2" aria-label={t("softSkills")}>
            {softSkills.map((s) => (
              <li
                key={s}
                className="cursor-default rounded-full bg-accent px-3 py-1 text-sm text-accent-foreground transition-transform hover:scale-105 hover:-rotate-2"
              >
                {s}
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      {/* Education + awards */}
      <section className="grid gap-12 lg:grid-cols-2">
        <div className="space-y-6">
          <Reveal>
            <h2 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
              <GraduationCap className="text-primary" /> {t("education")}
            </h2>
          </Reveal>
          {education.map((edu, i) => (
            <Reveal key={edu.institution} delay={i * 0.08}>
              <SpotlightCard className="space-y-2 p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-semibold">{edu.degree}</h3>
                  <span className="font-mono text-xs text-muted-foreground">
                    {edu.start} – {edu.end}
                  </span>
                </div>
                <p className="mt-1 text-gradient text-sm font-medium">{edu.institution}</p>
                {edu.details && <p className="mt-2 text-sm">{edu.details}</p>}
                {edu.highlights && (
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground marker:text-primary">
                    {edu.highlights.map((h) => (
                      <li key={h}>{h}</li>
                    ))}
                  </ul>
                )}
                {edu.honors && (
                  <div className="space-y-2 pt-3">
                    <p className="text-xs font-medium text-muted-foreground">
                      {t("honorsIntro", { count: edu.honors.length })}
                    </p>
                    <ul className="flex flex-wrap gap-1.5">
                      {edu.honors.map((h) => (
                        <li key={h}>
                          <Badge className="text-[11px]">{h}</Badge>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </SpotlightCard>
            </Reveal>
          ))}
        </div>

        <div className="space-y-6">
          <Reveal>
            <h2 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
              <Award className="text-primary" /> {t("awards")}
            </h2>
          </Reveal>
          {awards.map((a, i) => (
            <Reveal key={a.title} delay={i * 0.08}>
              <SpotlightCard className="space-y-2 p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-semibold">{a.title}</h3>
                  <span className="font-mono text-xs text-muted-foreground">
                    {formatYearMonth(a.date, locale)}
                  </span>
                </div>
                <p className="mt-1 text-gradient text-sm font-medium">{a.issuer}</p>
                <p className="mt-2 text-sm text-muted-foreground">{a.description}</p>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Certifications */}
      <section className="space-y-6">
        <Reveal>
          <h2 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
            <BadgeCheck className="text-primary" /> {t("certifications")}
          </h2>
        </Reveal>
        <ul className="grid gap-3 sm:grid-cols-2">
          {certifications.map((c, i) => (
            <li key={c.name}>
              <Reveal delay={(i % 2) * 0.06} className="h-full">
                <SpotlightCard className="h-full p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium">{c.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {c.issuer} · {formatYearMonth(c.date, locale)}
                      </p>
                    </div>
                    {c.url && (
                      <a
                        href={c.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={t("viewCredential", { name: c.name })}
                        className="grid size-8 shrink-0 place-items-center rounded-full border transition-all hover:rotate-12 hover:bg-accent"
                      >
                        <ExternalLink className="size-3.5" />
                      </a>
                    )}
                  </div>
                </SpotlightCard>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      {/* Languages + hobbies */}
      <section className="grid gap-12 lg:grid-cols-2">
        <Reveal className="space-y-6">
          <h2 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
            <Languages className="text-primary" /> {t("languages")}
          </h2>
          <ul className="space-y-3">
            {profile.languages.map((l) => (
              <li key={l.name} className="flex items-baseline justify-between gap-4 border-b pb-3">
                <span className="font-medium">{l.name}</span>
                <span className="text-right text-sm text-muted-foreground">{l.level}</span>
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={0.08} className="space-y-6">
          <h2 className="group flex items-center gap-2 text-2xl font-semibold tracking-tight">
            <Heart className="text-primary transition-transform group-hover:scale-125 group-hover:fill-current" />{" "}
            {t("hobbies")}
          </h2>
          <p className="text-pretty text-muted-foreground">{profile.hobbies}</p>
        </Reveal>
      </section>
    </Container>
  );
}

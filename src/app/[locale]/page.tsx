import {
  ArrowRight,
  Database,
  Gauge,
  MapPin,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  Wrench,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import LuisPhoto from "@/assets/luis-photo.jpg";
import { ExperienceTimeline } from "@/components/about/experience-timeline";
import { AskBox } from "@/components/home/ask-box";
import { InteractivePortrait } from "@/components/home/interactive-portrait";
import { RotatingRoles } from "@/components/home/rotating-roles";
import { TechMarquee } from "@/components/home/tech-marquee";
import { SocialLinks } from "@/components/layout/social-links";
import { CountUp } from "@/components/motion/count-up";
import { Magnetic } from "@/components/motion/magnetic";
import { Reveal } from "@/components/motion/reveal";
import { SpotlightCard } from "@/components/motion/spotlight-card";
import { ProjectCover } from "@/components/projects/project-cover";
import { ButtonLink } from "@/components/ui/button";
import { Badge, Container, SectionHeading } from "@/components/ui/primitives";
import { getContent, site } from "@/content";
import { Link } from "@/i18n/navigation";
import { localeFromParams } from "@/i18n/server";
import { formatYearRange, yearsOfExperience } from "@/lib/dates";

// Re-render daily so computed values (years of experience, durations) stay fresh.
export const revalidate = 86400;

const HOW_IT_WORKS = [
  { key: "source", icon: Database },
  { key: "context", icon: MessageSquareText },
  { key: "caching", icon: Gauge },
  { key: "tools", icon: Wrench },
  { key: "guardrails", icon: ShieldCheck },
  { key: "evals", icon: Sparkles },
] as const;

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const locale = await localeFromParams(params);
  const t = await getTranslations({ locale, namespace: "Home" });
  const tc = await getTranslations({ locale, namespace: "Common" });
  const { profile, experience, projects, certifications, education, awards, chatSuggestions } =
    getContent(locale);

  const current = experience.find((e) => !e.end);
  const featured = projects.filter((p) => p.featured);
  const years = yearsOfExperience(profile.careerStart);
  const honors = education.reduce((n, e) => n + (e.honors?.length ?? 0), 0);

  const stats = [
    { value: years, suffix: "+", label: t("stats.years") },
    { value: projects.length, label: t("stats.projects") },
    { value: honors, label: t("stats.honors") },
    { value: certifications.length, label: t("stats.certifications") },
  ];

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="pt-10 pb-20 sm:pt-16">
        <Container className="grid items-center gap-14 md:grid-cols-[1.4fr_1fr]">
          <div className="animate-fade-up space-y-6">
            {current && (
              <Badge className="gap-2 bg-card py-1 pr-3 text-sm backdrop-blur">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-60" />
                  <span className="relative inline-flex size-2 rounded-full bg-success" />
                </span>
                {current.role} @ {current.company}
              </Badge>
            )}
            <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
              <span className="group inline-flex items-center gap-3">
                {t("greeting")}
                <span
                  aria-hidden
                  className="inline-block origin-[70%_70%] animate-wave cursor-default group-hover:[animation-duration:0.8s]"
                >
                  👋
                </span>
              </span>
              <br />
              <span className="text-gradient">{profile.name}</span>
            </h1>
            <p className="text-xl font-medium sm:text-2xl">
              <RotatingRoles roles={t.raw("roles") as string[]} />
            </p>
            <p className="max-w-xl text-lg text-pretty text-muted-foreground">{profile.tagline}</p>
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="size-4" />
              {profile.location}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Magnetic>
                <ButtonLink href="/projects" size="lg">
                  {t("ctaWork")}
                  <ArrowRight />
                </ButtonLink>
              </Magnetic>
              <Magnetic>
                <ButtonLink href="/about" size="lg" variant="secondary">
                  {t("ctaAbout")}
                </ButtonLink>
              </Magnetic>
              <SocialLinks className="ml-1" />
            </div>
          </div>

          <div className="animate-fade-up [animation-delay:150ms]">
            <InteractivePortrait
              photo={LuisPhoto}
              alt={t("photoAlt", { name: profile.name })}
              facts={profile.funFacts}
              hint={t("photoHint")}
              easterEgg={t("easterEgg")}
              easterEggCta={t("easterEggCta")}
            />
          </div>
        </Container>
      </section>

      {/* ── Ask the AI ───────────────────────────────────────── */}
      <section className="pb-24">
        <Container className="space-y-8 text-center">
          <Reveal>
            <SectionHeading
              eyebrow={t("ask.eyebrow")}
              title={t("ask.title")}
              description={t("ask.description")}
              className="mx-auto"
            />
          </Reveal>
          <Reveal delay={0.1}>
            <AskBox
              suggestions={chatSuggestions}
              label={t("ask.label")}
              placeholder={t("ask.placeholder")}
              submitLabel={t("ask.submit")}
            />
          </Reveal>
        </Container>
      </section>

      {/* ── Stats ────────────────────────────────────────────── */}
      <section className="pb-24">
        <Container>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.06}>
                <SpotlightCard className="h-full p-6">
                  <p className="text-gradient text-4xl font-semibold tracking-tight sm:text-5xl">
                    <CountUp value={s.value} suffix={s.suffix} />
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
                </SpotlightCard>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Experience ───────────────────────────────────────── */}
      <section className="pb-24">
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.6fr]">
          <Reveal className="space-y-6">
            <SectionHeading
              eyebrow={t("experience.eyebrow")}
              title={t("experience.title")}
              description={t("experience.description", { years })}
            />
            <ButtonLink href="/about" variant="secondary">
              {t("experience.cta")}
              <ArrowRight />
            </ButtonLink>
            {awards[0] && (
              <SpotlightCard className="p-5">
                <p className="text-sm font-medium">
                  <span className="mr-1 inline-block transition-transform hover:scale-125 hover:rotate-12">
                    🏆
                  </span>
                  {awards[0].title}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{awards[0].issuer}</p>
              </SpotlightCard>
            )}
          </Reveal>
          <ExperienceTimeline locale={locale} compact />
        </Container>
      </section>

      {/* ── Featured projects ────────────────────────────────── */}
      <section className="pb-24">
        <Container className="space-y-10">
          <Reveal className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading eyebrow={t("projects.eyebrow")} title={t("projects.title")} />
            <ButtonLink href="/projects" variant="secondary">
              {t("projects.cta")}
              <ArrowRight />
            </ButtonLink>
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2">
            {featured.map((p, i) => {
              const period = formatYearRange(p.start, p.end, tc("present"));
              return (
                <Reveal key={p.slug} delay={(i % 2) * 0.08}>
                  <Link href={`/projects#${p.slug}`} className="block h-full rounded-2xl">
                    <SpotlightCard className="flex h-full flex-col overflow-hidden">
                      <div className="relative aspect-[2/1] overflow-hidden rounded-t-2xl bg-muted">
                        {p.images[0] ? (
                          <>
                            <Image
                              src={p.images[0]}
                              alt=""
                              fill
                              sizes="40px"
                              className="scale-110 object-cover opacity-60 blur-2xl"
                            />
                            <Image
                              src={p.images[0]}
                              alt=""
                              fill
                              sizes="(min-width: 640px) 50vw, 100vw"
                              className="object-contain transition-transform duration-700 group-hover/spot:scale-105"
                            />
                          </>
                        ) : (
                          <ProjectCover
                            title={p.title}
                            period={period}
                            stack={p.stack}
                            className="transition-transform duration-700 group-hover/spot:scale-105"
                          />
                        )}
                      </div>
                      <div className="flex flex-1 flex-col gap-2 p-5">
                        <div className="flex items-baseline justify-between gap-2">
                          <h3 className="font-semibold">{p.title}</h3>
                          <span className="shrink-0 font-mono text-xs text-muted-foreground">{period}</span>
                        </div>
                        <p className="line-clamp-2 text-sm text-muted-foreground">{p.description}</p>
                        <p className="mt-auto flex items-center justify-between pt-2 font-mono text-xs text-muted-foreground/80">
                          {p.stack.slice(0, 4).join(" · ")}
                          <ArrowRight className="size-4 -translate-x-2 opacity-0 transition-all duration-300 group-hover/spot:translate-x-0 group-hover/spot:opacity-100" />
                        </p>
                      </div>
                    </SpotlightCard>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ── Tech marquee ─────────────────────────────────────── */}
      <div className="pb-24">
        <TechMarquee label={t("marquee")} />
      </div>

      {/* ── How the assistant works ──────────────────────────── */}
      <section>
        <Container className="space-y-10">
          <Reveal>
            <SectionHeading
              eyebrow={t("how.eyebrow")}
              title={t("how.title")}
              description={t("how.description")}
            />
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {HOW_IT_WORKS.map(({ key, icon: Icon }, i) => (
              <Reveal key={key} delay={(i % 3) * 0.06}>
                <SpotlightCard className="h-full space-y-3 p-6">
                  <div className="grid size-10 place-items-center rounded-xl bg-accent text-accent-foreground transition-transform duration-300 group-hover/spot:scale-110 group-hover/spot:rotate-6">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="mt-3 font-semibold">{t(`how.items.${key}.title`)}</h3>
                  <p className="mt-2 text-sm text-pretty text-muted-foreground">
                    {t(`how.items.${key}.body`)}
                  </p>
                </SpotlightCard>
              </Reveal>
            ))}
          </div>
          <ButtonLink href={site.repo} variant="secondary">
            {t("how.cta")}
            <ArrowRight />
          </ButtonLink>
        </Container>
      </section>
    </>
  );
}

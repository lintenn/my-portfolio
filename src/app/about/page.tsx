import { Award, BadgeCheck, ExternalLink, GraduationCap, Heart, Languages } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import LuisPhoto from "@/assets/luis-photo.jpg";
import { ExperienceTimeline } from "@/components/about/experience-timeline";
import { Badge, Card, Container, SectionHeading } from "@/components/ui/primitives";
import { awards, certifications, education, profile, skillGroups, softSkills } from "@/content";
import { formatYearMonth } from "@/lib/dates";

export const metadata: Metadata = {
  title: "About",
  description: `Experience, education, skills and certifications of ${profile.name}.`,
  alternates: { canonical: "/about" },
};

export const revalidate = 86400;

export default function AboutPage() {
  return (
    <Container className="space-y-24 pt-14 sm:pt-20">
      {/* Intro */}
      <section className="grid items-start gap-10 md:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6">
          <SectionHeading as="h1" eyebrow="About me" title="Engineer, builder, lifelong learner" />
          <div className="space-y-4 text-lg text-pretty text-muted-foreground">
            {profile.summary.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <p className="rounded-xl border-l-4 border-primary bg-accent/50 px-4 py-3 text-sm">
            {profile.availability}
          </p>
        </div>
        <Image
          src={LuisPhoto}
          alt={`Portrait of ${profile.name}`}
          placeholder="blur"
          sizes="(min-width: 768px) 33vw, 100vw"
          className="mx-auto aspect-square w-full max-w-xs rounded-3xl border object-cover shadow-xl"
        />
      </section>

      {/* Experience */}
      <section className="space-y-10">
        <SectionHeading eyebrow="Career" title="Experience" />
        <ExperienceTimeline />
      </section>

      {/* Skills */}
      <section className="space-y-10">
        <SectionHeading eyebrow="Toolbox" title="Skills" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((group) => (
            <Card key={group.name} className="space-y-3 p-5">
              <h3 className="font-semibold">{group.name}</h3>
              <ul className="flex flex-wrap gap-1.5">
                {group.skills.map((s) => (
                  <li key={s}>
                    <Badge>{s}</Badge>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
        <ul className="flex flex-wrap gap-2" aria-label="Soft skills">
          {softSkills.map((s) => (
            <li key={s} className="rounded-full bg-accent px-3 py-1 text-sm text-accent-foreground">
              {s}
            </li>
          ))}
        </ul>
      </section>

      {/* Education + awards */}
      <section className="grid gap-12 lg:grid-cols-2">
        <div className="space-y-6">
          <h2 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
            <GraduationCap className="text-primary" /> Education
          </h2>
          {education.map((edu) => (
            <Card key={edu.institution} className="space-y-2 p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-semibold">{edu.degree}</h3>
                <span className="font-mono text-xs text-muted-foreground">
                  {edu.start} – {edu.end}
                </span>
              </div>
              <p className="text-gradient text-sm font-medium">{edu.institution}</p>
              {edu.details && <p className="text-sm">{edu.details}</p>}
              {edu.highlights && (
                <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground marker:text-primary">
                  {edu.highlights.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
              )}
              {edu.honors && (
                <div className="space-y-2 pt-2">
                  <p className="text-xs font-medium text-muted-foreground">
                    Highest distinction (Matrícula de Honor) in {edu.honors.length} courses:
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
            </Card>
          ))}
        </div>

        <div className="space-y-6">
          <h2 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
            <Award className="text-primary" /> Awards
          </h2>
          {awards.map((a) => (
            <Card key={a.title} className="space-y-2 p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-semibold">{a.title}</h3>
                <span className="font-mono text-xs text-muted-foreground">{formatYearMonth(a.date)}</span>
              </div>
              <p className="text-gradient text-sm font-medium">{a.issuer}</p>
              <p className="text-sm text-muted-foreground">{a.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Certifications */}
      <section className="space-y-6">
        <h2 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
          <BadgeCheck className="text-primary" /> Certifications
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {certifications.map((c) => (
            <li key={c.name}>
              <Card className="flex h-full items-start justify-between gap-4 p-4">
                <div>
                  <p className="font-medium">{c.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {c.issuer} · {formatYearMonth(c.date)}
                  </p>
                </div>
                {c.url && (
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View credential: ${c.name}`}
                    className="grid size-8 shrink-0 place-items-center rounded-full border transition-colors hover:bg-accent"
                  >
                    <ExternalLink className="size-3.5" />
                  </a>
                )}
              </Card>
            </li>
          ))}
        </ul>
      </section>

      {/* Languages + hobbies */}
      <section className="grid gap-12 lg:grid-cols-2">
        <div className="space-y-6">
          <h2 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
            <Languages className="text-primary" /> Languages
          </h2>
          <ul className="space-y-3">
            {profile.languages.map((l) => (
              <li key={l.name} className="flex items-baseline justify-between gap-4 border-b pb-3">
                <span className="font-medium">{l.name}</span>
                <span className="text-right text-sm text-muted-foreground">{l.level}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-6">
          <h2 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
            <Heart className="text-primary" /> Beyond the keyboard
          </h2>
          <p className="text-pretty text-muted-foreground">{profile.hobbies}</p>
        </div>
      </section>
    </Container>
  );
}

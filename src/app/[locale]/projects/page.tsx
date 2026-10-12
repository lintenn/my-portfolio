import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/motion/reveal";
import { ProjectCard } from "@/components/projects/project-card";
import { ButtonLink } from "@/components/ui/button";
import { Container, SectionHeading } from "@/components/ui/primitives";
import { getContent } from "@/content";
import { localeFromParams, localizedMetadata } from "@/i18n/server";
import { formatYearRange } from "@/lib/dates";

export async function generateMetadata({ params }: PageProps<"/[locale]/projects">): Promise<Metadata> {
  const locale = await localeFromParams(params);
  const t = await getTranslations({ locale, namespace: "Projects" });
  const { profile } = getContent(locale);
  return {
    title: t("eyebrow"),
    description: t("metaDescription", { name: profile.name }),
    ...localizedMetadata("/projects", locale),
  };
}

export default async function ProjectsPage({ params }: PageProps<"/[locale]/projects">) {
  const locale = await localeFromParams(params);
  const t = await getTranslations({ locale, namespace: "Projects" });
  const tc = await getTranslations({ locale, namespace: "Common" });
  const { projects, profile } = getContent(locale);

  return (
    <Container className="space-y-12 pt-10 sm:pt-16">
      <div className="animate-fade-up">
        <SectionHeading as="h1" eyebrow={t("eyebrow")} title={t("title")} description={t("description")} />
      </div>
      {/* Newest first (see sortProjects in src/content/projects.ts). */}
      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((project, i) => (
          <Reveal key={project.slug} delay={(i % 2) * 0.08} className="h-full">
            <ProjectCard
              project={project}
              period={formatYearRange(project.start, project.end, tc("present"))}
              priority={i < 2}
            />
          </Reveal>
        ))}
      </div>
      <div className="flex justify-center">
        <ButtonLink href={profile.socials.github} variant="secondary">
          {t("moreOnGithub")}
          <ArrowRight />
        </ButtonLink>
      </div>
    </Container>
  );
}

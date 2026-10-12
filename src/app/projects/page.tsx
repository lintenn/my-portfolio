import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { ProjectCard } from "@/components/projects/project-card";
import { ButtonLink } from "@/components/ui/button";
import { Container, SectionHeading } from "@/components/ui/primitives";
import { profile, projects } from "@/content";

export const metadata: Metadata = {
  title: "Projects",
  description: `AI, computer vision, web and mobile projects by ${profile.name}.`,
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  return (
    <Container className="space-y-12 pt-14 sm:pt-20">
      <SectionHeading
        as="h1"
        eyebrow="Projects"
        title="Things I've built"
        description="A mix of AI research, products and hackathon work. Most of my professional work is under NDA — ask the assistant about it for a summary."
      />
      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((project, i) => (
          <ProjectCard key={project.slug} project={project} priority={i < 2} />
        ))}
      </div>
      <div className="flex justify-center">
        <ButtonLink href={profile.socials.github} variant="secondary">
          More on GitHub
          <ArrowRight />
        </ButtonLink>
      </div>
    </Container>
  );
}

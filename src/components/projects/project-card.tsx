"use client";

import { ChevronLeft, ChevronRight, ExternalLink, Sparkles } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { SiGithub } from "react-icons/si";
import { useChatWidget } from "@/components/chat/chat-provider";
import { Badge, Card } from "@/components/ui/primitives";
import type { Project } from "@/content/types";
import { cn } from "@/lib/utils";
import { ProjectCover } from "./project-cover";

export function ProjectCard({ project, priority = false }: { project: Project; priority?: boolean }) {
  const [index, setIndex] = useState(0);
  const { ask } = useChatWidget();
  const { images } = project;
  const go = (delta: number) => setIndex((i) => (i + delta + images.length) % images.length);

  return (
    <Card id={project.slug} className="group flex scroll-mt-24 flex-col overflow-hidden">
      <div
        className="relative aspect-video overflow-hidden border-b bg-brand-gradient"
        role={images.length > 1 ? "region" : undefined}
        aria-roledescription={images.length > 1 ? "carousel" : undefined}
        aria-label={images.length > 1 ? `${project.title} screenshots` : undefined}
      >
        {images.length > 0 ? (
          <Image
            key={images[index]}
            src={images[index]!}
            alt={`${project.title} — screenshot ${index + 1} of ${images.length}`}
            fill
            priority={priority}
            sizes="(min-width: 768px) 50vw, 100vw"
            className="animate-fade-up object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
        ) : (
          <ProjectCover project={project} />
        )}
        {images.length > 1 && (
          <>
            <CarouselButton side="left" onClick={() => go(-1)} label="Previous screenshot" />
            <CarouselButton side="right" onClick={() => go(1)} label="Next screenshot" />
            <div className="absolute inset-x-0 bottom-2 flex justify-center gap-1.5">
              {images.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Show screenshot ${i + 1}`}
                  aria-current={i === index}
                  className={cn(
                    "h-1.5 rounded-full bg-white/60 transition-all",
                    i === index ? "w-5 bg-white" : "w-1.5 hover:bg-white/90",
                  )}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold tracking-tight">{project.title}</h3>
            <p className="font-mono text-xs text-muted-foreground">{project.period}</p>
          </div>
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title} source code on GitHub`}
              title="Source code"
              className="grid size-9 shrink-0 place-items-center rounded-full border transition-colors hover:bg-accent"
            >
              <SiGithub className="size-4" />
            </a>
          )}
        </div>

        <p className="text-pretty">{project.description}</p>

        <dl className="space-y-3 text-sm">
          <div>
            <dt className="font-medium">Challenges</dt>
            <dd className="text-pretty text-muted-foreground">{project.challenges}</dd>
          </div>
          <div>
            <dt className="font-medium">Results</dt>
            <dd className="text-pretty text-muted-foreground">{project.results}</dd>
          </div>
        </dl>

        <ul className="flex flex-wrap gap-1.5" aria-label="Technologies">
          {project.stack.map((s) => (
            <li key={s}>
              <Badge>{s}</Badge>
            </li>
          ))}
        </ul>

        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-2 text-sm">
          {project.links?.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
            >
              {link.label}
              <ExternalLink className="size-3.5" />
            </a>
          ))}
          <button
            type="button"
            onClick={() => ask(`Tell me more about the ${project.title} project`)}
            className="inline-flex items-center gap-1 font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <Sparkles className="size-3.5" />
            Ask the AI about it
          </button>
        </div>
      </div>
    </Card>
  );
}

function CarouselButton({
  side,
  onClick,
  label,
}: {
  side: "left" | "right";
  onClick: () => void;
  label: string;
}) {
  const Icon = side === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        "absolute top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full bg-black/50 text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 focus-visible:opacity-100 max-sm:opacity-100",
        side === "left" ? "left-3" : "right-3",
      )}
    >
      <Icon className="size-5" />
    </button>
  );
}

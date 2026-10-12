"use client";

import { ChevronLeft, ChevronRight, ExternalLink, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { SiGithub } from "react-icons/si";
import { useChatWidget } from "@/components/chat/chat-provider";
import { SpotlightCard } from "@/components/motion/spotlight-card";
import { Badge } from "@/components/ui/primitives";
import type { ProjectContent } from "@/content";
import { cn } from "@/lib/utils";
import { ProjectCover } from "./project-cover";

export function ProjectCard({
  project,
  period,
  priority = false,
}: {
  project: ProjectContent;
  period: string;
  priority?: boolean;
}) {
  const t = useTranslations("Projects");
  const { ask } = useChatWidget();
  const [[index, direction], setSlide] = useState<[number, number]>([0, 0]);
  const swipeStart = useRef<number | null>(null);
  const { images } = project;
  const many = images.length > 1;

  const go = (delta: number) => setSlide(([i]) => [(i + delta + images.length) % images.length, delta]);

  const onPointerDown = (e: PointerEvent) => {
    swipeStart.current = e.clientX;
  };
  const onPointerUp = (e: PointerEvent) => {
    if (swipeStart.current === null || !many) return;
    const dx = e.clientX - swipeStart.current;
    swipeStart.current = null;
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
  };
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") go(1);
    if (e.key === "ArrowLeft") go(-1);
  };

  return (
    <SpotlightCard id={project.slug} className="flex scroll-mt-28 flex-col overflow-hidden">
      <div
        className="relative aspect-video touch-pan-y overflow-hidden rounded-t-2xl border-b bg-muted select-none"
        role={many ? "region" : undefined}
        aria-roledescription={many ? "carousel" : undefined}
        aria-label={many ? t("carousel", { title: project.title }) : undefined}
        tabIndex={many ? 0 : undefined}
        onKeyDown={many ? onKeyDown : undefined}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        data-no-ripple
      >
        {images.length > 0 ? (
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={images[index]}
              custom={direction}
              initial={{ opacity: 0, x: direction * 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -60 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              {/* Blurred fill so images of any aspect ratio are shown whole, without bars. */}
              <Image
                src={images[index]!}
                alt=""
                fill
                sizes="40px"
                className="scale-110 object-cover opacity-60 blur-2xl"
              />
              <Image
                src={images[index]!}
                alt={t("imageAlt", { title: project.title, n: index + 1, total: images.length })}
                fill
                priority={priority && index === 0}
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-contain transition-transform duration-700 group-hover/spot:scale-[1.03]"
                draggable={false}
              />
            </motion.div>
          </AnimatePresence>
        ) : (
          <ProjectCover
            title={project.title}
            period={period}
            stack={project.stack}
            className="transition-transform duration-700 group-hover/spot:scale-[1.03]"
          />
        )}
        {many && (
          <>
            <CarouselButton side="left" onClick={() => go(-1)} label={t("previous")} />
            <CarouselButton side="right" onClick={() => go(1)} label={t("next")} />
            <div className="absolute inset-x-0 bottom-2 z-10 flex justify-center gap-1.5">
              {images.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setSlide(([current]) => [i, i > current ? 1 : -1])}
                  aria-label={t("showImage", { n: i + 1 })}
                  aria-current={i === index}
                  className={cn(
                    "h-1.5 rounded-full bg-white/60 shadow transition-all",
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
            <p className="font-mono text-xs text-muted-foreground">{period}</p>
          </div>
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("sourceCode", { title: project.title })}
              title="GitHub"
              className="grid size-9 shrink-0 place-items-center rounded-full border transition-all hover:-translate-y-0.5 hover:rotate-12 hover:bg-accent"
            >
              <SiGithub className="size-4" />
            </a>
          )}
        </div>

        <p className="text-pretty">{project.description}</p>

        <dl className="space-y-3 text-sm">
          <div>
            <dt className="font-medium">{t("challenges")}</dt>
            <dd className="text-pretty text-muted-foreground">{project.challenges}</dd>
          </div>
          <div>
            <dt className="font-medium">{t("results")}</dt>
            <dd className="text-pretty text-muted-foreground">{project.results}</dd>
          </div>
        </dl>

        <ul className="flex flex-wrap gap-1.5">
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
            onClick={() => ask(t("askAiPrompt", { title: project.title }))}
            className="group/ask inline-flex items-center gap-1 font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <Sparkles className="size-3.5 transition-transform group-hover/ask:scale-125 group-hover/ask:rotate-12" />
            {t("askAi")}
          </button>
        </div>
      </div>
    </SpotlightCard>
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
        "absolute top-1/2 z-10 grid size-9 -translate-y-1/2 place-items-center rounded-full bg-black/50 text-white backdrop-blur transition-all hover:scale-110 hover:bg-black/70 focus-visible:opacity-100 pointer-fine:opacity-0 pointer-fine:group-hover/spot:opacity-100",
        side === "left" ? "left-3" : "right-3",
      )}
    >
      <Icon className="size-5" />
    </button>
  );
}

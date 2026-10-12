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
import Image from "next/image";
import Link from "next/link";
import LuisPhoto from "@/assets/luis-photo.jpg";
import { ExperienceTimeline } from "@/components/about/experience-timeline";
import { AskBox } from "@/components/home/ask-box";
import { SocialLinks } from "@/components/layout/social-links";
import { ProjectCover } from "@/components/projects/project-cover";
import { ButtonLink } from "@/components/ui/button";
import { Badge, Card, Container, SectionHeading } from "@/components/ui/primitives";
import { marqueeTech } from "@/components/tech-icon";
import { awards, certifications, education, experience, profile, projects, site } from "@/content";
import { yearsOfExperience } from "@/lib/dates";

// Re-render daily so computed values (years of experience, durations) stay fresh.
export const revalidate = 86400;

export default function HomePage() {
  const current = experience.find((e) => !e.end);
  const featured = projects.filter((p) => p.featured);

  const stats = [
    { value: `${yearsOfExperience(profile.careerStart)}+`, label: "years building software" },
    { value: String(projects.length), label: "projects showcased" },
    {
      value: String(education.reduce((n, e) => n + (e.honors?.length ?? 0), 0)),
      label: "courses with highest distinction",
    },
    { value: String(certifications.length), label: "certifications" },
  ];

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="pt-14 pb-20 sm:pt-20">
        <Container className="grid items-center gap-12 md:grid-cols-[1.4fr_1fr]">
          <div className="animate-fade-up space-y-6">
            {current && (
              <Badge className="gap-2 bg-card py-1 pr-3 text-sm">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-60" />
                  <span className="relative inline-flex size-2 rounded-full bg-success" />
                </span>
                {current.role} at {current.company}
              </Badge>
            )}
            <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
              Hi, I&apos;m <span className="text-gradient">{profile.name}</span>
            </h1>
            <p className="max-w-xl text-lg text-pretty text-muted-foreground sm:text-xl">{profile.tagline}</p>
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="size-4" />
              {profile.location} · {profile.role}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <ButtonLink href="/projects" size="lg">
                View my work
                <ArrowRight />
              </ButtonLink>
              <ButtonLink href="/about" size="lg" variant="secondary">
                About me
              </ButtonLink>
              <SocialLinks className="ml-1" />
            </div>
          </div>

          <div className="relative mx-auto w-56 animate-fade-up [animation-delay:150ms] sm:w-72 md:w-full md:max-w-sm">
            <div
              aria-hidden
              className="absolute -inset-4 rounded-full bg-brand-gradient opacity-40 blur-3xl"
            />
            <div className="relative rounded-full bg-brand-gradient p-1 shadow-2xl">
              <Image
                src={LuisPhoto}
                alt={`Portrait of ${profile.name}`}
                priority
                placeholder="blur"
                sizes="(min-width: 768px) 384px, 288px"
                className="aspect-square rounded-full border-4 border-background object-cover"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* ── Ask the AI ───────────────────────────────────────── */}
      <section className="pb-20">
        <Container className="space-y-8 text-center">
          <SectionHeading
            eyebrow="AI assistant"
            title="Skip the CV. Just ask."
            description="My AI assistant knows my experience, projects and skills, answers in your language and links you to the right page."
            className="mx-auto"
          />
          <AskBox />
        </Container>
      </section>

      {/* ── Stats ────────────────────────────────────────────── */}
      <section className="pb-24">
        <Container>
          <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {stats.map((s) => (
              <Card key={s.label} className="p-6">
                <dt className="text-sm text-muted-foreground">{s.label}</dt>
                <dd className="order-first text-gradient text-4xl font-semibold tracking-tight">{s.value}</dd>
              </Card>
            ))}
          </dl>
        </Container>
      </section>

      {/* ── Experience ───────────────────────────────────────── */}
      <section className="pb-24">
        <Container className="grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <div className="space-y-6">
            <SectionHeading
              eyebrow="Experience"
              title="From computer vision to generative AI"
              description={`${yearsOfExperience(profile.careerStart)}+ years shipping AI-powered products, from an internship in Germany to enterprise generative-AI projects in Spain.`}
            />
            <ButtonLink href="/about" variant="secondary">
              Full experience
              <ArrowRight />
            </ButtonLink>
            {awards[0] && (
              <Card className="p-5">
                <p className="text-sm font-medium">🏆 {awards[0].title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{awards[0].issuer}</p>
              </Card>
            )}
          </div>
          <ExperienceTimeline compact />
        </Container>
      </section>

      {/* ── Featured projects ────────────────────────────────── */}
      <section className="pb-24">
        <Container className="space-y-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading eyebrow="Projects" title="Selected work" />
            <ButtonLink href="/projects" variant="secondary">
              All projects
              <ArrowRight />
            </ButtonLink>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {featured.map((p) => (
              <Link key={p.slug} href={`/projects#${p.slug}`} className="group">
                <Card className="flex h-full flex-col overflow-hidden transition-all group-hover:-translate-y-1 group-hover:border-primary/40 group-hover:shadow-xl group-hover:shadow-brand-2/10">
                  <div className="relative aspect-[2/1] overflow-hidden bg-brand-gradient">
                    {p.images[0] ? (
                      <Image
                        src={p.images[0]}
                        alt=""
                        fill
                        sizes="(min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <ProjectCover project={p} />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col gap-2 p-5">
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="font-semibold">{p.title}</h3>
                      <span className="shrink-0 font-mono text-xs text-muted-foreground">{p.period}</span>
                    </div>
                    <p className="line-clamp-2 text-sm text-muted-foreground">{p.description}</p>
                    <p className="mt-auto pt-2 font-mono text-xs text-muted-foreground/80">
                      {p.stack.slice(0, 4).join(" · ")}
                    </p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Tech marquee ─────────────────────────────────────── */}
      <section className="pb-24" aria-label="Technologies I work with">
        <div className="overflow-hidden mask-fade-x">
          <ul className="flex w-max animate-marquee gap-10 hover:[animation-play-state:paused]">
            {[...marqueeTech, ...marqueeTech].map(({ name, icon: Icon, color }, i) => (
              <li
                key={`${name}-${i}`}
                aria-hidden={i >= marqueeTech.length}
                className="flex items-center gap-2 text-muted-foreground"
              >
                <Icon className="size-6" style={color ? { color } : undefined} />
                <span className="text-sm font-medium whitespace-nowrap">{name}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── How this site works ──────────────────────────────── */}
      <section>
        <Container className="space-y-10">
          <SectionHeading
            eyebrow="Under the hood"
            title="How the assistant works"
            description="A small, production-minded LLM app. The full write-up, with architecture decisions, is in the repository."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {howItWorks.map(({ icon: Icon, title, body }) => (
              <Card key={title} className="space-y-3 p-6">
                <div className="grid size-10 place-items-center rounded-xl bg-accent text-accent-foreground">
                  <Icon className="size-5" />
                </div>
                <h3 className="font-semibold">{title}</h3>
                <p className="text-sm text-pretty text-muted-foreground">{body}</p>
              </Card>
            ))}
          </div>
          <ButtonLink href={site.repo} variant="secondary">
            Read the code & docs on GitHub
            <ArrowRight />
          </ButtonLink>
        </Container>
      </section>
    </>
  );
}

const howItWorks = [
  {
    icon: Database,
    title: "One source of truth",
    body: "All content lives in typed TypeScript files. The same data renders these pages and becomes the assistant's knowledge, so they can never drift apart.",
  },
  {
    icon: MessageSquareText,
    title: "Grounded long-context answers",
    body: "The whole knowledge base fits in the model's context window, so instead of a vector-database RAG pipeline the model sees everything — simpler and more accurate.",
  },
  {
    icon: Gauge,
    title: "Prompt caching",
    body: "The large, static part of the prompt comes first, so the provider caches it: follow-up questions reuse it at a fraction of the cost and start answering faster.",
  },
  {
    icon: Wrench,
    title: "Tool calling & generative UI",
    body: "The model can call typed tools to show project or contact cards, rendered as React components in the chat while the answer streams in.",
  },
  {
    icon: ShieldCheck,
    title: "Guardrails",
    body: "Input validation, a sliding history window, per-IP and global rate limits, output caps and a hardened system prompt keep it safe and cheap to run.",
  },
  {
    icon: Sparkles,
    title: "Evaluated, not vibes",
    body: "An eval suite checks factual accuracy, language matching, tool usage and prompt-injection resistance before changes ship.",
  },
];

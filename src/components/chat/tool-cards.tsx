import { ArrowUpRight, Mail, MessageSquare } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FaLinkedin } from "react-icons/fa6";
import { SiGithub } from "react-icons/si";
import type { ChatTools } from "@/lib/ai/tools";

type ProjectsOutput = ChatTools["showProjects"]["output"];
type ContactOutput = ChatTools["showContactCard"]["output"];

export function ProjectsToolCard({
  projects,
  onNavigate,
}: {
  projects: ProjectsOutput;
  onNavigate?: () => void;
}) {
  if (projects.length === 0) {
    return <p className="text-sm text-muted-foreground">No matching projects.</p>;
  }
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-2">
      {projects.map((p) => (
        <Link
          key={p.slug}
          href={`/projects#${p.slug}`}
          onClick={onNavigate}
          className="group flex min-w-0 gap-3 rounded-xl border bg-background/60 p-2.5 transition-colors hover:border-primary/50 hover:bg-accent/50"
        >
          <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-brand-gradient">
            {p.image && <Image src={p.image} alt="" fill sizes="64px" className="object-cover" />}
          </div>
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1 text-sm font-medium">
              <span className="truncate">{p.title}</span>
              <ArrowUpRight className="size-3.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
            </p>
            <p className="line-clamp-2 text-xs text-muted-foreground">{p.description}</p>
            <p className="mt-1 truncate font-mono text-[10px] text-muted-foreground/80">
              {p.stack.join(" · ")}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}

export function ContactToolCard({
  contact,
  onNavigate,
}: {
  contact: ContactOutput;
  onNavigate?: () => void;
}) {
  const items = [
    { label: contact.email, href: `mailto:${contact.email}`, icon: Mail },
    { label: "LinkedIn", href: contact.linkedin, icon: FaLinkedin },
    { label: "GitHub", href: contact.github, icon: SiGithub },
  ];
  return (
    <div className="rounded-xl border bg-background/60 p-3">
      <p className="mb-2 text-sm font-medium">Get in touch with {contact.name.split(" ")[0]}</p>
      <div className="grid gap-1.5">
        {items.map(({ label, href, icon: Icon }) => (
          <a
            key={href}
            href={href}
            {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-accent"
          >
            <Icon className="size-4 text-primary" />
            {label}
          </a>
        ))}
        <Link
          href={contact.contactPage}
          onClick={onNavigate}
          className="mt-1 flex items-center justify-center gap-2 rounded-lg bg-brand-gradient px-3 py-2 text-sm font-medium text-white"
        >
          <MessageSquare className="size-4" />
          Open the contact form
        </Link>
      </div>
    </div>
  );
}

export function ToolSkeleton({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-dashed p-3 text-xs text-muted-foreground">
      <span className="size-2 animate-pulse rounded-full bg-primary" />
      {label}
    </div>
  );
}

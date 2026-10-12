import { Mail } from "lucide-react";
import { SiGithub } from "react-icons/si";
import { FaLinkedin } from "react-icons/fa6";
import { profile } from "@/content";
import { cn } from "@/lib/utils";

export const socialItems = [
  { label: "GitHub", href: profile.socials.github, icon: SiGithub },
  { label: "LinkedIn", href: profile.socials.linkedin, icon: FaLinkedin },
  { label: "Email", href: `mailto:${profile.email}`, icon: Mail },
];

export function SocialLinks({ className }: { className?: string }) {
  return (
    <ul className={cn("flex items-center gap-1", className)}>
      {socialItems.map(({ label, href, icon: Icon }) => (
        <li key={label}>
          <a
            href={href}
            {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            aria-label={label}
            title={label}
            className="grid size-10 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <Icon className="size-5" />
          </a>
        </li>
      ))}
    </ul>
  );
}

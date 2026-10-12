import Link from "next/link";
import { Container } from "@/components/ui/primitives";
import { profile, site } from "@/content";
import { SocialLinks } from "./social-links";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t">
      <Container className="flex flex-col gap-6 py-10 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p className="font-medium text-foreground">{profile.name}</p>
          <p>
            Built with Next.js, the Vercel AI SDK and a lot of ☕ ·{" "}
            <a
              href={site.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="underline-offset-4 hover:underline"
            >
              Source code
            </a>{" "}
            ·{" "}
            <Link href="/privacy" className="underline-offset-4 hover:underline">
              Privacy
            </Link>
          </p>
        </div>
        <SocialLinks />
      </Container>
    </footer>
  );
}

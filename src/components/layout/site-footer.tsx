import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/primitives";
import { site } from "@/content";
import { Link } from "@/i18n/navigation";
import { SocialLinks } from "./social-links";

export function SiteFooter({ name }: { name: string }) {
  const t = useTranslations("Footer");

  return (
    <footer className="mt-28 border-t bg-background/40 backdrop-blur-sm">
      <Container className="flex flex-col gap-6 py-10 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1.5">
          <p className="font-medium text-foreground">{name}</p>
          <p>
            {t("builtWith")} ·{" "}
            <a
              href={site.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="underline-offset-4 hover:underline"
            >
              {t("sourceCode")}
            </a>{" "}
            ·{" "}
            <Link href="/privacy" className="underline-offset-4 hover:underline">
              {t("privacy")}
            </Link>
          </p>
          <p className="group inline-flex cursor-default items-center gap-1.5 font-mono text-xs">
            {t("madeIn")}
            <span className="inline-block group-hover:animate-heartbeat" aria-hidden>
              💜
            </span>
            <span aria-hidden>🌊</span>
          </p>
        </div>
        <SocialLinks />
      </Container>
    </footer>
  );
}

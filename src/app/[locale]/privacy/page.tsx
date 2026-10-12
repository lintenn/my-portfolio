import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import { Container } from "@/components/ui/primitives";
import { getContent } from "@/content";
import { Link } from "@/i18n/navigation";
import { localeFromParams, localizedMetadata } from "@/i18n/server";
import { formatYearMonth } from "@/lib/dates";

/** Bump when the policy text changes. */
const LAST_UPDATED = "2026-10";

export async function generateMetadata({ params }: PageProps<"/[locale]/privacy">): Promise<Metadata> {
  const locale = await localeFromParams(params);
  const t = await getTranslations({ locale, namespace: "Privacy" });
  return { title: t("title"), description: t("metaDescription"), ...localizedMetadata("/privacy", locale) };
}

export default async function PrivacyPage({ params }: PageProps<"/[locale]/privacy">) {
  const locale = await localeFromParams(params);
  const t = await getTranslations({ locale, namespace: "Privacy" });
  const { profile } = getContent(locale);

  const rich = {
    strong: (chunks: ReactNode) => <strong>{chunks}</strong>,
    code: (chunks: ReactNode) => <code>{chunks}</code>,
    link: (chunks: ReactNode) => <Link href="/contact">{chunks}</Link>,
    email: (chunks: ReactNode) => <a href={`mailto:${profile.email}`}>{chunks}</a>,
  };

  return (
    <Container className="pt-10 sm:pt-16">
      <article className="mx-auto prose max-w-3xl animate-fade-up rounded-3xl border bg-card/80 p-6 backdrop-blur sm:p-10 dark:prose-invert prose-headings:tracking-tight prose-a:text-primary">
        <h1>{t("title")}</h1>
        <p className="lead">{t("lastUpdated", { date: formatYearMonth(LAST_UPDATED, locale) })}</p>
        <p>{t("intro", { name: profile.name, location: profile.location })}</p>

        <h2>{t("noAccountsTitle")}</h2>
        <p>{t("noAccounts")}</p>

        <h2>{t("chatTitle")}</h2>
        <ul>
          <li>{t.rich("chat1", rich)}</li>
          <li>{t.rich("chat2", rich)}</li>
          <li>{t("chat3")}</li>
          <li>{t("chat4")}</li>
        </ul>

        <h2>{t("contactTitle")}</h2>
        <p>{t.rich("contact", rich)}</p>

        <h2>{t("hostingTitle")}</h2>
        <p>{t.rich("hosting", rich)}</p>

        <h2>{t("rightsTitle")}</h2>
        <p>{t.rich("rights", { ...rich, email: () => rich.email(profile.email) })}</p>

        <h2>{t("changesTitle")}</h2>
        <p>{t("changes")}</p>
      </article>
    </Container>
  );
}

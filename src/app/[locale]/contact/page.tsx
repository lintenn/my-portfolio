import { Mail, MapPin } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { SocialLinks } from "@/components/layout/social-links";
import { SpotlightCard } from "@/components/motion/spotlight-card";
import { Container, SectionHeading } from "@/components/ui/primitives";
import { getContent } from "@/content";
import { localeFromParams, localizedMetadata } from "@/i18n/server";
import { ContactForm } from "./contact-form";

export async function generateMetadata({ params }: PageProps<"/[locale]/contact">): Promise<Metadata> {
  const locale = await localeFromParams(params);
  const t = await getTranslations({ locale, namespace: "Contact" });
  return {
    title: t("eyebrow"),
    description: t("metaDescription"),
    ...localizedMetadata("/contact", locale),
  };
}

export default async function ContactPage({ params }: PageProps<"/[locale]/contact">) {
  const locale = await localeFromParams(params);
  const t = await getTranslations({ locale, namespace: "Contact" });
  const { profile } = getContent(locale);

  return (
    <Container className="grid gap-12 pt-10 sm:pt-16 lg:grid-cols-[1fr_1.3fr]">
      <div className="animate-fade-up space-y-8">
        <SectionHeading as="h1" eyebrow={t("eyebrow")} title={t("title")} description={t("description")} />
        <SpotlightCard className="p-6">
          <div className="space-y-4">
            <a
              href={`mailto:${profile.email}`}
              className="group flex items-center gap-3 break-all transition-colors hover:text-primary"
            >
              <Mail className="size-5 shrink-0 text-primary transition-transform group-hover:-rotate-12" />
              {profile.email}
            </a>
            <p className="flex items-center gap-3 text-muted-foreground">
              <MapPin className="size-5 text-primary" />
              {profile.location}
            </p>
            <SocialLinks className="-ml-2" />
          </div>
        </SpotlightCard>
      </div>
      <SpotlightCard className="animate-fade-up p-6 [animation-delay:120ms] sm:p-8">
        <ContactForm />
      </SpotlightCard>
    </Container>
  );
}

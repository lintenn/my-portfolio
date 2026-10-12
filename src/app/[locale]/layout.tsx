import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import localFont from "next/font/local";
import { LivingBackground } from "@/components/background/living-background";
import { ChatProvider } from "@/components/chat/chat-provider";
import { ChatWidget } from "@/components/chat/chat-widget";
import { ConsoleGreeting } from "@/components/layout/console-greeting";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ThemeProvider } from "@/components/layout/theme";
import { MotionProvider } from "@/components/motion/motion-provider";
import { getContent, site } from "@/content";
import { routing } from "@/i18n/routing";
import { localeFromParams, localizedMetadata } from "@/i18n/server";
import "../globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

/** Pre-render every page in every language at build time. */
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const locale = await localeFromParams(params);
  const { profile, siteDescription } = getContent(locale);
  const t = await getTranslations({ locale, namespace: "Metadata" });
  const title = `${site.title} — ${profile.role}`;

  return {
    metadataBase: new URL(site.url),
    title: { template: `%s · ${site.title}`, default: title },
    description: siteDescription,
    authors: [{ name: profile.name, url: site.url }],
    keywords: [...t("keywords").split(", "), profile.name],
    ...localizedMetadata("/", locale),
    openGraph: {
      ...localizedMetadata("/", locale).openGraph,
      type: "website",
      siteName: site.title,
      title,
      description: siteDescription,
    },
    twitter: { card: "summary_large_image" },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fcfbfe" },
    { media: "(prefers-color-scheme: dark)", color: "#16141f" },
  ],
};

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const locale = await localeFromParams(params);
  const { profile, experience, chatSuggestions } = getContent(locale);
  const t = await getTranslations({ locale, namespace: "Nav" });
  const current = experience.find((e) => !e.end);

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: current?.role,
    worksFor: current ? { "@type": "Organization", name: current.company } : undefined,
    address: { "@type": "PostalAddress", addressLocality: "Málaga", addressCountry: "ES" },
    url: site.url,
    email: `mailto:${profile.email}`,
    knowsLanguage: ["es", "en", "de"],
    sameAs: [profile.socials.linkedin, profile.socials.github],
    alumniOf: [{ "@type": "CollegeOrUniversity", name: "Universidad de Málaga" }],
  };

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans`}>
        <script
          type="application/ld+json"
          // JSON.stringify output from static data; `<` is escaped to keep it inert.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c") }}
        />
        <NextIntlClientProvider>
          <ThemeProvider>
            <MotionProvider>
              <ChatProvider>
                <a
                  href="#main"
                  className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
                >
                  {t("skipToContent")}
                </a>
                <LivingBackground />
                <div className="flex min-h-dvh flex-col">
                  <SiteHeader />
                  <main id="main" className="flex-1 pt-20 sm:pt-24">
                    {children}
                  </main>
                  <SiteFooter name={profile.name} />
                </div>
                <ChatWidget name={profile.shortName} suggestions={chatSuggestions} />
                <ConsoleGreeting />
              </ChatProvider>
            </MotionProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

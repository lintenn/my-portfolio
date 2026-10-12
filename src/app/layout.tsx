import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { ChatProvider } from "@/components/chat/chat-provider";
import { ChatWidget } from "@/components/chat/chat-widget";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ThemeProvider } from "@/components/layout/theme";
import { experience, profile, site } from "@/content";
import "./globals.css";

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

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    template: `%s · ${site.title}`,
    default: `${site.title} — ${profile.role}`,
  },
  description: site.description,
  authors: [{ name: profile.name, url: site.url }],
  keywords: [
    "Software Engineer",
    "AI Engineer",
    "Full-Stack",
    "LLM",
    "Next.js",
    "React",
    "Málaga",
    profile.name,
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: site.url,
    siteName: site.title,
    title: `${site.title} — ${profile.role}`,
    description: site.description,
    locale: "en_US",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fcfbfe" },
    { media: "(prefers-color-scheme: dark)", color: "#16141f" },
  ],
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: experience[0]?.role,
  worksFor:
    experience[0] && !experience[0].end
      ? { "@type": "Organization", name: experience[0].company }
      : undefined,
  address: { "@type": "PostalAddress", addressLocality: "Málaga", addressCountry: "ES" },
  url: site.url,
  email: `mailto:${profile.email}`,
  sameAs: [profile.socials.linkedin, profile.socials.github],
  alumniOf: [{ "@type": "CollegeOrUniversity", name: "University of Málaga" }],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} bg-backdrop font-sans`}>
        <script
          type="application/ld+json"
          // JSON.stringify output from static data; `<` is escaped to keep it inert.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c") }}
        />
        <ThemeProvider>
          <ChatProvider>
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
            >
              Skip to content
            </a>
            <div className="flex min-h-dvh flex-col">
              <SiteHeader />
              <main id="main" className="flex-1">
                {children}
              </main>
              <SiteFooter />
            </div>
            <ChatWidget />
          </ChatProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

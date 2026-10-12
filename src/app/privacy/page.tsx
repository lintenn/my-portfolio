import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/primitives";
import { profile } from "@/content";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How this website handles chat messages, contact-form data and analytics.",
  alternates: { canonical: "/privacy" },
};

const LAST_UPDATED = "October 2026";

export default function PrivacyPage() {
  return (
    <Container className="pt-14 sm:pt-20">
      <article className="mx-auto prose max-w-3xl dark:prose-invert prose-headings:tracking-tight prose-a:text-primary">
        <h1>Privacy Policy</h1>
        <p className="lead">Last updated: {LAST_UPDATED}</p>

        <p>
          This is the personal portfolio of {profile.name} (“I”, “me”), based in {profile.location}. I want it
          to collect as little data as possible. This page explains exactly what is processed, why, and by
          whom.
        </p>

        <h2>No accounts, no advertising cookies</h2>
        <p>
          You don&apos;t need an account to use this site, and it doesn&apos;t use advertising or cross-site
          tracking cookies. Your theme preference and your current chat conversation are stored only in your
          own browser (local/session storage) and never sent to me.
        </p>

        <h2>AI assistant</h2>
        <ul>
          <li>
            Messages you type in the chat are sent to <strong>OpenAI</strong> to generate the answers.
            Requests are made with storage disabled (<code>store: false</code>), and under OpenAI&apos;s API
            terms they are not used to train models. OpenAI may keep API data for a limited time for abuse
            monitoring.
          </li>
          <li>
            To prevent abuse and control costs, your IP address is used to apply rate limits. Only a one-way
            hash of it is shared with OpenAI as an anonymous safety identifier. If rate limiting via{" "}
            <strong>Upstash</strong> is enabled, counters keyed by IP expire automatically after a few minutes
            (daily for the global counter).
          </li>
          <li>Technical logs record token usage and errors, not the content of your conversation.</li>
          <li>
            Please don&apos;t share sensitive personal information in the chat. Answers are AI-generated and
            may contain mistakes.
          </li>
        </ul>

        <h2>Contact form</h2>
        <p>
          When you use the <Link href="/contact">contact form</Link>, your name, email and message are
          delivered to me through <strong>Formspree</strong>. I only use them to reply to you and delete them
          when they are no longer needed.
        </p>

        <h2>Hosting and analytics</h2>
        <p>
          The site is hosted on <strong>Vercel</strong>, which processes standard server logs (such as IP
          address, browser and requested pages) to deliver and secure the service. Vercel Web Analytics and
          Speed Insights provide aggregated, cookie-less visit and performance statistics that don&apos;t
          identify individual visitors.
        </p>

        <h2>Your rights</h2>
        <p>
          Under the GDPR you can ask to access, correct or delete any personal data I hold about you, or
          object to its processing. Just email me at <a href={`mailto:${profile.email}`}>{profile.email}</a>.
          You can also lodge a complaint with the Spanish Data Protection Agency (AEPD).
        </p>

        <h2>Changes</h2>
        <p>If this policy changes, the new version will be published on this page with an updated date.</p>
      </article>
    </Container>
  );
}

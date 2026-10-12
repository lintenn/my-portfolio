import { Mail, MapPin } from "lucide-react";
import type { Metadata } from "next";
import { SocialLinks } from "@/components/layout/social-links";
import { Card, Container, SectionHeading } from "@/components/ui/primitives";
import { profile } from "@/content";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Reach out for opportunities, collaborations or just to say hi.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <Container className="grid gap-12 pt-14 sm:pt-20 lg:grid-cols-[1fr_1.3fr]">
      <div className="space-y-8">
        <SectionHeading
          as="h1"
          eyebrow="Contact"
          title="Let's talk"
          description="Opportunities, collaborations or a question about one of my projects — I'll get back to you as soon as I can."
        />
        <Card className="space-y-4 p-6">
          <a href={`mailto:${profile.email}`} className="flex items-center gap-3 hover:text-primary">
            <Mail className="size-5 text-primary" />
            {profile.email}
          </a>
          <p className="flex items-center gap-3 text-muted-foreground">
            <MapPin className="size-5 text-primary" />
            {profile.location}
          </p>
          <SocialLinks className="-ml-2" />
        </Card>
      </div>
      <Card className="p-6 sm:p-8">
        <ContactForm />
      </Card>
    </Container>
  );
}

import Section from "@/components/Section";
import { Metadata } from "next";
import EmailForm from "./EmailForm";

export const metadata: Metadata = {
  title: "Contact Me",
  description:
    "Feel free to reach out to me for any inquiries or opportunities.",
};

export default function Page() {
  return (
    <Section id="contact" title="Contact Me">
      <div className="mx-auto max-w-lg">
        <p className="mb-6 text-gray-600">
          Feel free to reach out to me for any inquiries or opportunities.
          I&apos;ll get back to you as soon as possible.
        </p>
        <EmailForm />
      </div>
    </Section>
  );
}

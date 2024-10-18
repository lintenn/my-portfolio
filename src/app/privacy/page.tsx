import { H1 } from "@/components/ui/H1";
import { H2 } from "@/components/ui/H2";
import { H3 } from "@/components/ui/H3";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default function Page() {
  return (
    <section className="space-y-6">
      <div className="space-y-3">
        <H1>Privacy Policy</H1>
        <p>Last Updated: Oct 2024</p>
      </div>
      <div className="space-y-3">
        <H2>Introduction</H2>
        <p>
          Welcome to my portfolio website. This Privacy Policy explains the
          practices regarding the collection, use, and disclosure of information
          that are received through the website. The primary goal is to showcase
          the work and skills while respecting your privacy.
        </p>
        <H2>Information We Collect</H2>
        <p>
          As the website is a static portfolio, no personal data is actively
          collected from visitors. No account creation is required, and no
          cookies are used for tracking or personal data collection.
        </p>
        <H3>1. Log Files</H3>
        <p>
          Like many other websites, we collect information that your browser
          sends whenever you visit the site (&quot;Log Data&quot;). This Log
          Data may include information such as your computer&apos;s Internet
          Protocol (&quot;IP&quot;) address, browser type, browser version, the
          pages of this site that you visit, the time and date of your visit,
          the time spent on the pages, and other statistics.
        </p>
        <H3>2. Contact Information</H3>
        <p>
          If we provide an option for you to contact Luis Miguel García Marín
          via email or contact form, any information you provide is voluntary
          and used solely to respond to your inquiries.
        </p>
        <H2>Use of Information</H2>
        <p>The information collected is used in the following ways:</p>
        <ul className="list-inside list-disc">
          <li>To ensure the proper funtioning of the website</li>
          <li>
            To improve the website based on the information and feedback
            received from you{" "}
          </li>
          <li>
            To respond to your customer service requests and support needs
          </li>
        </ul>
        <H2>Information Sharing and Disclosure</H2>
        <p>
          Users&apos; personal identification information is not sold, traded,
          or rented to others. We may share generic aggregated demographic
          information not linked to any personal identification information
          regarding visitors and users with business partners, trusted
          affiliates, and advertisers for the purposes outlined above.
        </p>
        <H2>Security</H2>
        <p>
          The security of your Personal Information is important to us, but
          remember that no method of transmission over the Internet, or method
          of electronic storage, is 100% secure. While we strive to use
          commercially acceptable means to protect your Personal Information, we
          cannot guarantee its absolute security.
        </p>
        <H2>Changes to this Privacy Policy</H2>
        <p>
          This Privacy Policy is effective as of Oct 2024 and will remain in
          effect except with respect to any changes in its provisions in the
          future, which will be in effect inmediately after being posted on this
          page. We reserve the right to update or change our Privacy Policy at
          any time, and you should check this Privacy Policy periodically.
        </p>
        <H2>Contact</H2>
        <p>
          If you have any questions about this Privacy Policy, please send them
          to luismgarciamarin@gmail.com or contact me <Link href="/contact" className="text-primary hover:underline">here</Link>.
        </p>
      </div>
    </section>
  );
}

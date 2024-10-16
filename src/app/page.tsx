import { H1 } from "@/components/ui/H1";
import { Metadata } from "next";
import Image from "next/image";
import LuisPhoto from "@/assets/luis-photo.jpg";
import { H2 } from "@/components/ui/H2";
import {Bot, Github, Linkedin, Mail} from "lucide-react";
import SocialLink from "@/components/SocialLink";

export const metadata: Metadata = {
  title: "Luis Miguel García Marín - Portfolio",
};

export default function Home() {
  return (
    <section className="space-y-16 bg-[url('/background.png')] bg-cover bg-center bg-no-repeat px-1 py-8">
      <section className="grid grid-cols-1 items-center gap-8 sm:grid-cols-2">
        <div className="space-y-3">
          <H1 className="text-center sm:text-start">
            Luis Miguel García Marín
          </H1>
          <p className="text-center sm:text-start">
            Hello World! I&apos;m a <span className="font-bold">Software Engineer</span> specialized in <span className="font-bold">Artificial
            Intelligence</span> and <span className="font-bold">Full-Stack</span> development. I&apos;ve experience with technologies like TensorFlow, React, Angular and Spring Boot.
          </p>
          <div className="flex justify-center space-x-4">
              <SocialLink href="https://github.com/lintenn" icon={<Github />} label="GitHub" />
              <SocialLink href="https://linkedin.com/in/luis-garcia-marin" icon={<Linkedin />} label="LinkedIn" />
              <SocialLink href="mailto:luismgarciamarin@gmail.com" icon={<Mail />} label="Email" />
          </div>
        </div>
        <div className="flex justify-center">
          <Image
            src={LuisPhoto}
            alt="A picture of me"
            height={300}
            width={300}
            className="aspect-square rounded-full border-2 object-cover shadow-md dark:border-foreground"
          />
        </div>
      </section>
      
      <section className="space-y-3 text-center">
        <H2>Ask the chatbot anything about me</H2>
        <p>
          Click the little <Bot className="inline pb-1" /> icon in the top bar
          to display the AI chat. You can ask the chatbot any question about me.
          The bot can even provide links to pages you&apos;re looking for.
        </p>
      </section>
    </section>
  );
}


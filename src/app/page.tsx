import { H1 } from "@/components/ui/H1";
import { Metadata } from "next";
import Image from "next/image";
import LuisPhoto from "@/assets/luis-photo.jpg";
import { H2 } from "@/components/ui/H2";
import { Bot, Github, Linkedin, Mail } from "lucide-react";
import SocialLink from "@/components/SocialLink";

export const metadata: Metadata = {
  title: "Luis Miguel García Marín - Portfolio",
};

export default function Home() {
  return (
    <section className="space-y-16 bg-[url('/background.png')] bg-cover bg-center bg-no-repeat px-4 py-16 max-w-5xl mx-auto">
      {/* Hero Section */}
      <section className="grid grid-cols-1 items-center gap-12 sm:grid-cols-2">
        <div className="space-y-6">
          <H1 className="text-center sm:text-start text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-500 to-blue-500 dark:from-purple-600 dark:via-indigo-600 dark:to-blue-600 animate-text">
            Luis Miguel García Marín
          </H1>
          <p className="text-center sm:text-start text-lg text-gray-700 dark:text-gray-300">
            Hello World! I&apos;m a{" "}
            <span className="font-bold">Software Engineer</span> specialized in{" "}
            <span className="font-bold">Artificial Intelligence</span> and{" "}
            <span className="font-bold">Full-Stack</span> development. I have
            experience with technologies like TensorFlow, React, Angular, and
            Spring Boot.
          </p>
          {/* Social Links */}
          <div className="flex justify-center sm:justify-start space-x-6">
            <SocialLink
              href="https://github.com/lintenn"
              icon={<Github size={30} />}
              label="GitHub"
            />
            <SocialLink
              href="https://linkedin.com/in/luis-garcia-marin"
              icon={<Linkedin size={30} />}
              label="LinkedIn"
            />
            <SocialLink
              href="mailto:luismgarciamarin@gmail.com"
              icon={<Mail size={30} />}
              label="Email"
            />
          </div>
        </div>
        {/* Image Section */}
        <div className="flex justify-center relative group">
          {/* Sombra detrás de la imagen */}
          <div className="absolute inset-0 rounded-full border-2 border-transparent bg-gradient-to-r from-purple-300 via-indigo-300 to-blue-300 dark:from-purple-900 dark:via-indigo-800 dark:to-blue-900 opacity-30 blur-lg transition-opacity duration-300 z-0"></div>
          {/* Imagen encima de la sombra */}
          <Image
            src={LuisPhoto}
            alt="A picture of me"
            height={350}
            width={350}
            className="aspect-square rounded-full border-4 object-cover shadow-lg z-10 dark:border-foreground"
          />
        </div>
      </section>

      {/* Chatbot Section */}
      <section className="space-y-4 text-center">
        <H2 className="text-3xl font-bold">Ask the chatbot anything about me</H2>
        <p className="text-gray-600 dark:text-gray-300">
          Click the little <Bot className="inline pb-1" size={24} /> icon in the
          top bar to display the AI chat. You can ask the chatbot any question
          about me, and it can even provide links to pages you&apos;re looking
          for. Don&apos;t be shy!
        </p>
      </section>

      {/* Technologies Section */}
      <section className="mt-16 text-center">
        <H2 className="text-2xl font-bold text-indigo-700 dark:text-indigo-400">
          Powered by Cutting-Edge Technologies
        </H2>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
          This portfolio website, featuring an AI Chatbot, has been built using{" "}
          <strong>Next.js 14</strong> with <strong>TypeScript</strong> and{" "}
          <strong>Tailwind CSS</strong>. It leverages{" "}
          <strong>OpenAI Large Language Models</strong> and integrates with{" "}
          <strong>Langchain</strong> for document loading, splitting, and
          combination, providing context-aware responses.
        </p>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
          It also features advanced <strong>Vector Embeddings</strong> and{" "}
          <strong>Vector Stores</strong> hosted on <strong>AstraDB</strong>,
          along with chat history, retrieval mechanisms like{" "}
          <strong>rephrase search prompts</strong>, and caching provided by{" "}
          <strong>Langchain with Upstash Redis</strong>.
        </p>
      </section>
    </section>
  );
}

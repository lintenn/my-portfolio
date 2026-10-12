import type { L } from "./types";

export const site = {
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.luismigarcia.com").replace(/\/$/, ""),
  title: "Luis Miguel García Marín",
  description: {
    en: "Software Engineer specialized in AI and full-stack development. Explore my experience and projects, or ask my AI assistant anything about me.",
    es: "Ingeniero de Software especializado en IA y desarrollo full-stack. Descubre mi experiencia y mis proyectos, o pregúntale lo que quieras a mi asistente de IA.",
    de: "Softwareentwickler mit Schwerpunkt KI und Full-Stack-Entwicklung. Entdecke meine Erfahrung und Projekte – oder frag meinen KI-Assistenten alles über mich.",
  } as L,
  repo: "https://github.com/lintenn/my-portfolio",
};

/**
 * Main pages. Labels are translated in `src/i18n/messages/*.json` (Nav.*).
 * The chatbot uses these paths to link visitors to pages.
 */
export const navigation = [
  { href: "/", key: "home", description: "Overview, highlights and featured projects" },
  { href: "/about", key: "about", description: "Experience, education, skills, certifications and awards" },
  { href: "/projects", key: "projects", description: "All projects with details and links" },
  { href: "/contact", key: "contact", description: "Contact form and social links" },
] as const;

/** Starter questions shown in the chat and on the home page. */
export const chatSuggestions: L[] = [
  {
    en: "What do you work on at JCode Technologies?",
    es: "¿En qué trabajas en JCode Technologies?",
    de: "Woran arbeitest du bei JCode Technologies?",
  },
  {
    en: "What experience do you have with LLMs and generative AI?",
    es: "¿Qué experiencia tienes con LLMs e IA generativa?",
    de: "Welche Erfahrung hast du mit LLMs und generativer KI?",
  },
  {
    en: "Show me your computer vision projects",
    es: "Enséñame tus proyectos de visión artificial",
    de: "Zeig mir deine Computer-Vision-Projekte",
  },
  {
    en: "How was this chatbot built?",
    es: "¿Cómo se construyó este chatbot?",
    de: "Wie wurde dieser Chatbot gebaut?",
  },
  { en: "Where did you study?", es: "¿Dónde estudiaste?", de: "Wo hast du studiert?" },
  { en: "How can I contact you?", es: "¿Cómo puedo contactarte?", de: "Wie kann ich dich erreichen?" },
];

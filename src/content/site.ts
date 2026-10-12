export const site = {
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.luismigarcia.com").replace(/\/$/, ""),
  title: "Luis Miguel García Marín",
  description:
    "Software Engineer specialized in AI and full-stack development. Explore my experience and projects, or ask my AI assistant anything about me.",
  repo: "https://github.com/lintenn/my-portfolio",
};

/** Main navigation. The chatbot also uses these paths to link visitors to pages. */
export const navigation = [
  { href: "/", label: "Home", description: "Overview, highlights and featured projects" },
  { href: "/about", label: "About", description: "Experience, education, skills, certifications and awards" },
  { href: "/projects", label: "Projects", description: "All projects with details and links" },
  { href: "/contact", label: "Contact", description: "Contact form and social links" },
] as const;

/** Starter questions shown in the chat and on the home page. */
export const chatSuggestions = [
  "What do you work on at JCode Technologies?",
  "What experience do you have with LLMs and generative AI?",
  "Show me your computer vision projects",
  "How was this chatbot built?",
  "¿Qué estudiaste y dónde?",
  "How can I contact you?",
];

import type { L, SkillGroup } from "./types";

export const skillGroups: SkillGroup[] = [
  {
    name: { en: "Generative AI & LLMs", es: "IA generativa y LLMs", de: "Generative KI & LLMs" },
    skills: [
      {
        en: "LLM integration (cloud & local)",
        es: "Integración de LLMs (nube y local)",
        de: "LLM-Integration (Cloud & lokal)",
      },
      "Prompt engineering",
      "RAG",
      "Tool calling",
      "OpenAI API",
      "Azure AI",
      "Vercel AI SDK",
      "LangChain",
      "ElevenLabs",
      "LiveKit",
      "Telnyx",
    ],
  },
  {
    name: {
      en: "Machine Learning & Computer Vision",
      es: "Machine Learning y visión artificial",
      de: "Machine Learning & Computer Vision",
    },
    skills: [
      "Deep Learning",
      "TensorFlow",
      "Keras",
      "PyTorch",
      "YOLO",
      "OpenCV",
      { en: "Object detection", es: "Detección de objetos", de: "Objekterkennung" },
      "CUDA",
      "Pandas",
      "RAPIDS",
    ],
  },
  {
    name: { en: "Frontend & Mobile", es: "Frontend y móvil", de: "Frontend & Mobile" },
    skills: ["TypeScript", "JavaScript", "React", "Next.js", "Angular", "Tailwind CSS", "Flutter"],
  },
  {
    name: { en: "Backend", es: "Backend", de: "Backend" },
    skills: [
      "Python",
      "FastAPI",
      "Flask",
      "Django",
      "Java",
      "Spring Boot",
      "Node.js",
      "Express.js",
      { en: "Microservices", es: "Microservicios", de: "Microservices" },
      "Swagger / OpenAPI",
    ],
  },
  {
    name: { en: "Data, Cloud & DevOps", es: "Datos, cloud y DevOps", de: "Daten, Cloud & DevOps" },
    skills: ["PostgreSQL", "MongoDB", "Redis", "Docker", "AWS", "Azure DevOps", "CI/CD", "Vercel", "Git"],
  },
  {
    name: { en: "IoT, Games & more", es: "IoT, videojuegos y más", de: "IoT, Games & mehr" },
    skills: ["MQTT", "FIWARE", "The Things Network", "Unity", "C#", "C / C++", "R", "Haskell", "Scrum"],
  },
];

export const softSkills: L[] = [
  { en: "Client communication", es: "Comunicación con clientes", de: "Kundenkommunikation" },
  { en: "End-to-end ownership", es: "Responsabilidad de principio a fin", de: "End-to-End-Verantwortung" },
  { en: "Analytical thinking", es: "Pensamiento analítico", de: "Analytisches Denken" },
  { en: "Problem solving", es: "Resolución de problemas", de: "Problemlösung" },
  { en: "Teamwork", es: "Trabajo en equipo", de: "Teamarbeit" },
  { en: "Initiative & perseverance", es: "Iniciativa y constancia", de: "Eigeninitiative & Ausdauer" },
];

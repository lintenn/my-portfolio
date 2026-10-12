import type { Project } from "./types";

/**
 * Projects. The array order doesn't matter: they're displayed newest first
 * (ongoing projects, then by end year and start year — see `sortProjects`).
 * `featured` projects also appear on the home page.
 */
export const projects: Project[] = [
  {
    slug: "ai-portfolio",
    title: { en: "AI Portfolio & Chatbot", es: "Portfolio con IA y chatbot", de: "KI-Portfolio & Chatbot" },
    start: 2024,
    description: {
      en: "This website: a Next.js portfolio in three languages with an AI assistant that answers questions about my career in my own voice, grounded on the same typed content that renders the pages.",
      es: "Esta web: un portfolio en Next.js en tres idiomas con un asistente de IA que responde preguntas sobre mi carrera con mi propia voz, basado en el mismo contenido tipado que pinta las páginas.",
      de: "Diese Website: ein dreisprachiges Next.js-Portfolio mit einem KI-Assistenten, der Fragen zu meiner Laufbahn in meinem Namen beantwortet – auf Basis derselben typisierten Inhalte, die auch die Seiten rendern.",
    },
    challenges: {
      en: "Keeping the assistant accurate (no hallucinated facts), cheap to run and safe to expose publicly, while keeping a single source of truth for both the UI and the model's knowledge.",
      es: "Que el asistente sea preciso (sin datos inventados), barato de mantener y seguro de exponer públicamente, manteniendo una única fuente de verdad para la interfaz y el conocimiento del modelo.",
      de: "Den Assistenten präzise (keine halluzinierten Fakten), günstig im Betrieb und sicher für die Öffentlichkeit zu halten – mit einer einzigen Quelle der Wahrheit für UI und Modellwissen.",
    },
    results: {
      en: "Rebuilt in 2026 from a LangChain + vector-database RAG pipeline into a leaner design with long-context grounding, prompt caching, tool calling with generative UI, rate limiting and automated evals — fewer moving parts, lower cost and better answers.",
      es: "Reconstruido en 2026: de un pipeline RAG con LangChain y base de datos vectorial a un diseño más ligero con long context, prompt caching, tool calling con UI generativa, rate limiting y evals automáticas. Menos piezas, menos coste y mejores respuestas.",
      de: "2026 neu aufgebaut: von einer RAG-Pipeline mit LangChain und Vektordatenbank zu einem schlankeren Design mit Long-Context-Grounding, Prompt Caching, Tool Calling mit Generative UI, Rate Limiting und automatisierten Evals – weniger bewegliche Teile, geringere Kosten, bessere Antworten.",
    },
    stack: [
      "Next.js",
      "React",
      "TypeScript",
      "Vercel AI SDK",
      "OpenAI",
      "Tailwind CSS",
      "next-intl",
      "Vercel",
    ],
    images: [],
    github: "https://github.com/lintenn/my-portfolio",
    featured: true,
  },
  {
    slug: "oleoh",
    title: {
      en: "Oleoh · Hackathon 3rd prize",
      es: "Oleoh · 3.er premio hackathon",
      de: "Oleoh · 3. Platz Hackathon",
    },
    start: 2026,
    end: 2026,
    description: {
      en: "Built at the Polo Digital de Málaga Data Challenge: a system that cross-references the city's open datasets to find the neighbourhoods under the most pressure for used-cooking-oil recycling — lots of generation, few collection points nearby — and a service concept with containers in building entrances and door-to-door pickup, turning household oil into biodiesel.",
      es: "Creado en el Data Challenge del Polo Digital de Málaga: un sistema que cruza los datos abiertos de la ciudad para detectar los barrios con más tensión en el reciclaje de aceite usado —mucha generación y pocos puntos de recogida cerca— y un concepto de servicio con contenedores en los portales y recogida puerta a puerta que convierte el aceite de los hogares en biodiésel.",
      de: "Entstanden bei der Data Challenge des Polo Digital de Málaga: ein System, das offene Daten der Stadt verknüpft, um die Viertel mit dem größten Druck beim Recycling von Altspeiseöl zu finden – viel Aufkommen, wenige Sammelstellen in der Nähe – plus ein Servicekonzept mit Behältern in Hauseingängen und Abholung an der Haustür, das Haushaltsöl in Biodiesel verwandelt.",
    },
    challenges: {
      en: "Finding, cleaning and joining heterogeneous public datasets under hackathon time pressure, and turning them into a clear, actionable map and ranking for communities and recycling companies.",
      es: "Encontrar, limpiar y cruzar conjuntos de datos públicos heterogéneos con la presión de tiempo de un hackathon, y convertirlos en un mapa y un ranking claros y accionables para comunidades y empresas de reciclaje.",
      de: "Heterogene öffentliche Datensätze unter Hackathon-Zeitdruck finden, bereinigen und verknüpfen – und daraus eine klare, umsetzbare Karte samt Ranking für Hausgemeinschaften und Recyclingunternehmen machen.",
    },
    results: {
      en: "Third prize. A hexagon heat map and neighbourhood ranking of recycling pressure, plus a landing page for the pilot, helping communities decide where to install containers and connecting the oil with companies that give it a second life. I worked on the technical development in a team of five.",
      es: "Tercer premio. Un mapa de calor hexagonal y un ranking de barrios según la tensión de reciclaje, más una landing para el piloto, que ayudan a decidir dónde instalar contenedores y conectan el aceite con empresas que le dan una segunda vida. Me encargué del desarrollo técnico en un equipo de cinco.",
      de: "Dritter Platz. Eine hexagonale Heatmap mit Ranking der Viertel nach Recycling-Druck sowie eine Landingpage für das Pilotprojekt helfen zu entscheiden, wo Behälter aufgestellt werden, und bringen das Öl zu Unternehmen, die ihm ein zweites Leben geben. Ich war im Fünferteam für die technische Entwicklung zuständig.",
    },
    stack: [
      { en: "Open data", es: "Datos abiertos", de: "Open Data" },
      { en: "Data analysis", es: "Análisis de datos", de: "Datenanalyse" },
      { en: "Geospatial visualization", es: "Visualización geoespacial", de: "Geodatenvisualisierung" },
      "Smart cities",
    ],
    images: [
      "/projects/oleoh/1.jpg",
      "/projects/oleoh/2.jpg",
      "/projects/oleoh/3.jpg",
      "/projects/oleoh/4.jpg",
      "/projects/oleoh/5.jpg",
    ],
    links: [
      {
        label: { en: "LinkedIn post", es: "Publicación en LinkedIn", de: "LinkedIn-Beitrag" },
        href: "https://www.linkedin.com/feed/update/urn:li:activity:7462833522525814784/",
      },
    ],
    featured: true,
  },
  {
    slug: "smart-space-journey",
    title: "Smart Space Journey",
    start: 2022,
    end: 2022,
    description: {
      en: "A Unity game where an AI agent autonomously pilots a spaceship with physics-based controls, using reinforcement learning to dodge asteroids, destroy threats with guided missiles and chase UFOs.",
      es: "Un juego en Unity en el que un agente de IA pilota de forma autónoma una nave con controles físicos, usando aprendizaje por refuerzo para esquivar asteroides, destruir amenazas con misiles guiados y perseguir ovnis.",
      de: "Ein Unity-Spiel, in dem ein KI-Agent ein Raumschiff mit physikbasierter Steuerung autonom fliegt und per Reinforcement Learning Asteroiden ausweicht, Bedrohungen mit Lenkraketen zerstört und UFOs verfolgt.",
    },
    challenges: {
      en: "Training the agent to control movement through physical forces, making real-time decisions to dodge obstacles and fire missiles, and keeping spaceship and missile behavior physically realistic.",
      es: "Entrenar al agente para controlar el movimiento mediante fuerzas físicas, tomar decisiones en tiempo real para esquivar obstáculos y disparar misiles, y mantener un comportamiento físicamente realista de la nave y los misiles.",
      de: "Den Agenten darauf zu trainieren, Bewegung über physikalische Kräfte zu steuern, in Echtzeit Hindernissen auszuweichen und Raketen abzufeuern – bei physikalisch realistischem Verhalten von Schiff und Raketen.",
    },
    results: {
      en: "An autonomous navigation agent that adapts to space hazards, dodging or destroying asteroids and pursuing UFOs. Hands-on experience with reinforcement learning, physics-based control and real-time decision-making.",
      es: "Un agente de navegación autónoma que se adapta a los peligros del espacio, esquivando o destruyendo asteroides y persiguiendo ovnis. Experiencia práctica en aprendizaje por refuerzo, control basado en físicas y toma de decisiones en tiempo real.",
      de: "Ein autonomer Navigationsagent, der sich an Gefahren im All anpasst, Asteroiden ausweicht oder zerstört und UFOs verfolgt. Praxiserfahrung mit Reinforcement Learning, physikbasierter Steuerung und Echtzeitentscheidungen.",
    },
    stack: [
      "Unity",
      "C#",
      { en: "Reinforcement Learning", es: "Aprendizaje por refuerzo", de: "Reinforcement Learning" },
      "ML-Agents",
    ],
    images: [
      "/projects/smart-space-journey/2.png",
      "/projects/smart-space-journey/4.png",
      "/projects/smart-space-journey/6.png",
      "/projects/smart-space-journey/1.png",
      "/projects/smart-space-journey/3.png",
      "/projects/smart-space-journey/5.png",
    ],
    github: "https://github.com/lintenn/SmartSpaceJourney",
    links: [
      {
        label: { en: "Presentation", es: "Presentación", de: "Präsentation" },
        href: "https://github.com/lintenn/SmartSpaceJourney/blob/main/Smart%20Space%20Journey.pdf",
      },
    ],
    featured: true,
  },
  {
    slug: "age-detector",
    title: { en: "Age Detector", es: "Detector de edad", de: "Altersschätzer" },
    start: 2021,
    end: 2022,
    description: {
      en: "A deep-learning model built with TensorFlow and Keras that estimates a person's age from a photo using convolutional neural networks (CNNs).",
      es: "Un modelo de deep learning con TensorFlow y Keras que estima la edad de una persona a partir de una foto usando redes neuronales convolucionales (CNN).",
      de: "Ein Deep-Learning-Modell mit TensorFlow und Keras, das das Alter einer Person anhand eines Fotos mit Convolutional Neural Networks (CNNs) schätzt.",
    },
    challenges: {
      en: "Handling a large dataset of low-resolution images, transforming it into a format suitable for training, and fine-tuning the network for accurate predictions.",
      es: "Manejar un gran conjunto de imágenes de baja resolución, transformarlo a un formato adecuado para el entrenamiento y ajustar la red para obtener predicciones precisas.",
      de: "Einen großen Datensatz niedrig aufgelöster Bilder verarbeiten, ihn in ein trainierbares Format bringen und das Netz für präzise Vorhersagen feinabstimmen.",
    },
    results: {
      en: "A working age-prediction model and a research-style paper. Deeper understanding of CNNs, image processing and model optimization, plus experience training on cloud environments like Colab and AWS.",
      es: "Un modelo de predicción de edad funcional y un paper de estilo académico. Comprensión más profunda de las CNN, el procesamiento de imágenes y la optimización de modelos, además de experiencia entrenando en la nube con Colab y AWS.",
      de: "Ein funktionierendes Modell zur Altersschätzung und ein Paper im wissenschaftlichen Stil. Tieferes Verständnis von CNNs, Bildverarbeitung und Modelloptimierung sowie Erfahrung mit Training in der Cloud (Colab und AWS).",
    },
    stack: ["Python", "TensorFlow", "Keras", "CNNs", "Google Colab", "AWS"],
    images: ["/projects/age-detector/1.png", "/projects/age-detector/2.png"],
    github: "https://github.com/lintenn/age_detector",
    links: [
      {
        label: { en: "Paper", es: "Paper", de: "Paper" },
        href: "https://github.com/lintenn/age_detector/blob/main/Age_Detector_Paper.pdf",
      },
    ],
    featured: true,
  },
  {
    slug: "risto",
    title: "Risto",
    start: 2022,
    end: 2023,
    description: {
      en: "A restaurant and reservation management web app with an interactive editor to design restaurant floor plans, real-time chat between customers and restaurants, deployed on AWS.",
      es: "Una aplicación web de gestión de restaurantes y reservas con un editor interactivo para diseñar la distribución del local y chat en tiempo real entre clientes y restaurantes, desplegada en AWS.",
      de: "Eine Web-App für Restaurant- und Reservierungsmanagement mit interaktivem Editor für Raumpläne und Echtzeit-Chat zwischen Gästen und Restaurants, deployt auf AWS.",
    },
    challenges: {
      en: "Building an intuitive floor-plan design interface and reliable real-time communication through the chat system.",
      es: "Crear una interfaz intuitiva para diseñar planos y una comunicación en tiempo real fiable a través del chat.",
      de: "Eine intuitive Oberfläche für Raumpläne und zuverlässige Echtzeitkommunikation über das Chatsystem.",
    },
    results: {
      en: "A user-friendly layout tool, solid experience with real-time features, and hands-on AWS deployment and cloud management in an international team.",
      es: "Una herramienta de diseño de planos fácil de usar, experiencia sólida con funcionalidades en tiempo real y despliegue práctico en AWS dentro de un equipo internacional.",
      de: "Ein benutzerfreundliches Layout-Tool, solide Erfahrung mit Echtzeitfunktionen sowie praktisches AWS-Deployment und Cloud-Management in einem internationalen Team.",
    },
    stack: ["React", "Express.js", "Node.js", "WebSockets", "AWS"],
    images: ["/projects/risto/home.png", "/projects/risto/details.png", "/projects/risto/search.png"],
    github: "https://github.com/lintenn/GDSD_Team_3",
  },
  {
    slug: "gratemate",
    title: "GrateMate",
    start: 2023,
    end: 2023,
    description: {
      en: "A Flutter mobile app that helps people cook more efficiently: find and save recipes, build shopping lists, and follow step-by-step instructions hands-free with voice commands.",
      es: "Una app móvil en Flutter para cocinar de forma más eficiente: buscar y guardar recetas, crear la lista de la compra y seguir los pasos sin manos mediante comandos de voz.",
      de: "Eine Flutter-App, die beim effizienteren Kochen hilft: Rezepte finden und speichern, Einkaufslisten erstellen und Schritt-für-Schritt-Anleitungen freihändig per Sprachbefehl verfolgen.",
    },
    challenges: {
      en: "Integrating accurate voice recognition with limited resources and designing an interface that works smoothly across devices.",
      es: "Integrar un reconocimiento de voz preciso con recursos limitados y diseñar una interfaz que funcione con fluidez en distintos dispositivos.",
      de: "Präzise Spracherkennung mit begrenzten Ressourcen integrieren und eine Oberfläche gestalten, die auf allen Geräten flüssig funktioniert.",
    },
    results: {
      en: "Hands-free cooking flow powered by voice commands, plus experience in responsive mobile UI design and API integration.",
      es: "Un flujo de cocina manos libres con comandos de voz, además de experiencia en diseño de interfaces móviles responsive e integración de APIs.",
      de: "Ein freihändiger Kochablauf per Sprachsteuerung sowie Erfahrung mit responsivem Mobile-UI-Design und API-Integration.",
    },
    stack: [
      "Flutter",
      "Dart",
      { en: "Speech recognition", es: "Reconocimiento de voz", de: "Spracherkennung" },
      "REST APIs",
    ],
    images: ["/projects/gratemate/1.jpg", "/projects/gratemate/2.jpg"],
    github: "https://github.com/lintenn/GrateMate",
  },
];

/** Newest first: ongoing projects, then by end year, then by start year. */
export function sortProjects<T extends { start: number; end?: number }>(list: T[]): T[] {
  return [...list].sort((a, b) => (b.end ?? Infinity) - (a.end ?? Infinity) || b.start - a.start);
}

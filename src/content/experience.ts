import type { Award, Certification, Education, Experience } from "./types";

/** Most recent first. */
export const experience: Experience[] = [
  {
    company: "JCode Technologies",
    companyUrl: "https://jcodetechnologies.com",
    role: { en: "Software Engineer", es: "Ingeniero de Software", de: "Softwareentwickler" },
    location: { en: "Málaga, Spain", es: "Málaga, España", de: "Málaga, Spanien" },
    workMode: "remote",
    employmentType: "fullTime",
    start: "2025-04",
    summary: {
      en: "Full-stack architecture and generative-AI systems for enterprise clients in insurance, real estate, fintech, leisure, fashion and entertainment.",
      es: "Arquitectura full-stack y sistemas de IA generativa para clientes enterprise de seguros, inmobiliarias, fintech, ocio, moda y entretenimiento.",
      de: "Full-Stack-Architektur und Generative-AI-Systeme für Enterprise-Kunden aus Versicherung, Immobilien, Fintech, Freizeit, Mode und Entertainment.",
    },
    highlights: [
      {
        en: "Design and implementation of scalable web and mobile applications for high-traffic sectors (leisure, fashion and entertainment): Flutter for cross-platform apps, React/Next.js on the frontend and optimized Flask and FastAPI microservices on the backend.",
        es: "Diseño e implementación de aplicaciones web y móviles escalables para sectores de alto tráfico (ocio, moda y entretenimiento): Flutter para apps multiplataforma, React/Next.js en el frontend y microservicios optimizados con Flask y FastAPI en el backend.",
        de: "Konzeption und Umsetzung skalierbarer Web- und Mobile-Anwendungen für Branchen mit hohem Traffic (Freizeit, Mode und Entertainment): Flutter für plattformübergreifende Apps, React/Next.js im Frontend und optimierte Flask- und FastAPI-Microservices im Backend.",
      },
      {
        en: "Integration of generative-AI and LLM-based solutions (local models and cloud services) for enterprise clients in insurance (Mapfre), real estate and fintech (intelligent invoice management).",
        es: "Integración de soluciones de IA generativa y basadas en LLMs (modelos locales y servicios en la nube) para clientes enterprise de seguros (Mapfre), inmobiliarias y fintech (gestión inteligente de facturas).",
        de: "Integration von Generative-AI- und LLM-basierten Lösungen (lokale Modelle und Cloud-Dienste) für Enterprise-Kunden aus Versicherung (Mapfre), Immobilien und Fintech (intelligentes Rechnungsmanagement).",
      },
      {
        en: "Building AI features with the OpenAI API, Azure AI, ElevenLabs, LiveKit and Telnyx, including prompt engineering and the infrastructure around them.",
        es: "Desarrollo de funcionalidades de IA con OpenAI API, Azure AI, ElevenLabs, LiveKit y Telnyx, incluyendo el prompt engineering y la infraestructura que las rodea.",
        de: "Entwicklung von KI-Features mit der OpenAI API, Azure AI, ElevenLabs, LiveKit und Telnyx – inklusive Prompt Engineering und der zugehörigen Infrastruktur.",
      },
    ],
    stack: [
      "Flutter",
      "React",
      "Next.js",
      "Flask",
      "FastAPI",
      "Python",
      "OpenAI API",
      "Azure AI",
      "ElevenLabs",
      "LiveKit",
      "Telnyx",
      "Docker",
      "AWS",
    ],
  },
  {
    company: "EDAG Group",
    companyUrl: "https://www.edag.com",
    role: { en: "Software Engineer", es: "Ingeniero de Software", de: "Softwareentwickler" },
    location: { en: "Fulda, Germany", es: "Fulda, Alemania", de: "Fulda, Deutschland" },
    workMode: "hybrid",
    employmentType: "fullTime",
    start: "2023-12",
    end: "2024-12",
    summary: {
      en: "Full-stack development, testing and DevOps for internal tools and critical industrial systems in an international engineering company.",
      es: "Desarrollo full-stack, testing y DevOps para herramientas internas y sistemas industriales críticos en una empresa internacional de ingeniería.",
      de: "Full-Stack-Entwicklung, Testing und DevOps für interne Tools und kritische Industriesysteme in einem internationalen Engineering-Unternehmen.",
    },
    highlights: [
      {
        en: "Built an internal shift-planning tool that automatically assigns staff to support shifts — from requirements gathering to deployment — with Angular 18, Tailwind CSS and DaisyUI on the frontend, Spring Boot with JPA and PostgreSQL on the backend, and scheduling algorithms that automate resource planning.",
        es: "Desarrollé una herramienta interna de planificación de turnos que asigna automáticamente al personal a los turnos de soporte —desde la recogida de requisitos hasta el despliegue— con Angular 18, Tailwind CSS y DaisyUI en el frontend, Spring Boot con JPA y PostgreSQL en el backend, y algoritmos de planificación que automatizan la gestión de recursos.",
        de: "Entwicklung eines internen Schichtplanungstools, das Mitarbeitende automatisch Support-Schichten zuweist – von der Anforderungsaufnahme bis zum Deployment – mit Angular 18, Tailwind CSS und DaisyUI im Frontend, Spring Boot mit JPA und PostgreSQL im Backend sowie Planungsalgorithmen zur Automatisierung der Ressourcenplanung.",
      },
      {
        en: "Performed end-to-end and integration testing on critical systems for chemical-recipe and factory management, improving stability and performance.",
        es: "Pruebas end-to-end y de integración en sistemas críticos de gestión de recetas químicas y fábricas, mejorando su estabilidad y rendimiento.",
        de: "End-to-End- und Integrationstests kritischer Systeme für Chemierezeptur- und Fabrikmanagement zur Verbesserung von Stabilität und Performance.",
      },
      {
        en: "Provided DevOps support with Azure DevOps (releases and continuous-deployment pipelines for servers and microservices) and dockerized applications such as the shift-planning tool and the smart-parking system for consistent deployments across environments.",
        es: "Soporte DevOps con Azure DevOps (releases y pipelines de despliegue continuo para servidores y microservicios) y dockerización de aplicaciones como la herramienta de turnos y el sistema de aparcamiento inteligente para desplegarlas de forma consistente en varios entornos.",
        de: "DevOps-Support mit Azure DevOps (Releases und Continuous-Deployment-Pipelines für Server und Microservices) sowie Dockerisierung von Anwendungen wie dem Schichtplanungstool und dem Smart-Parking-System für konsistente Deployments in mehreren Umgebungen.",
      },
    ],
    stack: [
      "Angular",
      "Tailwind CSS",
      "Spring Boot",
      "JPA",
      "PostgreSQL",
      "Docker",
      "Azure DevOps",
      "CI/CD",
      "Swagger",
    ],
  },
  {
    company: "EDAG Group",
    companyUrl: "https://www.edag.com",
    role: {
      en: "Software Engineer Intern",
      es: "Ingeniero de Software en prácticas",
      de: "Praktikant Softwareentwicklung",
    },
    location: { en: "Fulda, Germany", es: "Fulda, Alemania", de: "Fulda, Deutschland" },
    workMode: "onSite",
    employmentType: "internship",
    start: "2022-09",
    end: "2023-12",
    summary: {
      en: "Computer vision and IoT for smart-city and smart-parking use cases.",
      es: "Visión artificial e IoT para casos de uso de Smart City y aparcamiento inteligente.",
      de: "Computer Vision und IoT für Smart-City- und Smart-Parking-Anwendungen.",
    },
    highlights: [
      {
        en: "Developed a smart-parking management system (my bachelor's thesis) that detects vehicles in camera images and manages parking areas, so employees can see which spaces are free before driving around looking for one.",
        es: "Desarrollé un sistema de gestión inteligente de aparcamiento (mi Trabajo de Fin de Grado) que detecta vehículos en imágenes de cámaras y gestiona las zonas de aparcamiento, para que los empleados vean qué plazas están libres sin dar vueltas buscando.",
        de: "Entwicklung eines Smart-Parking-Managementsystems (meine Bachelorarbeit), das Fahrzeuge in Kamerabildern erkennt und Parkbereiche verwaltet, sodass Mitarbeitende freie Plätze sehen, ohne lange suchen zu müssen.",
      },
      {
        en: "Reached over 90% detection accuracy — higher than existing platforms on the market — and made the system adaptable to other use cases (train-platform management, store-area distribution…) by hot-swapping the object-detection model in real time.",
        es: "Logré una precisión de detección de más del 90 % —superior a la de otras plataformas del mercado— y lo hice adaptable a otros casos de uso (gestión de andenes de tren, distribución de áreas de tiendas…) intercambiando en tiempo real el modelo de detección de objetos.",
        de: "Über 90 % Erkennungsgenauigkeit – mehr als bestehende Plattformen am Markt – und Anpassbarkeit an weitere Anwendungsfälle (Bahnsteigmanagement, Flächenaufteilung in Geschäften …) durch den Austausch des Objekterkennungsmodells in Echtzeit.",
      },
      {
        en: "Set up and configured a network of sensors and IP cameras with The Things Network and FIWARE for different smart-city use cases, plus web dashboards to visualize the data.",
        es: "Desplegué y configuré una red de sensores y cámaras IP con The Things Network y FIWARE para distintos casos de uso de Smart City, además de dashboards web para visualizar los datos.",
        de: "Aufbau und Konfiguration eines Netzwerks aus Sensoren und IP-Kameras mit The Things Network und FIWARE für verschiedene Smart-City-Anwendungen sowie Web-Dashboards zur Datenvisualisierung.",
      },
    ],
    stack: [
      "Python",
      "TensorFlow",
      "PyTorch",
      "YOLO",
      "OpenCV",
      "Flask",
      "Express.js",
      "React",
      "MQTT",
      "FIWARE",
      "The Things Network",
      "Scrum",
    ],
  },
];

export const education: Education[] = [
  {
    institution: {
      en: "Hochschule Fulda – University of Applied Sciences",
      es: "Hochschule Fulda – Universidad de Ciencias Aplicadas",
      de: "Hochschule Fulda",
    },
    degree: {
      en: "Software Engineering (exchange studies)",
      es: "Ingeniería del Software (estancia de intercambio)",
      de: "Software Engineering (Auslandsstudium)",
    },
    start: 2022,
    end: 2023,
    highlights: [
      {
        en: "GrateMate: a Flutter cooking app with saved recipes, shopping lists, cooking timers and voice navigation.",
        es: "GrateMate: app de cocina en Flutter con recetas guardadas, lista de la compra, temporizadores y navegación por voz.",
        de: "GrateMate: eine Koch-App in Flutter mit gespeicherten Rezepten, Einkaufslisten, Kochtimern und Sprachnavigation.",
      },
      {
        en: "Risto: a restaurant and reservation management web app with live chat.",
        es: "Risto: aplicación web de gestión de restaurantes y reservas con chat en vivo.",
        de: "Risto: eine Web-App für Restaurant- und Reservierungsmanagement mit Live-Chat.",
      },
    ],
  },
  {
    institution: { en: "University of Málaga", es: "Universidad de Málaga", de: "Universität Málaga" },
    degree: {
      en: "Bachelor's Degree in Software Engineering",
      es: "Grado en Ingeniería del Software",
      de: "Bachelor in Software Engineering",
    },
    start: 2019,
    end: 2023,
    details: {
      en: "Average grade 9.18 / 10, with the highest distinction (Matrícula de Honor) in 18 courses and in the bachelor's thesis.",
      es: "Nota media de 9,18 / 10, con Matrícula de Honor en 18 asignaturas y en el Trabajo de Fin de Grado.",
      de: "Notendurchschnitt 9,18 / 10, mit der höchsten Auszeichnung (Matrícula de Honor) in 18 Fächern und in der Bachelorarbeit.",
    },
    highlights: [
      {
        en: "Thesis: “Object Detection and Management of Camera-Monitored Zones applied to Smart Parking Monitoring Systems”.",
        es: "TFG: «Detección de Objetos y Gestión de Zonas Monitorizadas con Cámaras aplicado a Sistemas de Monitorización de Aparcamiento Inteligentes».",
        de: "Bachelorarbeit: „Objekterkennung und Verwaltung kameraüberwachter Zonen in intelligenten Parküberwachungssystemen“.",
      },
    ],
    honors: [
      {
        en: "Programming Fundamentals",
        es: "Fundamentos de la Programación",
        de: "Grundlagen der Programmierung",
      },
      {
        en: "Physics for Computer Science",
        es: "Fundamentos Físicos para la Informática",
        de: "Physikalische Grundlagen der Informatik",
      },
      {
        en: "Electronics Fundamentals",
        es: "Fundamentos de la Electrónica",
        de: "Grundlagen der Elektronik",
      },
      { en: "Computer Technology", es: "Tecnología de Computadores", de: "Rechnertechnik" },
      {
        en: "Object-Oriented Programming",
        es: "Programación Orientada a Objetos",
        de: "Objektorientierte Programmierung",
      },
      { en: "Computer Structure", es: "Estructura de Computadores", de: "Rechnerarchitektur" },
      { en: "Databases", es: "Bases de Datos", de: "Datenbanken" },
      {
        en: "Algorithm Analysis and Design",
        es: "Análisis y Diseño de Algoritmos",
        de: "Analyse und Entwurf von Algorithmen",
      },
      {
        en: "Automata Theory and Formal Languages",
        es: "Teoría de Autómatas y Lenguajes Formales",
        de: "Automatentheorie und formale Sprachen",
      },
      { en: "Operating Systems", es: "Sistemas Operativos", de: "Betriebssysteme" },
      {
        en: "Networks and Distributed Systems",
        es: "Redes y Sistemas Distribuidos",
        de: "Netzwerke und verteilte Systeme",
      },
      {
        en: "Systems Programming and Concurrency",
        es: "Programación de Sistemas y Concurrencia",
        de: "Systemprogrammierung und Nebenläufigkeit",
      },
      {
        en: "Computational Techniques for Software Engineering",
        es: "Técnicas Computacionales para la Ingeniería del Software",
        de: "Rechentechniken für das Software Engineering",
      },
      { en: "User Interfaces", es: "Interfaces de Usuario", de: "Benutzeroberflächen" },
      {
        en: "Software Maintenance and Testing",
        es: "Mantenimiento y Pruebas del Software",
        de: "Softwarewartung und -test",
      },
      { en: "Video Game Programming", es: "Programación de Videojuegos", de: "Spieleprogrammierung" },
      {
        en: "Security in Services and Applications",
        es: "Seguridad en Servicios y Aplicaciones",
        de: "Sicherheit von Diensten und Anwendungen",
      },
      {
        en: "Web Application Technologies",
        es: "Tecnologías de Aplicaciones Web",
        de: "Webanwendungstechnologien",
      },
    ],
  },
];

/** Most recent first. */
export const certifications: Certification[] = [
  {
    name: { en: "German – CEFR Level A2", es: "Alemán – Nivel A2 (MCER)", de: "Deutsch – Niveau A2 (GER)" },
    issuer: "Speexx",
    date: "2023-11",
  },
  {
    name: { en: "German A2", es: "Alemán A2", de: "Deutsch A2" },
    issuer: {
      en: "Language Centre of the University of Málaga (FGUMA)",
      es: "Centro de Idiomas de la Universidad de Málaga (FGUMA)",
      de: "Sprachenzentrum der Universität Málaga (FGUMA)",
    },
    date: "2022-09",
  },
  {
    name: "Accelerating End-to-End Data Science Workflows",
    issuer: "NVIDIA Deep Learning Institute",
    date: "2022-02",
    url: "https://learn.nvidia.com/certificates?id=fc4951aab7c6494982c0f4c9e867a64b",
  },
  {
    name: { en: "Deep Learning and CUDA", es: "Deep Learning y CUDA", de: "Deep Learning und CUDA" },
    issuer: { en: "University of Málaga", es: "Universidad de Málaga", de: "Universität Málaga" },
    date: "2021-09",
  },
  { name: "First Certificate in English (B2)", issuer: "Cambridge English", date: "2021-09" },
  {
    name: "Fundamentals of Deep Learning",
    issuer: "NVIDIA Deep Learning Institute",
    date: "2021-07",
    url: "https://learn.nvidia.com/certificates?id=f77d961929ff4c9db4ef7998d6e597ea",
  },
  {
    name: "Fundamentals of Accelerated Computing with CUDA C/C++",
    issuer: "NVIDIA Deep Learning Institute",
    date: "2021-07",
    url: "https://learn.nvidia.com/certificates?id=10865bbdeeae432da941845d1f318e37",
  },
];

export const awards: Award[] = [
  {
    title: {
      en: "3rd prize – Hackathon Data Challenge",
      es: "3.er premio – Hackathon Data Challenge",
      de: "3. Platz – Hackathon Data Challenge",
    },
    issuer: "Polo Digital de Málaga · IAT Metaverso (EDINT · FEMP & Ayuntamiento de Málaga)",
    date: "2026-05",
    description: {
      en: "With a team of five, built Oleoh: a system that cross-references Málaga's open datasets to find neighbourhoods with high used-cooking-oil generation and few collection points nearby. I worked on the technical development.",
      es: "En un equipo de cinco personas creamos Oleoh: un sistema que cruza los datos abiertos de Málaga para detectar los barrios con mucha generación de aceite usado y pocos puntos de recogida cerca. Me encargué del desarrollo técnico.",
      de: "Im Fünferteam haben wir Oleoh entwickelt: ein System, das offene Daten der Stadt Málaga verknüpft, um Viertel mit viel gebrauchtem Speiseöl und wenigen Sammelstellen zu finden. Ich war für die technische Entwicklung zuständig.",
    },
  },
  {
    title: {
      en: "18 × Matrícula de Honor (highest distinction)",
      es: "18 Matrículas de Honor",
      de: "18 × Matrícula de Honor (höchste Auszeichnung)",
    },
    issuer: {
      en: "School of Computer Science, University of Málaga",
      es: "E.T.S. de Ingeniería Informática, Universidad de Málaga",
      de: "Fakultät für Informatik, Universität Málaga",
    },
    date: "2022-07",
    description: {
      en: "Highest distinction in 18 courses of the Software Engineering degree (2020–2022), most of them with a final grade of 10 / 10.",
      es: "Matrícula de Honor en 18 asignaturas del Grado en Ingeniería del Software (2020–2022), la mayoría con un 10 / 10.",
      de: "Höchste Auszeichnung in 18 Fächern des Software-Engineering-Studiums (2020–2022), die meisten mit der Note 10 / 10.",
    },
  },
];

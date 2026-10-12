import type { Project } from "./types";

/** Display order = array order. `featured` projects also appear on the home page. */
export const projects: Project[] = [
  {
    slug: "ai-portfolio",
    title: "AI Portfolio & Chatbot",
    period: "2024 – 2026",
    description:
      "This website: a Next.js portfolio with an AI assistant that answers questions about my career in my own voice, grounded on the same typed content that renders the pages.",
    challenges:
      "Keeping the assistant accurate (no hallucinated facts), cheap to run and safe to expose publicly, while keeping a single source of truth for both the UI and the model's knowledge.",
    results:
      "Rebuilt in 2026 from a LangChain + vector-database RAG pipeline into a leaner design with long-context grounding, prompt caching, tool calling with generative UI, rate limiting and automated evals — fewer moving parts, lower cost and better answers.",
    stack: ["Next.js", "React", "TypeScript", "Vercel AI SDK", "OpenAI", "Tailwind CSS", "Vercel"],
    images: [],
    github: "https://github.com/lintenn/my-portfolio",
    featured: true,
  },
  {
    slug: "oleoh",
    title: "Oleoh · Hackathon 3rd prize",
    period: "2026",
    description:
      "Built at the Polo Digital de Málaga Data Challenge hackathon: a system that cross-references the city's open datasets to detect the neighbourhoods with the highest pressure on used-cooking-oil recycling — lots of generation, few collection points nearby.",
    challenges:
      "Finding, cleaning and joining heterogeneous public datasets under hackathon time pressure, and turning them into a clear, actionable map for communities and recycling companies.",
    results:
      "Third prize. The proposal helps communities decide where to install new containers and connects the collected oil with companies that give it a second life. I worked on the technical development in a team of five.",
    stack: ["Open data", "Data analysis", "Smart cities"],
    images: [],
    featured: true,
  },
  {
    slug: "smart-space-journey",
    title: "Smart Space Journey",
    period: "2022",
    description:
      "A Unity game where an AI agent autonomously pilots a spaceship with physics-based controls, using reinforcement learning to dodge asteroids, destroy threats with guided missiles and chase UFOs.",
    challenges:
      "Training the agent to control movement through physical forces, making real-time decisions to dodge obstacles and fire missiles, and keeping spaceship and missile behavior physically realistic.",
    results:
      "An autonomous navigation agent that adapts to space hazards, dodging or destroying asteroids and pursuing UFOs. Hands-on experience with reinforcement learning, physics-based control and real-time decision-making.",
    stack: ["Unity", "C#", "Reinforcement Learning", "ML-Agents"],
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
        label: "Presentation",
        href: "https://github.com/lintenn/SmartSpaceJourney/blob/main/Smart%20Space%20Journey.pdf",
      },
    ],
    featured: true,
  },
  {
    slug: "age-detector",
    title: "Age Detector",
    period: "2021 – 2022",
    description:
      "A deep-learning model built with TensorFlow and Keras that estimates a person's age from a photo using convolutional neural networks (CNNs).",
    challenges:
      "Handling a large dataset of low-resolution images, transforming it into a format suitable for training, and fine-tuning the network for accurate predictions.",
    results:
      "A working age-prediction model and a research-style paper. Deeper understanding of CNNs, image processing and model optimization, plus experience training on cloud environments like Colab and AWS.",
    stack: ["Python", "TensorFlow", "Keras", "CNNs", "Google Colab", "AWS"],
    images: ["/projects/age-detector/1.png", "/projects/age-detector/2.png"],
    github: "https://github.com/lintenn/age_detector",
    links: [
      {
        label: "Paper",
        href: "https://github.com/lintenn/age_detector/blob/main/Age_Detector_Paper.pdf",
      },
    ],
    featured: true,
  },
  {
    slug: "risto",
    title: "Risto",
    period: "2022 – 2023",
    description:
      "A restaurant and reservation management web app with an interactive editor to design restaurant floor plans, real-time chat between customers and restaurants, deployed on AWS.",
    challenges:
      "Building an intuitive floor-plan design interface and reliable real-time communication through the chat system.",
    results:
      "A user-friendly layout tool, solid experience with real-time features, and hands-on AWS deployment and cloud management in an international team.",
    stack: ["React", "Express.js", "Node.js", "WebSockets", "AWS"],
    images: ["/projects/risto/home.png", "/projects/risto/details.png", "/projects/risto/search.png"],
    github: "https://github.com/lintenn/GDSD_Team_3",
  },
  {
    slug: "gratemate",
    title: "GrateMate",
    period: "2023",
    description:
      "A Flutter mobile app that helps people cook more efficiently: find and save recipes, build shopping lists, and follow step-by-step instructions hands-free with voice commands.",
    challenges:
      "Integrating accurate voice recognition with limited resources and designing an interface that works smoothly across devices.",
    results:
      "Hands-free cooking flow powered by voice commands, plus experience in responsive mobile UI design and API integration.",
    stack: ["Flutter", "Dart", "Speech recognition", "REST APIs"],
    images: ["/projects/gratemate/1.jpg", "/projects/gratemate/2.jpg"],
    github: "https://github.com/lintenn/GrateMate",
  },
];

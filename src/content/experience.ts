import type { Award, Certification, Education, Experience } from "./types";

/** Most recent first. */
export const experience: Experience[] = [
  {
    company: "JCode Technologies",
    role: "Software Engineer",
    location: "Málaga, Spain",
    workMode: "Remote",
    employmentType: "Full-time",
    start: "2025-04",
    summary:
      "Full-stack architecture and generative-AI systems for enterprise clients in insurance, real estate, fintech, leisure, fashion and entertainment.",
    highlights: [
      "Design and implementation of scalable web and mobile applications for high-traffic sectors (leisure, fashion and entertainment): Flutter for cross-platform apps, React/Next.js on the frontend and optimized Flask and FastAPI microservices on the backend.",
      "Integration of generative-AI and LLM-based solutions (local models and cloud services) for enterprise clients in insurance (Mapfre), real estate and fintech (intelligent invoice management).",
      "Building AI features with the OpenAI API, Azure AI, ElevenLabs, LiveKit and Telnyx, including prompt engineering and the infrastructure around them.",
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
    role: "Software Engineer",
    location: "Fulda, Germany",
    workMode: "Hybrid",
    employmentType: "Full-time",
    start: "2023-12",
    end: "2024-12",
    summary:
      "Full-stack development, testing and DevOps for internal tools and critical industrial systems in an international engineering company.",
    highlights: [
      "Built an internal shift-planning tool that automatically assigns staff to support shifts — from requirements gathering to deployment — with Angular 18, Tailwind CSS and DaisyUI on the frontend, Spring Boot with JPA and PostgreSQL on the backend, and scheduling algorithms that automate resource planning.",
      "Performed end-to-end and integration testing on critical systems for chemical-recipe and factory management, improving stability and performance.",
      "Provided DevOps support with Azure DevOps (releases and continuous-deployment pipelines for servers and microservices) and dockerized applications such as the shift-planning tool and the smart-parking system for consistent deployments across environments.",
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
    role: "Software Engineer Intern",
    location: "Fulda, Germany",
    workMode: "On-site",
    employmentType: "Internship",
    start: "2022-09",
    end: "2023-12",
    summary: "Computer vision and IoT for smart-city and smart-parking use cases.",
    highlights: [
      "Developed a smart-parking management system (my bachelor's thesis) that detects vehicles in camera images and manages parking areas, so employees can see which spaces are free before driving around looking for one.",
      "Reached over 90% detection accuracy — higher than existing platforms on the market — and made the system adaptable to other use cases (train-platform management, store-area distribution…) by hot-swapping the object-detection model in real time.",
      "Set up and configured a network of sensors and IP cameras with The Things Network and FIWARE for different smart-city use cases, plus web dashboards to visualize the data.",
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
    institution: "Hochschule Fulda – University of Applied Sciences",
    degree: "Software Engineering (exchange studies)",
    start: 2022,
    end: 2023,
    highlights: [
      "GrateMate: a Flutter cooking app with saved recipes, shopping lists, cooking timers and voice navigation.",
      "Risto: a restaurant and reservation management web app with live chat.",
    ],
  },
  {
    institution: "University of Málaga",
    degree: "Bachelor's Degree in Software Engineering",
    start: 2019,
    end: 2023,
    details:
      "Average grade 9.18 / 10, with the highest distinction (Matrícula de Honor) in 18 courses and in the bachelor's thesis.",
    highlights: [
      "Thesis: “Object Detection and Management of Camera-Monitored Zones applied to Smart Parking Monitoring Systems”.",
    ],
    honors: [
      "Programming Fundamentals",
      "Physics for Computer Science",
      "Electronics Fundamentals",
      "Computer Technology",
      "Object-Oriented Programming",
      "Computer Structure",
      "Databases",
      "Algorithm Analysis and Design",
      "Automata Theory and Formal Languages",
      "Operating Systems",
      "Networks and Distributed Systems",
      "Systems Programming and Concurrency",
      "Computational Techniques for Software Engineering",
      "User Interfaces",
      "Software Maintenance and Testing",
      "Video Game Programming",
      "Security in Services and Applications",
      "Web Application Technologies",
    ],
  },
];

/** Most recent first. */
export const certifications: Certification[] = [
  { name: "German CEFR Level A2", issuer: "Speexx", date: "2023-11" },
  { name: "German A2", issuer: "Language Centre of the University of Málaga (FGUMA)", date: "2022-09" },
  {
    name: "Accelerating End-to-End Data Science Workflows",
    issuer: "NVIDIA Deep Learning Institute",
    date: "2022-02",
    url: "https://learn.nvidia.com/certificates?id=fc4951aab7c6494982c0f4c9e867a64b",
  },
  { name: "Deep Learning and CUDA", issuer: "University of Málaga", date: "2021-09" },
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
    title: "3rd prize – Hackathon Data Challenge",
    issuer: "Polo Digital de Málaga · IAT Metaverso (EDINT project, FEMP & Málaga City Council)",
    date: "2026-05",
    description:
      "With a team of five, built Oleoh: a system that cross-references Málaga's open datasets to find neighbourhoods with high used-cooking-oil generation and few collection points nearby. I worked on the technical development.",
  },
  {
    title: "18 × Matrícula de Honor (highest distinction)",
    issuer: "School of Computer Science, University of Málaga",
    date: "2022-07",
    description:
      "Highest distinction in 18 courses of the Software Engineering degree (2020–2022), most of them with a final grade of 10 / 10.",
  },
];

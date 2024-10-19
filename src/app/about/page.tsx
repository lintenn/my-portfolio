import ExperienceCard from "@/components/ExperienceCard";
import Section from "@/components/Section";
import { H3 } from "@/components/ui/H3";
import { Metadata } from "next";
import {
  Github,
  Code,
  Brain,
  Users,
  Lightbulb,
  MessageCircle,
} from "lucide-react"; // Nuevos íconos
import {
  SiJavascript,
  SiFlask,
  SiTypescript,
  SiSpringboot,
  SiReact,
  SiAngular,
  SiUnity,
  SiNextdotjs,
  SiPython,
  SiDocker,
  SiPostgresql,
  SiMongodb,
  SiTensorflow,
  SiKeras,
  SiPytorch,
  SiAmazonwebservices,
  SiAzuredevops,
} from "react-icons/si"; // Íconos del stack tecnológico

export const metadata: Metadata = {
  title: "About Me",
};

export default function Page() {
  return (
    <Section id="about" title="About Me">
      <div className="space-y-12">
        {/* Introduction */}
        <div>
          <p className="mb-4">
            I am a Full Stack AI Developer with a passion for creating
            innovative solutions. With more than 2 years of professional
            experience, I have been involved in all phases of software
            development with Artificial Intelligence, from concept to delivery.
            I am open to learning new tools, with initiative, perseverance,
            strong problem-solving skills, and effective teamwork abilities.
          </p>
          <p>
            I am from Spain, but I am currently located in Germany and I have
            been working here for more than 2 years.
          </p>
        </div>

        {/* Career */}
        <div>
          <H3 className="mb-4 text-2xl font-bold">Career</H3>
          <ExperienceCard
            title="Software Engineer"
            company="EDAG Group"
            period="September 2022 - Present"
            responsibilities={[
              "Developed a Smart Parking Management System using TensorFlow, YOLO, OpenCV, MQTT, Flask, Express.js and React.",
              "Developed and configured a network of sensors and IP cameras for Smart City use cases.",
              "Participated in the development of an internal Shift Planning Tool using Angular 18, Tailwind CSS with DaisyUI, and Spring Boot with PostgreSQL.",
              "Performed E2E and integration testing on critical systems for chemical recipe and factory management.",
              "Provided support with Azure DevOps, assisting with releases and deployment pipelines.",
            ]}
          />
        </div>

        {/* Education */}
        <div>
          <H3 className="mb-4 text-2xl font-bold">Education</H3>
          <div className="rounded-lg border p-6 shadow">
            <ul className="list-inside list-disc space-y-2">
              <li>
                <strong>Fulda University of Applied Sciences</strong> (2022 -
                2023) - Study Abroad Program in Computer Science
              </li>
              <li>
                <strong>Malaga University</strong> (2019 - 2023) - Software
                Engineering Degree, Finished with honors at 19 courses and an
                average grade of 9.18
              </li>
            </ul>
          </div>
        </div>

        {/* Skills */}
        <div>
          <H3 className="mb-4 text-2xl font-bold">Skills</H3>
          <div className="flex flex-wrap gap-4">
            {/* Hard Skills */}
            <span className="flex items-center space-x-2 text-lg text-gray-700 dark:text-gray-300">
              <Brain className="text-indigo-600 dark:text-indigo-300" />
              <span>AI & Machine Learning</span>
            </span>
            <span className="flex items-center space-x-2 text-lg text-gray-700 dark:text-gray-300">
              <Code className="text-blue-600 dark:text-blue-300" />
              <span>Full Stack Development</span>
            </span>
            <span className="flex items-center space-x-2 text-lg text-gray-700 dark:text-gray-300">
              <Github className="text-gray-900 dark:text-gray-300" />
              <span>Version Control (Git)</span>
            </span>

            {/* Soft Skills */}
            <span className="flex items-center space-x-2 text-lg text-gray-700 dark:text-gray-300">
              <MessageCircle className="text-green-600 dark:text-green-300" />
              <span>Effective Communication</span>
            </span>
            <span className="flex items-center space-x-2 text-lg text-gray-700 dark:text-gray-300">
              <Users className="text-yellow-600 dark:text-yellow-300" />
              <span>Experience in Leadership</span>
            </span>
            <span className="flex items-center space-x-2 text-lg text-gray-700 dark:text-gray-300">
              <Lightbulb className="text-red-600 dark:text-red-300" />
              <span>Critical Thinking</span>
            </span>
          </div>
        </div>

        {/* Stack */}
        <div>
          <H3 className="mb-4 text-2xl font-bold">Tech Stack</H3>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center space-x-2">
              <SiJavascript className="text-yellow-500" size={30} />
              <span>JavaScript</span>
            </div>
            <div className="flex items-center space-x-2">
              <SiTypescript className="text-blue-500" size={30} />
              <span>TypeScript</span>
            </div>
            <div className="flex items-center space-x-2">
              <SiReact className="text-cyan-500" size={30} />
              <span>React</span>
            </div>
            <div className="flex items-center space-x-2">
              <SiAngular className="text-red-600" size={30} />
              <span>Angular</span>
            </div>
            <div className="flex items-center space-x-2">
              <SiNextdotjs size={30} />
              <span>Next.js</span>
            </div>
            <div className="flex items-center space-x-2">
              <SiSpringboot className="text-green-600" size={30} />
              <span>Spring Boot</span>
            </div>
            <div className="flex items-center space-x-2">
              <SiPython className="text-yellow-400" size={30} />
              <span>Python</span>
            </div>
            <div className="flex items-center space-x-2">
              <SiFlask className="" size={30} />
              <span>Flask</span>
            </div>
            <div className="flex items-center space-x-2">
              <SiPostgresql className="text-blue-600" size={30} />
              <span>PostgreSQL</span>
            </div>
            <div className="flex items-center space-x-2">
              <SiMongodb className="text-green-500" size={30} />
              <span>MongoDB</span>
            </div>
            <div className="flex items-center space-x-2">
              <SiDocker className="text-blue-500" size={30} />
              <span>Docker</span>
            </div>
            <div className="flex items-center space-x-2">
              <SiTensorflow className="text-orange-500" size={30} />
              <span>TensorFlow</span>
            </div>
            <div className="flex items-center space-x-2">
              <SiKeras className="text-red-500" size={30} />
              <span>Keras</span>
            </div>
            <div className="flex items-center space-x-2">
              <SiPytorch className="text-orange-500" size={30} />
              <span>PyTorch</span>
            </div>
            <div className="flex items-center space-x-2">
              <SiUnity size={30} />
              <span>Unity</span>
            </div>
            <div className="flex items-center space-x-2">
              <SiAmazonwebservices className="text-orange-500" size={30} />
              <span>Amazon Web Services</span>
            </div>
            <div className="flex items-center space-x-2">
              <SiAzuredevops className="text-blue-500" size={30} />
              <span>Azure DevOps</span>
            </div>
          </div>
        </div>

        {/* Certifications */}
        <div>
          <H3 className="mb-4 text-2xl font-bold">Certifications</H3>
          <ul className="list-inside list-disc space-y-2">
            <li>
              <a
                href="https://learn.nvidia.com/certificates?id=f77d961929ff4c9db4ef7998d6e597ea"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
              >
                Nvidia Certified Fundamentals of Deep Learning
              </a>
            </li>
            <li>
              <a
                href="https://learn.nvidia.com/certificates?id=fc4951aab7c6494982c0f4c9e867a64b"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
              >
                NVIDIA DLI Certificate – Accelerating End-to-End Data Science
                Workflows
              </a>
            </li>
            <li>
              <a
                href="https://learn.nvidia.com/certificates?id=10865bbdeeae432da941845d1f318e37"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
              >
                Nvidia Certified Fundamentals of Accelerated Computing with CUDA
                C/C++
              </a>
            </li>
          </ul>
        </div>

        {/* Languages */}
        <div>
          <H3 className="mb-4 text-2xl font-bold">Languages</H3>
          <ul className="list-inside list-disc space-y-2">
            <li>English (Fluent)</li>
            <li>Spanish (Native)</li>
            <li>German (Conversational)</li>
          </ul>
        </div>

        {/* Hobbies */}
        <div>
          <H3 className="mb-4 text-2xl font-bold">Hobbies</H3>
          <p className="text-gray-600 dark:text-gray-300">
            When I'm not lifting weights at the gym or sharpening my boxing
            skills, you can find me in the kitchen experimenting with new
            recipes. I also love to dance, especially salsa and bachata, where
            rhythm takes over. And when I'm not moving to the beat or perfecting
            a dish, I’m probably battling with German grammar—it’s a fun
            challenge!
          </p>
        </div>
      </div>
    </Section>
  );
}

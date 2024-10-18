import ExperienceCard from "@/components/ExperienceCard";
import Section from "@/components/Section";
import { H3 } from "@/components/ui/H3";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Me",
};

export default function Page() {
  return (
    <Section id="about" title="About Me">
      <div className="space-y-6">
        <p className="text-gray-600">
          I am a Full Stack AI Developer with a passion for creating innovative
          solutions. With more than 2 years of professional experience, I have
          been involved in all phases of software development with Artificial
          Intelligence, from concept to delivery. I am open to learning new
          tools, with initiative, perseverance, strong problem-solving skills,
          and effective teamwork abilities.
        </p>
        <div className="space-b-8">
          <H3 className="mb-2 text-xl font-semibold">Career</H3>
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
        <div>
          <H3 className="mb-2 text-xl font-semibold">Education</H3>
          <ul className="list-inside list-disc space-y-2">
            <li>
              Fulda University of Applied Sciences (2022 - 2023) - Study Abroad
              Program in Computer Science
            </li>
            <li>
              Malaga University (2019 - 2023) - Software Engineering Degree,
              Finished with honors at 19 courses and an average grade of 9.18
            </li>
          </ul>
        </div>
        <div>
          <H3 className="mb-2 text-xl font-semibold">Languages</H3>
          <ul className="list-inside list-disc space-y-2">
            <li>English (Fluent)</li>
            <li>Spanish (Native)</li>
            <li>German (Conversational)</li>
          </ul>
        </div>
        <div>
          <H3 className="mb-2 text-xl font-semibold">Certifications</H3>
          <ul className="list-inside list-disc space-y-2">
            <li>Nvidia Certified Fundamentals of Deep Learning</li>
            <li>
              NVIDIA DLI Certificate - Accelerating End-to-End Data Science
              Workflows
            </li>
            <li>
              Nvidia Certified Fundamentals of Accelerated Computing with CUDA
              C/C++
            </li>
          </ul>
        </div>
      </div>
    </Section>
  );
}

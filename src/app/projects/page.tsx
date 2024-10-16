import ProjectCard from "@/components/ProjectCard";
import Section from "@/components/Section";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
};

export default function Page() {
    return (
        <Section id="projects" title="Projects">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProjectCard
              title="GrateMate (2023)"
              description="Mobile app with Flutter using AI voice control for hands-free cooking assistance and recipe management."
            />
            <ProjectCard
              title="Risto (2022 - 2023)"
              description="Web application for restaurant and reservation management with interactive UI for restaurant map design, online chat, deployed in AWS."
            />
            <ProjectCard
              title="Age Detector (2021 - 2022)"
              description="Age detection system developed using TensorFlow and Keras with CNNs."
              link="https://github.com/lintenn/age detector/blob/main/Age Detector Paper.pdf"
              linkText="View Paper"
            />
          </div>
        </Section>
    )
}
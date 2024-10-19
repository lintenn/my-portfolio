import ProjectCard from "@/components/ProjectCard";
import Section from "@/components/Section";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
};

export default function Page() {
  return (
    <Section id="projects" title="Projects">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <ProjectCard
          title="Age Detector (2021 - 2022)"
          description="Age detection tool developed using TensorFlow and Keras with convolutional neural networks (CNNs) to predict a person's age from a photo."
          challenges="Handling a large dataset of pixelated images, transforming them into a suitable format for training, and fine-tuning the neural network model to achieve accurate predictions."
          results="Successfully developed a functional age prediction model, gaining a deeper understanding of CNNs, image processing, and model optimization techniques. Improved ability to work with large datasets and deploy deep learning models in cloud environments like Colab or AWS."
          githubLink="https://github.com/lintenn/age_detector"
          link="https://github.com/lintenn/age_detector/blob/main/Age_Detector_Paper.pdf"
          linkText="View Paper"
          images={["/age-detector-1.png", "/age-detector-2.png"]}
        />
        <ProjectCard
          title="Smart Space Journey (2022)"
          description="This Unity project combines AI with physics-based control to auto-navigate a spaceship through space, using reinforcement learning to autonomously avoid asteroids, destroy threats with missiles, and engage UFOs."
          challenges="Training the AI to predict and control movement with physical forces, handling real-time decision-making for dodging obstacles and firing missiles, and ensuring realistic physics-based spaceship and missile behavior."
          results="Successfully developed an autonomous navigation AI that adapts to space hazards, effectively dodging or destroying asteroids and pursuing UFOs with guided missiles. Gained experience in AI reinforcement learning, physics-based control, and real-time decision-making in complex environments."
          link="https://github.com/lintenn/SmartSpaceJourney/blob/main/Smart%20Space%20Journey.pdf"
          linkText="View Presentation"
          githubLink="https://github.com/lintenn/SmartSpaceJourney"
          images={[
            "/smart-space-journey-2.png",
            "/smart-space-journey-4.png",
            "/smart-space-journey-6.png",
            "/smart-space-journey-1.png",
            "/smart-space-journey-3.png",
            "/smart-space-journey-5.png",
          ]}
        />
        <ProjectCard
          title="GrateMate (2023)"
          description="Mobile app developed with Flutter to help users cook more efficiently. It allows users to find and save recipes, create shopping lists, and follow step-by-step instructions using voice commands for hands-free navigation."
          challenges="Integrating accurate AI voice recognition with limited resources and creating a user-friendly interface that works smoothly across devices."
          results="Improved hands-free interaction and gained experience in responsive UI design and API integration for better usability."
          githubLink="https://github.com/lintenn/GrateMate"
          images={["/grateMate1.jpg", "/grateMate2.jpg"]}
        />
        <ProjectCard
          title="Risto (2022 - 2023)"
          description="Web application developed with React and Express.js for restaurant and reservation management, featuring an interactive UI for designing restaurant layouts, online chat functionality, and deployed in AWS."
          challenges="Developing an intuitive map design interface and ensuring reliable real-time communication through the chat system."
          results="Successfully created a user-friendly layout tool and improved skills in handling real-time features, as well as AWS deployment and cloud management."
          githubLink="https://github.com/lintenn/GDSD_Team_3"
          images={[
            "/risto-Home-page.png",
            "/risto-Result-details.png",
            "/risto-Search.png",
          ]}
        />
      </div>
    </Section>
  );
}

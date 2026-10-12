import type { IconType } from "react-icons";
import { FaAws, FaJava } from "react-icons/fa6";
import { RiOpenaiFill } from "react-icons/ri";
import {
  SiAngular,
  SiDocker,
  SiFastapi,
  SiFlask,
  SiFlutter,
  SiKeras,
  SiLangchain,
  SiNextdotjs,
  SiOpencv,
  SiPostgresql,
  SiPython,
  SiPytorch,
  SiReact,
  SiSpringboot,
  SiTailwindcss,
  SiTensorflow,
  SiTypescript,
  SiUnity,
  SiVercel,
} from "react-icons/si";
import { VscAzureDevops } from "react-icons/vsc";

/** Technologies shown in the home-page marquee, with their brand colors. */
export const marqueeTech: { name: string; icon: IconType; color?: string }[] = [
  { name: "Python", icon: SiPython, color: "#3776AB" },
  { name: "TypeScript", icon: SiTypescript, color: "#3178C6" },
  { name: "OpenAI", icon: RiOpenaiFill },
  { name: "LangChain", icon: SiLangchain },
  { name: "TensorFlow", icon: SiTensorflow, color: "#FF6F00" },
  { name: "PyTorch", icon: SiPytorch, color: "#EE4C2C" },
  { name: "Keras", icon: SiKeras, color: "#D00000" },
  { name: "OpenCV", icon: SiOpencv, color: "#5C3EE8" },
  { name: "React", icon: SiReact, color: "#58C4DC" },
  { name: "Next.js", icon: SiNextdotjs },
  { name: "Angular", icon: SiAngular, color: "#DD0031" },
  { name: "Flutter", icon: SiFlutter, color: "#02569B" },
  { name: "Tailwind CSS", icon: SiTailwindcss, color: "#06B6D4" },
  { name: "FastAPI", icon: SiFastapi, color: "#009688" },
  { name: "Flask", icon: SiFlask },
  { name: "Spring Boot", icon: SiSpringboot, color: "#6DB33F" },
  { name: "Java", icon: FaJava, color: "#E76F00" },
  { name: "PostgreSQL", icon: SiPostgresql, color: "#4169E1" },
  { name: "Docker", icon: SiDocker, color: "#2496ED" },
  { name: "AWS", icon: FaAws, color: "#FF9900" },
  { name: "Azure DevOps", icon: VscAzureDevops, color: "#0078D7" },
  { name: "Vercel", icon: SiVercel },
  { name: "Unity", icon: SiUnity },
];

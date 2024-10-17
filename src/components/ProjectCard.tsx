import { H3 } from "./ui/H3";

interface ProjectCardProps {
  title: string;
  description: string;
  link?: string;
  linkText?: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description,
  link,
  linkText,
}) => {
  return (
    <div className="rounded-lg border p-6 shadow">
      <H3 className="mb-2 text-xl font-semibold">{title}</H3>
      <p className="mb-4 text-gray-600">{description}</p>
      {link && (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 transition-colors duration-200 hover:text-blue-800"
        >
          {linkText || "Learn More"}
        </a>
      )}
    </div>
  );
};

export default ProjectCard;

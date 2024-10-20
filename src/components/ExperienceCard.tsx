import { H3 } from "./ui/H3";

interface ExperienceCardProps {
  title: string;
  company: string;
  period: string;
  responsibilities: string[];
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({
  title,
  company,
  period,
  responsibilities,
}) => {
  return (
    <div className="rounded-lg border p-6 shadow">
      <H3 className="mb-1 text-xl font-semibold">{title}</H3>
      <p className="mb-2 text-gray-600 dark:text-gray-300">{company}</p>
      <p className="mb-4 text-gray-500 dark:text-gray-400">{period}</p>
      <ul className="list-inside list-disc space-y-2">
        {responsibilities.map((responsibility, index) => (
          <li key={index} className="">
            {responsibility}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExperienceCard;

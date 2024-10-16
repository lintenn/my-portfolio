interface ExperienceCardProps {
    title: string;
    company: string;
    period: string;
    responsibilities: string[];
  }
  
  const ExperienceCard: React.FC<ExperienceCardProps> = ({ title, company, period, responsibilities }) => {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-1">{title}</h3>
        <p className="text-gray-600 mb-2">{company}</p>
        <p className="text-gray-500 mb-4">{period}</p>
        <ul className="list-disc list-inside space-y-2">
          {responsibilities.map((responsibility, index) => (
            <li key={index} className="text-gray-600">{responsibility}</li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default ExperienceCard;
  
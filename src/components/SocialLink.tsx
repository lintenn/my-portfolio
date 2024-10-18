interface SocialLinkProps {
  href: string;
  icon: JSX.Element;
  label: string;
}

const SocialLink: React.FC<SocialLinkProps> = ({ href, icon, label }) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-gray-800 dark:text-gray-400 transition-colors duration-200 hover:text-gray-600 dark:hover:text-gray-300"
    >
      {icon}
      <span className="sr-only">{label}</span>
    </a>
  );
};

export default SocialLink;

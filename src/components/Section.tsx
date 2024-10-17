import { H1 } from "./ui/H1";

interface SectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ id, title, children }) => {
  return (
    <section id={id} className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <H1 className="mb-8 font-extrabold">{title}</H1>
        {children}
      </div>
    </section>
  );
};

export default Section;

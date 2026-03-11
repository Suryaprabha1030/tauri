interface HeadingsProps {
  name: string;
  xlTextSize?: string;
}
const Headings: React.FC<HeadingsProps> = ({ name, xlTextSize }) => {
  return (
    <h1
      className={`px-4 py-2 font-heading max-md:text-[1rem] md:text-xl md:max-xl:px-6 ${xlTextSize}`}
    >
      {name}
    </h1>
  );
};

export default Headings;

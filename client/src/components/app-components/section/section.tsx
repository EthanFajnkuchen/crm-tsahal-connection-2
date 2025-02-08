import React from "react";

interface SectionProps {
  title: string;
  children?: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, children }) => {
  return (
    <div className="bg-white m-3 p-4 rounded-2xl">
      <h1 className="font-[Poppins] font-semibold text-xl mb-4">{title}</h1>
      {children}
    </div>
  );
};

export default Section;

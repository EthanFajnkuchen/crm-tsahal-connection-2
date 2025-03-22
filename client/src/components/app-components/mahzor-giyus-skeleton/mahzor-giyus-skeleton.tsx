import React from "react";
import AccordionSection from "@/components/app-components/accordion-section/accordion-section";

const MahzorGiyusSkeletonSection: React.FC = () => {
  return (
    <AccordionSection title="Chargement...">
      <div className="flex flex-col items-center space-y-6">
        {[1, 2].map((rowIndex) => (
          <div
            key={rowIndex}
            className="grid grid-cols-1 lg:grid-cols-3 gap-x-20 gap-y-8"
          >
            {[1, 2, 3].map((i) => (
              <div key={i}>
                <div className="bg-white rounded-lg shadow-lg overflow-hidden w-80 h-48 flex flex-col items-center border animate-pulse">
                  <div className="flex-grow flex items-center justify-center w-full">
                    <div className="bg-gray-200 h-8 w-20 rounded" />
                  </div>
                  <div className="bg-gray-300 w-full h-12" />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </AccordionSection>
  );
};

export default MahzorGiyusSkeletonSection;

import React from "react";
import ExpertCoCardsSection from "./cards-section/expert-co-cards-sections";
import ExpertCoChartSection from "./charts-section/chart-section";
import StackedBarChartExample from "./charts-by-year-section/charts-by-year-section";

const ExpertConnection: React.FC = () => {
  return (
    <div className="min-h-[90vh]">
      <ExpertCoCardsSection />
      <ExpertCoChartSection />
      <StackedBarChartExample />
    </div>
  );
};

export default ExpertConnection;

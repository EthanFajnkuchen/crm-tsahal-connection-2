import React from "react";
import ExpertCoCardsSection from "./cards-section/expert-co-cards-sections";
import ExpertCoChartSection from "./charts-section/chart-section";

const ExpertConnection: React.FC = () => {
  return (
    <>
      <ExpertCoCardsSection />
      <ExpertCoChartSection />
    </>
  );
};

export default ExpertConnection;

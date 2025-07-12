import React from "react";
import ExpertCoCardsSection from "./cards-section/expert-co-cards-sections";
import ExpertCoChartSection from "./charts-section/chart-section";
import StackedBarChartExample from "./charts-by-year-section/charts-by-year-section";
import ProtectedComponent from "@/components/app-components/protected-component/protected-component";

const ExpertConnection: React.FC = () => {
  return (
    <ProtectedComponent showUnauthorizedMessage={true}>
      <div className="min-h-[90vh]">
        <ExpertCoCardsSection />
        <ExpertCoChartSection />
        <StackedBarChartExample />
      </div>
    </ProtectedComponent>
  );
};

export default ExpertConnection;

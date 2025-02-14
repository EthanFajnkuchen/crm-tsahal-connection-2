import React from "react";
import DashboardCardsSection from "./dashboard-card-section/dashboard-card-section";
import LastTenLeadSection from "./last-ten-leads-section/last-ten-leads-section";
import ChartSection from "./chart-section/chart-section";

const Dashboard: React.FC = () => {
  return (
    <>
      <DashboardCardsSection />
      <LastTenLeadSection />
      <ChartSection />
    </>
  );
};

export default Dashboard;

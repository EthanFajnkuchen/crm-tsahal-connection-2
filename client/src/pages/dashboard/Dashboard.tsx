import React from "react";
import DashboardCardsSection from "./dashboard-card-section/dashboard-card-section";
import LastTenLeadSection from "./last-ten-leads-section/last-ten-leads-section";
import ChartSection from "./chart-section/chart-section";
import ProtectedComponent from "@/components/app-components/protected-component/protected-component";

const Dashboard: React.FC = () => {
  return (
    <>
      <DashboardCardsSection />
      <ProtectedComponent showUnauthorizedMessage={false}>
        <LastTenLeadSection />
        <ChartSection />
      </ProtectedComponent>
    </>
  );
};

export default Dashboard;

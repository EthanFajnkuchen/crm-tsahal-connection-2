import React from "react";
import { DASHBOARD_CARDS_ITEMS } from "@/i18n/dashboard-card";
import CardDashboard from "@/components/app-components/card-dashboard/card-dashboard";
import Section from "@/components/app-components/section/section";

const DashboardCardsSection: React.FC = () => {
  return (
    <Section title={"Statistiques actuelles"}>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 ">
        {DASHBOARD_CARDS_ITEMS.map((card, index) => (
          <CardDashboard
            key={index}
            title={card.displayName}
            number={card.number}
            icon={card.icon}
            className={`${card.bgColor} ${card.textColor}`}
          />
        ))}
      </div>
    </Section>
  );
};

export default DashboardCardsSection;

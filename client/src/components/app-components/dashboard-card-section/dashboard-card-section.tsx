import React from "react";
import { DASHBOARD_CARDS_ITEMS } from "@/i18n/dashboard-card";
import CardDashboard from "../card-dashboard.tsx/card-dashboard";

const DashboardCardsSection: React.FC = () => {
  return (
    <div className="bg-white m-3 p-4 rounded-2xl">
      <h1 className="font-[Poppins] font-semibold text-xl mb-4">
        Statistiques actuelles
      </h1>
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
    </div>
  );
};

export default DashboardCardsSection;

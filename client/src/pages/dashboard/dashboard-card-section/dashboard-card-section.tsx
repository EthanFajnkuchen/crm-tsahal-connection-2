import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchCardLeadsThunk } from "@/store/thunks/dashboard/card-leads.thunk";

import { DASHBOARD_CARDS_ITEMS } from "@/i18n/dashboard-card";
import CardDashboard from "@/components/app-components/card-dashboard/card-dashboard";
import Section from "@/components/app-components/section/section";

const DashboardCardsSection: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    data: cardLeads,
    isLoading,
    error,
  } = useSelector((state: RootState) => state.cardLeads);

  useEffect(() => {
    dispatch(fetchCardLeadsThunk());
  }, [dispatch]);

  return (
    <Section title={"Statistiques actuelles"}>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 ">
        {DASHBOARD_CARDS_ITEMS.map((card, index) => (
          <CardDashboard
            key={index}
            title={card.displayName}
            number={cardLeads ? cardLeads[card.apiKey] : 0}
            icon={card.icon}
            isLoading={isLoading}
            className={`${card.bgColor} ${card.textColor}`}
            error={error}
          />
        ))}
      </div>
    </Section>
  );
};

export default DashboardCardsSection;

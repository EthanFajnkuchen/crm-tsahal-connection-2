import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchCardLeadsThunk } from "@/store/thunks/dashboard/card-leads.thunk";
import { fetchFilteredLeadsThunk } from "@/store/thunks/dashboard/filtered-card-leads.thunk";
import { useNavigate } from "react-router-dom";

import { DASHBOARD_CARDS_ITEMS } from "@/i18n/dashboard-card";
import CardDashboard from "@/components/app-components/card-dashboard/card-dashboard";
import Section from "@/components/app-components/section/section";
import { LeadFilterDto } from "@/store/adapters/dashboard/filtered-card-leads.adapter";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { DataTable } from "@/components/app-components/table/table";
import {
  openPopup,
  closePopup,
} from "@/store/slices/dashboard/card-leads.slice";

const DashboardCardsSection: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchCardLeadsThunk());
  }, [dispatch]);

  const {
    data: cardLeads,
    isLoading,
    error,
    isPopupOpen,
    selectedCardApiKey,
  } = useSelector((state: RootState) => state.cardLeads);

  const selectedCard = selectedCardApiKey
    ? DASHBOARD_CARDS_ITEMS.find((card) => card.apiKey === selectedCardApiKey)
    : null;

  const {
    data: filteredLeads,
    isLoading: isLoadingFiltered,
    error: errorFiltered,
  } = useSelector((state: RootState) => state.filteredLeads);

  console.log(filteredLeads, isLoadingFiltered, errorFiltered);

  const fetchFilteredData = async (apiKey: string) => {
    const selectedCard = DASHBOARD_CARDS_ITEMS.find(
      (card) => card.apiKey === apiKey
    );

    if (selectedCard && selectedCard.filters) {
      const validFilters: LeadFilterDto = {
        included: Object.fromEntries(
          Object.entries(selectedCard.filters.included ?? {}).filter(
            ([_, value]) =>
              Array.isArray(value) && value.every((v) => typeof v === "string")
          )
        ) as Record<string, string[]>,

        excluded: Object.fromEntries(
          Object.entries(selectedCard.filters.excluded ?? {}).filter(
            ([_, value]) =>
              Array.isArray(value) && value.every((v) => typeof v === "string")
          )
        ) as Record<string, string[]>,

        fieldsToSend: selectedCard.filters.fieldsToSend ?? [],
      };

      await dispatch(fetchFilteredLeadsThunk(validFilters));
    }
  };

  const handleCardClick = async (apiKey: string) => {
    await fetchFilteredData(apiKey);
    dispatch(openPopup(apiKey));
  };

  useEffect(() => {
    if (isPopupOpen && selectedCardApiKey) {
      fetchFilteredData(selectedCardApiKey);
    }
  }, [isPopupOpen, selectedCardApiKey, dispatch]);

  const handleRowClick = (lead: any) => {
    if (lead.id) {
      navigate(`/lead-details/${lead.id}`);
    }
  };

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
            onClick={
              card.displayName === "Total"
                ? () => {}
                : () => handleCardClick(card.apiKey)
            }
          />
        ))}
      </div>
      <Dialog
        open={isPopupOpen}
        onOpenChange={(open) => !open && dispatch(closePopup())}
      >
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedCard?.displayName || "Détails"}</DialogTitle>
            <DialogClose />
          </DialogHeader>
          <div className="overflow-auto max-h-[70vh]">
            <DataTable
              columns={selectedCard?.columns || []}
              data={filteredLeads || []}
              isLoading={isLoadingFiltered}
              error={null}
              onRowClick={handleRowClick}
            />
          </div>
        </DialogContent>
      </Dialog>
    </Section>
  );
};

export default DashboardCardsSection;

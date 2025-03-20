import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchExpertCoStatsThunk } from "@/store/thunks/expert-connection/expert-co-stats.thunk";
import { fetchExpertCoFilteredLeadsThunk } from "@/store/thunks/expert-connection/filtered-expert-co-card-leads.thunk";
import { EXPERT_CO_CARD_ITEMS } from "@/i18n/expert-co-card";
import CardDashboard from "@/components/app-components/card-dashboard/card-dashboard";
import Section from "@/components/app-components/section/section";
import { ExpertCoLeadFilterDto } from "@/store/adapters/expert-connection/filtered-expert-co-card-leads.adapter";
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
} from "@/store/slices/expert-connection/expert-co-stats.slice";

const ExpertCoCardsSection: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchExpertCoStatsThunk());
  }, [dispatch]);

  const {
    data: expertCoStats,
    isLoading,
    error,
    isPopupOpen,
    selectedCardApiKey,
  } = useSelector((state: RootState) => state.expertCoStats);

  const selectedCard = selectedCardApiKey
    ? EXPERT_CO_CARD_ITEMS.find((card) => card.apiKey === selectedCardApiKey)
    : null;

  const {
    data: filteredLeads,
    isLoading: isLoadingFiltered,
    error: errorFiltered,
  } = useSelector((state: RootState) => state.expertCoFilteredLeads);

  console.log(filteredLeads, isLoadingFiltered, errorFiltered);

  const fetchFilteredData = async (apiKey: string) => {
    const selectedCard = EXPERT_CO_CARD_ITEMS.find(
      (card) => card.apiKey === apiKey
    );

    if (selectedCard && selectedCard.filters) {
      const validFilters: ExpertCoLeadFilterDto = {
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

      await dispatch(fetchExpertCoFilteredLeadsThunk(validFilters));
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

  const getStatValue = (apiKey: string) => {
    if (apiKey === "expertCoTotal") return expertCoStats?.expertCoTotal ?? 0;
    if (apiKey === "expertCoActuel") return expertCoStats?.expertCoActuel ?? 0;
    return 0;
  };

  return (
    <Section title={"Statistiques Expert Co"}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ">
        {EXPERT_CO_CARD_ITEMS.map((card, index) => (
          <CardDashboard
            key={index}
            title={card.displayName}
            number={getStatValue(card.apiKey)}
            icon={card.icon}
            isLoading={isLoading}
            className={`${card.bgColor} ${card.textColor} `}
            error={error}
            onClick={() => handleCardClick(card.apiKey)}
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
              data={
                selectedCardApiKey === "expertCoActuel"
                  ? filteredLeads?.filter(
                      (lead) =>
                        !lead.giyusDate ||
                        lead.giyusDate > new Date().toISOString().split("T")[0]
                    ) || []
                  : filteredLeads || []
              }
              isLoading={isLoadingFiltered}
              error={null}
            />
          </div>
        </DialogContent>
      </Dialog>
    </Section>
  );
};

export default ExpertCoCardsSection;

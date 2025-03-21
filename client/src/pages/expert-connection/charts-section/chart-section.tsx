import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchProductStatsThunk } from "@/store/thunks/expert-connection/charts.thunk";
import DonutChartComponent from "@/components/app-components/donut-chart/donut-chart";
import Section from "@/components/app-components/section/section";

const ExpertCoChartSection: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchProductStatsThunk(false));
    dispatch(fetchProductStatsThunk(true));
  }, [dispatch]);

  const {
    data: totalStats,
    isLoading: isLoadingTotal,
    error: errorTotal,
  } = useSelector((state: RootState) => state.expertCoChartsTotal);

  const {
    data: currentStats,
    isLoading: isLoadingCurrent,
    error: errorCurrent,
  } = useSelector((state: RootState) => state.expertCoChartsCurrent);

  return (
    <Section title={"Statistiques des Produits Expert Co"}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <DonutChartComponent
          title="Produits - Total"
          data={totalStats || {}}
          isLoading={isLoadingTotal}
          error={errorTotal}
          totalLabel="Total"
        />
        <DonutChartComponent
          title="Produits - Actuels"
          data={currentStats || {}}
          isLoading={isLoadingCurrent}
          error={errorCurrent}
          totalLabel="Actuels"
        />
      </div>
    </Section>
  );
};

export default ExpertCoChartSection;

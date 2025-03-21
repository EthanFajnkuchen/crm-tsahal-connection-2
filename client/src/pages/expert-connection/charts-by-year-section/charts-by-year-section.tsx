import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchExpertCoStatsByYearThunk } from "@/store/thunks/expert-connection/stats-by-year.thunk";
import Section from "@/components/app-components/section/section";
import StackedBarChartComponent from "@/components/app-components/stacked-bar-chart/stacked-bar-chart";

export default function StackedBarChartExample() {
  const dispatch = useDispatch<AppDispatch>();
  const { data, isLoading, error } = useSelector(
    (state: RootState) => state.exportCoStatsByYear
  );

  const [selectedYear, setSelectedYear] = useState<string>("2025");

  useEffect(() => {
    dispatch(fetchExpertCoStatsByYearThunk());
  }, [dispatch]);

  const yearlySummedData = useMemo(() => {
    if (!data) return [];

    return Object.entries(data).map(([year, months]) => {
      let massaTotal = 0;
      let otherTotal = 0;

      Object.values(months).forEach(({ massa, other }) => {
        massaTotal += massa;
        otherTotal += other;
      });

      return {
        year,
        massa: massaTotal,
        other: otherTotal,
      };
    });
  }, [data]);

  const monthlyData = useMemo(() => {
    if (!data || !data[selectedYear]) return [];

    return Object.entries(data[selectedYear])
      .sort(([a], [b]) => Number(a) - Number(b))
      .map(([month, values]) => ({
        month,
        massa: values.massa,
        other: values.other,
      }));
  }, [data, selectedYear]);

  const years = useMemo(() => (data ? Object.keys(data).sort() : []), [data]);

  return (
    <Section title="Statistiques Empilées">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <StackedBarChartComponent
          data={yearlySummedData}
          title="Répartition annuelle des services"
          subtitle="Vue globale par année"
          xKey="year"
          isLoading={isLoading}
          error={error}
        />

        <div className="flex flex-col gap-4">
          <StackedBarChartComponent
            data={monthlyData}
            xKey="month"
            title={`Détail par mois`}
            subtitle="Répartition Massa / Autre"
            showYearSelector
            selectedYear={selectedYear}
            years={years}
            onYearChange={setSelectedYear}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </div>
    </Section>
  );
}

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchDashboardData } from "@/store/thunks/dashboard.thunk";

import BarChartComponent from "@/components/app-components/chart/chart";

const ChartSection: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { monthlyData, yearlyData, isLoading, error } = useSelector(
    (state: RootState) => state.dashboard
  );

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  if (error) return <div>Erreur : {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="w-full">
          <BarChartComponent
            data={monthlyData || {}}
            title="Inscriptions par mois"
            subTitle="Février 2024 - Février 2025"
            color="#e682ff"
            isLoading={isLoading}
          />
        </div>
        <div className="w-full">
          <BarChartComponent
            data={yearlyData || {}}
            title="Inscriptions par an"
            subTitle="2015 - 2025"
            color="#2463EB"
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default ChartSection;

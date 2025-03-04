import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchMonthlyDataThunk } from "@/store/thunks/dashboard/monthly-data.thunk";
import { fetchYearlyDataThunk } from "@/store/thunks/dashboard/yearly-data.thunk";

import BarChartComponent from "@/components/app-components/chart/chart";

const ChartSection: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    data: monthlyData,
    isLoading: isLoadingMonthly,
    error: errorMonthly,
  } = useSelector((state: RootState) => state.monthlyData);

  const {
    data: yearlyData,
    isLoading: isLoadingYearly,
    error: errorYearly,
  } = useSelector((state: RootState) => state.yearlyData);

  useEffect(() => {
    dispatch(fetchMonthlyDataThunk());
    dispatch(fetchYearlyDataThunk());
  }, [dispatch]);

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="w-full">
          <BarChartComponent
            data={monthlyData || {}}
            title="Inscriptions par mois"
            subTitle="Février 2024 - Février 2025"
            color="#b65eee"
            isLoading={isLoadingMonthly}
            error={errorMonthly}
          />
        </div>
        <div className="w-full">
          <BarChartComponent
            data={yearlyData || {}}
            title="Inscriptions par an"
            subTitle="2015 - 2025"
            color="#2463EB"
            isLoading={isLoadingYearly}
            error={errorYearly}
          />
        </div>
      </div>
    </div>
  );
};

export default ChartSection;

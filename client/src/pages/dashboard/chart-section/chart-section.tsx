import React, { useEffect, useMemo } from "react";
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

  // Fonction pour convertir une date YYYY-MM en format lisible (ex: "2024-09" -> "Septembre 2024")
  const formatMonthYear = (dateString: string): string => {
    const monthNames = [
      "Janvier",
      "Février",
      "Mars",
      "Avril",
      "Mai",
      "Juin",
      "Juillet",
      "Août",
      "Septembre",
      "Octobre",
      "Novembre",
      "Décembre",
    ];

    const [year, month] = dateString.split("-");
    const monthIndex = parseInt(month, 10) - 1;

    if (monthIndex >= 0 && monthIndex < 12) {
      return `${monthNames[monthIndex]} ${year}`;
    }

    return dateString;
  };

  const generateMonthlySubtitle = useMemo(() => {
    if (!monthlyData || Object.keys(monthlyData).length === 0) {
      return "Aucune donnée disponible";
    }

    const months = Object.keys(monthlyData).sort();
    if (months.length === 0) return "Aucune donnée disponible";

    const firstMonth = formatMonthYear(months[0]);
    const lastMonth = formatMonthYear(months[months.length - 1]);

    if (firstMonth === lastMonth) {
      return firstMonth;
    }

    return `${firstMonth} - ${lastMonth}`;
  }, [monthlyData]);

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="w-full">
          <BarChartComponent
            data={monthlyData || {}}
            title="Inscriptions par mois"
            subTitle={generateMonthlySubtitle}
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

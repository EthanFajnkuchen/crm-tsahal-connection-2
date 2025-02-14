import React from "react";

import BarChartComponent from "@/components/app-components/chart/chart";
import { monthlyChartData, yearlyChartData } from "@/mock/chart";
const ChartSection: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="w-full">
          <BarChartComponent
            data={monthlyChartData}
            title="Inscription par mois"
            subTitle="Fevrier 2024 - Fevrier 2025"
            color="#e682ff"
          />
        </div>
        <div className="w-full">
          <BarChartComponent
            data={yearlyChartData}
            title="Inscription par an"
            subTitle="2015 - 2025"
            color="#2463EB"
          />
        </div>
      </div>
    </div>
  );
};

export default ChartSection;

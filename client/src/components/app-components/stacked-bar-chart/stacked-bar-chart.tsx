"use client";

import * as React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StackedBarChartProps {
  data: { [key: string]: any; massa: number; other: number }[];
  title: string;
  subtitle?: string;
  xKey: string;
  isLoading?: boolean;
  showYearSelector?: boolean;
  years?: string[];
  selectedYear?: string;
  onYearChange?: (year: string) => void;
  error?: string | null;
}

const StackedBarChartComponent: React.FC<StackedBarChartProps> = ({
  data,
  title,
  subtitle = "",
  xKey,
  showYearSelector,
  years,
  selectedYear,
  onYearChange,
  isLoading = false,
  error = null,
}) => {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const placeholderData = [
    { [xKey]: "A", massa: 20, other: 30 },
    { [xKey]: "B", massa: 40, other: 10 },
  ];

  const chartData = isLoading || error ? placeholderData : data;

  const chartConfig: ChartConfig = {
    massa: {
      label: "Massa",
      color: "#ed5fe8",
    },
    other: {
      label: "Autres",
      color: "#2463EB",
    },
  };

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <CardTitle>{title}</CardTitle>
          {subtitle && <CardDescription>{subtitle}</CardDescription>}
        </div>

        {/* 👇 Dropdown année si demandé */}
        {showYearSelector && years?.length && onYearChange && selectedYear && (
          <Select value={selectedYear} onValueChange={onYearChange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Année" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </CardHeader>

      <CardContent className="pt-2">
        {isMounted && (
          <div className="h-[300px] w-full">
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey={xKey}
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                  />
                  <YAxis tickLine={false} axisLine={false} tickMargin={10} />
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar
                    dataKey="massa"
                    stackId="a"
                    fill="var(--color-massa)"
                    radius={[0, 0, 4, 4]}
                  />
                  <Bar
                    dataKey="other"
                    stackId="a"
                    fill="var(--color-other)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StackedBarChartComponent;

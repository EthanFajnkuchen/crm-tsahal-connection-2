import * as React from "react";
import { Cell, Label, Pie, PieChart, Tooltip } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { type ChartConfig, ChartContainer } from "@/components/ui/chart";
import { LABELS_MAP } from "@/i18n/labels-map";

interface DonutChartProps {
  data: Record<string, number>;
  title: string;
  subtitle?: string;
  totalLabel?: string;
  isLoading?: boolean;
  error?: string | null;
}

const COLORS = [
  "#4F46E5",
  "#6366F1",
  "#7C3AED",
  "#EC4899",
  "#14B8A6",
  "#F59E0B",
  "#10B981",
  "#EF4444",
];

const DonutChartComponent: React.FC<DonutChartProps> = ({
  data,
  title,
  subtitle = "",
  totalLabel = "Total",
  isLoading = false,
  error = null,
}) => {
  const chartData = React.useMemo(() => {
    return Object.entries(data).map(([key, value], index) => ({
      name: LABELS_MAP[key] || key,
      value: value,
      fill: COLORS[index % COLORS.length],
    }));
  }, [data]);

  const chartConfig: ChartConfig = React.useMemo(() => {
    const config: any = {
      value: {
        label: totalLabel,
      },
    };

    Object.keys(data).forEach((key, index) => {
      config[index + 1] = {
        label: LABELS_MAP[key] || key,
        color: COLORS[index % COLORS.length],
      };
    });

    return config;
  }, [data, totalLabel]);

  const totalValue = React.useMemo(() => {
    return Object.values(data).reduce((acc, curr) => acc + curr, 0);
  }, [data]);

  const placeholderData = [{ name: "Loading", value: 100, fill: COLORS[0] }];

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>{title}</CardTitle>
        {subtitle && <CardDescription>{subtitle}</CardDescription>}
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[400px] w-full"
        >
          <PieChart width={500} height={500}>
            <Tooltip
              content={({ payload }) =>
                payload && payload.length ? (
                  <div className="bg-white p-2 shadow-md rounded-md text-sm">
                    {payload.map((entry, index) => (
                      <div key={index} className="text-gray-800">
                        <span
                          className="font-semibold"
                          style={{ color: entry.color }}
                        >
                          {entry.name}:{" "}
                          {entry.value && entry.value.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : null
              }
            />
            <Pie
              data={isLoading || error ? placeholderData : chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={80}
              outerRadius={120}
              fill="#8884d8"
              paddingAngle={2}
            >
              {chartData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  className="cursor-pointer"
                />
              ))}
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {isLoading || error
                            ? "..."
                            : totalValue.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Suivis / Services
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default DonutChartComponent;

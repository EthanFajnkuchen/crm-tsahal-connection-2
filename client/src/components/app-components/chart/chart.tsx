import React from "react";
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
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Progress } from "@/components/ui/progress";

interface BarChartComponentProps {
  data: Record<string, number>;
  title: string;
  subTitle: string;
  color: string;
  isLoading?: boolean;
}

const chartConfig = {
  value: {
    label: "Value",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const BarChartComponent: React.FC<BarChartComponentProps> = ({
  data,
  title,
  subTitle,
  color,
  isLoading = false,
}) => {
  const transformedData = Object.entries(data).map(([date, value]) => ({
    date,
    value,
  }));

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">{title}</CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          {subTitle}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Progress value={50} className="w-full" />
        ) : (
          <ChartContainer
            config={chartConfig}
            className="h-[200px] sm:h-[300px] lg:h-[250px] xl:h-[300px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={transformedData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 10 }}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.getMonth() === 0 && date.getDate() === 1
                      ? date.getFullYear().toString()
                      : `${date.toLocaleString("default", {
                          month: "short",
                        })} ${date.getFullYear().toString().slice(2)}`;
                  }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  width={30}
                  tick={{ fontSize: 10 }}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default BarChartComponent;

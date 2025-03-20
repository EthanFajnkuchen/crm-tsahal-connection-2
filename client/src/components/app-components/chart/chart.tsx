  import React from "react";
  import {
    Bar,
    BarChart,
    CartesianGrid,
    XAxis,
    YAxis,
    ResponsiveContainer,
    Cell,
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
  import { Skeleton } from "@/components/ui/skeleton";

  interface BarChartComponentProps {
    data: Record<string, number>;
    title: string;
    subTitle: string;
    color: string;
    isLoading?: boolean;
    error?: string | null;
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
    error,
  }) => {
    const transformedData = Object.entries(data).map(([date, value]) => ({
      date,
      value,
    }));

    console.log(error);

    const placeholderData = Array(5).fill({ date: "2025-01-01", value: 3 });

    return (
      <Card className="w-full h-full">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">{title}</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            {subTitle}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={chartConfig}
            className="h-[200px] sm:h-[300px] lg:h-[250px] xl:h-[300px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={isLoading || error ? placeholderData : transformedData}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 10 }}
                  tickFormatter={(value) => {
                    if (!value) return "";
                    const date = new Date(value);
                    if (isNaN(date.getTime())) return "N/A";
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
                <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]}>
                  {isLoading || error
                    ? placeholderData.map((_, index) => (
                        <Cell key={index} fill="#E0E0E0">
                          <Skeleton className="h-[80px] w-full" />
                        </Cell>
                      ))
                    : null}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    );
  };

  export default BarChartComponent;

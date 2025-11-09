"use client";

import * as React from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/common/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/common/components/ui/chart";
import type { ChartConfig } from "~/common/components/ui/chart";
import { cn } from "~/lib/utils";

type ChartSeries = {
  key: string;
  type?: "monotone" | "linear" | "basis" | "natural" | "step";
  strokeDasharray?: string;
  dot?: boolean;
};

type ProjectAnalyticsChartProps = {
  title: string;
  description?: React.ReactNode;
  data: Array<Record<string, number | string>>;
  config: ChartConfig;
  series: ChartSeries[];
  xDataKey: string;
  yTickFormatter?: (value: number) => string;
  tooltipLabelFormatter?: (value: string | number) => string;
  tooltipValueFormatter?: (value: number, seriesKey: string) => React.ReactNode;
  className?: string;
  chartClassName?: string;
};

export function ProjectAnalyticsChart(props: ProjectAnalyticsChartProps) {
  const {
    title,
    description,
    data,
    config,
    series,
    xDataKey,
    yTickFormatter,
    tooltipLabelFormatter,
    tooltipValueFormatter,
    className,
    chartClassName,
  } = props;

  const defaultTooltipValueFormatter = React.useCallback(
    (value: number, seriesKey: string) => {
      const label = config[seriesKey]?.label ?? seriesKey;
      return (
        <div className="flex w-full items-center justify-between">
          <span>{label}</span>
          <span className="font-medium">
            ₩ {Number(value).toLocaleString()}
          </span>
        </div>
      );
    },
    [config]
  );

  return (
    <Card
      className={cn("md:col-start-1 md:row-span-2 md:row-start-2", className)}
    >
      <CardHeader className="pb-0">
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent className={cn("px-0 pb-0", chartClassName)}>
        <ChartContainer config={config} className="h-[280px] w-full">
          <LineChart
            data={data}
            margin={{ left: 8, right: 16, top: 16, bottom: 16 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey={xDataKey} tickLine={false} axisLine={false} />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) =>
                yTickFormatter ? yTickFormatter(value) : value.toString()
              }
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(value) =>
                    tooltipLabelFormatter
                      ? tooltipLabelFormatter(value as string | number)
                      : String(value)
                  }
                  formatter={(value, _name, item) =>
                    (tooltipValueFormatter ?? defaultTooltipValueFormatter)(
                      Number(value),
                      String(item?.dataKey ?? "")
                    )
                  }
                />
              }
            />
            {series.map(({ key, type = "monotone", strokeDasharray, dot }) => {
              const label = config[key]?.label;
              const lineName =
                typeof label === "string" ? label : key.toString();

              return (
                <Line
                  key={key}
                  type={type}
                  dataKey={key}
                  stroke={`var(--color-${key})`}
                  strokeDasharray={strokeDasharray}
                  strokeWidth={2}
                  dot={dot ?? false}
                  name={lineName}
                />
              );
            })}
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export type { ProjectAnalyticsChartProps };

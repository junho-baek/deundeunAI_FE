import { TrendingUp, BarChart3, GaugeCircle, type LucideIcon } from "lucide-react";
import { Suspense } from "react";
import { Await } from "react-router";
import { DashboardStatCard } from "./dashboard-stat-card";

export type StatCardData = {
  id: string;
  label: string;
  value: string;
  delta: string;
  trend: "up" | "down" | "neutral";
  icon: LucideIcon;
};

export type MetricWidget = {
  widget_id: string;
  profile_id?: string;
  widget_key?: string;
  title: string;
  position: number;
  size?: string | null;
  config: Record<string, unknown>;
  is_pinned?: boolean;
  created_at?: string;
  updated_at?: string;
};

export type DashboardStatsGridProps = {
  stats: {
    totalLikes: number;
    totalViews: number;
    averageCTR: number;
    totalBudget: number;
    projectCount: number;
  };
  metricWidgets: Promise<MetricWidget[]>;
  formatCurrency: (amount: number) => string;
  className?: string;
};

function StatsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="h-32 w-full animate-pulse rounded-lg bg-muted"
        />
      ))}
    </div>
  );
}

function getQuickStats(
  stats: DashboardStatsGridProps["stats"],
  metricWidgets: MetricWidget[],
  formatCurrency: (amount: number) => string,
  iconMap: Record<string, LucideIcon>
): StatCardData[] {
  if (metricWidgets.length > 0) {
    return metricWidgets
      .sort((a, b) => a.position - b.position)
      .map((widget) => {
        const config = widget.config as {
          value?: string | number;
          delta?: string;
          trend?: "up" | "down" | "neutral";
          icon?: string;
          format?: "currency" | "percent" | "number";
        };

        const Icon = iconMap[config.icon || "TrendingUp"] || iconMap.TrendingUp;
        const trend = (config.trend || "neutral") as "up" | "down" | "neutral";

        let value = config.value?.toString() || "0";
        if (typeof config.value === "number") {
          if (
            config.format === "currency" ||
            widget.title.includes("매출") ||
            widget.title.includes("수익")
          ) {
            value = formatCurrency(config.value);
          } else if (
            config.format === "percent" ||
            widget.title.includes("전환율") ||
            widget.title.includes("CTR")
          ) {
            value = `${config.value}%`;
          } else {
            value = config.value.toLocaleString();
          }
        }

        return {
          id: widget.widget_id,
          label: widget.title,
          value,
          delta: config.delta || "",
          trend,
          icon: Icon,
        };
      });
  }

  return [
    {
      id: "revenue",
      label: "이번 주 예상 매출",
      value: formatCurrency(stats.totalBudget || 4380000),
      delta: "지난주 대비 +18%",
      trend: "up" as const,
      icon: iconMap.TrendingUp,
    },
    {
      id: "conversion",
      label: "주요 전환율",
      value:
        stats.averageCTR > 0
          ? `${(stats.averageCTR * 100).toFixed(1)}%`
          : "3.8%",
      delta: "AI 프리셋 적용 후 +0.6pp",
      trend: "up" as const,
      icon: iconMap.BarChart3,
    },
    {
      id: "runtime",
      label: "자동화 실행 시간 절감",
      value: "42분",
      delta: "예상 대비 -12분",
      trend: "down" as const,
      icon: iconMap.GaugeCircle,
    },
  ];
}

export function DashboardStatsGrid({
  stats,
  metricWidgets,
  formatCurrency,
  className,
}: DashboardStatsGridProps) {
  return (
    <Suspense fallback={<StatsSkeleton />}>
      <Await resolve={metricWidgets}>
        {(resolvedMetricWidgets) => {
          const iconMap: Record<string, LucideIcon> = {
            TrendingUp,
            BarChart3,
            GaugeCircle,
          };
          
          return (
            <div className={`grid gap-4 md:grid-cols-3 ${className ?? ""}`}>
              {getQuickStats(stats, resolvedMetricWidgets ?? [], formatCurrency, iconMap).map(
                (stat) => (
                  <DashboardStatCard
                    key={stat.id}
                    label={stat.label}
                    value={stat.value}
                    delta={stat.delta}
                    trend={stat.trend}
                    icon={stat.icon}
                  />
                )
              )}
            </div>
          );
        }}
      </Await>
    </Suspense>
  );
}


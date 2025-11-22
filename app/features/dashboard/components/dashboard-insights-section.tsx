import { Suspense } from "react";
import { Await } from "react-router";
import { DashboardInsightsCard } from "./dashboard-insights-card";

export type InsightItem = {
  title: string;
  description: string;
};

export type DashboardInsightsSectionProps = {
  title?: string;
  description?: string;
  insights: Promise<InsightItem[]>;
  defaultInsights: InsightItem[];
  className?: string;
};

function InsightsSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="h-20 w-full animate-pulse rounded-lg bg-muted"
        />
      ))}
    </div>
  );
}

export function DashboardInsightsSection({
  title = "AI 인사이트",
  description = "수익 보장형 프리셋을 실행하면 바로 체감할 변화예요.",
  insights,
  defaultInsights,
  className,
}: DashboardInsightsSectionProps) {
  return (
    <Suspense fallback={<InsightsSkeleton />}>
      <Await resolve={insights}>
        {(resolvedInsights) => {
          const displayInsights =
            resolvedInsights && resolvedInsights.length > 0
              ? resolvedInsights
              : defaultInsights;
          return (
            <DashboardInsightsCard
              title={title}
              description={description}
              items={displayInsights}
              className={className}
            />
          );
        }}
      </Await>
    </Suspense>
  );
}


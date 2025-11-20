import { TrendingUp, TrendingDown } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/common/components/ui/card";

export type ProjectPerformanceSummaryProps = {
  title?: string;
  description?: string;
  actualRevenue: number;
  expectedRevenue: number;
  className?: string;
};

export function ProjectPerformanceSummary({
  title = "성과 요약",
  description = "실제 수익과 예상 수익의 차이",
  actualRevenue,
  expectedRevenue,
  className,
}: ProjectPerformanceSummaryProps) {
  const variance = actualRevenue - expectedRevenue;
  const isPositive = variance >= 0;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold md:text-xl">
          {title}
        </CardTitle>
        <CardDescription className="text-base leading-relaxed text-muted-foreground">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between rounded-lg border px-3 py-2">
          <div className="flex items-center gap-2 text-base text-muted-foreground">
            <span>실제 수익 합계</span>
          </div>
          <span className="text-lg font-semibold">
            ₩ {actualRevenue.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center justify-between rounded-lg border px-3 py-2">
          <div className="flex items-center gap-2 text-base text-muted-foreground">
            <span>예상 수익 합계</span>
          </div>
          <span className="text-lg font-semibold">
            ₩ {expectedRevenue.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center justify-between rounded-lg border px-3 py-2">
          <div className="flex items-center gap-2 text-base text-muted-foreground">
            {isPositive ? (
              <TrendingUp className="size-4 text-emerald-500" />
            ) : (
              <TrendingDown className="size-4 text-rose-500" />
            )}
            <span>
              {isPositive ? "예상 대비 초과 달성" : "예상 대비 미달"}
            </span>
          </div>
          <span
            className={`text-lg font-semibold ${
              isPositive ? "text-emerald-600" : "text-rose-600"
            }`}
          >
            {isPositive ? "+" : "-"}₩ {Math.abs(variance).toLocaleString()}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}


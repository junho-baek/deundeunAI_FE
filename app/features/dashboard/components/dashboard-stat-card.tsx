import { type LucideIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/common/components/ui/card";

export type DashboardStatCardProps = {
  label: string;
  value: string;
  delta: string;
  trend: "up" | "down" | "neutral";
  icon: LucideIcon;
  className?: string;
};

export function DashboardStatCard({
  label,
  value,
  delta,
  trend,
  icon: Icon,
  className,
}: DashboardStatCardProps) {
  const trendColor =
    trend === "up"
      ? "text-emerald-600"
      : trend === "down"
        ? "text-sky-600"
        : "text-muted-foreground";

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardDescription>{label}</CardDescription>
        <span className="rounded-full bg-muted p-2 text-primary">
          <Icon className="size-4" aria-hidden="true" />
        </span>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        <CardTitle className="text-2xl font-semibold">{value}</CardTitle>
        <span className={`text-sm font-medium ${trendColor}`}>{delta}</span>
      </CardContent>
    </Card>
  );
}


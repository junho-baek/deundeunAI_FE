import { CheckCircle2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/common/components/ui/card";

export type InsightItem = {
  title: string;
  description: string;
};

export type DashboardInsightsCardProps = {
  title?: string;
  description?: string;
  items: InsightItem[];
  className?: string;
};

export function DashboardInsightsCard({
  title = "AI 인사이트",
  description,
  items,
  className,
}: DashboardInsightsCardProps) {
  return (
    <Card className={`h-fit ${className ?? ""}`}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {items.map((item, index) => (
          <div key={`${item.title}-${index}`} className="flex items-start gap-3">
            <CheckCircle2
              className="mt-1 size-4 text-primary"
              aria-hidden="true"
            />
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">
                {item.title}
              </p>
              <p className="text-sm text-muted-foreground">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}


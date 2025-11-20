import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/common/components/ui/card";
import { Typography } from "~/common/components/typography";

export type InsightItem = {
  id: string | number;
  text: string;
};

export type ProjectInsightsListProps = {
  title: string;
  description: string;
  items: InsightItem[];
  emptyMessage?: string;
  dotColor?: string;
  className?: string;
};

export function ProjectInsightsList({
  title,
  description,
  items,
  emptyMessage = "데이터가 없습니다.",
  dotColor = "bg-emerald-500",
  className,
}: ProjectInsightsListProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-foreground">
          {title}
        </CardTitle>
        <CardDescription className="text-base leading-relaxed text-muted-foreground">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {items.length > 0 ? (
          <ul className="space-y-3 text-base leading-relaxed text-foreground">
            {items.map((item) => (
              <li key={item.id} className="flex gap-2">
                <span
                  className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${dotColor}`}
                />
                <Typography
                  as="span"
                  variant="p"
                  className="text-base leading-relaxed text-muted-foreground not-first:mt-0"
                >
                  {item.text}
                </Typography>
              </li>
            ))}
          </ul>
        ) : (
          <Typography variant="muted" className="text-center py-4">
            {emptyMessage}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}


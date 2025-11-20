import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/common/components/ui/card";

export type ProjectMetricCardProps = {
  label: string;
  value: string | number;
  className?: string;
};

export function ProjectMetricCard({
  label,
  value,
  className,
}: ProjectMetricCardProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base font-medium text-muted-foreground">
          {label}
        </CardTitle>
        <CardDescription className="text-2xl font-semibold text-foreground">
          {typeof value === "number" ? value.toLocaleString() : value}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}


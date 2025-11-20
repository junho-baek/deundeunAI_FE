import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/common/components/ui/card";

export type ProjectRevenueHeaderProps = {
  title?: string;
  description?: string;
  amount: number;
  suffix?: string;
  className?: string;
};

export function ProjectRevenueHeader({
  title = "이번 달 예상 수익",
  description = "11월 기준 예상 수익과 실적 비교",
  amount,
  suffix = "(누적 실제)",
  className,
}: ProjectRevenueHeaderProps) {
  return (
    <Card className={`bg-muted ${className ?? ""}`}>
      <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle className="text-lg font-semibold md:text-xl">
            {title}
          </CardTitle>
          <CardDescription className="text-base leading-relaxed text-muted-foreground">
            {description}
          </CardDescription>
        </div>
        <div className="flex items-baseline gap-3 text-3xl font-semibold">
          <span>₩ {amount.toLocaleString()}</span>
          <span className="text-base font-normal text-muted-foreground">
            {suffix}
          </span>
        </div>
      </CardHeader>
    </Card>
  );
}


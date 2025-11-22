import { Check } from "lucide-react";
import { Link } from "react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/common/components/ui/card";
import { Button } from "~/common/components/ui/button";
import { cn } from "~/lib/utils";

export interface PricingPlanCardProps {
  name: string;
  price: string;
  period: string;
  description: string;
  cta: string;
  to: string;
  highlight: boolean;
  badge?: string;
  features: readonly string[];
  monthlyCredits?: number;
  onSubscribe?: (planName: string) => void;
}

export function PricingPlanCard({
  name,
  price,
  period,
  description,
  cta,
  to,
  highlight,
  badge,
  features,
  monthlyCredits,
  onSubscribe,
}: PricingPlanCardProps) {
  const handleClick = () => {
    if (onSubscribe && !to.startsWith("mailto:")) {
      onSubscribe(name);
    }
  };

  return (
    <Card
      className={cn(
        "relative flex flex-col justify-between border-muted",
        highlight &&
          "border-primary/70 shadow-lg shadow-primary/10 ring-2 ring-primary/10"
      )}
    >
      {badge ? (
        <span
          className={cn(
            "absolute right-4 top-4 inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary",
            highlight && "bg-primary text-primary-foreground"
          )}
        >
          {badge}
        </span>
      ) : null}
      <CardHeader className="items-start gap-4">
        <CardTitle className="text-2xl font-bold">{name}</CardTitle>
        <CardDescription className="text-sm leading-relaxed">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-left">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold">{price}</span>
            <span className="text-muted-foreground text-sm">{period}</span>
          </div>
          {monthlyCredits !== undefined && monthlyCredits > 0 && (
            <div className="mt-2 text-sm text-muted-foreground">
              매달 {monthlyCredits.toLocaleString()} 크레딧 지급
            </div>
          )}
        </div>
        <ul className="space-y-3 text-sm">
          {features.map((feature) => (
            <li key={feature} className="flex items-center gap-2">
              <Check className="size-4 text-primary" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        {to.startsWith("mailto:") ? (
          <Button asChild className="w-full" size="lg" variant="outline">
            <a href={to}>{cta}</a>
          </Button>
        ) : (
          <Button
            asChild
            className={cn("w-full", highlight && "bg-primary")}
            size="lg"
            onClick={handleClick}
          >
            <Link to={to}>{cta}</Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

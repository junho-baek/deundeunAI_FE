import { type LucideIcon } from "lucide-react";
import { Button } from "~/common/components/ui/button";
import { Typography } from "~/common/components/typography";

export type DashboardHeroAction = {
  label: string;
  href: string;
  variant?: "default" | "outline";
  icon?: LucideIcon;
};

export type DashboardHeroProps = {
  badge?: {
    icon?: LucideIcon;
    text: string;
  };
  title: string;
  description: string;
  primaryAction?: DashboardHeroAction;
  secondaryAction?: DashboardHeroAction;
  className?: string;
};

export function DashboardHero({
  badge,
  title,
  description,
  primaryAction,
  secondaryAction,
  className,
}: DashboardHeroProps) {
  const BadgeIcon = badge?.icon;

  return (
    <header
      className={`relative overflow-hidden rounded-3xl border bg-linear-to-br from-primary/10 via-primary/5 to-transparent px-8 py-10 shadow-sm ${className ?? ""}`}
    >
      <div className="flex flex-col gap-4">
        {badge && (
          <span className="flex items-center gap-2 text-sm font-medium text-primary">
            {BadgeIcon && <BadgeIcon className="size-4" aria-hidden="true" />}
            {badge.text}
          </span>
        )}
        <Typography
          as="h1"
          variant="h3"
          className="text-balance text-3xl font-semibold leading-tight text-foreground md:text-4xl"
        >
          {title}
        </Typography>
        <Typography
          as="p"
          variant="lead"
          className="max-w-2xl text-base text-muted-foreground md:text-lg"
        >
          {description}
        </Typography>
        {(primaryAction || secondaryAction) && (
          <div className="flex flex-wrap gap-3 pt-2">
            {primaryAction && (
              <Button size="lg" className="gap-2" asChild>
                <a href={primaryAction.href}>
                  {primaryAction.label}
                  {primaryAction.icon && (
                    <primaryAction.icon className="size-4" aria-hidden="true" />
                  )}
                </a>
              </Button>
            )}
            {secondaryAction && (
              <Button size="lg" variant={secondaryAction.variant ?? "outline"} asChild>
                <a href={secondaryAction.href}>{secondaryAction.label}</a>
              </Button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}


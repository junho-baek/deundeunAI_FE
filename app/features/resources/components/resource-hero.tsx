import { type LucideIcon } from "lucide-react";
import * as React from "react";
import { Link } from "react-router";
import { Button } from "~/common/components/ui/button";
import { Typography } from "~/common/components/typography";
import { cn } from "~/lib/utils";

type ResourceHeroProps = {
  badgeLabel: string;
  badgeIcon?: LucideIcon;
  title: string;
  description: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  primaryCtaVariant?: "default" | "outline" | "secondary" | "ghost";
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  secondaryCtaVariant?: "default" | "outline" | "secondary" | "ghost";
  containerMaxWidthClass?: string;
  blurHeightClass?: string;
  descriptionMaxWidthClass?: string;
  showPlaceholder?: boolean;
  placeholderWrapperClass?: string;
  placeholderClassName?: string;
  placeholderCaption?: string;
  placeholderCaptionClassName?: string;
  extraContent?: React.ReactNode;
};

export function ResourceHero({
  badgeLabel,
  badgeIcon: BadgeIcon,
  title,
  description,
  primaryCtaLabel,
  primaryCtaHref,
  primaryCtaVariant = "default",
  secondaryCtaLabel,
  secondaryCtaHref,
  secondaryCtaVariant = "outline",
  containerMaxWidthClass = "max-w-5xl",
  blurHeightClass = "h-72",
  descriptionMaxWidthClass = "max-w-3xl",
  showPlaceholder = false,
  placeholderWrapperClass = "w-full max-w-4xl rounded-3xl border border-dashed border-muted/40 bg-linear-to-br from-muted/20 via-background to-muted/40 p-1",
  placeholderClassName = "aspect-video w-full rounded-[calc(var(--radius-3xl)-4px)] bg-background/80",
  placeholderCaption,
  placeholderCaptionClassName = "text-xs text-muted-foreground",
  extraContent,
}: ResourceHeroProps) {
  return (
    <section className="relative overflow-hidden border-b">
      <div
        className={cn(
          "absolute inset-x-0 top-0 mx-auto max-w-6xl rounded-full bg-primary/10 blur-3xl",
          blurHeightClass
        )}
      />
      <div
        className={cn(
          "relative mx-auto flex flex-col gap-8 px-6 pb-16 pt-24 text-center md:pt-28",
          containerMaxWidthClass
        )}
      >
        <span className="inline-flex items-center gap-2 self-center rounded-full border border-primary/30 bg-primary/15 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
          {BadgeIcon ? <BadgeIcon className="size-4" /> : null}
          {badgeLabel}
        </span>
        <Typography variant="h1" className="text-balance text-4xl md:text-5xl">
          {title}
        </Typography>
        <Typography
          variant="lead"
          className={cn("mx-auto text-muted-foreground", descriptionMaxWidthClass)}
        >
          {description}
        </Typography>
        {(primaryCtaLabel && primaryCtaHref) || (secondaryCtaLabel && secondaryCtaHref) ? (
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            {primaryCtaLabel && primaryCtaHref ? (
              <Button asChild size="lg" variant={primaryCtaVariant}>
                <LinkOrAnchor href={primaryCtaHref}>{primaryCtaLabel}</LinkOrAnchor>
              </Button>
            ) : null}
            {secondaryCtaLabel && secondaryCtaHref ? (
              <Button asChild size="lg" variant={secondaryCtaVariant}>
                <LinkOrAnchor href={secondaryCtaHref}>{secondaryCtaLabel}</LinkOrAnchor>
              </Button>
            ) : null}
          </div>
        ) : null}
        {extraContent}
        {showPlaceholder ? (
          <>
            <div className={placeholderWrapperClass}>
              <div className={placeholderClassName} />
            </div>
            {placeholderCaption ? (
              <Typography variant="muted" className={placeholderCaptionClassName}>
                {placeholderCaption}
              </Typography>
            ) : null}
          </>
        ) : null}
      </div>
    </section>
  );
}

type LinkOrAnchorProps = {
  href: string;
  children: React.ReactNode;
};

function LinkOrAnchor({ href, children }: LinkOrAnchorProps) {
  const isMailto = href.startsWith("mailto:");
  if (isMailto) {
    return (
      <a href={href} className="inline-flex items-center gap-2">
        {children}
      </a>
    );
  }
  return (
    <Link to={href} className="inline-flex items-center gap-2">
      {children}
    </Link>
  );
}


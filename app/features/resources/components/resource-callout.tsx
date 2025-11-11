import * as React from "react";
import { Button } from "~/common/components/ui/button";
import { Typography } from "~/common/components/typography";
import { cn } from "~/lib/utils";
import { Link } from "react-router";

type ResourceCalloutProps = {
  title: string;
  description?: React.ReactNode;
  align?: "left" | "center";
  titleVariant?: "h2" | "h3";
  descriptionMaxWidthClass?: string;
  containerClassName?: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  primaryCtaVariant?: "default" | "outline" | "secondary" | "ghost";
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  secondaryCtaVariant?: "default" | "outline" | "secondary" | "ghost";
  extraContent?: React.ReactNode;
  footnote?: React.ReactNode;
};

export function ResourceCallout({
  title,
  description,
  align = "center",
  titleVariant = "h3",
  descriptionMaxWidthClass,
  containerClassName,
  primaryCtaLabel,
  primaryCtaHref,
  primaryCtaVariant = "default",
  secondaryCtaLabel,
  secondaryCtaHref,
  secondaryCtaVariant = "ghost",
  extraContent,
  footnote,
}: ResourceCalloutProps) {
  const isCenter = align === "center";
  const resolvedDescriptionWidth =
    descriptionMaxWidthClass ?? (isCenter ? "max-w-3xl" : "max-w-2xl");

  const hasPrimary = primaryCtaLabel && primaryCtaHref;
  const hasSecondary = secondaryCtaLabel && secondaryCtaHref;

  return (
    <div
      className={cn(
        "rounded-3xl border border-muted/40 bg-background/80 p-10 shadow-xl backdrop-blur",
        isCenter ? "text-center" : "text-left",
        containerClassName
      )}
    >
      <Typography variant={titleVariant} className="text-3xl">
        {title}
      </Typography>
      {description ? (
        <Typography
          variant="muted"
          className={cn(
            "mx-auto mt-4 text-sm text-muted-foreground",
            resolvedDescriptionWidth,
            isCenter ? "mx-auto" : "mx-0"
          )}
        >
          {description}
        </Typography>
      ) : null}
      {extraContent ? <div className="mt-8">{extraContent}</div> : null}
      {hasPrimary || hasSecondary ? (
        <div
          className={cn(
            "mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row",
            !isCenter && "sm:justify-start"
          )}
        >
          {hasPrimary ? (
            <Button asChild size="lg" variant={primaryCtaVariant}>
              <Link to={primaryCtaHref!}>{primaryCtaLabel}</Link>
            </Button>
          ) : null}
          {hasSecondary ? (
            <Button asChild size="lg" variant={secondaryCtaVariant}>
              <Link to={secondaryCtaHref!}>{secondaryCtaLabel}</Link>
            </Button>
          ) : null}
        </div>
      ) : null}
      {footnote ? <div className="mt-6">{footnote}</div> : null}
    </div>
  );
}

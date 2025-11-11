import { Typography } from "~/common/components/typography";
import { cn } from "~/lib/utils";

type ResourceSectionHeaderProps = {
  title: string;
  description?: string;
  align?: "left" | "center";
  eyebrow?: string;
  titleVariant?: "h2" | "h3" | "h4";
  className?: string;
  descriptionMaxWidthClass?: string;
};

export function ResourceSectionHeader({
  title,
  description,
  align = "center",
  eyebrow,
  titleVariant = "h3",
  className,
  descriptionMaxWidthClass,
}: ResourceSectionHeaderProps) {
  const isCenter = align === "center";
  const resolvedDescriptionWidth =
    descriptionMaxWidthClass ?? (isCenter ? "max-w-2xl" : "max-w-3xl");

  return (
    <div
      className={cn(
        "space-y-3",
        className,
        isCenter ? "mx-auto text-center" : "text-left"
      )}
    >
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
          {eyebrow}
        </p>
      ) : null}
      <Typography variant={titleVariant} className="text-foreground">
        {title}
      </Typography>
      {description ? (
        <Typography
          variant="muted"
          className={cn(
            "text-sm text-muted-foreground",
            resolvedDescriptionWidth,
            isCenter ? "mx-auto" : undefined
          )}
        >
          {description}
        </Typography>
      ) : null}
    </div>
  );
}

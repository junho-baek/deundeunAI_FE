import { Typography } from "~/common/components/typography";

export type DashboardSectionProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  headerClassName?: string;
};

export function DashboardSection({
  title,
  description,
  children,
  className,
  headerClassName,
}: DashboardSectionProps) {
  return (
    <section className={className}>
      <div
        className={`flex flex-col gap-2 md:flex-row md:items-center md:justify-between ${headerClassName ?? ""}`}
      >
        <Typography
          as="h2"
          variant="h3"
          className="text-2xl font-semibold leading-tight text-foreground"
        >
          {title}
        </Typography>
        {description && (
          <Typography
            variant="muted"
            className="max-w-xl text-sm md:text-base"
          >
            {description}
          </Typography>
        )}
      </div>
      {children}
    </section>
  );
}


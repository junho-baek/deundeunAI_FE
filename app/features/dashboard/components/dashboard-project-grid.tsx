import { Typography } from "~/common/components/typography";

export type DashboardProjectGridProps<T> = {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  emptyMessage?: string;
  className?: string;
  gridClassName?: string;
};

export function DashboardProjectGrid<T>({
  items,
  renderItem,
  emptyMessage = "항목이 없습니다.",
  className,
  gridClassName,
}: DashboardProjectGridProps<T>) {
  return (
    <div className={className}>
      <div
        className={`grid grid-cols-[repeat(auto-fit,minmax(220px,220px))] justify-start gap-6 ${gridClassName ?? ""}`}
      >
        {items.length > 0 ? (
          items.map((item, index) => (
            <div key={index}>{renderItem(item, index)}</div>
          ))
        ) : (
          <Typography
            variant="muted"
            className="col-span-full text-center py-8"
          >
            {emptyMessage}
          </Typography>
        )}
      </div>
    </div>
  );
}


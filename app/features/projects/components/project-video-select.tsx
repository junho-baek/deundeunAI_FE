import * as React from "react";
import { Button } from "~/common/components/ui/button";
import { Check, Edit3 } from "lucide-react";
import { Skeleton } from "~/common/components/ui/skeleton";
import { Spinner } from "~/common/components/ui/spinner";
import { AccordionItem, AccordionTrigger, AccordionContent } from "./project-accordion";
import { Typography } from "~/common/components/typography";

function StepStatus({ loading, done }: { loading?: boolean; done?: boolean }) {
  if (done) return <Check className="h-4 w-4 text-green-500" />;
  if (loading) return <Spinner className="text-muted-foreground" />;
  return null;
}

export type ProjectVideoSelectProps = {
  value: string;
  title: string;
  sources: string[]; // mp4 urls
  timelines: string[];
  selected: number[];
  onToggle?: (index: number) => void;
  onRegenerate?: () => void;
  onDone?: () => void;
  loading?: boolean;
  done?: boolean;
};

export function ProjectVideoSelect(props: ProjectVideoSelectProps) {
  const { value, title, sources, timelines, selected, onToggle, onRegenerate, onDone, loading, done } = props;
  return (
    <AccordionItem value={value}>
      <AccordionTrigger className="text-base font-semibold leading-tight md:text-lg">
        <span className="inline-flex items-center gap-3 text-left">
          <StepStatus loading={loading} done={done} />
          <Typography
            as="span"
            variant="h4"
            className="text-lg font-semibold leading-tight text-foreground md:text-xl"
          >
            {title}
          </Typography>
        </span>
      </AccordionTrigger>
      <AccordionContent className="px-4 text-base leading-relaxed">
        {loading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {sources.map((_, i) => (
              <div key={i} className="space-y-1">
                <div className="relative aspect-9/16 w-full overflow-hidden rounded-lg border bg-muted">
                  <Skeleton className="absolute inset-0 h-full w-full" />
                </div>
                <Skeleton className="h-3 w-20 mx-auto" />
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {sources.map((src, i) => {
                const isSelected = selected.includes(i + 1);
                const canToggle = Boolean(onToggle);
                return (
                  <div key={i} className="space-y-1">
                    <button
                      type="button"
                      onClick={() =>
                        canToggle ? onToggle?.(i + 1) : undefined
                      }
                      className="group relative aspect-9/16 w-full overflow-hidden rounded-xl border bg-muted shadow-sm transition hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-70"
                      disabled={!canToggle}
                      aria-pressed={isSelected}
                    >
                      <video className="absolute inset-0 h-full w-full object-cover" muted loop playsInline preload="metadata">
                        <source src={src} type="video/mp4" />
                      </video>
                      <span className={"absolute right-3 top-3 inline-flex h-7 w-7 items-center justify-center rounded-full border-2 text-sm font-semibold transition " + (isSelected ? "border-primary bg-primary text-primary-foreground" : "border-white/80 bg-background/80 text-transparent group-hover:text-white/80")} aria-hidden="true">
                        <Check className="h-4 w-4" />
                      </span>
                    </button>
                    <Typography
                      as="div"
                      variant="muted"
                      className="text-center text-sm leading-relaxed text-muted-foreground"
                    >
                      {timelines[i]}
                    </Typography>
                  </div>
                );
              })}
            </div>
            {onRegenerate || onDone ? (
              <div className="mt-4 flex justify-end gap-2">
                {onRegenerate ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onRegenerate}
                    className="px-4 py-2 text-sm md:text-base"
                  >
                    <Edit3 className="h-4 w-4" />
                    재생성
                  </Button>
                ) : null}
                {onDone ? (
                  <Button
                    variant="default"
                    className="rounded-full bg-green-500 px-5 py-2 text-sm md:text-base"
                    size="sm"
                    onClick={onDone}
                  >
                    <Check className="h-4 w-4" />
                    완료
                  </Button>
                ) : null}
              </div>
            ) : null}
          </>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}

export default ProjectVideoSelect;


import * as React from "react";
import { Button } from "~/common/components/ui/button";
import { Check, Edit3 } from "lucide-react";
import { Skeleton } from "~/common/components/ui/skeleton";
import { Spinner } from "~/common/components/ui/spinner";
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "./project-accordion";
import { Typography } from "~/common/components/typography";

function StepStatus({ loading, done }: { loading?: boolean; done?: boolean }) {
  if (done) return <Check className="h-4 w-4 text-green-500" />;
  if (loading) return <Spinner className="text-muted-foreground" />;
  return null;
}

export type ProjectImageEntry = {
  id: number | string;
  src: string | null;
  status: string;
  label?: string | null;
  sourceText?: string | null;
  imagePrompt?: string | null;
  moviePrompt?: string | null;
};

export type ProjectImageSelectProps = {
  value: string;
  title: string;
  images: ProjectImageEntry[];
  timelines: string[];
  selected: number[];
  onToggle?: (index: number) => void;
  onRegenerate?: () => void;
  onDone?: () => void;
  loading?: boolean;
  done?: boolean;
};

export function ProjectImageSelect({
  value,
  title,
  images,
  timelines,
  selected,
  onToggle,
  onRegenerate,
  onDone,
  loading,
  done,
}: ProjectImageSelectProps) {
  const placeholderEntries: ProjectImageEntry[] =
    loading && images.length === 0
      ? Array.from({ length: 4 }).map((_, idx) => ({
          id: `placeholder-${idx}`,
          src: null,
          status: "in_progress",
          label: timelines[idx] || `씬 ${idx + 1}`,
        }))
      : [];

  const displayImages = images.length > 0 ? images : placeholderEntries;

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
        {displayImages.length === 0 ? (
          <div className="rounded-xl border bg-muted/30 p-6 text-center text-sm text-muted-foreground">
            아직 생성된 이미지가 없습니다.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {displayImages.map((entry, i) => {
                const isReady = Boolean(entry.src);
                const isSelected = selected.includes(i + 1);
                const timelineLabel =
                  entry.label || timelines[i] || `씬 ${i + 1}`;
                const canToggle = Boolean(onToggle && isReady);
                return (
                  <div key={entry.id ?? i} className="space-y-1">
                    <button
                      type="button"
                      onClick={() => (canToggle ? onToggle?.(i + 1) : undefined)}
                      disabled={!canToggle}
                      className="group relative aspect-9/16 w-full overflow-hidden rounded-xl border bg-muted shadow-sm transition hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-70"
                      aria-pressed={isSelected}
                    >
                      {entry.src ? (
                        <img
                          src={entry.src}
                          alt={`image ${i + 1}`}
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Skeleton className="h-full w-full" />
                        </div>
                      )}
                      <span
                        className={
                          "absolute right-3 top-3 inline-flex h-7 w-7 items-center justify-center rounded-full border-2 text-sm font-semibold transition " +
                          (isSelected && isReady
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-white/80 bg-background/80 text-transparent group-hover:text-white/80")
                        }
                        aria-hidden="true"
                      >
                        <Check className="h-4 w-4" />
                      </span>
                    </button>
                    <Typography
                      as="div"
                      variant="muted"
                      className="text-center text-sm leading-relaxed text-muted-foreground"
                    >
                      {timelineLabel}
                    </Typography>
                    {entry.sourceText ||
                    entry.imagePrompt ||
                    entry.moviePrompt ? (
                      <div className="text-xs text-muted-foreground/90 space-y-1 rounded-lg border border-dashed border-muted/50 p-2">
                        {entry.sourceText ? (
                          <p>
                            <span className="font-medium text-foreground">
                              Source
                            </span>{" "}
                            {entry.sourceText}
                          </p>
                        ) : null}
                        {entry.imagePrompt ? (
                          <p>
                            <span className="font-medium text-foreground">
                              Prompt
                            </span>{" "}
                            {entry.imagePrompt}
                          </p>
                        ) : null}
                        {entry.moviePrompt ? (
                          <p>
                            <span className="font-medium text-foreground">
                              Motion
                            </span>{" "}
                            {entry.moviePrompt}
                          </p>
                        ) : null}
                      </div>
                    ) : null}
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

export default ProjectImageSelect;

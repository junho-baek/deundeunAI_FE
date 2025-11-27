import * as React from "react";
import { Button } from "~/common/components/ui/button";
import { Check, Edit3, Youtube, Instagram, Twitter } from "lucide-react";
import { Skeleton } from "~/common/components/ui/skeleton";
import { Spinner } from "~/common/components/ui/spinner";
import { AccordionItem, AccordionTrigger, AccordionContent } from "./project-accordion";
import { Typography } from "~/common/components/typography";

function StepStatus({ loading, done }: { loading?: boolean; done?: boolean }) {
  if (done) return <Check className="h-4 w-4 text-green-500" />;
  if (loading) return <Spinner className="text-muted-foreground" />;
  return null;
}

export type ProjectFinalVideoProps = {
  value: string;
  title: string;
  videoSrc: string;
  headline: string;
  description: string;
  durationText: string;
  loading?: boolean;
  done?: boolean;
  onSelect?: () => void;
  onDone?: () => void;
};

export function ProjectFinalVideo({ value, title, videoSrc, headline, description, durationText, loading, done, onSelect, onDone }: ProjectFinalVideoProps) {
  const showActions = Boolean(onSelect || onDone);
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
      <AccordionContent className="flex flex-col gap-5 px-4 text-base leading-relaxed">
        {loading ? (
          <div className="mx-auto w-full max-w-[420px] px-2">
            <div className="space-y-2">
              <div className="relative aspect-9/16 w-full overflow-hidden rounded-xl border bg-muted">
                <Skeleton className="absolute inset-0 h-full w-full" />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-2 w-3/4">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-56" />
                </div>
                <Skeleton className="h-3 w-16" />
              </div>
              <div className="mt-1 flex items-center justify-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-10 w-10 rounded-full" />
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="mx-auto w-full max-w-[420px] px-2">
              <div className="space-y-2">
                <div className="relative aspect-9/16 w-full overflow-hidden rounded-xl border bg-muted">
                  <video className="absolute inset-0 h-full w-full object-cover" controls loop playsInline preload="metadata">
                    <source src={videoSrc} type="video/mp4" />
                  </video>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Typography
                      as="div"
                      variant="large"
                      className="text-base font-semibold leading-snug text-foreground md:text-lg"
                    >
                      {headline}
                    </Typography>
                    <Typography
                      as="p"
                      variant="muted"
                      className="text-sm leading-relaxed text-muted-foreground first:mt-0"
                    >
                      {description}
                    </Typography>
                  </div>
                  <Typography
                    as="span"
                    variant="muted"
                    className="text-sm leading-relaxed text-muted-foreground"
                  >
                    {durationText}
                  </Typography>
                </div>
                <div className="mt-1 flex items-center justify-center gap-3">
                  <button type="button" aria-label="Upload to YouTube" className="inline-flex items-center justify-center rounded-full bg-red-600 text-white h-10 w-10 shadow"><Youtube className="h-5 w-5" /></button>
                  <button type="button" aria-label="Upload to Instagram" className="inline-flex items-center justify-center rounded-full bg-linear-to-br from-pink-500 to-violet-500 text-white h-10 w-10 shadow"><Instagram className="h-5 w-5" /></button>
                  <button type="button" aria-label="Upload to X" className="inline-flex items-center justify-center rounded-full bg-black text-white h-10 w-10 shadow"><Twitter className="h-5 w-5" /></button>
                </div>
              </div>
            </div>
            {showActions ? (
              <div className="flex justify-end gap-2">
                {onSelect ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onSelect}
                    className="px-4 py-2 text-sm md:text-base"
                  >
                    <Edit3 className="h-4 w-4" />
                    선택하기
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

export default ProjectFinalVideo;


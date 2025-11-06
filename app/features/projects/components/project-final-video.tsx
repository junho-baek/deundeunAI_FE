import * as React from "react";
import { Button } from "~/common/components/ui/button";
import { Check, Edit3, Youtube, Instagram, Twitter } from "lucide-react";
import { Skeleton } from "~/common/components/ui/skeleton";
import { Spinner } from "~/common/components/ui/spinner";
import { AccordionItem, AccordionTrigger, AccordionContent } from "./project-accordion";

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
  return (
    <AccordionItem value={value}>
      <AccordionTrigger>
        <span className="inline-flex items-center gap-2">
          <StepStatus loading={loading} done={done} />
          {title}
        </span>
      </AccordionTrigger>
      <AccordionContent className="flex flex-col gap-4">
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
                    <div className="text-sm font-medium">{headline}</div>
                    <p className="text-xs text-muted-foreground">{description}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{durationText}</span>
                </div>
                <div className="mt-1 flex items-center justify-center gap-3">
                  <button type="button" aria-label="Upload to YouTube" className="inline-flex items-center justify-center rounded-full bg-red-600 text-white h-10 w-10 shadow"><Youtube className="h-5 w-5" /></button>
                  <button type="button" aria-label="Upload to Instagram" className="inline-flex items-center justify-center rounded-full bg-linear-to-br from-pink-500 to-violet-500 text-white h-10 w-10 shadow"><Instagram className="h-5 w-5" /></button>
                  <button type="button" aria-label="Upload to X" className="inline-flex items-center justify-center rounded-full bg-black text-white h-10 w-10 shadow"><Twitter className="h-5 w-5" /></button>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={onSelect}><Edit3 className="h-4 w-4" />선택하기</Button>
              <Button variant="default" className="rounded-full bg-green-500" size="sm" onClick={onDone}><Check className="h-4 w-4" />완료</Button>
            </div>
          </>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}

export default ProjectFinalVideo;



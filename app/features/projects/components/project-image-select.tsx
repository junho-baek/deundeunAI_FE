import * as React from "react";
import { Button } from "~/common/components/ui/button";
import { Check, Edit3 } from "lucide-react";
import { Skeleton } from "~/common/components/ui/skeleton";
import { Spinner } from "~/common/components/ui/spinner";
import { AccordionItem, AccordionTrigger, AccordionContent } from "./project-accordion";

function StepStatus({ loading, done }: { loading?: boolean; done?: boolean }) {
  if (done) return <Check className="h-4 w-4 text-green-500" />;
  if (loading) return <Spinner className="text-muted-foreground" />;
  return null;
}

export type ProjectImageSelectProps = {
  value: string;
  title: string;
  images: string[]; // urls
  timelines: string[];
  selected: number[];
  onToggle: (index: number) => void;
  onRegenerate?: () => void;
  onDone?: () => void;
  loading?: boolean;
  done?: boolean;
};

export function ProjectImageSelect(props: ProjectImageSelectProps) {
  const { value, title, images, timelines, selected, onToggle, onRegenerate, onDone, loading, done } = props;
  return (
    <AccordionItem value={value}>
      <AccordionTrigger>
        <span className="inline-flex items-center gap-2">
          <StepStatus loading={loading} done={done} />
          {title}
        </span>
      </AccordionTrigger>
      <AccordionContent>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((_, i) => (
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((src, i) => {
                const isSelected = selected.includes(i + 1);
                return (
                  <div key={i} className="space-y-1">
                    <button type="button" onClick={() => onToggle(i + 1)} className="relative aspect-9/16 w-full overflow-hidden rounded-lg border bg-muted group cursor-pointer" aria-pressed={isSelected}>
                      <img src={src} alt={`image ${i + 1}`} className="absolute inset-0 h-full w-full object-cover" />
                      <span className={"absolute right-2 top-2 inline-flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors " + (isSelected ? "bg-primary border-primary text-primary-foreground" : "bg-background/70 border-white/80 text-transparent group-hover:text-white/80")} aria-hidden="true">
                        <Check className="h-4 w-4" />
                      </span>
                    </button>
                    <div className="text-xs text-muted-foreground text-center">{timelines[i]}</div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={onRegenerate}><Edit3 className="h-4 w-4" />재생성</Button>
              <Button variant="default" className="rounded-full bg-green-500" size="sm" onClick={onDone}><Check className="h-4 w-4" />완료</Button>
            </div>
          </>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}

export default ProjectImageSelect;



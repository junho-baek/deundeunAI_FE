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

function StepStatus({ loading, done }: { loading?: boolean; done?: boolean }) {
  if (done) return <Check className="h-4 w-4 text-green-500" />;
  if (loading) return <Spinner className="text-muted-foreground" />;
  return null;
}

export type AudioSegment = { id: number | string; label: string; src: string };

export type ProjectScriptAudioProps = {
  value: string;
  title: string;
  segments: AudioSegment[];
  loading?: boolean;
  done?: boolean;
  onEdit?: () => void;
  onDone?: () => void;
};

export function ProjectScriptAudio({
  value,
  title,
  segments,
  loading,
  done,
  onEdit,
  onDone,
}: ProjectScriptAudioProps) {
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
          <div className="mt-1 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-3 w-48" />
                  <Skeleton className="h-3 w-40" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="mt-1 space-y-2">
              {segments.map((seg) => (
                <div
                  key={seg.id}
                  className="flex items-center justify-between rounded-md border px-3 py-2"
                >
                  <span className="text-sm font-medium">{seg.label}</span>
                  <audio controls preload="none" className="w-56">
                    <source src={seg.src} type="audio/mpeg" />
                  </audio>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={onEdit}>
                <Edit3 className="h-4 w-4" />
                수정하기
              </Button>
              <Button
                variant="default"
                className="rounded-full bg-green-500"
                size="sm"
                onClick={onDone}
              >
                <Check className="h-4 w-4" />
                완료
              </Button>
            </div>
          </>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}

export default ProjectScriptAudio;

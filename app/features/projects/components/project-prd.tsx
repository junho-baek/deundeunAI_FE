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

export type ProjectPrdProps = {
  value: string;
  title: string;
  markdownHtml: string;
  loading?: boolean;
  done?: boolean;
  onEdit?: () => void;
  onDone?: () => void;
};

export function ProjectPrd(props: ProjectPrdProps) {
  const { value, title, markdownHtml, loading, done, onEdit, onDone } = props;
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
          <div className="rounded-md border bg-background/50 p-3">
            <div className="flex flex-col space-y-3">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-64" />
              <div className="space-y-2">
                <Skeleton className="h-3 w-56" />
                <Skeleton className="h-3 w-52" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="rounded-md border bg-background/50 p-3">
              <div
                className="prose prose-sm dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: markdownHtml }}
              />
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

export default ProjectPrd;

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
  const showActions = Boolean(onEdit || onDone);
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
          <div className="rounded-xl border bg-background/60 p-4">
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
            <div className="rounded-xl border bg-background/60 p-4">
              <div
                className="prose prose-base max-w-none leading-relaxed text-foreground dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: markdownHtml }}
              />
            </div>
            {showActions ? (
              <div className="flex justify-end gap-2">
                {onEdit ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onEdit}
                    className="px-4 py-2 text-sm md:text-base"
                  >
                    <Edit3 className="h-4 w-4" />
                    수정하기
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

export default ProjectPrd;

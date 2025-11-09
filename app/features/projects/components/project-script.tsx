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

export type ProjectScriptProps = {
  value: string;
  title: string;
  paragraphs: string[];
  loading?: boolean;
  done?: boolean;
  onEdit?: () => void;
  onDone?: () => void;
};

export function ProjectScript({
  value,
  title,
  paragraphs,
  loading,
  done,
  onEdit,
  onDone,
}: ProjectScriptProps) {
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
      <AccordionContent className="flex flex-col gap-5 px-4 text-base leading-relaxed text-balance">
        {loading ? (
          <div className="flex flex-col space-y-3">
            <Skeleton className="h-4 w-72" />
            <Skeleton className="h-4 w-64" />
            <Skeleton className="h-4 w-60" />
            <Skeleton className="h-4 w-56" />
          </div>
        ) : (
          <>
            <div className="space-y-3 text-base leading-relaxed text-muted-foreground">
              {paragraphs.map((p, i) => (
                <Typography
                  key={i}
                  as="p"
                  variant="p"
                  className="text-base leading-relaxed text-muted-foreground first:mt-0 not-first:mt-3"
                >
                  {p}
                </Typography>
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onEdit}
                className="px-4 py-2 text-sm md:text-base"
              >
                <Edit3 className="h-4 w-4" />
                수정하기
              </Button>
              <Button
                variant="default"
                className="rounded-full bg-green-500 px-5 py-2 text-sm md:text-base"
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

export default ProjectScript;

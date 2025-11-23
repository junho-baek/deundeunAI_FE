import * as React from "react";
import { Button } from "~/common/components/ui/button";
import { Check, Edit3 } from "lucide-react";
import { Typography } from "~/common/components/typography";
import { useFetcher } from "react-router";

export type ProjectScriptReviewFormProps = {
  projectId: string;
  scriptContent: string | string[]; // 텍스트 또는 단락 배열
  isLoading?: boolean;
  onEdit: () => void;
  onApprove?: () => void; // optional로 변경 (fetcher.Form 사용 시)
  useFetcherForm?: boolean; // fetcher.Form 사용 여부
};

/**
 * 스크립트 확인 및 수정/제출 폼
 * 스크립트 내용을 표시하고 수정하거나 제출할 수 있습니다.
 */
export function ProjectScriptReviewForm({
  projectId,
  scriptContent,
  isLoading = false,
  onEdit,
  onApprove,
  useFetcherForm = false,
}: ProjectScriptReviewFormProps) {
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";
  const effectiveLoading = isLoading || isSubmitting;
  // scriptContent를 배열로 정규화
  const paragraphs = React.useMemo(() => {
    if (Array.isArray(scriptContent)) {
      return scriptContent;
    }
    // 텍스트를 단락으로 분리
    return scriptContent
      .split("\n\n")
      .map((p) => p.trim())
      .filter((p) => p.length > 0);
  }, [scriptContent]);

  return (
    <div className="flex flex-col gap-5">
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
      {useFetcherForm ? (
        <fetcher.Form
          method="post"
          action={`/my/dashboard/project/${projectId}/script/submit`}
        >
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onEdit}
              disabled={effectiveLoading}
              className="px-4 py-2 text-sm md:text-base"
            >
              <Edit3 className="h-4 w-4" />
              수정하기
            </Button>
            <Button
              type="submit"
              variant="default"
              className="rounded-full bg-green-500 px-5 py-2 text-sm md:text-base hover:bg-green-600"
              size="sm"
              disabled={effectiveLoading}
            >
              <Check className="h-4 w-4" />
              {effectiveLoading ? "제출 중..." : "이대로 제출"}
            </Button>
          </div>
        </fetcher.Form>
      ) : (
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onEdit}
            disabled={effectiveLoading}
          className="px-4 py-2 text-sm md:text-base"
        >
          <Edit3 className="h-4 w-4" />
          수정하기
        </Button>
        <Button
          variant="default"
          className="rounded-full bg-green-500 px-5 py-2 text-sm md:text-base hover:bg-green-600"
          size="sm"
          onClick={onApprove}
            disabled={effectiveLoading}
        >
          <Check className="h-4 w-4" />
          이대로 제출
        </Button>
      </div>
      )}
    </div>
  );
}

export default ProjectScriptReviewForm;


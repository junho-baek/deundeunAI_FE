import * as React from "react";
import { Button } from "~/common/components/ui/button";
import { Check, Edit3 } from "lucide-react";
import { Typography } from "~/common/components/typography";
import { useFetcher } from "react-router";

export type ProjectBriefReviewFormProps = {
  projectId: string;
  briefContent: string; // 마크다운 형식
  isLoading?: boolean;
  onEdit: () => void;
  onApprove?: () => void; // optional로 변경 (fetcher.Form 사용 시)
  useFetcherForm?: boolean; // fetcher.Form 사용 여부
};

/**
 * 기획서 확인 및 수정/제출 폼
 * 기획서 내용을 표시하고 수정하거나 제출할 수 있습니다.
 */
export function ProjectBriefReviewForm({
  projectId,
  briefContent,
  isLoading = false,
  onEdit,
  onApprove,
  useFetcherForm = false,
}: ProjectBriefReviewFormProps) {
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";
  const effectiveLoading = isLoading || isSubmitting;
  // 마크다운을 HTML로 변환 (간단한 변환)
  const markdownHtml = React.useMemo(() => {
    const safe = briefContent.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const lines = safe.split(/\n/);
    let html = "";
    let inList = false;
    const flush = () => {
      if (inList) {
        html += "</ul>";
        inList = false;
      }
    };
    for (const l of lines) {
      let line = l.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
      if (/^#\s+/.test(line)) {
        flush();
        html += `<h3>${line.replace(/^#\s+/, "")}</h3>`;
        continue;
      }
      if (/^##\s+/.test(line)) {
        flush();
        html += `<h4>${line.replace(/^##\s+/, "")}</h4>`;
        continue;
      }
      if (/^\-\s+/.test(line)) {
        if (!inList) {
          html += "<ul>";
          inList = true;
        }
        html += `<li>${line.replace(/^\-\s+/, "")}</li>`;
        continue;
      }
      if (line.trim() === "") {
        flush();
        html += "<br/>";
      } else {
        flush();
        html += `<p>${line}</p>`;
      }
    }
    flush();
    return html;
  }, [briefContent]);

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-xl border bg-background/60 p-4">
        <div
          className="prose prose-base max-w-none leading-relaxed text-foreground dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: markdownHtml }}
        />
      </div>
      {useFetcherForm ? (
        <fetcher.Form
          method="post"
          action={`/my/dashboard/project/${projectId}/brief/submit`}
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

export default ProjectBriefReviewForm;


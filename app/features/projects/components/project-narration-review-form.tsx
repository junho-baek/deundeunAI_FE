import * as React from "react";
import { Button } from "~/common/components/ui/button";
import { Check, RotateCcw } from "lucide-react";
import { Typography } from "~/common/components/typography";
import { useFetcher } from "react-router";

export type AudioSegment = {
  id: number | string;
  label: string;
  src: string;
};

export type ProjectNarrationReviewFormProps = {
  projectId: string;
  audioSegments: AudioSegment[];
  isLoading?: boolean;
  onRegenerate?: () => void; // optional로 변경
  onApprove?: () => void; // optional로 변경 (fetcher.Form 사용 시)
  useFetcherForm?: boolean; // fetcher.Form 사용 여부
};

/**
 * 대사 확인 및 재생성/제출 폼
 * 오디오 세그먼트를 확인하고 재생성하거나 제출할 수 있습니다.
 */
export function ProjectNarrationReviewForm({
  projectId,
  audioSegments,
  isLoading = false,
  onRegenerate,
  onApprove,
  useFetcherForm = false,
}: ProjectNarrationReviewFormProps) {
  const regenerateFetcher = useFetcher();
  const submitFetcher = useFetcher();
  const isRegenerating = regenerateFetcher.state === "submitting";
  const isSubmitting = submitFetcher.state === "submitting";
  const effectiveLoading = isLoading || isRegenerating || isSubmitting;
  return (
    <div className="flex flex-col gap-5">
      <div className="mt-1 space-y-2">
        {audioSegments.map((seg) => (
          <div
            key={seg.id}
            className="flex items-center justify-between rounded-xl border px-4 py-3"
          >
            <Typography
              as="span"
              variant="p"
              className="text-base font-medium leading-relaxed text-foreground not-first:mt-0"
            >
              {seg.label}
            </Typography>
            <audio controls preload="none" className="w-56">
              <source src={seg.src} type="audio/mpeg" />
              <source src={seg.src} type="audio/wav" />
              <source src={seg.src} type="audio/ogg" />
              오디오를 재생할 수 없습니다.
            </audio>
          </div>
        ))}
      </div>
      {useFetcherForm ? (
        <div className="flex justify-end gap-2">
          <regenerateFetcher.Form
            method="post"
            action={`/my/dashboard/project/${projectId}/narration/regenerate`}
          >
            <Button
              type="submit"
              variant="outline"
              size="sm"
              disabled={effectiveLoading}
              className="px-4 py-2 text-sm md:text-base"
            >
              <RotateCcw className="h-4 w-4" />
              {isRegenerating ? "재생성 중..." : "재생성 요청"}
            </Button>
          </regenerateFetcher.Form>
          <submitFetcher.Form
            method="post"
            action={`/my/dashboard/project/${projectId}/narration/submit`}
          >
            <Button
              type="submit"
              variant="default"
              className="rounded-full bg-green-500 px-5 py-2 text-sm md:text-base hover:bg-green-600"
              size="sm"
              disabled={effectiveLoading}
            >
              <Check className="h-4 w-4" />
              {isSubmitting ? "제출 중..." : "이대로 제출"}
            </Button>
          </submitFetcher.Form>
        </div>
      ) : (
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onRegenerate}
            disabled={effectiveLoading}
          className="px-4 py-2 text-sm md:text-base"
        >
          <RotateCcw className="h-4 w-4" />
          재생성 요청
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

export default ProjectNarrationReviewForm;


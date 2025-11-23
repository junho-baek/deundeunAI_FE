import * as React from "react";
import { Button } from "~/common/components/ui/button";
import { Check, Upload } from "lucide-react";
import { Typography } from "~/common/components/typography";
import { useFetcher } from "react-router";

export type ProjectFinalReviewFormProps = {
  projectId: string;
  videoUrl: string;
  title: string;
  description: string;
  durationText?: string;
  isLoading?: boolean;
  onDeploy?: () => void; // optional로 변경 (fetcher.Form 사용 시)
  useFetcherForm?: boolean; // fetcher.Form 사용 여부
};

/**
 * 최종 영상 확인 및 배포 폼
 * 최종 편집된 영상을 확인하고 배포할 수 있습니다.
 */
export function ProjectFinalReviewForm({
  projectId,
  videoUrl,
  title,
  description,
  durationText = "영상 길이 확인 중...",
  isLoading = false,
  onDeploy,
  useFetcherForm = false,
}: ProjectFinalReviewFormProps) {
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";
  const effectiveLoading = isLoading || isSubmitting;
  return (
    <div className="flex flex-col gap-5">
      <div className="mx-auto w-full max-w-[420px] px-2">
        <div className="space-y-2">
          <div className="relative aspect-9/16 w-full overflow-hidden rounded-xl border bg-muted">
            <video
              className="absolute inset-0 h-full w-full object-cover"
              controls
              loop
              playsInline
              preload="metadata"
            >
              <source src={videoUrl} type="video/mp4" />
              <source src={videoUrl} type="video/webm" />
              영상을 재생할 수 없습니다.
            </video>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Typography
                as="div"
                variant="large"
                className="text-base font-semibold leading-snug text-foreground md:text-lg"
              >
                {title}
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
        </div>
      </div>
      {useFetcherForm ? (
        <fetcher.Form
          method="post"
          action={`/my/dashboard/project/${projectId}/deploy`}
        >
          <div className="flex justify-end gap-2">
            <Button
              type="submit"
              variant="default"
              className="rounded-full bg-blue-500 px-5 py-2 text-sm md:text-base hover:bg-blue-600"
              size="sm"
              disabled={effectiveLoading}
            >
              <Upload className="h-4 w-4" />
              {effectiveLoading ? "배포 중..." : "배포하기"}
            </Button>
          </div>
        </fetcher.Form>
      ) : (
      <div className="flex justify-end gap-2">
        <Button
          variant="default"
          className="rounded-full bg-blue-500 px-5 py-2 text-sm md:text-base hover:bg-blue-600"
          size="sm"
          onClick={onDeploy}
            disabled={effectiveLoading}
        >
          <Upload className="h-4 w-4" />
            {effectiveLoading ? "배포 중..." : "배포하기"}
        </Button>
      </div>
      )}
    </div>
  );
}

export default ProjectFinalReviewForm;


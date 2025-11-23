import * as React from "react";
import { Button } from "~/common/components/ui/button";
import { Textarea } from "~/common/components/ui/textarea";
import { Label } from "~/common/components/ui/label";
import { X, Save } from "lucide-react";
import { useFetcher } from "react-router";

export type ProjectBriefEditorProps = {
  projectId: string;
  initialContent: string;
  onCancel: () => void;
  onSave?: (content: string) => Promise<void>;
};

/**
 * 기획서 편집 컴포넌트
 * 마크다운 형식으로 기획서를 편집할 수 있습니다.
 */
export function ProjectBriefEditor({
  projectId,
  initialContent,
  onCancel,
  onSave,
}: ProjectBriefEditorProps) {
  const [content, setContent] = React.useState(initialContent);
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (onSave) {
      await onSave(content);
    } else {
      // 기본 동작: action으로 제출
      const formData = new FormData();
      formData.append("content", content);
      fetcher.submit(formData, {
        method: "post",
        action: `/my/dashboard/project/${projectId}/brief/update`,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="brief-content">기획서 내용 (마크다운 형식)</Label>
        <Textarea
          id="brief-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={20}
          className="font-mono text-sm"
          placeholder="# 기획서 제목&#10;&#10;## 목표&#10;- 목표 1&#10;- 목표 2&#10;&#10;## 콘셉트&#10;..."
          disabled={isSubmitting}
        />
        <p className="text-xs text-muted-foreground">
          마크다운 형식으로 작성하세요. **굵게**, # 제목, - 리스트 등을 사용할
          수 있습니다.
        </p>
      </div>
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-4 py-2 text-sm md:text-base"
        >
          <X className="h-4 w-4" />
          취소
        </Button>
        <Button
          type="submit"
          variant="default"
          size="sm"
          disabled={isSubmitting}
          className="px-4 py-2 text-sm md:text-base"
        >
          <Save className="h-4 w-4" />
          {isSubmitting ? "저장 중..." : "저장하기"}
        </Button>
      </div>
    </form>
  );
}

export default ProjectBriefEditor;

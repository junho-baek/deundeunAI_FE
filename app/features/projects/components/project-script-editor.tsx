import * as React from "react";
import { Button } from "~/common/components/ui/button";
import { Textarea } from "~/common/components/ui/textarea";
import { Label } from "~/common/components/ui/label";
import { X, Save } from "lucide-react";
import { useFetcher } from "react-router";

export type ProjectScriptEditorProps = {
  projectId: string;
  initialContent: string | string[];
  onCancel: () => void;
  onSave?: (content: string | string[]) => Promise<void>;
};

/**
 * 스크립트 편집 컴포넌트
 * 단락별로 스크립트를 편집할 수 있습니다.
 */
export function ProjectScriptEditor({
  projectId,
  initialContent,
  onCancel,
  onSave,
}: ProjectScriptEditorProps) {
  // 초기 내용을 배열로 정규화
  const initialParagraphs = React.useMemo(() => {
    if (Array.isArray(initialContent)) {
      return initialContent;
    }
    return initialContent
      .split("\n\n")
      .map((p) => p.trim())
      .filter((p) => p.length > 0);
  }, [initialContent]);

  const [paragraphs, setParagraphs] =
    React.useState<string[]>(initialParagraphs);
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";

  const handleParagraphChange = (index: number, value: string) => {
    setParagraphs((prev) => {
      const newParagraphs = [...prev];
      newParagraphs[index] = value;
      return newParagraphs;
    });
  };

  const handleAddParagraph = () => {
    setParagraphs((prev) => [...prev, ""]);
  };

  const handleRemoveParagraph = (index: number) => {
    setParagraphs((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 빈 단락 제거
    const cleanedParagraphs = paragraphs
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    if (onSave) {
      await onSave(cleanedParagraphs);
    } else {
      // 기본 동작: action으로 제출 (JSON 배열로 전송)
      const formData = new FormData();
      formData.append("content", JSON.stringify(cleanedParagraphs));
      fetcher.submit(formData, {
        method: "post",
        action: `/my/dashboard/project/${projectId}/script/update`,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        <Label>스크립트 단락</Label>
        {paragraphs.map((paragraph, index) => (
          <div key={index} className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label
                htmlFor={`script-paragraph-${index}`}
                className="text-xs text-muted-foreground"
              >
                단락 {index + 1}
              </Label>
              {paragraphs.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveParagraph(index)}
                  disabled={isSubmitting}
                  className="h-6 px-2 text-xs"
                >
                  <X className="h-3 w-3" />
                  삭제
                </Button>
              )}
            </div>
            <Textarea
              id={`script-paragraph-${index}`}
              value={paragraph}
              onChange={(e) => handleParagraphChange(index, e.target.value)}
              rows={4}
              className="text-sm"
              placeholder="스크립트 내용을 입력하세요..."
              disabled={isSubmitting}
            />
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddParagraph}
          disabled={isSubmitting}
          className="self-start"
        >
          + 단락 추가
        </Button>
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

export default ProjectScriptEditor;

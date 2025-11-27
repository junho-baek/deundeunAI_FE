import * as React from "react";
import { Button } from "~/common/components/ui/button";
import { Textarea } from "~/common/components/ui/textarea";
import { Input } from "~/common/components/ui/input";
import { Label } from "~/common/components/ui/label";
import { X, Save } from "lucide-react";
import {
  SHORT_WORKFLOW_CATEGORY_OPTIONS,
  SHORT_WORKFLOW_IMAGE_MODEL_OPTIONS,
} from "~/features/projects/short-workflow.constants";
import type { ProjectBriefFormValues } from "../utils/brief-form";

export type ProjectBriefEditorProps = {
  initialValues: ProjectBriefFormValues;
  onCancel: () => void;
  onSave: (values: ProjectBriefFormValues) => Promise<void> | void;
  isSubmitting?: boolean;
  readOnly?: boolean; // 읽기 전용 모드
};

export function ProjectBriefEditor({
  initialValues,
  onCancel,
  onSave,
  isSubmitting = false,
  readOnly = false,
}: ProjectBriefEditorProps) {
  const [formValues, setFormValues] =
    React.useState<ProjectBriefFormValues>(initialValues);

  React.useEffect(() => {
    setFormValues(initialValues);
  }, [initialValues]);

  const handleTextChange =
    (field: keyof ProjectBriefFormValues) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value =
        field === "length"
          ? event.target.value === ""
            ? null
            : Number(event.target.value)
          : event.target.value;

      setFormValues((prev) => ({
        ...prev,
        [field]: value,
      }));
    };

  const handleSelectChange =
    (field: keyof ProjectBriefFormValues) =>
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      setFormValues((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSave(formValues);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="brief-title">제목</Label>
          <Input
            id="brief-title"
            value={formValues.title}
            onChange={handleTextChange("title")}
            placeholder="콘텐츠 제목"
            disabled={isSubmitting || readOnly}
            readOnly={readOnly}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="brief-keyword">키워드</Label>
          <Input
            id="brief-keyword"
            value={formValues.keyword}
            onChange={handleTextChange("keyword")}
            placeholder="예: 팀워크, 프로젝트"
            disabled={isSubmitting || readOnly}
            readOnly={readOnly}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="brief-category">카테고리</Label>
          <select
            id="brief-category"
            value={formValues.category}
            onChange={handleSelectChange("category")}
            disabled={isSubmitting || readOnly}
            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">카테고리를 선택하세요</option>
            {SHORT_WORKFLOW_CATEGORY_OPTIONS.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="brief-image-model">이미지 모델</Label>
          <select
            id="brief-image-model"
            value={formValues.imageModel}
            onChange={handleSelectChange("imageModel")}
            disabled={isSubmitting || readOnly}
            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">이미지 모델을 선택하세요</option>
            {SHORT_WORKFLOW_IMAGE_MODEL_OPTIONS.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="brief-tags">태그</Label>
          <Input
            id="brief-tags"
            value={formValues.tags}
            onChange={handleTextChange("tags")}
            placeholder="#프로젝트 #팀워크"
            disabled={isSubmitting || readOnly}
            readOnly={readOnly}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="brief-length">길이 (문자)</Label>
          <Input
            id="brief-length"
            type="number"
            min={0}
            value={formValues.length ?? ""}
            onChange={handleTextChange("length")}
            placeholder="예: 200"
            disabled={isSubmitting || readOnly}
            readOnly={readOnly}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="brief-description">설명</Label>
        <Textarea
          id="brief-description"
          value={formValues.description}
          onChange={handleTextChange("description")}
          rows={3}
          placeholder="콘텐츠의 전체 요약을 작성하세요."
          disabled={isSubmitting || readOnly}
          readOnly={readOnly}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="brief-intro">Intro</Label>
        <Textarea
          id="brief-intro"
          value={formValues.intro}
          onChange={handleTextChange("intro")}
          rows={3}
          placeholder="시작 3초를 책임지는 문장"
          disabled={isSubmitting || readOnly}
          readOnly={readOnly}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="brief-base">본문</Label>
        <Textarea
          id="brief-base"
          value={formValues.base}
          onChange={handleTextChange("base")}
          rows={6}
          placeholder="본론 내용을 입력하세요."
          disabled={isSubmitting || readOnly}
          readOnly={readOnly}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="brief-cta">CTA</Label>
        <Textarea
          id="brief-cta"
          value={formValues.cta}
          onChange={handleTextChange("cta")}
          rows={3}
          placeholder="시청자 행동을 유도하는 문구"
          disabled={isSubmitting || readOnly}
          readOnly={readOnly}
        />
      </div>

      {!readOnly && (
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
      )}
    </form>
  );
}

export default ProjectBriefEditor;

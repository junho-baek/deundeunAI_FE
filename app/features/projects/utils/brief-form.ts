import {
  SHORT_WORKFLOW_CATEGORY_OPTIONS,
  SHORT_WORKFLOW_IMAGE_MODEL_OPTIONS,
} from "../short-workflow.constants";
import type { ShortWorkflowJobRecord } from "../short-workflow";

export type ProjectBriefFormValues = {
  title: string;
  keyword: string;
  category: string;
  imageModel: string;
  tags: string;
  description: string;
  intro: string;
  base: string;
  cta: string;
  length: number | null;
};

export const emptyProjectBriefFormValues: ProjectBriefFormValues = {
  title: "",
  keyword: "",
  category: "",
  imageModel: "",
  tags: "",
  description: "",
  intro: "",
  base: "",
  cta: "",
  length: null,
};

export function sanitizeBriefFormValues(
  values: Partial<ProjectBriefFormValues> | null | undefined
): ProjectBriefFormValues {
  return {
    title: values?.title?.trim() || "",
    keyword: values?.keyword?.trim() || "",
    category:
      values?.category && SHORT_WORKFLOW_CATEGORY_OPTIONS.includes(values.category)
        ? values.category
        : "",
    imageModel:
      values?.imageModel &&
      SHORT_WORKFLOW_IMAGE_MODEL_OPTIONS.includes(values.imageModel)
        ? values.imageModel
        : "",
    tags: values?.tags?.trim() || "",
    description: values?.description?.trim() || "",
    intro: values?.intro?.trim() || "",
    base: values?.base?.trim() || "",
    cta: values?.cta?.trim() || "",
    length:
      typeof values?.length === "number" && !Number.isNaN(values.length)
        ? values.length
        : values?.length && typeof values.length === "string"
          ? Number(values.length) || null
          : null,
  };
}

export function buildBriefMarkdownFromFields(
  values: ProjectBriefFormValues
): string {
  const lines: string[] = [];
  const safe = sanitizeBriefFormValues(values);
  lines.push(`# ${safe.title || "제목 미정"}`);
  const metaParts = [
    `- **키워드:** ${safe.keyword || "미정"}`,
    `- **카테고리:** ${safe.category || "미정"}`,
    `- **길이:** ${safe.length ?? "0"}`,
    `- **태그:** ${safe.tags || "없음"}`,
    `- **이미지 모델:** ${safe.imageModel || "미정"}`,
  ];
  lines.push(metaParts.join("\n"));
  if (safe.description) {
    lines.push(`- **설명:** ${safe.description}`);
  }
  if (safe.intro) {
    lines.push(`## Intro\n${safe.intro}`);
  }
  if (safe.base) {
    lines.push(`## 본문\n${safe.base}`);
  }
  if (safe.cta) {
    lines.push(`## CTA\n${safe.cta}`);
  }
  return lines.join("\n\n");
}

export function deriveBriefFormValuesFromJob(
  job: ShortWorkflowJobRecord | null | undefined
): ProjectBriefFormValues | null {
  if (!job) return null;
  return sanitizeBriefFormValues({
    title: job.title,
    keyword: job.keyword || "",
    category: job.category || "",
    imageModel: job.image_model || "",
    tags: job.tags || "",
    description: job.description || "",
    intro: job.intro || "",
    base: job.base || "",
    cta: job.cta || "",
    length:
      typeof job.length === "number"
        ? job.length
        : job.length
          ? Number(job.length)
          : null,
  });
}

export function deriveBriefFormValuesFromMetadata(
  metadata: unknown
): ProjectBriefFormValues | null {
  if (!metadata || typeof metadata !== "object") return null;
  const maybeForm =
    (metadata as { form?: Partial<ProjectBriefFormValues> | null })?.form ?? null;
  if (!maybeForm) return null;
  return sanitizeBriefFormValues(maybeForm);
}

export function briefFormValuesFromFormData(
  formData: FormData
): ProjectBriefFormValues {
  const get = (key: string) => {
    const value = formData.get(`form_${key}`);
    return typeof value === "string" ? value : "";
  };

  const lengthRaw = formData.get("form_length");
  let length: number | null = null;
  if (typeof lengthRaw === "string" && lengthRaw.trim() !== "") {
    const parsed = Number(lengthRaw);
    length = Number.isFinite(parsed) ? parsed : null;
  }

  return sanitizeBriefFormValues({
    title: get("title"),
    keyword: get("keyword"),
    category: get("category"),
    imageModel: get("imageModel"),
    tags: get("tags"),
    description: get("description"),
    intro: get("intro"),
    base: get("base"),
    cta: get("cta"),
    length,
  });
}

export function briefFormValuesToMetadata(
  values: ProjectBriefFormValues
): Record<string, unknown> {
  return {
    form: sanitizeBriefFormValues(values),
    form_updated_at: new Date().toISOString(),
  };
}

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "~/lib/supa-client";
import {
  SHORT_WORKFLOW_CATEGORY_OPTIONS,
  SHORT_WORKFLOW_IMAGE_MODEL_OPTIONS,
} from "./short-workflow.constants";

const allowedKeywordCategories = new Set(SHORT_WORKFLOW_CATEGORY_OPTIONS);
const allowedImageModels = new Set(SHORT_WORKFLOW_IMAGE_MODEL_OPTIONS);

export type ShortWorkflowKeywordRecord = {
  id: number;
  keyword: string;
  status: "wait" | "reserve" | "complete";
  reference: string | null;
  category: string | null;
  image_model: string | null;
  project_id: number | null;
  owner_profile_id: string | null;
  created_at: string;
  updated_at: string;
};

export type ShortWorkflowJobRecord = {
  id: number;
  title: string;
  status: "wait" | "reserve" | "processing" | "complete";
  keyword: string | null;
  length: string | null;
  intro: string | null;
  base: string | null;
  cta: string | null;
  tags: string | null;
  category: string | null;
  description: string | null;
  image_model: string | null;
  audio_file: string | null;
  audio_alignment: string | null;
  output: string | null;
  project_id: number | null;
  owner_profile_id: string | null;
  created_at: string;
  updated_at: string;
};

type UpsertKeywordPayload = {
  projectRowId: number;
  ownerProfileId: string;
  keyword: string;
  reference?: string | null;
  category?: string;
  imageModel?: string;
  status?: "wait" | "reserve" | "complete";
};

export async function upsertShortWorkflowKeyword(
  client: SupabaseClient<Database>,
  {
    projectRowId,
    ownerProfileId,
    keyword,
    reference,
    category,
    imageModel,
    status = "reserve",
  }: UpsertKeywordPayload
): Promise<ShortWorkflowKeywordRecord | null> {
  const trimmedKeyword = keyword.trim();
  if (!trimmedKeyword) {
    return null;
  }

  const normalizedCategory =
    typeof category === "string"
      ? allowedKeywordCategories.has(category)
        ? category
        : null
      : undefined;

  const normalizedImageModel =
    typeof imageModel === "string"
      ? allowedImageModels.has(imageModel)
        ? imageModel
        : null
      : undefined;

  const timestamp = new Date().toISOString();
  const basePayload: Record<string, unknown> = {
    keyword: trimmedKeyword,
    status,
    project_id: projectRowId,
    owner_profile_id: ownerProfileId,
    updated_at: timestamp,
  };

  if (normalizedCategory !== undefined) {
    basePayload.category = normalizedCategory;
  }

  if (normalizedImageModel !== undefined) {
    basePayload.image_model = normalizedImageModel;
  }

  const { data: existing, error: selectError } = await client
    .from("short_workflow_keywords")
    .select("id")
    .eq("project_id", projectRowId)
    .limit(1)
    .maybeSingle();

  if (selectError && selectError.code !== "PGRST116") {
    throw selectError;
  }

  const referenceProvided = reference !== undefined;
  const normalizedReference =
    referenceProvided && reference !== null ? reference : reference ?? null;

  if (existing) {
    const updatePayload = { ...basePayload };
    if (referenceProvided) {
      updatePayload.reference = normalizedReference;
    }
    const { data, error } = await client
      .from("short_workflow_keywords")
      .update(updatePayload)
      .eq("id", existing.id)
      .select("*")
      .single();
    if (error) {
      throw error;
    }
    return data as ShortWorkflowKeywordRecord;
  } else {
    const insertPayload = {
      ...basePayload,
      reference:
        normalizedReference === undefined ? null : normalizedReference,
      created_at: timestamp,
    };
    const { data, error } = await client
      .from("short_workflow_keywords")
      .insert(insertPayload)
      .select("*")
      .single();
    if (error) {
      throw error;
    }
    return data as ShortWorkflowKeywordRecord;
  }
}

export async function getShortWorkflowJobsByProject(
  client: SupabaseClient<Database>,
  {
    projectRowId,
    ownerProfileId,
    limit = 5,
  }: {
    projectRowId: number;
    ownerProfileId: string;
    limit?: number;
  }
): Promise<ShortWorkflowJobRecord[]> {
  const { data, error } = await client
    .from("short_workflow_jobs")
    .select("*")
    .eq("project_id", projectRowId)
    .eq("owner_profile_id", ownerProfileId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("short_workflow_jobs 조회 실패:", error);
    throw error;
  }

  return (data ?? []) as ShortWorkflowJobRecord[];
}

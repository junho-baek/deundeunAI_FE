/**
 * Projects Feature Database Mutations
 *
 * Supabase 클라이언트를 사용한 프로젝트 관련 데이터 변경 함수들 (INSERT, UPDATE, DELETE)
 * 데이터 조회는 queries.ts를 참조하세요.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "~/lib/supa-client";
import { getProjectByProjectId } from "./queries";

/**
 * 새 프로젝트 생성
 * @param client - Supabase 클라이언트
 * @param projectData - 생성할 프로젝트 데이터
 * @returns 생성된 프로젝트 객체
 */
export async function createProject(
  client: SupabaseClient<Database>,
  projectData: {
    project_id?: string; // 옵션: 명시적으로 지정하면 사용, 없으면 DB가 자동 생성
    owner_profile_id: string;
    title: string;
    description?: string;
    status?: string;
    visibility?: string;
    slug?: string;
    config?: Record<string, unknown>;
    metadata?: Record<string, unknown>;
  }
) {
  // id 필드는 제외하고 필요한 필드만 구성 (serial id는 DB가 자동 생성)
  const insertData: Record<string, unknown> = {
    project_id: projectData.project_id,
    owner_profile_id: projectData.owner_profile_id,
    title: projectData.title,
  };

  if (projectData.description !== undefined) {
    insertData.description = projectData.description;
  }
  if (projectData.status !== undefined) {
    insertData.status = projectData.status;
  }
  if (projectData.visibility !== undefined) {
    insertData.visibility = projectData.visibility;
  }
  if (projectData.slug !== undefined) {
    insertData.slug = projectData.slug;
  }
  if (projectData.config !== undefined) {
    insertData.config = projectData.config;
  }
  if (projectData.metadata !== undefined) {
    insertData.metadata = projectData.metadata;
  }

  const { data, error } = await client
    .from("projects")
    .insert(insertData)
    .select()
    .single();

  if (error) {
    console.error("프로젝트 생성 실패:", error);
    // 중복 키 에러인 경우 더 자세한 정보 제공
    if (error.code === "23505") {
      throw new Error(
        `프로젝트 생성에 실패했습니다: 중복된 키가 있습니다. ${error.details || error.message}`
      );
    }
    throw new Error(`프로젝트 생성에 실패했습니다: ${error.message}`);
  }

  return data;
}

/**
 * 프로젝트 업데이트
 * @param client - Supabase 클라이언트
 * @param projectId - 프로젝트의 UUID (project_id 필드)
 * @param updates - 업데이트할 필드들
 * @returns 업데이트된 프로젝트 객체
 */
export async function updateProject(
  client: SupabaseClient<Database>,
  projectId: string,
  updates: Partial<{
    title: string;
    description: string;
    status: string;
    visibility: string;
    slug: string;
    likes: number;
    views: number;
    ctr: number;
    budget: number;
    tiktok_url: string;
    video_url: string;
    thumbnail: string;
    cover_image: string;
    config: Record<string, unknown>;
    metadata: Record<string, unknown>;
    published_at: string;
    archived_at: string;
  }>
) {
  const { data, error } = await client
    .from("projects")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("project_id", projectId)
    .select()
    .single();

  if (error) {
    console.error("프로젝트 업데이트 실패:", error);
    throw new Error(`프로젝트 업데이트에 실패했습니다: ${error.message}`);
  }

  return data;
}

/**
 * 프로젝트 삭제
 * @param client - Supabase 클라이언트
 * @param projectId - 프로젝트의 UUID (project_id 필드)
 */
export async function deleteProject(
  client: SupabaseClient<Database>,
  projectId: string
) {
  const { error } = await client
    .from("projects")
    .delete()
    .eq("project_id", projectId);

  if (error) {
    console.error("프로젝트 삭제 실패:", error);
    throw new Error(`프로젝트 삭제에 실패했습니다: ${error.message}`);
  }
}

/**
 * 프로젝트 단계 상태 업데이트
 * @param client - Supabase 클라이언트
 * @param projectId - 프로젝트의 UUID (project_id 필드)
 * @param stepKey - 단계 키 ("brief", "script", "narration", "images", "videos", "final")
 * @param status - 새로운 상태 ("pending", "in_progress", "blocked", "completed")
 * @param metadata - 추가 메타데이터 (선택사항)
 * @returns 업데이트된 단계 객체
 */
export async function updateProjectStep(
  client: SupabaseClient<Database>,
  projectId: string,
  stepKey:
    | "brief"
    | "script"
    | "narration"
    | "images"
    | "videos"
    | "final"
    | "distribution",
  status: "pending" | "in_progress" | "blocked" | "completed",
  metadata?: Record<string, unknown>
) {
  // 먼저 프로젝트를 조회하여 serial ID를 얻음
  const project = await getProjectByProjectId(client, projectId);
  if (!project) {
    throw new Error("프로젝트를 찾을 수 없습니다.");
  }

  const updateData: {
    status: string;
    updated_at: string;
    started_at?: string | null;
    completed_at?: string | null;
    metadata?: Record<string, unknown>;
  } = {
    status,
    updated_at: new Date().toISOString(),
  };

  // 상태에 따라 started_at 또는 completed_at 설정
  if (status === "in_progress") {
    updateData.started_at = new Date().toISOString();
  }
  if (status === "completed") {
    updateData.completed_at = new Date().toISOString();
  }
  if (metadata) {
    updateData.metadata = metadata;
  }

  const { data, error } = await client
    .from("project_steps")
    .update(updateData)
    .eq("project_id", project.id)
    .eq("key", stepKey)
    .select()
    .single();

  if (error) {
    console.error("프로젝트 단계 업데이트 실패:", error);
    throw new Error(`프로젝트 단계 업데이트에 실패했습니다: ${error.message}`);
  }

  return data;
}

/**
 * 프로젝트 초기 단계들 생성
 * @param client - Supabase 클라이언트
 * @param projectId - 프로젝트의 serial ID
 * @returns 생성된 단계들
 */
export async function createInitialProjectSteps(
  client: SupabaseClient<Database>,
  projectId: number
) {
  // 이미 단계가 존재하는지 확인
  const { data: existingSteps } = await client
    .from("project_steps")
    .select("id")
    .eq("project_id", projectId);

  if (existingSteps && existingSteps.length > 0) {
    // 이미 단계가 존재하면 기존 단계 반환
    const { data: steps } = await client
      .from("project_steps")
      .select("*")
      .eq("project_id", projectId)
      .order("order", { ascending: true });
    return steps ?? [];
  }

  const steps = [
    { key: "brief", order: 1 },
    { key: "script", order: 2 },
    { key: "narration", order: 3 },
    { key: "images", order: 4 },
    { key: "videos", order: 5 },
    { key: "final", order: 6 },
  ];

  // id 필드는 명시적으로 제외 (serial이 자동 생성)
  const insertData = steps.map((step) => ({
    project_id: projectId,
    key: step.key,
    status: "pending" as const,
    order: step.order,
  }));

  const { data, error } = await client
    .from("project_steps")
    .insert(insertData)
    .select();

  if (error) {
    // 중복 키 에러인 경우 기존 단계를 반환 (시퀀스 동기화 문제 해결)
    if (error.code === "23505") {
      console.warn(
        "프로젝트 단계가 이미 존재합니다. 기존 단계를 반환합니다:",
        error.details
      );
      const { data: steps } = await client
        .from("project_steps")
        .select("*")
        .eq("project_id", projectId)
        .order("order", { ascending: true });
      return steps ?? [];
    }
    console.error("프로젝트 단계 생성 실패:", error);
    throw new Error(`프로젝트 단계 생성에 실패했습니다: ${error.message}`);
  }

  return data ?? [];
}


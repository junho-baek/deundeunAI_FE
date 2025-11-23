/**
 * 프로젝트 채팅 메시지 관련 쿼리 함수
 * n8n과 공유하는 데이터 구조 사용
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "~/lib/supa-client";

export type MessageAttachment = {
  name: string;
  size?: number;
  url?: string;
};

export type ProjectMessage = {
  id: string;
  role: "user" | "agent" | "system";
  content: string;
  attachments?: MessageAttachment[];
  aspectRatio?: string;
  stepKey?: string;
  payload?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  createdAt: string;
};

/**
 * 프로젝트의 모든 채팅 메시지 조회 (시간순 정렬)
 */
export async function getProjectMessages(
  client: SupabaseClient<Database>,
  projectId: string
): Promise<ProjectMessage[]> {
  // project_id를 integer로 변환 (serial ID 필요)
  const { data: project } = await client
    .from("projects")
    .select("id")
    .eq("project_id", projectId)
    .single();

  if (!project) {
    console.error("프로젝트를 찾을 수 없습니다:", projectId);
    return [];
  }

  const { data, error } = await client
    .from("project_messages")
    .select("*")
    .eq("project_id", project.id)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("프로젝트 메시지 조회 실패:", error);
    return [];
  }

  return (
    data?.map((msg) => ({
      id: msg.message_id,
      role: msg.role as "user" | "agent" | "system",
      content: msg.content,
      attachments: (msg.payload?.attachments as MessageAttachment[]) || [],
      aspectRatio: msg.payload?.aspectRatio as string | undefined,
      stepKey: msg.step_key || undefined,
      payload: (msg.payload as Record<string, unknown>) || {},
      metadata: (msg.metadata as Record<string, unknown>) || {},
      createdAt: msg.created_at,
    })) || []
  );
}

/**
 * 채팅 메시지 저장 (프로젝트 생성 시 초기 채팅 또는 단계별 응답)
 */
export async function saveProjectMessage(
  client: SupabaseClient<Database>,
  {
    projectId,
    role,
    content,
    attachments = [],
    aspectRatio,
    stepKey,
    parentMessageId,
    payload = {},
    metadata = {},
  }: {
    projectId: string;
    role: "user" | "agent" | "system";
    content: string;
    attachments?: MessageAttachment[];
    aspectRatio?: string;
    stepKey?: "brief" | "script" | "narration" | "images" | "videos" | "final" | "distribution";
    parentMessageId?: string;
    payload?: Record<string, unknown>;
    metadata?: Record<string, unknown>;
  }
): Promise<string> {
  // project_id를 integer로 변환 (serial ID 필요)
  const { data: project } = await client
    .from("projects")
    .select("id")
    .eq("project_id", projectId)
    .single();

  if (!project) {
    throw new Error("프로젝트를 찾을 수 없습니다.");
  }

  const { data, error } = await client
    .from("project_messages")
    .insert({
      project_id: project.id,
      role,
      content,
      attachments: attachments.length > 0 ? attachments : [],
      aspect_ratio: aspectRatio || null,
      step_key: stepKey || null,
      parent_message_id: parentMessageId || null,
      payload,
      metadata,
    })
    .select("message_id")
    .single();

  if (error) {
    console.error("메시지 저장 실패:", error);
    throw error;
  }

  return data.message_id;
}

/**
 * 여러 메시지를 한 번에 저장 (초기 채팅 내역 등)
 */
export async function saveProjectMessages(
  client: SupabaseClient<Database>,
  {
    projectId,
    messages,
  }: {
    projectId: string;
    messages: Array<{
      role: "user" | "agent" | "system";
      content: string;
      attachments?: MessageAttachment[];
      aspectRatio?: string;
      stepKey?: "brief" | "script" | "narration" | "images" | "videos" | "final" | "distribution";
      payload?: Record<string, unknown>;
      metadata?: Record<string, unknown>;
    }>;
  }
): Promise<string[]> {
  // project_id를 integer로 변환
  const { data: project } = await client
    .from("projects")
    .select("id")
    .eq("project_id", projectId)
    .single();

  if (!project) {
    throw new Error("프로젝트를 찾을 수 없습니다.");
  }

  const messageIds: string[] = [];
  let parentMessageId: string | undefined;

  for (const msg of messages) {
    const { data, error } = await client
      .from("project_messages")
      .insert({
        project_id: project.id,
        role: msg.role,
        content: msg.content,
        attachments: msg.attachments || [],
        aspect_ratio: msg.aspectRatio || null,
        step_key: msg.stepKey || null,
        parent_message_id: parentMessageId || null,
        payload: msg.payload || {},
        metadata: msg.metadata || {},
      })
      .select("message_id")
      .single();

    if (error) {
      console.error("메시지 저장 실패:", error);
      continue;
    }

    messageIds.push(data.message_id);
    parentMessageId = data.message_id; // 다음 메시지의 부모로 설정
  }

  return messageIds;
}


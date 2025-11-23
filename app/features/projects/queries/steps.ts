/**
 * 프로젝트 스텝별 데이터 저장/로드 쿼리 함수
 * n8n과 공유하는 데이터 구조 사용
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "~/lib/supa-client";

/**
 * 스텝별 완료 데이터 저장 (기획서, 대본, 나레이션 등)
 */
export async function saveStepData(
  client: SupabaseClient<Database>,
  {
    projectId,
    stepKey,
    data,
  }: {
    projectId: string;
    stepKey: "brief" | "script" | "narration" | "images" | "videos" | "final";
    data: {
      // 기획서: markdown content
      content?: string;
      // 대본: paragraph array
      contentJson?: string[];
      // 나레이션: audio segments
      audioSegments?: Array<{
        label: string;
        audioUrl: string;
        durationMs?: number;
      }>;
      // 이미지/비디오: media assets
      mediaAssets?: Array<{
        type: "image" | "video";
        sourceUrl: string;
        previewUrl?: string;
        label?: string;
        timelineLabel?: string;
        selected?: boolean;
      }>;
      // 최종 비디오
      videoUrl?: string;
      // 메타데이터
      metadata?: Record<string, unknown>;
    };
  }
): Promise<void> {
  // project_id를 integer로 변환
  const { data: project } = await client
    .from("projects")
    .select("id")
    .eq("project_id", projectId)
    .single();

  if (!project) {
    throw new Error("프로젝트를 찾을 수 없습니다.");
  }

  // 기획서/대본은 project_documents에 저장
  if (stepKey === "brief" || stepKey === "script") {
    // 기존 문서 확인
    const { data: existingDoc } = await client
      .from("project_documents")
      .select("id")
      .eq("project_id", project.id)
      .eq("type", stepKey)
      .single();

    if (existingDoc) {
      // 기존 문서 업데이트
      const { error: updateError } = await client
        .from("project_documents")
        .update({
          content: data.content || null,
          content_json: data.contentJson || [],
          status: "approved",
          metadata: data.metadata || {},
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingDoc.id);

      if (updateError) {
        console.error(`${stepKey} 문서 업데이트 실패:`, updateError);
        throw updateError;
      }
    } else {
      // 새 문서 생성
      const { error: insertError } = await client
        .from("project_documents")
        .insert({
          project_id: project.id,
          type: stepKey,
          content: data.content || null,
          content_json: data.contentJson || [],
          status: "approved",
          metadata: data.metadata || {},
        });

      if (insertError) {
        console.error(`${stepKey} 문서 생성 실패:`, insertError);
        throw insertError;
      }
    }
  }

  // 나레이션 오디오 세그먼트는 project_audio_segments에 저장
  if (stepKey === "narration" && data.audioSegments) {
    // 먼저 해당 문서 찾기 또는 생성
    const { data: scriptDoc } = await client
      .from("project_documents")
      .select("id")
      .eq("project_id", project.id)
      .eq("type", "script")
      .single();

    if (scriptDoc) {
      // 기존 세그먼트 삭제 후 새로 저장
      await client
        .from("project_audio_segments")
        .delete()
        .eq("document_id", scriptDoc.id);

      for (let i = 0; i < data.audioSegments.length; i++) {
        const segment = data.audioSegments[i];
        await client.from("project_audio_segments").insert({
          document_id: scriptDoc.id,
          segment_order: i,
          label: segment.label,
          audio_url: segment.audioUrl,
          duration_ms: segment.durationMs || null,
          metadata: {},
        });
      }
    }
  }

  // 이미지/비디오는 project_media_assets에 저장
  if ((stepKey === "images" || stepKey === "videos") && data.mediaAssets) {
    const assetType = stepKey === "images" ? "image" : "video";

    // 기존 자산 삭제 (해당 타입의 모든 자산)
    await client
      .from("project_media_assets")
      .delete()
      .eq("project_id", project.id)
      .eq("type", assetType);

    // 새 자산 저장
    for (let i = 0; i < data.mediaAssets.length; i++) {
      const asset = data.mediaAssets[i];
      const { error: insertError } = await client
        .from("project_media_assets")
        .insert({
          project_id: project.id,
          type: assetType,
          source: "generated",
          source_url: asset.sourceUrl,
          preview_url: asset.previewUrl || asset.sourceUrl,
          label: asset.label || null,
          timeline_label: asset.timelineLabel || null,
          selected: asset.selected || false,
          order: i,
          metadata: {},
        });

      if (insertError) {
        console.error(`${assetType} 자산 저장 실패:`, insertError);
        throw insertError;
      }
    }
  }

  // 최종 비디오는 projects 테이블에 저장
  if (stepKey === "final" && data.videoUrl) {
    const { error: projectError } = await client
      .from("projects")
      .update({
        video_url: data.videoUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("id", project.id);

    if (projectError) {
      console.error("최종 비디오 URL 저장 실패:", projectError);
      throw projectError;
    }
  }
}

/**
 * 스텝별 데이터 로드
 */
export async function loadStepData(
  client: SupabaseClient<Database>,
  {
    projectId,
    stepKey,
  }: {
    projectId: string;
    stepKey: "brief" | "script" | "narration" | "images" | "videos" | "final";
  }
): Promise<{
  content?: string;
  contentJson?: string[];
  audioSegments?: Array<{
    label: string;
    audioUrl: string;
    durationMs?: number;
  }>;
  mediaAssets?: Array<{
    type: "image" | "video";
    sourceUrl: string;
    previewUrl?: string;
    label?: string;
    timelineLabel?: string;
    selected?: boolean;
  }>;
  videoUrl?: string;
  metadata?: Record<string, unknown>;
} | null> {
  // project_id를 integer로 변환
  const { data: project } = await client
    .from("projects")
    .select("id")
    .eq("project_id", projectId)
    .single();

  if (!project) {
    return null;
  }

  const result: {
    content?: string;
    contentJson?: string[];
    audioSegments?: Array<{
      label: string;
      audioUrl: string;
      durationMs?: number;
    }>;
    mediaAssets?: Array<{
      type: "image" | "video";
      sourceUrl: string;
      previewUrl?: string;
      label?: string;
      timelineLabel?: string;
      selected?: boolean;
    }>;
    videoUrl?: string;
    metadata?: Record<string, unknown>;
  } = {};

  // 기획서/대본 로드
  if (stepKey === "brief" || stepKey === "script") {
    const { data: doc } = await client
      .from("project_documents")
      .select("*")
      .eq("project_id", project.id)
      .eq("type", stepKey)
      .single();

    if (doc) {
      result.content = doc.content || undefined;
      result.contentJson = (doc.content_json as string[]) || undefined;
      result.metadata = (doc.metadata as Record<string, unknown>) || {};
    }
  }

  // 나레이션 오디오 세그먼트 로드
  if (stepKey === "narration") {
    const { data: scriptDoc } = await client
      .from("project_documents")
      .select("id")
      .eq("project_id", project.id)
      .eq("type", "script")
      .single();

    if (scriptDoc) {
      const { data: segments } = await client
        .from("project_audio_segments")
        .select("*")
        .eq("document_id", scriptDoc.id)
        .order("segment_order", { ascending: true });

      if (segments) {
        result.audioSegments = segments.map((seg) => ({
          label: seg.label,
          audioUrl: seg.audio_url,
          durationMs: seg.duration_ms || undefined,
        }));
      }
    }
  }

  // 이미지/비디오 로드
  if (stepKey === "images" || stepKey === "videos") {
    const assetType = stepKey === "images" ? "image" : "video";
    const { data: assets } = await client
      .from("project_media_assets")
      .select("*")
      .eq("project_id", project.id)
      .eq("type", assetType)
      .order("order", { ascending: true });

    if (assets) {
      result.mediaAssets = assets.map((asset) => ({
        type: assetType,
        sourceUrl: asset.source_url || "",
        previewUrl: asset.preview_url || undefined,
        label: asset.label || undefined,
        timelineLabel: asset.timeline_label || undefined,
        selected: asset.selected || false,
      }));
    }
  }

  // 최종 비디오 URL 로드
  if (stepKey === "final") {
    const { data: projectData } = await client
      .from("projects")
      .select("video_url")
      .eq("id", project.id)
      .single();

    if (projectData?.video_url) {
      result.videoUrl = projectData.video_url;
    }
  }

  return Object.keys(result).length > 0 ? result : null;
}


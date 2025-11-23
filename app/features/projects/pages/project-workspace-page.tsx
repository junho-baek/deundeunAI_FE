import * as React from "react";
import {
  type LoaderFunctionArgs,
  type MetaFunction,
  useLoaderData,
  useParams,
  useFetcher,
  redirect,
} from "react-router";

import { ProjectAccordion } from "~/features/projects/components/project-accordion";
import { Typography } from "~/common/components/typography";
import ProjectPrd from "~/features/projects/components/project-prd";
import ProjectScript from "~/features/projects/components/project-script";
import ProjectScriptAudio from "~/features/projects/components/project-script-audio";
import ProjectImageSelect from "~/features/projects/components/project-image-select";
import ProjectVideoSelect from "~/features/projects/components/project-video-select";
import ProjectFinalVideo from "~/features/projects/components/project-final-video";
import ProjectBriefReviewForm from "~/features/projects/components/project-brief-review-form";
import ProjectBriefEditor from "~/features/projects/components/project-brief-editor";
import ProjectScriptReviewForm from "~/features/projects/components/project-script-review-form";
import ProjectScriptEditor from "~/features/projects/components/project-script-editor";
import ProjectNarrationReviewForm from "~/features/projects/components/project-narration-review-form";
import ProjectFinalReviewForm from "~/features/projects/components/project-final-review-form";
import { useProjectDetail } from "~/features/projects/layouts/project-detail-layout";
import {
  getProjectWorkspaceData,
  getProjectSteps,
} from "~/features/projects/queries";
import { makeSSRClient } from "~/lib/supa-client";
import {
  generateMockBrief,
  generateMockScript,
  generateMockNarrationSegments,
  generateMockProjectTitle,
  generateMockProjectDescription,
  MOCK_IMAGE_URLS,
  MOCK_VIDEO_URLS,
} from "~/features/projects/utils/mock-data";
import type { ShortWorkflowJobRecord } from "../short-workflow";
import { getShortWorkflowJobsByProject } from "../short-workflow";
import { browserClient } from "~/lib/supa-client";

export const meta: MetaFunction = () => {
  return [
    {
      title: "든든AI - 프로젝트 워크스페이스",
    },
    {
      name: "description",
      content:
        "생성된 기획서와 대본, 이미지, 영상 자산을 검토하고 최종 편집을 완료하세요.",
    },
  ];
};

/**
 * 프로젝트 워크스페이스 데이터 로더
 * 프로젝트의 문서, 미디어 자산, 오디오 세그먼트 등을 조회합니다
 */
export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client } = makeSSRClient(request);
  const projectId = params.projectId;

  if (!projectId || projectId === "create") {
    return {
      workspaceData: null,
      projectSteps: [],
      shortWorkflowJobs: [],
      projectRowId: null,
    };
  }

  try {
    // 프로젝트 소유자 확인 (접근 제어)
    const { getLoggedInProfileId } = await import("~/features/users/queries");
    const { getProjectByProjectId } = await import("../queries");

    const ownerProfileId = await getLoggedInProfileId(client);
    const project = await getProjectByProjectId(client, projectId);

    // 프로젝트가 없거나 소유자가 아닌 경우 접근 거부
    if (!project || project.owner_profile_id !== ownerProfileId) {
      throw redirect("/my/dashboard/projects");
    }

    // 이벤트 트래킹 (에러가 있어도 페이지는 계속 로드)
    try {
      await client.rpc("track_event", {
        event_type: "project_workspace_view",
        event_data: {
          project_id: projectId,
        },
      });
    } catch (error) {
      console.error("이벤트 트래킹 실패:", error);
    }

    const [workspaceData, projectSteps, shortWorkflowJobs] = await Promise.all([
      getProjectWorkspaceData(client, projectId),
      getProjectSteps(client, projectId),
      getShortWorkflowJobsByProject(client, {
        projectRowId: project.id,
        ownerProfileId,
        limit: 5,
      }),
    ]);
    return {
      workspaceData,
      projectSteps,
      shortWorkflowJobs,
      projectRowId: project.id,
    };
  } catch (error) {
    // redirect 에러는 그대로 전파
    if (error && typeof error === "object" && "status" in error) {
      throw error;
    }
    console.error("워크스페이스 데이터 로드 실패:", error);
    throw redirect("/my/dashboard/projects");
  }
}

export default function ProjectWorkspacePage({
  workspaceData: workspaceDataProp,
}: {
  workspaceData?: Awaited<ReturnType<typeof loader>>["workspaceData"];
} = {}) {
  // useLoaderData는 항상 호출해야 함 (React 규칙)
  // props로 workspaceData가 전달되면 그것을 우선 사용
  // project-create-page.tsx의 loader 데이터도 처리 가능하도록 any 타입 사용
  const loaderData = useLoaderData<any>();

  // loaderData에서 workspaceData와 projectSteps 추출 (여러 형식 지원)
  const loaderWorkspaceData = loaderData?.workspaceData ?? null;
  const loaderProjectSteps = loaderData?.projectSteps ?? [];
  const loaderShortWorkflowJobs =
    (loaderData?.shortWorkflowJobs as ShortWorkflowJobRecord[] | undefined) ??
    [];
  const loaderProjectRowId = loaderData?.projectRowId as number | undefined;
  const workspaceData = workspaceDataProp ?? loaderWorkspaceData ?? null;
  const projectSteps = loaderProjectSteps;

  // projectId는 optional (project-create-page.tsx에서는 없을 수 있음)
  const params = useParams();
  const projectId = params?.projectId;
  const projectRowId = loaderProjectRowId ?? workspaceData?.project?.id;

  const [shortWorkflowJobs, setShortWorkflowJobs] =
    React.useState<ShortWorkflowJobRecord[]>(loaderShortWorkflowJobs);
  const [selectedJobId, setSelectedJobId] = React.useState<number | null>(
    loaderShortWorkflowJobs[0]?.id ?? null
  );

  React.useEffect(() => {
    setShortWorkflowJobs(loaderShortWorkflowJobs);
  }, [loaderShortWorkflowJobs]);

  React.useEffect(() => {
    if (loaderShortWorkflowJobs.length > 0 && selectedJobId === null) {
      setSelectedJobId(loaderShortWorkflowJobs[0].id);
    }
  }, [loaderShortWorkflowJobs, selectedJobId]);

  React.useEffect(() => {
    if (
      selectedJobId !== null &&
      shortWorkflowJobs.some((job) => job.id === selectedJobId)
    ) {
      return;
    }
    if (shortWorkflowJobs.length > 0) {
      setSelectedJobId(shortWorkflowJobs[0].id);
    }
  }, [shortWorkflowJobs, selectedJobId]);

  React.useEffect(() => {
    if (!projectRowId) return;
    const channel = browserClient
      .channel(`short-workflow-jobs-${projectRowId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "short_workflow_jobs",
          filter: `project_id=eq.${projectRowId}`,
        },
        (payload) => {
          setShortWorkflowJobs((prev) => {
            let next = [...prev];
            if (payload.eventType === "INSERT" || payload.eventType === "UPDATE") {
              const newJob = payload.new as ShortWorkflowJobRecord;
              next = [newJob, ...next.filter((job) => job.id !== newJob.id)];
            } else if (payload.eventType === "DELETE") {
              const deletedId =
                (payload.old as { id?: number } | null | undefined)?.id;
              if (deletedId) {
                next = next.filter((job) => job.id !== deletedId);
              }
            }
            return next
              .sort(
                (a, b) =>
                  new Date(b.created_at).getTime() -
                  new Date(a.created_at).getTime()
              )
              .slice(0, 5);
          });
        }
      )
      .subscribe();

    return () => {
      browserClient.removeChannel(channel);
    };
  }, [projectRowId]);

  const {
    imageTimelines,
    selectedImages,
    toggleSelectImage,
    videoTimelines,
    selectedVideos,
    toggleSelectVideo,
    loading,
    done,
    narrationSegments: defaultNarrationSegments,
  } = useProjectDetail();

  // 완료된 단계 확인 및 다음 단계 결정
  const stepOrder = [
    "brief",
    "script",
    "narration",
    "images",
    "videos",
    "final",
  ];
  const nextStepToResume = React.useMemo(() => {
    if (
      !projectSteps ||
      projectSteps.length === 0 ||
      !projectId ||
      projectId === "create"
    ) {
      return null;
    }

    const stepMap = new Map(
      projectSteps.map((s: { key: string; status: string }) => [
        s.key,
        s.status,
      ])
    );

    // 완료되지 않은 첫 번째 단계 찾기
    for (const stepKey of stepOrder) {
      const status = stepMap.get(stepKey);
      if (status !== "completed") {
        return stepKey;
      }
    }

    // 모든 단계가 완료되었으면 null 반환
    return null;
  }, [projectSteps, projectId]);

  // 기본 Accordion 값 설정 (다음 단계로 자동 열기)
  const defaultAccordionValue = React.useMemo(() => {
    if (nextStepToResume) {
      const stepIndex = stepOrder.indexOf(nextStepToResume);
      return `step-${stepIndex + 1}`;
    }
    return "step-1";
  }, [nextStepToResume]);

  // 편집 모드 상태 관리
  const [isEditingBrief, setIsEditingBrief] = React.useState(false);
  const [isEditingScript, setIsEditingScript] = React.useState(false);

  // Fetcher for actions
  const briefSubmitFetcher = useFetcher();
  const briefUpdateFetcher = useFetcher();
  const scriptSubmitFetcher = useFetcher();
  const scriptUpdateFetcher = useFetcher();
  const narrationRegenerateFetcher = useFetcher();
  const narrationSubmitFetcher = useFetcher();
  const imagesRegenerateFetcher = useFetcher();
  const imagesSubmitFetcher = useFetcher();
  const videosRegenerateFetcher = useFetcher();
  const videosSubmitFetcher = useFetcher();
  const deployFetcher = useFetcher();

  const briefSubmitPending = briefSubmitFetcher.state !== "idle";
  const briefUpdatePending = briefUpdateFetcher.state !== "idle";
  const scriptSubmitPending = scriptSubmitFetcher.state !== "idle";
  const scriptUpdatePending = scriptUpdateFetcher.state !== "idle";
  const narrationRegeneratePending =
    narrationRegenerateFetcher.state !== "idle";
  const narrationSubmitPending = narrationSubmitFetcher.state !== "idle";
  const imagesRegeneratePending = imagesRegenerateFetcher.state !== "idle";
  const imagesSubmitPending = imagesSubmitFetcher.state !== "idle";
  const videosRegeneratePending = videosRegenerateFetcher.state !== "idle";
  const videosSubmitPending = videosSubmitFetcher.state !== "idle";
  const deployPending = deployFetcher.state !== "idle";

  const optimisticDone = React.useMemo<DoneState>(
    () => ({
      brief: done.brief || briefSubmitPending,
      script: done.script || scriptSubmitPending,
      narration: done.narration || narrationSubmitPending,
      images: done.images || imagesSubmitPending,
      videos: done.videos || videosSubmitPending,
      final: done.final || deployPending,
    }),
    [
      done.brief,
      done.script,
      done.narration,
      done.images,
      done.videos,
      done.final,
      briefSubmitPending,
      scriptSubmitPending,
      narrationSubmitPending,
      imagesSubmitPending,
      videosSubmitPending,
      deployPending,
    ]
  );

  const optimisticLoading = React.useMemo<LoadingState>(
    () => ({
      brief: loading.brief || briefSubmitPending || briefUpdatePending,
      script:
        loading.script ||
        scriptSubmitPending ||
        scriptUpdatePending ||
        briefSubmitPending,
      narration:
        loading.narration ||
        narrationSubmitPending ||
        narrationRegeneratePending ||
        scriptSubmitPending,
      images:
        loading.images ||
        imagesSubmitPending ||
        imagesRegeneratePending ||
        narrationSubmitPending,
      videos:
        loading.videos ||
        videosSubmitPending ||
        videosRegeneratePending ||
        imagesSubmitPending,
      final:
        loading.final ||
        deployPending ||
        videosSubmitPending,
    }),
    [
      loading.brief,
      loading.script,
      loading.narration,
      loading.images,
      loading.videos,
      loading.final,
      briefSubmitPending,
      briefUpdatePending,
      scriptSubmitPending,
      scriptUpdatePending,
      narrationSubmitPending,
      narrationRegeneratePending,
      imagesSubmitPending,
      imagesRegeneratePending,
      videosSubmitPending,
      videosRegeneratePending,
      deployPending,
    ]
  );

  // 데이터베이스에서 가져온 문서 데이터 사용
  const briefDocument = React.useMemo(() => {
    if (!workspaceData?.documents) return null;
    return workspaceData.documents.find(
      (doc: { type: string }) => doc.type === "brief"
    );
  }, [workspaceData]);

  const scriptDocument = React.useMemo(() => {
    if (!workspaceData?.documents) return null;
    return workspaceData.documents.find(
      (doc: { type: string }) => doc.type === "script"
    );
  }, [workspaceData]);

  // 프로젝트 키워드 추출 (제목이나 설명에서)
  const projectKeyword = React.useMemo(() => {
    if (workspaceData?.project?.title) {
      // 제목에서 키워드 추출 (간단한 방법)
      const title = workspaceData.project.title;
      const keywords = title
        .split(/[,\s]+/)
        .filter((w: string) => w.length > 2);
      return keywords[0] || undefined;
    }
    return undefined;
  }, [workspaceData]);

  // 기획서 마크다운 (데이터베이스에서 가져오거나 실감나는 기본값)
  const selectedShortWorkflowJob = React.useMemo(
    () =>
      selectedJobId
        ? shortWorkflowJobs.find((job) => job.id === selectedJobId) ?? null
        : null,
    [selectedJobId, shortWorkflowJobs]
  );

  const shortWorkflowJobMarkdown = React.useMemo(() => {
    if (!selectedShortWorkflowJob) return null;
    return formatShortWorkflowJobMarkdown(selectedShortWorkflowJob);
  }, [selectedShortWorkflowJob]);

  const projectBriefMd = React.useMemo(() => {
    if (briefDocument?.content) {
      return briefDocument.content;
    }
    if (shortWorkflowJobMarkdown) {
      return shortWorkflowJobMarkdown;
    }
    return generateMockBrief(projectKeyword);
  }, [briefDocument, projectKeyword, shortWorkflowJobMarkdown]);

  // 대본 단락 (데이터베이스에서 가져오거나 실감나는 기본값)
  const scriptParagraphs = React.useMemo(() => {
    if (
      scriptDocument?.content_json &&
      Array.isArray(scriptDocument.content_json)
    ) {
      return scriptDocument.content_json;
    }
    if (scriptDocument?.content) {
      // content를 단락으로 분리 (공백 제거 및 빈 값 필터링)
      return scriptDocument.content
        .split("\n\n")
        .map((p: string) => p.trim())
        .filter((p: string) => p.length > 0);
    }
    // 실감나는 스크립트 샘플 사용
    return generateMockScript(projectKeyword);
  }, [scriptDocument, projectKeyword]);

  // 오디오 세그먼트 (데이터베이스에서 가져오거나 기본값)
  const narrationSegmentsFromDb = React.useMemo(() => {
    if (
      workspaceData?.audioSegments &&
      workspaceData.audioSegments.length > 0
    ) {
      return workspaceData.audioSegments.map((seg: any, index: number) => ({
        id: seg.id || index + 1,
        label:
          seg.label ||
          seg.timeline_label ||
          `00:${index * 10}–00:${(index + 1) * 10}`,
        src: seg.audio_url || `/audio/seg-${index + 1}.mp3`,
      }));
    }
    return null; // 기본값은 useProjectDetail에서 가져옴
  }, [workspaceData]);

  // 데이터베이스에서 가져온 오디오 세그먼트가 있으면 사용, 없으면 실감나는 기본값 사용
  const narrationSegments =
    narrationSegmentsFromDb || generateMockNarrationSegments();

  // 이미지 URL 목록 (미디어 자산에서 가져오기)
  const imageUrls = React.useMemo(() => {
    if (!workspaceData?.mediaAssets) return null;
    return workspaceData.mediaAssets
      .filter((asset: any) => asset.type === "image")
      .map((asset: any) => asset.source_url || asset.preview_url)
      .filter((url: string | null) => url);
  }, [workspaceData]);

  // 비디오 URL 목록 (미디어 자산에서 가져오기)
  const videoUrls = React.useMemo(() => {
    if (!workspaceData?.mediaAssets) return null;
    return workspaceData.mediaAssets
      .filter((asset: any) => asset.type === "video")
      .map((asset: any) => asset.source_url || asset.preview_url)
      .filter((url: string | null) => url);
  }, [workspaceData]);

  // 최종 비디오 URL
  const finalVideoUrl = React.useMemo(() => {
    if (workspaceData?.project?.video_url) {
      return workspaceData.project.video_url;
    }
    if (videoUrls && videoUrls.length > 0) {
      return videoUrls[0];
    }
    return null;
  }, [workspaceData, videoUrls]);

  // Action handlers
  const handleBriefEdit = React.useCallback(() => {
    setIsEditingBrief(true);
  }, []);

  const handleBriefCancel = React.useCallback(() => {
    setIsEditingBrief(false);
  }, []);

  const handleBriefSave = React.useCallback(
    async (content: string) => {
      if (!projectId) return;
      const formData = new FormData();
      formData.append("content", content);
      briefUpdateFetcher.submit(formData, {
        method: "post",
        action: `/my/dashboard/project/${projectId}/brief/update`,
      });
      setIsEditingBrief(false);
    },
    [projectId, briefUpdateFetcher]
  );

  const handleBriefApprove = React.useCallback(() => {
    if (!projectId) return;
    briefSubmitFetcher.submit(
      {},
      {
        method: "post",
        action: `/my/dashboard/project/${projectId}/brief/submit`,
      }
    );
  }, [projectId, briefSubmitFetcher]);

  const handleScriptEdit = React.useCallback(() => {
    setIsEditingScript(true);
  }, []);

  const handleScriptCancel = React.useCallback(() => {
    setIsEditingScript(false);
  }, []);

  const handleScriptSave = React.useCallback(
    async (content: string | string[]) => {
      if (!projectId) return;
      const formData = new FormData();
      formData.append("content", JSON.stringify(content));
      scriptUpdateFetcher.submit(formData, {
        method: "post",
        action: `/my/dashboard/project/${projectId}/script/update`,
      });
      setIsEditingScript(false);
    },
    [projectId, scriptUpdateFetcher]
  );

  const handleScriptApprove = React.useCallback(() => {
    if (!projectId) return;
    scriptSubmitFetcher.submit(
      {},
      {
        method: "post",
        action: `/my/dashboard/project/${projectId}/script/submit`,
      }
    );
  }, [projectId, scriptSubmitFetcher]);

  const handleNarrationRegenerate = React.useCallback(() => {
    if (!projectId) return;
    narrationRegenerateFetcher.submit(
      {},
      {
        method: "post",
        action: `/my/dashboard/project/${projectId}/narration/regenerate`,
      }
    );
  }, [projectId, narrationRegenerateFetcher]);

  const handleNarrationApprove = React.useCallback(() => {
    if (!projectId) return;
    narrationSubmitFetcher.submit(
      {},
      {
        method: "post",
        action: `/my/dashboard/project/${projectId}/narration/submit`,
      }
    );
  }, [projectId, narrationSubmitFetcher]);

  const handleImagesRegenerate = React.useCallback(() => {
    if (!projectId || selectedImages.length === 0) return;
    const formData = new FormData();
    formData.append("imageIds", JSON.stringify(selectedImages));
    imagesRegenerateFetcher.submit(formData, {
      method: "post",
      action: `/my/dashboard/project/${projectId}/images/regenerate`,
    });
  }, [projectId, selectedImages, imagesRegenerateFetcher]);

  const handleImagesApprove = React.useCallback(() => {
    if (!projectId) return;
    const formData = new FormData();
    if (selectedImages.length > 0) {
      formData.append("imageIds", JSON.stringify(selectedImages));
    }
    imagesSubmitFetcher.submit(formData, {
      method: "post",
      action: `/my/dashboard/project/${projectId}/images/submit`,
    });
  }, [projectId, selectedImages, imagesSubmitFetcher]);

  const handleVideosRegenerate = React.useCallback(() => {
    if (!projectId || selectedVideos.length === 0) return;
    const formData = new FormData();
    formData.append("videoIds", JSON.stringify(selectedVideos));
    videosRegenerateFetcher.submit(formData, {
      method: "post",
      action: `/my/dashboard/project/${projectId}/videos/regenerate`,
    });
  }, [projectId, selectedVideos, videosRegenerateFetcher]);

  const handleVideosApprove = React.useCallback(() => {
    if (!projectId) return;
    const formData = new FormData();
    if (selectedVideos.length > 0) {
      formData.append("videoId", String(selectedVideos[0]));
    }
    videosSubmitFetcher.submit(formData, {
      method: "post",
      action: `/my/dashboard/project/${projectId}/videos/submit`,
    });
  }, [projectId, selectedVideos, videosSubmitFetcher]);

  const handleDeploy = React.useCallback(() => {
    if (!projectId) return;
    deployFetcher.submit(
      {},
      {
        method: "post",
        action: `/my/dashboard/project/${projectId}/deploy`,
      }
    );
  }, [projectId, deployFetcher]);

  // Action data에서 성공 메시지 확인 후 편집 모드 해제
  React.useEffect(() => {
    if (briefUpdateFetcher.data?.success) {
      setIsEditingBrief(false);
    }
  }, [briefUpdateFetcher.data]);

  React.useEffect(() => {
    if (scriptUpdateFetcher.data?.success) {
      setIsEditingScript(false);
    }
  }, [scriptUpdateFetcher.data]);

  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto pr-1">
        {shortWorkflowJobs.length > 0 && (
          <ShortWorkflowJobDeck
            jobs={shortWorkflowJobs}
            selectedJobId={selectedJobId}
            onSelect={(id) => setSelectedJobId(id)}
          />
        )}
        <ProjectAccordion defaultValue={defaultAccordionValue}>
          {/* Step 1: Brief */}
          <ProjectPrd
            value="step-1"
            title="step 1: 수익형 콘텐츠 기획서"
            markdownHtml={renderMarkdown(projectBriefMd)}
            loading={optimisticLoading.brief}
            done={optimisticDone.brief}
            onEdit={optimisticDone.brief ? handleBriefEdit : undefined}
            onDone={optimisticDone.brief ? handleBriefApprove : undefined}
          />
          {isEditingBrief && optimisticDone.brief && (
            <div className="px-4 pb-4">
              <ProjectBriefEditor
                projectId={projectId || ""}
                initialContent={projectBriefMd}
                onCancel={handleBriefCancel}
                onSave={handleBriefSave}
              />
            </div>
          )}

          {/* Step 2: Script */}
          <ProjectScript
            value="step-2"
            title="step 2: 대본 작성"
            paragraphs={scriptParagraphs}
            loading={optimisticLoading.script}
            done={optimisticDone.script}
            onEdit={optimisticDone.script ? handleScriptEdit : undefined}
            onDone={optimisticDone.script ? handleScriptApprove : undefined}
          />
          {isEditingScript && optimisticDone.script && (
            <div className="px-4 pb-4">
              <ProjectScriptEditor
                projectId={projectId || ""}
                initialContent={scriptParagraphs}
                onCancel={handleScriptCancel}
                onSave={handleScriptSave}
              />
            </div>
          )}

          {/* Step 3: Narration */}
          <ProjectScriptAudio
            value="step-3"
            title="step 3: 나레이션 확인하기"
            segments={narrationSegments}
            loading={optimisticLoading.narration}
            done={optimisticDone.narration}
            onEdit={
              optimisticDone.narration ? handleNarrationRegenerate : undefined
            }
            onDone={
              optimisticDone.narration ? handleNarrationApprove : undefined
            }
          />

          {/* Step 4: Images */}
          <ProjectImageSelect
            value="step-4"
            title="step 4: 생성된 이미지"
            images={
              imageUrls && imageUrls.length > 0 ? imageUrls : MOCK_IMAGE_URLS
            }
            timelines={imageTimelines}
            selected={selectedImages}
            onToggle={toggleSelectImage}
            onRegenerate={
              optimisticDone.images ? handleImagesRegenerate : undefined
            }
            onDone={
              optimisticDone.images ? handleImagesApprove : undefined
            }
            loading={optimisticLoading.images}
            done={optimisticDone.images}
          />

          {/* Step 5: Videos */}
          <ProjectVideoSelect
            value="step-5"
            title="step 5: 생성된 영상 확인하기"
            sources={
              videoUrls && videoUrls.length > 0 ? videoUrls : MOCK_VIDEO_URLS
            }
            timelines={videoTimelines}
            selected={selectedVideos}
            onToggle={toggleSelectVideo}
            onRegenerate={
              optimisticDone.videos ? handleVideosRegenerate : undefined
            }
            onDone={
              optimisticDone.videos ? handleVideosApprove : undefined
            }
            loading={optimisticLoading.videos}
            done={optimisticDone.videos}
          />

          {/* Step 6: Final */}
          <ProjectFinalVideo
            value="step-6"
            title="step 6: 편집된 영상 확인 및 업로드"
            videoSrc={finalVideoUrl || MOCK_VIDEO_URLS[0]}
            headline={
              workspaceData?.project?.title ||
              generateMockProjectTitle(projectKeyword)
            }
            description={
              workspaceData?.project?.description ||
              generateMockProjectDescription(projectKeyword)
            }
            durationText="영상 길이 00:30"
            loading={optimisticLoading.final}
            done={optimisticDone.final}
            onDone={optimisticDone.final ? handleDeploy : undefined}
          />
        </ProjectAccordion>
      </div>
    </div>
  );
}

function renderMarkdown(md: string): string {
  const safe = md.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const lines = safe.split(/\n/);
  let html = "";
  let inList = false;
  const flush = () => {
    if (inList) {
      html += "</ul>";
      inList = false;
    }
  };
  for (const l of lines) {
    let line = l.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    if (/^#\s+/.test(line)) {
      flush();
      html += `<h3>${line.replace(/^#\s+/, "")}</h3>`;
      continue;
    }
    if (/^##\s+/.test(line)) {
      flush();
      html += `<h4>${line.replace(/^##\s+/, "")}</h4>`;
      continue;
    }
    if (/^\-\s+/.test(line)) {
      if (!inList) {
        html += "<ul>";
        inList = true;
      }
      html += `<li>${line.replace(/^\-\s+/, "")}</li>`;
      continue;
    }
    if (line.trim() === "") {
      flush();
      html += "<br/>";
    } else {
      flush();
      html += `<p>${line}</p>`;
    }
  }
  flush();
  return html;
}

function formatShortWorkflowJobMarkdown(job: ShortWorkflowJobRecord): string {
  const details: string[] = [];
  details.push(`# ${job.title || "제목 미정"}`);
  details.push(
    [
      `- **키워드:** ${job.keyword || "미정"}`,
      `- **카테고리:** ${job.category || "미정"}`,
      `- **길이:** ${job.length || "0"}`,
      `- **태그:** ${job.tags || "없음"}`,
    ].join("\n")
  );
  if (job.description) {
    details.push(`- **설명:** ${job.description}`);
  }
  if (job.intro) {
    details.push(`## Intro\n${job.intro}`);
  }
  if (job.base) {
    details.push(`## 본문\n${job.base}`);
  }
  if (job.cta) {
    details.push(`## CTA\n${job.cta}`);
  }
  return details.join("\n\n");
}

function ShortWorkflowJobDeck({
  jobs,
  selectedJobId,
  onSelect,
}: {
  jobs: ShortWorkflowJobRecord[];
  selectedJobId: number | null;
  onSelect: (id: number) => void;
}) {
  if (jobs.length === 0) return null;

  return (
    <section className="space-y-3 px-4 pb-6">
      <div className="flex flex-col gap-1">
        <Typography
          as="h3"
          variant="h4"
          className="text-base font-semibold text-foreground"
        >
          생성된 쇼츠 초안 5개
        </Typography>
        <p className="text-sm text-muted-foreground">
          원하는 초안을 선택하면 기획서에 바로 반영됩니다.
        </p>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {jobs.map((job) => {
          const isSelected = job.id === selectedJobId;
          return (
            <button
              key={job.id}
              type="button"
              onClick={() => onSelect(job.id)}
              className={`rounded-2xl border p-4 text-left transition duration-150 ${
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-muted bg-background/80 hover:border-primary/40"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-foreground">
                  {job.title}
                </p>
                {job.category ? (
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                    {job.category}
                  </span>
                ) : null}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                키워드: {job.keyword || "-"} · 길이: {job.length || "0"}
              </p>
              <div className="mt-3 space-y-2 text-sm text-foreground">
                {job.intro ? (
                  <p className="line-clamp-2">
                    <span className="font-medium text-muted-foreground">
                      Intro:
                    </span>{" "}
                    {job.intro}
                  </p>
                ) : null}
                {job.base ? (
                  <p className="line-clamp-2">
                    <span className="font-medium text-muted-foreground">
                      Base:
                    </span>{" "}
                    {job.base}
                  </p>
                ) : null}
                {job.cta ? (
                  <p className="line-clamp-1">
                    <span className="font-medium text-muted-foreground">
                      CTA:
                    </span>{" "}
                    {job.cta}
                  </p>
                ) : null}
                {job.tags ? (
                  <p className="text-xs text-muted-foreground">
                    #{job.tags.split(",").join(" #")}
                  </p>
                ) : null}
              </div>
              {isSelected ? (
                <p className="mt-3 text-xs font-medium text-primary">
                  이 초안이 현재 기획서에 적용되었습니다.
                </p>
              ) : (
                <p className="mt-3 text-xs text-muted-foreground">
                  클릭하여 기획서에 적용
                </p>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}

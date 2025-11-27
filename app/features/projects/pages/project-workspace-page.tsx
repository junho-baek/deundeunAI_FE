import * as React from "react";
import {
  Await,
  redirect,
  type LoaderFunctionArgs,
  type MetaFunction,
  useFetcher,
  useLoaderData,
  useParams,
} from "react-router";
import type { Route } from "./+types/project-workspace-page";

import { ProjectAccordion } from "~/features/projects/components/project-accordion";
import { Typography } from "~/common/components/typography";
import ProjectPrd from "~/features/projects/components/project-prd";
import ProjectScript from "~/features/projects/components/project-script";
import ProjectScriptAudio, {
  type AudioSegment,
} from "~/features/projects/components/project-script-audio";
import ProjectImageSelect, {
  type ProjectImageEntry,
} from "~/features/projects/components/project-image-select";
import ProjectVideoSelect from "~/features/projects/components/project-video-select";
import ProjectFinalVideo from "~/features/projects/components/project-final-video";
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
  generateMockProjectTitle,
  generateMockProjectDescription,
} from "~/features/projects/utils/mock-data";
import type {
  ShortWorkflowJobRecord,
  ShortWorkflowImageRecord,
} from "../short-workflow";
import {
  getShortWorkflowJobsByProject,
  getShortWorkflowImagesByProject,
} from "../short-workflow";
import { browserClient } from "~/lib/supa-client";
import { Skeleton } from "~/common/components/ui/skeleton";
import { useRealtime } from "~/hooks/use-realtime";
import {
  buildBriefMarkdownFromFields,
  deriveBriefFormValuesFromJob,
  deriveBriefFormValuesFromMetadata,
  emptyProjectBriefFormValues,
} from "../utils/brief-form";
import type { ProjectBriefFormValues } from "../utils/brief-form";

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

    const [workspaceData, projectSteps, shortWorkflowJobs, shortWorkflowImages] =
      await Promise.all([
        getProjectWorkspaceData(client, projectId),
        getProjectSteps(client, projectId),
        getShortWorkflowJobsByProject(client, {
          projectRowId: project.id,
          ownerProfileId,
          limit: 5,
        }),
        getShortWorkflowImagesByProject(client, {
          projectRowId: project.id,
          ownerProfileId,
          limit: 16,
        }),
      ]);

    return {
      workspaceData,
      projectSteps,
      shortWorkflowJobs,
      shortWorkflowImages,
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

export const clientLoader = async ({
  serverLoader,
  params,
}: Route.ClientLoaderArgs<typeof loader>) => {
  const data = await serverLoader();

  if (typeof window !== "undefined" && params.projectId) {
    try {
      const jobsData = data?.shortWorkflowJobs;
      const jobs = Array.isArray(jobsData)
        ? jobsData
        : await (jobsData as Promise<ShortWorkflowJobRecord[] | undefined>);

      if (jobs?.length) {
        const readySet =
          ((window as any).__shortWorkflowReadyProjects as
            | Set<string>
            | undefined) ?? new Set<string>();
        readySet.add(params.projectId);
        (window as any).__shortWorkflowReadyProjects = readySet;
      }
    } catch (error) {
      console.error("short workflow preload 실패:", error);
    }
  }

  return data;
};

export default function ProjectWorkspacePage({
  workspaceData: workspaceDataProp,
}: {
  workspaceData?: Awaited<ReturnType<typeof loader>>["workspaceData"];
} = {}) {
  // useLoaderData는 항상 호출해야 함 (React 규칙)
  // props로 workspaceData가 전달되면 그것을 우선 사용
  // project-create-page.tsx의 loader 데이터도 처리 가능하도록 any 타입 사용
  const loaderData = useLoaderData<typeof loader>();

  // loaderData에서 workspaceData와 projectSteps 추출 (여러 형식 지원)
  const loaderWorkspaceData = loaderData?.workspaceData ?? null;
  const loaderProjectSteps = loaderData?.projectSteps ?? [];
  const loaderProjectRowId = loaderData?.projectRowId as number | undefined;
  const workspaceData = workspaceDataProp ?? loaderWorkspaceData ?? null;
  const projectSteps = loaderProjectSteps;
  const shortWorkflowJobs =
    (loaderData?.shortWorkflowJobs as ShortWorkflowJobRecord[] | undefined) ??
    [];
  const shortWorkflowImages =
    (loaderData?.shortWorkflowImages as ShortWorkflowImageRecord[] | undefined) ??
    [];

  // projectId는 optional (project-create-page.tsx에서는 없을 수 있음)
  const params = useParams();
  const projectId = params?.projectId;
  const projectRowId = loaderProjectRowId ?? workspaceData?.project?.id;

  useRealtime({
    supabase: browserClient,
    channelName: `short-workflow-jobs-${projectRowId ?? "pending"}`,
    table: "short_workflow_jobs",
    filter: projectRowId ? `project_id=eq.${projectRowId}` : undefined,
    enabled: Boolean(projectRowId),
  });
  useRealtime({
    supabase: browserClient,
    channelName: `short-workflow-images-${projectRowId ?? "pending"}`,
    table: "short_workflow_images",
    filter: projectRowId ? `project_id=eq.${projectRowId}` : undefined,
    enabled: Boolean(projectRowId),
  });

  const [selectedJobId, setSelectedJobId] = React.useState<number | null>(
    null
  );

  React.useEffect(() => {
    if (!selectedJobId && shortWorkflowJobs.length > 0) {
      setSelectedJobId(shortWorkflowJobs[0].id);
    } else if (
      selectedJobId &&
      !shortWorkflowJobs.some((job) => job.id === selectedJobId)
    ) {
      setSelectedJobId(shortWorkflowJobs[0]?.id ?? null);
    }
  }, [shortWorkflowJobs, selectedJobId]);

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

  const announcedWorkflowRef = React.useRef(false);
  React.useEffect(() => {
    announcedWorkflowRef.current = false;
  }, [projectId]);
  React.useEffect(() => {
    if (!projectId || projectId === "create") return;
    if (shortWorkflowJobs.length === 0) {
      announcedWorkflowRef.current = false;
      return;
    }
    if (announcedWorkflowRef.current) return;
    if (typeof window !== "undefined") {
      const globalSet =
        ((window as any).__shortWorkflowReadyProjects as
          | Set<string>
          | undefined) ?? new Set<string>();
      globalSet.add(projectId);
      (window as any).__shortWorkflowReadyProjects = globalSet;
    }
    window.dispatchEvent(
      new CustomEvent("project:short-workflow-ready", {
        detail: { projectId },
      })
    );
    announcedWorkflowRef.current = true;
  }, [projectId, shortWorkflowJobs.length]);


  const {
    imageTimelines,
    selectedImages,
    toggleSelectImage,
    videoTimelines,
    selectedVideos,
    toggleSelectVideo,
    loading,
    done,
    setDone,
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

  const isBriefLocked = optimisticDone.brief;
  const isScriptLocked = optimisticDone.script;
  const isNarrationLocked = optimisticDone.narration;
  const isImagesLocked = optimisticDone.images;
  const isVideosLocked = optimisticDone.videos;
  const isFinalLocked = optimisticDone.final;

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
      final: loading.final || deployPending || videosSubmitPending,
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

  const isShortWorkflowReady = shortWorkflowJobs.length > 0;
  const isShortWorkflowLoading = !isShortWorkflowReady;
  const briefCardLoading = optimisticLoading.brief || isShortWorkflowLoading;
  const briefCardDone =
    optimisticDone.brief || (isShortWorkflowReady && !briefCardLoading);
  const canInteractWithBrief =
    isShortWorkflowReady && !briefCardLoading && !isBriefLocked;

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
        ? (shortWorkflowJobs.find((job) => job.id === selectedJobId) ?? null)
        : null,
    [selectedJobId, shortWorkflowJobs]
  );

  const metadataBriefFormValues = React.useMemo(
    () => deriveBriefFormValuesFromMetadata(briefDocument?.metadata),
    [briefDocument?.metadata]
  );

  const jobBriefFormValues = React.useMemo(
    () => deriveBriefFormValuesFromJob(selectedShortWorkflowJob),
    [selectedShortWorkflowJob]
  );

  const derivedBriefFormValues = React.useMemo<ProjectBriefFormValues>(() => {
    if (jobBriefFormValues) return jobBriefFormValues;
    if (metadataBriefFormValues) return metadataBriefFormValues;
    if (briefDocument?.content) {
      return {
        ...emptyProjectBriefFormValues,
        description: briefDocument.content,
      };
    }
    return emptyProjectBriefFormValues;
  }, [jobBriefFormValues, metadataBriefFormValues, briefDocument?.content]);

  const [briefFormValues, setBriefFormValues] = React.useState<ProjectBriefFormValues>(
    derivedBriefFormValues
  );

  React.useEffect(() => {
    setBriefFormValues(derivedBriefFormValues);
  }, [derivedBriefFormValues]);

  const briefMarkdownHtml = React.useMemo(
    () => renderMarkdown(buildBriefMarkdownFromFields(briefFormValues)),
    [briefFormValues]
  );

  // 대본 단락 (문서 or short-workflow job)
  const documentScriptParagraphs = React.useMemo(() => {
    if (
      scriptDocument?.content_json &&
      Array.isArray(scriptDocument.content_json)
    ) {
      return scriptDocument.content_json;
    }
    if (scriptDocument?.content) {
      return scriptDocument.content
        .split("\n\n")
        .map((p: string) => p.trim())
        .filter((p: string) => p.length > 0);
    }
    return [];
  }, [scriptDocument]);
  const shortWorkflowScriptParagraphs = React.useMemo(
    () => buildScriptParagraphsFromJob(selectedShortWorkflowJob),
    [selectedShortWorkflowJob]
  );
  const scriptParagraphs = React.useMemo(() => {
    if (shortWorkflowScriptParagraphs.length > 0) {
      return shortWorkflowScriptParagraphs;
    }
    if (documentScriptParagraphs.length > 0) {
      return documentScriptParagraphs;
    }
    return [];
  }, [shortWorkflowScriptParagraphs, documentScriptParagraphs]);
  const hasScriptParagraphs = scriptParagraphs.length > 0;

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
    return null;
  }, [workspaceData]);
  const shortWorkflowAudioSegments = React.useMemo(
    () => buildAudioSegmentsFromJob(selectedShortWorkflowJob),
    [selectedShortWorkflowJob]
  );
  const hasShortWorkflowAudio = Boolean(selectedShortWorkflowJob?.audio_file);
  const narrationSegments = React.useMemo(() => {
    if (shortWorkflowAudioSegments.length > 0) {
      return shortWorkflowAudioSegments;
    }
    if (narrationSegmentsFromDb && narrationSegmentsFromDb.length > 0) {
      return narrationSegmentsFromDb;
    }
    return [];
  }, [shortWorkflowAudioSegments, narrationSegmentsFromDb]);
  const hasNarrationSegments = narrationSegments.length > 0;
  const shouldShowNarrationStep =
    hasNarrationSegments ||
    optimisticLoading.narration ||
    (isShortWorkflowReady && hasShortWorkflowAudio);
  const canManageScript = hasScriptParagraphs && !isScriptLocked;
  const canManageNarration =
    shouldShowNarrationStep &&
    (hasNarrationSegments || hasShortWorkflowAudio) &&
    !isNarrationLocked;

  // 이미지 URL 목록 (미디어 자산에서 가져오기) - 최종 자산 fallback
  const imageUrls = React.useMemo(() => {
    if (!workspaceData?.mediaAssets) return null;
    return workspaceData.mediaAssets
      .filter((asset: any) => asset.type === "image")
      .map((asset: any) => asset.source_url || asset.preview_url)
      .filter((url: string | null) => url);
  }, [workspaceData]);

  const shortWorkflowImageEntries = React.useMemo<ProjectImageEntry[]>(() => {
    if (shortWorkflowImages.length === 0) return [];
    const sorted = [...shortWorkflowImages].sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
    return sorted.map((img, index) => ({
      id: img.id,
      src: img.image_url || img.movie_url || null,
      status: img.status,
      label: img.position || imageTimelines[index] || `씬 ${index + 1}`,
    }));
  }, [shortWorkflowImages, imageTimelines]);

  const fallbackImageEntries = React.useMemo<ProjectImageEntry[]>(() => {
    if (!imageUrls || imageUrls.length === 0) return [];
    return imageUrls.map((src, idx) => ({
      id: `asset-${idx}`,
      src,
      status: "success",
      label: imageTimelines[idx] || `씬 ${idx + 1}`,
    }));
  }, [imageUrls, imageTimelines]);

  const imageEntries =
    shortWorkflowImageEntries.length > 0
      ? shortWorkflowImageEntries
      : fallbackImageEntries;
  const hasImageEntries = imageEntries.length > 0;
  const canManageImages = hasImageEntries && !isImagesLocked;
  const handleToggleImageSelect = React.useCallback(
    (id: number) => {
      if (!canManageImages) return;
      toggleSelectImage(id);
    },
    [canManageImages, toggleSelectImage]
  );

  // 비디오 URL 목록 (미디어 자산에서 가져오기)
  const videoUrls = React.useMemo(() => {
    if (!workspaceData?.mediaAssets) return null;
    return workspaceData.mediaAssets
      .filter((asset: any) => asset.type === "video")
      .map((asset: any) => asset.source_url || asset.preview_url)
      .filter((url: string | null) => url);
  }, [workspaceData]);
  const hasVideoAssets = Boolean(videoUrls && videoUrls.length > 0);
  const canManageVideos = hasVideoAssets && !isVideosLocked;
  const handleToggleVideoSelect = React.useCallback(
    (id: number) => {
      if (!canManageVideos) return;
      toggleSelectVideo(id);
    },
    [canManageVideos, toggleSelectVideo]
  );

  // 최종 비디오 URL
  const finalVideoUrl = React.useMemo(() => {
    if (workspaceData?.project?.video_url) {
      return workspaceData.project.video_url;
    }
    return videoUrls && videoUrls.length > 0 ? videoUrls[0] : null;
  }, [workspaceData, videoUrls]);
  const hasFinalVideo = Boolean(finalVideoUrl);
  const canManageFinal = hasFinalVideo && !isFinalLocked;

  // Action handlers
  const handleBriefEdit = React.useCallback(() => {
    if (!canInteractWithBrief) return;
    setIsEditingBrief(true);
  }, [canInteractWithBrief]);

  const handleBriefCancel = React.useCallback(() => {
    setIsEditingBrief(false);
  }, []);

  const handleBriefSave = React.useCallback(
    async (values: ProjectBriefFormValues) => {
      if (!projectId || !canInteractWithBrief) return;
      setBriefFormValues(values);
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (value === undefined || value === null) return;
        formData.append(
          `form_${key}`,
          typeof value === "number" ? String(value) : value
        );
      });
      briefUpdateFetcher.submit(formData, {
        method: "post",
        action: `/my/dashboard/project/${projectId}/brief/update`,
      });
      setIsEditingBrief(false);
    },
    [projectId, canInteractWithBrief, briefUpdateFetcher]
  );

  const handleBriefApprove = React.useCallback(() => {
    if (!projectId || !canInteractWithBrief) return;

    const jobId = selectedJobId ?? shortWorkflowJobs[0]?.id;
    if (!jobId) {
      window.alert("적용할 기획서를 선택해주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("shortWorkflowJobId", String(jobId));
    Object.entries(briefFormValues).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      formData.append(
        `form_${key}`,
        typeof value === "number" ? String(value) : value
      );
    });
    formData.append(
      "briefContent",
      buildBriefMarkdownFromFields(briefFormValues)
    );

    briefSubmitFetcher.submit(formData, {
      method: "post",
      action: `/my/dashboard/project/${projectId}/brief/submit`,
      encType: "multipart/form-data",
    });
  }, [
    projectId,
    canInteractWithBrief,
    selectedJobId,
    shortWorkflowJobs,
    briefFormValues,
    briefSubmitFetcher,
  ]);

  React.useEffect(() => {
    if (!projectId || projectId === "create") return;
    const handleEditEvent = (event: Event) => {
      const detail = (event as CustomEvent<{ projectId: string }>).detail;
      if (detail?.projectId === projectId && canInteractWithBrief) {
        handleBriefEdit();
      }
    };
    const handleSubmitEvent = (event: Event) => {
      const detail = (event as CustomEvent<{ projectId: string }>).detail;
      if (detail?.projectId === projectId && canInteractWithBrief) {
        handleBriefApprove();
      }
    };
    window.addEventListener(
      "project:brief-edit",
      handleEditEvent as EventListener
    );
    window.addEventListener(
      "project:brief-submit",
      handleSubmitEvent as EventListener
    );
    return () => {
      window.removeEventListener(
        "project:brief-edit",
        handleEditEvent as EventListener
      );
      window.removeEventListener(
        "project:brief-submit",
        handleSubmitEvent as EventListener
      );
    };
  }, [projectId, handleBriefEdit, handleBriefApprove, canInteractWithBrief]);

  React.useEffect(() => {
    if (isBriefLocked && isEditingBrief) {
      setIsEditingBrief(false);
    }
  }, [isBriefLocked, isEditingBrief]);

  const handleScriptEdit = React.useCallback(() => {
    if (isScriptLocked) return;
    setIsEditingScript(true);
  }, [isScriptLocked]);

  const handleScriptCancel = React.useCallback(() => {
    setIsEditingScript(false);
  }, []);

  const handleScriptSave = React.useCallback(
    async (content: string | string[]) => {
      if (!projectId || isScriptLocked) return;
      const formData = new FormData();
      formData.append("content", JSON.stringify(content));
      scriptUpdateFetcher.submit(formData, {
        method: "post",
        action: `/my/dashboard/project/${projectId}/script/update`,
      });
      setIsEditingScript(false);
    },
    [projectId, isScriptLocked, scriptUpdateFetcher]
  );

  const handleScriptApprove = React.useCallback(() => {
    if (!projectId || isScriptLocked) return;
    scriptSubmitFetcher.submit(
      {},
      {
        method: "post",
        action: `/my/dashboard/project/${projectId}/script/submit`,
      }
    );
  }, [projectId, isScriptLocked, scriptSubmitFetcher]);

  const handleNarrationRegenerate = React.useCallback(() => {
    if (!projectId || isNarrationLocked) return;
    narrationRegenerateFetcher.submit(
      {},
      {
        method: "post",
        action: `/my/dashboard/project/${projectId}/narration/regenerate`,
      }
    );
  }, [projectId, isNarrationLocked, narrationRegenerateFetcher]);

  const handleNarrationApprove = React.useCallback(() => {
    if (!projectId || isNarrationLocked) return;
    narrationSubmitFetcher.submit(
      {},
      {
        method: "post",
        action: `/my/dashboard/project/${projectId}/narration/submit`,
      }
    );
  }, [projectId, isNarrationLocked, narrationSubmitFetcher]);

  const handleImagesRegenerate = React.useCallback(() => {
    if (!projectId || selectedImages.length === 0 || isImagesLocked) return;
    const formData = new FormData();
    formData.append("imageIds", JSON.stringify(selectedImages));
    imagesRegenerateFetcher.submit(formData, {
      method: "post",
      action: `/my/dashboard/project/${projectId}/images/regenerate`,
    });
  }, [projectId, selectedImages, isImagesLocked, imagesRegenerateFetcher]);

  const handleImagesApprove = React.useCallback(() => {
    if (!projectId || isImagesLocked) return;
    const formData = new FormData();
    if (selectedImages.length > 0) {
      formData.append("imageIds", JSON.stringify(selectedImages));
    }
    imagesSubmitFetcher.submit(formData, {
      method: "post",
      action: `/my/dashboard/project/${projectId}/images/submit`,
    });
  }, [projectId, selectedImages, isImagesLocked, imagesSubmitFetcher]);

  const handleVideosRegenerate = React.useCallback(() => {
    if (!projectId || selectedVideos.length === 0 || isVideosLocked) return;
    const formData = new FormData();
    formData.append("videoIds", JSON.stringify(selectedVideos));
    videosRegenerateFetcher.submit(formData, {
      method: "post",
      action: `/my/dashboard/project/${projectId}/videos/regenerate`,
    });
  }, [projectId, selectedVideos, isVideosLocked, videosRegenerateFetcher]);

  const handleVideosApprove = React.useCallback(() => {
    if (!projectId || isVideosLocked) return;
    const formData = new FormData();
    if (selectedVideos.length > 0) {
      formData.append("videoId", String(selectedVideos[0]));
    }
    videosSubmitFetcher.submit(formData, {
      method: "post",
      action: `/my/dashboard/project/${projectId}/videos/submit`,
    });
  }, [projectId, selectedVideos, isVideosLocked, videosSubmitFetcher]);

  const handleDeploy = React.useCallback(() => {
    if (!projectId || isFinalLocked) return;
    deployFetcher.submit(
      {},
      {
        method: "post",
        action: `/my/dashboard/project/${projectId}/deploy`,
      }
    );
  }, [projectId, isFinalLocked, deployFetcher]);

  React.useEffect(() => {
    if (scriptUpdateFetcher.data?.success) {
      setIsEditingScript(false);
    }
  }, [scriptUpdateFetcher.data]);

  React.useEffect(() => {
    if (isScriptLocked && isEditingScript) {
      setIsEditingScript(false);
    }
  }, [isScriptLocked, isEditingScript]);

  React.useEffect(() => {
    if (briefSubmitFetcher.data?.success) {
      setDone((prev) => ({ ...prev, brief: true }));
    }
  }, [briefSubmitFetcher.data, setDone]);

  React.useEffect(() => {
    if (scriptSubmitFetcher.data?.success) {
      setDone((prev) => ({ ...prev, script: true }));
    }
  }, [scriptSubmitFetcher.data, setDone]);

  React.useEffect(() => {
    if (narrationSubmitFetcher.data?.success) {
      setDone((prev) => ({ ...prev, narration: true }));
    }
  }, [narrationSubmitFetcher.data, setDone]);

  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto pr-1">
        {shortWorkflowJobs.length > 0 ? (
          <ShortWorkflowJobDeckContent
            jobs={shortWorkflowJobs}
            selectedJobId={selectedJobId}
            onSelect={setSelectedJobId}
          />
        ) : (
          <ShortWorkflowJobDeckSkeleton />
        )}
        <ProjectAccordion defaultValue={defaultAccordionValue}>
          {/* Step 1: Brief */}
          <ProjectPrd
            value="step-1"
            title="step 1: 수익형 콘텐츠 기획서"
            markdownHtml={briefMarkdownHtml}
            loading={briefCardLoading}
            done={briefCardDone}
            onEdit={canInteractWithBrief ? handleBriefEdit : undefined}
            onDone={canInteractWithBrief ? handleBriefApprove : undefined}
          />
          {isEditingBrief && canInteractWithBrief && (
            <div className="px-4 pb-4">
              <ProjectBriefEditor
                initialValues={briefFormValues}
                onCancel={handleBriefCancel}
                onSave={handleBriefSave}
                isSubmitting={briefUpdateFetcher.state !== "idle"}
              />
            </div>
          )}

          {hasScriptParagraphs && (
            <>
              <ProjectScript
                value="step-2"
                title="step 2: 대본 작성"
                paragraphs={scriptParagraphs}
                loading={optimisticLoading.script}
                done={optimisticDone.script}
                onEdit={canManageScript ? handleScriptEdit : undefined}
                onDone={canManageScript ? handleScriptApprove : undefined}
              />
              {isEditingScript && canManageScript && (
                <div className="px-4 pb-4">
                  <ProjectScriptEditor
                    projectId={projectId || ""}
                    initialContent={scriptParagraphs}
                    onCancel={handleScriptCancel}
                    onSave={handleScriptSave}
                  />
                </div>
              )}
            </>
          )}

          {shouldShowNarrationStep && (
            <ProjectScriptAudio
              value="step-3"
              title="step 3: 나레이션 확인하기"
              segments={narrationSegments}
              loading={
                optimisticLoading.narration ||
                (!hasNarrationSegments && hasShortWorkflowAudio)
              }
              done={optimisticDone.narration}
              onEdit={
                canManageNarration ? handleNarrationRegenerate : undefined
              }
              onDone={
                canManageNarration ? handleNarrationApprove : undefined
              }
            />
          )}

          {(hasImageEntries || optimisticLoading.images) && (
            <ProjectImageSelect
              value="step-4"
              title="step 4: 생성된 이미지"
              images={imageEntries}
              timelines={imageTimelines}
              selected={selectedImages}
              onToggle={canManageImages ? handleToggleImageSelect : undefined}
              onRegenerate={
                canManageImages ? handleImagesRegenerate : undefined
              }
              onDone={canManageImages ? handleImagesApprove : undefined}
              loading={optimisticLoading.images && !hasImageEntries}
              done={optimisticDone.images}
            />
          )}

          {hasVideoAssets && (
            <ProjectVideoSelect
              value="step-5"
              title="step 5: 생성된 영상 확인하기"
              sources={videoUrls!}
              timelines={videoTimelines}
              selected={selectedVideos}
              onToggle={canManageVideos ? handleToggleVideoSelect : undefined}
              onRegenerate={
                canManageVideos ? handleVideosRegenerate : undefined
              }
              onDone={canManageVideos ? handleVideosApprove : undefined}
              loading={optimisticLoading.videos}
              done={optimisticDone.videos}
            />
          )}

          {hasFinalVideo && (
            <ProjectFinalVideo
              value="step-6"
              title="step 6: 편집된 영상 확인 및 업로드"
              videoSrc={finalVideoUrl!}
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
              onDone={canManageFinal ? handleDeploy : undefined}
            />
          )}
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

type ShortWorkflowOutputPayload = {
  converted?: string;
  original?: string;
  [key: string]: unknown;
};

function parseShortWorkflowOutput(
  output: string | null | undefined
): ShortWorkflowOutputPayload | null {
  if (!output) return null;
  try {
    const parsed = JSON.parse(output);
    if (parsed && typeof parsed === "object") {
      return parsed as ShortWorkflowOutputPayload;
    }
  } catch (error) {
    console.warn("short_workflow_jobs.output JSON parse 실패:", error);
  }
  return { converted: output };
}

function splitIntoParagraphs(text: string): string[] {
  const trimmed = text?.trim();
  if (!trimmed) return [];

  const newlineParts = trimmed
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
  if (newlineParts.length > 1) {
    return newlineParts;
  }

  const sentences = trimmed.match(/[^.!?]+[.!?]?/g);
  if (!sentences) {
    return [trimmed];
  }

  const result: string[] = [];
  let buffer = "";
  sentences.forEach((sentence) => {
    const current = sentence.trim();
    if (!current) return;
    if (!buffer) {
      buffer = current;
      return;
    }
    const combined = `${buffer} ${current}`.trim();
    if (combined.length <= 160) {
      buffer = combined;
    } else {
      result.push(buffer);
      buffer = current;
    }
  });
  if (buffer) {
    result.push(buffer);
  }
  return result;
}

function buildScriptParagraphsFromJob(
  job: ShortWorkflowJobRecord | null
): string[] {
  if (!job) return [];
  const paragraphs: string[] = [];
  const parsedOutput = parseShortWorkflowOutput(job.output);
  if (parsedOutput?.converted) {
    paragraphs.push(...splitIntoParagraphs(parsedOutput.converted));
  } else if (parsedOutput?.original) {
    paragraphs.push(...splitIntoParagraphs(parsedOutput.original));
  }

  const appendIfPresent = (label: string | null | undefined, prefix?: string) => {
    if (!label) return;
    const value = label.trim();
    if (!value) return;
    paragraphs.push(prefix ? `${prefix} ${value}` : value);
  };

  appendIfPresent(job.description);
  appendIfPresent(job.intro, "Intro:");
  appendIfPresent(job.base);
  appendIfPresent(job.cta, "CTA:");

  return paragraphs.filter((p) => p && p.trim().length > 0);
}

function buildAudioSegmentsFromJob(
  job: ShortWorkflowJobRecord | null
): AudioSegment[] {
  if (!job?.audio_file) {
    return [];
  }
  return [
    {
      id: `short-workflow-audio-${job.id}`,
      label: job.title || "AI 나레이션",
      src: job.audio_file,
    },
  ];
}

type ShortWorkflowJobDeckContentProps = {
  jobs: ShortWorkflowJobRecord[];
  selectedJobId: number | null;
  onSelect: (id: number) => void;
};

function ShortWorkflowJobDeckContent({
  jobs,
  selectedJobId,
  onSelect,
}: ShortWorkflowJobDeckContentProps) {
  if (jobs.length === 0) {
    return <ShortWorkflowJobDeckEmpty />;
  }

  const resolvedSelectedId = selectedJobId ?? jobs[0]?.id ?? null;

  return (
    <ShortWorkflowJobDeck
      jobs={jobs}
      selectedJobId={resolvedSelectedId}
      onSelect={onSelect}
    />
  );
}

function ShortWorkflowJobDeckSkeleton() {
  return (
    <section className="space-y-3 px-4 pb-6">
      <Skeleton className="h-5 w-48" />
      <div className="grid gap-3 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={`job-skeleton-${idx}`}
            className="rounded-2xl border border-muted bg-background/60 p-4"
          >
            <Skeleton className="h-4 w-32" />
            <Skeleton className="mt-2 h-3 w-40" />
            <Skeleton className="mt-4 h-3 w-full" />
            <Skeleton className="mt-2 h-3 w-3/4" />
            <Skeleton className="mt-2 h-3 w-2/3" />
          </div>
        ))}
      </div>
    </section>
  );
}

function ShortWorkflowJobDeckEmpty() {
  return (
    <section className="space-y-3 px-4 pb-6">
      <div className="rounded-2xl border border-dashed border-muted bg-background/80 p-6 text-center">
        <Typography
          as="h3"
          variant="h4"
          className="text-base font-semibold text-foreground"
        >
          쇼츠 초안을 준비 중이에요
        </Typography>
        <p className="mt-2 text-sm text-muted-foreground">
          AI가 맞춤 초안을 생성하는 중입니다. 잠시만 기다려 주세요.
        </p>
      </div>
    </section>
  );
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

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

import {
  ProjectAccordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "~/features/projects/components/project-accordion";
import { Typography } from "~/common/components/typography";
import { Button } from "~/common/components/ui/button";
import { Check, Edit3 } from "lucide-react";
import { Spinner } from "~/common/components/ui/spinner";
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
import type {
  ShortWorkflowJobRecord,
  ShortWorkflowImageRecord,
  ShortWorkflowCompletionRecord,
} from "../short-workflow";
import {
  getShortWorkflowJobsByProject,
  getShortWorkflowImagesByProject,
  getShortWorkflowCompletionsByProject,
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

function announceProjectReady(
  eventName: string,
  storeKey: string,
  projectId: string
) {
  if (typeof window === "undefined") return;
  const store =
    ((window as any)[storeKey] as Set<string> | undefined) ?? new Set<string>();
  store.add(projectId);
  (window as any)[storeKey] = store;
  window.dispatchEvent(
    new CustomEvent(eventName, {
      detail: { projectId },
    })
  );
}

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

    const [
      workspaceData,
      projectSteps,
      shortWorkflowJobs,
      shortWorkflowImages,
      shortWorkflowCompletions,
    ] = await Promise.all([
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
      getShortWorkflowCompletionsByProject(client, {
        projectRowId: project.id,
        ownerProfileId,
        limit: 1,
      }),
    ]);

    return {
      workspaceData,
      projectSteps,
      shortWorkflowJobs,
      shortWorkflowImages,
      shortWorkflowCompletions,
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
  const initialShortWorkflowJobs =
    (loaderData?.shortWorkflowJobs as ShortWorkflowJobRecord[] | undefined) ??
    [];
  const initialShortWorkflowImages =
    (loaderData?.shortWorkflowImages as
      | ShortWorkflowImageRecord[]
      | undefined) ?? [];
  const initialShortWorkflowCompletions =
    (loaderData?.shortWorkflowCompletions as
      | ShortWorkflowCompletionRecord[]
      | undefined) ?? [];

  // projectId는 optional (project-create-page.tsx에서는 없을 수 있음)
  const params = useParams();
  const projectId = params?.projectId;
  const projectRowId = loaderProjectRowId ?? workspaceData?.project?.id;

  // shortWorkflowJobs를 state로 관리하여 리얼타임 업데이트 반영
  const [shortWorkflowJobs, setShortWorkflowJobs] = React.useState<
    ShortWorkflowJobRecord[]
  >(initialShortWorkflowJobs);
  const [shortWorkflowImages, setShortWorkflowImages] = React.useState<
    ShortWorkflowImageRecord[]
  >(initialShortWorkflowImages);
  const [shortWorkflowCompletions, setShortWorkflowCompletions] =
    React.useState<ShortWorkflowCompletionRecord[]>(
      initialShortWorkflowCompletions
    );

  // loader 데이터가 변경되면 state 업데이트
  React.useEffect(() => {
    setShortWorkflowJobs(initialShortWorkflowJobs);
  }, [initialShortWorkflowJobs]);
  React.useEffect(() => {
    setShortWorkflowImages(initialShortWorkflowImages);
  }, [initialShortWorkflowImages]);
  React.useEffect(() => {
    setShortWorkflowCompletions(initialShortWorkflowCompletions);
  }, [initialShortWorkflowCompletions]);

  // 리얼타임 구독: short_workflow_jobs 테이블 업데이트 시 state 직접 업데이트
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
        async (payload) => {
          console.log("🔔 Realtime Update: short_workflow_jobs", payload);
          // 데이터 다시 가져오기
          const { data, error } = await browserClient
            .from("short_workflow_jobs")
            .select("*")
            .eq("project_id", projectRowId)
            .order("created_at", { ascending: false });

          if (!error && data) {
            setShortWorkflowJobs(data as ShortWorkflowJobRecord[]);
          }
        }
      )
      .subscribe();

    return () => {
      browserClient.removeChannel(channel);
    };
  }, [projectRowId]);

  // 리얼타임 구독: short_workflow_images 테이블 업데이트 시 state 직접 업데이트
  React.useEffect(() => {
    if (!projectRowId) return;

    const channel = browserClient
      .channel(`short-workflow-images-${projectRowId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "short_workflow_images",
          filter: `project_id=eq.${projectRowId}`,
        },
        async (payload) => {
          console.log("🔔 Realtime Update: short_workflow_images", payload);
          // 데이터 다시 가져오기
          const { data, error } = await browserClient
            .from("short_workflow_images")
            .select("*")
            .eq("project_id", projectRowId)
            .order("created_at", { ascending: false });

          if (!error && data) {
            setShortWorkflowImages(data as ShortWorkflowImageRecord[]);
          }
        }
      )
      .subscribe();

    return () => {
      browserClient.removeChannel(channel);
    };
  }, [projectRowId]);

  const [selectedJobId, setSelectedJobId] = React.useState<number | null>(null);

  const announcedWorkflowRef = React.useRef(false);
  React.useEffect(() => {
    announcedWorkflowRef.current = false;
  }, [projectId]);
  const scriptReadyRef = React.useRef(false);
  React.useEffect(() => {
    scriptReadyRef.current = false;
  }, [projectId]);
  const narrationReadyRef = React.useRef(false);
  React.useEffect(() => {
    narrationReadyRef.current = false;
  }, [projectId]);
  const imagesReadyRef = React.useRef(false);
  React.useEffect(() => {
    imagesReadyRef.current = false;
  }, [projectId]);
  React.useEffect(() => {
    if (!projectId || projectId === "create") return;
    if (shortWorkflowJobs.length === 0) {
      announcedWorkflowRef.current = false;
      return;
    }
    if (announcedWorkflowRef.current) return;
    announceProjectReady(
      "project:short-workflow-ready",
      "__shortWorkflowReadyProjects",
      projectId
    );
    announcedWorkflowRef.current = true;
  }, [projectId, shortWorkflowJobs.length]);

  const {
    imageTimelines,
    selectedImages,
    toggleSelectImage,
    videoTimelines: defaultVideoTimelines,
    selectedVideos,
    toggleSelectVideo,
    loading,
    done,
    setDone,
    narrationSegments: defaultNarrationSegments,
    acknowledgeStep,
  } = useProjectDetail();

  // selectedJobId 자동 설정은 optimisticDone 선언 후에 처리됨

  // 완료된 단계 확인 및 다음 단계 결정
  // step2 (대본) 제거, 나머지 한칸씩 앞으로 이동
  const stepOrder = [
    "brief",
    "narration", // step3 → step2
    "images", // step4 → step3
    "videos", // step5 → step4
    "final", // step6 → step5
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
  const youtubeUploadFetcher = useFetcher();
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
  const youtubeUploadPending = youtubeUploadFetcher.state !== "idle";
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

  // short_workflow_jobs를 사용하므로 workspaceData.documents는 사용하지 않음
  // (화면이 자꾸 바뀌는 문제 방지)
  // const briefDocument = React.useMemo(() => {
  //   if (!workspaceData?.documents) return null;
  //   return workspaceData.documents.find(
  //     (doc: { type: string }) => doc.type === "brief"
  //   );
  // }, [workspaceData]);

  // const scriptDocument = React.useMemo(() => {
  //   if (!workspaceData?.documents) return null;
  //   return workspaceData.documents.find(
  //     (doc: { type: string }) => doc.type === "script"
  //   );
  // }, [workspaceData]);

  const briefDocument = null; // short_workflow_jobs만 사용
  const scriptDocument = null; // short_workflow_jobs만 사용

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

  // short_workflow_jobs만 사용 (workspaceData.documents는 사용하지 않음)
  const jobBriefFormValues = React.useMemo(() => {
    const result = deriveBriefFormValuesFromJob(selectedShortWorkflowJob);
    if (result && selectedShortWorkflowJob) {
      console.log("📝 [Brief] Job에서 폼 값 추출:", {
        jobId: selectedShortWorkflowJob.id,
        jobTitle: selectedShortWorkflowJob.title,
        hasTitle: Boolean(result.title),
        hasDescription: Boolean(result.description),
        hasBase: Boolean(result.base),
      });
    }
    return result;
  }, [selectedShortWorkflowJob]);

  // short_workflow_jobs만 사용 (workspaceData.documents는 사용하지 않음)
  const derivedBriefFormValues = React.useMemo<ProjectBriefFormValues>(() => {
    if (jobBriefFormValues) {
      console.log("📝 [Brief] jobBriefFormValues 사용");
      return jobBriefFormValues;
    }
    // short_workflow_jobs가 없으면 빈 값 사용 (workspaceData.documents는 사용하지 않음)
    console.log("📝 [Brief] emptyProjectBriefFormValues 사용");
    return emptyProjectBriefFormValues;
  }, [jobBriefFormValues]);

  const [briefFormValues, setBriefFormValues] =
    React.useState<ProjectBriefFormValues>(derivedBriefFormValues);

  React.useEffect(() => {
    setBriefFormValues(derivedBriefFormValues);
  }, [derivedBriefFormValues]);

  const briefMarkdownHtml = React.useMemo(
    () => renderMarkdown(buildBriefMarkdownFromFields(briefFormValues)),
    [briefFormValues]
  );

  // 로딩 상태 계산 (변수 선언 순서에 맞춰 여기서 계산)
  const isShortWorkflowReady = shortWorkflowJobs.length > 0;
  const hasSelectedJob = Boolean(selectedShortWorkflowJob);

  // 디버깅 로그
  React.useEffect(() => {
    console.log("🔍 [Brief Loading Debug]", {
      shortWorkflowJobsCount: shortWorkflowJobs.length,
      isShortWorkflowReady,
      selectedJobId,
      hasSelectedJob,
      selectedShortWorkflowJob: selectedShortWorkflowJob
        ? {
            id: selectedShortWorkflowJob.id,
            title: selectedShortWorkflowJob.title,
            status: selectedShortWorkflowJob.status,
          }
        : null,
      briefFormValues: {
        hasTitle: Boolean(briefFormValues.title?.trim()),
        hasDescription: Boolean(briefFormValues.description?.trim()),
        hasBase: Boolean(briefFormValues.base?.trim()),
        hasIntro: Boolean(briefFormValues.intro?.trim()),
      },
      optimisticLoadingBrief: optimisticLoading.brief,
      optimisticDoneBrief: optimisticDone.brief,
      dbLoadingBrief: loading.brief,
      dbDoneBrief: done.brief,
    });
  }, [
    shortWorkflowJobs.length,
    isShortWorkflowReady,
    selectedJobId,
    hasSelectedJob,
    selectedShortWorkflowJob,
    briefFormValues,
    optimisticLoading.brief,
    optimisticDone.brief,
    loading.brief,
    done.brief,
  ]);

  // short_workflow_jobs 테이블 기반 로딩 조건
  // 생성된 쇼츠 초안이 있고 선택된 job이 있으면 즉시 폼 표시 (로딩 완료)
  // optimisticLoading.brief만 체크 (제출/업데이트 중일 때만 로딩)
  const briefCardLoading =
    optimisticLoading.brief && !(isShortWorkflowReady && hasSelectedJob);

  // brief가 완료된 경우:
  // 1. optimisticDone.brief (로컬 완료 상태)
  // 2. done.brief (DB 완료 상태)
  // 3. short workflow가 준비되고 로딩이 아닌 경우
  const briefCardDone =
    optimisticDone.brief ||
    done.brief ||
    (isShortWorkflowReady && hasSelectedJob && !briefCardLoading);

  // 기획서가 완료되면 초안 선택 비활성화
  const isBriefLockedForJobSelection = done.brief || optimisticDone.brief;

  // selectedJobId 자동 계산 (초기 로드 시에만, 사용자 선택이 없을 때만)
  const autoSelectedJobId = React.useMemo(() => {
    if (shortWorkflowJobs.length === 0) return null;

    // 사용자가 이미 유효한 job을 선택했으면 자동 선택 안 함
    const currentSelectionIsValid =
      selectedJobId && shortWorkflowJobs.some((j) => j.id === selectedJobId);
    if (currentSelectionIsValid) return null;

    // 기획서 확정 시: status가 wait가 아닌 job
    if (isBriefLockedForJobSelection) {
      return shortWorkflowJobs.find((j) => j.status !== "wait")?.id ?? null;
    }

    // 우선순위: non-wait+audio > non-wait > audio > 첫 번째
    return (
      shortWorkflowJobs.find((j) => j.status !== "wait" && j.audio_file)?.id ??
      shortWorkflowJobs.find((j) => j.status !== "wait")?.id ??
      shortWorkflowJobs.find((j) => j.audio_file)?.id ??
      shortWorkflowJobs[0]?.id ??
      null
    );
  }, [shortWorkflowJobs, isBriefLockedForJobSelection, selectedJobId]);

  // autoSelectedJobId가 있고 현재 선택이 없거나 유효하지 않으면 업데이트
  React.useEffect(() => {
    if (autoSelectedJobId && autoSelectedJobId !== selectedJobId) {
      setSelectedJobId(autoSelectedJobId);
    }
  }, [autoSelectedJobId]);

  const canInteractWithBrief =
    isShortWorkflowReady &&
    hasSelectedJob &&
    !briefCardLoading &&
    !isBriefLocked;

  // 대본 단락 (short_workflow_jobs만 사용, workspaceData.documents는 사용하지 않음)
  const scriptParagraphs = React.useMemo(
    () => buildScriptParagraphsFromJob(selectedShortWorkflowJob),
    [selectedShortWorkflowJob]
  );
  const hasScriptParagraphs = scriptParagraphs.length > 0;

  // 오디오 세그먼트 (short_workflow_jobs.audio_file만 사용)
  // audio_file은 단일 파일이지만 AudioSegment 배열 형식으로 변환
  const hasShortWorkflowAudio = Boolean(selectedShortWorkflowJob?.audio_file);
  const narrationSegments = React.useMemo(
    () => buildAudioSegmentsFromJob(selectedShortWorkflowJob),
    [selectedShortWorkflowJob]
  );
  const hasNarrationSegments = narrationSegments.length > 0;

  // 디버깅 로그
  React.useEffect(() => {
    console.log("🔍 [Narration Debug]", {
      selectedJobId,
      shortWorkflowJobsCount: shortWorkflowJobs.length,
      shortWorkflowJobs: shortWorkflowJobs.map((job) => ({
        id: job.id,
        title: job.title,
        audio_file: job.audio_file,
      })),
      selectedShortWorkflowJob: selectedShortWorkflowJob
        ? {
            id: selectedShortWorkflowJob.id,
            title: selectedShortWorkflowJob.title,
            audio_file: selectedShortWorkflowJob.audio_file,
          }
        : null,
      hasShortWorkflowAudio,
      hasNarrationSegments,
      narrationSegmentsCount: narrationSegments.length,
      narrationSegments,
      optimisticLoadingNarration: optimisticLoading.narration,
      doneNarration: done.narration,
      optimisticDoneNarration: optimisticDone.narration,
    });
  }, [
    selectedJobId,
    shortWorkflowJobs,
    selectedShortWorkflowJob,
    hasShortWorkflowAudio,
    hasNarrationSegments,
    narrationSegments,
    optimisticLoading.narration,
    done.narration,
    optimisticDone.narration,
  ]);

  // 나레이션 단계 표시 조건: audio_file이 있으면 표시, 완료되어도 계속 표시
  const shouldShowNarrationStep =
    hasNarrationSegments ||
    hasShortWorkflowAudio ||
    optimisticLoading.narration ||
    done.narration ||
    optimisticDone.narration;

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
      sourceText: img.source_text,
      imagePrompt: img.image_prompt,
      moviePrompt: img.movie_prompt,
    }));
  }, [shortWorkflowImages, imageTimelines]);

  const scriptReady = hasScriptParagraphs;
  React.useEffect(() => {
    if (!projectId || projectId === "create") return;
    if (!scriptReady) {
      scriptReadyRef.current = false;
      return;
    }
    if (scriptReadyRef.current) return;
    announceProjectReady(
      "project:script-ready",
      "__projectScriptReadyProjects",
      projectId
    );
    scriptReadyRef.current = true;
  }, [projectId, scriptReady]);

  React.useEffect(() => {
    if (!projectId || projectId === "create") return;
    if (!hasShortWorkflowAudio) {
      narrationReadyRef.current = false;
      return;
    }
    if (narrationReadyRef.current) return;
    announceProjectReady(
      "project:narration-ready",
      "__projectNarrationReadyProjects",
      projectId
    );
    narrationReadyRef.current = true;
  }, [projectId, hasShortWorkflowAudio]);

  React.useEffect(() => {
    if (!projectId || projectId === "create") return;
    if (shortWorkflowImageEntries.length === 0) {
      imagesReadyRef.current = false;
      return;
    }
    if (imagesReadyRef.current) return;
    announceProjectReady(
      "project:images-ready",
      "__projectImagesReadyProjects",
      projectId
    );
    imagesReadyRef.current = true;
  }, [projectId, shortWorkflowImageEntries.length]);

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

  // 비디오 URL 목록 (short_workflow_images의 movie_url에서 가져오기)
  const videoUrls = React.useMemo(() => {
    if (shortWorkflowImages.length === 0) return null;
    const sorted = [...shortWorkflowImages].sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
    const urls = sorted
      .map((img) => img.movie_url)
      .filter((url: string | null) => url) as string[];
    return urls.length > 0 ? urls : null;
  }, [shortWorkflowImages]);

  // 비디오 타임라인 (short_workflow_images의 position에서 가져오기, 없으면 기본값 사용)
  const videoTimelines = React.useMemo(() => {
    if (shortWorkflowImages.length === 0) return defaultVideoTimelines;
    const sorted = [...shortWorkflowImages].sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
    const timelines = sorted
      .filter((img) => img.movie_url)
      .map(
        (img, index) =>
          img.position || defaultVideoTimelines[index] || `씬 ${index + 1}`
      );
    return timelines.length > 0 ? timelines : defaultVideoTimelines;
  }, [shortWorkflowImages, defaultVideoTimelines]);

  const hasVideoAssets = Boolean(videoUrls && videoUrls.length > 0);
  const canManageVideos = hasVideoAssets && !isVideosLocked;
  const handleToggleVideoSelect = React.useCallback(
    (id: number) => {
      if (!canManageVideos) return;
      toggleSelectVideo(id);
    },
    [canManageVideos, toggleSelectVideo]
  );

  // 최종 비디오 URL (short_workflow_completions의 render_url 우선)
  const finalVideoUrl = React.useMemo(() => {
    const completion = shortWorkflowCompletions[0];
    if (completion?.render_url) {
      return completion.render_url;
    }
    if (workspaceData?.project?.video_url) {
      return workspaceData.project.video_url;
    }
    return videoUrls && videoUrls.length > 0 ? videoUrls[0] : null;
  }, [shortWorkflowCompletions, workspaceData, videoUrls]);

  // 최종 영상 정보 (short_workflow_completions에서 가져오기)
  const finalVideoCompletion = React.useMemo(() => {
    return shortWorkflowCompletions[0] ?? null;
  }, [shortWorkflowCompletions]);

  const hasFinalVideo = Boolean(finalVideoUrl || finalVideoCompletion);
  const fallbackProjectTitle =
    workspaceData?.project?.title ||
    selectedShortWorkflowJob?.title ||
    projectKeyword ||
    "새 프로젝트";
  const fallbackProjectDescription =
    workspaceData?.project?.description ||
    selectedShortWorkflowJob?.description ||
    briefFormValues.description ||
    "";
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
    acknowledgeStep("brief");
  }, [
    projectId,
    canInteractWithBrief,
    selectedJobId,
    shortWorkflowJobs,
    briefFormValues,
    briefSubmitFetcher,
    acknowledgeStep,
  ]);

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
    acknowledgeStep("script");
  }, [projectId, isScriptLocked, scriptSubmitFetcher, acknowledgeStep]);

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
    acknowledgeStep("narration");
  }, [projectId, isNarrationLocked, narrationSubmitFetcher, acknowledgeStep]);

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
    const handleScriptEditEvent = (event: Event) => {
      const detail = (event as CustomEvent<{ projectId: string }>).detail;
      if (detail?.projectId === projectId && canManageScript) {
        handleScriptEdit();
      }
    };
    const handleScriptSubmitEvent = (event: Event) => {
      const detail = (event as CustomEvent<{ projectId: string }>).detail;
      if (detail?.projectId === projectId && canManageScript) {
        handleScriptApprove();
      }
    };
    const handleNarrationRegenerateEvent = (event: Event) => {
      const detail = (event as CustomEvent<{ projectId: string }>).detail;
      if (detail?.projectId === projectId && canManageNarration) {
        handleNarrationRegenerate();
      }
    };
    const handleNarrationSubmitEvent = (event: Event) => {
      const detail = (event as CustomEvent<{ projectId: string }>).detail;
      if (detail?.projectId === projectId && canManageNarration) {
        handleNarrationApprove();
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
    window.addEventListener(
      "project:script-edit",
      handleScriptEditEvent as EventListener
    );
    window.addEventListener(
      "project:script-submit",
      handleScriptSubmitEvent as EventListener
    );
    window.addEventListener(
      "project:narration-regenerate",
      handleNarrationRegenerateEvent as EventListener
    );
    window.addEventListener(
      "project:narration-submit",
      handleNarrationSubmitEvent as EventListener
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
      window.removeEventListener(
        "project:script-edit",
        handleScriptEditEvent as EventListener
      );
      window.removeEventListener(
        "project:script-submit",
        handleScriptSubmitEvent as EventListener
      );
      window.removeEventListener(
        "project:narration-regenerate",
        handleNarrationRegenerateEvent as EventListener
      );
      window.removeEventListener(
        "project:narration-submit",
        handleNarrationSubmitEvent as EventListener
      );
    };
  }, [
    projectId,
    handleBriefEdit,
    handleBriefApprove,
    canInteractWithBrief,
    handleScriptEdit,
    handleScriptApprove,
    handleNarrationRegenerate,
    handleNarrationApprove,
    canManageScript,
    canManageNarration,
  ]);

  React.useEffect(() => {
    if (isBriefLocked && isEditingBrief) {
      setIsEditingBrief(false);
    }
  }, [isBriefLocked, isEditingBrief]);

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

  const handleYouTubeUpload = React.useCallback(() => {
    if (!projectId || isFinalLocked) return;
    youtubeUploadFetcher.submit(
      {},
      {
        method: "post",
        action: `/my/dashboard/project/${projectId}/youtube/upload`,
      }
    );
  }, [projectId, isFinalLocked, youtubeUploadFetcher]);

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

  React.useEffect(() => {
    if (imagesSubmitFetcher.data?.success) {
      setDone((prev) => ({ ...prev, images: true }));
    }
  }, [imagesSubmitFetcher.data, setDone]);

  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto pr-1">
        {shortWorkflowJobs.length > 0 ? (
          <ShortWorkflowJobDeckContent
            jobs={shortWorkflowJobs}
            selectedJobId={selectedJobId}
            onSelect={
              isBriefLockedForJobSelection ? () => {} : setSelectedJobId
            }
            disabled={isBriefLockedForJobSelection}
          />
        ) : (
          <ShortWorkflowJobDeckSkeleton />
        )}
        <ProjectAccordion defaultValue={defaultAccordionValue}>
          {/* Step 1: Brief */}
          <AccordionItem value="step-1">
            <AccordionTrigger className="text-base font-semibold leading-tight md:text-lg">
              <span className="inline-flex items-center gap-3 text-left">
                {briefCardDone ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : briefCardLoading ? (
                  <Spinner className="text-muted-foreground" />
                ) : null}
                <Typography
                  as="span"
                  variant="h4"
                  className="text-lg font-semibold leading-tight text-foreground md:text-xl"
                >
                  step 1: 수익형 콘텐츠 기획서
                </Typography>
              </span>
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-5 px-4 text-base leading-relaxed">
              {briefCardLoading ? (
                <div className="rounded-xl border bg-background/60 p-4">
                  <div className="flex flex-col space-y-3">
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-4 w-64" />
                    <div className="space-y-2">
                      <Skeleton className="h-3 w-56" />
                      <Skeleton className="h-3 w-52" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {isEditingBrief && canInteractWithBrief ? (
                    <ProjectBriefEditor
                      initialValues={briefFormValues}
                      onCancel={handleBriefCancel}
                      onSave={handleBriefSave}
                      isSubmitting={briefUpdateFetcher.state !== "idle"}
                    />
                  ) : (
                    <>
                      <ProjectBriefEditor
                        initialValues={briefFormValues}
                        onCancel={() => {}}
                        onSave={async () => {}}
                        isSubmitting={false}
                        readOnly={!isEditingBrief}
                      />
                      {canInteractWithBrief && !isEditingBrief && (
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleBriefEdit}
                            className="px-4 py-2 text-sm md:text-base"
                          >
                            <Edit3 className="h-4 w-4" />
                            수정하기
                          </Button>
                          <Button
                            variant="default"
                            className="rounded-full bg-green-500 px-5 py-2 text-sm md:text-base"
                            size="sm"
                            onClick={handleBriefApprove}
                          >
                            <Check className="h-4 w-4" />
                            완료
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </AccordionContent>
          </AccordionItem>

          {/* step2 (대본) 제거됨 */}

          {shouldShowNarrationStep && (
            <ProjectScriptAudio
              value="step-2"
              title="step 2: 나레이션 확인하기"
              segments={narrationSegments}
              loading={
                // audio_file이 있으면 로딩 완료 (무조건 false)
                // audio_file이 없고 제출/재생성 중일 때만 로딩 표시
                !hasShortWorkflowAudio &&
                !hasNarrationSegments &&
                optimisticLoading.narration &&
                !done.narration &&
                !optimisticDone.narration
              }
              done={optimisticDone.narration || done.narration}
              onEdit={
                canManageNarration ? handleNarrationRegenerate : undefined
              }
              onDone={canManageNarration ? handleNarrationApprove : undefined}
            />
          )}

          {(hasImageEntries || optimisticLoading.images) && (
            <ProjectImageSelect
              value="step-3"
              title="step 3: 생성된 이미지"
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

          {(hasVideoAssets || optimisticLoading.videos) && (
            <ProjectVideoSelect
              value="step-4"
              title="step 4: 생성된 영상 확인하기"
              sources={videoUrls || []}
              timelines={videoTimelines}
              selected={selectedVideos}
              onToggle={canManageVideos ? handleToggleVideoSelect : undefined}
              onRegenerate={
                canManageVideos ? handleVideosRegenerate : undefined
              }
              onDone={canManageVideos ? handleVideosApprove : undefined}
              loading={optimisticLoading.videos && !hasVideoAssets}
              done={optimisticDone.videos}
            />
          )}

          {(hasFinalVideo ||
            optimisticLoading.final ||
            finalVideoCompletion) && (
            <ProjectFinalVideo
              value="step-5"
              title="step 5: 편집된 영상 확인 및 업로드"
              videoSrc={finalVideoUrl || ""}
              headline={finalVideoCompletion?.title || fallbackProjectTitle}
              description={
                finalVideoCompletion?.description || fallbackProjectDescription
              }
              durationText={
                finalVideoCompletion?.duration
                  ? `영상 길이 ${finalVideoCompletion.duration}`
                  : "영상 길이 00:30"
              }
              youtubeUrl={finalVideoCompletion?.youtube_url || undefined}
              loading={optimisticLoading.final && !finalVideoUrl}
              done={optimisticDone.final}
              onDone={canManageFinal ? handleDeploy : undefined}
              onYouTubeClick={canManageFinal ? handleYouTubeUpload : undefined}
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

  // output이 JSON 문자열인 경우 파싱
  try {
    const parsed = JSON.parse(output);
    if (parsed && typeof parsed === "object") {
      // parsed가 이미 객체인 경우 (converted, original 등을 포함)
      if ("converted" in parsed || "original" in parsed) {
        return parsed as ShortWorkflowOutputPayload;
      }
      // parsed가 문자열인 경우 (이중 인코딩된 경우)
      if (typeof parsed === "string") {
        try {
          const doubleParsed = JSON.parse(parsed);
          if (doubleParsed && typeof doubleParsed === "object") {
            return doubleParsed as ShortWorkflowOutputPayload;
          }
        } catch {
          // 이중 파싱 실패 시 원본 문자열을 converted로 사용
          return { converted: parsed };
        }
      }
    }
  } catch (error) {
    console.warn("short_workflow_jobs.output JSON parse 실패:", error);
  }

  // 파싱 실패 시 원본을 converted로 사용
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

  // output 필드에서 JSON 파싱하여 converted 우선 사용
  const parsedOutput = parseShortWorkflowOutput(job.output);
  if (parsedOutput?.converted) {
    // converted가 있으면 우선 사용
    paragraphs.push(...splitIntoParagraphs(parsedOutput.converted));
  } else if (parsedOutput?.original) {
    // converted가 없으면 original 사용
    paragraphs.push(...splitIntoParagraphs(parsedOutput.original));
  }

  // output에서 파싱한 내용이 없으면 다른 필드들 사용하지 않음
  // (output이 우선순위가 높음)

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
  disabled?: boolean;
};

function ShortWorkflowJobDeckContent({
  jobs,
  selectedJobId,
  onSelect,
  disabled = false,
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
      disabled={disabled}
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
  disabled = false,
}: {
  jobs: ShortWorkflowJobRecord[];
  selectedJobId: number | null;
  onSelect: (id: number) => void;
  disabled?: boolean;
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
          {disabled
            ? "기획서가 확정되어 초안 선택이 비활성화되었습니다."
            : "원하는 초안을 선택하면 기획서에 바로 반영됩니다."}
        </p>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {jobs.map((job) => {
          const isSelected = job.id === selectedJobId;
          return (
            <button
              key={job.id}
              type="button"
              onClick={() => !disabled && onSelect(job.id)}
              disabled={disabled}
              className={`rounded-2xl border p-4 text-left transition duration-150 ${
                disabled
                  ? "cursor-not-allowed opacity-60"
                  : isSelected
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

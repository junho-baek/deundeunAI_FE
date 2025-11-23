import * as React from "react";
import {
  Outlet,
  type LoaderFunctionArgs,
  useFetcher,
  useLoaderData,
  useParams,
  Link,
  useSearchParams,
} from "react-router";
import type { Route } from "./+types/project-detail-layout";
import ChatForm, { type ChatFormData } from "~/common/components/chat-form";
import ChatInitForm, {
  type SurveySection,
} from "~/features/projects/components/chat-init-form";
import {
  SHORT_WORKFLOW_CATEGORY_OPTIONS,
  SHORT_WORKFLOW_IMAGE_MODEL_OPTIONS,
} from "../short-workflow.constants";
import ChatBox from "~/features/projects/components/chat-box";
import ChatConfirmCard from "~/features/projects/components/chat-confirm-card";
import { Typography } from "~/common/components/typography";
import { Separator } from "~/common/components/ui/separator";
import { Textarea } from "~/common/components/ui/textarea";
import { Button } from "~/common/components/ui/button";
import {
  Alert,
  AlertTitle,
  AlertDescription,
} from "~/common/components/ui/alert";
import {
  getProjectByProjectId,
  getProjectSteps,
  getProjectMessages,
  type ProjectMessage,
} from "~/features/projects/queries";
import { getProfileSlug } from "~/features/users/queries";
import { makeSSRClient } from "~/lib/supa-client";
import { useProjectStepStatus } from "../hooks/use-project-step-status";

type MessageAttachment = { name: string; size?: number };
type Message = {
  id: string;
  role: "user" | "agent";
  content: string;
  attachments?: MessageAttachment[];
  aspectRatio?: ChatFormData["aspectRatio"];
  stepKey?:
    | "brief"
    | "script"
    | "narration"
    | "images"
    | "videos"
    | "final"
    | "distribution";
  metadata?: Record<string, unknown>;
};

type LoadingState = {
  brief: boolean;
  script: boolean;
  narration: boolean;
  images: boolean;
  videos: boolean;
  final: boolean;
};

type DoneState = LoadingState;

type NarrationSegment = { id: number; label: string; src: string };

export type ProjectDetailContextValue = {
  projectId?: string;
  messages: Message[];
  handleSubmit: (payload: ChatFormData) => Promise<void>;
  selectedImages: number[];
  toggleSelectImage: (id: number) => void;
  imageTimelines: string[];
  selectedVideos: number[];
  toggleSelectVideo: (id: number) => void;
  videoTimelines: string[];
  loading: LoadingState;
  setLoading: React.Dispatch<React.SetStateAction<LoadingState>>;
  done: DoneState;
  setDone: React.Dispatch<React.SetStateAction<DoneState>>;
  narrationSegments: NarrationSegment[];
  actionData?: {
    error?: string;
    fieldErrors?: Record<string, string[] | undefined>;
    creditBalance?: number;
    requiredCredits?: number;
    rechargeUrl?: string;
  };
  isSubmitting?: boolean;
};

const ProjectDetailContext =
  React.createContext<ProjectDetailContextValue | null>(null);

type LoaderData = {
  initialChatPayload: ChatFormData | null;
  project: Awaited<ReturnType<typeof getProjectByProjectId>> | null;
  projectSteps: Awaited<ReturnType<typeof getProjectSteps>>;
  ownerSlug: string | null;
  savedMessages: ProjectMessage[]; // 저장된 채팅 내역
};

function extractInitialChatPayload(url: URL): ChatFormData | null {
  // project-create-page.tsx의 loader와 동일한 방식으로 쿼리 파라미터 추출
  const keyword = url.searchParams.get("keyword");
  const aspectRatioParam = url.searchParams.get("aspectRatio");

  const aspectRatioOptions: ChatFormData["aspectRatio"][] = [
    "9:16",
    "16:9",
    "1:1",
  ];

  // aspectRatio가 유효한 값인지 확인하고, 없으면 기본값 "9:16" 사용
  const aspectRatio = aspectRatioOptions.includes(
    aspectRatioParam as ChatFormData["aspectRatio"]
  )
    ? (aspectRatioParam as ChatFormData["aspectRatio"])
    : "9:16";

  // keyword가 없으면 null 반환
  if (!keyword || !keyword.trim()) return null;

  return {
    message: keyword.trim(),
    images: [],
    aspectRatio,
  };
}

export const loader = async ({
  request,
  params,
}: LoaderFunctionArgs): Promise<LoaderData> => {
  const url = new URL(request.url);
  const projectId = params.projectId;

  // 쿼리 파라미터 처리
  const keyword = url.searchParams.get("keyword");
  const aspectRatio = url.searchParams.get("aspectRatio");
  const initialChatPayload =
    keyword && keyword.trim() ? extractInitialChatPayload(url) : null;

  const { client } = makeSSRClient(request);

  // 프로젝트 데이터 조회
  let project = null;
  let projectSteps: Awaited<ReturnType<typeof getProjectSteps>> = [];
  let ownerSlug: string | null = null;
  let savedMessages: ProjectMessage[] = [];

  if (projectId && projectId !== "create") {
    try {
      project = await getProjectByProjectId(client, projectId);
      projectSteps = await getProjectSteps(client, projectId);

      // 저장된 채팅 내역 복원
      savedMessages = await getProjectMessages(client, projectId);

      // owner slug 조회 (공개 프로필 링크용)
      if (project?.owner_profile_id) {
        ownerSlug = await getProfileSlug(client, project.owner_profile_id);
      }
    } catch (error) {
      console.error("프로젝트 로드 실패:", error);
      // 에러가 발생해도 UI는 계속 렌더링
    }
  }

  return {
    initialChatPayload,
    project,
    projectSteps,
    ownerSlug,
    savedMessages, // 저장된 채팅 내역 추가
  };
};

function createConversationEntries({
  message,
  images,
  aspectRatio,
}: ChatFormData): Message[] {
  const trimmed = message.trim();
  if (!trimmed) return [];

  const attachmentSummaries: MessageAttachment[] = images.map((file) => ({
    name: file.name,
    size: file.size,
  }));

  // 더 자연스러운 에이전트 응답 생성
  const agentResponses = [
    `네, "${trimmed}" 주제로 ${aspectRatio} 비율의 수익형 쇼츠를 만들어드릴게요! 몇 가지 정보를 더 알려주시면 더 정확한 기획서를 작성할 수 있어요.`,
    `좋은 주제네요! "${trimmed}"를 바이럴 콘텐츠로 만들기 위해 몇 가지 질문드릴게요.`,
    `알겠습니다! "${trimmed}" 주제로 ${aspectRatio} 비율의 쇼츠를 제작해드릴게요. 아래 설문을 작성해주시면 맞춤형 기획서를 만들어드려요.`,
  ];

  const randomResponse =
    agentResponses[Math.floor(Math.random() * agentResponses.length)];

  return [
    {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
      attachments: attachmentSummaries,
      aspectRatio,
    },
    {
      id: crypto.randomUUID(),
      role: "agent",
      content:
        attachmentSummaries.length > 0
          ? `업로드해 주신 이미지 ${attachmentSummaries.length}개를 확인했어요! ${aspectRatio} 비율로 초안을 준비할게요. 아래 설문을 작성해주시면 더 정확한 콘텐츠를 만들 수 있어요.`
          : randomResponse,
    },
  ];
}

function useProjectDetailState(
  loaderDataProp?: LoaderData | null
): ProjectDetailContextValue {
  const { projectId } = useParams();
  const loaderDataFromHook = useLoaderData<LoaderData | null>();
  const loaderData = loaderDataProp ?? loaderDataFromHook;
  const initialChatPayload = loaderData?.initialChatPayload ?? null;
  const savedMessages = loaderData?.savedMessages ?? [];

  // 프로젝트 단계 상태 폴링 및 동기화
  const { getStepLoading, getStepDone, stepStatusMap } = useProjectStepStatus(
    projectId,
    {
      enabled: !!projectId && projectId !== "create",
      interval: 3000, // 3초마다 폴링
    }
  );

  // 저장된 메시지를 Message 형식으로 변환
  const restoredMessages = React.useMemo(() => {
    if (savedMessages.length > 0) {
      return savedMessages.map(
        (msg: ProjectMessage): Message => ({
          id: msg.id,
          role: msg.role as "user" | "agent",
          content: msg.content,
          attachments: msg.attachments || [],
          aspectRatio: msg.aspectRatio as
            | ChatFormData["aspectRatio"]
            | undefined,
          stepKey: msg.stepKey as Message["stepKey"], // stepKey 타입 캐스팅
          metadata: msg.metadata || undefined,
        })
      );
    }
    return [];
  }, [savedMessages]);

  // 저장된 메시지가 있으면 우선 사용, 없으면 초기 채팅 페이로드 사용
  const initialMessages = React.useMemo(
    () =>
      restoredMessages.length > 0
        ? restoredMessages
        : initialChatPayload
          ? createConversationEntries(initialChatPayload)
          : [],
    [restoredMessages, initialChatPayload]
  );

  // useState의 lazy initialization을 사용하여 초기값을 함수로 전달
  // 이렇게 하면 첫 렌더링 시에만 실행되고, 이후에는 실행되지 않음
  const [messages, setMessages] = React.useState<Message[]>(
    () => initialMessages
  );
  const previousProjectIdRef = React.useRef<string | undefined>(undefined);
  const [selectedImages, setSelectedImages] = React.useState<number[]>([]);
  const imageTimelines = React.useMemo(
    () => [
      "00:00–00:05",
      "00:06–00:10",
      "00:11–00:15",
      "00:16–00:20",
      "00:21–00:25",
      "00:26–00:30",
    ],
    []
  );
  const [selectedVideos, setSelectedVideos] = React.useState<number[]>([]);
  const videoTimelines = React.useMemo(
    () => [
      "00:00–00:05",
      "00:06–00:10",
      "00:11–00:15",
      "00:16–00:20",
      "00:21–00:25",
      "00:26–00:30",
    ],
    []
  );
  const narrationSegments = React.useMemo(() => {
    // 실감나는 오디오 세그먼트 사용
    return [
      {
        id: 1,
        label: "00:00–00:10",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      },
      {
        id: 2,
        label: "00:11–00:20",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
      },
      {
        id: 3,
        label: "00:21–00:30",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
      },
    ];
  }, []);
  // DB 상태와 동기화된 loading/done 상태
  const dbLoading = React.useMemo<LoadingState>(
    () => ({
      brief: getStepLoading("brief"),
      script: getStepLoading("script"),
      narration: getStepLoading("narration"),
      images: getStepLoading("images"),
      videos: getStepLoading("videos"),
      final: getStepLoading("final"),
    }),
    [getStepLoading]
  );

  const dbDone = React.useMemo<DoneState>(
    () => ({
      brief: getStepDone("brief"),
      script: getStepDone("script"),
      narration: getStepDone("narration"),
      images: getStepDone("images"),
      videos: getStepDone("videos"),
      final: getStepDone("final"),
    }),
    [getStepDone]
  );

  // 수동으로 상태를 업데이트할 수 있는 함수들 (필요시 사용)
  const [manualLoading, setManualLoading] = React.useState<LoadingState>({
    brief: false,
    script: false,
    narration: false,
    images: false,
    videos: false,
    final: false,
  });
  const [manualDone, setManualDone] = React.useState<DoneState>({
    brief: false,
    script: false,
    narration: false,
    images: false,
    videos: false,
    final: false,
  });

  // DB 상태와 수동 상태를 병합 (수동 상태가 우선)
  const loading = React.useMemo<LoadingState>(
    () => ({
      brief: manualLoading.brief || dbLoading.brief,
      script: manualLoading.script || dbLoading.script,
      narration: manualLoading.narration || dbLoading.narration,
      images: manualLoading.images || dbLoading.images,
      videos: manualLoading.videos || dbLoading.videos,
      final: manualLoading.final || dbLoading.final,
    }),
    [manualLoading, dbLoading]
  );

  const done = React.useMemo<DoneState>(
    () => ({
      brief: manualDone.brief || dbDone.brief,
      script: manualDone.script || dbDone.script,
      narration: manualDone.narration || dbDone.narration,
      images: manualDone.images || dbDone.images,
      videos: manualDone.videos || dbDone.videos,
      final: manualDone.final || dbDone.final,
    }),
    [manualDone, dbDone]
  );

  const toggleSelectImage = React.useCallback((id: number) => {
    setSelectedImages((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }, []);

  const toggleSelectVideo = React.useCallback((id: number) => {
    setSelectedVideos((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }, []);

  React.useEffect(() => {
    const hasProjectChanged = previousProjectIdRef.current !== projectId;

    if (hasProjectChanged) {
      // 프로젝트가 변경되었으면 무조건 초기 메시지로 설정
      setMessages(initialMessages);
      previousProjectIdRef.current = projectId;
    } else if (initialMessages.length > 0) {
      // 같은 프로젝트인데 초기 메시지가 있고, 현재 메시지가 없으면 초기 메시지로 설정
      setMessages((prev) => (prev.length > 0 ? prev : initialMessages));
    }
  }, [initialMessages, projectId]);

  // loaderData가 나중에 준비되는 경우를 대비해 initialMessages가 변경되면 즉시 반영
  // 특히 clientLoader가 실행되기 전에 렌더링이 일어나는 경우를 처리
  React.useEffect(() => {
    if (initialMessages.length > 0) {
      // 프로젝트가 변경되지 않았고, 메시지가 없거나 초기 메시지와 다르면 업데이트
      const hasProjectChanged = previousProjectIdRef.current !== projectId;
      if (hasProjectChanged || messages.length === 0) {
        setMessages(initialMessages);
      }
    }
  }, [initialMessages, projectId, messages.length]);

  // clientLoader가 실행되기 전에도 URL에서 직접 쿼리 파라미터를 읽어서 처리
  // 이렇게 하면 초기 렌더링 시에도 메시지가 표시됨
  React.useEffect(() => {
    if (typeof window !== "undefined" && messages.length === 0) {
      const url = new URL(window.location.href);
      const keyword = url.searchParams.get("keyword");
      const aspectRatioParam = url.searchParams.get("aspectRatio");

      if (keyword && keyword.trim()) {
        const aspectRatioOptions: ChatFormData["aspectRatio"][] = [
          "9:16",
          "16:9",
          "1:1",
        ];
        const aspectRatio = aspectRatioOptions.includes(
          aspectRatioParam as ChatFormData["aspectRatio"]
        )
          ? (aspectRatioParam as ChatFormData["aspectRatio"])
          : "9:16";

        const payload: ChatFormData = {
          message: keyword.trim(),
          images: [],
          aspectRatio,
        };

        const entries = createConversationEntries(payload);
        if (entries.length > 0) {
          setMessages(entries);
        }
      }
    }
  }, [messages.length]);

  const effectiveMessages = React.useMemo(
    () => (messages.length > 0 ? messages : initialMessages),
    [messages, initialMessages]
  );

  const appendConversation = React.useCallback((payload: ChatFormData) => {
    const entries = createConversationEntries(payload);
    if (!entries.length) return;
    setMessages((prev) => [...prev, ...entries]);
  }, []);

  const fetcher = useFetcher();

  const handleSubmit = React.useCallback(
    async (payload: ChatFormData) => {
      // projectId가 "create"이거나 없으면 프로젝트 생성 action 호출
      if (!projectId || projectId === "create") {
        const formData = new FormData();
        formData.append("keyword", payload.message);
        formData.append("aspectRatio", payload.aspectRatio);
        if (payload.projectId) {
          formData.append("projectId", payload.projectId);
        }
        for (const image of payload.images) {
          formData.append("images", image);
        }

        fetcher.submit(formData, {
          method: "post",
          action: "/my/dashboard/project/create",
          encType: "multipart/form-data",
        });
        return;
      }

      appendConversation(payload);

      // TODO: 실제 프로젝트 생성/업데이트 완료 시 워크스페이스 페이지로 리다이렉트 처리
    },
    [appendConversation, projectId, fetcher]
  );

  const actionData = fetcher.data as
    | {
        error?: string;
        fieldErrors?: Record<string, string[] | undefined>;
        creditBalance?: number;
        requiredCredits?: number;
        rechargeUrl?: string;
      }
    | undefined;
  const isSubmitting = fetcher.state === "submitting";

  return React.useMemo(
    () => ({
      projectId,
      messages: effectiveMessages,
      handleSubmit,
      selectedImages,
      toggleSelectImage,
      imageTimelines,
      selectedVideos,
      toggleSelectVideo,
      videoTimelines,
      loading,
      setLoading: setManualLoading,
      done,
      setDone: setManualDone,
      narrationSegments,
      actionData,
      isSubmitting,
    }),
    [
      done,
      effectiveMessages,
      handleSubmit,
      imageTimelines,
      loading,
      narrationSegments,
      projectId,
      selectedImages,
      selectedVideos,
      toggleSelectImage,
      toggleSelectVideo,
      videoTimelines,
      actionData,
      isSubmitting,
    ]
  );
}

export function useProjectDetail() {
  const fallbackState = useProjectDetailState();
  const context = React.useContext(ProjectDetailContext);
  if (context) {
    return context;
  }
  if (process.env.NODE_ENV !== "production") {
    console.warn(
      "useProjectDetail 훅이 ProjectDetailLayout 외부에서 호출되었습니다. 독립 상태로 동작합니다."
    );
  }
  return fallbackState;
}

export default function ProjectDetailLayout({
  loaderData,
  children,
}: Route.ComponentProps & { children?: React.ReactNode }) {
  const contextValue = useProjectDetailState(
    loaderData as LoaderData | null | undefined
  );
  const { messages, handleSubmit, actionData, isSubmitting } = contextValue;
  const [searchParams, setSearchParams] = useSearchParams();
  const loaderDataFromHook = useLoaderData<LoaderData | null>();
  const currentLoaderData = loaderData ?? loaderDataFromHook;
  const initialChatPayload = currentLoaderData?.initialChatPayload;

  // 쿼리 파라미터가 처리되었으면 URL에서 제거 (SSR에서 처리된 경우 클라이언트에서 정리)
  React.useEffect(() => {
    if (initialChatPayload && typeof window !== "undefined") {
      const currentUrl = new URL(window.location.href);
      const hasKeyword = currentUrl.searchParams.has("keyword");
      const hasAspectRatio = currentUrl.searchParams.has("aspectRatio");

      if (hasKeyword || hasAspectRatio) {
        const newParams = new URLSearchParams(searchParams);
        newParams.delete("keyword");
        newParams.delete("aspectRatio");
        setSearchParams(newParams, { replace: true });
      }
    }
  }, [initialChatPayload, searchParams, setSearchParams]);

  return (
    <ProjectDetailContext.Provider value={contextValue}>
      <section className="flex h-full w-full overflow-hidden">
        <div className="flex h-full w-full gap-6 overflow-hidden">
          <aside
            className="w-full shrink-0 border-r pr-4 md:w-96 lg:w-[420px]"
            aria-label="프로젝트 AI 어시스턴트"
          >
            <div className="flex h-full flex-col overflow-hidden">
              {/* <Typography
                as="h2"
                variant="h4"
                className="mb-3 text-left text-xl font-semibold leading-tight"
              >
                든든 AI 어시스턴트
              </Typography> */}
              <div className="flex-1 space-y-3 overflow-y-auto pr-2">
                {messages.length === 0 ? (
                  <Typography
                    as="p"
                    variant="p"
                    className="text-base leading-relaxed text-muted-foreground first:mt-0"
                  >
                    AI 에이전트와 대화를 시작해보세요.
                  </Typography>
                ) : (
                  <AgentConversationMock />
                )}
              </div>
              <div className="bg-background/70 backdrop-blur">
                <Separator className="my-4" />
                {actionData?.fieldErrors && (
                  <Alert
                    variant="destructive"
                    className="mb-4 bg-destructive/10"
                  >
                    <AlertTitle>입력 오류</AlertTitle>
                    <AlertDescription className="flex flex-col gap-1">
                      {Object.entries(actionData.fieldErrors).map(
                        ([field, errors]) =>
                          errors?.map((error, index) => (
                            <span key={`${field}-${index}`}>{error}</span>
                          ))
                      )}
                    </AlertDescription>
                  </Alert>
                )}
                {actionData?.error && (
                  <Alert
                    variant="destructive"
                    className="mb-4 bg-destructive/10"
                  >
                    <AlertTitle>크레딧 부족</AlertTitle>
                    <AlertDescription className="flex flex-col gap-2">
                      <span>{actionData.error}</span>
                      {actionData.rechargeUrl && (
                        <Link
                          to={actionData.rechargeUrl}
                          className="text-primary underline hover:text-primary/80"
                        >
                          크레딧 충전하기 →
                        </Link>
                      )}
                    </AlertDescription>
                  </Alert>
                )}
                <ChatForm onSubmit={handleSubmit} disabled={isSubmitting} />
              </div>
            </div>
          </aside>

          <main className="flex-1 min-w-0 overflow-hidden" role="main">
            <div className="h-full w-full overflow-y-auto">
              {children || <Outlet />}
            </div>
          </main>
        </div>
      </section>
    </ProjectDetailContext.Provider>
  );
}

function AgentConversationMock() {
  const { messages, loading, done, projectId } = useProjectDetail();
  const formSubmitFetcher = useFetcher();
  const referenceSubmitFetcher = useFetcher();
  const formActionData = formSubmitFetcher.data as
    | { success?: boolean; ok?: boolean; error?: string }
    | undefined;
  const referenceActionData = referenceSubmitFetcher.data as
    | { success?: boolean; error?: string }
    | undefined;
  const latestUserMessage = React.useMemo(
    () => [...messages].reverse().find((message) => message.role === "user"),
    [messages]
  );
  const showAttachments = (latestUserMessage?.attachments?.length ?? 0) > 0;

  // 프로젝트가 생성되었는지 확인 (메시지가 있고 첫 번째 사용자 메시지가 있음)
  const hasProjectStarted =
    messages.length > 0 && messages.some((m) => m.role === "user");

  const hasMessages = messages.length > 0;

  const hasReferenceSubmissionMessage = React.useMemo(
    () =>
      messages.some((message) => {
        const meta =
          (message.metadata as { isReferenceSubmission?: boolean } | undefined) ??
          undefined;
        return Boolean(meta?.isReferenceSubmission);
      }),
    [messages]
  );

  const hasSubmittedReference =
    hasReferenceSubmissionMessage ||
    referenceSubmitFetcher.state === "submitting" ||
    Boolean(referenceActionData?.success);

  const handleFormSubmit = React.useCallback(
    async (values: Record<string, string[]>) => {
      if (!projectId || projectId === "create") return;

      const formData = new FormData();
      for (const [key, valueArray] of Object.entries(values)) {
        for (const value of valueArray) {
          formData.append(`form_${key}`, value);
        }
      }

      formSubmitFetcher.submit(formData, {
        method: "post",
        action: `/my/dashboard/project/${projectId}/form/submit`,
      });
    },
    [projectId, formSubmitFetcher]
  );

  const sections: SurveySection[] = React.useMemo(
    () => [
      {
        id: "category",
        title: "카테고리를 선택해주세요",
        description: "콘텐츠의 주제를 골라 주세요.",
        options: SHORT_WORKFLOW_CATEGORY_OPTIONS.map((value) => ({
          id: value,
          label: value,
        })),
      },
      {
        id: "image_model",
        title: "이미지 생성 모델",
        description: "선호하는 이미지 모델을 선택해주세요.",
        options: SHORT_WORKFLOW_IMAGE_MODEL_OPTIONS.map((value) => ({
          id: value,
          label: value,
        })),
      },
    ],
    []
  );

  const hasFormResponseMessage = React.useMemo(
    () =>
      messages.some((message) => {
        const meta = message.metadata as { isFormResponse?: boolean } | undefined;
        return Boolean(meta?.isFormResponse);
      }),
    [messages]
  );

  const hasSubmittedForm =
    hasFormResponseMessage ||
    formSubmitFetcher.state === "submitting" ||
    Boolean(formActionData?.success);

  const shouldShowSurveyForm =
    hasProjectStarted &&
    hasSubmittedReference &&
    !done.brief &&
    !loading.brief &&
    !hasSubmittedForm;

  const shouldShowSurveyPlaceholder =
    hasProjectStarted &&
    hasSubmittedReference &&
    !done.brief &&
    !loading.brief &&
    hasSubmittedForm;

  const shouldShowReferenceForm =
    hasProjectStarted && !hasSubmittedReference && !!projectId;

  const showReferencePlaceholder =
    referenceSubmitFetcher.state === "submitting";
  // 기획서 작성 중
  const showBriefGenerating = loading.brief;
  // 기획서 완료
  const showBriefDone = done.brief && !done.script;
  // 대본 작성 중
  const showScriptGenerating = loading.script;
  // 대본 완료
  const showScriptDone = done.script && !done.narration;
  // 나레이션 생성 중
  const showNarrationGenerating = loading.narration;
  // 나레이션 완료
  const showNarrationDone = done.narration && !done.images;
  // 이미지 생성 중
  const showImagesGenerating = loading.images;
  // 이미지 완료
  const showImagesDone = done.images && !done.videos;
  // 비디오 생성 중
  const showVideosGenerating = loading.videos;
  // 비디오 완료
  const showVideosDone = done.videos && !done.final;
  // 최종 편집 중
  const showFinalGenerating = loading.final;

  return (
    <div className="flex flex-col gap-2">
      {/* 저장된 메시지 표시 */}
      {hasMessages &&
        messages.map((message) => {
          const metadata = (message.metadata ??
            {}) as {
            isFormResponse?: boolean;
            formData?: Record<string, string[]>;
          };
          const isUserFormResponse =
            message.role === "user" && metadata.isFormResponse;
          const displayMessage = isUserFormResponse
            ? "폼 응답이 제출되었습니다."
            : message.content;

          const renderFormChips = () => {
            if (!metadata.formData) return null;
            const entries = Object.entries(metadata.formData);
            if (entries.length === 0) return null;
            const formatLabel = (field: string) => {
              switch (field) {
                case "category":
                  return "카테고리";
                case "image_model":
                  return "이미지 모델";
                default:
                  return field;
              }
            };
            return (
              <div className="flex flex-col gap-2 text-xs text-muted-foreground">
                {entries.map(([field, values]) => (
                  <div key={field}>
                    <span className="text-foreground font-medium">
                      {formatLabel(field)}
                    </span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {values.map((value) => (
                        <span
                          key={`${field}-${value}`}
                          className="rounded-full border border-muted-foreground/30 px-2 py-0.5 text-foreground"
                        >
                          {value}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            );
          };

          const shouldShowMetaDetails =
            message.role === "user" &&
            !isUserFormResponse &&
            (message.aspectRatio || (message.attachments?.length ?? 0) > 0);

          return (
            <ChatBox
              key={message.id}
              role={message.role}
              message={displayMessage}
              avatarSrc={message.role === "user" ? "/avatar.png" : "/agent.png"}
              stackBelowAvatar={message.role === "agent"}
              childrenFullWidth
            >
              {isUserFormResponse
                ? renderFormChips()
                : shouldShowMetaDetails && (
                    <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                      {message.aspectRatio ? (
                        <span className="rounded-full border border-muted-foreground/30 px-2 py-1">
                          비율 {message.aspectRatio}
                        </span>
                      ) : null}
                      {message.attachments?.map((attachment, index) => (
                        <span
                          key={`${attachment.name}-${index}`}
                          className="rounded-full border border-muted-foreground/30 px-2 py-1"
                        >
                          {attachment.name}
                        </span>
                      ))}
                    </div>
                  )}
            </ChatBox>
          );
        })}

      {shouldShowReferenceForm && projectId && (
        <ChatBox
          role="agent"
          message="콘텐츠를 더 잘 이해할 수 있도록 참고 자료를 입력해주세요."
          avatarSrc="/agent.png"
          stackBelowAvatar
          childrenFullWidth
        >
          <div className="mt-3 space-y-3">
            <referenceSubmitFetcher.Form
              method="post"
              action={`/my/dashboard/project/${projectId}/reference/submit`}
              className="space-y-3"
            >
              <Textarea
                name="reference"
                required
                minLength={20}
                placeholder="예: 영상에서 반드시 다루고 싶은 핵심 메시지, 참고할 자료 링크, 포함했으면 하는 스토리 요소 등을 자유롭게 적어주세요."
                className="min-h-[120px]"
                disabled={referenceSubmitFetcher.state === "submitting"}
              />
              <div className="flex justify-end">
                <Button
                  type="submit"
                  size="sm"
                  className="rounded-full"
                  disabled={referenceSubmitFetcher.state === "submitting"}
                >
                  {referenceSubmitFetcher.state === "submitting"
                    ? "전송 중..."
                    : "참고 자료 전송"}
                </Button>
              </div>
            </referenceSubmitFetcher.Form>
            {referenceActionData?.error && (
              <p className="text-sm text-destructive">
                {referenceActionData.error}
              </p>
            )}
          </div>
        </ChatBox>
      )}

      {showReferencePlaceholder && (
        <ChatBox
          role="agent"
          message="보내주신 참고 자료를 검토 중입니다..."
          avatarSrc="/agent.png"
          stackBelowAvatar
          childrenFullWidth
          showThinking
        />
      )}

      {shouldShowSurveyForm && (
        <ChatBox
          role="agent"
          message="콘텐츠 방향을 정하기 위해 아래 정보를 선택해주세요."
          avatarSrc="/agent.png"
          stackBelowAvatar
          childrenFullWidth
        >
          <div className="mt-3">
            <ChatInitForm
              sections={sections}
              onSubmit={handleFormSubmit}
              submitLabel={
                formSubmitFetcher.state === "submitting" ? "전송 중..." : "제출"
              }
              actionData={formActionData}
            />
            {formActionData?.error && (
              <p className="mt-2 text-sm text-destructive">
                {formActionData.error}
              </p>
            )}
          </div>
        </ChatBox>
      )}

      {shouldShowSurveyPlaceholder && (
        <ChatBox
          role="agent"
          message="입력해 주신 정보를 검토 중이에요."
          avatarSrc="/agent.png"
          stackBelowAvatar
          childrenFullWidth
          showThinking
        />
      )}

      {/* 기획서 작성 중 */}
      {showBriefGenerating && (
        <ChatBox
          role="agent"
          message="기획서 작성 중입니다..."
          avatarSrc="/agent.png"
          showThinking
          stackBelowAvatar
          childrenFullWidth
        />
      )}

      {/* 기획서 완료 */}
      {showBriefDone && (
        <ChatBox
          role="agent"
          avatarSrc="/agent.png"
          stackBelowAvatar
          childrenFullWidth
        >
          <ChatConfirmCard
            message="기획서가 완성되었어요! 작업공간에서 확인하고 수정하거나 '이대로 제출' 버튼을 눌러주세요."
            mode="text"
            showSecondary
            attention={false}
            secondaryActionLabel="확인했어요"
          />
        </ChatBox>
      )}

      {/* 대본 작성 중 */}
      {showScriptGenerating && (
        <ChatBox
          role="agent"
          message="대본 작성 중입니다..."
          avatarSrc="/agent.png"
          showThinking
          stackBelowAvatar
          childrenFullWidth
        />
      )}

      {/* 대본 완료 */}
      {showScriptDone && (
        <ChatBox
          role="agent"
          avatarSrc="/agent.png"
          stackBelowAvatar
          childrenFullWidth
        >
          <ChatConfirmCard
            message="대본 작성이 완료되었어요! 작업공간에서 각 문단을 확인하고 수정하거나 '이대로 제출' 버튼을 눌러주세요."
            mode="text"
            showSecondary
            attention={false}
            secondaryActionLabel="확인했어요"
          />
        </ChatBox>
      )}

      {/* 나레이션 생성 중 */}
      {showNarrationGenerating && (
        <ChatBox
          role="agent"
          message="나레이션 생성 중입니다..."
          avatarSrc="/agent.png"
          showThinking
          stackBelowAvatar
          childrenFullWidth
        />
      )}

      {/* 나레이션 완료 */}
      {showNarrationDone && (
        <ChatBox
          role="agent"
          avatarSrc="/agent.png"
          stackBelowAvatar
          childrenFullWidth
        >
          <ChatConfirmCard
            message="나레이션이 완료되었어요! 작업공간에서 확인하고 수정하거나 '이대로 제출' 버튼을 눌러주세요."
            mode="text"
            showSecondary
            attention={false}
            secondaryActionLabel="확인했어요"
          />
        </ChatBox>
      )}

      {/* 이미지 생성 중 */}
      {showImagesGenerating && (
        <ChatBox
          role="agent"
          message="이미지 생성 중입니다..."
          avatarSrc="/agent.png"
          showThinking
          stackBelowAvatar
          childrenFullWidth
        />
      )}

      {/* 이미지 완료 */}
      {showImagesDone && (
        <ChatBox
          role="agent"
          avatarSrc="/agent.png"
          stackBelowAvatar
          childrenFullWidth
        >
          <ChatConfirmCard
            message="이미지 생성이 완료되었어요! 작업공간에서 원하는 이미지를 선택하고 '완료' 버튼을 눌러주세요."
            mode="media"
            showSecondary
            attention={false}
            secondaryActionLabel="확인했어요"
          />
        </ChatBox>
      )}

      {/* 비디오 생성 중 */}
      {showVideosGenerating && (
        <ChatBox
          role="agent"
          message="비디오 생성 중입니다..."
          avatarSrc="/agent.png"
          showThinking
          stackBelowAvatar
          childrenFullWidth
        />
      )}

      {/* 비디오 완료 */}
      {showVideosDone && (
        <ChatBox
          role="agent"
          avatarSrc="/agent.png"
          stackBelowAvatar
          childrenFullWidth
        >
          <ChatConfirmCard
            message="비디오 생성이 완료되었어요! 작업공간에서 원하는 비디오를 선택하고 '완료' 버튼을 눌러주세요."
            mode="media"
            showSecondary
            attention={false}
            secondaryActionLabel="확인했어요"
          />
        </ChatBox>
      )}

      {/* 최종 편집 중 */}
      {showFinalGenerating && (
        <ChatBox
          role="agent"
          message="최종 영상 편집 중이에요..."
          avatarSrc="/agent.png"
          showThinking
          stackBelowAvatar
          childrenFullWidth
        />
      )}
    </div>
  );
}

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
import ChatBox from "~/features/projects/components/chat-box";
import ChatInitForm, {
  type SurveySection,
} from "~/features/projects/components/chat-init-form";
import ChatConfirmCard from "~/features/projects/components/chat-confirm-card";
import { Typography } from "~/common/components/typography";
import { Separator } from "~/common/components/ui/separator";
import {
  Alert,
  AlertTitle,
  AlertDescription,
} from "~/common/components/ui/alert";
import {
  getProjectByProjectId,
  getProjectSteps,
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
  if (projectId && projectId !== "create") {
    try {
      project = await getProjectByProjectId(client, projectId);
      projectSteps = await getProjectSteps(client, projectId);

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
          ? `업로드해 주신 이미지 ${attachmentSummaries.length}개와 ${aspectRatio} 비율을 기반으로 초안을 준비할게요. 제품명과 타깃을 알려주세요.`
          : `${aspectRatio} 비율로 초안 설문을 준비 중입니다. 제품명과 타깃을 알려주세요.`,
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

  // 프로젝트 단계 상태 폴링 및 동기화
  const { getStepLoading, getStepDone, stepStatusMap } = useProjectStepStatus(
    projectId,
    {
      enabled: !!projectId && projectId !== "create",
      interval: 3000, // 3초마다 폴링
    }
  );

  const initialMessages = React.useMemo(
    () =>
      initialChatPayload ? createConversationEntries(initialChatPayload) : [],
    [initialChatPayload]
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
  const narrationSegments = React.useMemo(
    () => [
      { id: 1, label: "00:00–00:10", src: "/audio/seg-1.mp3" },
      { id: 2, label: "00:11–00:20", src: "/audio/seg-2.mp3" },
    ],
    []
  );
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

  const actionData = fetcher.data as { error?: string } | undefined;
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
  const { messages } = useProjectDetail();
  const latestUserMessage = React.useMemo(
    () => [...messages].reverse().find((message) => message.role === "user"),
    [messages]
  );
  const showAttachments = (latestUserMessage?.attachments?.length ?? 0) > 0;

  const sections: SurveySection[] = React.useMemo(
    () => [
      {
        id: "type",
        title: "어떤 유형의 컨텐츠를 만들고 싶으신가요?",
        description: "원하시는 콘텐츠 유형을 선택하세요.",
        multiple: true,
        options: [
          { id: "viral", label: "바이럴/트렌드" },
          { id: "info", label: "정보전달(How-to)" },
          { id: "health", label: "건강쇼츠" },
          { id: "animal", label: "동물쇼츠" },
        ],
      },
      {
        id: "audience",
        title: "누굴 타겟하나요?",
        description: "주요 시청자층을 선택하세요.",
        multiple: true,
        options: [
          { id: "teen", label: "10대" },
          { id: "2030", label: "20-30대" },
          { id: "40plus", label: "40대 이상" },
          { id: "office", label: "직장인" },
          { id: "founder", label: "창업가" },
          { id: "senior", label: "시니어" },
        ],
      },
      {
        id: "fun",
        title: "재밌는 포인트",
        description: "핵심 훅/포인트를 고르세요.",
        multiple: true,
        options: [
          { id: "hook", label: "강한 훅" },
          { id: "twist", label: "반전" },
          { id: "meme", label: "밈 활용" },
          { id: "humor", label: "유머" },
        ],
      },
      {
        id: "lang",
        title: "언어",
        multiple: true,
        options: [
          { id: "ko", label: "한국어" },
          { id: "en", label: "영어" },
          { id: "caption", label: "자막만" },
        ],
      },
      {
        id: "ratio",
        title: "비율",
        multiple: true,
        options: [
          { id: "9-16", label: "9:16" },
          { id: "1-1", label: "1:1" },
          { id: "16-9", label: "16:9" },
        ],
      },
      {
        id: "style",
        title: "비디오 스타일",
        description: "전달 방식이나 톤을 선택하세요.",
        multiple: true,
        options: [
          { id: "viral", label: "바이럴" },
          { id: "info", label: "정보전달" },
          { id: "health", label: "건강쇼츠" },
          { id: "animal", label: "동물쇼츠" },
        ],
      },
    ],
    []
  );

  const hasMessages = messages.length > 0;

  return (
    <div className="flex flex-col gap-2">
      {hasMessages ? (
        messages.map((message) => (
          <ChatBox
            key={message.id}
            role={message.role}
            message={message.content}
            avatarSrc={message.role === "user" ? "/avatar.png" : "/agent.png"}
            stackBelowAvatar={message.role === "agent"}
            childrenFullWidth
          >
            {message.role === "user" &&
            (message.aspectRatio || (message.attachments?.length ?? 0) > 0) ? (
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
            ) : null}
          </ChatBox>
        ))
      ) : (
        <ChatBox role="user" message="keyword" avatarSrc="/avatar.png" />
      )}

      <ChatBox
        role="agent"
        message="ok let me see.."
        avatarSrc="/agent.png"
        showThinking
        stackBelowAvatar
        childrenFullWidth
      >
        <div className="mt-3">
          <ChatInitForm sections={sections} />
        </div>
      </ChatBox>

      <ChatBox
        role="agent"
        avatarSrc="/agent.png"
        stackBelowAvatar
        childrenFullWidth
      >
        <ChatConfirmCard
          message="작업공간에서 작업물을 확인하고 수정 혹은 다음 버튼을 눌러주세요."
          mode="text"
          showSecondary
          attention="shake"
          secondaryActionLabel="다음"
        />
      </ChatBox>

      <ChatBox
        role="agent"
        avatarSrc="/agent.png"
        stackBelowAvatar
        childrenFullWidth
      >
        <ChatConfirmCard
          message="작업공간에서 작업물을 확인하고 수정 혹은 다음 버튼을 눌러주세요."
          mode="text"
          showSecondary
          secondaryActionLabel="다음"
        />
      </ChatBox>

      <ChatBox
        role="agent"
        avatarSrc="/agent.png"
        stackBelowAvatar
        childrenFullWidth
      >
        <ChatConfirmCard
          message="작업공간에서 작업물을 선택하고 수정 혹은 다음 버튼을 눌러주세요."
          mode="media"
          showSecondary
          attention="bounce"
          secondaryActionLabel="다음"
        />
      </ChatBox>

      <ChatBox
        role="agent"
        avatarSrc="/agent.png"
        showThinking
        stackBelowAvatar
        childrenFullWidth
      />
    </div>
  );
}

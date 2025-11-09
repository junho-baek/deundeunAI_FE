import * as React from "react";
import { Outlet, useParams } from "react-router";
import ChatForm from "~/common/components/chat-form";
import ChatBox from "~/features/projects/components/chat-box";
import ChatInitForm, {
  type SurveySection,
} from "~/features/projects/components/chat-init-form";
import ChatConfirmCard from "~/features/projects/components/chat-confirm-card";
import { Typography } from "~/common/components/typography";

type Message = { id: string; role: "user" | "agent"; content: string };

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
  handleSubmit: (message: string) => Promise<void>;
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
};

const ProjectDetailContext =
  React.createContext<ProjectDetailContextValue | null>(null);

function useProjectDetailState(): ProjectDetailContextValue {
  const { projectId } = useParams();

  const [messages, setMessages] = React.useState<Message[]>([]);
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
  const [loading, setLoading] = React.useState<LoadingState>({
    brief: false,
    script: false,
    narration: false,
    images: false,
    videos: false,
    final: false,
  });
  const [done, setDone] = React.useState<DoneState>({
    brief: false,
    script: false,
    narration: false,
    images: false,
    videos: false,
    final: false,
  });

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

  const handleSubmit = React.useCallback(
    async (message: string) => {
      if (!projectId) return;

      try {
        await fetch(`/api/projects/${projectId}/agent`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message }),
        });
      } catch (_) {
        // prototype ignore
      }

      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "user", content: message },
        {
          id: crypto.randomUUID(),
          role: "agent",
          content: "초안 설문을 준비 중입니다. 제품명과 타깃을 알려주세요.",
        },
      ]);
    },
    [projectId]
  );

  return React.useMemo(
    () => ({
      projectId,
      messages,
      handleSubmit,
      selectedImages,
      toggleSelectImage,
      imageTimelines,
      selectedVideos,
      toggleSelectVideo,
      videoTimelines,
      loading,
      setLoading,
      done,
      setDone,
      narrationSegments,
    }),
    [
      done,
      handleSubmit,
      imageTimelines,
      loading,
      messages,
      narrationSegments,
      projectId,
      selectedImages,
      selectedVideos,
      toggleSelectImage,
      toggleSelectVideo,
      videoTimelines,
      setLoading,
      setDone,
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

export default function ProjectDetailLayout() {
  const contextValue = useProjectDetailState();
  const { messages, handleSubmit } = contextValue;

  return (
    <ProjectDetailContext.Provider value={contextValue}>
      <section className="flex h-full w-full overflow-hidden">
        <div className="flex h-full w-full gap-6 overflow-hidden">
          <aside
            className="w-full shrink-0 border-r pr-4 md:w-96 lg:w-[420px]"
            aria-label="프로젝트 AI 어시스턴트"
          >
            <div className="flex h-full flex-col overflow-hidden">
              <Typography
                as="h2"
                variant="h4"
                className="mb-3 text-left text-xl font-semibold leading-tight"
              >
                든든 AI 어시스턴트
              </Typography>
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
              <div className="bg-background/50 pb-12 backdrop-blur">
                <ChatForm onSubmit={handleSubmit} />
              </div>
            </div>
          </aside>

          <main className="flex-1 min-w-0 overflow-hidden" role="main">
            <div className="h-full w-full overflow-y-auto">
              <Outlet />
            </div>
          </main>
        </div>
      </section>
    </ProjectDetailContext.Provider>
  );
}

function AgentConversationMock() {
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

  return (
    <div className="flex flex-col gap-2">
      <ChatBox role="user" message="keyword" avatarSrc="/avatar.png" />

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

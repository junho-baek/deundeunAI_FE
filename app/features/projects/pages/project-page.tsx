import { useParams } from "react-router";
import * as React from "react";
import ChatForm from "~/common/components/chat-form";
import ChatBox from "~/features/projects/components/chat-box";
import ChatInitForm, {
  type SurveySection,
} from "~/features/projects/components/chat-init-form";
import ChatConfirmCard from "~/features/projects/components/chat-confirm-card";

import { Button } from "~/common/components/ui/button";
import { Check } from "lucide-react";
import { ProjectAccordion } from "~/features/projects/components/project-accordion";
import ProjectPrd from "~/features/projects/components/project-prd";
import ProjectScript from "~/features/projects/components/project-script";
import ProjectScriptAudio from "~/features/projects/components/project-script-audio";
import ProjectImageSelect from "~/features/projects/components/project-image-select";
import ProjectVideoSelect from "~/features/projects/components/project-video-select";
import ProjectFinalVideo from "~/features/projects/components/project-final-video";
import { Skeleton } from "~/common/components/ui/skeleton";
import { Spinner } from "~/common/components/ui/spinner";

export default function ProjectPage() {
  const { projectId } = useParams();
  const [messages, setMessages] = React.useState<
    { id: string; role: "user" | "agent"; content: string }[]
  >([]);
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
  const toggleSelectVideo = (id: number) => {
    setSelectedVideos((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };
  const [loading, setLoading] = React.useState({
    brief: false,
    script: false,
    narration: false,
    images: false,
    videos: false,
    final: false,
  });
  const [done, setDone] = React.useState({
    brief: false,
    script: false,
    narration: false,
    images: false,
    videos: false,
    final: false,
  });

  function StepStatus({ loading, done }: { loading: boolean; done: boolean }) {
    if (done) return <Check className="h-4 w-4 text-green-500" />;
    if (loading) return <Spinner className="text-muted-foreground" />;
    return <></>;
  }

  // minimal markdown rendering for brief display
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

  const projectBriefMd = `# 영상 프로젝트 기획서\n\n**목표**: 수익형 쇼츠 제작\n\n## 콘셉트\n- 강렬한 훅으로 시작\n- 정보 전달형 전개\n- 마지막에 명확한 CTA\n\n## 타깃\n- 20-30대 직장인\n\n## 포맷\n- 비율 9:16\n- 길이 00:30`;
  const narrationSegments = React.useMemo(
    () => [
      { id: 1, label: "00:00–00:10", src: "/audio/seg-1.mp3" },
      { id: 2, label: "00:11–00:20", src: "/audio/seg-2.mp3" },
    ],
    []
  );

  const toggleSelectImage = (id: number) => {
    setSelectedImages((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  async function handleSubmit(message: string) {
    // TODO: 서버 API로 교체. 임시로 콘솔 및 no-op
    try {
      await fetch(`/api/projects/${projectId}/agent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
    } catch (_) {
      // ignore in prototype
    }

    // 로컬 대화 내역 업데이트 (임시)
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: "user", content: message },
      {
        id: crypto.randomUUID(),
        role: "agent",
        content: "초안 설문을 준비 중입니다. 제품명과 타깃을 알려주세요.",
      },
    ]);
  }

  return (
    <section>
      <div className="flex gap-6">
        {/* 좌측: 채팅 패널 */}
        <aside className="w-full md:w-96 lg:w-[420px] shrink-0 border-r pr-4 ">
          <div className="sticky top-4 h-[calc(100vh-2rem)] flex flex-col ">
            <p className="text-sm text-muted-foreground mb-2"></p>
            {/* 대화 내역 */}
            <div className="flex-1 overflow-auto space-y-3 pr-2">
              {messages.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  AI 에이전트와 대화를 시작해보세요.
                </p>
              ) : (
                <div className="flex flex-col gap-2">
                  <ChatBox
                    role="user"
                    message="keyword"
                    avatarSrc="/avatar.png"
                  />

                  <ChatBox
                    role="agent"
                    message="ok let me see.."
                    avatarSrc="/agent.png"
                    showThinking
                    stackBelowAvatar
                    childrenFullWidth
                  >
                    {(() => {
                      const sections: SurveySection[] = [
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
                      ];
                      return (
                        <div className="mt-3">
                          <ChatInitForm sections={sections} />
                        </div>
                      );
                    })()}
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
                  ></ChatBox>
                </div>
              )}
            </div>

            {/* 채팅 폼 */}
            <div className=" pb-12 bg-background/50 backdrop-blur">
              <ChatForm onSubmit={handleSubmit} />
            </div>
          </div>
        </aside>

        {/* 우측: 작업공간 */}
        <div className="flex-1 min-w-0">
          <ProjectAccordion defaultValue="step-1">
            <ProjectPrd
              value="step-1"
              title="step 1: 수익형 콘텐츠 기획서"
              markdownHtml={renderMarkdown(projectBriefMd)}
              loading={loading.brief}
              done={done.brief}
            />

            <ProjectScript
              value="step-2"
              title="step 2: 대본 작성"
              paragraphs={[
                "00:00 / 00:10 Lorem ipsum dolor sit amet consectetur adipisicing elit...",
                "00:11 / 00:20 Lorem ipsum dolor sit amet consectetur adipisicing elit...",
              ]}
              loading={loading.script}
              done={done.script}
            />

            <ProjectScriptAudio
              value="step-3"
              title="step 3: 나레이션 확인하기"
              segments={narrationSegments}
              loading={loading.narration}
              done={done.narration}
            />

            <ProjectImageSelect
              value="step-4"
              title="step 4: 생성된 이미지"
              images={[
                "https://github.com/openai.png",
                "https://github.com/openai.png",
                "https://github.com/openai.png",
                "https://github.com/openai.png",
                "https://github.com/openai.png",
                "https://github.com/openai.png",
              ]}
              timelines={imageTimelines}
              selected={selectedImages}
              onToggle={toggleSelectImage}
              loading={loading.images}
              done={done.images}
            />

            <ProjectVideoSelect
              value="step-5"
              title="step 5: 생성된 영상 확인하기"
              sources={[
                "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
                "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
                "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
                "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
                "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
                "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
              ]}
              timelines={videoTimelines}
              selected={selectedVideos}
              onToggle={toggleSelectVideo}
              loading={loading.videos}
              done={done.videos}
            />

            <ProjectFinalVideo
              value="step-6"
              title="step 6: 편집된 영상 확인 및 업로드"
              videoSrc="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
              headline="바이럴될만한 제목"
              description="바이럴될만한 설명들"
              durationText="영상 길이 01:00"
              loading={loading.final}
              done={done.final}
            />
          </ProjectAccordion>
        </div>
      </div>
    </section>
  );
}

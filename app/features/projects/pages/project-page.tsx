import { useParams } from "react-router";
import * as React from "react";
import ChatForm from "~/common/components/chat-form";

export default function ProjectPage() {
  const { projectId } = useParams();
  const [messages, setMessages] = React.useState<
    { id: string; role: "user" | "agent"; content: string }[]
  >([]);

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
        <aside className="w-full md:w-96 lg:w-[420px] shrink-0 border-r pr-4">
          <div className="sticky top-4 h-[calc(100vh-2rem)] flex flex-col">
            <h2 className="text-lg font-semibold">에이전트</h2>
            <p className="text-sm text-muted-foreground mb-2">
              아이디어를 입력하면 설문과 체크리스트를 생성합니다.
            </p>
            {/* 대화 내역 */}
            <div className="flex-1 overflow-auto space-y-3 pr-2">
              {messages.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  아직 메시지가 없습니다. 아래 폼에 메시지를 입력해
                  시작해보세요.
                </p>
              ) : (
                messages.map((m) => (
                  <div
                    key={m.id}
                    className={
                      m.role === "user"
                        ? "ml-auto max-w-[85%] rounded-lg bg-primary text-primary-foreground px-3 py-2"
                        : "mr-auto max-w-[85%] rounded-lg border px-3 py-2"
                    }
                  >
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">
                      {m.content}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* 채팅 폼 */}
            <div className="border-t pb-12 bg-background/50 backdrop-blur">
              <ChatForm onSubmit={handleSubmit} />
            </div>
          </div>
        </aside>

        {/* 우측: 작업공간 */}
        <div className="flex-1 min-w-0">
          <h1>프로젝트 상세</h1>
          <p className="text-sm text-muted-foreground">
            프로젝트 ID: {projectId}
          </p>

          <div className="mt-6 space-y-4">
            <div className="rounded-lg border p-4">
              <h2 className="font-semibold">작업공간</h2>
              <p className="text-sm text-muted-foreground">
                에이전트가 생성한 설문/체크리스트/타스크 등을 이 영역에
                표시합니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

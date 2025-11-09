import { type MetaFunction, useNavigate } from "react-router";
import ChatForm from "~/common/components/chat-form";
import { Typography } from "~/common/components/typography";

export const meta: MetaFunction = () => {
  return [
    {
      title: "든든AI - 쇼츠 제작",
    },
    {
      name: "description",
      content:
        "아이디어를 입력하면 자동으로 쇼츠 스크립트와 자산을 생성하는 체험을 시작하세요.",
    },
  ];
};

export default function ShortsCreatePage() {
  const navigate = useNavigate();

  return (
    <section className="min-h-screen w-screen bg-background text-foreground">
      <div className="px-20 space-y-40 min-w-[400px]">
        <div className="flex flex-col items-center gap-6 mt-20">
          {/* <Typography variant="h1">든든 AI</Typography> */}
          <Typography variant="muted" className="text-base">
            #1 shorts 제작 도구
          </Typography>

          <h2 className="text-center text-5xl md:text-7xl font-extrabold tracking-tight text-balance bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            아이디어를 수익형 쇼츠로 바꿔보세요
          </h2>

          <div className="w-full flex justify-center">
            <ChatForm
              onSubmit={() => navigate("/my/dashboard/project/create")}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

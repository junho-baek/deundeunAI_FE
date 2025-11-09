import { Outlet, type MetaFunction, useNavigate } from "react-router";
import ChatForm from "~/common/components/chat-form";
import * as React from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "든든AI - 시니어도 쉽게 제작하는 수익형 컨텐츠" },
    { name: "description", content: "든든AI 홈페이지에 오신 것을 환영합니다." },
  ];
};

export default function HomePage() {
  const navigate = useNavigate();
  const [selectedTool, setSelectedTool] = React.useState<
    "search" | "sparkles" | "lightbulb"
  >("search");
  const [value, setValue] = React.useState("");
  const [disabled, setDisabled] = React.useState(false);

  const onToolChange = (tool: typeof selectedTool) => {
    if (!tool) return;
    setSelectedTool(tool);
  };

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  const handleSend = () => {};

  const handleKeyDown = (_e: React.KeyboardEvent<HTMLTextAreaElement>) => {};
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate("/my/dashboard/project/create");
  };
  return (
    <div className="bg-background text-foreground">
      <section className="min-h-screen w-screen">
        <div className="px-20 space-y-40 min-w-[400px]">
          <div className="flex flex-col items-center gap-6 mt-20">
            {/* <Typography variant="h1">든든 AI</Typography> */}
            <p className="text-base text-muted-foreground">
              #1 shorts 제작 도구
            </p>

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
      <Outlet />
    </div>
  );
}

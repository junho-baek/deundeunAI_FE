import { Button } from "~/common/components/ui/button";
import { Link, type MetaFunction, useNavigate } from "react-router";

import { Typography } from "../components/typography";
import { Input } from "../components/ui/input";
import ChatForm from "~/common/components/chat-form";
import * as React from "react";
import {
  Search as SearchIcon,
  Sparkles,
  Lightbulb,
  SendHorizontal,
  RectangleVertical,
  ImageUp,
  ChevronDown,
} from "lucide-react";
import { Form } from "react-router";
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
    <div className="px-20 space-y-40 min-w-[400px]">
      <div className="flex flex-col items-center gap-6">
        {/* <Typography variant="h1">든든 AI</Typography> */}
        <Typography variant="muted" className="text-base">
          #1 shorts 제작 도구
        </Typography>

        <h2 className="text-center text-5xl md:text-7xl font-extrabold tracking-tight text-balance bg-linear-to-r from-blue-400 via-cyan-300 via-40% to-fuchsia-400 bg-clip-text text-transparent">
          아이디어를 수익형 쇼츠로 바꿔보세요
        </h2>
        <Form method="post" className="w-full" onSubmit={handleSubmit}>
          <ChatForm onSubmit={() => navigate("/my/dashboard/project/create")} />
        </Form>
      </div>
    </div>
  );
}

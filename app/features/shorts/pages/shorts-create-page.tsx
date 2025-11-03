import { Button } from "~/common/components/ui/button";
import { Form, useNavigate } from "react-router";
import { Textarea } from "~/common/components/ui/textarea";
import { Typography } from "~/common/components/typography";
import * as React from "react";
import { RectangleVertical, ImageUp, ChevronDown, SendHorizontal } from "lucide-react";

export default function ShortsCreatePage() {
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

  const handleSend = () => {
    if (!value.trim()) return;
    setDisabled(true);
    setTimeout(() => {
      setValue("");
      setDisabled(false);
    }, 400);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      // handleSend();
      e.preventDefault();
      navigate("/my/dashboard/project/1");
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate("/my/dashboard/project/1");
  };

  return (
    <div className="px-20 space-y-40 min-w-[400px]">
      <div className="flex flex-col items-center gap-6">
        {/* <Typography variant="h1">든든 AI</Typography> */}
        <Typography variant="muted" className="text-base">
          #1 shorts 제작 도구
        </Typography>

        <h2 className="text-center text-5xl md:text-7xl font-extrabold tracking-tight text-balance bg-linear-to-r from-blue-400 via-cyan-300 via-40% to-fuchsia-400 bg-clip-text text-transparent">
          간단한 아이디어를 수익형 쇼츠로 바꿔보세요
        </h2>
        <Form method="post" className="w-full" onSubmit={handleSubmit}>
          <div className="relative w-full max-w-5xl mt-6 border border-white/10 rounded-2xl">
            <Textarea
              id="message"
              placeholder="이곳에 아이디어를 입력해주세요. 당신의 아이디어가 당신만의 수익형 컨텐츠가 될거에요"
              className="w-full rounded-2xl border border-white/10 bg-white/5 dark:bg-white/5 shadow-lg backdrop-blur pl-14 pr-14 py-6 resize-none min-h-[180px]"
              rows={9}
              value={value}
              onChange={onChange}
              onKeyDown={handleKeyDown}
              disabled={disabled}
            />

            <div className="absolute left-4 bottom-4 flex gap-2">
              <Button
                type="button"
                variant={selectedTool === "search" ? "default" : "outline"}
                size="sm"
                aria-label="검색 모드"
                onClick={() => onToolChange("search")}
              >
                <ImageUp className="h-4 w-4" />
                이미지 업로드
              </Button>
            </div>
            <Button
              type="button"
              className="absolute bottom-4 right-16"
              variant={selectedTool === "lightbulb" ? "default" : "outline"}
              size="sm"
              aria-label="아이디어 모드"
              onClick={() => onToolChange("lightbulb")}
            >
              <RectangleVertical className="h-4 w-4" />
              <span>9:16</span> <ChevronDown className="h-2 w-2" />
            </Button>
            <Button
              type="submit"
              className="absolute bottom-4 right-4"
              size="sm"
              variant="outline"
              onClick={handleSend}
              disabled={disabled}
            >
              <SendHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}

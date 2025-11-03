import * as React from "react";
import { Button } from "~/common/components/ui/button";
import { Textarea } from "~/common/components/ui/textarea";
import { Form } from "react-router";
import {
  ImageUp,
  RectangleVertical,
  ChevronDown,
  SendHorizontal,
} from "lucide-react";

export type ChatFormProps = {
  onSubmit: (value: string) => void | Promise<void>;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
};

export default function ChatForm({
  onSubmit,
  disabled = false,
  placeholder,
  className,
}: ChatFormProps) {
  const [value, setValue] = React.useState("");
  const [selectedTool, setSelectedTool] = React.useState<
    "search" | "lightbulb"
  >("search");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    await onSubmit(trimmed);
    setValue("");
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmed = value.trim();
      if (!trimmed) return;
      await onSubmit(trimmed);
      setValue("");
    }
  };

  return (
    <Form
      method="post"
      className={"w-full " + (className ?? "")}
      onSubmit={handleSubmit}
    >
      <div className="relative w-full max-w-5xl mt-6 border border-white/10 rounded-2xl">
        <Textarea
          id="message"
          placeholder={
            placeholder ??
            "이곳에 아이디어를 입력해주세요. 당신의 아이디어가 당신만의 수익형 컨텐츠가 될거에요"
          }
          className="w-full rounded-2xl border border-white/10 bg-white/5 dark:bg-white/5 shadow-lg backdrop-blur pl-14 pr-14 py-6 resize-none min-h-[180px]"
          rows={9}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
        />

        <div className="absolute left-4 bottom-4 flex gap-2">
          <Button
            type="button"
            variant={selectedTool === "search" ? "default" : "outline"}
            size="sm"
            aria-label="이미지 업로드"
            onClick={() => setSelectedTool("search")}
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
          aria-label="비디오 비율"
          onClick={() => setSelectedTool("lightbulb")}
        >
          <RectangleVertical className="h-4 w-4" />
          <span>9:16</span> <ChevronDown className="h-2 w-2" />
        </Button>
        <Button
          type="submit"
          className="absolute bottom-4 right-4"
          size="sm"
          variant="outline"
          disabled={disabled}
        >
          <SendHorizontal className="w-4 h-4" />
        </Button>
      </div>
    </Form>
  );
}

import * as React from "react";
import { Button } from "~/common/components/ui/button";
import { Textarea } from "~/common/components/ui/textarea";
import { ImageUp, SendHorizontal, X } from "lucide-react";
import { generateProjectUUID, getCurrentUserName } from "~/lib/uuid-utils";

export type AspectRatioOption = "9:16" | "16:9" | "1:1";

export type ChatFormData = {
  message: string;
  images: File[];
  aspectRatio: AspectRatioOption;
  projectId?: string; // 생성된 프로젝트 UUID
  formData?: Record<string, string[]>; // 폼 응답 데이터 (ChatInitForm용)
};

export type ChatFormProps = {
  onSubmit: (value: ChatFormData) => void | Promise<void>;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  /**
   * 제출 성공 후 폼을 리셋할지 여부
   * @default true
   */
  resetOnSubmit?: boolean;
};

export default function ChatForm({
  onSubmit,
  disabled = false,
  placeholder,
  className,
  resetOnSubmit = true,
}: ChatFormProps) {
  const [value, setValue] = React.useState("");
  const [images, setImages] = React.useState<File[]>([]);
  const [aspectRatio, setAspectRatio] =
    React.useState<AspectRatioOption>("9:16");
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const formRef = React.useRef<HTMLFormElement>(null);
  const isComposingRef = React.useRef(false);

  const submitCurrent = React.useCallback(async () => {
    const trimmed = value.trim();
    if (!trimmed) return;

    // 유저 이름과 날짜 정보를 기반으로 UUID 생성
    const userName = getCurrentUserName();
    const projectId = generateProjectUUID(userName, trimmed);

    const payload: ChatFormData = {
      message: trimmed,
      images,
      aspectRatio,
      projectId, // 생성된 프로젝트 UUID 포함
    };

    await onSubmit(payload);
    
    // 제출 성공 후 폼 리셋
    if (resetOnSubmit) {
      setValue("");
      setImages([]);
      formRef.current?.reset();
    }
  }, [value, images, aspectRatio, onSubmit, resetOnSubmit]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await submitCurrent();
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (isComposingRef.current) return;
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      await submitCurrent();
    }
  };

  const handleCompositionStart = () => {
    isComposingRef.current = true;
  };

  const handleCompositionEnd = () => {
    isComposingRef.current = false;
  };

  const aspectRatioOptions: AspectRatioOption[] = ["9:16", "16:9", "1:1"];

  const handleImageButtonClick = () => {
    if (disabled || images.length >= 4) return;
    fileInputRef.current?.click();
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;

    setImages((prev) => {
      const availableSlots = Math.max(0, 4 - prev.length);
      if (availableSlots === 0) return prev;
      const next = files.slice(0, availableSlots);
      return [...prev, ...next];
    });

    event.target.value = "";
  };

  const removeImageAt = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <form
      ref={formRef}
      className={"w-full " + (className ?? "")}
      onSubmit={handleSubmit}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleImageChange}
      />

      <div className="relative mx-auto mt-6 w-full max-w-5xl rounded-2xl border border-white/10">
        <Textarea
          id="message"
          placeholder={
            placeholder ??
            "이곳에 아이디어를 입력해주세요. 당신의 아이디어가 당신만의 수익형 컨텐츠가 될거에요"
          }
          className="min-h-[180px] w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-14 py-6 shadow-lg backdrop-blur dark:bg-white/5"
          rows={9}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
          disabled={disabled}
        />

        <div className="absolute bottom-4 left-4 flex flex-wrap items-center gap-3 pr-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            aria-label="이미지 업로드"
            onClick={handleImageButtonClick}
            disabled={disabled || images.length >= 4}
          >
            <ImageUp className="h-4 w-4" />
            이미지 업로드 ({images.length}/4)
          </Button>

          <label className="flex items-center gap-2 text-xs text-muted-foreground">
            비율
            <select
              value={aspectRatio}
              onChange={(event) =>
                setAspectRatio(event.target.value as AspectRatioOption)
              }
              disabled={disabled}
              className="rounded-md border border-input bg-background px-2 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {aspectRatioOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>

        <Button
          type="submit"
          className="absolute bottom-4 right-4"
          size="sm"
          variant="outline"
          disabled={disabled}
        >
          <SendHorizontal className="h-4 w-4" />
        </Button>
      </div>

      {images.length > 0 ? (
        <div className="mx-auto mt-3 flex w-full max-w-5xl flex-wrap gap-2">
          {images.map((file, index) => (
            <span
              key={`${file.name}-${index}`}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm shadow-sm backdrop-blur dark:bg-white/5"
            >
              <span className="max-w-[160px] truncate">{file.name}</span>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="h-6 w-6"
                aria-label={`${file.name} 제거`}
                onClick={() => removeImageAt(index)}
                disabled={disabled}
              >
                <X className="h-3 w-3" />
              </Button>
            </span>
          ))}
        </div>
      ) : null}
    </form>
  );
}

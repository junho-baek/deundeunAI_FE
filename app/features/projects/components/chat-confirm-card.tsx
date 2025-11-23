import * as React from "react";
import { Button } from "~/common/components/ui/button";
import { Sparkles, ArrowRight, Edit3, Check } from "lucide-react";

export type ConfirmMode = "text" | "media";

export type ChatConfirmCardProps = {
  label?: string;
  message: string;
  mode?: ConfirmMode;
  primaryActionLabel?: string;
  onPrimaryAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  showSecondary?: boolean;
  className?: string;
  // attention animation: 'shake' uses inline keyframes, others use Tailwind presets
  attention?: false | "shake" | "pulse" | "bounce";
};

export function ChatConfirmCard({
  label = "Human in the loop",
  message,
  mode = "text",
  primaryActionLabel,
  onPrimaryAction,
  secondaryActionLabel,
  onSecondaryAction,
  showSecondary,
  className,
  attention,
}: ChatConfirmCardProps) {
  const computedPrimary =
    primaryActionLabel ?? (mode === "text" ? "수정" : "선택 완료");
  // attention 효과를 최소화 (너무 흔들리지 않도록)
  // pulse만 사용하고, shake와 bounce는 제거하거나 매우 약하게
  const animationClass =
    (attention === "pulse" && "animate-pulse") ||
    // shake와 bounce는 제거 (너무 흔들림)
    "";

  return (
    <div
      className={
        "w-full rounded-2xl border border-white/10 bg-white/5 dark:bg-white/5 shadow-lg backdrop-blur px-4 py-3 " +
        (animationClass ? animationClass + " " : "") +
        (className ?? "")
      }
    >
      {attention === "shake" ? (
        <style>
          {`@keyframes chat-confirm-shake-x{0%,100%{transform:translateX(0)}20%{transform:translateX(-2px)}40%{transform:translateX(2px)}60%{transform:translateX(-1px)}80%{transform:translateX(1px)}}
           .animate-shake-x{animation:chat-confirm-shake-x .45s ease-in-out infinite;}`}
        </style>
      ) : null}
      <div className="mb-2 inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary px-2 py-0.5 text-[11px] font-medium">
        <Sparkles className="h-3 w-3" />
        {label}
      </div>
      <p className="text-sm text-muted-foreground">{message}</p>
      <div className="mt-3 flex justify-end gap-2">
        <Button size="sm" className="rounded-full" onClick={onPrimaryAction}>
          {computedPrimary}
          {mode === "text" ? (
            <Edit3 className="ml-1 h-4 w-4" />
          ) : (
            <Check className="ml-1 h-4 w-4" />
          )}
        </Button>
        {showSecondary ? (
          <Button
            size="sm"
            variant="outline"
            className="rounded-full"
            onClick={onSecondaryAction}
          >
            {secondaryActionLabel ?? "다음"}
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        ) : null}
      </div>
    </div>
  );
}

export default ChatConfirmCard;

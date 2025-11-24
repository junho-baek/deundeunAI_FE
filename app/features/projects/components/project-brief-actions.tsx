import * as React from "react";
import { Button } from "~/common/components/ui/button";
import { Edit3, Check } from "lucide-react";
import ChatConfirmCard from "./chat-confirm-card";

type ProjectBriefActionsProps = {
  disabled?: boolean;
  onEdit: () => void;
  onSubmit: () => void;
  layout?: "chat" | "inline";
};

export function ProjectBriefActions({
  disabled,
  onEdit,
  onSubmit,
  layout = "inline",
}: ProjectBriefActionsProps) {
  const handleEdit = React.useCallback(() => {
    if (disabled) return;
    onEdit();
  }, [disabled, onEdit]);

  const handleSubmit = React.useCallback(() => {
    if (disabled) return;
    onSubmit();
  }, [disabled, onSubmit]);

  if (layout === "chat") {
    return (
      <ChatConfirmCard
        message="선택한 초안을 그대로 사용할 수도 있고, 수정 후 확정할 수도 있어요."
        primaryActionLabel="수정할래요"
        onPrimaryAction={disabled ? undefined : handleEdit}
        secondaryActionLabel="이대로 진행"
        onSecondaryAction={disabled ? undefined : handleSubmit}
        showSecondary
        attention="pulse"
      />
    );
  }

  return (
    <div className="flex justify-end gap-2">
      <Button
        variant="outline"
        size="sm"
        className="px-4 py-2 text-sm md:text-base"
        onClick={handleEdit}
        disabled={disabled}
      >
        <Edit3 className="mr-1 h-4 w-4" />
        수정하기
      </Button>
      <Button
        variant="default"
        size="sm"
        className="rounded-full bg-green-500 px-5 py-2 text-sm md:text-base hover:bg-green-600"
        onClick={handleSubmit}
        disabled={disabled}
      >
        <Check className="mr-1 h-4 w-4" />
        이대로 제출
      </Button>
    </div>
  );
}

export default ProjectBriefActions;

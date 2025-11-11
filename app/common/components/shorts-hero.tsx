import ChatForm, { type ChatFormProps } from "~/common/components/chat-form";
import { Typography } from "~/common/components/typography";
import { AuroraText } from "~/common/components/ui/aurora-text";
import { cn } from "~/lib/utils";

type ShortsHeroProps = {
  onSubmit: ChatFormProps["onSubmit"];
  className?: string;
  tagline?: string;
  taglineClassName?: string;
  headingClassName?: string;
  formWrapperClassName?: string;
};

export function ShortsHero({
  onSubmit,
  className,
  tagline = "#1 shorts 제작 도구",
  taglineClassName,
  headingClassName,
  formWrapperClassName,
}: ShortsHeroProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-6 text-center md:gap-8",
        className
      )}
    >
      <Typography variant="muted" className={cn("text-base", taglineClassName)}>
        {tagline}
      </Typography>

      <AuroraText
        className={cn(
          "text-center text-balance text-5xl font-extrabold tracking-tight md:text-7xl",
          headingClassName
        )}
        colors={["#705028", "#C2775B", "#E39B8D", "#F3CFC6"]}
      >
        아이디어를 수익형 쇼츠로 바꿔보세요
      </AuroraText>

      <div className={cn("flex w-full justify-center", formWrapperClassName)}>
        <ChatForm onSubmit={onSubmit} />
      </div>
    </div>
  );
}

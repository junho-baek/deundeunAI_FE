import * as React from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/common/components/ui/avatar";

type ChatBoxProps = {
  role?: "user" | "agent";
  message?: string;
  avatarSrc?: string;
  avatarFallback?: string;
  align?: "left" | "right";
  showThinking?: boolean;
  className?: string;
  childrenFullWidth?: boolean;
  stackBelowAvatar?: boolean; // avatar on top, content below
  children?: React.ReactNode;
};

export function ChatBox(props: ChatBoxProps) {
  const {
    role = "agent",
    message,
    avatarSrc,
    avatarFallback,
    align,
    showThinking,
    className,
    childrenFullWidth,
    stackBelowAvatar,
    children,
  } = props;

  const computedAlign: "left" | "right" =
    align ?? (role === "user" ? "right" : "left");
  const isRight = computedAlign === "right";
  const childrenMarginTop = message || showThinking ? "mt-3" : "mt-1";

  return (
    <div
      className={"flex w-full " + (isRight ? "justify-end" : "justify-start")}
    >
      {stackBelowAvatar ? (
        <div className="flex w-full flex-col items-start gap-1">
          <Avatar>
            <AvatarImage src={avatarSrc} alt={role} />
            <AvatarFallback>
              {avatarFallback ?? (role === "user" ? "U" : "A")}
            </AvatarFallback>
          </Avatar>
          <div className={"w-full " + (className ?? "")}>
            {message ? (
              <div
                className={
                  "rounded-2xl rounded-bl-sm bg-muted text-foreground px-3 py-2 shadow max-w-full"
                }
              >
                {message}
              </div>
            ) : null}

            {showThinking ? (
              <div
                className="mt-1 flex items-center gap-1 h-5"
                aria-label="thinking"
              >
                <span
                  className="size-2 rounded-full bg-muted-foreground/70 animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <span
                  className="size-2 rounded-full bg-muted-foreground/70 animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <span
                  className="size-2 rounded-full bg-muted-foreground/70 animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            ) : null}

            {children ? (
              <div
                className={
                  childrenFullWidth
                    ? `${childrenMarginTop} w-full`
                    : `${childrenMarginTop} max-w-[75%]`
                }
              >
                {children}
              </div>
            ) : null}
          </div>
        </div>
      ) : (
        <div
          className={
            "flex w-full items-start gap-2 " +
            (isRight ? "flex-row-reverse" : "flex-row")
          }
        >
          <Avatar>
            <AvatarImage src={avatarSrc} alt={role} />
            <AvatarFallback>
              {avatarFallback ?? (role === "user" ? "U" : "A")}
            </AvatarFallback>
          </Avatar>
          <div className={"flex-1 " + (className ?? "")}>
            {message ? (
              <div
                className={
                  (isRight
                    ? "ml-auto rounded-2xl rounded-br-sm bg-primary text-primary-foreground"
                    : "rounded-2xl rounded-bl-sm bg-muted text-foreground") +
                  " px-3 py-2 shadow max-w-[75%]"
                }
              >
                {message}
              </div>
            ) : null}

            {showThinking ? (
              <div
                className="mt-1 flex items-center gap-1 h-5"
                aria-label="thinking"
              >
                <span
                  className="size-2 rounded-full bg-muted-foreground/70 animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <span
                  className="size-2 rounded-full bg-muted-foreground/70 animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <span
                  className="size-2 rounded-full bg-muted-foreground/70 animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            ) : null}

            {children ? (
              <div
                className={
                  childrenFullWidth
                    ? "mt-3"
                    : isRight
                      ? "mt-3 ml-auto max-w-[75%]"
                      : "mt-3 max-w-[75%]"
                }
              >
                {children}
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatBox;

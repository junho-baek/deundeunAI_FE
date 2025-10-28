import React from "react";
import { cn } from "~/lib/utils";

type TypographyVariants =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "p"
  | "blockquote"
  | "table"
  | "ul"
  | "inlineCode"
  | "lead"
  | "large"
  | "small"
  | "muted";

type TypographyProps = {
  children: React.ReactNode;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
  variant?: TypographyVariants;
};

const styles: Record<TypographyVariants, string> = {
  h1: "scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance",
  h2: "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
  h3: "scroll-m-20 text-2xl font-semibold tracking-tight",
  h4: "scroll-m-20 text-xl font-semibold tracking-tight",
  p: "leading-7 [&:not(:first-child)]:mt-6",
  blockquote: "mt-6 border-l-2 pl-6 italic",
  table: "my-6 w-full overflow-y-auto",
  ul: "my-6 ml-6 list-disc [&>li]:mt-2",
  inlineCode:
    "bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
  lead: "text-muted-foreground text-xl",
  large: "text-lg font-semibold",
  small: "text-sm leading-none font-medium",
  muted: "text-muted-foreground text-sm",
};

const defaultTag: Record<
  TypographyVariants,
  keyof React.JSX.IntrinsicElements
> = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  p: "p",
  blockquote: "blockquote",
  table: "div", // wrapper only - internal table should be inside
  ul: "ul",
  inlineCode: "code",
  lead: "p",
  large: "div",
  small: "small",
  muted: "p",
};

export function Typography({
  children,
  className,
  as,
  variant = "p",
}: TypographyProps) {
  const Component = (as || defaultTag[variant]) as React.ElementType;

  return (
    <Component className={cn(styles[variant], className)}>{children}</Component>
  );
}

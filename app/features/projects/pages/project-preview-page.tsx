import type { MetaFunction } from "react-router";

export const meta: MetaFunction = () => {
  return [
    {
      title: "든든AI - 미리보기",
    },
  ];
};

export default function ProjectPreviewPage() {
  return (
    <div className="flex h-full items-center justify-center">
      <p className="text-muted-foreground">미리보기 페이지 (준비 중)</p>
    </div>
  );
}


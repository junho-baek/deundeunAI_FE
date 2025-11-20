import type { MetaFunction } from "react-router";

export const meta: MetaFunction = () => {
  return [
    {
      title: "든든AI - 실시간 분석",
    },
  ];
};

export default function ProjectRealtimePage() {
  return (
    <div className="flex h-full items-center justify-center">
      <p className="text-muted-foreground">실시간 분석 페이지 (준비 중)</p>
    </div>
  );
}


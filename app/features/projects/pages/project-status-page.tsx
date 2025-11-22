import type { MetaFunction, ActionFunctionArgs } from "react-router";
import { updateStepStatusAction } from "./project-status-action";

export const meta: MetaFunction = () => {
  return [
    {
      title: "든든AI - 프로젝트 상태",
    },
  ];
};

export const action = updateStepStatusAction;

export default function ProjectStatusPage() {
  return (
    <div className="flex h-full items-center justify-center">
      <p className="text-muted-foreground">프로젝트 상태 페이지 (준비 중)</p>
    </div>
  );
}


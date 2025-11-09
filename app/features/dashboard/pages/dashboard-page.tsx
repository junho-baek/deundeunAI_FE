import { type MetaFunction } from "react-router";

export const meta: MetaFunction = () => {
  return [
    {
      title: "든든AI - 대시보드",
    },
    {
      name: "description",
      content: "프로젝트 현황과 수익 지표를 한눈에 확인하세요.",
    },
  ];
};

export default function DashboardPage() {
  return <div></div>;
}

import { type MetaFunction } from "react-router";

export const meta: MetaFunction = () => {
  return [
    {
      title: "든든AI - 관리자 대시보드",
    },
    {
      name: "description",
      content: "시스템 현황과 사용자 활동을 모니터링하세요.",
    },
  ];
};

export default function AdminDashboardPage() {
  return (
    <section>
      <h2>관리자 대시보드</h2>
    </section>
  );
}



import { type MetaFunction } from "react-router";

export const meta: MetaFunction = () => {
  return [
    {
      title: "든든AI - 진행 상태",
    },
    {
      name: "description",
      content: "콘텐츠 제작 단계별 진행 상황과 완료 여부를 확인하세요.",
    },
  ];
};

export default function ProjectStatusPage() {
  return (
    <section>
      <h1>상태</h1>
    </section>
  );
}

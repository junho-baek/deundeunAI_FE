import { type MetaFunction } from "react-router";

export const meta: MetaFunction = () => {
  return [
    {
      title: "든든AI - 생성 진행",
    },
    {
      name: "description",
      content: "AI가 스크립트와 자산을 생성하는 과정을 실시간으로 확인하세요.",
    },
  ];
};

export default function ProjectGeneratePage() {
  return (
    <section>
      <h1>프로젝트 생성(Generate)</h1>
    </section>
  );
}



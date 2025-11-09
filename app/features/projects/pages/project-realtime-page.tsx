import { type MetaFunction } from "react-router";

export const meta: MetaFunction = () => {
  return [
    {
      title: "든든AI - 실시간 협업",
    },
    {
      name: "description",
      content:
        "팀원과 동시에 편집하고 AI 추천을 반영하는 실시간 워크스페이스입니다.",
    },
  ];
};

export default function ProjectRealtimePage() {
  return (
    <section>
      <h1>실시간 협업</h1>
    </section>
  );
}

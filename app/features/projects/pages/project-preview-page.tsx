import { type MetaFunction } from "react-router";

export const meta: MetaFunction = () => {
  return [
    {
      title: "든든AI - 미리보기",
    },
    {
      name: "description",
      content: "생성된 영상과 자막을 게시 전에 검토하세요.",
    },
  ];
};

export default function ProjectPreviewPage() {
  return (
    <section>
      <h1>미리보기</h1>
    </section>
  );
}



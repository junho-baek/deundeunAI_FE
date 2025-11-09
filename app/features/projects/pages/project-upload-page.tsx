import { type MetaFunction } from "react-router";

export const meta: MetaFunction = () => {
  return [
    {
      title: "든든AI - 업로드",
    },
    {
      name: "description",
      content: "연결된 채널로 예약 업로드를 설정하고 배포 상태를 확인하세요.",
    },
  ];
};

export default function ProjectUploadPage() {
  return (
    <section>
      <h1>업로드</h1>
    </section>
  );
}

import { type MetaFunction } from "react-router";

export const meta: MetaFunction = () => {
  return [
    {
      title: "든든AI - 프로필 설정",
    },
    {
      name: "description",
      content: "계정 정보와 알림 설정을 관리하세요.",
    },
  ];
};

export default function ProfilePage() {
  return (
    <section>
      <h1>프로필 설정</h1>
    </section>
  );
}



import { type MetaFunction, useNavigate } from "react-router";
import { ShortsHero } from "~/common/components/shorts-hero";

export const meta: MetaFunction = () => {
  return [
    {
      title: "든든AI - 쇼츠 제작",
    },
    {
      name: "description",
      content:
        "아이디어를 입력하면 자동으로 쇼츠 스크립트와 자산을 생성하는 체험을 시작하세요.",
    },
  ];
};

export default function ShortsCreatePage() {
  const navigate = useNavigate();

  return (
    <section className="min-h-screen w-screen bg-background text-foreground">
      <div className="px-20 space-y-40 min-w-[400px]">
        <ShortsHero
          onSubmit={() => navigate("/my/dashboard/project/create")}
          className="mt-20"
        />
      </div>
    </section>
  );
}

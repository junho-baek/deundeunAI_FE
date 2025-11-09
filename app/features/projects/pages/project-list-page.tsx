import { type MetaFunction } from "react-router";

import ProjectCard from "~/features/projects/components/project-card";

export const meta: MetaFunction = () => {
  return [
    {
      title: "든든AI - 프로젝트 목록",
    },
    {
      name: "description",
      content:
        "진행 중인 프로젝트와 자동화 성과를 확인하고 새 프로젝트를 시작하세요.",
    },
  ];
};

export default function ProjectListPage() {
  const items = [
    {
      id: 1,
      title: "Perfume Aspirational Lifestyle Montage",
      description: "인플루언서의 썰",
      likes: "2K",
      ctr: "Top7%",
      budget: "High",
      // 샘플 썸네일: 단색 배경으로 대체
      thumbnail: "https://youtube.com/shorts/GoGJ_ckzxvY?si=M4XLs-gXbSP7cGet",
    },
    {
      id: 2,
      title: "Perfume Cinematic Brand Story",
      description: "9:16 Video • TikTok",
      likes: "33K",
      ctr: "Top12%",
      budget: "High",
      thumbnail: "https://www.youtube.com/shorts/0Va3HYWMlz8",
    },
    {
      id: 3,
      title: "Perfume Cinematic Brand Story",
      description: "9:16 Video • TikTok",
      likes: "33K",
      ctr: "Top12%",
      budget: "High",
      thumbnail: "https://youtube.com/shorts/54g2JQ15GYg",
    },
    {
      id: 2,
      title: "Perfume Cinematic Brand Story",
      description: "9:16 Video • TikTok",
      likes: "33K",
      ctr: "Top12%",
      budget: "High",
      thumbnail: "https://www.tiktok.com/@mukguna/video/7566270993438608647",
    },
    {
      id: 2,
      title: "Perfume Cinematic Brand Story",
      description: "9:16 Video • TikTok",
      likes: "33K",
      ctr: "Top12%",
      budget: "High",
      thumbnail: undefined as string | undefined,
    },
  ];
  return (
    <section>
      <h1>프로젝트 목록</h1>

      <div className="mt-8 grid gap-6 justify-start grid-cols-[repeat(auto-fit,minmax(220px,220px))]">
        <ProjectCard
          key="create"
          id="create"
          to="/my/dashboard/project/create"
          title="새 프로젝트 생성하기"
          description="빈 카드로 시작하거나 템플릿으로 만들기"
          isCreate
          ctaText="프로젝트 생성하기 →"
        />
        {items.map((item, idx) => (
          <ProjectCard
            key={`${item.id}-${idx}`}
            id={item.id}
            to={`/my/dashboard/project/${item.id}/analytics`}
            title={item.title}
            description={item.description}
            likes={item.likes}
            ctr={item.ctr}
            budget={item.budget}
            thumbnail={item.thumbnail}
          />
        ))}
      </div>
    </section>
  );
}

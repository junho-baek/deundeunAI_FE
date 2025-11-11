import { type MetaFunction } from "react-router";

import { Typography } from "~/common/components/typography";
import {
  ProfilePlanActivityCard,
  ProfileSummaryCard,
  ProfileProjectsSection,
  WorkspacePreferencesCard,
  type ProfilePlanActivityStat,
  type WorkspacePreferenceItem,
} from "~/features/users/components/profile-sections";
import type { ProjectCardProps } from "~/features/projects/components/project-card";

const profileSummary = {
  name: "이은재",
  role: "Founder / Creator",
  email: "founder@deundeun.ai",
  company: "든든 퍼퓸 스튜디오",
  timezone: "Asia/Seoul (GMT+9)",
  joinedAt: "2025.02.14",
  bio: "향수 브랜드를 위한 숏폼 캠페인을 직접 제작하고, 든든AI 자동화를 활용해 전환 최적화를 진행하고 있어요.",
  avatarUrl: "https://i.pravatar.cc/160?img=12",
};

const workspacePreferences = [
  {
    title: "알림 요약 리포트",
    description: "매주 월요일 오전 9시에 이메일로 자동 발송돼요.",
    cta: "알림 관리",
  },
  {
    title: "공동 작업 공간",
    description: "마케터 2명, 크리에이터 1명 초대됨 · 액세스 권한 편집 가능",
    cta: "팀원 관리",
  },
  {
    title: "연결된 채널",
    description: "TikTok • YouTube Shorts • Instagram Reels",
    cta: "채널 연동",
  },
] as const;

const profileStats: ProfilePlanActivityStat[] = [
  {
    label: "총 제작 프로젝트",
    value: "12개",
    helper: "지난 30일 +3",
  },
  {
    label: "활성 캠페인",
    value: "4개",
    helper: "자동화 스케줄 3건",
  },
  {
    label: "베스트 CTR",
    value: "Top5%",
    helper: "수익 보장형 프리셋",
  },
];

const preferenceItems: WorkspacePreferenceItem[] = workspacePreferences.map(
  (item) => ({
    title: item.title,
    description: item.description,
    ctaLabel: item.cta,
  })
);

const myProjects: ProjectCardProps[] = [
  {
    id: "1",
    to: "/my/dashboard/project/1/analytics",
    title: "Perfume Cinematic Brand Story",
    description: "9:16 Video • TikTok",
    likes: "33K",
    ctr: "Top12%",
    budget: "High",
    thumbnail: "https://www.youtube.com/shorts/0Va3HYWMlz8",
  },
  {
    id: "2",
    to: "/my/dashboard/project/2/analytics",
    title: "Perfume Aspirational Lifestyle Montage",
    description: "인플루언서의 썰",
    likes: "2K",
    ctr: "Top7%",
    budget: "High",
    thumbnail: "https://youtube.com/shorts/GoGJ_ckzxvY?si=M4XLs-gXbSP7cGet",
  },
  {
    id: "3",
    to: "/my/dashboard/project/3/analytics",
    title: "향수 신제품 UGC 리뷰",
    description: "UGC | 구매 전환 최적화",
    likes: "4.6K",
    ctr: "Top9%",
    budget: "Mid",
    thumbnail: "https://www.tiktok.com/@mukguna/video/7566270993438608647",
  },
  {
    id: "4",
    to: "/my/dashboard/project/4/analytics",
    title: "프리미엄 라인 리타겟팅 숏폼",
    description: "Meta Ads • 수익 보장형 프리셋",
    likes: "7.8K",
    ctr: "Top6%",
    budget: "Mid",
    thumbnail: "https://www.youtube.com/shorts/54g2JQ15GYg",
  },
] as const;

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
    <section className="mx-auto flex h-full min-h-0 w-full max-w-6xl flex-col overflow-hidden">
      <div className="flex-1 min-h-0 overflow-y-auto px-6 py-8 md:px-10">
        <div className="flex flex-col gap-8 pb-12">
          <header className="flex flex-col gap-3">
            <Typography
              as="h1"
              variant="h3"
              className="text-balance text-3xl font-semibold leading-tight text-foreground md:text-4xl"
            >
              프로필 & 작업 공간 설정
            </Typography>
            <Typography
              as="p"
              variant="lead"
              className="max-w-2xl text-base text-muted-foreground md:text-lg"
            >
              제작한 프로젝트와 연결된 계정 정보를 한 곳에서 관리하세요. 계정
              설정이 바뀌면 프로젝트 자동화 흐름에도 즉시 반영됩니다.
            </Typography>
          </header>

          <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
            <ProfileSummaryCard
              className="lg:sticky lg:top-6"
              cardTitle="계정 정보"
              cardDescription="본인 확인과 프로젝트 접근 권한에 활용돼요."
              name={profileSummary.name}
              role={profileSummary.role}
              company={profileSummary.company}
              email={profileSummary.email}
              timezone={profileSummary.timezone}
              joinedAt={profileSummary.joinedAt}
              bio={profileSummary.bio}
              avatarUrl={profileSummary.avatarUrl}
              avatarFallback="이은"
            />

            <div className="flex flex-col gap-6">
              <ProfilePlanActivityCard
                cardTitle="플랜 & 활동 요약"
                cardDescription="프로젝트 자동화와 수익 보장형 프리셋 사용 현황입니다."
                stats={profileStats}
                planLabel="현재 플랜 · Growth 50K"
                planDescription="수익 보장형 프리셋 20회/월, 자동 리포트 5좌석, API 100K 콜이 포함돼요."
                nextBillingPrefix="다음 청구일은"
                nextBillingDate="2025.11.28"
                nextBillingSuffix=" 입니다. 플랜을 변경하면 즉시 과금 정책이 업데이트돼요."
              />

              <WorkspacePreferencesCard
                cardTitle="워크스페이스 & 알림"
                cardDescription="프로젝트 자동화와 연동된 협업 정보를 확인하세요."
                items={preferenceItems}
              />
            </div>
          </div>

          <ProfileProjectsSection
            heading="내가 제작한 프로젝트"
            description="최근 30일 동안 제작하거나 업데이트한 프로젝트예요. 성과 요약과 프리셋 연결 상태를 한눈에 확인할 수 있어요."
            projects={myProjects}
            createProjectHref="/my/dashboard/project/create"
            createProjectTitle="새 프로젝트 시작하기"
            createProjectDescription="수익 보장형 프리셋으로 빠르게 시작하세요."
            createProjectCta="새 프로젝트 만들기"
          />
        </div>
      </div>
    </section>
  );
}



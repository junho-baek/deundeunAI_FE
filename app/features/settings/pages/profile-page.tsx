import { CheckCircle2, Mail, MapPin, Pencil } from "lucide-react";
import { type MetaFunction } from "react-router";

import { Button } from "~/common/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/common/components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/common/components/ui/avatar";
import { Separator } from "~/common/components/ui/separator";
import { Typography } from "~/common/components/typography";
import ProjectCard from "~/features/projects/components/project-card";

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

const profileStats = [
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
] as const;

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

const myProjects = [
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
            <Card className="h-fit lg:sticky lg:top-6">
              <CardHeader>
                <CardTitle>계정 정보</CardTitle>
                <CardDescription>
                  본인 확인과 프로젝트 접근 권한에 활용돼요.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-6">
                <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                  <Avatar className="size-16 border-2 border-primary/30">
                    <AvatarImage
                      src={profileSummary.avatarUrl}
                      alt={`${profileSummary.name} 아바타`}
                    />
                    <AvatarFallback>이은</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <p className="text-lg font-semibold text-foreground">
                      {profileSummary.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {profileSummary.role} · {profileSummary.company}
                    </p>
                  </div>
                </div>

                <p className="rounded-xl border border-dashed border-primary/30 bg-primary/5 px-4 py-3 text-sm text-muted-foreground">
                  {profileSummary.bio}
                </p>

                <dl className="grid gap-4 text-sm">
                  <div className="grid gap-1">
                    <dt className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="size-4" aria-hidden="true" />
                      이메일
                    </dt>
                    <dd className="font-medium text-foreground">
                      {profileSummary.email}
                    </dd>
                  </div>
                  <div className="grid gap-1">
                    <dt className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="size-4" aria-hidden="true" />
                      타임존
                    </dt>
                    <dd className="font-medium text-foreground">
                      {profileSummary.timezone}
                    </dd>
                  </div>
                  <div className="grid gap-1">
                    <dt className="text-muted-foreground">가입일</dt>
                    <dd className="font-medium text-foreground">
                      {profileSummary.joinedAt}
                    </dd>
                  </div>
                </dl>
              </CardContent>
              <CardFooter className="flex flex-wrap gap-3">
                <Button className="gap-2" size="sm">
                  <Pencil className="size-4" aria-hidden="true" />
                  프로필 편집
                </Button>
                <Button size="sm" variant="outline">
                  비밀번호 재설정
                </Button>
              </CardFooter>
            </Card>

            <div className="flex flex-col gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>플랜 & 활동 요약</CardTitle>
                  <CardDescription>
                    프로젝트 자동화와 수익 보장형 프리셋 사용 현황입니다.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-6">
                  <div className="grid gap-4 sm:grid-cols-3">
                    {profileStats.map((stat) => (
                      <div
                        key={stat.label}
                        className="rounded-2xl border bg-muted/30 px-4 py-3"
                      >
                        <p className="text-xs text-muted-foreground">
                          {stat.label}
                        </p>
                        <p className="mt-2 text-lg font-semibold text-foreground">
                          {stat.value}
                        </p>
                        <p className="text-xs text-emerald-600">
                          {stat.helper}
                        </p>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="space-y-3 text-sm text-muted-foreground">
                    <div className="flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
                      <CheckCircle2
                        className="mt-0.5 size-4 text-primary"
                        aria-hidden="true"
                      />
                      <div>
                        <p className="font-medium text-foreground">
                          현재 플랜 · Growth 50K
                        </p>
                        <p>
                          수익 보장형 프리셋 20회/월, 자동 리포트 5좌석, API
                          100K 콜이 포함돼요.
                        </p>
                      </div>
                    </div>
                    <p>
                      다음 청구일은{" "}
                      <span className="font-medium text-foreground">
                        2025.11.28
                      </span>
                      입니다. 플랜을 변경하면 즉시 과금 정책이 업데이트돼요.
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-wrap gap-3">
                  <Button size="sm" variant="outline" asChild>
                    <a href="/my/settings/billing">플랜 세부 정보 보기</a>
                  </Button>
                  <Button size="sm" variant="ghost">
                    AI 자동화 설정
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>워크스페이스 & 알림</CardTitle>
                  <CardDescription>
                    프로젝트 자동화와 연동된 협업 정보를 확인하세요.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  {workspacePreferences.map((item, index) => (
                    <div key={item.title}>
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {item.title}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {item.description}
                          </p>
                        </div>
                        <Button size="sm" variant="ghost">
                          {item.cta}
                        </Button>
                      </div>
                      {index < workspacePreferences.length - 1 ? (
                        <Separator className="my-4" />
                      ) : null}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>

          <section className="flex flex-col gap-4">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <Typography
                as="h2"
                variant="h3"
                className="text-2xl font-semibold leading-tight text-foreground"
              >
                내가 제작한 프로젝트
              </Typography>
              <Typography
                variant="muted"
                className="max-w-2xl text-sm md:text-base"
              >
                최근 30일 동안 제작하거나 업데이트한 프로젝트예요. 성과 요약과
                프리셋 연결 상태를 한눈에 확인할 수 있어요.
              </Typography>
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,220px))] justify-start gap-6">
              {myProjects.map((project, index) => (
                <ProjectCard
                  key={`${project.id}-${index}`}
                  id={project.id}
                  to={project.to}
                  title={project.title}
                  description={project.description}
                  likes={project.likes}
                  ctr={project.ctr}
                  budget={project.budget}
                  thumbnail={project.thumbnail}
                />
              ))}
              <ProjectCard
                key="create-project"
                id="create"
                to="/my/dashboard/project/create"
                title="새 프로젝트 시작하기"
                description="수익 보장형 프리셋으로 빠르게 시작하세요."
                isCreate
                ctaText="새 프로젝트 만들기"
              />
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}

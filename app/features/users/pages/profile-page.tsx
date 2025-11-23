import { type MetaFunction, useLoaderData } from "react-router";

import { Typography } from "~/common/components/typography";
import {
  ProfilePlanActivityCard,
  ProfileSummaryCard,
  ProfileProjectsSection,
  WorkspacePreferencesCard,
  type ProfilePlanActivityStat,
} from "~/features/users/components/profile-sections";
import {
  getProfileSettingsData,
  type ProfileSettingsData,
} from "~/features/users/services/profile-settings-service";
import { CreditBalance } from "~/common/components/credit-balance";
import { makeSSRClient } from "~/lib/supa-client";
import { getCreditBalance, getUserById } from "~/features/users/queries";

const FALLBACK_PROFILE_DATA: ProfileSettingsData = {
  profileSummary: {
    name: "든든AI 사용자",
    role: "Creator",
    company: "든든 퍼퓸 스튜디오",
    email: "hello@ddeundeun.ai",
    timezone: "Asia/Seoul (GMT+09:00)",
    joinedAt: "가입일 정보가 곧 표시될 예정이에요.",
    bio: "프로필 정보를 설정하면 코칭과 자동화 추천이 더 정확해져요.",
    avatarUrl:
      "https://api.dicebear.com/7.x/initials/svg?seed=%EB%93%A0%EB%93%A0AI",
  },
  metrics: [
    {
      label: "최근 30일 신규 프로젝트",
      value: "0",
      helper: "첫 프로젝트를 만들면 여기에서 활동량을 볼 수 있어요.",
    },
    {
      label: "활성 프리셋 연결",
      value: "0",
      helper: "프리셋을 연결하면 자동화 추천이 강화돼요.",
    },
    {
      label: "월간 조회수",
      value: "0",
      helper: "프로젝트를 배포하면 성과 지표가 수집돼요.",
    },
  ],
  workspacePreferences: [
    {
      title: "알림 채널 연결",
      description: "이메일과 Slack을 연결해 자동화 알림을 받아보세요.",
      ctaLabel: "연결 예정",
    },
    {
      title: "프로젝트 협업 초대",
      description: "팀원을 초대해 프로젝트를 함께 관리할 수 있어요.",
      ctaLabel: "준비 중",
    },
  ],
  plan: {
    planName: null,
    priceLabel: null,
    renewalDate: null,
    renewalDateLabel: null,
    renewalNote: "청구 일정은 플랜이 활성화되면 표시돼요.",
    usageLabel: "아직 사용량 데이터가 없어요.",
    usageHighlightLabel: null,
    benefits: [],
  },
  projects: [],
};

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

export async function loader({ request }: { request: Request }) {
  try {
    const { client } = makeSSRClient(request);

    // 현재 로그인한 사용자의 프로필 ID 조회
    let profileId: string | undefined = undefined;
    try {
      const { getLoggedInProfileId } = await import("~/features/users/queries");
      profileId = await getLoggedInProfileId(client);
    } catch (error: any) {
      // 로그인하지 않은 경우 또는 Rate limit 에러인 경우 계속 진행
      if (error?.status === 429 || error?.code === "over_request_rate_limit") {
        console.error("Rate limit 도달 - 프로필 조회 건너뜀:", error);
      } else if (error && typeof error === "object" && "status" in error) {
        // redirect 에러는 무시 (로그인하지 않은 경우)
      } else {
        console.error("프로필 조회 실패:", error);
      }
    }

    // 현재 로그인한 사용자의 프로필 데이터 조회
    // profileId가 없으면 기본값 사용 (비로그인 사용자)
    const data = profileId
      ? await getProfileSettingsData(profileId)
      : FALLBACK_PROFILE_DATA;

    // 크레딧 잔액 조회
    let creditBalance = 0;
    if (profileId) {
      try {
        const balance = await getCreditBalance(client, profileId);
        creditBalance = balance ?? 0;
      } catch (error: any) {
        // Rate limit 에러인 경우 재시도하지 않도록 처리
        if (
          error?.status === 429 ||
          error?.code === "over_request_rate_limit"
        ) {
          console.error("Rate limit 도달 - 크레딧 잔액 조회 건너뜀:", error);
        } else {
          console.error("크레딧 잔액 조회 실패:", error);
        }
      }
    }

    return { data, creditBalance };
  } catch (error) {
    console.error("프로필 데이터 로딩 실패:", error);
    return { data: FALLBACK_PROFILE_DATA, creditBalance: 0 };
  }
}

export default function ProfilePage() {
  const { data, creditBalance } = useLoaderData<typeof loader>();
  const avatarFallback =
    (data.profileSummary.name ?? "").replace(/\s/g, "").slice(0, 2) || "DU";

  const planTitle = data.plan.planName
    ? `현재 플랜 · ${data.plan.planName}`
    : "현재 플랜";
  const planDescription = (() => {
    const parts = [
      data.plan.benefits.length > 0 ? data.plan.benefits.join(", ") : undefined,
      data.plan.usageLabel ?? undefined,
    ].filter(Boolean);
    return (
      parts.join(" · ") || "플랜 혜택을 설정하면 더 많은 추천을 받을 수 있어요."
    );
  })();
  const nextBillingDate =
    data.plan.renewalDateLabel ?? "청구 일정이 아직 설정되지 않았어요.";

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
              name={data.profileSummary.name}
              role={data.profileSummary.role}
              company={data.profileSummary.company}
              email={data.profileSummary.email}
              timezone={data.profileSummary.timezone}
              joinedAt={data.profileSummary.joinedAt}
              bio={data.profileSummary.bio}
              avatarUrl={data.profileSummary.avatarUrl}
              avatarFallback={avatarFallback}
            />

            <div className="flex flex-col gap-6">
              <CreditBalance
                currentBalance={creditBalance}
                showRechargeButton={true}
              />
              <ProfilePlanActivityCard
                cardTitle="플랜 & 활동 요약"
                cardDescription="프로젝트 자동화와 수익 보장형 프리셋 사용 현황입니다."
                stats={data.metrics as ProfilePlanActivityStat[]}
                planLabel={planTitle}
                planDescription={planDescription}
                nextBillingPrefix="다음 청구일은"
                nextBillingDate={nextBillingDate}
                nextBillingSuffix=" 입니다. 플랜을 변경하면 즉시 과금 정책이 업데이트돼요."
              />

              <WorkspacePreferencesCard
                cardTitle="워크스페이스 & 알림"
                cardDescription="프로젝트 자동화와 연동된 협업 정보를 확인하세요."
                items={data.workspacePreferences.map((item) => ({
                  title: item.title,
                  description: item.description,
                  ctaLabel: item.ctaLabel,
                }))}
              />
            </div>
          </div>

          <ProfileProjectsSection
            heading="내가 제작한 프로젝트"
            description="최근 30일 동안 제작하거나 업데이트한 프로젝트예요. 성과 요약과 프리셋 연결 상태를 한눈에 확인할 수 있어요."
            projects={data.projects.map((project) => ({
              ...project,
              thumbnail: project.thumbnail ?? undefined,
            }))}
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

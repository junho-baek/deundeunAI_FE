import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
  useLoaderData,
} from "react-router";

import { Typography } from "~/common/components/typography";
import {
  ProfilePlanActivityCard,
  ProfileSummaryCard,
  ProfileProjectsSection,
  WorkspacePreferencesCard,
  type ProfilePlanActivityStat,
} from "~/features/users/components/profile-sections";
import { DEFAULT_PROFILE_ID } from "~/features/users/services/constants";
import {
  type ProfileSettingsData,
  getProfileSettingsData,
} from "~/features/users/services/profile-settings-service";

export async function loader({}: LoaderFunctionArgs) {
  const data = await getProfileSettingsData(DEFAULT_PROFILE_ID);
  return json(data satisfies ProfileSettingsData);
}

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
  const data = useLoaderData<typeof loader>();
  const avatarFallback =
    (data.profileSummary.name ?? "")
      .replace(/\s/g, "")
      .slice(0, 2) || "DU";

  const planTitle = data.plan.planName
    ? `현재 플랜 · ${data.plan.planName}`
    : "현재 플랜";
  const planDescription = (() => {
    const parts = [
      data.plan.benefits.length > 0
        ? data.plan.benefits.join(", ")
        : undefined,
      data.plan.usageLabel ?? undefined,
    ].filter(Boolean);
    return (
      parts.join(" · ") ||
      "플랜 혜택을 설정하면 더 많은 추천을 받을 수 있어요."
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
              <ProfilePlanActivityCard
                cardTitle="플랜 & 활동 요약"
                cardDescription="프로젝트 자동화와 수익 보장형 프리셋 사용 현황입니다."
                stats={data.metrics as ProfilePlanActivityStat[]}
                planLabel={planTitle}
                planDescription={planDescription}
                nextBillingPrefix="다음 청구일은"
                nextBillingDate={nextBillingDate}
                nextBillingSuffix=" 입니다. 플랜을 변경하면 즉시 과금 정책이 업데이트돼요."
                usageHighlightLabel={data.plan.usageHighlightLabel ?? undefined}
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
            projects={data.projects}
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



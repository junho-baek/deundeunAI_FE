import { desc, eq } from "drizzle-orm";

import db from "~/db";
import {
  profileActivityMetrics,
  profileWorkspacePreferences,
  profiles,
} from "~/features/users/schema";
import { projects } from "~/features/projects/schema";
import { formatBudgetLabel, formatCount, formatDateLabel, formatPercent, formatTimezoneLabel } from "~/lib/format";
import { DEFAULT_PROFILE_ID } from "./constants";
import { getPlanOverview } from "./plan-service";
import { getProjectRouteByStatus } from "~/features/projects/utils/navigation";

type ProfileSummary = {
  name: string;
  role: string;
  company: string;
  email: string;
  timezone: string;
  joinedAt: string;
  bio: string;
  avatarUrl: string;
};

type ProfileWorkspaceItem = {
  title: string;
  description: string;
  ctaLabel: string;
};

type ProfileMetric = {
  label: string;
  value: string;
  helper?: string | null;
};

type ProfileProjectCard = {
  id: string;
  to: string;
  title: string;
  description: string;
  likes: string;
  ctr: string;
  budget: string;
  thumbnail?: string | null;
  status?: string | null;
};

export type ProfileSettingsData = {
  profileSummary: ProfileSummary;
  metrics: ProfileMetric[];
  workspacePreferences: ProfileWorkspaceItem[];
  plan: Awaited<ReturnType<typeof getPlanOverview>>;
  projects: ProfileProjectCard[];
};

function fallbackProfileSummary(): ProfileSummary {
  return {
    name: "든든AI 사용자",
    role: "Creator",
    company: "든든AI",
    email: "hello@ddeundeun.ai",
    timezone: "Asia/Seoul (GMT+09:00)",
    joinedAt: "",
    bio: "프로필 정보를 설정하면 코칭과 자동화 추천이 더 정확해져요.",
    avatarUrl:
      "https://api.dicebear.com/7.x/initials/svg?seed=%EB%93%A0%EB%93%A0AI",
  };
}

function getAvatarUrl(name: string | null | undefined, avatarUrl?: string | null) {
  if (avatarUrl) return avatarUrl;
  const seed = encodeURIComponent(name ?? "ddeundeun");
  return `https://api.dicebear.com/7.x/initials/svg?seed=${seed}`;
}

function formatProjectDescription(
  description: string | null,
  visibility: string | null
) {
  if (description) return description;
  switch (visibility) {
    case "public":
      return "공개 프로젝트";
    case "team":
      return "팀 공유 프로젝트";
    default:
      return "개인 프로젝트";
  }
}

export async function getProfileSettingsData(
  profileId: string = DEFAULT_PROFILE_ID
): Promise<ProfileSettingsData> {
  const [profileRecord] = await db
    .select({
      name: profiles.name,
      role: profiles.role,
      company: profiles.company,
      email: profiles.email,
      timezone: profiles.timezone,
      joinedAt: profiles.joinedAt,
      bio: profiles.bio,
      avatarUrl: profiles.avatarUrl,
    })
    .from(profiles)
    .where(eq(profiles.id, profileId))
    .limit(1);

  const profileSummary = profileRecord
    ? {
        name: profileRecord.name ?? fallbackProfileSummary().name,
        role: profileRecord.role ?? "Creator",
        company: profileRecord.company ?? "든든 퍼퓸 스튜디오",
        email: profileRecord.email ?? "hello@ddeundeun.ai",
        timezone: formatTimezoneLabel(profileRecord.timezone),
        joinedAt: formatDateLabel(profileRecord.joinedAt),
        bio:
          profileRecord.bio ??
          "프로필 정보를 설정하면 코칭과 자동화 추천이 더 정확해져요.",
        avatarUrl: getAvatarUrl(profileRecord.name, profileRecord.avatarUrl),
      }
    : fallbackProfileSummary();

  const metrics = await db
    .select({
      label: profileActivityMetrics.label,
      value: profileActivityMetrics.value,
      helper: profileActivityMetrics.helper,
    })
    .from(profileActivityMetrics)
    .where(eq(profileActivityMetrics.profileId, profileId))
    .orderBy(profileActivityMetrics.order, profileActivityMetrics.createdAt);

  const workspacePreferencesRecords = await db
    .select({
      title: profileWorkspacePreferences.title,
      description: profileWorkspacePreferences.description,
      ctaLabel: profileWorkspacePreferences.ctaLabel,
      enabled: profileWorkspacePreferences.enabled,
    })
    .from(profileWorkspacePreferences)
    .where(eq(profileWorkspacePreferences.profileId, profileId))
    .orderBy(profileWorkspacePreferences.order);

  const projectsRecords = await db
    .select({
      id: projects.id,
      projectId: projects.projectId,
      title: projects.title,
      description: projects.description,
      likes: projects.likes,
      ctr: projects.ctr,
      budget: projects.budget,
      thumbnail: projects.thumbnail,
      visibility: projects.visibility,
      status: projects.status,
    })
    .from(projects)
    .where(eq(projects.ownerProfileId, profileId))
    .orderBy(desc(projects.createdAt))
    .limit(4);

  const plan = await getPlanOverview(profileId);

  return {
    profileSummary,
    metrics: metrics.map((metric) => ({
      label: metric.label,
      value: metric.value,
      helper: metric.helper,
    })),
    workspacePreferences: workspacePreferencesRecords
      .filter((item) => item.enabled)
      .map((item) => ({
        title: item.title,
        description: item.description ?? "",
        ctaLabel: item.ctaLabel ?? "설정하기",
      })),
    plan,
    projects: projectsRecords.map((project) => {
      const projectIdString =
        project.projectId ?? String(project.id ?? "");

      return {
        id: projectIdString,
        to: getProjectRouteByStatus(projectIdString, project.status),
        title: project.title,
        description: formatProjectDescription(
          project.description,
          project.visibility
        ),
        likes: formatCount(project.likes),
        ctr: formatPercent(project.ctr),
        budget: formatBudgetLabel(project.budget),
        thumbnail: project.thumbnail,
        status: project.status,
      };
    }),
  };
}

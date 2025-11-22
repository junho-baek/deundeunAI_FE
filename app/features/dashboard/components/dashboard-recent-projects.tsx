import { Suspense } from "react";
import { Await } from "react-router";
import { DashboardSection } from "./dashboard-section";
import { DashboardProjectGrid } from "./dashboard-project-grid";
import ProjectCard from "~/features/projects/components/project-card";

export type ProjectData = {
  project_id: string;
  title: string;
  description?: string | null;
  likes: number;
  ctr: number | null;
  budget: number | null;
  thumbnail?: string | null;
};

export type DashboardRecentProjectsProps = {
  title?: string;
  description?: string;
  recentProjects: Promise<ProjectData[]>;
  formatNumber: (num: number) => string;
  formatCTR: (ctr: number | null | undefined) => string | undefined;
  formatBudget: (budget: number | null | undefined) => string | undefined;
  getProjectUrl: (projectId: string) => string;
  emptyMessage?: string;
  className?: string;
};

function ProjectListSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="h-64 w-full animate-pulse rounded-lg bg-muted"
        />
      ))}
    </div>
  );
}

export function DashboardRecentProjects({
  title = "최근 실행한 프로젝트",
  description = "본인이 직접 제작한 프로젝트 중 최근 14일 안에 업데이트된 캠페인이에요.",
  recentProjects,
  formatNumber,
  formatCTR,
  formatBudget,
  getProjectUrl,
  emptyMessage = "최근 프로젝트가 없습니다. 새 프로젝트를 생성해보세요.",
  className,
}: DashboardRecentProjectsProps) {
  return (
    <DashboardSection
      title={title}
      description={description}
      className={`flex flex-col gap-4 ${className ?? ""}`}
    >
      <Suspense fallback={<ProjectListSkeleton />}>
        <Await resolve={recentProjects}>
          {(resolvedProjects) => (
            <DashboardProjectGrid
              items={resolvedProjects ?? []}
              renderItem={(project) => (
                <ProjectCard
                  key={project.project_id}
                  id={project.project_id}
                  to={getProjectUrl(project.project_id)}
                  title={project.title}
                  description={project.description || undefined}
                  likes={formatNumber(project.likes)}
                  ctr={formatCTR(project.ctr)}
                  budget={formatBudget(project.budget)}
                  thumbnail={project.thumbnail || undefined}
                />
              )}
              emptyMessage={emptyMessage}
            />
          )}
        </Await>
      </Suspense>
    </DashboardSection>
  );
}


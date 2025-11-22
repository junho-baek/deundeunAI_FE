import ProjectCard from "~/features/projects/components/project-card";
import { getUserProjects } from "../queries";
import type { Route } from "./+types/public-profile-projects-page";

export async function loader({ params }: Route.LoaderArgs) {
  const projects = await getUserProjects(params.username);
  return { projects };
}

function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined) return "0";
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toString();
}

function formatCTR(value: number | null | undefined): string {
  if (value === null || value === undefined) return "-";
  return `${(value * 100).toFixed(1)}%`;
}

function formatBudget(value: number | null | undefined): string {
  if (value === null || value === undefined) return "-";
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toString();
}

export default function PublicProfileProjectsPage({
  loaderData,
}: Route.ComponentProps) {
  const { projects } = loaderData;

  return (
    <div className="flex flex-col gap-5">
      {projects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">아직 공개된 프로젝트가 없습니다.</p>
        </div>
      ) : (
        projects.map((project: any) => {
          return (
            <ProjectCard
              key={project.project_id || project.id}
              id={project.project_id || project.id}
              to={`/my/dashboard/project/${project.project_id || project.id}/analytics`}
              title={project.title}
              description={project.description || undefined}
              likes={formatNumber(project.likes)}
              ctr={formatCTR(project.ctr)}
              budget={formatBudget(project.budget)}
              thumbnail={project.thumbnail || undefined}
            />
          );
        })
      )}
    </div>
  );
}


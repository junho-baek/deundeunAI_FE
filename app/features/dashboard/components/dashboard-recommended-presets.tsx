import { DashboardSection } from "./dashboard-section";
import { DashboardProjectGrid } from "./dashboard-project-grid";
import ProjectCard from "~/features/projects/components/project-card";

export type PresetProject = {
  id: string;
  to: string;
  title: string;
  description: string;
  likes: string;
  ctr: string;
  budget: string;
  thumbnail: string;
};

export type DashboardRecommendedPresetsProps = {
  title?: string;
  description?: string;
  items: PresetProject[];
  className?: string;
};

export function DashboardRecommendedPresets({
  title = "이번 주 추천 프리셋",
  description = "든든AI가 최근 실험 로그와 광고 효율 데이터를 분석해 가장 높은 ROAS를 만든 프리셋을 골랐어요.",
  items,
  className,
}: DashboardRecommendedPresetsProps) {
  return (
    <DashboardSection
      title={title}
      description={description}
      className={`flex flex-col gap-4 ${className ?? ""}`}
    >
      <DashboardProjectGrid
        items={items}
        renderItem={(preset, index) => (
          <ProjectCard
            key={`${preset.id}-${index}`}
            id={preset.id}
            to={preset.to}
            title={preset.title}
            description={preset.description}
            likes={preset.likes}
            ctr={preset.ctr}
            budget={preset.budget}
            thumbnail={preset.thumbnail}
          />
        )}
      />
    </DashboardSection>
  );
}


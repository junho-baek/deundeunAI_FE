-- 프로젝트 통계 View
-- 프로젝트 통계 데이터를 집계하여 조회
CREATE VIEW project_stats_view AS
SELECT
  COALESCE(SUM(projects.likes), 0) AS total_likes,
  COALESCE(SUM(projects.views), 0) AS total_views,
  COALESCE(AVG(projects.ctr), 0) AS average_ctr,
  COALESCE(SUM(projects.budget), 0) AS total_budget,
  COUNT(projects.project_id) AS project_count
FROM projects;


-- 프로젝트 목록 View
-- 프로젝트와 소유자 프로필 정보를 평탄화하여 조회
CREATE VIEW project_list_view AS
SELECT
  projects.project_id,
  projects.id,
  projects.owner_profile_id,
  projects.title,
  projects.description,
  projects.thumbnail,
  projects.likes,
  projects.views,
  projects.ctr,
  projects.budget,
  projects.status,
  projects.visibility,
  projects.created_at,
  projects.updated_at,
  profiles.name AS owner_name,
  profiles.avatar_url AS owner_avatar_url,
  profiles.email AS owner_email
FROM projects
LEFT JOIN profiles ON projects.owner_profile_id = profiles.id;


-- 대시보드 메트릭 위젯 View
-- 메트릭 타입 위젯만 필터링하여 조회
CREATE VIEW dashboard_widget_metric_view AS
SELECT
  widget_id,
  profile_id,
  widget_key,
  title,
  position,
  size,
  config,
  is_pinned,
  created_at,
  updated_at
FROM dashboard_widgets
WHERE widget_key = 'metric'
ORDER BY position ASC;


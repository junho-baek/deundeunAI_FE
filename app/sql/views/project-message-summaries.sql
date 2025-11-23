CREATE OR REPLACE VIEW project_message_summaries AS
SELECT
  p.project_id AS project_uuid,
  p.id AS project_serial_id,
  p.title,
  p.owner_profile_id,
  COUNT(pm.message_id) AS message_count,
  (
    SELECT pm2.content
    FROM project_messages pm2
    WHERE pm2.project_id = p.id
    ORDER BY pm2.created_at DESC
    LIMIT 1
  ) AS last_message_content,
  (
    SELECT pm2.role
    FROM project_messages pm2
    WHERE pm2.project_id = p.id
    ORDER BY pm2.created_at DESC
    LIMIT 1
  ) AS last_message_role,
  (
    SELECT pm2.created_at
    FROM project_messages pm2
    WHERE pm2.project_id = p.id
    ORDER BY pm2.created_at DESC
    LIMIT 1
  ) AS last_message_at
FROM projects p
LEFT JOIN project_messages pm ON pm.project_id = p.id
GROUP BY
  p.id,
  p.project_id,
  p.title,
  p.owner_profile_id;

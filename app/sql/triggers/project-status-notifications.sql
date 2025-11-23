-- Project status/step notification trigger
-- 프로젝트 단계 상태가 변경될 때 notifications 테이블에 레코드를 추가합니다.

CREATE OR REPLACE FUNCTION public.notify_project_step_status()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  project_record RECORD;
  project_uuid text;
  step_label text;
  cta_url text;
  notif_title text;
  notif_body text;
BEGIN
  -- 상태가 바뀌지 않았다면 skip
  IF TG_OP = 'UPDATE' AND NEW.status IS NOT DISTINCT FROM OLD.status THEN
    RETURN NEW;
  END IF;

  -- 프로젝트 정보 조회
  SELECT
    project_id,
    owner_profile_id,
    title
  INTO project_record
  FROM public.projects
  WHERE id = NEW.project_id;

  IF NOT FOUND OR project_record.owner_profile_id IS NULL THEN
    RETURN NEW;
  END IF;

  -- owner가 없으면 알림 생성 X
  project_uuid := project_record.project_id::text;
  step_label := pg_catalog.initcap(NEW.key::text);
  cta_url := format('/my/dashboard/project/%s', project_uuid);

  IF NEW.status = 'completed' THEN
    notif_title := format('%s 단계 완료', step_label);
    notif_body := format('"%s" 프로젝트의 %s 단계가 완료되었습니다.', project_record.title, step_label);
  ELSIF NEW.status = 'in_progress' THEN
    notif_title := format('%s 단계가 시작되었습니다', step_label);
    notif_body := format('"%s" 프로젝트에서 %s 단계가 진행 중입니다.', project_record.title, step_label);
  ELSE
    RETURN NEW;
  END IF;

  INSERT INTO public.notifications (
    profile_id,
    title,
    body,
    category,
    cta_label,
    cta_href,
    metadata
  )
  VALUES (
    project_record.owner_profile_id,
    notif_title,
    notif_body,
    'project_workflow',
    '워크스페이스 열기',
    cta_url,
    jsonb_build_object(
      'project_id', project_uuid,
      'project_title', project_record.title,
      'step_key', NEW.key,
      'status', NEW.status,
      'step_id', NEW.step_id
    )
  );

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS project_step_notification_trigger ON public.project_steps;
CREATE TRIGGER project_step_notification_trigger
AFTER UPDATE ON public.project_steps
FOR EACH ROW
WHEN (NEW.status IS DISTINCT FROM OLD.status)
EXECUTE FUNCTION public.notify_project_step_status();

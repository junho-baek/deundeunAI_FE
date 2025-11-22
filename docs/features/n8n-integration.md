# n8n 워크플로우 트리거 통합

## 개요

프로젝트가 생성되고 시작될 때 n8n 워크플로우를 자동으로 트리거하여 에이전트 워크플로우를 실행하는 방법을 설명합니다.

## 트리거 시점

프로젝트가 "시작"되는 시점은 다음과 같습니다:
1. **프로젝트 생성 완료**: `projects` 테이블에 새 프로젝트가 생성되고 초기 단계가 설정된 후
2. **첫 번째 단계 시작**: `project_steps` 테이블의 첫 번째 단계가 `in_progress` 상태로 변경될 때

## 구현 방법

### 방법 1: Supabase Database Trigger + HTTP Extension (권장)

Supabase Database Trigger에서 직접 n8n 웹훅을 호출하는 방법입니다.

#### 1.1 HTTP Extension 활성화

Supabase Dashboard에서 HTTP Extension을 활성화합니다:

```sql
-- Supabase SQL Editor에서 실행
CREATE EXTENSION IF NOT EXISTS http;
```

#### 1.2 Database Trigger 함수 생성

```sql
-- app/sql/triggers/project_start_trigger.sql

-- 프로젝트 생성 시 n8n 웹훅 호출
CREATE OR REPLACE FUNCTION public.trigger_n8n_project_start()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  webhook_url TEXT := current_setting('app.n8n_webhook_url', true);
  payload JSONB;
BEGIN
  -- n8n 웹훅 URL이 설정되어 있지 않으면 스킵
  IF webhook_url IS NULL OR webhook_url = '' THEN
    RETURN NEW;
  END IF;

  -- n8n에 전송할 페이로드 구성
  payload := jsonb_build_object(
    'event_type', 'project_started',
    'project_id', NEW.project_id,
    'project_title', NEW.title,
    'owner_profile_id', NEW.owner_profile_id,
    'status', NEW.status,
    'created_at', NEW.created_at,
    'metadata', COALESCE(NEW.metadata, '{}'::jsonb)
  );

  -- HTTP POST 요청으로 n8n 웹훅 호출 (비동기, 에러 무시)
  PERFORM net.http_post(
    url := webhook_url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json'
    ),
    body := payload::text
  );

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- 에러 발생 시에도 프로젝트 생성은 계속 진행
    RAISE WARNING 'n8n webhook 호출 실패: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Trigger 생성
DROP TRIGGER IF EXISTS project_start_n8n_trigger ON public.projects;
CREATE TRIGGER project_start_n8n_trigger
  AFTER INSERT ON public.projects
  FOR EACH ROW
  WHEN (NEW.status = 'draft' OR NEW.status = 'active')
  EXECUTE FUNCTION public.trigger_n8n_project_start();
```

#### 1.3 n8n 웹훅 URL 설정

Supabase Dashboard > Settings > Database > Custom Config에서 설정:

```sql
-- Supabase SQL Editor에서 실행
ALTER DATABASE postgres SET app.n8n_webhook_url = 'https://your-n8n-instance.com/webhook/project-start';
```

또는 환경 변수로 설정:
- Supabase Dashboard > Settings > API > Environment Variables
- `N8N_WEBHOOK_URL` 추가

### 방법 2: Application Level에서 직접 호출 (간단)

프로젝트 생성 후 application 코드에서 직접 n8n 웹훅을 호출하는 방법입니다.

#### 2.1 환경 변수 설정

`.env` 파일에 n8n 웹훅 URL 추가:

```env
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/project-start
```

#### 2.2 n8n 웹훅 호출 함수 생성

```typescript
// app/lib/n8n-webhook.ts

/**
 * n8n 웹훅 호출
 * @param eventType - 이벤트 타입
 * @param data - 전송할 데이터
 */
export async function triggerN8nWebhook(
  eventType: string,
  data: Record<string, unknown>
): Promise<void> {
  const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL || process.env.N8N_WEBHOOK_URL;

  if (!webhookUrl) {
    console.warn('n8n 웹훅 URL이 설정되지 않았습니다.');
    return;
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event_type: eventType,
        timestamp: new Date().toISOString(),
        ...data,
      }),
    });

    if (!response.ok) {
      console.error('n8n 웹훅 호출 실패:', response.statusText);
    }
  } catch (error) {
    // n8n 호출 실패가 프로젝트 생성 실패로 이어지지 않도록 에러를 무시
    console.error('n8n 웹훅 호출 중 에러:', error);
  }
}
```

#### 2.3 프로젝트 생성 시 호출

```typescript
// app/features/projects/pages/project-create-page.tsx

import { triggerN8nWebhook } from "~/lib/n8n-webhook";

export async function action({ request }: ActionFunctionArgs) {
  // ... 프로젝트 생성 로직 ...

  try {
    const project = await createProject(client, {
      // ... 프로젝트 데이터 ...
    });

    // 프로젝트 단계 초기화
    await createInitialProjectSteps(client, project.id);

    // n8n 워크플로우 트리거 (비동기, 에러 무시)
    triggerN8nWebhook('project_started', {
      project_id: project.project_id,
      project_title: project.title,
      owner_profile_id: project.owner_profile_id,
      status: project.status,
      created_at: project.created_at,
      metadata: project.metadata,
    }).catch(console.error);

    // ... 리다이렉트 ...
  } catch (error) {
    // ... 에러 처리 ...
  }
}
```

### 방법 3: 프로젝트 단계 상태 변경 시 트리거

첫 번째 단계가 시작될 때 트리거하는 방법입니다.

#### 3.1 Database Trigger 생성

```sql
-- app/sql/triggers/project_step_start_trigger.sql

-- 프로젝트 단계가 in_progress로 변경될 때 n8n 웹훅 호출
CREATE OR REPLACE FUNCTION public.trigger_n8n_project_step_start()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  webhook_url TEXT := current_setting('app.n8n_webhook_url', true);
  payload JSONB;
  is_first_step BOOLEAN;
BEGIN
  -- n8n 웹훅 URL이 설정되어 있지 않으면 스킵
  IF webhook_url IS NULL OR webhook_url = '' THEN
    RETURN NEW;
  END IF;

  -- 첫 번째 단계인지 확인 (order가 1인 단계)
  SELECT COUNT(*) = 1 INTO is_first_step
  FROM project_steps
  WHERE project_id = NEW.project_id
    AND "order" = 1
    AND step_id = NEW.step_id;

  -- 첫 번째 단계가 in_progress로 변경될 때만 트리거
  IF NOT (is_first_step AND NEW.status = 'in_progress' AND OLD.status != 'in_progress') THEN
    RETURN NEW;
  END IF;

  -- 프로젝트 정보 조회
  SELECT jsonb_build_object(
    'event_type', 'project_step_started',
    'project_id', p.project_id,
    'project_title', p.title,
    'step_key', NEW.key,
    'step_status', NEW.status,
    'owner_profile_id', p.owner_profile_id,
    'started_at', NEW.started_at
  )
  INTO payload
  FROM projects p
  WHERE p.id = NEW.project_id;

  -- HTTP POST 요청으로 n8n 웹훅 호출
  PERFORM net.http_post(
    url := webhook_url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json'
    ),
    body := payload::text
  );

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'n8n webhook 호출 실패: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Trigger 생성
DROP TRIGGER IF EXISTS project_step_start_n8n_trigger ON public.project_steps;
CREATE TRIGGER project_step_start_n8n_trigger
  AFTER UPDATE ON public.project_steps
  FOR EACH ROW
  WHEN (NEW.status = 'in_progress' AND OLD.status != 'in_progress')
  EXECUTE FUNCTION public.trigger_n8n_project_step_start();
```

## n8n 워크플로우 설정

### 1. Webhook 노드 생성

1. n8n에서 새 워크플로우 생성
2. **Webhook** 노드 추가
3. **HTTP Method**: POST
4. **Path**: `/webhook/project-start` (또는 원하는 경로)
5. **Response Mode**: Respond to Webhook
6. 웹훅 URL 복사 (예: `https://your-n8n-instance.com/webhook/project-start`)

### 2. 데이터 처리 노드 추가

Webhook 노드 다음에 다음 노드들을 추가할 수 있습니다:

- **Set** 노드: 데이터 변환 및 정리
- **Supabase** 노드: 프로젝트 정보 조회
- **Function** 노드: 비즈니스 로직 실행
- **HTTP Request** 노드: 외부 API 호출 (예: AI 서비스)

### 3. 예시 워크플로우

```
Webhook (POST)
  ↓
Set (데이터 정리)
  ↓
Supabase (프로젝트 상세 정보 조회)
  ↓
Function (프로젝트 분석 및 계획 생성)
  ↓
Supabase (프로젝트 단계 업데이트)
  ↓
HTTP Request (AI 서비스 호출)
  ↓
Supabase (결과 저장)
```

## 페이로드 구조

n8n으로 전송되는 페이로드 예시:

```json
{
  "event_type": "project_started",
  "project_id": "1161b818-e595-52de-aa27-49088de1bb03",
  "project_title": "테스트 프로젝트",
  "owner_profile_id": "user-profile-uuid",
  "status": "draft",
  "created_at": "2024-01-15T10:30:00Z",
  "metadata": {
    "keyword": "테스트 키워드",
    "aspectRatio": "9:16"
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## 보안 고려사항

1. **웹훅 URL 보안**: n8n 웹훅 URL을 환경 변수로 관리하고 공개하지 않도록 주의
2. **인증**: n8n 웹훅에 인증 토큰 추가 고려
3. **에러 처리**: n8n 호출 실패가 프로젝트 생성 실패로 이어지지 않도록 비동기 처리
4. **Rate Limiting**: n8n 인스턴스에 Rate Limiting 설정 고려

## 추천 방법

**방법 1 (Database Trigger)**을 권장합니다:
- ✅ 프로젝트 생성 로직과 분리되어 유지보수 용이
- ✅ 데이터베이스 레벨에서 보장되므로 안정적
- ✅ Application 코드 변경 최소화
- ⚠️ Supabase HTTP Extension 필요

**방법 2 (Application Level)**은 간단하지만:
- ✅ 구현이 간단
- ⚠️ Application 코드에 의존
- ⚠️ 프로젝트 생성 로직과 결합

## 마이그레이션

방법 1을 사용하는 경우 마이그레이션 파일 생성:

```bash
npm run db:generate
```

생성된 마이그레이션 파일에 트리거 SQL을 추가하고:

```bash
npm run db:migrate
```

## 테스트

1. 프로젝트 생성
2. Supabase Logs에서 HTTP 요청 확인
3. n8n 워크플로우 실행 로그 확인
4. 프로젝트 단계 상태 확인

## 참고

- [Supabase HTTP Extension](https://supabase.com/docs/guides/database/extensions/http)
- [n8n Webhook Documentation](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/)
- [Project Step Status Management](./project-post-strategy.md)


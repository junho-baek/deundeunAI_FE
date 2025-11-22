# 프로젝트 단계 상태 관리 전략

## 개요

프로젝트 ID 기반으로 각 단계(brief, script, narration, images, videos, final)의 상태를 POST하고 로드하는 전략입니다. 에이전트적인 느낌의 워크스페이스와 휴먼 인 더 루프(Human-in-the-loop) 프론트엔드를 지원하며, n8n과 Supabase를 통한 자동화 워크플로우와 연동됩니다.

## 아키텍처

```
┌─────────────────┐
│   Frontend      │
│  (React Router) │
└────────┬────────┘
         │
         │ POST /status
         │ GET /status (폴링)
         ▼
┌─────────────────┐
│   Supabase      │
│  project_steps  │
└────────┬────────┘
         │
         │ Webhook / Realtime
         ▼
┌─────────────────┐
│   n8n           │
│  Workflow       │
└────────┬────────┘
         │
         │ AI Agent Processing
         ▼
┌─────────────────┐
│   Backend       │
│  (AI Services)  │
└─────────────────┘
```

## 데이터베이스 스키마

### `project_steps` 테이블

```sql
CREATE TABLE project_steps (
  id SERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  step_id UUID DEFAULT gen_random_uuid() NOT NULL,
  key project_step_key NOT NULL, -- 'brief', 'script', 'narration', 'images', 'videos', 'final', 'distribution'
  status project_step_status DEFAULT 'pending' NOT NULL, -- 'pending', 'in_progress', 'blocked', 'completed'
  order INTEGER DEFAULT 0 NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(project_id, key)
);
```

### 단계 키 (project_step_key)

- `brief`: 수익형 콘텐츠 기획서
- `script`: 대본 작성
- `narration`: 나레이션 확인하기
- `images`: 생성된 이미지
- `videos`: 생성된 영상 확인하기
- `final`: 편집된 영상 확인 및 업로드
- `distribution`: 배포

### 상태 (project_step_status)

- `pending`: 대기 중
- `in_progress`: 진행 중
- `blocked`: 차단됨 (사용자 확인 필요)
- `completed`: 완료됨

## 구현된 기능

### 1. 쿼리 함수 (`app/features/projects/queries.ts`)

#### `getProjectSteps(projectId: string)`

프로젝트의 모든 단계 상태를 조회합니다.

```typescript
export async function getProjectSteps(projectId: string) {
  const project = await getProjectByProjectId(projectId);
  if (!project) {
    return [];
  }

  const { data, error } = await client
    .from("project_steps")
    .select("*")
    .eq("project_id", project.id)
    .order("order", { ascending: true });

  if (error) {
    console.error("프로젝트 단계 조회 실패:", error);
    return [];
  }

  return data ?? [];
}
```

#### `updateProjectStep(projectId, stepKey, status, metadata?)`

프로젝트 단계 상태를 업데이트합니다.

```typescript
export async function updateProjectStep(
  projectId: string,
  stepKey: "brief" | "script" | "narration" | "images" | "videos" | "final" | "distribution",
  status: "pending" | "in_progress" | "blocked" | "completed",
  metadata?: Record<string, unknown>
) {
  const project = await getProjectByProjectId(projectId);
  if (!project) {
    throw new Error("프로젝트를 찾을 수 없습니다.");
  }

  const updateData: {
    status: string;
    updated_at: string;
    started_at?: string | null;
    completed_at?: string | null;
    metadata?: Record<string, unknown>;
  } = {
    status,
    updated_at: new Date().toISOString(),
  };

  // 상태에 따라 started_at 또는 completed_at 설정
  if (status === "in_progress") {
    updateData.started_at = new Date().toISOString();
  }
  if (status === "completed") {
    updateData.completed_at = new Date().toISOString();
  }
  if (metadata) {
    updateData.metadata = metadata;
  }

  const { data, error } = await client
    .from("project_steps")
    .update(updateData)
    .eq("project_id", project.id)
    .eq("key", stepKey)
    .select()
    .single();

  if (error) {
    throw new Error(`프로젝트 단계 업데이트에 실패했습니다: ${error.message}`);
  }

  return data;
}
```

#### `createInitialProjectSteps(projectId: number)`

프로젝트 생성 시 초기 단계들을 자동으로 생성합니다.

```typescript
export async function createInitialProjectSteps(projectId: number) {
  const steps = [
    { key: "brief", order: 1 },
    { key: "script", order: 2 },
    { key: "narration", order: 3 },
    { key: "images", order: 4 },
    { key: "videos", order: 5 },
    { key: "final", order: 6 },
  ];

  const { data, error } = await client
    .from("project_steps")
    .insert(
      steps.map((step) => ({
        project_id: projectId,
        key: step.key,
        status: "pending",
        order: step.order,
      }))
    )
    .select();

  if (error) {
    throw new Error(`프로젝트 단계 생성에 실패했습니다: ${error.message}`);
  }

  return data ?? [];
}
```

### 2. Action 함수 (`app/features/projects/pages/project-status-action.tsx`)

프론트엔드에서 POST 요청으로 상태를 업데이트할 수 있습니다.

```typescript
export async function updateStepStatusAction({ request, params }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }

  const projectId = params.projectId;
  if (!projectId || projectId === "create") {
    return json({ error: "Invalid project ID" }, { status: 400 });
  }

  const formData = await request.formData();
  const stepKey = formData.get("stepKey") as string;
  const status = formData.get("status") as string;
  const metadataStr = formData.get("metadata");

  // 유효성 검사 및 업데이트
  const updatedStep = await updateProjectStep(
    projectId,
    stepKey as any,
    status as any,
    metadata ? JSON.parse(metadataStr as string) : undefined
  );

  return json({ success: true, step: updatedStep });
}
```

### 3. 상태 폴링 훅 (`app/features/projects/hooks/use-project-step-status.ts`)

프로젝트 단계 상태를 주기적으로 폴링하고 UI와 동기화합니다.

```typescript
export function useProjectStepStatus(
  projectId: string | undefined,
  options: {
    enabled?: boolean;
    interval?: number; // 기본값 3000ms
    onStatusChange?: (steps: StepStatusMap) => void;
  } = {}
) {
  const { enabled = true, interval = 3000, onStatusChange } = options;
  const [stepStatusMap, setStepStatusMap] = React.useState<StepStatusMap>({
    brief: "pending",
    script: "pending",
    narration: "pending",
    images: "pending",
    videos: "pending",
    final: "pending",
    distribution: "pending",
  });

  // 주기적으로 상태 조회
  React.useEffect(() => {
    if (!projectId || projectId === "create" || !enabled) {
      return;
    }

    const fetchSteps = async () => {
      const steps = await getProjectSteps(projectId);
      // 상태 맵 업데이트
      const newStatusMap = createStatusMap(steps);
      setStepStatusMap(newStatusMap);
      onStatusChange?.(newStatusMap);
    };

    fetchSteps();
    const pollInterval = setInterval(fetchSteps, interval);
    return () => clearInterval(pollInterval);
  }, [projectId, enabled, interval]);

  return {
    stepStatusMap,
    getStepLoading: (stepKey: ProjectStepKey) => stepStatusMap[stepKey] === "in_progress",
    getStepDone: (stepKey: ProjectStepKey) => stepStatusMap[stepKey] === "completed",
    updateStepStatus: (stepKey, status, metadata) => { /* ... */ },
  };
}
```

### 4. 레이아웃 통합 (`app/features/projects/layouts/project-detail-layout.tsx`)

프로젝트 상세 레이아웃에서 DB 상태와 UI 상태를 동기화합니다.

```typescript
function useProjectDetailState(loaderDataProp?: LoaderData | null) {
  const { projectId } = useParams();
  
  // 프로젝트 단계 상태 폴링
  const {
    getStepLoading,
    getStepDone,
    stepStatusMap,
  } = useProjectStepStatus(projectId, {
    enabled: !!projectId && projectId !== "create",
    interval: 3000,
  });

  // DB 상태와 수동 상태 병합
  const loading = React.useMemo<LoadingState>(() => ({
    brief: getStepLoading("brief"),
    script: getStepLoading("script"),
    narration: getStepLoading("narration"),
    images: getStepLoading("images"),
    videos: getStepLoading("videos"),
    final: getStepLoading("final"),
  }), [getStepLoading]);

  const done = React.useMemo<DoneState>(() => ({
    brief: getStepDone("brief"),
    script: getStepDone("script"),
    narration: getStepDone("narration"),
    images: getStepDone("images"),
    videos: getStepDone("videos"),
    final: getStepDone("final"),
  }), [getStepDone]);

  return {
    loading,
    done,
    // ...
  };
}
```

## n8n 워크플로우 연동

### 1. Supabase Webhook 설정

n8n에서 Supabase의 `project_steps` 테이블 변경을 감지하는 웹훅을 설정합니다.

#### Supabase Database Webhook

1. Supabase Dashboard → Database → Webhooks
2. 새 Webhook 생성:
   - **Name**: `project_step_status_change`
   - **Table**: `project_steps`
   - **Events**: `INSERT`, `UPDATE`
   - **HTTP Request**: POST to n8n webhook URL

#### n8n Webhook 노드

```json
{
  "name": "Supabase Webhook",
  "type": "n8n-nodes-base.webhook",
  "parameters": {
    "path": "project-step-status",
    "httpMethod": "POST",
    "responseMode": "responseNode"
  }
}
```

### 2. n8n 워크플로우 예시

#### 워크플로우: 프로젝트 단계별 AI 처리

```
┌─────────────────┐
│  Webhook        │ ← Supabase에서 project_steps 변경 감지
│  (Trigger)      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  IF Node        │ ← status === 'in_progress' 체크
│  (Filter)       │
└────────┬────────┘
         │
         ├─ YES ──┐
         │        ▼
         │  ┌─────────────────┐
         │  │  Function Node  │ ← stepKey에 따라 분기
         │  │  (Router)        │
         │  └────────┬─────────┘
         │           │
         │           ├─ brief ──┐
         │           │           ▼
         │           │      ┌─────────────────┐
         │           │      │  OpenAI Node    │ ← 기획서 생성
         │           │      │  (GPT-4)        │
         │           │      └────────┬─────────┘
         │           │               │
         │           ├─ script ──┐   │
         │           │           ▼   │
         │           │      ┌─────────────────┐
         │           │      │  OpenAI Node    │ ← 대본 생성
         │           │      │  (GPT-4)        │
         │           │      └────────┬─────────┘
         │           │               │
         │           ├─ images ──┐   │
         │           │           ▼   │
         │           │      ┌─────────────────┐
         │           │      │  DALL-E Node    │ ← 이미지 생성
         │           │      └────────┬─────────┘
         │           │               │
         │           └─ videos ──┐   │
         │                       ▼   │
         │                  ┌─────────────────┐
         │                  │  Video Gen Node  │ ← 영상 생성
         │                  └────────┬─────────┘
         │                          │
         └──────────────────────────┘
                                    │
                                    ▼
                         ┌─────────────────┐
                         │  Supabase Node  │ ← 상태를 'blocked'로 업데이트
                         │  (Update)       │   (사용자 확인 대기)
                         └─────────────────┘
```

#### n8n 워크플로우 코드 예시

```javascript
// Function Node: stepKey에 따라 분기
const stepKey = $input.item.json.step_key;
const projectId = $input.item.json.project_id;
const status = $input.item.json.status;

if (status !== 'in_progress') {
  return [];
}

const routes = {
  brief: {
    workflow: 'generate-brief',
    prompt: `프로젝트 ${projectId}의 기획서를 생성하세요.`
  },
  script: {
    workflow: 'generate-script',
    prompt: `프로젝트 ${projectId}의 대본을 생성하세요.`
  },
  images: {
    workflow: 'generate-images',
    prompt: `프로젝트 ${projectId}의 이미지를 생성하세요.`
  },
  videos: {
    workflow: 'generate-videos',
    prompt: `프로젝트 ${projectId}의 영상을 생성하세요.`
  }
};

return routes[stepKey] ? [{ json: routes[stepKey] }] : [];
```

### 3. Supabase 노드로 상태 업데이트

n8n에서 AI 처리가 완료되면 Supabase를 통해 상태를 업데이트합니다.

```javascript
// Supabase Node 설정
{
  "operation": "update",
  "table": "project_steps",
  "updateKey": "id",
  "columns": {
    "status": "blocked", // 사용자 확인 대기
    "metadata": {
      "generated_content": "{{ $json.generated_content }}",
      "progress": 100,
      "completed_at": "{{ $now }}"
    }
  }
}
```

## Supabase Realtime 연동 (선택사항)

폴링 대신 Supabase Realtime을 사용하면 더 효율적입니다.

### 1. Supabase Realtime 설정

```typescript
// app/lib/supa-client.ts
import { RealtimeChannel } from '@supabase/supabase-js';

export function subscribeToProjectSteps(
  projectId: string,
  callback: (steps: ProjectStep[]) => void
): RealtimeChannel {
  const project = await getProjectByProjectId(projectId);
  if (!project) {
    throw new Error("프로젝트를 찾을 수 없습니다.");
  }

  const channel = client
    .channel(`project-steps:${project.id}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'project_steps',
        filter: `project_id=eq.${project.id}`,
      },
      (payload) => {
        // 상태 변경 시 콜백 실행
        getProjectSteps(projectId).then(callback);
      }
    )
    .subscribe();

  return channel;
}
```

### 2. 훅에서 Realtime 사용

```typescript
export function useProjectStepStatus(projectId: string | undefined) {
  const [stepStatusMap, setStepStatusMap] = React.useState<StepStatusMap>({...});

  React.useEffect(() => {
    if (!projectId || projectId === "create") {
      return;
    }

    const channel = subscribeToProjectSteps(projectId, (steps) => {
      const newStatusMap = createStatusMap(steps);
      setStepStatusMap(newStatusMap);
    });

    return () => {
      channel.unsubscribe();
    };
  }, [projectId]);

  return { stepStatusMap, getStepLoading, getStepDone };
}
```

## 사용 예시

### 1. 프론트엔드에서 상태 업데이트

```typescript
// 사용자가 단계를 완료했을 때
const handleStepComplete = async (stepKey: ProjectStepKey) => {
  const formData = new FormData();
  formData.append("stepKey", stepKey);
  formData.append("status", "completed");
  
  await fetcher.submit(formData, {
    method: "post",
    action: `/my/dashboard/project/${projectId}/status`,
  });
};
```

### 2. 에이전트에서 상태 업데이트 (n8n)

```javascript
// n8n Function Node에서
const supabaseUrl = 'https://your-project.supabase.co';
const supabaseKey = 'your-anon-key';

// 단계 시작
await fetch(`${supabaseUrl}/rest/v1/project_steps`, {
  method: 'PATCH',
  headers: {
    'apikey': supabaseKey,
    'Authorization': `Bearer ${supabaseKey}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  },
  body: JSON.stringify({
    status: 'in_progress',
    started_at: new Date().toISOString()
  })
});

// AI 처리 완료 후 사용자 확인 대기
await fetch(`${supabaseUrl}/rest/v1/project_steps`, {
  method: 'PATCH',
  headers: { /* ... */ },
  body: JSON.stringify({
    status: 'blocked', // 사용자 확인 필요
    metadata: {
      generated_content: aiResult,
      progress: 100
    }
  })
});
```

### 3. UI에서 상태 표시

```typescript
// project-workspace-page.tsx
export default function ProjectWorkspacePage() {
  const { loading, done } = useProjectDetail();

  return (
    <ProjectAccordion>
      <ProjectPrd
        loading={loading.brief}
        done={done.brief}
      />
      <ProjectScript
        loading={loading.script}
        done={done.script}
      />
      {/* ... */}
    </ProjectAccordion>
  );
}
```

## 워크플로우 시나리오

### 시나리오 1: 사용자가 프로젝트 생성

1. 사용자가 채팅 폼에 아이디어 입력
2. `project-create-page.tsx`의 `action`에서 프로젝트 생성
3. `createInitialProjectSteps`로 모든 단계를 `pending` 상태로 생성
4. 첫 번째 단계(`brief`)를 `in_progress`로 업데이트
5. n8n 워크플로우가 트리거되어 기획서 생성 시작

### 시나리오 2: AI 에이전트가 작업 완료

1. n8n에서 OpenAI/DALL-E 등으로 콘텐츠 생성
2. 생성 완료 후 `project_steps` 테이블의 상태를 `blocked`로 업데이트
3. 프론트엔드가 폴링/Realtime으로 상태 변경 감지
4. UI에 "확인 필요" 표시
5. 사용자가 확인 후 "다음" 버튼 클릭
6. 다음 단계를 `in_progress`로 업데이트

### 시나리오 3: 사용자가 수동으로 수정

1. 사용자가 생성된 콘텐츠를 수정
2. "저장" 버튼 클릭 시 해당 단계를 `completed`로 업데이트
3. 다음 단계가 자동으로 `in_progress`로 변경
4. n8n 워크플로우가 다음 단계 처리 시작

## 성능 최적화

### 1. 폴링 간격 조정

```typescript
// 활성 프로젝트: 3초마다 폴링
// 비활성 프로젝트: 30초마다 폴링
const interval = isActive ? 3000 : 30000;
useProjectStepStatus(projectId, { interval });
```

### 2. Realtime 사용 권장

폴링보다 Realtime이 더 효율적입니다:
- 실시간 업데이트
- 서버 부하 감소
- 네트워크 트래픽 감소

### 3. 배치 업데이트

여러 단계를 한 번에 업데이트할 때:

```typescript
// Supabase에서 여러 레코드 한 번에 업데이트
await client
  .from("project_steps")
  .update({ status: "completed" })
  .in("key", ["brief", "script"]);
```

## 보안 고려사항

### 1. RLS (Row Level Security)

Supabase에서 RLS 정책 설정:

```sql
-- 사용자는 자신의 프로젝트 단계만 조회/수정 가능
CREATE POLICY "Users can manage their own project steps"
ON project_steps
FOR ALL
USING (
  project_id IN (
    SELECT id FROM projects
    WHERE owner_profile_id = auth.uid()
  )
);
```

### 2. API 키 관리

n8n에서 Supabase API 키를 환경 변수로 관리:

```javascript
const supabaseKey = $env.SUPABASE_ANON_KEY;
```

## 트러블슈팅

### 문제: 상태가 업데이트되지 않음

**해결책:**
1. Supabase RLS 정책 확인
2. n8n 워크플로우 로그 확인
3. 프론트엔드 폴링 간격 확인

### 문제: 폴링이 너무 자주 발생

**해결책:**
1. Realtime으로 전환
2. 폴링 간격 증가
3. 페이지가 비활성일 때 폴링 중지

### 문제: n8n 워크플로우가 트리거되지 않음

**해결책:**
1. Supabase Webhook 설정 확인
2. n8n Webhook URL 확인
3. n8n 워크플로우 활성화 상태 확인

## 관련 파일

- `app/features/projects/queries.ts`: 쿼리 함수
- `app/features/projects/pages/project-status-action.tsx`: Action 함수
- `app/features/projects/hooks/use-project-step-status.ts`: 상태 폴링 훅
- `app/features/projects/layouts/project-detail-layout.tsx`: 레이아웃 통합
- `app/features/projects/schema.ts`: 데이터베이스 스키마

## 참고 자료

- [Supabase Realtime 문서](https://supabase.com/docs/guides/realtime)
- [n8n 워크플로우 문서](https://docs.n8n.io/)
- [React Router Action 함수](https://reactrouter.com/en/main/route/action)


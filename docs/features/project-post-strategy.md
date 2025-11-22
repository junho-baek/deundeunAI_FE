# 프로젝트 포스트 전략 (Project Post Strategy)

## 개요

프로젝트 생성부터 워크스페이스 렌더링까지의 전체 플로우를 `6.10-detail-pages.md` 패턴을 참고하여 구현하는 전략입니다. 실제 DB 데이터를 기반으로 한 에이전트 워크스페이스와 휴먼 인 더 루프(Human-in-the-loop) 프론트엔드를 지원합니다.

## 아키텍처 플로우

```
┌─────────────────┐
│  사용자 입력     │
│  (chat-form)    │
└────────┬────────┘
         │ POST /project/create
         │ (projectId, keyword, aspectRatio)
         ▼
┌─────────────────┐
│  project-create  │
│  (action)        │
└────────┬────────┘
         │ 1. createProject(project_id: UUID)
         │ 2. createInitialProjectSteps(serial_id)
         │ 3. redirect to /project/:projectId
         ▼
┌─────────────────┐
│  project-detail  │
│  (loader)       │
└────────┬────────┘
         │ getProjectByProjectId(projectId)
         │ getProjectSteps(projectId)
         │ (관계 조회: owner profile)
         ▼
┌─────────────────┐
│  project-workspace│
│  (component)     │
└────────┬────────┘
         │ useProjectStepStatus (폴링)
         │ DB 상태 → UI 상태 동기화
         ▼
┌─────────────────┐
│  n8n Workflow   │
│  (에이전트)      │
└────────┬────────┘
         │ updateProjectStep(status, metadata)
         │ POST /project/:projectId/status
         ▼
┌─────────────────┐
│  Supabase       │
│  project_steps  │
└─────────────────┘
```

## 1. 프로젝트 생성 플로우 (POST)

### 1.1 채팅 폼 제출 (`chat-form.tsx`)

**패턴:** `6.10-detail-pages.md`의 Form 제출 패턴

```typescript
// app/common/components/chat-form.tsx
export function ChatForm() {
  const fetcher = useFetcher();
  
  const submitCurrent = () => {
    const userName = getCurrentUserName();
    const projectId = generateProjectUUID(userName, message);
    
    const formData = new FormData();
    formData.append("keyword", message);
    formData.append("aspectRatio", aspectRatio);
    formData.append("projectId", projectId); // UUID 미리 생성
    
    fetcher.submit(formData, {
      method: "post",
      action: "/my/dashboard/project/create",
    });
  };
}
```

**특징:**
- UUID를 프론트엔드에서 미리 생성 (결정적 ID)
- `useFetcher`로 비동기 제출 (페이지 전환 없이 처리)
- `projectId`를 폼 데이터에 포함

### 1.2 프로젝트 생성 Action (`project-create-page.tsx`)

**패턴:** `6.10-detail-pages.md`의 Loader 패턴을 Action에 적용

```typescript
// app/features/projects/pages/project-create-page.tsx
export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const projectId = formData.get("projectId") as string;
  const keyword = formData.get("keyword") as string;
  const aspectRatio = formData.get("aspectRatio") as string;

  // 1. 프로젝트 생성 (UUID 사용)
  const project = await createProject({
    project_id: projectId, // 명시적 UUID
    owner_profile_id: DEFAULT_PROFILE_ID,
    title: keyword || "새 프로젝트",
    status: "draft",
    visibility: "private",
    config: { aspectRatio },
    metadata: { keyword },
  });

  // 2. 초기 단계 생성 (serial ID 사용)
  await createInitialProjectSteps(project.id);

  // 3. 첫 번째 단계를 in_progress로 시작
  await updateProjectStep(
    project.project_id, // UUID
    "brief",
    "in_progress"
  );

  // 4. 워크스페이스로 리다이렉트
  return redirect(`/my/dashboard/project/${project.project_id}?keyword=${keyword}`);
}
```

**주요 포인트:**
- `project_id` (UUID): URL과 외부 참조에 사용
- `id` (serial): 내부 관계와 성능에 사용
- 초기 단계 자동 생성 후 첫 단계 시작
- n8n 워크플로우 트리거를 위한 상태 업데이트

## 2. 프로젝트 상세 로드 플로우 (GET)

### 2.1 Loader 패턴 (`project-detail-layout.tsx`)

**패턴:** `6.10-detail-pages.md`의 Loader 패턴

```typescript
// app/features/projects/layouts/project-detail-layout.tsx
export const loader = async ({
  params,
  request,
}: LoaderFunctionArgs): Promise<LoaderData> => {
  const projectId = params.projectId;
  const url = new URL(request.url);
  const keyword = url.searchParams.get("keyword");

  if (!projectId || projectId === "create") {
    return {
      project: null,
      projectSteps: [],
      initialChatPayload: keyword ? { keyword } : null,
    };
  }

  // 1. 프로젝트 조회 (관계 조회 포함)
  const project = await getProjectByProjectId(projectId);
  if (!project) {
    throw new Response("프로젝트를 찾을 수 없습니다.", { status: 404 });
  }

  // 2. 프로젝트 단계 조회
  const projectSteps = await getProjectSteps(projectId);

  return {
    project,
    projectSteps,
    initialChatPayload: keyword ? { keyword } : null,
  };
};
```

**특징:**
- `.single()` 사용 시 404 처리
- 관계 조회로 owner 정보 포함
- 초기 채팅 페이로드 전달

### 2.2 쿼리 함수 (`queries.ts`)

**패턴:** `6.10-detail-pages.md`의 관계 조회 패턴

```typescript
// app/features/projects/queries.ts

/**
 * 프로젝트 ID(UUID)로 프로젝트 조회 (관계 포함)
 */
export async function getProjectByProjectId(projectId: string) {
  const { data, error } = await client
    .from("projects")
    .select(`
      *,
      owner:profiles!inner(
        username,
        avatar,
        name
      )
    `)
    .eq("project_id", projectId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // 레코드 없음
      return null;
    }
    throw new Error(`프로젝트 조회 실패: ${error.message}`);
  }

  return data;
}

/**
 * 프로젝트의 모든 단계 조회
 */
export async function getProjectSteps(projectId: string) {
  const project = await getProjectByProjectId(projectId);
  if (!project) {
    return [];
  }

  const { data, error } = await client
    .from("project_steps")
    .select("*")
    .eq("project_id", project.id) // serial ID 사용
    .order("order", { ascending: true });

  if (error) {
    console.error("프로젝트 단계 조회 실패:", error);
    return [];
  }

  return data ?? [];
}
```

**특징:**
- `profiles!inner`로 owner 정보 조회
- `.single()` 사용 시 null 반환 (404 처리)
- serial `id`로 관계 조회 (성능 최적화)

## 3. 상태 업데이트 플로우 (POST Status)

### 3.1 Action 함수 (`project-status-action.tsx`)

**패턴:** `6.10-detail-pages.md`의 Action 패턴

```typescript
// app/features/projects/pages/project-status-action.tsx
export async function action({
  request,
  params,
}: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return data({ ok: false, error: "Method not allowed" }, { status: 405 });
  }

  const projectId = params.projectId;
  if (!projectId || projectId === "create") {
    return data({ ok: false, error: "Invalid project ID" }, { status: 400 });
  }

  const formData = await request.formData();
  const stepKey = formData.get("stepKey") as ProjectStepKey;
  const status = formData.get("status") as ProjectStepStatus;
  const metadataStr = formData.get("metadata");

  try {
    const updatedStep = await updateProjectStep(
      projectId,
      stepKey,
      status,
      metadataStr ? JSON.parse(metadataStr) : undefined
    );

    return data({ ok: true, step: updatedStep });
  } catch (error) {
    console.error("상태 업데이트 실패:", error);
    return data(
      { ok: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
```

**특징:**
- POST 메서드만 허용
- UUID 기반 프로젝트 ID 검증
- 에러 처리 및 적절한 HTTP 상태 코드 반환

### 3.2 상태 폴링 훅 (`use-project-step-status.ts`)

**패턴:** `6.10-detail-pages.md`의 실시간 데이터 패턴

```typescript
// app/features/projects/hooks/use-project-step-status.ts
export function useProjectStepStatus(
  projectId: string | undefined,
  loaderData: { projectSteps: ProjectStep[] } | null,
  options: {
    enabled?: boolean;
    interval?: number;
  } = {}
) {
  const { enabled = true, interval = 3000 } = options;
  const fetcher = useFetcher();

  // 초기 상태 설정 (loaderData에서)
  const [stepStatusMap, setStepStatusMap] = useState<StepStatusMap>(() => {
    return createStatusMap(loaderData?.projectSteps ?? []);
  });

  // 주기적 폴링
  useEffect(() => {
    if (!projectId || projectId === "create" || !enabled) {
      return;
    }

    const poll = () => {
      fetcher.load(`/my/dashboard/project/${projectId}/status`);
    };

    poll(); // 즉시 한 번 실행
    const intervalId = setInterval(poll, interval);

    return () => clearInterval(intervalId);
  }, [projectId, enabled, interval]);

  // fetcher 데이터 업데이트
  useEffect(() => {
    if (fetcher.data?.projectSteps) {
      setStepStatusMap(createStatusMap(fetcher.data.projectSteps));
    }
  }, [fetcher.data]);

  return {
    stepStatusMap,
    getStepLoading: (key: ProjectStepKey) =>
      stepStatusMap[key] === "in_progress",
    getStepDone: (key: ProjectStepKey) =>
      stepStatusMap[key] === "completed",
    updateStepStatus: async (
      key: ProjectStepKey,
      status: ProjectStepStatus,
      metadata?: Record<string, unknown>
    ) => {
      const formData = new FormData();
      formData.append("stepKey", key);
      formData.append("status", status);
      if (metadata) {
        formData.append("metadata", JSON.stringify(metadata));
      }

      fetcher.submit(formData, {
        method: "post",
        action: `/my/dashboard/project/${projectId}/status`,
      });
    },
  };
}
```

**특징:**
- Loader 데이터로 초기 상태 설정
- `useFetcher`로 비동기 폴링
- 상태 변경 시 자동 UI 업데이트

## 4. 워크스페이스 렌더링 (`project-workspace-page.tsx`)

### 4.1 실제 DB 데이터 사용

**패턴:** `6.10-detail-pages.md`의 실제 데이터 렌더링 패턴

```typescript
// app/features/projects/pages/project-workspace-page.tsx
export default function ProjectWorkspacePage() {
  const { project, loading, done } = useProjectDetail();
  const { projectSteps } = useLoaderData<typeof loader>();

  // 프로젝트 데이터가 없으면 로딩 표시
  if (!project) {
    return <ProjectWorkspaceSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* 프로젝트 헤더 */}
      <div>
        <h1>{project.title}</h1>
        <p>작성자: {project.owner?.name || project.owner?.username}</p>
        {project.owner?.avatar && (
          <Avatar>
            <AvatarImage src={project.owner.avatar} />
            <AvatarFallback>{project.owner.name?.[0]}</AvatarFallback>
          </Avatar>
        )}
      </div>

      {/* 단계별 컴포넌트 */}
      <ProjectAccordion>
        <ProjectPrd
          loading={loading.brief}
          done={done.brief}
          metadata={getStepMetadata("brief")}
        />
        <ProjectScript
          loading={loading.script}
          done={done.script}
          metadata={getStepMetadata("script")}
        />
        {/* ... */}
      </ProjectAccordion>
    </div>
  );
}
```

**특징:**
- Loader 데이터로 초기 렌더링
- 관계 조회로 owner 정보 표시
- Null 안전 처리 (`?.` 연산자)

### 4.2 단계별 컴포넌트

**패턴:** `6.10-detail-pages.md`의 조건부 렌더링 패턴

```typescript
// app/features/projects/components/project-prd.tsx
export function ProjectPrd({
  loading,
  done,
  metadata,
}: {
  loading: boolean;
  done: boolean;
  metadata?: Record<string, unknown>;
}) {
  const content = metadata?.content as string | undefined;

  return (
    <AccordionItem value="brief">
      <AccordionTrigger>
        <div className="flex items-center gap-2">
          {loading && <Loader2 className="animate-spin" />}
          {done && <CheckCircle2 className="text-green-500" />}
          <span>수익형 콘텐츠 기획서</span>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        {loading && <Skeleton className="h-32" />}
        {done && content && (
          <div className="prose">
            <p>{content}</p>
          </div>
        )}
        {!done && !loading && (
          <p className="text-muted-foreground">대기 중...</p>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}
```

**특징:**
- 로딩/완료 상태에 따른 조건부 렌더링
- 메타데이터에서 콘텐츠 추출
- Skeleton으로 로딩 UX 개선

## 5. n8n 워크플로우 연동

### 5.1 Webhook 트리거

**패턴:** `6.10-detail-pages.md`의 외부 시스템 연동 패턴

```javascript
// n8n 워크플로우: 프로젝트 단계 처리
// 1. Webhook 노드 (Supabase → n8n)
{
  "name": "Supabase Webhook",
  "type": "n8n-nodes-base.webhook",
  "parameters": {
    "path": "project-step-status",
    "httpMethod": "POST"
  }
}

// 2. Function 노드: 필터링 및 라우팅
const payload = $input.item.json;
const { project_id, step_key, status } = payload.new || payload;

if (status !== 'in_progress') {
  return [];
}

// step_key에 따라 분기
const routes = {
  brief: { workflow: 'generate-brief', prompt: '기획서 생성' },
  script: { workflow: 'generate-script', prompt: '대본 생성' },
  images: { workflow: 'generate-images', prompt: '이미지 생성' },
  videos: { workflow: 'generate-videos', prompt: '영상 생성' },
};

return routes[step_key] ? [{ json: routes[step_key] }] : [];
```

### 5.2 상태 업데이트 (n8n → Supabase)

```javascript
// n8n HTTP Request 노드: Supabase REST API 호출
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const projectId = $input.item.json.project_id;
const stepKey = $input.item.json.step_key;

// AI 처리 완료 후 상태 업데이트
await $http.request({
  method: 'PATCH',
  url: `${supabaseUrl}/rest/v1/project_steps`,
  headers: {
    'apikey': supabaseKey,
    'Authorization': `Bearer ${supabaseKey}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  },
  body: {
    status: 'blocked', // 사용자 확인 대기
    metadata: {
      generated_content: $input.item.json.ai_result,
      progress: 100,
      completed_at: new Date().toISOString()
    }
  },
  qs: {
    project_id: `eq.${projectId}`,
    key: `eq.${stepKey}`
  }
});
```

## 6. 주요 패턴 정리

### 6.1 Loader 패턴

**모든 상세 페이지에 적용:**
```typescript
export const loader = async ({ params }: LoaderFunctionArgs) => {
  const item = await getItemById(params.itemId);
  if (!item) {
    throw new Response("Not Found", { status: 404 });
  }
  return { item };
};
```

**장점:**
- 서버에서 데이터 미리 로드
- SEO 및 초기 로딩 성능 향상
- 에러 처리 중앙화

### 6.2 관계 조회 패턴

**Supabase 관계 조회:**
```typescript
.select(`
  *,
  owner:profiles!inner(username, avatar, name)
`)
```

**특징:**
- `!inner`: 필수 관계 (없으면 제외)
- `!left`: 선택적 관계 (없어도 포함)
- 필요한 필드만 선택 (성능 최적화)

### 6.3 상태 동기화 패턴

**Loader + 폴링 조합:**
```typescript
// 1. Loader에서 초기 데이터 로드
const { projectSteps } = useLoaderData();

// 2. 폴링으로 실시간 업데이트
const { stepStatusMap } = useProjectStepStatus(projectId, { projectSteps });

// 3. UI에 반영
const loading = getStepLoading("brief");
const done = getStepDone("brief");
```

### 6.4 Null 안전 처리

**아바타 이미지:**
```typescript
{avatarUrl ? (
  <AvatarImage src={avatarUrl} />
) : null}
<AvatarFallback>{name[0]}</AvatarFallback>
```

**배열 접근:**
```typescript
{name?.[0]} // 첫 글자로 fallback
```

## 7. 적용 체크리스트

### 프로젝트 생성 플로우
- [x] UUID 생성 (프론트엔드)
- [x] 프로젝트 생성 (Action)
- [x] 초기 단계 생성
- [x] 첫 단계 시작 (`in_progress`)
- [x] 워크스페이스로 리다이렉트

### 프로젝트 로드 플로우
- [x] Loader 함수 구현
- [x] 관계 조회 (owner)
- [x] 단계 조회
- [x] 404 처리
- [x] 에러 처리

### 상태 업데이트 플로우
- [x] Action 함수 구현
- [x] 폴링 훅 구현
- [x] UI 상태 동기화
- [x] 수동 업데이트 지원

### 워크스페이스 렌더링
- [x] 실제 DB 데이터 사용
- [x] 로딩/완료 상태 표시
- [x] Null 안전 처리
- [x] 조건부 렌더링

### n8n 연동
- [ ] Webhook 설정
- [ ] 워크플로우 구현
- [ ] 상태 업데이트 로직
- [ ] 에러 처리

## 8. 성능 최적화

### 8.1 폴링 간격 조정

```typescript
// 활성 프로젝트: 3초
// 비활성 프로젝트: 30초
const interval = isActive ? 3000 : 30000;
```

### 8.2 Realtime 사용 (권장)

폴링 대신 Supabase Realtime 사용:
- 실시간 업데이트
- 서버 부하 감소
- 네트워크 트래픽 감소

### 8.3 배치 업데이트

여러 단계를 한 번에 업데이트:
```typescript
await client
  .from("project_steps")
  .update({ status: "completed" })
  .in("key", ["brief", "script"]);
```

## 9. 보안 고려사항

### 9.1 RLS (Row Level Security)

```sql
-- 사용자는 자신의 프로젝트만 조회/수정 가능
CREATE POLICY "Users can manage their own projects"
ON projects
FOR ALL
USING (owner_profile_id = auth.uid());

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

### 9.2 API 키 관리

n8n에서 환경 변수로 관리:
```javascript
const supabaseKey = process.env.SUPABASE_ANON_KEY;
```

## 10. 관련 파일

- `app/features/projects/pages/project-create-page.tsx`: 프로젝트 생성
- `app/features/projects/layouts/project-detail-layout.tsx`: 레이아웃 및 Loader
- `app/features/projects/pages/project-workspace-page.tsx`: 워크스페이스 페이지
- `app/features/projects/pages/project-status-action.tsx`: 상태 업데이트 Action
- `app/features/projects/hooks/use-project-step-status.ts`: 상태 폴링 훅
- `app/features/projects/queries.ts`: 쿼리 함수
- `app/features/projects/schema.ts`: 데이터베이스 스키마

## 11. 참고 자료

- [6.10 Detail Pages 문서](./참고강의/6.10-detail-pages.md)
- [프로젝트 단계 상태 관리 문서](./project-step-status-management.md)
- [Supabase 관계 조회 문서](https://supabase.com/docs/guides/api/joins-and-nesting)
- [React Router Loader 문서](https://reactrouter.com/en/main/route/loader)
- [n8n 워크플로우 문서](https://docs.n8n.io/)


# 프로젝트 워크플로우 구현 완료 문서

## 구현 완료 내역

### 1. 설계 문서 ✅

- `docs/features/project-workflow-design.md`: 전체 워크플로우 설계 문서

### 2. Form 컴포넌트 구현 ✅

#### Brief (기획서)

- ✅ `ProjectBriefReviewForm`: 기획서 확인 및 수정/제출 폼
- ✅ `ProjectBriefEditor`: 기획서 편집 컴포넌트 (마크다운 에디터)

#### Script (스크립트)

- ✅ `ProjectScriptReviewForm`: 스크립트 확인 및 수정/제출 폼
- ✅ `ProjectScriptEditor`: 스크립트 편집 컴포넌트 (단락별 편집)

#### Narration (대사)

- ✅ `ProjectNarrationReviewForm`: 대사 확인 및 재생성/제출 폼

#### Final (최종 영상)

- ✅ `ProjectFinalReviewForm`: 최종 영상 확인 및 배포 폼

#### Images & Videos

- ✅ 기존 컴포넌트 활용 (`ProjectImageSelect`, `ProjectVideoSelect`)
- `onRegenerate` 및 `onDone` 콜백 지원

### 3. Action 함수 구현 ✅

각 단계별 submit/update/regenerate action 함수:

- ✅ `project-brief-submit-action.tsx`: 기획서 제출
- ✅ `project-brief-update-action.tsx`: 기획서 수정
- ✅ `project-script-submit-action.tsx`: 스크립트 제출
- ✅ `project-script-update-action.tsx`: 스크립트 수정
- ✅ `project-narration-regenerate-action.tsx`: 대사 재생성
- ✅ `project-narration-submit-action.tsx`: 대사 제출
- ✅ `project-images-regenerate-action.tsx`: 이미지 재생성
- ✅ `project-images-submit-action.tsx`: 이미지 제출
- ✅ `project-videos-regenerate-action.tsx`: 영상 재생성
- ✅ `project-videos-submit-action.tsx`: 영상 제출
- ✅ `project-deploy-action.tsx`: 프로젝트 배포

### 4. 프로젝트 리스트 네비게이션 로직 ✅

- 프로젝트 상태에 따른 라우팅 구현
- `status === "completed"` → `/my/dashboard/project/${projectId}/analytics`
- 그 외 (`draft`, `generating`, `active`) → `/my/dashboard/project/${projectId}/workspace`

### 5. 작업 공간 페이지 통합 ✅

- 각 단계별 Form 컴포넌트 연결
- 편집 모드 상태 관리
- Action 함수 호출 (useFetcher 사용)
- 중간 지점부터 재개 로직 (완료된 단계 확인 및 다음 단계로 자동 이동)

### 6. 라우팅 설정 ✅

- 각 action 함수에 대한 라우트 추가
- `/my/dashboard/project/:projectId/brief/submit`
- `/my/dashboard/project/:projectId/brief/update`
- `/my/dashboard/project/:projectId/script/submit`
- `/my/dashboard/project/:projectId/script/update`
- `/my/dashboard/project/:projectId/narration/regenerate`
- `/my/dashboard/project/:projectId/narration/submit`
- `/my/dashboard/project/:projectId/images/regenerate`
- `/my/dashboard/project/:projectId/images/submit`
- `/my/dashboard/project/:projectId/videos/regenerate`
- `/my/dashboard/project/:projectId/videos/submit`
- `/my/dashboard/project/:projectId/deploy`

## 생성된 파일 목록

### Form 컴포넌트

```
app/features/projects/components/
├── project-brief-review-form.tsx      ✅ 새로 생성
├── project-brief-editor.tsx           ✅ 새로 생성
├── project-script-review-form.tsx     ✅ 새로 생성
├── project-script-editor.tsx          ✅ 새로 생성
├── project-narration-review-form.tsx  ✅ 새로 생성
└── project-final-review-form.tsx      ✅ 새로 생성
```

### Action 함수

```
app/features/projects/pages/
├── project-brief-submit-action.tsx         ✅ 새로 생성
├── project-brief-update-action.tsx         ✅ 새로 생성
├── project-script-submit-action.tsx        ✅ 새로 생성
├── project-script-update-action.tsx        ✅ 새로 생성
├── project-narration-regenerate-action.tsx ✅ 새로 생성
├── project-narration-submit-action.tsx     ✅ 새로 생성
├── project-images-regenerate-action.tsx    ✅ 새로 생성
├── project-images-submit-action.tsx        ✅ 새로 생성
├── project-videos-regenerate-action.tsx    ✅ 새로 생성
├── project-videos-submit-action.tsx        ✅ 새로 생성
└── project-deploy-action.tsx               ✅ 새로 생성
```

## 수정된 파일

- `app/features/projects/pages/project-list-page.tsx`: 프로젝트 상태에 따른 라우팅 로직 추가
- `app/features/projects/pages/project-workspace-page.tsx`: Form 컴포넌트 통합 및 중간 지점부터 재개 로직 추가
- `app/routes.ts`: 각 action 함수에 대한 라우트 추가

## 워크플로우 흐름

### 1. 프로젝트 초기화

1. 사용자가 챗 폼에 키워드 입력
2. 에이전트가 추가 정보를 요청하는 폼 표시 (`ChatInitForm`)
3. 사용자가 폼 제출
4. 프로젝트 생성 (`status: "draft"`)
5. 첫 번째 단계 시작 (`brief` 단계 `status: "pending"` → `"in_progress"`)

### 2. 각 단계별 흐름

#### Brief (기획서)

1. n8n 웹훅 호출 → 기획서 생성
2. 기획서 표시 (`ProjectBriefReviewForm`)
3. 사용자 액션:
   - **수정하기**: `ProjectBriefEditor` 표시 → 수정 완료 → n8n 웹훅 재호출
   - **이대로 제출**: 다음 단계(script)로 진행

#### Script (스크립트)

1. n8n 웹훅 호출 → 스크립트 생성
2. 스크립트 표시 (`ProjectScriptReviewForm`)
3. 사용자 액션:
   - **수정하기**: `ProjectScriptEditor` 표시 → 수정 완료 → n8n 웹훅 재호출
   - **이대로 제출**: 다음 단계(narration)로 진행

#### Narration (대사)

1. n8n 웹훅 호출 → 대사 오디오 생성
2. 오디오 세그먼트 표시 (`ProjectNarrationReviewForm`)
3. 사용자 액션:
   - **재생성 요청**: n8n 웹훅 재호출
   - **이대로 제출**: 다음 단계(images)로 진행

#### Images (이미지)

1. n8n 웹훅 호출 → 이미지들 생성
2. 이미지 갤러리 표시 (`ProjectImageSelect`)
3. 사용자 액션:
   - **재생성 요청**: 선택한 이미지들 재생성 → n8n 웹훅 재호출
   - **이대로 제출**: 선택한 이미지들로 다음 단계(videos)로 진행

#### Videos (영상)

1. n8n 웹훅 호출 → 영상들 생성
2. 영상 플레이어 표시 (`ProjectVideoSelect`)
3. 사용자 액션:
   - **재생성 요청**: 선택한 영상들 재생성 → n8n 웹훅 재호출
   - **이대로 제출**: 선택한 영상으로 다음 단계(final)로 진행

#### Final (최종 편집)

1. n8n 웹훅 호출 → 최종 편집 영상 생성
2. 최종 영상 표시 (`ProjectFinalReviewForm`)
3. 사용자 액션:
   - **배포하기**: 프로젝트 상태를 `"completed"`로 변경

## 프로젝트 상태 관리

### 프로젝트 상태 (`projects.status`)

- `"draft"`: 초기 생성 상태
- `"generating"`: 에이전트 작업 진행 중 (어떤 단계든 `"in_progress"`일 때)
- `"active"`: 사용자 검토/수정 중
- `"completed"`: 배포 완료
- `"archived"`: 아카이브됨

### 프로젝트 단계 상태 (`project_steps.status`)

- `"pending"`: 아직 시작하지 않음
- `"in_progress"`: 진행 중 (n8n 에이전트 작업 중)
- `"blocked"`: 차단됨 (에러 등)
- `"completed"`: 완료됨

## 중간 지점부터 재개 로직

작업 공간 페이지는 다음 로직으로 중간 지점부터 재개할 수 있습니다:

1. `projectSteps`를 조회하여 각 단계의 상태 확인
2. 완료되지 않은 첫 번째 단계 찾기
3. 해당 단계로 Accordion 자동 열기 (`defaultValue` 설정)
4. 사용자가 이전 단계로 돌아가서 수정 가능

## 프로젝트 카드 라우팅

프로젝트 리스트 페이지에서 프로젝트 카드를 클릭하면:

- `status === "completed"`: `/my/dashboard/project/${projectId}/analytics`로 이동
- 그 외 (`draft`, `generating`, `active`): `/my/dashboard/project/${projectId}/workspace`로 이동

## 다음 단계 (n8n 웹훅 통합)

현재 모든 Form과 Action 함수가 구현되었으며, n8n 웹훅은 목업으로 동작합니다.

실제 n8n 웹훅 통합 시:

1. `app/lib/n8n-webhook.ts`의 `triggerProjectStepStartWebhook` 함수 수정
2. n8n 콜백 엔드포인트 구현 (`/api/n8n/callbacks/*`)
3. Supabase Storage 업로드 로직 구현

## 참고사항

- 모든 Form은 n8n 웹훅 연결 전에 설계 및 구현 완료
- Action 함수는 목업 데이터로 먼저 테스트 가능
- 각 단계의 상태는 `project_steps` 테이블에서 관리
- 프로젝트 전체 상태는 `projects.status`에서 관리
- 사용자는 언제든지 이전 단계로 돌아가서 수정 가능
- 작업 공간 페이지는 완료된 단계를 확인하고 다음 단계부터 진행 가능

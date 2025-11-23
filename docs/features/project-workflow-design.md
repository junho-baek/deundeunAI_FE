# 프로젝트 워크플로우 설계 문서

## 개요

프로젝트 생성부터 배포까지의 전체 워크플로우를 설계합니다. 각 단계마다 사용자 확인 및 수정이 가능하며, n8n 웹훅을 통해 에이전트 작업을 처리합니다.

## 워크플로우 단계

### 1. 프로젝트 초기화 (Chat Form)

**트리거**: 사용자가 챗 폼에 키워드 입력

**프로세스**:

1. 사용자가 키워드와 이미지, 비율 입력
2. 에이전트가 추가 정보를 요청하는 폼 표시 (`ChatInitForm`)
3. 사용자가 폼 제출
4. 프로젝트 생성 (`status: "draft"`)
5. 첫 번째 단계 시작 (`brief` 단계 `status: "pending"` → `"in_progress"`)

**데이터 저장**:

- `projects` 테이블에 프로젝트 생성
- `project_steps` 테이블에 모든 단계 초기화 (`status: "pending"`)
- `project_messages` 테이블에 사용자 메시지 저장

### 2. 기획서 작성 (Brief)

**트리거**: 폼 제출 후 자동 시작

**프로세스**:

1. `brief` 단계 상태를 `"in_progress"`로 변경
2. n8n 웹훅 호출 (`/api/n8n/workflows/brief-generation`)
3. n8n 에이전트가 기획서 생성
4. n8n이 웹훅으로 기획서 반환 (`POST /api/n8n/callbacks/brief-complete`)
5. `project_documents` 테이블에 기획서 저장 (`type: "brief"`)
6. `brief` 단계 상태를 `"completed"`로 변경
7. UI에 기획서 표시 및 수정/제출 버튼 표시

**사용자 액션**:

- **수정하기**: 기획서 편집 폼 표시 → 수정 완료 → n8n 웹훅 재호출
- **이대로 제출**: 다음 단계로 진행

**컴포넌트**:

- `ProjectBriefReviewForm`: 기획서 확인 및 수정 폼
- `ProjectBriefEditor`: 기획서 편집 컴포넌트

### 3. 스크립트 작성 (Script)

**트리거**: 기획서 제출 후 자동 시작

**프로세스**:

1. `script` 단계 상태를 `"in_progress"`로 변경
2. n8n 웹훅 호출 (`/api/n8n/workflows/script-generation`)
3. n8n 에이전트가 스크립트 생성
4. n8n이 웹훅으로 스크립트 반환 (`POST /api/n8n/callbacks/script-complete`)
5. `project_documents` 테이블에 스크립트 저장 (`type: "script"`)
6. `script` 단계 상태를 `"completed"`로 변경
7. UI에 스크립트 표시 및 수정/제출 버튼 표시

**사용자 액션**:

- **수정하기**: 스크립트 편집 폼 표시 → 수정 완료 → n8n 웹훅 재호출
- **이대로 제출**: 다음 단계로 진행

**컴포넌트**:

- `ProjectScriptReviewForm`: 스크립트 확인 및 수정 폼
- `ProjectScriptEditor`: 스크립트 편집 컴포넌트

### 4. 대사 생성 (Narration)

**트리거**: 스크립트 제출 후 자동 시작

**프로세스**:

1. `narration` 단계 상태를 `"in_progress"`로 변경
2. n8n 웹훅 호출 (`/api/n8n/workflows/narration-generation`)
3. n8n 에이전트가 대사 오디오 생성
4. n8n이 웹훅으로 오디오 파일 반환 (`POST /api/n8n/callbacks/narration-complete`)
5. Supabase Storage에 오디오 파일 저장
6. `project_media_assets` 테이블에 오디오 자산 저장 (`type: "audio"`)
7. `narration` 단계 상태를 `"completed"`로 변경
8. UI에 오디오 플레이어 및 수정/제출 버튼 표시

**사용자 액션**:

- **수정하기**: 대사 재생성 요청 → n8n 웹훅 재호출
- **이대로 제출**: 다음 단계로 진행

**컴포넌트**:

- `ProjectNarrationReviewForm`: 대사 확인 및 재생성 폼
- `ProjectNarrationPlayer`: 오디오 플레이어 컴포넌트

### 5. 이미지 생성 (Images)

**트리거**: 대사 제출 후 자동 시작

**프로세스**:

1. `images` 단계 상태를 `"in_progress"`로 변경
2. n8n 웹훅 호출 (`/api/n8n/workflows/image-generation`)
3. n8n 에이전트가 이미지들 생성
4. n8n이 웹훅으로 이미지 파일들 반환 (`POST /api/n8n/callbacks/image-complete`)
5. Supabase Storage에 이미지 파일들 저장
6. `project_media_assets` 테이블에 이미지 자산들 저장 (`type: "image"`)
7. `images` 단계 상태를 `"completed"`로 변경
8. UI에 이미지 갤러리 및 선택/재생성 버튼 표시

**사용자 액션**:

- **재생성 요청**: 특정 이미지 선택 → 재생성 요청 → n8n 웹훅 재호출
- **이대로 제출**: 선택한 이미지들로 다음 단계 진행

**컴포넌트**:

- `ProjectImageReviewForm`: 이미지 확인 및 재생성 폼
- `ProjectImageGallery`: 이미지 갤러리 컴포넌트
- `ProjectImageRegenerateButton`: 특정 이미지 재생성 버튼

### 6. 영상 생성 (Videos)

**트리거**: 이미지 제출 후 자동 시작

**프로세스**:

1. `videos` 단계 상태를 `"in_progress"`로 변경
2. n8n 웹훅 호출 (`/api/n8n/workflows/video-generation`)
3. n8n 에이전트가 영상들 생성
4. n8n이 웹훅으로 영상 파일들 반환 (`POST /api/n8n/callbacks/video-complete`)
5. Supabase Storage에 영상 파일들 저장
6. `project_media_assets` 테이블에 영상 자산들 저장 (`type: "video"`)
7. `videos` 단계 상태를 `"completed"`로 변경
8. UI에 영상 플레이어 및 선택/재생성 버튼 표시

**사용자 액션**:

- **재생성 요청**: 특정 영상 선택 → 재생성 요청 → n8n 웹훅 재호출
- **이대로 제출**: 선택한 영상으로 다음 단계 진행

**컴포넌트**:

- `ProjectVideoReviewForm`: 영상 확인 및 재생성 폼
- `ProjectVideoPlayer`: 영상 플레이어 컴포넌트
- `ProjectVideoRegenerateButton`: 특정 영상 재생성 버튼

### 7. 최종 편집 및 배포 (Final)

**트리거**: 영상 제출 후 자동 시작

**프로세스**:

1. `final` 단계 상태를 `"in_progress"`로 변경
2. n8n 웹훅 호출 (`/api/n8n/workflows/final-editing`)
3. n8n 에이전트가 최종 편집 영상 생성
4. n8n이 웹훅으로 최종 영상 반환 (`POST /api/n8n/callbacks/final-complete`)
5. Supabase Storage에 최종 영상 저장
6. `projects` 테이블의 `video_url` 업데이트
7. `project_media_assets` 테이블에 최종 영상 자산 저장 (`type: "video"`)
8. `final` 단계 상태를 `"completed"`로 변경
9. UI에 최종 영상 플레이어 및 배포 버튼 표시

**사용자 액션**:

- **배포하기**: 프로젝트 상태를 `"completed"`로 변경 → 배포 완료

**컴포넌트**:

- `ProjectFinalReviewForm`: 최종 영상 확인 및 배포 폼
- `ProjectFinalPlayer`: 최종 영상 플레이어 컴포넌트
- `ProjectDeployButton`: 배포 버튼 컴포넌트

### 8. 배포 (Distribution)

**트리거**: 사용자가 배포 버튼 클릭

**프로세스**:

1. `distribution` 단계 상태를 `"in_progress"`로 변경
2. 프로젝트 상태를 `"completed"`로 변경
3. (선택사항) n8n 웹훅 호출하여 실제 플랫폼에 업로드
4. `distribution` 단계 상태를 `"completed"`로 변경

**컴포넌트**:

- `ProjectDistributionForm`: 배포 설정 폼

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

### 프로젝트 단계 키 (`project_steps.key`)

- `"brief"`: 기획서 작성
- `"script"`: 스크립트 작성
- `"narration"`: 대사 생성
- `"images"`: 이미지 생성
- `"videos"`: 영상 생성
- `"final"`: 최종 편집
- `"distribution"`: 배포

## 프로젝트 리스트 네비게이션 로직

### 프로젝트 카드 클릭 시 동작

```typescript
function getProjectRoute(project: Project) {
  // 프로젝트 상태가 "completed"이면 분석 페이지로
  if (project.status === "completed") {
    return `/my/dashboard/project/${project.project_id}/analytics`;
  }

  // 그 외의 경우 (draft, generating, active)는 작업 공간으로
  return `/my/dashboard/project/${project.project_id}/workspace`;
}
```

### 작업 공간에서 중간 지점부터 재개

작업 공간 페이지는 현재 완료된 단계를 확인하고, 다음 단계부터 진행할 수 있도록 UI를 표시합니다.

**로직**:

1. `project_steps` 테이블에서 각 단계의 상태 조회
2. 마지막으로 완료된 단계 확인
3. 다음 단계부터 진행 가능하도록 UI 표시
4. 사용자가 이전 단계로 돌아가서 수정 가능

## Form 컴포넌트 설계

### 공통 Form Props

```typescript
type BaseReviewFormProps = {
  projectId: string;
  stepKey: ProjectStepKey;
  data: any; // 단계별 데이터
  onSubmit: (data: any) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
};
```

### 1. ProjectBriefReviewForm

**Props**:

```typescript
type ProjectBriefReviewFormProps = BaseReviewFormProps & {
  briefContent: string; // 마크다운 형식
  onEdit: () => void;
  onApprove: () => void;
};
```

**기능**:

- 기획서 내용 표시 (마크다운 렌더링)
- 수정하기 버튼 → 편집 모드 전환
- 이대로 제출 버튼 → 다음 단계 진행

### 2. ProjectBriefEditor

**Props**:

```typescript
type ProjectBriefEditorProps = {
  initialContent: string;
  onSave: (content: string) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
};
```

**기능**:

- 마크다운 에디터
- 저장 버튼 → n8n 웹훅 재호출
- 취소 버튼 → 리뷰 모드로 복귀

### 3. ProjectScriptReviewForm

**Props**:

```typescript
type ProjectScriptReviewFormProps = BaseReviewFormProps & {
  scriptContent: string | string[]; // 텍스트 또는 단락 배열
  onEdit: () => void;
  onApprove: () => void;
};
```

**기능**:

- 스크립트 내용 표시
- 수정하기 버튼 → 편집 모드 전환
- 이대로 제출 버튼 → 다음 단계 진행

### 4. ProjectScriptEditor

**Props**:

```typescript
type ProjectScriptEditorProps = {
  initialContent: string | string[];
  onSave: (content: string | string[]) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
};
```

**기능**:

- 스크립트 에디터 (단락별 편집 가능)
- 저장 버튼 → n8n 웹훅 재호출
- 취소 버튼 → 리뷰 모드로 복귀

### 5. ProjectNarrationReviewForm

**Props**:

```typescript
type ProjectNarrationReviewFormProps = BaseReviewFormProps & {
  audioSegments: Array<{
    id: number;
    label: string;
    src: string; // 오디오 URL
  }>;
  onRegenerate: () => void;
  onApprove: () => void;
};
```

**기능**:

- 오디오 세그먼트 플레이어 표시
- 재생성 버튼 → n8n 웹훅 재호출
- 이대로 제출 버튼 → 다음 단계 진행

### 6. ProjectImageReviewForm

**Props**:

```typescript
type ProjectImageReviewFormProps = BaseReviewFormProps & {
  images: Array<{
    id: number;
    url: string;
    thumbnail?: string;
  }>;
  selectedImages: number[];
  onToggleSelect: (id: number) => void;
  onRegenerate: (ids: number[]) => void;
  onApprove: () => void;
};
```

**기능**:

- 이미지 갤러리 표시
- 이미지 선택/해제
- 선택한 이미지 재생성 버튼 → n8n 웹훅 재호출
- 이대로 제출 버튼 → 선택한 이미지로 다음 단계 진행

### 7. ProjectVideoReviewForm

**Props**:

```typescript
type ProjectVideoReviewFormProps = BaseReviewFormProps & {
  videos: Array<{
    id: number;
    url: string;
    thumbnail?: string;
  }>;
  selectedVideos: number[];
  onToggleSelect: (id: number) => void;
  onRegenerate: (ids: number[]) => void;
  onApprove: () => void;
};
```

**기능**:

- 영상 플레이어 표시
- 영상 선택/해제
- 선택한 영상 재생성 버튼 → n8n 웹훅 재호출
- 이대로 제출 버튼 → 선택한 영상으로 다음 단계 진행

### 8. ProjectFinalReviewForm

**Props**:

```typescript
type ProjectFinalReviewFormProps = BaseReviewFormProps & {
  videoUrl: string;
  title: string;
  description: string;
  onDeploy: () => void;
};
```

**기능**:

- 최종 영상 플레이어 표시
- 제목/설명 표시
- 배포하기 버튼 → 프로젝트 상태를 `"completed"`로 변경

## Action 함수 설계

### 1. submitBriefFormAction

**경로**: `POST /my/dashboard/project/:projectId/brief/submit`

**기능**:

- 기획서 제출 (수정 없이 다음 단계로 진행)

### 2. updateBriefAction

**경로**: `POST /my/dashboard/project/:projectId/brief/update`

**기능**:

- 기획서 수정 → n8n 웹훅 재호출

### 3. submitScriptFormAction

**경로**: `POST /my/dashboard/project/:projectId/script/submit`

**기능**:

- 스크립트 제출 (수정 없이 다음 단계로 진행)

### 4. updateScriptAction

**경로**: `POST /my/dashboard/project/:projectId/script/update`

**기능**:

- 스크립트 수정 → n8n 웹훅 재호출

### 5. regenerateNarrationAction

**경로**: `POST /my/dashboard/project/:projectId/narration/regenerate`

**기능**:

- 대사 재생성 → n8n 웹훅 재호출

### 6. submitNarrationAction

**경로**: `POST /my/dashboard/project/:projectId/narration/submit`

**기능**:

- 대사 제출 → 다음 단계로 진행

### 7. regenerateImagesAction

**경로**: `POST /my/dashboard/project/:projectId/images/regenerate`

**기능**:

- 선택한 이미지들 재생성 → n8n 웹훅 재호출

### 8. submitImagesAction

**경로**: `POST /my/dashboard/project/:projectId/images/submit`

**기능**:

- 선택한 이미지들 제출 → 다음 단계로 진행

### 9. regenerateVideosAction

**경로**: `POST /my/dashboard/project/:projectId/videos/regenerate`

**기능**:

- 선택한 영상들 재생성 → n8n 웹훅 재호출

### 10. submitVideosAction

**경로**: `POST /my/dashboard/project/:projectId/videos/submit`

**기능**:

- 선택한 영상들 제출 → 다음 단계로 진행

### 11. deployProjectAction

**경로**: `POST /my/dashboard/project/:projectId/deploy`

**기능**:

- 프로젝트 배포 → 프로젝트 상태를 `"completed"`로 변경

## n8n 웹훅 엔드포인트 설계

### 1. Brief Generation Webhook

**경로**: `POST /api/n8n/workflows/brief-generation`

**요청 본문**:

```typescript
{
  projectId: string;
  projectData: {
    keyword: string;
    aspectRatio: string;
    formData: Record<string, string[]>; // ChatInitForm 데이터
  }
}
```

**응답**: 웹훅 URL 반환 (n8n이 작업 완료 시 호출할 URL)

### 2. Brief Complete Callback

**경로**: `POST /api/n8n/callbacks/brief-complete`

**요청 본문**:

```typescript
{
  projectId: string;
  briefContent: string; // 마크다운 형식
  metadata?: Record<string, unknown>;
}
```

**기능**:

- 기획서를 `project_documents` 테이블에 저장
- `brief` 단계 상태를 `"completed"`로 변경

### 3. Script Generation Webhook

**경로**: `POST /api/n8n/workflows/script-generation`

**요청 본문**:

```typescript
{
  projectId: string;
  briefContent: string;
}
```

### 4. Script Complete Callback

**경로**: `POST /api/n8n/callbacks/script-complete`

**요청 본문**:

```typescript
{
  projectId: string;
  scriptContent: string | string[]; // 텍스트 또는 단락 배열
  metadata?: Record<string, unknown>;
}
```

### 5. Narration Generation Webhook

**경로**: `POST /api/n8n/workflows/narration-generation`

**요청 본문**:

```typescript
{
  projectId: string;
  scriptContent: string | string[];
}
```

### 6. Narration Complete Callback

**경로**: `POST /api/n8n/callbacks/narration-complete`

**요청 본문**:

```typescript
{
  projectId: string;
  audioSegments: Array<{
    label: string;
    audioUrl: string; // Base64 또는 URL
  }>;
  metadata?: Record<string, unknown>;
}
```

**기능**:

- 오디오 파일을 Supabase Storage에 저장
- `project_media_assets` 테이블에 저장
- `narration` 단계 상태를 `"completed"`로 변경

### 7. Image Generation Webhook

**경로**: `POST /api/n8n/workflows/image-generation`

**요청 본문**:

```typescript
{
  projectId: string;
  scriptContent: string | string[];
  narrationSegments: Array<{ label: string; audioUrl: string }>;
}
```

### 8. Image Complete Callback

**경로**: `POST /api/n8n/callbacks/image-complete`

**요청 본문**:

```typescript
{
  projectId: string;
  images: Array<{
    url: string; // Base64 또는 URL
    timeline?: string;
  }>;
  metadata?: Record<string, unknown>;
}
```

### 9. Video Generation Webhook

**경로**: `POST /api/n8n/workflows/video-generation`

**요청 본문**:

```typescript
{
  projectId: string;
  selectedImages: number[]; // 선택한 이미지 ID들
  narrationSegments: Array<{ label: string; audioUrl: string }>;
}
```

### 10. Video Complete Callback

**경로**: `POST /api/n8n/callbacks/video-complete`

**요청 본문**:

```typescript
{
  projectId: string;
  videos: Array<{
    url: string; // Base64 또는 URL
    thumbnail?: string;
  }>;
  metadata?: Record<string, unknown>;
}
```

### 11. Final Editing Webhook

**경로**: `POST /api/n8n/workflows/final-editing`

**요청 본문**:

```typescript
{
  projectId: string;
  selectedVideo: number; // 선택한 영상 ID
}
```

### 12. Final Complete Callback

**경로**: `POST /api/n8n/callbacks/final-complete`

**요청 본문**:

```typescript
{
  projectId: string;
  finalVideoUrl: string;
  metadata?: Record<string, unknown>;
}
```

**기능**:

- 최종 영상을 Supabase Storage에 저장
- `projects` 테이블의 `video_url` 업데이트
- `final` 단계 상태를 `"completed"`로 변경

## 데이터베이스 스키마 활용

### projects 테이블

- `status`: 프로젝트 전체 상태 관리
- `video_url`: 최종 영상 URL

### project_steps 테이블

- 각 단계의 상태 추적
- `metadata`: 단계별 추가 정보 저장

### project_documents 테이블

- 기획서, 스크립트 등 문서 저장
- `type`: 문서 타입 (`"brief"`, `"script"` 등)
- `content`: 문서 내용 (텍스트 또는 JSON)

### project_media_assets 테이블

- 이미지, 영상, 오디오 자산 저장
- `type`: 자산 타입 (`"image"`, `"video"`, `"audio"`)
- `source_url`: Supabase Storage URL

## 구현 우선순위

### Phase 1: Form 컴포넌트 설계 (현재 단계)

1. ✅ `ProjectBriefReviewForm` 및 `ProjectBriefEditor`
2. ✅ `ProjectScriptReviewForm` 및 `ProjectScriptEditor`
3. ✅ `ProjectNarrationReviewForm`
4. ✅ `ProjectImageReviewForm`
5. ✅ `ProjectVideoReviewForm`
6. ✅ `ProjectFinalReviewForm`

### Phase 2: Action 함수 구현

1. 각 단계별 submit/update/regenerate action 함수
2. n8n 웹훅 호출 로직 (목업)

### Phase 3: 프로젝트 리스트 네비게이션 로직

1. 프로젝트 상태에 따른 라우팅 로직
2. 작업 공간에서 중간 지점부터 재개 로직

### Phase 4: n8n 웹훅 통합

1. 실제 n8n 웹훅 엔드포인트 구현
2. 콜백 처리 로직 구현
3. Supabase Storage 업로드 로직

## 참고사항

- 모든 Form은 n8n 웹훅 연결 전에 설계 및 구현
- n8n 웹훅은 목업 데이터로 먼저 테스트
- 각 단계의 상태는 `project_steps` 테이블에서 관리
- 프로젝트 전체 상태는 `projects.status`에서 관리
- 사용자는 언제든지 이전 단계로 돌아가서 수정 가능

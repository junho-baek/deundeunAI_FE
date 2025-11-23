# 프로젝트 워크플로우 구현 요약

## 완료된 작업

### 1. 설계 문서 작성 ✅
- `docs/features/project-workflow-design.md` 생성
- 전체 워크플로우 단계 정의
- Form 컴포넌트 설계
- Action 함수 설계
- n8n 웹훅 엔드포인트 설계

### 2. Form 컴포넌트 구현 ✅

#### Brief (기획서)
- ✅ `ProjectBriefReviewForm`: 기획서 확인 및 수정/제출 폼
- ✅ `ProjectBriefEditor`: 기획서 편집 컴포넌트 (마크다운 에디터)

#### Script (스크립트)
- ✅ `ProjectScriptReviewForm`: 스크립트 확인 및 수정/제출 폼
- ✅ `ProjectScriptEditor`: 스크립트 편집 컴포넌트 (단락별 편집)

#### Images & Videos
- ✅ 기존 컴포넌트 활용 (`ProjectImageSelect`, `ProjectVideoSelect`)
- `onRegenerate` 및 `onDone` 콜백 지원

### 3. 프로젝트 리스트 네비게이션 로직 ✅
- 프로젝트 상태에 따른 라우팅 구현
- `status === "completed"` → `/analytics`
- 그 외 (`draft`, `generating`, `active`) → `/workspace`

## 다음 단계 (구현 필요)

### 1. 나머지 Form 컴포넌트
- [ ] `ProjectNarrationReviewForm`: 대사 확인 및 재생성 폼
- [ ] `ProjectFinalReviewForm`: 최종 영상 확인 및 배포 폼

### 2. Action 함수 구현
각 단계별 submit/update/regenerate action 함수:

- [ ] `submitBriefFormAction`: 기획서 제출
- [ ] `updateBriefAction`: 기획서 수정
- [ ] `submitScriptFormAction`: 스크립트 제출
- [ ] `updateScriptAction`: 스크립트 수정
- [ ] `regenerateNarrationAction`: 대사 재생성
- [ ] `submitNarrationAction`: 대사 제출
- [ ] `regenerateImagesAction`: 이미지 재생성
- [ ] `submitImagesAction`: 이미지 제출
- [ ] `regenerateVideosAction`: 영상 재생성
- [ ] `submitVideosAction`: 영상 제출
- [ ] `deployProjectAction`: 프로젝트 배포

### 3. n8n 웹훅 통합 (목업)
- [ ] n8n 웹훅 호출 함수 (목업 데이터 반환)
- [ ] n8n 콜백 처리 함수 (Supabase 저장)

### 4. 작업 공간에서 중간 지점부터 재개 로직
- [ ] 완료된 단계 확인 로직
- [ ] 다음 단계부터 진행 가능하도록 UI 표시
- [ ] 이전 단계로 돌아가서 수정 가능하도록 구현

## 구현된 컴포넌트 위치

```
app/features/projects/components/
├── project-brief-review-form.tsx      ✅ 새로 생성
├── project-brief-editor.tsx           ✅ 새로 생성
├── project-script-review-form.tsx     ✅ 새로 생성
├── project-script-editor.tsx          ✅ 새로 생성
├── project-image-select.tsx           ✅ 기존 (활용)
└── project-video-select.tsx           ✅ 기존 (활용)
```

## 수정된 파일

- `app/features/projects/pages/project-list-page.tsx`: 프로젝트 상태에 따른 라우팅 로직 추가

## 사용 방법

### Brief Review Form 사용 예시

```tsx
import ProjectBriefReviewForm from "~/features/projects/components/project-brief-review-form";
import ProjectBriefEditor from "~/features/projects/components/project-brief-editor";

function BriefStep() {
  const [isEditing, setIsEditing] = React.useState(false);
  const briefContent = "..."; // DB에서 가져온 기획서 내용

  if (isEditing) {
    return (
      <ProjectBriefEditor
        projectId={projectId}
        initialContent={briefContent}
        onCancel={() => setIsEditing(false)}
        onSave={async (content) => {
          // n8n 웹훅 호출 또는 action 함수 호출
          await updateBriefAction(projectId, content);
          setIsEditing(false);
        }}
      />
    );
  }

  return (
    <ProjectBriefReviewForm
      projectId={projectId}
      briefContent={briefContent}
      onEdit={() => setIsEditing(true)}
      onApprove={async () => {
        // 다음 단계로 진행
        await submitBriefFormAction(projectId);
      }}
    />
  );
}
```

### Script Review Form 사용 예시

```tsx
import ProjectScriptReviewForm from "~/features/projects/components/project-script-review-form";
import ProjectScriptEditor from "~/features/projects/components/project-script-editor";

function ScriptStep() {
  const [isEditing, setIsEditing] = React.useState(false);
  const scriptContent = ["단락 1", "단락 2"]; // DB에서 가져온 스크립트

  if (isEditing) {
    return (
      <ProjectScriptEditor
        projectId={projectId}
        initialContent={scriptContent}
        onCancel={() => setIsEditing(false)}
        onSave={async (content) => {
          await updateScriptAction(projectId, content);
          setIsEditing(false);
        }}
      />
    );
  }

  return (
    <ProjectScriptReviewForm
      projectId={projectId}
      scriptContent={scriptContent}
      onEdit={() => setIsEditing(true)}
      onApprove={async () => {
        await submitScriptFormAction(projectId);
      }}
    />
  );
}
```

## 다음 구현 단계

1. **나머지 Form 컴포넌트 구현** (Narration, Final)
2. **Action 함수 구현** (목업 데이터로 먼저 테스트)
3. **작업 공간 페이지 통합** (각 단계별 Form 컴포넌트 연결)
4. **n8n 웹훅 통합** (실제 n8n 연결)

## 참고사항

- 모든 Form은 n8n 웹훅 연결 전에 설계 및 구현 완료
- Action 함수는 목업 데이터로 먼저 테스트 가능
- 프로젝트 상태는 `projects.status` 필드에서 관리
- 각 단계 상태는 `project_steps.status` 필드에서 관리


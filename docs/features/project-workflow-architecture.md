# 프로젝트 워크플로우 아키텍처 설계

## 개요

프로젝트 생성부터 완료까지의 전체 워크플로우를 DB 기반으로 관리하고, n8n과 공유 가능한 데이터 구조를 설계했습니다. Mock 응답을 가정하여 모든 아키텍처를 구성했습니다.

## 1. Schema 확장

### 1.1 `projectMessages` 테이블 개선

채팅 내역 저장을 위해 다음 필드 추가:

```typescript
- attachments: jsonb // 첨부 파일 정보 (이미지 등)
- aspectRatio: text // 비율 정보 ("9:16", "16:9", "1:1")
- stepKey: projectStepKeyEnum // 어떤 스텝에서 생성된 메시지인지
```

**n8n 연동**: `payload`와 `metadata` 필드를 통해 n8n에서 필요한 모든 정보를 저장/공유 가능

### 1.2 기존 테이블 활용

- `project_documents`: 기획서, 대본 저장
- `project_audio_segments`: 나레이션 오디오 세그먼트 저장
- `project_media_assets`: 이미지/비디오 자산 저장
- `project_steps`: 각 단계별 상태 관리

## 2. 쿼리 함수 구조

### 2.1 채팅 메시지 (`queries/messages.ts`)

```typescript
// 채팅 내역 조회
getProjectMessages(client, projectId): Promise<ProjectMessage[]>

// 단일 메시지 저장
saveProjectMessage(client, {...}): Promise<string>

// 여러 메시지 일괄 저장 (초기 채팅 등)
saveProjectMessages(client, {...}): Promise<string[]>
```

**특징**:

- 프로젝트 생성 시 초기 채팅 자동 저장
- 프로젝트 로드 시 채팅 내역 복원
- n8n과 공유 가능한 데이터 구조

### 2.2 스텝별 데이터 (`queries/steps.ts`)

```typescript
// 스텝별 완료 데이터 저장
saveStepData(client, {
  projectId,
  stepKey: "brief" | "script" | "narration" | "images" | "videos" | "final",
  data: {
    content?: string,           // 기획서: markdown
    contentJson?: string[],     // 대본: paragraph array
    audioSegments?: [...],      // 나레이션: audio segments
    mediaAssets?: [...],        // 이미지/비디오: media assets
    videoUrl?: string,          // 최종 비디오 URL
    metadata?: {...}
  }
}): Promise<void>

// 스텝별 데이터 로드
loadStepData(client, { projectId, stepKey }): Promise<StepData | null>
```

**특징**:

- 각 스텝별로 적절한 테이블에 저장
- n8n에서 동일한 구조로 데이터 읽기/쓰기 가능
- Human-in-the-loop: 완료 버튼 클릭 시에만 DB 저장

## 3. 프로젝트 생성 플로우

### 3.1 초기 채팅 저장

프로젝트 생성 시 (`project-create-page.tsx`):

1. 프로젝트 생성
2. 프로젝트 단계 초기화
3. **초기 채팅 내역 DB 저장**:
   - 사용자 메시지 (키워드, 비율, 첨부파일)
   - 에이전트 응답 (초기 안내)
4. n8n 웹훅 트리거

### 3.2 프로젝트 로드 시 복원

프로젝트 상세 페이지 로드 시 (`project-detail-layout.tsx`):

1. DB에서 저장된 채팅 내역 조회
2. 저장된 메시지가 있으면 우선 사용
3. 없으면 쿼리 파라미터에서 초기 채팅 생성

**결과**: 프로젝트 카드 클릭 시 이전 대화 내역 그대로 복원

## 4. Human-in-the-Loop 개선

### 4.1 Attention 효과 최소화

`chat-confirm-card.tsx`:

- `shake`, `bounce` 효과 제거
- `pulse`만 유지 (너무 흔들리지 않도록)

### 4.2 완료 시 DB 저장

각 스텝별 완료 버튼 클릭 시:

1. 스텝 상태를 `completed`로 변경
2. **스텝별 데이터를 DB에 저장** (`saveStepData`)
3. 다음 스텝을 `in_progress`로 시작
4. n8n 웹훅 트리거

**중요**: 완료 버튼을 눌러야만 DB에 저장됨 (임시 저장 없음)

## 5. 각 스텝별 데이터 저장 구조

### 5.1 Brief (기획서)

```typescript
saveStepData(client, {
  projectId,
  stepKey: "brief",
  data: {
    content: "# 기획서 마크다운...",
    metadata: { ... }
  }
})
```

**저장 위치**: `project_documents` 테이블 (`type = "brief"`)

### 5.2 Script (대본)

```typescript
saveStepData(client, {
  projectId,
  stepKey: "script",
  data: {
    contentJson: [
      "00:00-00:05\n\n첫 번째 문단...",
      "00:06-00:12\n\n두 번째 문단...",
    ],
    metadata: { ... }
  }
})
```

**저장 위치**: `project_documents` 테이블 (`type = "script"`)

### 5.3 Narration (나레이션)

```typescript
saveStepData(client, {
  projectId,
  stepKey: "narration",
  data: {
    audioSegments: [
      {
        label: "00:00–00:10",
        audioUrl: "https://...",
        durationMs: 10000
      },
      ...
    ],
    metadata: { ... }
  }
})
```

**저장 위치**: `project_audio_segments` 테이블

### 5.4 Images (이미지)

```typescript
saveStepData(client, {
  projectId,
  stepKey: "images",
  data: {
    mediaAssets: [
      {
        type: "image",
        sourceUrl: "https://...",
        previewUrl: "https://...",
        label: "이미지 1",
        timelineLabel: "00:00–00:05",
        selected: true
      },
      ...
    ],
    metadata: { ... }
  }
})
```

**저장 위치**: `project_media_assets` 테이블 (`type = "image"`)

### 5.5 Videos (비디오)

```typescript
saveStepData(client, {
  projectId,
  stepKey: "videos",
  data: {
    mediaAssets: [
      {
        type: "video",
        sourceUrl: "https://...",
        previewUrl: "https://...",
        label: "비디오 1",
        timelineLabel: "00:00–00:05",
        selected: true
      },
      ...
    ],
    metadata: { ... }
  }
})
```

**저장 위치**: `project_media_assets` 테이블 (`type = "video"`)

### 5.6 Final (최종 비디오)

```typescript
saveStepData(client, {
  projectId,
  stepKey: "final",
  data: {
    videoUrl: "https://...",
    metadata: { ... }
  }
})
```

**저장 위치**: `projects` 테이블 (`video_url` 필드)

## 6. n8n 연동 포인트

### 6.1 웹훅 트리거

각 스텝 시작 시 n8n 웹훅 호출:

```typescript
triggerProjectStepStartWebhook({
  project_id: string,
  step_key: "brief" | "script" | ...,
  step_status: "in_progress",
  started_at: string,
  metadata?: Record<string, unknown>
})
```

### 6.2 데이터 구조 공유

n8n에서 사용할 수 있는 컬럼 구조:

- `project_messages`: 채팅 내역
  - `attachments`, `aspectRatio`, `stepKey` 필드로 n8n에서 필요한 정보 추출 가능
- `project_documents`: 기획서, 대본
  - `content` (markdown), `content_json` (array) 필드
- `project_audio_segments`: 나레이션
  - `label`, `audio_url`, `duration_ms` 필드
- `project_media_assets`: 이미지/비디오
  - `type`, `source_url`, `preview_url`, `selected` 필드

### 6.3 Mock 응답 처리

현재는 Mock 데이터를 사용하지만, n8n 연동 시:

1. n8n에서 웹훅 수신
2. AI/외부 서비스 호출
3. 결과를 동일한 구조로 DB에 저장 (`saveStepData` 사용)
4. 프론트엔드에서 폴링하여 상태 업데이트

## 7. 로딩/완료 상태 관리

### 7.1 DB 기반 상태 관리

- `project_steps` 테이블의 `status` 필드 사용
- `pending` → `in_progress` → `completed` 흐름
- 폴링을 통해 실시간 상태 동기화 (`useProjectStepStatus`)

### 7.2 UI 반영

- `loading.brief`, `loading.script` 등 props로 전달
- `done.brief`, `done.script` 등 완료 상태 표시
- Human-in-the-loop 카드: 완료 버튼 클릭 시에만 다음 단계 진행

## 8. 구현 완료 사항

✅ Schema 확장 (`projectMessages` 개선)
✅ 쿼리 함수 추가 (`messages.ts`, `steps.ts`)
✅ 프로젝트 생성 시 초기 채팅 DB 저장
✅ 프로젝트 로드 시 채팅 내역 복원
✅ Human-in-the-loop 카드 attention 효과 최소화
✅ 각 스텝별 완료 시 DB 저장 구조 설계

## 9. 다음 단계 (구현 필요)

- [ ] 각 스텝별 action 파일에서 `saveStepData` 호출 추가
  - `project-brief-submit-action.tsx`
  - `project-script-submit-action.tsx`
  - `project-narration-submit-action.tsx`
  - `project-images-submit-action.tsx`
  - `project-videos-submit-action.tsx`
  - `project-deploy-action.tsx`
- [ ] n8n 웹훅 응답 처리 로직 구현
- [ ] Mock 데이터를 실제 n8n 응답으로 교체

## 10. 데이터 흐름도

```
1. 프로젝트 생성
   ↓
2. 초기 채팅 DB 저장
   ↓
3. n8n 웹훅 트리거 (brief 시작)
   ↓
4. 사용자가 기획서 확인/수정
   ↓
5. 완료 버튼 클릭 → DB 저장 (`saveStepData`)
   ↓
6. 다음 스텝 시작 (script)
   ↓
7. 반복...
```

## 11. 주요 특징

1. **영속성**: 모든 대화 내역과 작업물이 DB에 저장되어 복원 가능
2. **n8n 호환**: 동일한 데이터 구조로 n8n과 공유 가능
3. **Human-in-the-loop**: 완료 버튼 클릭 시에만 저장 (임시 저장 없음)
4. **상태 동기화**: DB 기반 상태 관리로 실시간 동기화
5. **Mock 지원**: Mock 응답을 가정하여 전체 아키텍처 설계 완료

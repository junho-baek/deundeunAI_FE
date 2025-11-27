# 프로젝트 Pages 아키텍처 분석

## 개요

`app/features/projects/pages` 폴더는 프로젝트 관련 페이지 컴포넌트와 서버 액션 함수들을 포함하고 있습니다. 이 폴더는 프로젝트의 전체 라이프사이클을 관리하는 핵심 UI와 로직을 담당합니다.

## 파일 구조

### 페이지 컴포넌트 (Page Components)

#### 1. `project-workspace-page.tsx` (1,509 lines)
**역할**: 프로젝트 워크스페이스 메인 페이지

**주요 기능**:
- 프로젝트 워크플로우의 6단계를 관리하는 통합 UI
  - Step 1: 수익형 콘텐츠 기획서 (Brief)
  - Step 2: 대본 작성 (Script)
  - Step 3: 나레이션 확인하기 (Narration)
  - Step 4: 생성된 이미지 (Images)
  - Step 5: 생성된 영상 확인하기 (Videos)
  - Step 6: 편집된 영상 확인 및 업로드 (Final)

**핵심 로직**:
- `loader`: 프로젝트 워크스페이스 데이터, 단계 정보, short workflow jobs/images 조회
- `clientLoader`: 클라이언트 사이드에서 short workflow jobs 사전 로드
- 실시간 업데이트: `useRealtime` 훅으로 short_workflow_jobs, short_workflow_images 구독
- 단계별 상태 관리: `useProjectDetail` 훅으로 각 단계의 로딩/완료 상태 관리
- Optimistic UI: fetcher 상태를 기반으로 즉각적인 UI 피드백 제공

**데이터 소스 우선순위**:
1. Short Workflow Jobs (최신 생성된 초안)
2. 데이터베이스 문서 (documents 테이블)
3. 미디어 자산 (media_assets 테이블)

**이벤트 시스템**:
- `project:short-workflow-ready`: 쇼츠 초안 준비 완료
- `project:script-ready`: 대본 준비 완료
- `project:narration-ready`: 나레이션 준비 완료
- `project:images-ready`: 이미지 준비 완료
- `project:brief-edit`, `project:brief-submit`: 기획서 편집/제출
- `project:script-edit`, `project:script-submit`: 대본 편집/제출
- `project:narration-regenerate`, `project:narration-submit`: 나레이션 재생성/제출

#### 2. `project-create-page.tsx` (282 lines)
**역할**: 새 프로젝트 생성 페이지

**주요 기능**:
- 프로젝트 생성 폼 처리
- 키워드 기반 프로젝트 초기화
- 초기 프로젝트 단계 생성
- Short Workflow Keyword 생성

**폼 스키마** (`formSchema`):
```typescript
{
  keyword: string (1-100자)
  aspectRatio: "9:16" | "16:9" | "1:1" (선택)
  projectId: UUID (선택, 없으면 자동 생성)
  images: File[] (선택)
}
```

**프로세스**:
1. 폼 검증 (Zod)
2. 프로젝트 UUID 생성
3. 프로젝트 생성 (제목/설명 자동 생성)
4. 초기 프로젝트 단계 생성
5. Short Workflow Keyword 생성
6. 초기 채팅 메시지 저장
7. 프로젝트 워크스페이스로 리다이렉트

#### 3. `project-list-page.tsx` (298 lines)
**역할**: 프로젝트 목록 페이지

**주요 기능**:
- 프로젝트 목록 조회 (페이지네이션 지원)
- 필터링 및 정렬
- 검색 기능

**필터 옵션**:
- 정렬: 최신순, 오래된순, 인기순 등 (`SORT_OPTIONS`)
- 기간: 전체, 오늘, 이번 주, 이번 달 등 (`PERIOD_OPTIONS`)
- 키워드 검색
- 상태 필터

**데이터 로딩**:
- 병렬로 프로젝트 목록과 총 페이지 수 조회
- 비로그인 사용자도 접근 가능 (선택적 인증)

#### 4. `project-analytics-page.tsx` (400 lines)
**역할**: 프로젝트 분석 및 성과 페이지

**주요 기능**:
- 프로젝트 수익 분석
- 성과 지표 표시 (조회수, 좋아요, CTR, 도달수)
- 수익 추이 차트 (최근 6개월)
- 하이라이트 및 추천사항 표시
- 채널 링크 관리

**데이터 구조**:
- `analytics`: 프로젝트 분석 데이터
- `revenueForecasts`: 수익 예측 데이터 (6개월)
- `ownerSlug`: 프로필 슬러그 (공개 프로필 링크용)

### 서버 액션 함수 (Server Actions)

#### 제출 액션 (Submit Actions)

##### 1. `project-brief-submit-action.tsx` (194 lines)
**역할**: 기획서 제출 및 다음 단계(script) 시작

**프로세스**:
1. Short Workflow Job ID 검증
2. Job 상태를 "reserve"로 변경
3. 기획서 내용 저장 (metadata 포함)
4. Brief 단계를 "completed"로 변경
5. Script 단계를 "in_progress"로 시작
6. n8n 웹훅 호출 (Step 2 시작)

**데이터 처리**:
- FormData에서 brief form values 추출
- Job에서 기획서 데이터 파생
- 마크다운 형식으로 변환하여 저장

##### 2. `project-script-submit-action.tsx` (94 lines)
**역할**: 대본 제출 및 다음 단계(narration) 시작

**프로세스**:
1. Script 단계 완료 여부 확인
2. 대본 데이터 저장 (content_json 또는 content)
3. Script 단계를 "completed"로 변경
4. Narration 단계를 "in_progress"로 시작
5. n8n 웹훅 호출 (나레이션 생성 시작)

##### 3. `project-narration-submit-action.tsx` (84 lines)
**역할**: 나레이션 제출 및 다음 단계(images) 시작

**프로세스**:
1. Narration 단계 완료 여부 확인
2. 오디오 세그먼트 데이터 저장
3. Narration 단계를 "completed"로 변경
4. Images 단계를 "in_progress"로 시작
5. n8n 웹훅 호출 (이미지 생성 시작)

##### 4. `project-images-submit-action.tsx` (126 lines)
**역할**: 이미지 제출 및 다음 단계(videos) 시작

**프로세스**:
1. 선택된 이미지 ID 검증 (Zod)
2. 선택된 이미지 데이터 저장
3. Images 단계를 "completed"로 변경
4. Videos 단계를 "in_progress"로 시작
5. n8n 웹훅 호출 (영상 생성 시작, 선택된 이미지 ID 포함)

##### 5. `project-videos-submit-action.tsx` (109 lines)
**역할**: 영상 제출 및 다음 단계(final) 시작

**프로세스**:
1. 선택된 비디오 ID 검증
2. 비디오 데이터 저장
3. Videos 단계를 "completed"로 변경
4. Final 단계를 "in_progress"로 시작

#### 업데이트 액션 (Update Actions)

##### 1. `project-brief-update-action.tsx` (130 lines)
**역할**: 기획서 내용 업데이트 (편집 저장)

**프로세스**:
1. FormData에서 brief form values 추출
2. 기획서 문서 업데이트
3. Metadata 저장

##### 2. `project-script-update-action.tsx` (129 lines)
**역할**: 대본 내용 업데이트 (편집 저장)

**프로세스**:
1. 대본 내용 검증
2. Script 문서 업데이트 (content_json 또는 content)
3. 변경사항 저장

#### 재생성 액션 (Regenerate Actions)

##### 1. `project-narration-regenerate-action.tsx` (57 lines)
**역할**: 나레이션 재생성

**프로세스**:
1. Narration 단계를 "pending"으로 리셋
2. n8n 웹훅 호출 (나레이션 재생성)

##### 2. `project-images-regenerate-action.tsx` (98 lines)
**역할**: 선택된 이미지 재생성

**프로세스**:
1. 선택된 이미지 ID 검증
2. Images 단계를 "pending"으로 리셋
3. n8n 웹훅 호출 (이미지 재생성, 선택된 이미지 ID 포함)

##### 3. `project-videos-regenerate-action.tsx` (80 lines)
**역할**: 선택된 영상 재생성

**프로세스**:
1. 선택된 비디오 ID 검증
2. Videos 단계를 "pending"으로 리셋
3. n8n 웹훅 호출 (영상 재생성)

#### 기타 액션

##### 1. `project-form-submit-action.tsx` (157 lines)
**역할**: 프로젝트 시작 폼 제출

**프로세스**:
1. 폼 데이터 파싱 (카테고리, 이미지 모델 등)
2. Short Workflow Keyword 생성/업데이트
3. 프로젝트 metadata 업데이트
4. 프로젝트 메시지 저장
5. Brief 단계를 "in_progress"로 시작
6. n8n 웹훅 호출 (프로젝트 시작)

##### 2. `project-status-action.tsx` (267 lines)
**역할**: 프로젝트 단계 상태 업데이트 (범용)

**주요 기능**:
- 단계별 상태 변경 (pending, in_progress, blocked, completed)
- 크레딧 차감 로직 (in_progress 시작 시)
- 후불 크레딧 요청 지원
- 중복 처리 방지
- n8n 웹훅 트리거

**크레딧 처리**:
- 단계별 필요 크레딧 계산
- 잔액 확인 및 부족 시 후불 요청 또는 충전 안내
- 크레딧 사용 내역 기록

##### 3. `project-deploy-action.tsx` (79 lines)
**역할**: 프로젝트 배포 및 완료 처리

**프로세스**:
1. 최종 비디오 URL 저장
2. Final 단계를 "completed"로 변경
3. Distribution 단계를 "completed"로 변경
4. 프로젝트 상태를 "completed"로 변경
5. published_at 타임스탬프 설정

##### 4. `project-reference-submit-action.tsx` (105 lines)
**역할**: 참고 자료 제출

**프로세스**:
1. 참고 자료 데이터 저장
2. 프로젝트 metadata 업데이트

### 간단한 페이지 컴포넌트

다음 파일들은 단순히 다른 페이지로 리다이렉트하거나 기본 레이아웃만 제공합니다:

- `project-status-page.tsx` (22 lines)
- `project-preview-page.tsx` (19 lines)
- `project-realtime-page.tsx` (19 lines)
- `project-generate-page.tsx` (22 lines)
- `project-upload-page.tsx` (22 lines)

## 데이터 흐름

### 워크플로우 단계 진행

```
1. Brief (기획서)
   ↓ [brief-submit]
2. Script (대본)
   ↓ [script-submit]
3. Narration (나레이션)
   ↓ [narration-submit]
4. Images (이미지)
   ↓ [images-submit]
5. Videos (영상)
   ↓ [videos-submit]
6. Final (최종)
   ↓ [deploy]
Completed (완료)
```

### 상태 관리

각 단계는 다음 상태를 가질 수 있습니다:
- `pending`: 대기 중
- `in_progress`: 진행 중
- `blocked`: 차단됨
- `completed`: 완료됨

### 데이터 저장 위치

1. **프로젝트 메타데이터**: `projects` 테이블의 `metadata` JSONB 필드
2. **단계별 데이터**: `project_step_data` 테이블
3. **문서**: `project_documents` 테이블 (brief, script)
4. **미디어 자산**: `project_media_assets` 테이블 (images, videos)
5. **오디오 세그먼트**: `project_audio_segments` 테이블
6. **Short Workflow**: `short_workflow_jobs`, `short_workflow_images` 테이블

## 외부 통합

### n8n 웹훅

다음 시점에 n8n 웹훅이 호출됩니다:
- 프로젝트 시작 (`triggerProjectStartWebhook`)
- 단계 시작 (`triggerProjectStepStartWebhook`)
- Step 2 시작 (`triggerShortWorkflowStepTwoWebhook`)

### 실시간 업데이트

- Supabase Realtime을 통해 `short_workflow_jobs`, `short_workflow_images` 테이블 변경사항 구독
- `useRealtime` 훅 사용

## 에러 처리

모든 액션 함수는 다음과 같은 에러 처리 패턴을 따릅니다:

1. HTTP 메서드 검증
2. 프로젝트 ID 검증
3. 인증 확인
4. 비즈니스 로직 검증
5. 데이터베이스 작업
6. 에러 발생 시 적절한 HTTP 상태 코드와 메시지 반환

## 보안 고려사항

1. **인증**: 모든 액션에서 `getLoggedInUserId` 또는 `getLoggedInProfileId` 호출
2. **소유권 확인**: 프로젝트 소유자만 접근 가능
3. **입력 검증**: Zod 스키마를 통한 폼 데이터 검증
4. **중복 처리 방지**: 단계 상태 확인을 통한 중복 제출 방지

## 성능 최적화

1. **병렬 데이터 로딩**: `Promise.all`을 사용한 병렬 쿼리
2. **Optimistic UI**: Fetcher 상태를 활용한 즉각적인 UI 피드백
3. **클라이언트 사이드 캐싱**: `clientLoader`를 통한 데이터 사전 로드
4. **조건부 렌더링**: 데이터 존재 여부에 따른 컴포넌트 렌더링

## 개선 제안

1. **타입 안정성**: 일부 `any` 타입을 더 구체적인 타입으로 개선
2. **에러 메시지**: 사용자 친화적인 에러 메시지 개선
3. **로딩 상태**: 더 세밀한 로딩 상태 관리
4. **테스트**: 각 액션 함수에 대한 단위 테스트 추가
5. **문서화**: JSDoc 주석 보강


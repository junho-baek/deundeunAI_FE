# 프로젝트 잠재적 문제 분석 (중요도 순)

## 🔴 1. Race Condition: selectedJobId 자동 선택 로직 (Critical)

**위치**: `app/features/projects/pages/project-workspace-page.tsx:662-730`

**문제점**:
- `selectedJobId` 자동 선택 로직이 복잡한 조건문과 여러 useEffect에 분산되어 있음
- `shortWorkflowJobs` 업데이트, `isBriefLockedForJobSelection` 변경, 리얼타임 업데이트가 동시에 발생할 때 예상치 못한 동작 가능
- `selectedJobId`가 여러 번 변경되면서 불필요한 리렌더링 발생 가능

**영향**:
- 기획서가 사라지거나 잘못된 job이 선택될 수 있음
- 사용자 경험 저하 (화면 깜빡임, 로딩 스피너 지속)

**해결 방안**:
```typescript
// useMemo로 선택 로직을 단순화하고, useEffect는 최소화
const selectedJobId = React.useMemo(() => {
  if (shortWorkflowJobs.length === 0) return null;
  
  if (isBriefLockedForJobSelection) {
    const nonWaitJob = shortWorkflowJobs.find((job) => job.status !== "wait");
    return nonWaitJob?.id ?? null;
  }
  
  // 우선순위 기반 선택 로직을 한 곳에 집중
  const nonWaitJobWithAudio = shortWorkflowJobs.find(
    (job) => job.status !== "wait" && job.audio_file
  );
  // ... 나머지 로직
}, [shortWorkflowJobs, isBriefLockedForJobSelection]);
```

---

## 🟠 2. 트랜잭션 부재로 인한 데이터 일관성 문제 (High)

**위치**: 
- `app/features/projects/pages/project-brief-submit-action.tsx:123-181`
- `app/features/projects/pages/project-narration-submit-action.tsx:91-95`

**문제점**:
- 여러 DB 업데이트가 순차적으로 실행되지만 트랜잭션으로 묶여있지 않음
- 중간에 실패하면 부분적으로만 업데이트된 상태로 남을 수 있음
- 예: `short_workflow_jobs` 업데이트 성공 → `project_steps` 업데이트 실패 시 불일치 상태

**영향**:
- 데이터 불일치로 인한 버그 발생 가능
- 복구가 어려운 상태로 남을 수 있음

**해결 방안**:
```typescript
// Supabase RPC를 사용하여 트랜잭션 처리
await client.rpc('update_brief_with_transaction', {
  job_id: jobRecord.id,
  project_id: projectRowId,
  brief_content: finalBriefContent,
  // ...
});
```

---

## 🟡 3. Optimistic Update와 DB 상태 동기화 문제 (Medium)

**위치**: `app/features/projects/layouts/project-detail-layout.tsx:443-465`

**문제점**:
- `optimisticLoading`, `optimisticDone`과 실제 DB 상태(`loading`, `done`)가 분리되어 있음
- 네트워크 지연이나 실패 시 optimistic 상태가 롤백되지 않을 수 있음
- 폴링(3초 간격)과 optimistic update가 충돌할 수 있음

**영향**:
- UI가 실제 상태와 다를 수 있음
- 사용자가 완료된 것으로 보이지만 실제로는 실패한 경우

**해결 방안**:
- Fetcher의 `state`를 더 적극적으로 활용하여 optimistic update 관리
- 에러 발생 시 명시적으로 optimistic 상태 롤백

---

## 🟡 4. 중복 DB 조회로 인한 성능 문제 (Medium)

**위치**: 
- `app/features/projects/pages/project-narration-submit-action.tsx:41-75`
- `app/features/projects/pages/project-brief-submit-action.tsx:80-109`

**문제점**:
- `getProjectWorkspaceData` 호출 후 다시 `getShortWorkflowJobsByProject` 호출
- `getProjectWorkspaceData` 내부에서 이미 프로젝트를 조회했는데, 다시 조회하는 경우가 있음
- 리얼타임 업데이트 시 전체 데이터를 다시 가져옴 (증분 업데이트 없음)

**영향**:
- 불필요한 네트워크 요청으로 인한 성능 저하
- DB 부하 증가

**해결 방안**:
- 조회 결과를 재사용하거나, 필요한 데이터만 조회하는 함수로 분리
- 리얼타임 업데이트 시 payload의 변경된 데이터만 반영

---

## 🟢 5. 웹훅 실패 시 롤백 부재 (Low-Medium)

**위치**: 
- `app/features/projects/pages/project-brief-submit-action.tsx:159-166`
- `app/features/projects/pages/project-narration-submit-action.tsx:99-111`

**문제점**:
- 웹훅 호출 실패 시에도 DB 업데이트는 완료됨
- n8n 워크플로우가 실행되지 않아도 사용자는 완료된 것으로 보임
- 재시도 메커니즘이 없음

**영향**:
- 워크플로우가 실행되지 않아 후속 단계가 진행되지 않을 수 있음
- 사용자는 완료된 것으로 생각하지만 실제로는 처리되지 않음

**해결 방안**:
- 웹훅 실패 시 재시도 큐에 추가하거나, 상태를 "pending_webhook"으로 표시
- 또는 웹훅을 비동기로 처리하고 별도 워커에서 재시도

---

## 추가 개선 사항

### 6. useEffect 의존성 배열 복잡성
- `project-workspace-page.tsx`의 여러 useEffect가 복잡한 의존성을 가짐
- `useMemo`와 `useCallback`을 더 적극 활용하여 불필요한 재실행 방지

### 7. 에러 바운더리 부족
- Action 함수에서 에러가 발생해도 사용자에게 명확한 피드백이 부족할 수 있음
- React Error Boundary를 추가하여 예상치 못한 에러 처리

### 8. 타입 안정성
- `any` 타입 사용이 일부 있음 (`project-narration-submit-action.tsx:51`)
- 더 엄격한 타입 정의 필요

### 9. 리얼타임 구독 최적화
- 리얼타임 업데이트 시 전체 데이터를 다시 가져오는 대신, payload의 변경사항만 반영
- Debounce를 적용하여 빠른 연속 업데이트 처리

### 10. 로딩 상태 관리
- 여러 로딩 상태(`optimisticLoading`, `loading`, `briefCardLoading`)가 혼재하여 복잡함
- 단일 소스 of truth로 통합 고려


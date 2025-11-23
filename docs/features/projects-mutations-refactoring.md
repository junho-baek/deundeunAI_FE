# 프로젝트 Mutations 분리 및 인증 유틸리티 적용

## 적용 완료 사항

### 1. ✅ Mutations 파일 분리

**생성된 파일**: `app/features/projects/mutations.ts`

**분리된 함수들**:
- `createProject` - 프로젝트 생성
- `updateProject` - 프로젝트 업데이트
- `deleteProject` - 프로젝트 삭제
- `updateProjectStep` - 프로젝트 단계 상태 업데이트
- `createInitialProjectSteps` - 프로젝트 초기 단계 생성

**하위 호환성**: `queries.ts`에서 re-export하여 기존 코드와 호환성 유지

```typescript
// app/features/projects/queries.ts
export {
  createProject,
  updateProject,
  deleteProject,
  updateProjectStep,
  createInitialProjectSteps,
} from "./mutations";
```

### 2. ✅ 인증 유틸리티 함수 추가

**추가된 함수들** (`app/features/users/queries.ts`):
- `getLoggedInUserId(client)` - 로그인한 사용자 ID 반환 (인증 체크 포함)
- `getLoggedInProfileId(client)` - 로그인한 사용자의 프로필 ID 반환 (인증 체크 + 프로필 조회)

**특징**:
- 로그인하지 않은 경우 자동으로 `/auth/login`으로 리다이렉트
- 코드 중복 제거
- 일관된 인증 체크

### 3. ✅ 기존 코드 리팩토링

**변경된 파일들**:

#### `project-create-page.tsx`
- **변경 전**: `client.auth.getUser()` + `getUserById()` 직접 호출
- **변경 후**: `getLoggedInProfileId()` 사용
- **효과**: 코드 간소화, 에러 처리 일관성 향상

#### `project-status-action.tsx`
- **변경 전**: 인증 체크 없음
- **변경 후**: `getLoggedInUserId()` 추가
- **효과**: 보안 강화, 인증 체크 일관성

## 적용 패턴

### 패턴 1: Mutations 분리

**원칙**:
- `queries.ts`: 데이터 조회 (SELECT)
- `mutations.ts`: 데이터 변경 (INSERT, UPDATE, DELETE)

**장점**:
- 관심사 분리
- 코드 가독성 향상
- 테스트 용이성 향상

### 패턴 2: 인증 유틸리티 함수

**사용 예시**:

```typescript
// Loader에서 인증 체크만 필요한 경우
export const loader = async ({ request }: Route.LoaderArgs) => {
  const { client } = makeSSRClient(request);
  await getLoggedInUserId(client); // 인증 체크만
  // ... 나머지 로직
};

// Action에서 userId가 필요한 경우
export const action = async ({ request }: Route.ActionArgs) => {
  const { client } = makeSSRClient(request);
  const userId = await getLoggedInUserId(client); // userId 반환
  // ... 나머지 로직
};

// Action에서 profileId가 필요한 경우
export const action = async ({ request }: Route.ActionArgs) => {
  const { client } = makeSSRClient(request);
  const profileId = await getLoggedInProfileId(client); // profileId 반환
  // ... 나머지 로직
};
```

## 완료된 추가 작업

### 1. ✅ 나머지 파일에도 `getLoggedInUserId` 적용

**적용된 파일들**:
- `subscribe-action.tsx` - `getLoggedInProfileId` 적용 (필수 인증)
- `dashboard-page.tsx` - 선택적 인증으로 `getLoggedInProfileId` 적용
- `profile-page.tsx` - 선택적 인증으로 `getLoggedInProfileId` 적용
- `project-list-page.tsx` - 선택적 인증으로 `getLoggedInProfileId` 적용

**선택적 인증 패턴**:
```typescript
// 로그인하지 않아도 접근 가능한 페이지의 경우
let profileId: string | undefined = undefined;
try {
  profileId = await getLoggedInProfileId(client);
} catch (error: any) {
  // redirect 에러는 무시 (로그인하지 않은 경우)
  if (error && typeof error === "object" && "status" in error) {
    // 계속 진행
  }
}
```

### 2. ✅ Import 경로 정리

**변경된 파일**:
- `project-create-page.tsx` - `mutations.ts`에서 직접 import

```typescript
// 변경 후
import { createProject, createInitialProjectSteps } from "~/features/projects/mutations";
```

### 3. ✅ `users/queries.ts`의 사용되지 않는 함수들 수정

**수정된 함수들** (13개):
- `getProfileActivityMetrics` - `client` 파라미터 추가
- `getProfileWorkspacePreferences` - `client` 파라미터 추가
- `getProfileProjects` - `client` 파라미터 추가
- `getProfileBillingPlan` - `client` 파라미터 추가
- `getProfilePaymentMethods` - `client` 파라미터 추가
- `getProfileInvoices` - `client` 파라미터 추가
- `getProfileBillingNotice` - `client` 파라미터 추가
- `getProfileFollows` - `client` 파라미터 추가
- `getProfileFollowers` - `client` 파라미터 추가
- `getProfileNotifications` - `client` 파라미터 추가
- `getUnreadNotificationCount` - `client` 파라미터 추가
- `getMessageThreads` - `client` 파라미터 추가
- `getMessageEntries` - `client` 파라미터 추가

**변경 예시**:
```typescript
// 변경 전
export async function getProfileProjects(profileId: string, limit: number = 4) {
  const { data, error } = await client.from("projects")...

// 변경 후
export async function getProfileProjects(
  client: SupabaseClient<Database>,
  profileId: string,
  limit: number = 4
) {
  const { data, error } = await client.from("projects")...
```

## 체크리스트

- [x] `mutations.ts` 파일 생성
- [x] Mutations 함수들 이동
- [x] `queries.ts`에서 re-export
- [x] `getLoggedInUserId` 함수 추가
- [x] `getLoggedInProfileId` 함수 추가
- [x] `project-create-page.tsx` 리팩토링
- [x] `project-status-action.tsx` 리팩토링
- [x] 나머지 action/loader에 `getLoggedInUserId` 적용
  - [x] `subscribe-action.tsx` - `getLoggedInProfileId` 적용
  - [x] `dashboard-page.tsx` - 선택적 인증으로 `getLoggedInProfileId` 적용
  - [x] `profile-page.tsx` - 선택적 인증으로 `getLoggedInProfileId` 적용
  - [x] `project-list-page.tsx` - 선택적 인증으로 `getLoggedInProfileId` 적용
- [x] Import 경로 정리
  - [x] `project-create-page.tsx` - `mutations.ts`에서 직접 import
- [x] 사용되지 않는 함수들 정리
  - [x] `users/queries.ts`의 13개 함수에 `client` 파라미터 추가

## 참고

- [8.0 Create Post Page 문서](../참고강의/8.0-create-post-page.md)
- Mutations 분리는 선택사항이지만 코드베이스가 커질수록 유용함
- `getLoggedInUserId`는 반드시 적용 권장 (코드 중복 제거 효과 큼)


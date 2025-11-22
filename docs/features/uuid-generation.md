# UUID 생성 기능 문서

## 개요

폼 제출 시 유저 이름과 날짜 정보를 기반으로 결정론적 UUID를 생성하는 기능입니다. UUID v5를 사용하여 동일한 입력값에 대해 항상 같은 UUID를 생성합니다.

## 구현 위치

- **유틸리티 함수**: `app/lib/uuid-utils.ts`
- **사용 컴포넌트**: `app/common/components/chat-form.tsx`
- **적용 페이지**: `app/common/pages/home-page.tsx`

## 주요 함수

### `generateUUIDFromUserAndDate()`

유저 이름, 날짜, 추가 데이터를 조합하여 UUID v5를 생성합니다.

```typescript
function generateUUIDFromUserAndDate(
  userName: string,
  date: Date | string,
  additionalData?: string
): string;
```

**파라미터:**

- `userName`: 유저 이름 또는 유저 ID
- `date`: 날짜 정보 (Date 객체 또는 ISO 문자열)
- `additionalData`: 추가 데이터 (선택사항, 메시지 내용 등)

**반환값:**

- UUID 문자열 (예: `"550e8400-e29b-41d4-a716-446655440000"`)

**예시:**

```typescript
const uuid = generateUUIDFromUserAndDate("홍길동", new Date(), "안녕하세요");
```

### `generateProjectUUID()`

프로젝트 생성용 UUID를 생성합니다. 유저 이름, 현재 날짜, 메시지 해시를 조합합니다.

```typescript
function generateProjectUUID(userName: string, message?: string): string;
```

**파라미터:**

- `userName`: 유저 이름
- `message`: 메시지 내용 (선택사항)

**반환값:**

- 프로젝트 UUID 문자열

**예시:**

```typescript
const projectId = generateProjectUUID("홍길동", "프로젝트 설명");
```

### `getCurrentUserName()`

현재 유저 이름을 가져옵니다. 현재는 localStorage를 확인하거나 기본값을 반환합니다.

```typescript
function getCurrentUserName(): string;
```

**반환값:**

- 유저 이름 문자열 (기본값: "anonymous")

**현재 구현:**

- localStorage에서 `userName` 키 확인
- 없으면 "anonymous" 반환

**향후 개선:**

- Supabase Auth에서 유저 정보 가져오기
- 세션에서 유저 이름 가져오기
- 프로필 정보에서 유저 이름 가져오기

## 작동 방식

### 1. UUID v5 알고리즘

UUID v5는 SHA-1 해시 기반의 결정론적 UUID 생성 알고리즘입니다:

1. **네임스페이스**: 프로젝트 전용 DNS 네임스페이스 사용

   ```typescript
   const UUID_NAMESPACE = "6ba7b810-9dad-11d1-80b4-00c04fd430c8";
   ```

2. **입력 문자열 생성**: 유저 이름, 날짜, 추가 데이터를 조합

   ```typescript
   const inputString = `${userName}:${dateString}:${additionalData}`;
   ```

3. **UUID 생성**: 네임스페이스와 입력 문자열을 SHA-1 해시하여 UUID 생성
   ```typescript
   return uuidv5(inputString, UUID_NAMESPACE);
   ```

### 2. ChatForm에서의 사용

`ChatForm` 컴포넌트에서 폼 제출 시 자동으로 UUID를 생성합니다:

```typescript
const submitCurrent = React.useCallback(async () => {
  const trimmed = value.trim();
  if (!trimmed) return;

  // 유저 이름과 날짜 정보를 기반으로 UUID 생성
  const userName = getCurrentUserName();
  const projectId = generateProjectUUID(userName, trimmed);

  const payload: ChatFormData = {
    message: trimmed,
    images,
    aspectRatio,
    projectId, // 생성된 프로젝트 UUID 포함
  };

  await onSubmit(payload);
  // ...
}, [value, images, aspectRatio, onSubmit]);
```

### 3. 데이터 흐름

```
사용자 입력
  ↓
ChatForm 제출
  ↓
getCurrentUserName() → 유저 이름 가져오기
  ↓
generateProjectUUID() → UUID 생성
  ↓
ChatFormData에 projectId 포함
  ↓
onSubmit 콜백 호출
  ↓
HomePage에서 FormData에 projectId 추가
  ↓
서버로 전송
```

## ChatFormData 타입

```typescript
export type ChatFormData = {
  message: string;
  images: File[];
  aspectRatio: AspectRatioOption;
  projectId?: string; // 생성된 프로젝트 UUID
};
```

## 특징

### 장점

1. **결정론적**: 동일한 입력값이면 항상 같은 UUID 생성
2. **표준 준수**: UUID v5 표준 형식 준수
3. **고유성 보장**: 유저 이름 + 날짜 + 메시지 조합으로 충돌 가능성 최소화
4. **재현 가능**: 같은 조건에서 같은 UUID 생성 가능

### 제한사항

1. **유저 이름 의존**: 현재는 localStorage 또는 기본값 사용
2. **타임스탬프 정밀도**: 같은 초 내 제출 시 충돌 가능성 (메시지 해시로 완화)
3. **인증 시스템 미연동**: 실제 유저 정보와 연동 필요

## 사용 예시

### 기본 사용

```typescript
import { generateProjectUUID, getCurrentUserName } from "~/lib/uuid-utils";

// 폼 제출 시
const userName = getCurrentUserName();
const projectId = generateProjectUUID(userName, "프로젝트 설명");
console.log(projectId); // "550e8400-e29b-41d4-a716-446655440000"
```

### 커스텀 날짜 사용

```typescript
import { generateUUIDFromUserAndDate } from "~/lib/uuid-utils";

const uuid = generateUUIDFromUserAndDate(
  "홍길동",
  new Date("2024-01-15T10:30:00Z"),
  "추가 데이터"
);
```

## 향후 개선 사항

### 1. 인증 시스템 연동

```typescript
export async function getCurrentUserName(): Promise<string> {
  // Supabase Auth에서 유저 정보 가져오기
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    // 프로필 정보에서 이름 가져오기
    const profile = await getProfile(user.id);
    return profile?.name || user.email?.split("@")[0] || "anonymous";
  }
  return "anonymous";
}
```

### 2. 타임스탬프 정밀도 향상

밀리초 단위까지 포함하여 충돌 가능성 더욱 감소:

```typescript
const now = new Date();
const timestamp = now.toISOString(); // 이미 밀리초 포함
```

### 3. 메시지 해시 개선

전체 메시지를 해시하여 더 고유한 UUID 생성:

```typescript
import { createHash } from "crypto";

const messageHash = createHash("sha256")
  .update(message)
  .digest("hex")
  .slice(0, 16);
```

### 4. 에러 처리

유저 이름을 가져오지 못한 경우의 처리:

```typescript
try {
  const userName = await getCurrentUserName();
  if (!userName || userName === "anonymous") {
    // 로그인 요청 또는 기본값 사용
  }
} catch (error) {
  console.error("유저 이름 가져오기 실패:", error);
  // 기본값 사용
}
```

## 관련 파일

- `app/lib/uuid-utils.ts` - UUID 생성 유틸리티 함수
- `app/common/components/chat-form.tsx` - ChatForm 컴포넌트
- `app/common/pages/home-page.tsx` - 홈페이지 (폼 제출 처리)
- `package.json` - uuid 패키지 의존성

## 참고 자료

- [UUID v5 스펙 (RFC 4122)](https://tools.ietf.org/html/rfc4122)
- [uuid npm 패키지](https://www.npmjs.com/package/uuid)

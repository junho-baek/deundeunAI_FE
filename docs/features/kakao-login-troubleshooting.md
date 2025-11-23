# 카카오 로그인 문제 해결 가이드

카카오 로그인에서 발생할 수 있는 문제들을 진단하고 해결하는 가이드입니다.

## 🔍 문제 진단 체크리스트

### 1. Supabase 설정 확인

#### ✅ Kakao Provider 활성화 확인
1. Supabase Dashboard > **Authentication** > **Providers**
2. **Kakao** 프로바이더가 **활성화**되어 있는지 확인
3. 토글이 **ON** 상태인지 확인

#### ✅ Client ID 확인
- **Client ID**: Kakao Developers의 **REST API 키**가 정확히 입력되었는지 확인
- 공백이나 특수문자가 포함되지 않았는지 확인

#### ✅ Client Secret 확인
- **Client Secret**: Kakao Developers의 **Client Secret**이 정확히 입력되었는지 확인
- Client Secret이 보이지 않으면 **"Client Secret 코드 발급"** 버튼 클릭하여 생성

### 2. Kakao Developers 설정 확인

#### ✅ Redirect URI 확인
1. Kakao Developers > **제품 설정** > **카카오 로그인** > **Redirect URI**
2. 다음 URI가 정확히 등록되어 있는지 확인:
   ```
   https://[YOUR-SUPABASE-PROJECT-ID].supabase.co/auth/v1/callback
   ```
3. **프로젝트 ID**가 정확한지 확인 (Supabase Dashboard URL에서 확인 가능)
4. `http://`와 `https://` 구분 확인
5. URI 끝에 슬래시(`/`)가 없는지 확인

#### ✅ 플랫폼 설정 확인
1. Kakao Developers > **앱 설정** > **플랫폼**
2. **Web 플랫폼**이 등록되어 있는지 확인
3. **사이트 도메인**이 올바르게 설정되었는지 확인:
   - 개발 환경: `http://localhost:5173`
   - 프로덕션: 실제 도메인

#### ✅ 카카오 로그인 활성화 확인
1. Kakao Developers > **제품 설정** > **카카오 로그인**
2. **활성화 설정** 토글이 **ON**인지 확인

### 3. 코드 확인

#### ✅ 라우트 설정 확인
`app/routes.ts` 파일에서 카카오 로그인 라우트가 올바르게 설정되어 있는지 확인:

```typescript
...prefix("/auth", [
  layout("features/auth/layouts/auth-layout.tsx", [
    route("login", "features/auth/pages/login-page.tsx"),
    route("join", "features/auth/pages/join-page.tsx"),
  ]),
  // 소셜 로그인 라우트
  ...prefix("social", [
    ...prefix(":provider", [
      route("start", "features/auth/pages/social-start-page.tsx"),
      route("complete", "features/auth/pages/social-complete-page.tsx"),
    ]),
  ]),
]),
```

#### ✅ Provider Enum 확인
`app/features/auth/pages/social-start-page.tsx`와 `social-complete-page.tsx`에서:

```typescript
const paramsSchema = z.object({
  provider: z.enum(["google", "kakao", "github"]), // "kakao"가 포함되어 있는지 확인
});
```

### 4. 트리거 확인

#### ✅ 트리거 실행 확인
Supabase SQL Editor에서 다음 쿼리 실행:

```sql
SELECT * FROM pg_trigger WHERE tgname = 'user_to_profile_trigger';
```

트리거가 없으면 `app/sql/triggers/user_to_profile_trigger.sql` 파일을 실행하세요.

#### ✅ 트리거 함수 확인
```sql
SELECT proname, prosrc 
FROM pg_proc 
WHERE proname = 'handle_new_user';
```

함수가 존재하는지 확인하세요.

## 🐛 일반적인 에러 및 해결 방법

### 에러 1: "잘못된 리디렉션 URI입니다"

**증상**: 카카오 로그인 버튼 클릭 시 "잘못된 리디렉션 URI입니다" 오류 발생

**원인**:
- Kakao Developers에 등록된 Redirect URI와 Supabase의 Redirect URI가 일치하지 않음

**해결 방법**:
1. Supabase Dashboard > **Authentication** > **URL Configuration**에서 **Site URL** 확인
2. Supabase Redirect URI 확인: `https://[PROJECT-ID].supabase.co/auth/v1/callback`
3. Kakao Developers > **카카오 로그인** > **Redirect URI**에 정확히 동일한 URI 등록
4. 공백이나 특수문자가 없는지 확인
5. **저장** 후 다시 시도

### 에러 2: "Client Secret이 필요합니다"

**증상**: Supabase에서 "Client Secret이 필요합니다" 오류 발생

**원인**:
- Kakao Developers에서 Client Secret이 발급되지 않았거나 입력되지 않음

**해결 방법**:
1. Kakao Developers > **앱 설정** > **앱 키**로 이동
2. **Client Secret**이 보이지 않으면 **"Client Secret 코드 발급"** 버튼 클릭
3. 생성된 Client Secret을 복사
4. Supabase Dashboard > **Authentication** > **Providers** > **Kakao**에 입력
5. **저장** 후 다시 시도

### 에러 3: "OAuth URL이 생성되지 않았습니다"

**증상**: 로그인 버튼 클릭 시 아무 반응이 없거나 에러 발생

**원인**:
- Supabase에서 Kakao Provider가 활성화되지 않음
- Client ID 또는 Client Secret이 잘못 입력됨

**해결 방법**:
1. Supabase Dashboard > **Authentication** > **Providers** > **Kakao** 확인
2. **Enable Kakao** 토글이 **ON**인지 확인
3. **Client ID**와 **Client Secret**이 올바르게 입력되었는지 확인
4. 브라우저 콘솔에서 에러 메시지 확인
5. **저장** 후 다시 시도

### 에러 4: "세션 교환 실패"

**증상**: 카카오 로그인 후 "세션 교환 실패" 오류 발생

**원인**:
- 인증 코드가 만료되었거나 잘못됨
- Supabase 설정 문제

**해결 방법**:
1. 브라우저 콘솔에서 상세 에러 메시지 확인
2. Supabase Dashboard > **Authentication** > **Logs**에서 에러 로그 확인
3. Kakao Developers 설정 재확인
4. 다시 로그인 시도

### 에러 5: "프로필이 생성되지 않음"

**증상**: 로그인은 성공했지만 `profiles` 테이블에 레코드가 없음

**원인**:
- `user_to_profile_trigger` 트리거가 실행되지 않음
- 트리거 함수에 오류가 있음

**해결 방법**:
1. Supabase SQL Editor에서 트리거 확인:
   ```sql
   SELECT * FROM pg_trigger WHERE tgname = 'user_to_profile_trigger';
   ```
2. 트리거가 없으면 `app/sql/triggers/user_to_profile_trigger.sql` 실행
3. `auth.users` 테이블에 사용자가 생성되었는지 확인:
   ```sql
   SELECT * FROM auth.users ORDER BY created_at DESC LIMIT 5;
   ```
4. Supabase Dashboard > **Logs** > **Postgres Logs**에서 트리거 실행 로그 확인
5. 트리거 함수에 오류가 있는지 확인:
   ```sql
   SELECT proname, prosrc FROM pg_proc WHERE proname = 'handle_new_user';
   ```

### 에러 6: "설정하지 않은 카카오 로그인 동의 항목을 포함해 인가 코드를 요청했습니다"

**증상**: 카카오 로그인 시 "설정하지 않은 동의 항목: account_email" 오류 발생

**원인**:
- Kakao Developers에서 이메일 동의 항목을 설정하지 않았는데, Supabase가 이메일을 요청함

**해결 방법**:
1. **옵션 1**: Kakao Developers에서 이메일 동의 항목 활성화
   - Kakao Developers > **제품 설정** > **카카오 로그인** > **동의 항목**
   - **카카오계정(이메일)** 선택 동의 활성화
   - **저장** 후 다시 시도

2. **옵션 2**: 이메일 없이 작동하도록 설정 (현재 구현됨)
   - `user_to_profile_trigger.sql` 트리거가 이미 적용되어 있으면 이메일 없이도 작동
   - 이메일이 없을 경우 자동으로 `kakao-{user_id}@kakao.local` 형식의 대체 이메일 생성

## 🔧 디버깅 방법

### 1. 브라우저 콘솔 확인

카카오 로그인 버튼 클릭 후 브라우저 개발자 도구(F12) > **Console** 탭에서 에러 메시지 확인:

```javascript
// 예상되는 로그 메시지:
[kakao] OAuth 시작 실패: ...
[kakao] 세션 교환 실패: ...
```

### 2. Supabase Logs 확인

Supabase Dashboard > **Logs** > **Postgres Logs**에서 트리거 실행 로그 확인:

```sql
-- 트리거 실행 로그 확인
SELECT * FROM pg_stat_statements WHERE query LIKE '%handle_new_user%';
```

### 3. Network 탭 확인

브라우저 개발자 도구 > **Network** 탭에서:
1. `/auth/social/kakao/start` 요청 확인
2. 카카오 OAuth URL로 리다이렉트되는지 확인
3. `/auth/social/kakao/complete` 콜백 요청 확인
4. 각 요청의 응답 상태 코드 확인 (200, 302, 400, 500 등)

### 4. Supabase Authentication Logs 확인

Supabase Dashboard > **Authentication** > **Logs**에서:
- OAuth 요청 로그 확인
- 에러 메시지 확인
- 사용자 생성 로그 확인

## 📝 체크리스트

카카오 로그인 문제 해결을 위한 체크리스트:

- [ ] Supabase에서 Kakao Provider 활성화됨
- [ ] Supabase에 Client ID (REST API 키) 입력됨
- [ ] Supabase에 Client Secret 입력됨
- [ ] Kakao Developers에 Redirect URI 등록됨
- [ ] Redirect URI가 Supabase 콜백 URL과 정확히 일치함
- [ ] Kakao Developers에 Web 플랫폼 등록됨
- [ ] Kakao Developers에서 카카오 로그인 활성화됨
- [ ] `user_to_profile_trigger.sql` 트리거 실행됨
- [ ] 라우트 설정이 올바름 (`app/routes.ts`)
- [ ] Provider enum에 "kakao" 포함됨
- [ ] 브라우저 콘솔에 에러 없음
- [ ] Supabase Logs에 에러 없음

## 🆘 여전히 문제가 해결되지 않으면

1. **에러 메시지 전체 복사**: 브라우저 콘솔, Supabase Logs, Network 탭의 에러 메시지
2. **설정 스크린샷**: Supabase Dashboard 설정, Kakao Developers 설정
3. **환경 정보**: 개발 환경인지 프로덕션 환경인지, 브라우저 종류 및 버전
4. **재현 단계**: 문제가 발생하는 정확한 단계

이 정보들을 함께 제공하면 더 정확한 진단이 가능합니다.


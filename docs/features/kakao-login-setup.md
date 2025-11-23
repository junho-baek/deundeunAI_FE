# 카카오 로그인 설정 가이드

이 문서는 든든AI 프로젝트에 카카오 소셜 로그인을 설정하는 상세한 가이드를 제공합니다.

## 📋 목차

1. [Kakao Developers 설정](#1-kakao-developers-설정)
2. [Supabase 설정](#2-supabase-설정)
3. [환경변수 설정](#3-환경변수-설정)
4. [테스트](#4-테스트)
5. [문제 해결](#5-문제-해결)

---

## 1. Kakao Developers 설정

### 1.1 애플리케이션 등록

1. [Kakao Developers](https://developers.kakao.com/)에 접속
2. **"내 애플리케이션"** 메뉴 클릭
3. **"애플리케이션 추가하기"** 클릭
4. 필수 정보 입력:
   - **앱 이름**: `든든AI` (또는 원하는 이름)
   - **사업자명**: (개인 개발자인 경우 본인 이름)
5. **"저장"** 클릭

### 1.2 플랫폼 설정

1. 생성된 애플리케이션 클릭
2. 왼쪽 메뉴에서 **"앱 설정"** > **"플랫폼"** 선택
3. **"Web 플랫폼 등록"** 클릭
4. **사이트 도메인** 입력:
   ```
   http://localhost:5173
   ```
   (개발 환경용, 프로덕션에서는 실제 도메인 추가)
5. **"저장"** 클릭

### 1.3 카카오 로그인 활성화

1. 왼쪽 메뉴에서 **"제품 설정"** > **"카카오 로그인"** 선택
2. **"활성화 설정"** 토글을 **ON**으로 변경
3. **"동의 항목"** 탭 클릭
4. 필수 동의 항목 설정:
   - **닉네임**: 필수 동의
   - **프로필 사진**: 선택 동의 (권장)
   - **카카오계정(이메일)**: 선택 동의 (이메일 없이도 작동 가능)
     > ⚠️ **참고**: 이메일 동의 항목을 설정하지 않아도 로그인이 가능합니다. 이메일이 없을 경우 자동으로 대체 이메일(`kakao-{user_id}@kakao.local`)이 생성됩니다.
5. **"저장"** 클릭

### 1.4 Redirect URI 설정

1. **"카카오 로그인"** 메뉴에서 **"Redirect URI"** 섹션 찾기
2. **"Redirect URI 등록"** 클릭
3. 다음 URI 추가:
   ```
   https://[YOUR-SUPABASE-PROJECT-ID].supabase.co/auth/v1/callback
   ```
   > ⚠️ **중요**: `[YOUR-SUPABASE-PROJECT-ID]`는 실제 Supabase 프로젝트 ID로 교체해야 합니다.
   >
   > 예시: `https://abcdefghijklmnop.supabase.co/auth/v1/callback`
4. **"저장"** 클릭

### 1.5 REST API 키 확인

1. **"앱 설정"** > **"앱 키"** 메뉴로 이동
2. **REST API 키**를 복사해두세요 (나중에 Supabase에 입력)
   > ⚠️ **참고**: Supabase는 REST API 키를 Client ID로 사용합니다.

---

## 2. Supabase 설정

### 2.1 Supabase 프로젝트 접속

1. [Supabase Dashboard](https://app.supabase.com/)에 접속
2. 프로젝트 선택 (없으면 새로 생성)

### 2.2 Authentication 설정

1. 왼쪽 메뉴에서 **"Authentication"** 클릭
2. 상단 탭에서 **"Providers"** 선택
3. **"Kakao"** 프로바이더 찾기
4. **"Enable Kakao"** 토글 활성화

### 2.3 Kakao OAuth 정보 입력

다음 정보를 입력합니다:

- **Client ID (for OAuth)**: Kakao Developers에서 복사한 **REST API 키**
- **Client Secret (for OAuth)**: Kakao Developers의 **"앱 설정"** > **"앱 키"**에서 **"Client Secret"** 확인
  > ⚠️ **참고**: Client Secret이 보이지 않으면 **"Client Secret 코드 발급"** 버튼을 클릭하여 생성해야 합니다.

### 2.4 Redirect URL 확인

Supabase가 자동으로 생성한 Redirect URL을 확인합니다:

```
https://[YOUR-SUPABASE-PROJECT-ID].supabase.co/auth/v1/callback
```

이 URL을 Kakao Developers의 **"Redirect URI"**에 추가했는지 확인하세요.

### 2.5 저장

**"Save"** 버튼을 클릭하여 설정을 저장합니다.

---

## 3. 환경변수 설정

카카오 로그인은 Supabase를 통해 처리되므로 별도의 환경변수가 필요하지 않습니다. Supabase 클라이언트 설정만 확인하면 됩니다.

### 3.1 Supabase 환경변수 확인

`.env` 파일에 다음 변수가 설정되어 있는지 확인:

```env
VITE_SUPABASE_URL=https://[YOUR-SUPABASE-PROJECT-ID].supabase.co
VITE_SUPABASE_ANON_KEY=[YOUR-SUPABASE-ANON-KEY]
```

서버 사이드에서는:

```env
SUPABASE_URL=https://[YOUR-SUPABASE-PROJECT-ID].supabase.co
SUPABASE_ANON_KEY=[YOUR-SUPABASE-ANON-KEY]
```

---

## 4. 테스트

### 4.1 로컬 환경에서 테스트

1. 개발 서버 실행:

   ```bash
   npm run dev
   ```

2. 브라우저에서 `http://localhost:5173/auth/login` 접속

3. **"Kakao로 수익 컨텐츠 제작하기"** 버튼 클릭

4. 카카오 로그인 화면으로 리다이렉트되는지 확인

5. 카카오 계정으로 로그인

6. 성공적으로 로그인되고 홈으로 리다이렉트되는지 확인

### 4.2 프로필 정보 확인

로그인 후 다음을 확인:

1. **프로필 정보**:
   - `name`: 카카오 닉네임
   - `slug`: `preferred_username` 또는 자동 생성된 slug
   - `avatar_url`: 카카오 프로필 사진 URL
   - `email`: 카카오 계정 이메일

2. **데이터베이스 확인**:
   - Supabase Dashboard > **"Table Editor"** > **"profiles"** 테이블
   - 새로 생성된 프로필 레코드 확인
   - `auth_user_id`가 올바르게 설정되었는지 확인

---

## 5. 문제 해결

### 5.1 "잘못된 리디렉션 URI" 오류

**증상**: 카카오 로그인 시 "잘못된 리디렉션 URI입니다" 오류 발생

**해결 방법**:

1. Kakao Developers > **"카카오 로그인"** > **"Redirect URI"** 확인
2. Supabase Redirect URI (`https://[PROJECT-ID].supabase.co/auth/v1/callback`)가 정확히 등록되었는지 확인
3. URI에 공백이나 특수문자가 없는지 확인
4. **"저장"** 후 다시 시도

### 5.2 "Client Secret이 필요합니다" 오류

**증상**: Supabase에서 "Client Secret이 필요합니다" 오류 발생

**해결 방법**:

1. Kakao Developers > **"앱 설정"** > **"앱 키"**로 이동
2. **"Client Secret"**이 보이지 않으면 **"Client Secret 코드 발급"** 클릭
3. 생성된 Client Secret을 Supabase에 입력
4. **"저장"** 후 다시 시도

### 5.3 프로필이 생성되지 않음

**증상**: 로그인은 성공했지만 `profiles` 테이블에 레코드가 없음

**해결 방법**:

1. `user_to_profile_trigger.sql` 트리거가 실행되었는지 확인:
   ```sql
   SELECT * FROM pg_trigger WHERE tgname = 'user_to_profile_trigger';
   ```
2. 트리거가 없으면 SQL Editor에서 실행:
   ```sql
   -- app/sql/triggers/user_to_profile_trigger.sql 파일 내용 실행
   ```
3. `auth.users` 테이블에 새 사용자가 생성되었는지 확인:
   ```sql
   SELECT * FROM auth.users ORDER BY created_at DESC LIMIT 5;
   ```
4. 트리거 로그 확인 (Supabase Logs)

### 5.4 프로필 정보가 누락됨

**증상**: 프로필은 생성되었지만 `name`, `avatar_url` 등이 NULL

**해결 방법**:

1. Kakao Developers > **"제품 설정"** > **"카카오 로그인"** > **"동의 항목"** 확인
2. **"닉네임"**, **"프로필 사진"**, **"카카오계정(이메일)"** 동의 항목이 활성화되어 있는지 확인
3. `user_to_profile_trigger.sql`의 카카오 처리 로직 확인:
   - `raw_user_meta_data ->> 'name'` 추출
   - `raw_user_meta_data ->> 'preferred_username'` 추출
   - `raw_user_meta_data ->> 'avatar_url'` 추출

### 5.5 "프로바이더를 찾을 수 없습니다" 오류

**증상**: `social-start-page.tsx`에서 "프로바이더를 찾을 수 없습니다" 오류

**해결 방법**:

1. `app/features/auth/pages/social-start-page.tsx` 파일 확인
2. `paramsSchema`에 `"kakao"`가 포함되어 있는지 확인:
   ```typescript
   const paramsSchema = z.object({
     provider: z.enum(["google", "kakao", "github"]),
   });
   ```
3. 라우트 설정 확인 (`app/routes.ts`)

---

## 6. 추가 참고사항

### 6.1 카카오 로그인 동의 항목

카카오 로그인 시 다음 정보를 수집할 수 있습니다:

- **필수 동의**:
  - 닉네임 (`name`)

- **선택 동의**:
  - 카카오계정(이메일) (`email`) - **이메일 없이도 작동 가능**
  - 프로필 사진 (`avatar_url`)
  - 생년월일
  - 성별
  - 연령대

> ⚠️ **주의**:
>
> - 개인정보보호법에 따라 필요한 최소한의 정보만 수집하도록 설정하세요.
> - **이메일 동의 항목을 설정하지 않아도 로그인이 가능합니다.** 이메일이 없을 경우 자동으로 대체 이메일(`kakao-{user_id}@kakao.local`)이 생성됩니다.
> - 이메일이 필요한 기능(비밀번호 재설정 등)을 사용하려면 이메일 동의 항목을 활성화하는 것을 권장합니다.

### 6.2 프로필 자동 생성

`user_to_profile_trigger.sql` 트리거가 자동으로 프로필을 생성합니다:

- **Kakao 로그인 시**:
  - `name`: 카카오 닉네임
  - `slug`: `preferred_username` 또는 자동 생성
  - `avatar_url`: 카카오 프로필 사진 URL
  - `email`: 카카오 계정 이메일
  - `role`: `creator` (기본값)
  - `status`: `invited` (기본값)
  - 기타 필드: 기본값으로 설정

### 6.3 프로덕션 배포 시 주의사항

1. **Redirect URI 추가**:
   - 프로덕션 도메인을 Kakao Developers에 등록
   - 프로덕션 Supabase Redirect URI 추가

2. **앱 키 보안**:
   - Client Secret을 환경변수로 관리
   - Git에 커밋하지 않도록 주의

3. **동의 항목 재심사**:
   - 프로덕션 배포 전 카카오 동의 항목 재심사 신청 필요

---

## 7. 체크리스트

카카오 로그인 설정 완료 체크리스트:

- [ ] Kakao Developers 애플리케이션 등록 완료
- [ ] Web 플랫폼 등록 완료
- [ ] 카카오 로그인 활성화 완료
- [ ] 동의 항목 설정 완료 (닉네임, 이메일 필수)
- [ ] Redirect URI 등록 완료 (Supabase 콜백 URL)
- [ ] REST API 키 확인 완료
- [ ] Client Secret 발급 완료
- [ ] Supabase에서 Kakao Provider 활성화 완료
- [ ] Supabase에 Client ID (REST API 키) 입력 완료
- [ ] Supabase에 Client Secret 입력 완료
- [ ] 로컬 환경에서 테스트 완료
- [ ] 프로필 자동 생성 확인 완료
- [ ] 프로덕션 Redirect URI 등록 완료 (배포 시)

---

## 8. 관련 문서

- [Google 로그인 설정 가이드](./google-login-setup.md)
- [소셜 로그인 트리거 문서](../참고강의/7.8-social-login-triggers.md)
- [Supabase Authentication 문서](https://supabase.com/docs/guides/auth)

---

**작성일**: 2024년
**최종 수정일**: 2024년

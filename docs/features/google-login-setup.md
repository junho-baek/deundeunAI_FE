# 구글 로그인 설정 가이드

이 문서는 든든AI 프로젝트에 구글 소셜 로그인을 설정하는 상세한 가이드를 제공합니다.

## 📋 목차

1. [Google Cloud Console 설정](#1-google-cloud-console-설정)
2. [Supabase 설정](#2-supabase-설정)
3. [환경변수 설정](#3-환경변수-설정)
4. [테스트](#4-테스트)
5. [문제 해결](#5-문제-해결)

---

## 1. Google Cloud Console 설정

### 1.1 프로젝트 생성

1. [Google Cloud Console](https://console.cloud.google.com/)에 접속
2. 상단 프로젝트 선택 드롭다운 클릭
3. **"새 프로젝트"** 클릭
4. 프로젝트 이름 입력 (예: `든든AI`)
5. **"만들기"** 클릭

### 1.2 OAuth 동의 화면 설정

1. 왼쪽 메뉴에서 **"API 및 서비스"** > **"OAuth 동의 화면"** 선택
2. **"외부"** 선택 후 **"만들기"** 클릭
3. 필수 정보 입력:
   - **앱 이름**: `든든AI` (또는 원하는 이름)
   - **사용자 지원 이메일**: 본인 이메일
   - **앱 로고**: (선택사항)
   - **앱 도메인**: (개발 중에는 비워둬도 됨)
   - **개발자 연락처 정보**: 본인 이메일
4. **"저장 후 계속"** 클릭
5. **"범위"** 화면에서 **"저장 후 계속"** 클릭 (기본 범위만 사용)
6. **"테스트 사용자"** 화면에서 (선택사항) 테스트 이메일 추가
7. **"대시보드로 돌아가기"** 클릭

### 1.3 OAuth 2.0 클라이언트 ID 생성

1. 왼쪽 메뉴에서 **"API 및 서비스"** > **"사용자 인증 정보"** 선택
2. 상단 **"+ 사용자 인증 정보 만들기"** 클릭
3. **"OAuth 클라이언트 ID"** 선택
4. **애플리케이션 유형**: **"웹 애플리케이션"** 선택
5. **이름**: `든든AI Web Client` (또는 원하는 이름)
6. **승인된 자바스크립트 원본**:
   ```
   http://localhost:5173
   ```
   (개발 환경용, 프로덕션에서는 실제 도메인 추가)
7. **승인된 리디렉션 URI**:
   ```
   https://[YOUR-SUPABASE-PROJECT-ID].supabase.co/auth/v1/callback
   ```
   > ⚠️ **중요**: `[YOUR-SUPABASE-PROJECT-ID]`는 실제 Supabase 프로젝트 ID로 교체해야 합니다.
   >
   > 예시: `https://abcdefghijklmnop.supabase.co/auth/v1/callback`
8. **"만들기"** 클릭
9. **클라이언트 ID**와 **클라이언트 보안 비밀번호**를 복사해두세요 (나중에 Supabase에 입력)

---

## 2. Supabase 설정

### 2.1 Supabase 프로젝트 접속

1. [Supabase Dashboard](https://app.supabase.com/)에 접속
2. 프로젝트 선택 (없으면 새로 생성)

### 2.2 Authentication 설정

1. 왼쪽 메뉴에서 **"Authentication"** 클릭
2. 상단 탭에서 **"Providers"** 선택
3. **"Google"** 프로바이더 찾기
4. **"Enable Google"** 토글 활성화

### 2.3 Google OAuth 정보 입력

다음 정보를 입력합니다:

- **Client ID (for OAuth)**: Google Cloud Console에서 복사한 **클라이언트 ID**
- **Client Secret (for OAuth)**: Google Cloud Console에서 복사한 **클라이언트 보안 비밀번호**

### 2.4 Redirect URL 확인

Supabase가 자동으로 생성한 Redirect URL을 확인합니다:

```
https://[YOUR-SUPABASE-PROJECT-ID].supabase.co/auth/v1/callback
```

이 URL을 Google Cloud Console의 **"승인된 리디렉션 URI"**에 추가했는지 확인하세요.

### 2.5 저장

**"Save"** 버튼을 클릭하여 설정을 저장합니다.

---

## 3. 환경변수 설정

### 3.1 `.env` 파일 확인

프로젝트 루트에 `.env` 파일이 있는지 확인하고, 없다면 생성합니다.

### 3.2 환경변수 추가

`.env` 파일에 다음 변수들이 설정되어 있는지 확인하세요:

```bash
# Supabase 설정
SUPABASE_URL=https://[YOUR-SUPABASE-PROJECT-ID].supabase.co
SUPABASE_ANON_KEY=[YOUR-SUPABASE-ANON-KEY]
```

> ⚠️ **참고**:
>
> - `SUPABASE_URL`과 `SUPABASE_ANON_KEY`는 Supabase Dashboard의 **Settings** > **API**에서 확인할 수 있습니다.
> - `.env` 파일은 절대 Git에 커밋하지 마세요 (`.gitignore`에 포함되어 있어야 합니다).

### 3.3 개발 서버 재시작

환경변수를 변경한 경우 개발 서버를 재시작해야 합니다:

```bash
# 개발 서버 중지 (Ctrl+C)
# 그 다음 다시 시작
npm run dev
```

---

## 4. 테스트

### 4.1 로그인 페이지 접속

1. 브라우저에서 `http://localhost:5173/auth/login` 접속
2. **"Google로 수익 컨텐츠 제작하기"** 버튼이 보이는지 확인

### 4.2 구글 로그인 테스트

1. **"Google로 수익 컨텐츠 제작하기"** 버튼 클릭
2. Google 로그인 페이지로 리다이렉트되는지 확인
3. Google 계정으로 로그인
4. 권한 승인
5. 자동으로 홈 페이지(`/`)로 리다이렉트되는지 확인
6. 로그인 상태가 유지되는지 확인 (네비게이션 바에 프로필 표시)

### 4.3 예상 동작

- ✅ Google 로그인 페이지로 리다이렉트
- ✅ 로그인 후 자동으로 홈으로 리다이렉트
- ✅ 세션이 유지되어 페이지 새로고침해도 로그인 상태 유지
- ✅ 네비게이션 바에 사용자 프로필 표시

---

## 5. 문제 해결

### 5.1 "redirect_uri_mismatch" 에러

**증상**: Google 로그인 시 "redirect_uri_mismatch" 에러 발생

**원인**: Google Cloud Console의 리디렉션 URI와 Supabase의 콜백 URL이 일치하지 않음

**해결 방법**:

1. Supabase Dashboard에서 실제 콜백 URL 확인:
   - **Authentication** > **URL Configuration** > **Redirect URLs**
   - 예: `https://abcdefghijklmnop.supabase.co/auth/v1/callback`
2. Google Cloud Console에서 동일한 URL을 **"승인된 리디렉션 URI"**에 추가
3. 저장 후 다시 테스트

### 5.2 "invalid_client" 에러

**증상**: "invalid_client" 에러 발생

**원인**: Google Cloud Console의 Client ID 또는 Client Secret이 잘못됨

**해결 방법**:

1. Google Cloud Console에서 Client ID와 Client Secret 다시 확인
2. Supabase Dashboard에서 Google Provider 설정 확인
3. 값이 정확히 일치하는지 확인 (공백, 줄바꿈 없이)
4. Supabase 설정 저장 후 다시 테스트

### 5.3 로그인 후 리다이렉트되지 않음

**증상**: Google 로그인은 성공했지만 홈으로 리다이렉트되지 않음

**원인**: 콜백 URL 설정 문제 또는 세션 교환 실패

**해결 방법**:

1. 브라우저 개발자 도구의 콘솔에서 에러 확인
2. `social-complete-page.tsx`의 loader에서 에러 로그 확인
3. Supabase Dashboard의 **Authentication** > **Logs**에서 에러 확인
4. 콜백 URL이 정확한지 확인

### 5.4 "OAuth consent screen" 경고

**증상**: Google 로그인 시 "OAuth consent screen" 경고 표시

**원인**: OAuth 동의 화면이 아직 검토 중이거나 테스트 모드

**해결 방법**:

1. Google Cloud Console의 **OAuth 동의 화면**에서 상태 확인
2. 개발 중에는 **"테스트 사용자"**에 본인 이메일 추가
3. 프로덕션 배포 전에는 OAuth 동의 화면을 **"프로덕션"**으로 전환하고 Google 검토 제출

### 5.5 환경변수 인식 안 됨

**증상**: `SUPABASE_URL is required` 에러 발생

**해결 방법**:

1. `.env` 파일이 프로젝트 루트에 있는지 확인
2. 환경변수 이름이 정확한지 확인 (`SUPABASE_URL`, `SUPABASE_ANON_KEY`)
3. 개발 서버 재시작
4. Vite 캐시 삭제 후 재시작:
   ```bash
   rm -rf node_modules/.vite .vite
   npm run dev
   ```

---

## 6. 프로덕션 배포 시 주의사항

### 6.1 Google Cloud Console 설정

프로덕션 도메인을 추가해야 합니다:

1. **승인된 자바스크립트 원본**에 프로덕션 도메인 추가:

   ```
   https://yourdomain.com
   ```

2. **승인된 리디렉션 URI**는 Supabase가 자동으로 처리하므로 변경 불필요

### 6.2 OAuth 동의 화면 검토

프로덕션 배포 전에:

1. OAuth 동의 화면을 **"프로덕션"**으로 전환
2. Google 검토 제출 (필요한 경우)
3. 검토 완료까지는 테스트 사용자만 사용 가능

### 6.3 환경변수 설정

프로덕션 환경(예: Vercel, Netlify)에서도 환경변수를 설정해야 합니다:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

---

## 7. 추가 리소스

- [Supabase Google OAuth 문서](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Google OAuth 2.0 문서](https://developers.google.com/identity/protocols/oauth2)
- [React Router 문서](https://reactrouter.com/)

---

## 8. 체크리스트

구글 로그인 설정 완료 체크리스트:

- [ ] Google Cloud Console 프로젝트 생성
- [ ] OAuth 동의 화면 설정 완료
- [ ] OAuth 2.0 클라이언트 ID 생성
- [ ] Google Cloud Console에 Supabase 콜백 URL 추가
- [ ] Supabase에서 Google Provider 활성화
- [ ] Supabase에 Google Client ID/Secret 입력
- [ ] 환경변수 설정 완료
- [ ] 로그인 페이지에서 Google 버튼 표시 확인
- [ ] Google 로그인 테스트 성공
- [ ] 로그인 후 홈으로 리다이렉트 확인
- [ ] 세션 유지 확인

---

**문제가 발생하면 위의 "문제 해결" 섹션을 참고하거나, 브라우저 개발자 도구의 콘솔과 네트워크 탭에서 에러를 확인하세요.**

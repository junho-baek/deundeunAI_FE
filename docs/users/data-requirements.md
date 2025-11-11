# Users 도메인 UI 데이터 요구사항

본 문서는 `app/features/users/components` 및 관련 페이지에서 필요한 데이터 필드를 정리하여, 새로운 스키마 설계 시 필수/선택 속성과 CRUD 패턴을 명확히 하기 위한 참고용입니다.

## 1. 프로필 관련 컴포넌트

### 1.1 `ProfileSummaryCard`

- **필수 필드**
  - `id` (profile identifier)
  - `name`, `role`, `company`
  - `email`, `timezone`, `joinedAt`
  - `bio`
- **선택 필드**
  - `avatarUrl`
- **액션**
  - “프로필 편집”, “비밀번호 재설정” 버튼 → 프로필 편집/인증 모듈과 연동 예정(현재는 UI 버튼만 존재).
- **CRUD 패턴**
  - 주 사용: Read
  - 타 화면(편집 모달 등)에서 Update 필요 예상

### 1.2 `ProfilePlanActivityCard`

- **필수 필드**
  - 통계 카드 배열 `stats[]` (`label`, `value`, `helper`)
  - `planLabel`, `planDescription`
  - `nextBillingDate`
- **선택 필드**
  - `nextBillingPrefix`, `nextBillingSuffix`, `billingLinkHref`, `automationLabel`
- **액션**
  - “플랜 세부 정보 보기” 링크 (Billing 페이지)
  - “AI 자동화 설정” 버튼 (향후 자동화 설정 진입점)
- **CRUD 패턴**
  - Read 중심
  - 통계 값 갱신 → 배치/실시간 집계가 Update

### 1.3 `WorkspacePreferencesCard`

- **필수 필드**
  - `items[]` (`title`, `description`, `ctaLabel`, `order`, `enabled`)
- **액션**
  - 각 항목의 CTA 버튼 (알림 관리 등) → 해당 설정 화면으로 라우팅/토글
- **CRUD 패턴**
  - Read + Update (사용자 선호/알림 설정 변경)

### 1.4 `ProfileProjectsSection`

- **필수 필드**
  - `projects[]` (`id`, `to`, `title`, `description`)
- **선택 필드**
  - `likes`, `ctr`, `budget`, `thumbnail`
- **액션**
  - 프로젝트 카드 클릭 → 상세 페이지 이동
  - “새 프로젝트 시작하기” CTA → 프로젝트 생성 흐름
- **CRUD 패턴**
  - Read (목록 표시)
  - Create (새 프로젝트 생성 버튼)

## 2. 빌링 관련 컴포넌트

### 2.1 `BillingOverviewCard`

- **필수 필드**
  - `planTitle`, `priceLabel`
  - `renewalDateLabel`, `usageLabel`
  - `benefits[]` (plain text list)
- **선택 필드**
  - `renewalNote`, `usageHighlightLabel`, `upgradeHref`, `pauseLabel`
- **액션**
  - “업그레이드 옵션 보기” 링크 (가격/플랜 페이지)
  - “플랜 일시 정지” 버튼 (플랜 상태 토글)
- **CRUD 패턴**
  - Read
  - Update (플랜 변경/일시정지) → Billing 서비스와 연동 필요

### 2.2 `BillingPaymentMethodCard`

- **필수 필드**
  - `summaryLabel`
  - `brand`, `last4`, `holder`, `expiresLabel`
  - `billingEmail`, `autoTopupDescription`
- **선택 필드**
  - `changeMethodLabel`, `editBillingLabel`
- **액션**
  - 결제 수단 변경, 청구 정보 수정 → 결제 프로필 관리 흐름 필요
- **CRUD 패턴**
  - Read (현재 결제 수단)
  - Update (결제 수단 교체, 자동 충전 설정)

### 2.3 `BillingInvoicesCard`

- **필수 필드**
  - `items[]` (`id`, `date`, `amount`, `status`, `link`)
- **선택 필드**
  - `title`, `description`, `downloadLabel`
- **CRUD 패턴**
  - Read
  - Download (링크 제공)

### 2.4 `BillingSecurityNoticeCard`

- **필수 필드**
  - `title`, `description`
  - `messagePrefix`, `contactEmail`, `messageSuffix`
- **CRUD 패턴**
  - Read 전용 (정적 안내 텍스트)

## 3. 사이드바 (`AppSidebar`)

- 현재는 정적 라우트/아이콘 구성이며 DB 요구 없음.
- 향후 개인화(최근 프로젝트, 알림 뱃지 등) 시 `profileId` 기반 통계가 필요할 수 있음.

## 4. CRUD 요약 표

| 영역              | 읽기 | 생성              | 업데이트                 | 삭제             |
| ----------------- | ---- | ----------------- | ------------------------ | ---------------- |
| 프로필 기본 정보  | ✅   | (회원가입 시)     | ✅                       | ✅               |
| 활동 통계         | ✅   | 집계 파이프라인   | 집계 갱신                | 집계 재생성      |
| 워크스페이스 선호 | ✅   | 초기 기본값       | ✅ (토글/CTA)            | ✅               |
| 프로젝트 목록     | ✅   | ✅ (새 프로젝트)  | ✅ (프로젝트 편집)       | ✅               |
| 빌링 플랜         | ✅   | (업그레이드/구독) | ✅ (플랜 변경, 일시정지) | ✅               |
| 결제 수단         | ✅   | ✅                | ✅ (수정)                | ✅               |
| 인보이스          | ✅   | ✅ (결제 발생)    | (상태 갱신)              | (감사 목적 보존) |
| 빌링 공지         | ✅   | ✅ (운영팀 등록)  | ✅                       | ✅               |

## 5. 데이터 소스/연동 고려사항

- `user_profiles`는 Supabase `auth.users`와 FK를 갖도록 설계해 인증 정보와 일관성 확보.
- 프로젝트 도메인(`projects.ownerProfileId`)과 연동되어 있으므로, 사용자 삭제 시 프로젝트 하위 데이터 cascading 전략 필요.
- 빌링/결제 데이터는 외부 결제 게이트웨이와 동기화가 필요하며, `auto_topup_*` 필드는 실제 결제 서비스 로직과 사전 합의 필요.
- 활동 통계와 워크스페이스 선호는 대부분 UI 보조용 데이터로, 복잡도 완화를 위해 뷰 또는 materialized view로 치환 가능성 검토.

# 데이터 계약 인벤토리

전 피처(UI 페이지 및 컴포넌트)가 요구하는 데이터 필드를 정리한 문서입니다. 이후 Drizzle 스키마 설계와 서비스 계층 구현 시 참조할 수 있도록, 각 피처별로 페이지·컴포넌트에서 사용 중인 평탄화된 데이터 구조를 나열했습니다.

## Admin
- 페이지: `app/features/admin/pages/admin-dashboard-page.tsx`
  - 현재 정적인 섹션만 존재하며, 추후 시스템 메트릭·사용자 활동·승인 대기 목록 등을 주입할 예정.
  - 필요한 데이터: 요약 카드(타이틀/값/추세), 최근 활동 리스트, 경고 위젯 등.

## API
- 페이지: `app/features/api/pages/api-docs-page.tsx`
  - `endpoints[]`: `{ method, path, description }`
  - `sdks[]`: `{ name, description, docs }`
  - `webhookEvents[]`: `{ name, description }`
  - 샘플 코드/버튼 라벨 등에 들어갈 링크 값이 필요.

## Auth
- 컴포넌트: `auth-login-buttons.tsx`
  - 소셜/OTP/Magic 링크 버튼: `{ label, href, logo }`
  - 실제 구현 시 프로바이더 목록을 DB/설정에서 불러올 수 있도록 매핑 필요.
- 페이지: `login-page.tsx`, `join-page.tsx`, `logout-page.tsx`
  - 폼 필드: 이메일, 비밀번호, 이름(가입), 약관 동의 등.
  - 액션 결과 상태(오류 메시지, 이메일 미인증 상태) 및 인증 흐름 제어 플래그가 필요.

## Billing (마케팅 퍼널)
- 페이지: `subscribe-page.tsx`
  - `plan`: `{ name, price, period, description, features[] }`
  - `steps[]`: `{ title, description }`
  - CTA 링크(`/subscribe/success`, `/subscribe/fail`)용 라우팅 정보.
- 페이지: `subscribe-success-page.tsx`
  - 카드 헤드라인, 설명, CTA 링크(`/my/dashboard`, `/my/dashboard/project/create`).
- 페이지: `subscribe-fail-page.tsx`
  - 가이드 문구 리스트, 지원 이메일, 재시도 링크.

## Dashboard
- 페이지: `app/features/dashboard/pages/dashboard-page.tsx`
  - (정적 문구 위주) 향후 실시간 프로젝트/캠페인 지표, 알림 카드가 필요.

## Pricing
- 페이지: `app/features/pricing/pages/pricing-page.tsx`
  - 여러 요금제 카드(제목/가격/혜택), FAQ, CTA 링크 등.
  - 실제 요금제 테이블(`plans`, `plan_features`, `faqs`)로 정규화 예정.

## Projects
- 컴포넌트: `project-card.tsx`
  - `{ id, to, title, description?, likes?, ctr?, budget?, tiktokUrl?, videoUrl?, thumbnail?, isCreate?, ctaText? }`
  - 썸네일 URL을 TikTok/YouTube 임베드로 변환하는 유틸 포함.
- 페이지: `project-list-page.tsx`
  - 프로젝트 카드 목록(위 `ProjectCardProps`) + “새 프로젝트 생성” 카드.
- 페이지: `project-create-page.tsx`, `project-generate-page.tsx`, `project-workspace-page.tsx` 등
  - 단계별 챗봇/워크플로우 데이터: 설문 섹션, 생성 결과, 상태값 필요.
- 페이지: `project-analytics-page.tsx`
  - `ProjectAnalytics`: `{ id, title, description, thumbnail?, likes, ctr, budget, platformLinks:{youtube?,instagram?,linkedin?}, highlights[], recommendations[], metrics:{ views, likes, saves, shareRate } }`
  - `revenueChartData[]`: `{ month, actual, expected }`
  - 차트 설정(`ChartConfig`)과 variance 계산 결과(실제/예상 합계, 편차).
- 컴포넌트: `chat-init-form.tsx`
  - `sections[]`: `{ id, title, description?, options[], multiple? }`
  - `options[]`: `{ id, label, value? }`; 제출 시 `{ [sectionId]: string[] }`.
- 컴포넌트: `chat-confirm-card.tsx`
  - `{ message, mode?, primaryActionLabel?, secondaryActionLabel?, attention? }`
  - H2L(사람 검수) 플래그, 액션 핸들러 연결 필요.
- 컴포넌트: 프로젝트 생성 플로우(아코디언 계열)
  - `ProjectAccordion`: UI 래퍼.
  - `ProjectPrdProps`: `{ value, title, markdownHtml, loading?, done?, onEdit?, onDone? }`
  - `ProjectScriptProps`: `{ value, title, paragraphs[], loading?, done?, onEdit?, onDone? }`
  - `ProjectScriptAudioProps`: `{ value, title, segments[], loading?, done?, onEdit?, onDone? }` / `segments[]`: `{ id, label, src }`
  - `ProjectImageSelectProps`: `{ value, title, images[], timelines[], selected[], onToggle, onRegenerate?, onDone?, loading?, done? }`
  - `ProjectVideoSelectProps`: `{ value, title, sources[], timelines[], selected[], onToggle, onRegenerate?, onDone?, loading?, done? }`
  - `ProjectFinalVideoProps`: `{ value, title, videoSrc, headline, description, durationText, loading?, done?, onSelect?, onDone? }`
  - 공통적으로 스텝 진행 상태(loading/done), 컨트롤 핸들러, 미디어 자산 URL 필요.
- 컴포넌트: `project-analytics-chart.tsx`
  - `{ title, description?, data[], config, series[], xDataKey, yTickFormatter?, tooltipLabelFormatter?, tooltipValueFormatter?, className?, chartClassName? }`
  - `data[]`는 `Record<string, number|string>`로, `config`와 `series` 조합이 필수.

## Resources
- 컴포넌트: `resource-hero.tsx`
  - `{ badgeLabel, badgeIcon?, title, description, primaryCtaLabel?, primaryCtaHref?, primaryCtaVariant?, secondaryCtaLabel?, secondaryCtaHref?, secondaryCtaVariant?, containerMaxWidthClass?, blurHeightClass?, descriptionMaxWidthClass?, showPlaceholder?, placeholderWrapperClass?, placeholderClassName?, placeholderCaption?, placeholderCaptionClassName?, extraContent? }`
- 컴포넌트: `resource-section-header.tsx`
  - `{ title, description?, align?, eyebrow?, titleVariant?, className?, descriptionMaxWidthClass? }`
- 컴포넌트: `resource-callout.tsx`
  - `{ title, description?, align?, titleVariant?, descriptionMaxWidthClass?, containerClassName?, primaryCtaLabel?, primaryCtaHref?, primaryCtaVariant?, secondaryCtaLabel?, secondaryCtaHref?, secondaryCtaVariant?, extraContent?, footnote? }`
- 페이지: `resources-about-page.tsx`, `resources-blog-page.tsx`, `resources-free-page.tsx`, `resources-newsletter-page.tsx`
  - 각 페이지별로 Hero/Callout/SectionHeader 컴포넌트를 조합.
  - 반복 데이터 예시
    - 스타터킷 카드: `{ title, description, items[] }`
    - 단계 안내: `{ title, description }`
    - FAQ: `{ question, answer }`
    - 뉴스레터 플로우 단계, 발행 스케줄 등.

## Settings
- 페이지: `settings-index-page.tsx`
  - 설정 섹션 카드(제목/설명/CTA 링크), 알림 목록 등.
  - `users` 피처 페이지와 겹치는 데이터 (프로필, 결제) 연결 예정.

## Shorts
- 페이지: `shorts-landing-page.tsx`
  - 히어로/스텝/FAQ/추천 카드 데이터.
- 페이지: `shorts-create-page.tsx`
  - 공용 `ShortsHero` 컴포넌트 사용. `ShortsHero`는 아이디어 입력 및 CTA 제출 핸들러 필요.
  - 생성 요청 시 프로젝트 생성 라우트(`/my/dashboard/project/create`)로 이동.

## Usecases
- 레이아웃/페이지(`usecases-index-page.tsx`, `usecases-company-page.tsx`, `usecases-freelancer-page.tsx`, `usecases-senior-page.tsx`)
  - 업종별 성공 사례 카드, 특징 리스트, KPI 요약 등.
  - 공통 데이터: `{ title, description, metrics[], testimonials[], ctaHref }`.

## Users (내부 대시보드)
- 컴포넌트: `billing-sections.tsx`
  - `BillingOverviewCardProps`: `{ planTitle, priceLabel, renewalDateLabel, renewalNote?, usageLabel, usageHighlightLabel?, benefits[], upgradeHref?, upgradeLabel?, pauseLabel?, className? }`
  - `BillingPaymentMethodCardProps`: `{ summaryLabel, brand, last4, holder, expiresLabel, billingEmail, autoTopupDescription, changeMethodLabel?, editBillingLabel?, className? }`
  - `BillingInvoicesCardProps`: `{ title?, description?, items[], downloadLabel?, className? }` / `items[]`: `{ id, date, amount, status, link? }`
  - `BillingSecurityNoticeCardProps`: `{ title, description, messagePrefix, contactEmail, messageSuffix, className? }`
- 컴포넌트: `profile-sections.tsx`
  - `ProfileSummaryCardProps`: `{ cardTitle, cardDescription, name, role, company, email, timezone, joinedAt, bio, avatarUrl?, avatarFallback, editLabel?, resetPasswordLabel?, className? }`
  - `ProfilePlanActivityCardProps`: `{ cardTitle, cardDescription, stats[], planLabel, planDescription, nextBillingPrefix, nextBillingDate, nextBillingSuffix, billingLinkHref?, billingLinkLabel?, automationLabel?, className? }` / `stats[]`: `{ label, value, helper }`
  - `WorkspacePreferencesCardProps`: `{ cardTitle, cardDescription, items[], className? }` / `items[]`: `{ title, description, ctaLabel }`
  - `ProfileProjectsSectionProps`: `{ heading, description, projects[], createProjectHref, createProjectTitle, createProjectDescription, createProjectCta, className? }` / `projects[]`는 `ProjectCardProps`
- 레이아웃: `app-layout.tsx`
  - 사이드바 상태(`overlaySidebar`)를 URL 패턴으로 판단.
- 페이지
  - `profile-page.tsx`: 위 카드 컴포넌트 조합, `myProjects[]`는 `ProjectCardProps`.
  - `billing-page.tsx`: `planBenefits[]` 문자열, `upcomingBilling` `{ plan, price, renewalDate, usage }`, `paymentMethod` `{ brand, last4, holder, expires, billingEmail, autoTopup }`, `invoices[]`.
  - `messages-page.tsx`, `notifications-page.tsx`: 향후 알림/대화 목록 데이터 필요.

---

위 인벤토리는 드리즐 스키마 설계 시 참고할 핵심 필드만 포함했습니다. 다음 단계에서는 각 도메인별로 누락된 테이블/열을 정의하고, 서비스 계층에서 해당 데이터를 조립할 Mapper/DTO를 도입합니다.

